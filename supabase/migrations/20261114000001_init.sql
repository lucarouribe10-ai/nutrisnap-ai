-- NutriSnap AI — esquema inicial (Etapa 6). Modelo B2C: todo dato pertenece a UNA persona (user_id).
-- Reglas del SO (25/09): RLS activo en TODA tabla · políticas por comando con (select auth.uid()) · columna de la política indexada
-- · funciones security definer en schema private con search_path vacío · el cliente NUNCA escribe permisos ni consumo de IA.

create schema if not exists private;

-- ───────────── utilidades ─────────────
create or replace function private.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

-- ───────────── perfiles (respuestas del onboarding y plan) ─────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text check (nombre is null or char_length(nombre) <= 40),
  perfil jsonb not null default '{}'::jsonb,        -- objetivo, sexo, edad, estatura, peso, actividad, dolor (onboarding)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();

-- ───────────── estado de la app (gamificación: XP, racha, escudos, logros) ─────────────
create table public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version int not null default 3,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger app_state_set_updated_at before update on public.app_state for each row execute function private.set_updated_at();

-- ───────────── comidas ─────────────
create table public.comidas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consumida_en timestamptz not null default now(),
  titulo text not null check (char_length(titulo) between 1 and 80),
  kcal int not null check (kcal between 0 and 5000),
  proteina_g numeric(6,1) not null default 0 check (proteina_g between 0 and 500),
  carbos_g numeric(6,1) not null default 0 check (carbos_g between 0 and 800),
  grasas_g numeric(6,1) not null default 0 check (grasas_g between 0 and 500),
  aceite_kcal int not null default 0 check (aceite_kcal between 0 and 1000),   -- lo atrapado por el Chequeo de Grasas Ocultas
  fuente text not null default 'foto' check (fuente in ('foto','rapido','codigo','etiqueta')),
  nota text check (nota is null or char_length(nota) <= 200),
  foto_path text,                                                              -- ruta en Storage (privado); nunca una URL pública
  created_at timestamptz not null default now()
);
create index comidas_user_fecha_idx on public.comidas (user_id, consumida_en desc);

-- ───────────── pesos ─────────────
create table public.pesos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medido_en date not null default current_date,
  kg numeric(5,1) not null check (kg between 25 and 400),
  created_at timestamptz not null default now(),
  unique (user_id, medido_en)
);
create index pesos_user_fecha_idx on public.pesos (user_id, medido_en desc);

-- ───────────── consumo de IA (tope de 8 fotos/día y costo real) — SOLO lo escribe el servidor ─────────────
create table public.ia_usos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  usado_en timestamptz not null default now(),
  modelo text,
  tokens_entrada int,
  tokens_salida int,
  costo_usd numeric(8,5)
);
create index ia_usos_user_fecha_idx on public.ia_usos (user_id, usado_en desc);

-- ───────────── permisos de acceso (plan, prueba, cobro) — SOLO lo escribe el servidor (webhook de Hotmart) ─────────────
create table public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','mensual','anual')),
  estado text not null default 'ninguno' check (estado in ('ninguno','prueba','activo','vencido','cancelado','reembolsado')),
  prueba_hasta timestamptz,
  renueva_el timestamptz,
  hotmart_transaccion text unique,
  updated_at timestamptz not null default now()
);
create trigger entitlements_set_updated_at before update on public.entitlements for each row execute function private.set_updated_at();

-- ───────────── al registrarse: crear perfil y permiso 'free' (escáner gratis) ─────────────
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.entitlements (user_id) values (new.id) on conflict do nothing;
  insert into public.app_state (user_id) values (new.id) on conflict do nothing;
  return new;
end; $$;
revoke execute on function private.handle_new_user() from anon, authenticated, public;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

-- ───────────── RLS: activo en TODAS ─────────────
alter table public.profiles enable row level security;
alter table public.app_state enable row level security;
alter table public.comidas enable row level security;
alter table public.pesos enable row level security;
alter table public.ia_usos enable row level security;
alter table public.entitlements enable row level security;

-- profiles
create policy profiles_select_own on public.profiles for select using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles for insert with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- app_state
create policy app_state_select_own on public.app_state for select using ((select auth.uid()) = user_id);
create policy app_state_insert_own on public.app_state for insert with check ((select auth.uid()) = user_id);
create policy app_state_update_own on public.app_state for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- comidas
create policy comidas_select_own on public.comidas for select using ((select auth.uid()) = user_id);
create policy comidas_insert_own on public.comidas for insert with check ((select auth.uid()) = user_id);
create policy comidas_update_own on public.comidas for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy comidas_delete_own on public.comidas for delete using ((select auth.uid()) = user_id);
-- pesos
create policy pesos_select_own on public.pesos for select using ((select auth.uid()) = user_id);
create policy pesos_insert_own on public.pesos for insert with check ((select auth.uid()) = user_id);
create policy pesos_update_own on public.pesos for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy pesos_delete_own on public.pesos for delete using ((select auth.uid()) = user_id);
-- ia_usos y entitlements: la persona SOLO puede leer lo suyo; nunca escribir (sin políticas de insert/update/delete = denegado)
create policy ia_usos_select_own on public.ia_usos for select using ((select auth.uid()) = user_id);
create policy entitlements_select_own on public.entitlements for select using ((select auth.uid()) = user_id);

-- Sin acceso para el rol anónimo en ninguna tabla.
revoke all on public.profiles, public.app_state, public.comidas, public.pesos, public.ia_usos, public.entitlements from anon;
