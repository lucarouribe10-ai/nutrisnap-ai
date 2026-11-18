-- Panel de administración, Fase 1: lecturas agregadas sobre auth.users (que la API normal no expone).
-- Cada función verifica es_admin() DENTRO: una persona normal recibe error de permiso aunque llame al endpoint directo.

create or replace function public.admin_resumen() returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r jsonb;
begin
  if not public.es_admin() then raise exception 'no autorizado' using errcode = '42501'; end if;
  select jsonb_build_object(
    'usuarios_total',   (select count(*) from auth.users),
    'nuevos_7d',        (select count(*) from auth.users where created_at >= now() - interval '7 days'),
    'activos_7d',       (select count(*) from auth.users where last_sign_in_at >= now() - interval '7 days'),
    'activos_30d',      (select count(*) from auth.users where last_sign_in_at >= now() - interval '30 days'),
    'con_datos',        (select count(*) from public.app_state where coalesce(data->>'demo','true') = 'false'),
    'con_acceso',       (select count(*) from public.entitlements where estado in ('activo','prueba') and (renueva_el is null or renueva_el > now())),
    'eventos_24h',      (select count(*) from public.event_log where created_at >= now() - interval '24 hours'),
    'errores_abiertos', (select count(*) from public.error_log where not resuelto and created_at >= now() - interval '7 days')
  ) into r;
  return r;
end $$;
revoke execute on function public.admin_resumen() from public, anon;
grant execute on function public.admin_resumen() to authenticated;

create or replace function public.admin_listar_usuarios(buscar text default null, limite int default 50, desplazamiento int default 0)
returns table (id uuid, email text, nombre text, creado_en timestamptz, ultimo_acceso timestamptz, plan text, estado text, renueva_el timestamptz, motivo text, creado_via text, es_admin boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'no autorizado' using errcode = '42501'; end if;
  return query
    select u.id, u.email::text, p.nombre, u.created_at, u.last_sign_in_at,
           coalesce(e.plan, 'free'), coalesce(e.estado, 'ninguno'), e.renueva_el, e.motivo,
           coalesce(p.creado_via, 'registro'), exists (select 1 from public.admins a where a.user_id = u.id)
    from auth.users u
    left join public.profiles p on p.id = u.id
    left join public.entitlements e on e.user_id = u.id
    where buscar is null or buscar = '' or u.email ilike '%' || replace(replace(buscar, '%', ''), '_', '') || '%' or coalesce(p.nombre, '') ilike '%' || replace(replace(buscar, '%', ''), '_', '') || '%'
    order by u.created_at desc
    limit greatest(1, least(coalesce(limite, 50), 200)) offset greatest(0, coalesce(desplazamiento, 0));
end $$;
revoke execute on function public.admin_listar_usuarios(text, int, int) from public, anon;
grant execute on function public.admin_listar_usuarios(text, int, int) to authenticated;
