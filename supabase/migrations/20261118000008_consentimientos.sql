-- Autorización de tratamiento de datos (Ley 1581 de 2012): registro de QUIÉN aceptó QUÉ versión y CUÁNDO.
-- Solo la propia persona puede registrar su aceptación (RLS); nadie puede editarla ni borrarla desde la app.
create table public.consentimientos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null check (char_length(version) <= 40),
  finalidades jsonb not null,
  locale text not null default 'es-CO' check (char_length(locale) <= 10),
  created_at timestamptz not null default now(),
  retirado_en timestamptz,
  unique (user_id, version)
);
alter table public.consentimientos enable row level security;
create policy consentimientos_ver_propio on public.consentimientos for select to authenticated using (user_id = (select auth.uid()));
create policy consentimientos_registrar_propio on public.consentimientos for insert to authenticated with check (user_id = (select auth.uid()));
revoke all on public.consentimientos from anon;
revoke update, delete on public.consentimientos from authenticated;
