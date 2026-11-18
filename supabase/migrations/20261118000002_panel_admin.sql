-- NutriSnap AI — Panel de administración, Fase 0 (cimientos). Solo AÑADE: no borra ni cambia datos existentes.
-- Reglas: RLS activo en TODA tabla · lectura SOLO para administradores · el cliente (navegador) nunca escribe aquí:
-- los eventos/errores/costos los inserta el SERVIDOR con la clave secreta (que salta RLS) · funciones security definer con search_path vacío.

-- ───────────── administradores ─────────────
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;  -- sin políticas: nadie la lee directo; solo la función es_admin()

create or replace function public.es_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- ───────────── eventos de uso (contrato de 36/60) ─────────────
create table public.event_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tipo text not null check (tipo ~ '^[a-z][a-z0-9_]{2,59}$'),
  user_id uuid references auth.users(id) on delete set null,
  sid text check (sid is null or char_length(sid) <= 64),     -- sesión anónima del navegador
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 2000),
  origen text not null default 'web' check (origen in ('web','servidor'))
);
create index event_log_tipo_fecha_idx on public.event_log (tipo, created_at desc);
create index event_log_user_fecha_idx on public.event_log (user_id, created_at desc) where user_id is not null;
create index event_log_fecha_idx on public.event_log (created_at desc);
alter table public.event_log enable row level security;
create policy event_log_admin_select on public.event_log for select to authenticated using ((select public.es_admin()));

-- ───────────── errores ─────────────
create table public.error_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  mensaje text not null check (char_length(mensaje) <= 500),
  contexto text check (contexto is null or char_length(contexto) <= 120),   -- pantalla o acción
  user_id uuid references auth.users(id) on delete set null,
  sid text check (sid is null or char_length(sid) <= 64),
  agente text check (agente is null or char_length(agente) <= 200),
  resuelto boolean not null default false
);
create index error_log_fecha_idx on public.error_log (created_at desc);
create index error_log_abiertos_idx on public.error_log (resuelto, created_at desc);
alter table public.error_log enable row level security;
create policy error_log_admin_select on public.error_log for select to authenticated using ((select public.es_admin()));
create policy error_log_admin_update on public.error_log for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

-- ───────────── costo real de IA (31) ─────────────
create table public.ai_calls (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  sid text check (sid is null or char_length(sid) <= 64),
  feature text not null default 'analisis_foto' check (char_length(feature) <= 40),
  modelo text check (modelo is null or char_length(modelo) <= 60),
  tokens_entrada int check (tokens_entrada is null or tokens_entrada >= 0),
  tokens_salida int check (tokens_salida is null or tokens_salida >= 0),
  costo_usd numeric(10,6) check (costo_usd is null or costo_usd >= 0),   -- null = precio no configurado ("Sin datos")
  duracion_ms int check (duracion_ms is null or duracion_ms >= 0),
  ok boolean not null default true,
  demo boolean not null default false,
  error text check (error is null or char_length(error) <= 200)
);
create index ai_calls_fecha_idx on public.ai_calls (created_at desc);
create index ai_calls_user_fecha_idx on public.ai_calls (user_id, created_at desc) where user_id is not null;
alter table public.ai_calls enable row level security;
create policy ai_calls_admin_select on public.ai_calls for select to authenticated using ((select public.es_admin()));

-- ───────────── ventas (las llena el webhook de Hotmart; hoy vacías = "Sin datos") ─────────────
create table public.hotmart_events (
  id bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  hotmart_event_id text unique,                          -- idempotencia: el mismo evento no se procesa dos veces
  tipo text not null check (char_length(tipo) <= 60),
  firma_ok boolean not null default false,
  procesado boolean not null default false,
  error text check (error is null or char_length(error) <= 300),
  payload jsonb not null default '{}'::jsonb
);
create index hotmart_events_fecha_idx on public.hotmart_events (received_at desc);
alter table public.hotmart_events enable row level security;
create policy hotmart_events_admin_select on public.hotmart_events for select to authenticated using ((select public.es_admin()));

create table public.ordenes (
  id uuid primary key default gen_random_uuid(),
  hotmart_transaccion text unique,
  user_id uuid references auth.users(id) on delete set null,
  email text check (email is null or char_length(email) <= 254),
  plan text check (plan in ('mensual','anual')),
  estado text not null default 'aprobada' check (estado in ('aprobada','prueba','cancelada','reembolsada','vencida','contracargo')),
  moneda char(3) not null check (moneda ~ '^[A-Z]{3}$'),                -- ISO 4217; NUNCA se suman monedas distintas
  bruto_minor bigint not null check (bruto_minor >= 0),                  -- unidad menor (centavos)
  comision_hotmart_minor bigint check (comision_hotmart_minor is null or comision_hotmart_minor >= 0),
  afiliado_minor bigint not null default 0 check (afiliado_minor >= 0),
  impuestos_minor bigint check (impuestos_minor is null or impuestos_minor >= 0),
  neto_minor bigint,                                                     -- null hasta conciliar con la liquidación
  canal text check (canal is null or char_length(canal) <= 40),
  tipo_baja text check (tipo_baja in ('voluntaria','involuntaria')),
  creada_en timestamptz not null default now(),
  cancelada_en timestamptz,
  reembolsada_en timestamptz
);
create index ordenes_fecha_idx on public.ordenes (creada_en desc);
create index ordenes_user_idx on public.ordenes (user_id) where user_id is not null;
alter table public.ordenes enable row level security;
create policy ordenes_admin_select on public.ordenes for select to authenticated using ((select public.es_admin()));

-- ───────────── gastos que ingresa la dueña ─────────────
create table public.acquisition_spend (
  id uuid primary key default gen_random_uuid(),
  canal text not null check (char_length(canal) between 1 and 40),
  monto_minor bigint not null check (monto_minor >= 0),
  moneda char(3) not null check (moneda ~ '^[A-Z]{3}$'),
  desde date not null,
  hasta date not null check (hasta >= desde),
  nota text check (nota is null or char_length(nota) <= 200),
  creado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.acquisition_spend enable row level security;
create policy acq_admin_all on public.acquisition_spend for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create table public.costos_fijos (
  id uuid primary key default gen_random_uuid(),
  concepto text not null check (char_length(concepto) between 1 and 60),   -- vercel, supabase, resend, dominio, otro…
  monto_minor bigint not null check (monto_minor >= 0),
  moneda char(3) not null check (moneda ~ '^[A-Z]{3}$'),
  desde date not null,
  hasta date check (hasta is null or hasta >= desde),
  nota text check (nota is null or char_length(nota) <= 200),
  created_at timestamptz not null default now()
);
alter table public.costos_fijos enable row level security;
create policy costos_admin_all on public.costos_fijos for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

-- ───────────── registro de auditoría: toda acción manual de la administradora ─────────────
create table public.admin_audit (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  admin_id uuid references auth.users(id) on delete set null,
  accion text not null check (char_length(accion) <= 60),
  objetivo text check (objetivo is null or char_length(objetivo) <= 254),
  detalle jsonb not null default '{}'::jsonb
);
create index admin_audit_fecha_idx on public.admin_audit (created_at desc);
alter table public.admin_audit enable row level security;
create policy admin_audit_select on public.admin_audit for select to authenticated using ((select public.es_admin()));

-- ───────────── columnas nuevas en tablas existentes ─────────────
alter table public.profiles add column if not exists source text check (source is null or char_length(source) <= 40);          -- origen del cliente (UTM / afiliado)
alter table public.profiles add column if not exists creado_via text not null default 'registro' check (creado_via in ('registro','admin'));
alter table public.entitlements add column if not exists motivo text check (motivo is null or char_length(motivo) <= 200);
alter table public.entitlements add column if not exists otorgado_por uuid references auth.users(id) on delete set null;
alter table public.entitlements drop constraint if exists entitlements_plan_check;
alter table public.entitlements add constraint entitlements_plan_check check (plan in ('free','mensual','anual','cortesia'));

-- Nadie del navegador (anon) toca nada de esto.
revoke all on public.admins, public.event_log, public.error_log, public.ai_calls, public.hotmart_events, public.ordenes, public.acquisition_spend, public.costos_fijos, public.admin_audit from anon;
