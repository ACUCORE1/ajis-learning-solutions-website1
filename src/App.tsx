import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Download,
  Mail,
  MessageCircle,
  Menu,
  Phone,
  X,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { A11y, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'

const phone = '+44 7882 665968'
const email = 'ajis.tuition@gmail.com'
const whatsapp = 'https://wa.me/447882665968'
const logoImage = `${import.meta.env.BASE_URL}ajis-logo.png/WhatsApp%20Image%202026-10-27%20at%2011.39.37%20PM.jpeg`
const founderImage = `${import.meta.env.BASE_URL}ajis-logo.png/WhatsApp%20Image%202026-10-28%20at%203.16.24%20PM.jpeg`

let backend: SupabaseClient | null = null

function getBackend() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Online submissions are not available yet. Please contact AJIS directly by phone or email.')
  backend ??= createClient(url, key)
  return backend
}

async function submitRecord(table: string, values: Record<string, unknown>) {
  const { error } = await getBackend().functions.invoke('submit-form', { body: { table, values } })
  if (error) throw new Error(error.message)
}

const image = (id: string, width = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

const serviceList = [
  {
    number: '01',
    title: 'Educational Consultancy',
    intro: 'A thoughtful partner for your next educational step.',
    detail: 'Professional advice, planning and improvement support for schools, families, organisations and educational institutions.',
    image: 'photo-1529390079861-591de354faf5',
  },
  {
    number: '02',
    title: 'Learning Design',
    intro: 'Learning with purpose, shaped around real people.',
    detail: 'Meaningful, engaging and effective learning experiences designed for different learners and educational environments.',
    image: 'photo-1509062522246-3755977927d7',
  },
  {
    number: '03',
    title: 'Curriculum Development',
    intro: 'A clear curriculum built for meaningful progress.',
    detail: 'Support for curriculum planning, development, implementation and improvement across educational settings.',
    image: 'photo-1503676260728-1c00da094a0b',
  },
  {
    number: '04',
    title: 'Literacy Support',
    intro: 'The confidence to find your voice and move forward.',
    detail: 'Literacy-focused educational support designed around each learner and their goals.',
    image: 'photo-1503676260728-1c00da094a0b',
  },
  {
    number: '05',
    title: 'SEND Provision & Learner Support',
    intro: 'Inclusive learning, thoughtfully adapted.',
    detail: 'Inclusive approaches that support learners with special educational needs and disabilities across learning environments.',
    image: 'photo-1491013516836-7db643ee125a',
  },
  {
    number: '06',
    title: 'Training & Professional Development',
    intro: 'Practical development that stays with you.',
    detail: 'Workshops, coaching and professional development for educators, parents and community groups.',
    image: 'photo-1524178232363-1fb2b075b655',
  },
  {
    number: '07',
    title: 'Youth & Community Learning',
    intro: 'Purposeful places for young people to flourish.',
    detail: 'Youth programme development, activity planning, resource provision and learning space design for community projects.',
    image: 'photo-1529390079861-591de354faf5',
  },
  {
    number: '08',
    title: 'Early Years Learning',
    intro: 'A strong start, made for curious minds.',
    detail: 'Meaningful learning experiences for young children and the early years settings that support them.',
    image: 'photo-1503454537195-1dcabb73ffb9',
  },
]

const serviceId = (title: string) =>
  `service-${title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
const servicePath = (title: string) => `/services#${serviceId(title)}`

const heroSlides = [
  {
    eyebrow: 'Learning that moves you forward',
    title: <>Igniting Minds.<br /><em className="text-highlight">Empowering Futures.</em></>,
    description: 'Personalised learning and thoughtful educational support for every stage of the journey.',
    photo: 'photo-1509062522246-3755977927d7',
    sidePhoto: 'photo-1503676260728-1c00da094a0b',
    alt: 'Learners and an educator working together in a bright classroom',
    sideAlt: 'Learners sharing ideas around a table',
  },
  {
    eyebrow: 'Built around every learner',
    title: <>Every learner.<br />A world of possibility.</>,
    description: 'Inclusive, individualised support that helps confidence take root and achievement grow.',
    photo: 'photo-1503676260728-1c00da094a0b',
    sidePhoto: 'photo-1503454537195-1dcabb73ffb9',
    alt: 'Students taking part in a collaborative learning activity',
    sideAlt: 'A young learner exploring a classroom activity',
  },
  {
    eyebrow: 'Growing capability together',
    title: <>Better learning.<br />Lasting impact.</>,
    description: 'Practical expertise for schools, families and communities ready to make a difference.',
    photo: 'photo-1524178232363-1fb2b075b655',
    sidePhoto: 'photo-1529390079861-591de354faf5',
    alt: 'An educator leading a professional learning session',
    sideAlt: 'Young people learning together in a community setting',
  },
]

const founderBio = [
  'Itoro Akie is a Learning Solutions Specialist, Educational Consultant, and Early Years Professional with extensive experience designing and delivering impactful learning experiences for children, young people, educators, and communities. She brings a wealth of expertise gained through leadership, teaching, consultancy, curriculum development, training, and educational programme design across a range of UK educational settings.',
  'As the founder of AJIS Learning Solutions, Itoro works with schools, families, community organisations, and businesses to develop innovative learning solutions that inspire growth, achievement, and lifelong learning. Her specialist areas include educational consultancy, learning design, curriculum development, literacy, SEND provision, staff training, and learner support. She is passionate about creating engaging and inclusive learning environments that unlock potential and deliver meaningful outcomes.',
  'In addition to her educational expertise, Itoro has successfully consulted on youth centre and community learning projects, supporting the development of youth programmes, activity planning, resource provision, and learning space design. Her work focuses on creating safe, stimulating, and purposeful environments where young people can learn, develop confidence, build positive relationships, and fulfil their potential.',
  'A skilled facilitator and trainer, Itoro has delivered workshops, coaching, and professional development programmes for educators, parents, and community groups. Her collaborative approach, combined with strong project management and leadership skills, enables her to design practical solutions that meet the needs of diverse learners and organisations.',
  'Itoro holds a Master of Arts (MA) in English Language Teaching, a Postgraduate Certificate in Education (PGCE), a Postgraduate Diploma in Marketing (CIM), and a Bachelor of Arts degree in Communication and Language Arts. She combines academic expertise with extensive practical experience to help individuals and organisations achieve sustainable educational success.',
  'Guided by the philosophy "Igniting Minds, Empowering Futures," Itoro is committed to equipping learners with the knowledge, skills, confidence, and opportunities they need to thrive in an ever-changing world.',
]

const expertiseAreas = [
  { title: 'Educational Consultancy', image: 'photo-1529390079861-591de354faf5', alt: 'Learners working with an educator' },
  { title: 'Learning Design', image: 'photo-1509062522246-3755977927d7', alt: 'A classroom arranged for collaborative learning' },
  { title: 'Curriculum Development', image: 'photo-1524178232363-1fb2b075b655', alt: 'Educators sharing ideas in a professional learning session' },
  { title: 'Literacy', image: 'photo-1491013516836-7db643ee125a', alt: 'A teacher supporting a young learner' },
  { title: 'SEND Provision', image: 'photo-1503676260728-1c00da094a0b', alt: 'Learners participating in an inclusive classroom activity' },
  { title: 'Staff Training', image: 'photo-1524178232363-1fb2b075b655', alt: 'Educators taking part in professional development' },
  { title: 'Learner Support', image: 'photo-1491013516836-7db643ee125a', alt: 'One-to-one learning support in a classroom' },
  { title: 'Youth and Community Projects', image: 'photo-1529390079861-591de354faf5', alt: 'Young people learning together in a welcoming space' },
]

function usePageMotion() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      document.documentElement.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const targetId = location.hash.slice(1)
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'AJIS Learning Solutions | Igniting Minds, Empowering Futures',
      '/about': 'About AJIS | AJIS Learning Solutions',
      '/founder': 'Our Founder | AJIS Learning Solutions',
      '/services': 'Our Services | AJIS Learning Solutions',
      '/insights': 'Insights | AJIS Learning Solutions',
      '/tuition-registration': 'Tuition Registration | AJIS Learning Solutions',
      '/contact': 'Contact | AJIS Learning Solutions',
      '/admin': 'Administration | AJIS Learning Solutions',
      '/privacy': 'Privacy | AJIS Learning Solutions',
      '/terms': 'Terms | AJIS Learning Solutions',
      '/unsubscribe': 'Unsubscribe | AJIS Learning Solutions',
    }
    document.title = titles[location.pathname] ?? 'AJIS Learning Solutions'

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        gsap.set('[data-reveal]', { autoAlpha: 1, clearProps: 'all' })
        gsap.set('[data-reveal-child]', { autoAlpha: 1, clearProps: 'all' })
        return
      }
      gsap.fromTo('main',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power1.out' },
      )
      const hero = document.querySelector<HTMLElement>('.hero')
      if (hero) {
        const intro = gsap.timeline({ defaults: { ease: 'power2.out' } })
        const kicker = hero.querySelector('.hero-kicker')
        const heading = hero.querySelector('.hero-slide h1')
        const copy = hero.querySelector('.hero-slide p')
        const actions = hero.querySelector('.hero-actions')
        const heroImage = hero.querySelector('.hero-photo-frame img')
        const supportingPhoto = hero.querySelector('.hero-support-photo')
        if (kicker) intro.fromTo(kicker, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42 })
        if (heading) intro.fromTo(heading, { autoAlpha: 0, y: 24, clipPath: 'inset(0 0 22% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.68 }, '-=0.08')
        if (copy) intro.fromTo(copy, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46 }, '-=0.28')
        if (actions) intro.fromTo(actions, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.24')
        if (heroImage) intro.fromTo(heroImage, { autoAlpha: 0, clipPath: 'inset(0 0 0 12%)' }, { autoAlpha: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.82 }, '-=0.62')
        if (supportingPhoto) intro.fromTo(supportingPhoto, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.46 }, '-=0.36')
      }
      gsap.fromTo('[data-reveal]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: 'main', start: 'top 80%' },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-reveal-section]').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('[data-reveal-child]'),
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 78%' },
          },
        )
      })
    })
    return () => context.revert()
  }, [location.pathname])
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? ' brand--inverse' : ''}`} to="/" aria-label="AJIS Learning Solutions home">
      <img className="brand-logo" src={logoImage} alt="" />
      <span className="brand-copy"><strong>AJIS</strong><small>LEARNING SOLUTIONS</small></span>
    </Link>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
  }, [location.pathname, location.hash])
  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !servicesDropdownRef.current?.contains(event.target)) setServicesOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="header-inner">
        <Brand />
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <div className={`nav-dropdown${servicesOpen ? ' nav-dropdown--open' : ''}`} ref={servicesDropdownRef}>
            <button
              type="button"
              className={location.pathname === '/services' ? 'active' : ''}
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services <ChevronDown size={14} />
            </button>
            <div className="dropdown-panel" id="services-menu">
              <Link to="/services" onClick={() => { setMenuOpen(false); setServicesOpen(false) }}>All services<ArrowUpRight size={14} /></Link>
              {serviceList.map((service) => (
                <Link key={service.number} to={servicePath(service.title)} onClick={() => { setMenuOpen(false); setServicesOpen(false) }}>
                  {service.title}<ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/tuition-registration">Tuition</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <span className="nav-slogan" aria-label="Igniting Minds, Empowering Futures"><span>Igniting Minds, Empowering Futures.</span></span>
          <Link className="button button--small button--primary nav-cta" to="/contact">Let’s talk <ArrowUpRight size={15} /></Link>
        </nav>
      </div>
    </header>
  )
}

function ButtonLink({ to, children, variant = 'primary' }: { to: string; children: React.ReactNode; variant?: 'primary' | 'light' | 'outline' }) {
  return <Link className={`button button--${variant}`} to={to}>{children}<ArrowUpRight size={16} /></Link>
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`eyebrow${light ? ' eyebrow--light' : ''}`}><span />{children}</div>
}

function PageIntro({ label, title, lead }: { label: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="page-intro">
      <div className="wrap" data-reveal>
        <Eyebrow>{label}</Eyebrow>
        <h1>{title}</h1>
        {lead && <p className="intro-lead">{lead}</p>}
      </div>
    </section>
  )
}

function Hero() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [active, setActive] = useState(0)
  return (
    <section className="hero" aria-label="AJIS Learning Solutions introduction">
      <div className="hero-kicker" data-hero-kicker><span className="kicker-line" /> Learning for a brighter tomorrow</div>
      <Swiper
        modules={[A11y, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450}
        loop
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActive(instance.realIndex)}
        className="hero-swiper"
        aria-label="AJIS learning stories"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.eyebrow}>
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="hero-slide">
                  <span className="hero-eyebrow">{slide.eyebrow}</span>
                  <h1 data-hero-title>{slide.title}</h1>
                  <p data-hero-copy>{slide.description}</p>
                  <div className="hero-actions" data-hero-actions>
                    <ButtonLink to="/services">Explore our work</ButtonLink>
                    <Link className="text-link" to="/about">Discover AJIS <ArrowRight size={16} /></Link>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-photo-frame">
                  <img src={image(slide.photo, 1500)} alt={slide.alt} width="1500" height="1000" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
                </div>
                <div className="hero-support-photo">
                  <div className="hero-support-float"><img src={image(slide.sidePhoto, 600)} alt={slide.sideAlt} width="600" height="400" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" /></div>
                </div>
                <div className="hero-image-note"><span className="note-dot" /> A little more room to grow</div>
                <div className="hero-stamp" aria-hidden="true"><span>AJIS</span><small>LEARN<br />GROW<br />THRIVE</small></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-controls">
        <div className="hero-count"><strong>{String(active + 1).padStart(2, '0')}</strong><span />{String(heroSlides.length).padStart(2, '0')}</div>
        <div className="hero-pagination" aria-label="Choose a slide">
          {heroSlides.map((slide, index) => <button key={slide.eyebrow} className={index === active ? 'is-active' : ''} aria-label={`Show slide ${index + 1}`} onClick={() => swiper?.slideToLoop(index)} />)}
        </div>
        <div className="hero-arrows">
          <button aria-label="Previous slide" onClick={() => swiper?.slidePrev()}><ArrowLeft size={17} /></button>
          <button aria-label="Next slide" onClick={() => swiper?.slideNext()}><ArrowRight size={17} /></button>
        </div>
      </div>
      <a className="hero-scroll" href="#introduction"><ArrowDown size={15} /> Scroll to explore</a>
    </section>
  )
}

const marqueePhrases = [
  "IGNITING MINDS, EMPOWERING FUTURES",
  "UNLOCKING EVERY LEARNER'S POTENTIAL",
  'INCLUSIVE LEARNING EXPERIENCES',
  'EDUCATIONAL EXCELLENCE',
  'EMPOWERING EDUCATORS',
  'BUILDING CONFIDENT FUTURES',
  'LEARNING THAT MAKES A DIFFERENCE',
]

function LearningMarquee() {
  return (
    <div className="learning-marquee" role="region" aria-label="AJIS learning commitments">
      <div className="learning-marquee-track">
        {[0, 1].map((copy) => (
          <div className="learning-marquee-group" aria-hidden={copy === 1} key={copy}>
            {marqueePhrases.map((phrase) => <span className="learning-marquee-item" key={phrase}>{phrase}<span className="marquee-separator" aria-hidden="true">✦</span></span>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <LearningMarquee />
      <section className="intro-section section-pad" id="introduction" data-reveal-section>
        <div className="wrap intro-grid">
          <div className="intro-photo-wrap" data-reveal-child>
            <img className="intro-photo" src={image('photo-1491013516836-7db643ee125a', 1000)} alt="Teacher supporting a young learner" loading="lazy" />
            <div className="image-caption"><span>Learning, shaped around you</span><ArrowUpRight size={18} /></div>
            <div className="photo-index">01 <span>/</span> 03</div>
          </div>
          <div className="intro-copy" data-reveal-child>
            <Eyebrow>A different kind of learning partner</Eyebrow>
            <h2>Progress begins when people feel <em>seen.</em></h2>
            <p>AJIS Learning Solutions brings educational expertise and genuine care together. We work alongside learners, families, educators and organisations to create learning that is inclusive, purposeful and full of possibility.</p>
            <p>From one-to-one tuition to curriculum and community projects, we meet each challenge with curiosity and practical experience.</p>
            <ButtonLink to="/about" variant="outline">Get to know AJIS</ButtonLink>
          </div>
        </div>
      </section>
      <section className="services-section section-pad" data-reveal-section>
        <div className="wrap">
          <div className="section-heading" data-reveal-child>
            <div><Eyebrow>What we do</Eyebrow><h2>Learning solutions<br />with <em>real purpose.</em></h2></div>
            <p>Practical expertise, thoughtfully delivered. Discover how we support learning across ages, settings and communities.</p>
          </div>
          <div className="service-preview-list">
            {serviceList.slice(0, 3).map((service) => (
              <Link className="service-preview" to={servicePath(service.title)} key={service.number} data-reveal-child>
                <span className="service-number">{service.number}</span>
                <span className="service-preview-copy"><strong>{service.title}</strong><small>{service.intro}</small></span>
                <span className="service-preview-image"><img src={image(service.image, 440)} alt="" loading="lazy" /></span>
                <span className="service-preview-arrow"><ArrowUpRight size={20} /></span>
              </Link>
            ))}
          </div>
          <div className="services-end"><ButtonLink to="/services" variant="outline">Explore all services</ButtonLink></div>
        </div>
      </section>
      <section className="belief-section" data-reveal-section>
        <div className="belief-image"><img src={image('photo-1529390079861-591de354faf5', 1300)} alt="Young people learning together in a welcoming space" loading="lazy" /></div>
        <div className="belief-copy" data-reveal-child>
          <Eyebrow light>What guides us</Eyebrow>
          <h2>Good learning<br />opens <em>doors.</em></h2>
          <p>We believe the right support can unlock potential at any age. Our work starts with listening, grows through collaboration and stays focused on outcomes that matter to people.</p>
          <ul className="belief-list"><li><Check size={17} /> Inclusive by design</li><li><Check size={17} /> Grounded in expertise</li><li><Check size={17} /> Built around individual needs</li></ul>
          <ButtonLink to="/about" variant="light">Our approach</ButtonLink>
        </div>
        <div className="belief-mark" aria-hidden="true">A</div>
      </section>
      <section className="founder-teaser section-pad" data-reveal-section>
        <div className="wrap founder-grid">
          <div className="founder-copy" data-reveal-child>
            <Eyebrow>Meet the founder</Eyebrow>
            <h2>Expertise with<br />a human <em>touch.</em></h2>
            <p>AJIS was founded by Itoro-Obong Akie, a Learning Solutions Specialist, Educational Consultant and Early Years Professional. Her work brings together deep educational experience, practical leadership and a belief in what every learner can become.</p>
            <ButtonLink to="/founder" variant="outline">Meet Itoro-Obong Akie</ButtonLink>
          </div>
          <div className="founder-portrait" data-reveal-child>
            <img src={founderImage} alt="Itoro-Obong Akie, founder of AJIS Learning Solutions" width="899" height="1080" loading="lazy" />
            <div className="portrait-caption"><strong>Itoro-Obong Akie</strong><span>Founder & Learning Solutions Specialist</span></div>
            <span className="portrait-note">Learning specialist.<br />Founder.</span>
          </div>
        </div>
      </section>
      <ContactBand />
    </main>
  )
}

function ContactBand() {
  return (
    <section className="contact-band">
      <div className="wrap contact-band-inner" data-reveal>
        <div><Eyebrow light>Let’s make learning matter</Eyebrow><h2>Have a learning<br />challenge in mind?</h2></div>
        <div className="contact-band-actions"><p>Tell us what you’re working towards. We’d love to hear from you.</p><ButtonLink to="/contact" variant="light">Start a conversation</ButtonLink><a className="band-whatsapp" href={whatsapp} target="_blank" rel="noreferrer">Or chat on WhatsApp <ArrowUpRight size={15} /></a></div>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <main>
      <PageIntro label="About AJIS" title={<>Learning with<br /><em>purpose.</em></>} lead="We help people and organisations build the confidence, capability and opportunities to thrive." />
      <section className="about-opening section-pad" data-reveal-section>
        <div className="wrap about-opening-grid"><div className="about-opening-photo" data-reveal-child><img src={image('photo-1529390079861-591de354faf5', 1100)} alt="Learners working together with an educator" loading="lazy" /></div><div className="about-opening-copy" data-reveal-child><Eyebrow>Who we are</Eyebrow><h2>Education that makes room for <em>everyone.</em></h2><p>AJIS Learning Solutions is an educational consultancy supporting learners, educators, parents, schools, organisations and communities. We bring teaching expertise, curriculum knowledge, educational leadership and learning programme design together to make learning meaningful.</p><p>We listen before we advise, adapt to the people and setting in front of us, and focus on practical work that can create lasting change.</p></div></div>
      </section>
      <section className="mission-section" data-reveal-section><div className="wrap mission-grid"><article data-reveal-child><span className="mission-index">01 / OUR MISSION</span><h2>Inspire confidence.<br />Unlock <em>potential.</em></h2><p>To inspire confidence, unlock potential and create meaningful learning experiences that lead to lasting success.</p></article><article data-reveal-child><span className="mission-index">02 / OUR VISION</span><h2>A trusted partner<br />for <em>what’s next.</em></h2><p>To be a trusted educational partner that transforms learning and develops capability.</p></article></div></section>
      <section className="approach-section section-pad" data-reveal-section><div className="wrap approach-grid"><div data-reveal-child><Eyebrow>Our educational philosophy</Eyebrow><h2>Start with the person.<br />Build from <em>there.</em></h2><p>Every learner brings strengths, needs and ambitions of their own. We create space for those differences and build a clear path forward together.</p></div><div className="values-list" data-reveal-child>{['Inclusive practice', 'Curiosity and creativity', 'Respectful partnership', 'Practical excellence', 'Growth that lasts'].map((value, index) => <div key={value}><span>0{index + 1}</span><strong>{value}</strong><ArrowUpRight size={18} /></div>)}</div></div></section>
      <section className="about-founder-strip" data-reveal-section><div className="wrap about-founder-inner" data-reveal-child><img src={founderImage} alt="Itoro-Obong Akie, founder of AJIS Learning Solutions" width="899" height="1080" loading="lazy" /><div><Eyebrow light>Leadership with experience</Eyebrow><h2>Founded by Itoro-Obong Akie.</h2><p>Educational leadership, teaching and consultancy experience, brought together in one learning partner.</p><ButtonLink to="/founder" variant="light">Read Itoro’s story</ButtonLink></div></div></section>
      <ContactBand />
    </main>
  )
}

function FounderPage() {
  const [expertiseSwiper, setExpertiseSwiper] = useState<SwiperInstance | null>(null)
  return (
    <main>
      <PageIntro label="Founder profile" title={<>Itoro-Obong Akie.<br /><em>Learning advocate.</em></>} lead="Learning Solutions Specialist · Educational Consultant · Early Years Professional" />
      <section className="founder-profile-section section-pad" data-reveal-section>
        <div className="wrap founder-profile-grid"><div className="founder-profile-photo" data-reveal-child><img src={founderImage} alt="Itoro-Obong Akie, founder of AJIS Learning Solutions" width="899" height="1080" /><span>Itoro-Obong Akie · Founder</span></div><div className="founder-profile-copy"><Eyebrow>Founder</Eyebrow><h2 data-reveal-child>Bringing learning<br />to <em>life.</em></h2><div className="bio-copy">{founderBio.map((paragraph) => <p key={paragraph.slice(0, 45)} data-reveal-child>{paragraph}</p>)}</div></div></div>
      </section>
      <section className="credentials-section" data-reveal-section><div className="wrap credentials-grid"><div data-reveal-child><Eyebrow light>Academic qualifications</Eyebrow><h2>Knowledge shaped<br />by <em>experience.</em></h2></div><div className="credentials-list"><p data-reveal-child><strong>MA</strong><span>English Language Teaching</span></p><p data-reveal-child><strong>PGCE</strong><span>Postgraduate Certificate in Education</span></p><p data-reveal-child><strong>CIM</strong><span>Postgraduate Diploma in Marketing</span></p><p data-reveal-child><strong>BA</strong><span>Communication and Language Arts</span></p></div></div></section>
      <section className="expertise-section section-pad" data-reveal-section><div className="wrap"><div className="expertise-heading" data-reveal-child><div><Eyebrow>Areas of expertise</Eyebrow><h2>Experience Across The Learning Journey</h2></div><div className="expertise-controls"><button className="icon-button" aria-label="Previous area of expertise" onClick={() => expertiseSwiper?.slidePrev()}><ArrowLeft size={17} /></button><button className="icon-button" aria-label="Next area of expertise" onClick={() => expertiseSwiper?.slideNext()}><ArrowRight size={17} /></button></div></div><Swiper modules={[A11y]} onSwiper={setExpertiseSwiper} slidesPerView={1.16} spaceBetween={14} breakpoints={{ 600: { slidesPerView: 2.15, spaceBetween: 17 }, 960: { slidesPerView: 3.25, spaceBetween: 20 } }} className="expertise-swiper" aria-label="Itoro Akie's areas of expertise">{expertiseAreas.map((area, index) => <SwiperSlide key={area.title}><article className="expertise-card" data-reveal-child><div className="expertise-card-image"><img src={image(area.image, 700)} alt={area.alt} width="700" height="500" loading="lazy" decoding="async" /></div><div className="expertise-card-label"><span>0{index + 1}</span><strong>{area.title}</strong><ArrowUpRight size={17} /></div></article></SwiperSlide>)}</Swiper></div></section>
      <ContactBand />
    </main>
  )
}

function ServicesPage() {
  return (
    <main>
      <PageIntro label="Our services" title={<>Expertise for<br /><em>every possibility.</em></>} lead="From individual learning support to organisation-wide development, we bring care and clarity to the work." />
      <section className="service-details section-pad" data-reveal-section><div className="wrap">{serviceList.map((service, index) => <article id={serviceId(service.title)} className={`service-detail${index % 2 ? ' service-detail--reverse' : ''}`} key={service.number} data-reveal-child><div className="service-detail-photo"><img src={image(service.image, 1000)} alt={`An educational setting for ${service.title.toLowerCase()}`} loading="lazy" /><span>{service.number} / 08</span></div><div className="service-detail-copy"><Eyebrow>Service {service.number}</Eyebrow><h2>{service.title}<em>.</em></h2><h3>{service.intro}</h3><p>{service.detail}</p><ButtonLink to={`/contact?service=${encodeURIComponent(service.title)}`} variant="outline">Enquire about this service</ButtonLink></div></article>)}</div></section>
      <ContactBand />
    </main>
  )
}

type Article = { id: string; title: string; slug: string; category: string; summary: string; body: string; image_url: string; published_at: string | null }

function InsightsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await getBackend().from('articles').select('id, title, slug, category, summary, body, image_url, published_at').eq('published', true).order('published_at', { ascending: false })
        if (error) throw error
        setArticles((data ?? []) as Article[])
      } catch {
        setArticles([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  return <main><PageIntro label="Insights & resources" title={<>Ideas to help<br /><em>learning grow.</em></>} lead="Thoughtful perspectives for learners, families, educators and communities." /><section className="insights-page-section section-pad"><div className="wrap">{loading ? <p className="insights-empty">Loading published resources…</p> : articles.length ? <div className="article-grid">{articles.map((article) => <article className="article-item" key={article.id}>{article.image_url && <Link to={`/insights/${article.slug}`}><img src={article.image_url} alt="" loading="lazy" /></Link>}<div className="article-meta">{article.category && <span>{article.category}</span>}{article.published_at && <time dateTime={article.published_at}>{new Date(article.published_at).toLocaleDateString()}</time>}</div><h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2><p>{article.summary}</p><Link className="text-link" to={`/insights/${article.slug}`}>Read article <ArrowRight size={15} /></Link></article>)}</div> : <div className="insights-empty"><span className="empty-dash" /><div><h2>Our first articles are on their way.</h2><p>AJIS is preparing thoughtful resources for learners, families and educators. New articles will appear here as they are published.</p></div></div>}</div></section><ContactBand /></main>
}

function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await getBackend().from('articles').select('id, title, slug, category, summary, body, image_url, published_at').eq('slug', slug).eq('published', true).maybeSingle()
        if (error) throw error
        setArticle(data as Article | null)
      } catch {
        setArticle(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])
  if (loading) return <main className="legal-section section-pad"><div className="wrap"><p className="insights-empty">Loading article…</p></div></main>
  if (!article) return <NotFound />
  return <main><PageIntro label={article.category || 'AJIS insights'} title={<>{article.title}</>} lead={article.summary} />{article.image_url && <div className="wrap article-hero-image"><img src={article.image_url} alt="" /></div>}<article className="legal-section section-pad"><div className="wrap article-body">{article.published_at && <time dateTime={article.published_at}>{new Date(article.published_at).toLocaleDateString()}</time>}{article.body.split(/\n\s*\n/).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}<Link className="text-link" to="/insights"><ArrowLeft size={15} /> Back to insights</Link></div></article><ContactBand /></main>
}

type FormValues = Record<string, string>

function TextField({ label, name, type = 'text', required = false, value, onChange, multiline = false }: { label: string; name: string; type?: string; required?: boolean; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const controlProps = { id: name, name, required, value, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) }
  return <label className="form-field" htmlFor={name}><span>{label}{required && <b aria-hidden="true">*</b>}</span>{multiline ? <textarea {...controlProps} rows={3} /> : <input {...controlProps} type={type} />}</label>
}

function ChoiceGroup({ title, name, options, value, onChange, required = false, other = false }: { title: string; name: string; options: string[]; value: string; onChange: (value: string) => void; required?: boolean; other?: boolean }) {
  return <fieldset className="choice-field"><legend>{title}{required && <b aria-hidden="true">*</b>}</legend><div className="choice-list">{options.map((option) => <label className="choice-option" key={option}><input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} required={required} /><span className="choice-indicator" /><span>{option}</span></label>)}{other && <label className="choice-option"><input type="radio" name={name} value="Other" checked={value === 'Other'} onChange={() => onChange('Other')} required={required} /><span className="choice-indicator" /><span>Other</span></label>}</div></fieldset>
}

function RegistrationPage() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<FormValues>({})
  const [programOther, setProgramOther] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }))

  const next = () => {
    const section = formRef.current?.querySelector(`[data-form-step="${step}"]`)
    if (!section) return
    const controls = Array.from(section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'))
    const invalid = controls.find((control) => !control.checkValidity())
    if (invalid) { invalid.reportValidity(); return }
    setStep((current) => Math.min(current + 1, 2))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setMessage('')
    setSending(true)
    try {
      await submitRecord('registrations', {
        selected_program: values.program === 'Other' ? `Other: ${programOther}` : values.program,
        answers: { ...values, programOther },
        status: 'new',
      })
      setMessage('Thank you. Your application has been received. AJIS will be in touch using the details you provided.')
      setValues({})
      setProgramOther('')
      setStep(0)
      form.reset()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your application could not be submitted. Please contact AJIS directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <PageIntro label="AJIS tuition" title={<>Welcome to<br /><em>AJIS Tuition.</em></>} lead="Professional tuition tailored to meet individual learner's needs." />
      <section className="registration-section section-pad"><div className="wrap registration-layout"><aside className="registration-aside"><Eyebrow>Tuition application</Eyebrow><h2>A good next step<br />starts <em>here.</em></h2><p>Complete the application below and the AJIS team will follow up with you.</p><a href={`tel:${phone.replaceAll(' ', '')}`}><Phone size={16} /> {phone}</a><a href={`mailto:${email}`}><Mail size={16} /> {email}</a></aside>
        <div className="registration-main">
          {message && <div className={`form-message${message.startsWith('Thank') ? ' form-message--success' : ''}`} role="status">{message}</div>}
          {!message.startsWith('Thank') && <>
            <div className="form-progress"><div className="progress-label"><span>Application</span><span>Step {step + 1} of 3</span></div><div className="progress-track"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div><div className="progress-steps"><span className={step >= 0 ? 'is-current' : ''}>Tuition details</span><span className={step >= 1 ? 'is-current' : ''}>Learner information</span><span className={step >= 2 ? 'is-current' : ''}>Review & submit</span></div></div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <fieldset className="form-step" data-form-step="0" disabled={step !== 0}><h2>Tuition details</h2>
                <ChoiceGroup title="Select Learning program" name="program" options={['Online Tuition £25/h', 'Face 2 Face Tuition £25/h', 'Special Needs Tuition £25/h']} value={values.program ?? ''} onChange={(value) => update('program', value)} required other />
                {values.program === 'Other' && <TextField label="Other learning programme" name="programOther" value={programOther} onChange={setProgramOther} required />}
                <ChoiceGroup title="Select Subject:" name="subject" options={['GCSE English/Literature', 'English', 'SATs Prep', 'Maths', 'Maths /English', 'Grammar School Prep']} value={values.subject ?? ''} onChange={(value) => update('subject', value)} required />
                <TextField label="Child's Year group" name="yearGroup" value={values.yearGroup ?? ''} onChange={(value) => update('yearGroup', value)} />
                <ChoiceGroup title="Select a time slot:" name="timeSlot" options={['Wednesday (5pm - 6pm)', 'Wednesday (4:00pm - 5:00pm)', 'Wednesday 6pm - 7pm', 'Thursday (4:00pm - 5:00pm)', 'Thursday (5pm - 6pm)', 'Saturday 9am - 10am', 'Saturday 11am - 12noon']} value={values.timeSlot ?? ''} onChange={(value) => update('timeSlot', value)} />
              </fieldset>
              <fieldset className="form-step" data-form-step="1" disabled={step !== 1}><h2>Child Information</h2><p className="form-helper">Please fill out the learner's information</p>
                <div className="form-two-col"><TextField label="First Name:" name="firstName" value={values.firstName ?? ''} onChange={(value) => update('firstName', value)} required /><TextField label="Last Name" name="lastName" value={values.lastName ?? ''} onChange={(value) => update('lastName', value)} required /></div>
                <ChoiceGroup title="Gender" name="gender" options={['Female', 'Male', 'Prefer not to say']} value={values.gender ?? ''} onChange={(value) => update('gender', value)} required />
                <TextField label="Address" name="address" value={values.address ?? ''} onChange={(value) => update('address', value)} required multiline />
                <div className="form-two-col"><TextField label="Phone" name="learnerPhone" type="tel" value={values.learnerPhone ?? ''} onChange={(value) => update('learnerPhone', value)} required /><TextField label="Email" name="learnerEmail" type="email" value={values.learnerEmail ?? ''} onChange={(value) => update('learnerEmail', value)} required /></div>
                <TextField label="Special Needs(physical, emotional or medical)" name="specialNeeds" value={values.specialNeeds ?? ''} onChange={(value) => update('specialNeeds', value)} required multiline />
                <h3 className="form-subheading">Parent / guardian</h3>
                <TextField label="Parent's name" name="parentName" value={values.parentName ?? ''} onChange={(value) => update('parentName', value)} required />
                <div className="form-two-col"><TextField label="Parent's phone number:" name="parentPhone" type="tel" value={values.parentPhone ?? ''} onChange={(value) => update('parentPhone', value)} required /><TextField label="Parent's Email:" name="parentEmail" type="email" value={values.parentEmail ?? ''} onChange={(value) => update('parentEmail', value)} required /></div>
              </fieldset>
              <fieldset className="form-step" data-form-step="2" disabled={step !== 2}><h2>Registration Information</h2><div className="registration-terms">Thank you for choosing AJIS Tuition. We look forward to working with you/your child to achieve their academic goals. Please read the following information carefully before submitting your application.<br /><br />You will receive a confirmation of your booking through the email address you have provided in the next 24 hours.<br />All payments must be made in advance. Access codes or centre details/time tables for lessons will be sent to you as soon as your payment is confirmed(Please allow up to 24 hours for this) Lessons can be rescheduled on condition that they are claimed within 2 weeks or forfeited.<br />To access online lessons your child will need...<br />A table and chair<br />A computer or laptop<br />zoom app<br />Headphones if sharing learning space<br />Notebooks, pens, pencils, erasers etc<br />You can reach us on +447853237530 or ajis.tuition@gmail.com</div>
                <ChoiceGroup title="I understand the information above:" name="understood" options={['Yes']} value={values.understood ?? ''} onChange={(value) => update('understood', value)} required />
                <TextField label="Date of registration" name="registrationDate" type="date" value={values.registrationDate ?? ''} onChange={(value) => update('registrationDate', value)} />
                <ChoiceGroup title="Submit Application" name="submitApplication" options={['Submit Application']} value={values.submitApplication ?? ''} onChange={(value) => update('submitApplication', value)} required />
              </fieldset>
              <div className="form-navigation">{step > 0 && <button className="button button--outline" type="button" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Previous</button>}{step < 2 ? <button className="button button--primary" type="button" onClick={next}>Continue <ArrowRight size={16} /></button> : <button className="button button--primary" type="submit" disabled={sending}>{sending ? 'Submitting…' : 'Submit Application'} <ArrowUpRight size={16} /></button>}</div>
            </form>
          </>}
        </div>
      </div></section>
    </main>
  )
}

function ContactPage() {
  const params = new URLSearchParams(window.location.search)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setSending(true)
    setStatus('')
    const data = new FormData(form)
    try {
      await submitRecord('contact_enquiries', Object.fromEntries(data.entries()))
      setStatus('Thank you for getting in touch. Your enquiry has been received.')
      form.reset()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Your enquiry could not be sent. Please contact AJIS by phone or email.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <PageIntro label="Get in touch" title={<>Let’s start a<br /><em>conversation.</em></>} lead="Tell us what you’re working towards. We’ll help you explore a thoughtful next step." />
      <section className="contact-page-section section-pad"><div className="wrap contact-page-grid"><div className="contact-details"><Eyebrow>Contact AJIS</Eyebrow><h2>We’re here<br />to <em>listen.</em></h2><p>For tuition, consultancy or a general enquiry, reach the team directly or send a message using the form.</p><a href="tel:+447882665968"><span><Phone size={18} /></span><div><small>Call us</small><strong>{phone}</strong></div><ArrowUpRight size={17} /></a><a href={`mailto:${email}`}><span><Mail size={18} /></span><div><small>Email us</small><strong>{email}</strong></div><ArrowUpRight size={17} /></a><a href={whatsapp} target="_blank" rel="noreferrer"><span><MessageIcon /></span><div><small>WhatsApp</small><strong>Start a chat</strong></div><ArrowUpRight size={17} /></a></div>
        <form className="contact-form" onSubmit={handleSubmit}><Eyebrow>Your enquiry</Eyebrow><h2>How can we help?</h2>{status && <div className={`form-message${status.startsWith('Thank') ? ' form-message--success' : ''}`} role="status">{status}</div>}<div className="form-two-col"><label className="form-field"><span>Your name<b>*</b></span><input name="name" required /></label><label className="form-field"><span>Email address<b>*</b></span><input type="email" name="email" required /></label></div><label className="form-field"><span>What would you like to discuss?</span><select name="service" defaultValue={params.get('service') ?? ''}><option value="">Choose a service</option>{serviceList.map((service) => <option key={service.number}>{service.title}</option>)}<option>General enquiry</option></select></label><label className="form-field"><span>Your message<b>*</b></span><textarea name="message" rows={5} required /></label><button className="button button--primary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={16} /></button></form></div></section>
      <section className="contact-map-band"><div className="wrap"><Eyebrow light>Wherever you are</Eyebrow><h2>Learning support that<br />meets you <em>where you are.</em></h2><p>AJIS works with learners, families and organisations across educational settings.</p></div></section>
    </main>
  )
}

function MessageIcon() {
  return <span className="message-icon" aria-hidden="true"><MessageCircle size={19} /></span>
}

type RegistrationRecord = { id: string; created_at: string; selected_program: string; answers: Record<string, string>; status: string }

function AdminPage() {
  const [session, setSession] = useState<{ email?: string } | null>(null)
  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [status, setStatus] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const client = useRef<SupabaseClient | null>(null)

  async function loadRecords() {
    setLoading(true)
    setStatus('')
    try {
      const supabase = getBackend()
      client.current = supabase
      const { data: auth } = await supabase.auth.getSession()
      if (!auth.session) { setSession(null); setLoading(false); return }
      setSession({ email: auth.session.user.email })
      const { data, error } = await supabase.from('registrations').select('id, created_at, selected_program, answers, status').order('created_at', { ascending: false })
      if (error) throw error
      setRecords((data ?? []) as RegistrationRecord[])
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not load registrations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadRecords() }, [])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    const data = new FormData(event.currentTarget)
    try {
      const { error } = await getBackend().auth.signInWithPassword({ email: String(data.get('email')), password: String(data.get('password')) })
      if (error) throw error
      await loadRecords()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sign in failed.')
    }
  }

  async function updateStatus(id: string, nextStatus: string) {
    try {
      const { error } = await getBackend().from('registrations').update({ status: nextStatus }).eq('id', id)
      if (error) throw error
      setRecords((current) => current.map((record) => record.id === id ? { ...record, status: nextStatus } : record))
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The status could not be updated.')
    }
  }

  async function signOut() {
    await client.current?.auth.signOut()
    setSession(null)
    setRecords([])
  }

  function exportCsv() {
    const rows = [['Date', 'Learner', 'Parent', 'Programme', 'Subject', 'Status'], ...records.map((record) => [new Date(record.created_at).toLocaleDateString(), `${record.answers.firstName ?? ''} ${record.answers.lastName ?? ''}`, record.answers.parentName ?? '', record.selected_program, record.answers.subject ?? '', record.status])]
    const csv = rows.map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ajis-registrations.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const visible = filter === 'all' ? records : records.filter((record) => record.status === filter)
  return <main className="admin-page"><section className="admin-shell"><div className="wrap">{session ? <><div className="admin-heading"><div><Eyebrow>AJIS administration</Eyebrow><h1>Tuition <em>applications.</em></h1><p>Signed in as {session.email}</p></div><div className="admin-actions"><button className="button button--outline" onClick={exportCsv} disabled={!records.length}><Download size={16} /> Export CSV</button><button className="button button--primary" onClick={signOut}>Sign out <ArrowUpRight size={16} /></button></div></div><div className="admin-toolbar"><span>{visible.length} application{visible.length === 1 ? '' : 's'}</span><select aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All applications</option><option value="new">New</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select><button className="icon-button" aria-label="Refresh applications" onClick={() => void loadRecords()}><ArrowRight size={16} /></button></div>{status && <div className="form-message" role="status">{status}</div>}{loading ? <p className="admin-empty">Loading applications…</p> : visible.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Learner</th><th>Parent / guardian</th><th>Programme</th><th>Subject</th><th>Status</th></tr></thead><tbody>{visible.map((record) => <tr key={record.id}><td>{new Date(record.created_at).toLocaleDateString()}</td><td>{record.answers.firstName} {record.answers.lastName}</td><td>{record.answers.parentName}</td><td>{record.selected_program}</td><td>{record.answers.subject}</td><td><select aria-label={`Status for ${record.answers.firstName ?? 'application'}`} value={record.status} onChange={(event) => void updateStatus(record.id, event.target.value)}><option value="new">New</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select></td></tr>)}</tbody></table></div> : <div className="admin-empty"><span><Check size={18} /></span><h2>No applications to show.</h2><p>New tuition applications will appear here.</p></div>}</> : <div className="admin-login"><Eyebrow>AJIS administration</Eyebrow><h1>Welcome <em>back.</em></h1><p>Sign in with an authorised AJIS account to view tuition applications.</p><form onSubmit={signIn}><label className="form-field"><span>Email</span><input type="email" name="email" required /></label><label className="form-field"><span>Password</span><input type="password" name="password" required /></label>{status && <div className="form-message" role="status">{status}</div>}<button className="button button--primary" type="submit">Sign in <ArrowUpRight size={16} /></button></form></div>}</div></section></main>
}

type ContactRecord = { id: string; created_at: string; name: string; email: string; service: string; message: string; status: string }

function AdminEnquiriesPage() {
  const [session, setSession] = useState(false)
  const [records, setRecords] = useState<ContactRecord[]>([])
  const [status, setStatus] = useState('Loading enquiries…')
  const [selected, setSelected] = useState<ContactRecord | null>(null)

  async function loadEnquiries() {
    setStatus('Loading enquiries…')
    try {
      const supabase = getBackend()
      const { data: auth } = await supabase.auth.getSession()
      if (!auth.session) {
        setSession(false)
        setStatus('Sign in from the admin page to view enquiries.')
        return
      }
      setSession(true)
      const { data, error } = await supabase.from('contact_enquiries').select('id, created_at, name, email, service, message, status').order('created_at', { ascending: false })
      if (error) throw error
      setRecords((data ?? []) as ContactRecord[])
      setStatus('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not load enquiries.')
    }
  }

  useEffect(() => { void loadEnquiries() }, [])

  async function updateStatus(record: ContactRecord, nextStatus: string) {
    try {
      const { error } = await getBackend().from('contact_enquiries').update({ status: nextStatus }).eq('id', record.id)
      if (error) throw error
      setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: nextStatus } : item))
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The enquiry status could not be updated.')
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell"><div className="wrap">
        <div className="admin-heading"><div><Eyebrow>AJIS administration</Eyebrow><h1>Contact <em>enquiries.</em></h1><p>Private messages are visible only to authorised AJIS administrators.</p></div><div className="admin-actions"><Link className="button button--outline" to="/admin">Tuition applications <ArrowUpRight size={16} /></Link><button className="button button--primary" onClick={() => void loadEnquiries()}>Refresh <ArrowRight size={16} /></button></div></div>
        {status && <div className="form-message" role="status">{status}</div>}
        {session && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th>Status</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td>{new Date(record.created_at).toLocaleDateString()}</td><td>{record.name}</td><td><a href={`mailto:${record.email}`}>{record.email}</a></td><td>{record.service || 'General enquiry'}</td><td><button className="text-link" onClick={() => setSelected(record)}>Read message <ArrowUpRight size={14} /></button></td><td><select aria-label={`Status for enquiry from ${record.name}`} value={record.status} onChange={(event) => void updateStatus(record, event.target.value)}><option value="new">New</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select></td></tr>)}</tbody></table>{records.length === 0 && !status && <div className="admin-empty"><h2>No enquiries to show.</h2><p>New contact messages will appear here.</p></div>}</div>}
        {selected && <div className="detail-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onClick={(event) => event.stopPropagation()}><button className="detail-close" aria-label="Close enquiry details" onClick={() => setSelected(null)}><X size={20} /></button><Eyebrow>Contact enquiry</Eyebrow><h2 id="enquiry-title">{selected.name}</h2><p><a href={`mailto:${selected.email}`}>{selected.email}</a></p><p className="detail-service">{selected.service || 'General enquiry'} · {new Date(selected.created_at).toLocaleString()}</p><div className="detail-message">{selected.message}</div></section></div>}
      </div></section>
    </main>
  )
}

function AdminRegistrationDetailsPage() {
  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [status, setStatus] = useState('Loading applications…')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    void (async () => {
      try {
        const supabase = getBackend()
        const { data: auth } = await supabase.auth.getSession()
        if (!auth.session) {
          setStatus('Sign in from the admin page to view applications.')
          return
        }
        const { data, error } = await supabase.from('registrations').select('id, created_at, selected_program, answers, status').order('created_at', { ascending: false })
        if (error) throw error
        setRecords((data ?? []) as RegistrationRecord[])
        setStatus('')
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Could not load applications.')
      }
    })()
  }, [])

  const visible = filter === 'all' ? records : records.filter((record) => record.status === filter)
  return (
    <main className="admin-page"><section className="admin-shell"><div className="wrap">
      <div className="admin-heading"><div><Eyebrow>AJIS administration</Eyebrow><h1>Application <em>details.</em></h1><p>Learner and family information is visible only to authorised AJIS administrators.</p></div></div>
      <div className="admin-toolbar"><span>{visible.length} application{visible.length === 1 ? '' : 's'}</span><select aria-label="Filter applications by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All applications</option><option value="new">New</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select></div>
      {status && <div className="form-message" role="status">{status}</div>}
      {visible.map((record) => <details className="application-detail" key={record.id}><summary><span>{record.answers.firstName} {record.answers.lastName}</span><span>{record.selected_program}</span><span>{new Date(record.created_at).toLocaleDateString()}</span><span className={`status-label status-label--${record.status}`}>{record.status.replace('_', ' ')}</span></summary><dl>{[['Select Learning program', record.selected_program], ['Select Subject:', record.answers.subject], ["Child's Year group", record.answers.yearGroup], ['Select a time slot:', record.answers.timeSlot], ['Gender', record.answers.gender], ['Address', record.answers.address], ['Phone', record.answers.learnerPhone], ['Email', record.answers.learnerEmail], ['Special Needs(physical, emotional or medical)', record.answers.specialNeeds], ["Parent's name", record.answers.parentName], ["Parent's phone number:", record.answers.parentPhone], ["Parent's Email:", record.answers.parentEmail], ['Date of registration', record.answers.registrationDate]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl></details>)}
      {!status && visible.length === 0 && <div className="admin-empty"><h2>No applications to show.</h2><p>New tuition applications will appear here.</p></div>}
    </div></section></main>
  )
}

function AdminNavigation() {
  const location = useLocation()
  if (!location.pathname.startsWith('/admin')) return null
  return <nav className="admin-navigation" aria-label="Administration"><div className="wrap"><Link to="/admin" className={location.pathname === '/admin' ? 'is-active' : ''}>Applications</Link><Link to="/admin/registration-details" className={location.pathname === '/admin/registration-details' ? 'is-active' : ''}>Full application details</Link><Link to="/admin/enquiries" className={location.pathname === '/admin/enquiries' ? 'is-active' : ''}>Contact enquiries</Link></div></nav>
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const privacy = kind === 'privacy'
  return <main><PageIntro label={privacy ? 'Privacy policy' : 'Terms & conditions'} title={privacy ? <>Your information,<br /><em>handled with care.</em></> : <>Clear expectations.<br /><em>Better learning.</em></>} lead={privacy ? 'How AJIS Learning Solutions collects and uses information shared through this website.' : 'The terms that apply when using the AJIS Learning Solutions website.'} /><section className="legal-section section-pad"><div className="wrap legal-copy"><p className="legal-updated">Last updated: November 2026</p>{privacy ? <><h2>Information we collect</h2><p>When you submit a tuition registration or contact enquiry, AJIS collects the information you provide, including learner and parent or guardian details. Newsletter sign-ups collect your email address.</p><h2>How information is used</h2><p>Information is used to respond to enquiries, administer tuition applications and provide requested updates. It is not displayed publicly or sold to third parties.</p><h2>Storage and access</h2><p>Form submissions are stored in AJIS’s configured database. Access should be restricted to authorised AJIS personnel. Contact AJIS to request access, correction or deletion of information you have submitted.</p><h2>Contact</h2><p>For privacy questions, email <a href={`mailto:${email}`}>{email}</a>.</p></> : <><h2>Website information</h2><p>Content on this website provides general information about AJIS Learning Solutions and is not a substitute for individual educational or professional advice.</p><h2>Tuition applications</h2><p>Submitting an application is an enquiry about tuition and does not guarantee a place or a particular schedule. AJIS will contact applicants to discuss availability and next steps.</p><h2>External links</h2><p>This website may link to third-party services. AJIS is not responsible for the content or privacy practices of external sites.</p><h2>Contact</h2><p>Questions about these terms can be sent to <a href={`mailto:${email}`}>{email}</a>.</p></>}</div></section><ContactBand /></main>
}

function UnsubscribePage() {
  const [status, setStatus] = useState('Removing your email address…')
  const token = new URLSearchParams(window.location.search).get('token')
  useEffect(() => {
    if (!token) {
      setStatus('This unsubscribe link is incomplete. Please contact AJIS and we will help.')
      return
    }
    void (async () => {
      try {
        const { data, error } = await getBackend().rpc('unsubscribe_newsletter', { p_token: token })
        setStatus(error ? 'We could not update your subscription. Please contact AJIS.' : data ? 'Your email address has been removed from AJIS updates.' : 'This unsubscribe link is no longer valid.')
      } catch {
        setStatus('We could not update your subscription. Please contact AJIS.')
      }
    })()
  }, [token])
  return <main className="not-found"><div className="wrap"><Eyebrow>AJIS updates</Eyebrow><h1>Subscription<br /><em>preferences.</em></h1><p role="status">{status}</p><ButtonLink to="/">Back to home</ButtonLink></div></main>
}

function NotFound() {
  return <main className="not-found"><div className="wrap"><Eyebrow>404 / Page not found</Eyebrow><h1>This page took<br />a <em>different route.</em></h1><p>The page may have moved. Let’s find your way back to AJIS.</p><ButtonLink to="/">Back to home</ButtonLink></div></main>
}

function Footer() {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setSending(true)
    setStatus('')
    const data = new FormData(form)
    try {
      await submitRecord('newsletter_subscribers', { email: data.get('newsletterEmail') })
      setStatus('You’re on the list. Thank you.')
      form.reset()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Subscription could not be completed.')
    } finally {
      setSending(false)
    }
  }

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand-col"><Brand inverse /><p>Learning solutions that inspire growth, achievement and lifelong learning.</p><a className="footer-social" href={`mailto:${email}`} aria-label="Email AJIS"><Mail size={17} /></a></div>
        <div className="footer-links"><div><h3>Explore</h3><Link to="/about">About AJIS</Link><Link to="/founder">Meet the founder</Link><Link to="/services">Our services</Link><Link to="/tuition-registration">Tuition registration</Link><Link to="/insights">Insights</Link></div><div><h3>Connect</h3><Link to="/contact">Contact</Link><a href="tel:+447882665968">{phone}</a><a href={`mailto:${email}`}>{email}</a><Link to="/admin">Administration</Link><Link to="/admin/enquiries">Contact enquiries</Link></div></div>
        <div className="footer-newsletter"><h3>Notes for the journey</h3><p>Occasional learning ideas and AJIS updates.</p><form onSubmit={subscribe}><label className="visually-hidden" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="newsletterEmail" type="email" placeholder="Your email address" required /><button aria-label="Subscribe to newsletter" disabled={sending}><ArrowRight size={18} /></button></form>{status && <small role="status">{status}</small>}</div>
      </div>
      <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} AJIS Learning Solutions</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={12} /></a></div><span>Igniting Minds, Empowering Futures.</span></div>
    </footer>
  )
}

function FloatingTools() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 560)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <><a className="whatsapp-float" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with AJIS on WhatsApp"><MessageIcon /></a>{showTop && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowDown size={16} /></button>}</>
}

export default function App() {
  usePageMotion()
  return <><Header /><AdminNavigation /><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/founder" element={<FounderPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/insights" element={<InsightsPage />} /><Route path="/insights/:slug" element={<ArticlePage />} /><Route path="/tuition-registration" element={<RegistrationPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="/admin/enquiries" element={<AdminEnquiriesPage />} /><Route path="/admin/registration-details" element={<AdminRegistrationDetailsPage />} /><Route path="/privacy" element={<LegalPage kind="privacy" />} /><Route path="/terms" element={<LegalPage kind="terms" />} /><Route path="/unsubscribe" element={<UnsubscribePage />} /><Route path="*" element={<NotFound />} /></Routes><Footer /><FloatingTools /></>
}