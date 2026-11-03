create extension if not exists pgcrypto;

create table if not exists public.ajis_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_ajis_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1 from public.ajis_admins where user_id = auth.uid()
  );
$$;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  selected_program text not null,
  answers jsonb not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'complete'))
);

create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  service text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'complete'))
);

create index if not exists contact_enquiries_created_at_idx on public.contact_enquiries (created_at desc);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  unsubscribed_at timestamptz
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  category text not null default '',
  summary text not null default '',
  body text not null default '',
  image_url text not null default '',
  published boolean not null default false,
  published_at timestamptz
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quote text not null,
  attribution text not null default '',
  role text not null default '',
  published boolean not null default false
);

alter table public.ajis_admins enable row level security;
alter table public.registrations enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles enable row level security;
alter table public.testimonials enable row level security;

create policy "Admins can read their own access record"
  on public.ajis_admins for select to authenticated
  using (user_id = auth.uid());
grant select on public.ajis_admins to authenticated;

create policy "Admins can view registrations"
  on public.registrations for select to authenticated
  using (public.is_ajis_admin());
create policy "Admins can update registration status"
  on public.registrations for update to authenticated
  using (public.is_ajis_admin()) with check (public.is_ajis_admin());

create policy "Admins can manage contact enquiries"
  on public.contact_enquiries for all to authenticated
  using (public.is_ajis_admin()) with check (public.is_ajis_admin());
create policy "Admins can view newsletter subscribers"
  on public.newsletter_subscribers for select to authenticated
  using (public.is_ajis_admin());

create policy "Published articles are public"
  on public.articles for select to anon, authenticated
  using (published or public.is_ajis_admin());
create policy "Admins can manage articles"
  on public.articles for all to authenticated
  using (public.is_ajis_admin()) with check (public.is_ajis_admin());
create policy "Published testimonials are public"
  on public.testimonials for select to anon, authenticated
  using (published or public.is_ajis_admin());
create policy "Admins can manage testimonials"
  on public.testimonials for all to authenticated
  using (public.is_ajis_admin()) with check (public.is_ajis_admin());

create or replace function public.unsubscribe_newsletter(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected integer;
begin
  update public.newsletter_subscribers
  set unsubscribed_at = coalesce(unsubscribed_at, now())
  where unsubscribe_token = p_token;
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

revoke all on function public.unsubscribe_newsletter(uuid) from public;
grant execute on function public.unsubscribe_newsletter(uuid) to anon, authenticated;
grant select, update on public.registrations to authenticated;
grant select, insert, update, delete on public.contact_enquiries to authenticated;
grant select on public.newsletter_subscribers to authenticated;
grant select, insert, update, delete on public.articles, public.testimonials to anon, authenticated;
grant all on public.ajis_admins, public.registrations, public.contact_enquiries, public.newsletter_subscribers, public.articles, public.testimonials to service_role;