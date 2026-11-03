import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedTables = new Set(['registrations', 'contact_enquiries', 'newsletter_subscribers'])
const maxBodyLength = 20000

function response(body: unknown, status: number, origin: string | null) {
  const allowedOrigin = Deno.env.get('APP_ORIGIN')
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  })
  if (!allowedOrigin || origin === allowedOrigin) headers.set('Access-Control-Allow-Origin', allowedOrigin ?? '*')
  return new Response(JSON.stringify(body), { status, headers })
}

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM_EMAIL')
  if (!apiKey || !from) return 'not_configured'
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
    })
    return result.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  if (request.method === 'OPTIONS') return response({}, 200, origin)
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405, origin)
  const allowedOrigin = Deno.env.get('APP_ORIGIN')
  if (allowedOrigin && origin !== allowedOrigin) return response({ error: 'Origin not allowed.' }, 403, origin)

  const rawBody = await request.text()
  if (rawBody.length > maxBodyLength) return response({ error: 'Submission is too large.' }, 413, origin)

  let payload: { table?: string; values?: Record<string, unknown> }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return response({ error: 'Invalid request.' }, 400, origin)
  }
  const { table, values } = payload
  if (!table || !allowedTables.has(table) || !values || typeof values !== 'object' || Array.isArray(values)) {
    return response({ error: 'Invalid submission.' }, 400, origin)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return response({ error: 'Submission service is not configured.' }, 503, origin)
  const adminEmail = Deno.env.get('AJIS_NOTIFICATION_EMAIL')
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  let notification = 'not_configured'
  let recordId: string | undefined

  try {
    if (table === 'registrations') {
      const answers = values.answers
      if (typeof values.selected_program !== 'string' || !values.selected_program || !answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return response({ error: 'Please complete the required tuition details.' }, 400, origin)
      }
      const { data, error } = await supabase.from(table).insert({
        selected_program: String(values.selected_program).slice(0, 120),
        answers,
        status: 'new',
      }).select('id').single()
      if (error) throw error
      recordId = data.id
      const emails = [
        ...(adminEmail ? [sendEmail(adminEmail, 'New AJIS tuition application', `A tuition application was received.\n\nApplication ID: ${recordId}\nProgramme: ${String(values.selected_program).slice(0, 120)}\n\nSign in to the AJIS administration page to review learner details.`)] : []),
        ...(isEmail((answers as Record<string, unknown>).parentEmail) ? [sendEmail(String((answers as Record<string, unknown>).parentEmail), 'AJIS tuition application received', `Thank you for submitting an AJIS Tuition application. Your application has been received and the AJIS team will follow up using the contact details you provided.\n\nThis message confirms receipt of your application; it is not a booking confirmation.`)] : []),
      ]
      const outcomes = await Promise.all(emails)
      if (outcomes.length) notification = outcomes.every((outcome) => outcome === 'sent') ? 'sent' : outcomes.includes('failed') ? 'failed' : 'partially_configured'
    } else if (table === 'contact_enquiries') {
      if (typeof values.name !== 'string' || !values.name.trim() || !isEmail(values.email) || typeof values.message !== 'string' || !values.message.trim()) {
        return response({ error: 'Please provide your name, a valid email address and a message.' }, 400, origin)
      }
      const { data, error } = await supabase.from(table).insert({
        name: values.name.trim().slice(0, 180),
        email: values.email,
        service: typeof values.service === 'string' ? values.service.slice(0, 180) : '',
        message: values.message.trim().slice(0, 8000),
      }).select('id').single()
      if (error) throw error
      recordId = data.id
      if (adminEmail) notification = await sendEmail(adminEmail, 'New AJIS website enquiry', `A contact enquiry was received.\n\nName: ${values.name.trim()}\nEmail: ${values.email}\nService: ${String(values.service ?? 'Not selected')}\n\n${values.message.trim()}`)
    } else {
      if (!isEmail(values.email)) return response({ error: 'Please enter a valid email address.' }, 400, origin)
      const { error } = await supabase.from(table).upsert({ email: values.email.toLowerCase() }, { onConflict: 'email', ignoreDuplicates: true })
      if (error) throw error
      const { data, error: lookupError } = await supabase.from(table).select('unsubscribe_token').eq('email', values.email.toLowerCase()).single()
      if (lookupError) throw lookupError
      if (data?.unsubscribe_token) {
        const siteUrl = Deno.env.get('AJIS_PUBLIC_URL')
        const unsubscribe = siteUrl ? `${siteUrl.replace(/\/$/, '')}/unsubscribe?token=${data.unsubscribe_token}` : 'Contact AJIS to unsubscribe.'
        notification = await sendEmail(values.email, 'AJIS Learning Solutions updates', `Thank you for subscribing to AJIS updates.\n\nYou can unsubscribe at any time: ${unsubscribe}`)
      }
    }
    return response({ success: true, id: recordId, notification }, 201, origin)
  } catch (error) {
    console.error('Submission failed:', error)
    return response({ error: 'Your submission could not be saved. Please try again or contact AJIS directly.' }, 500, origin)
  }
})