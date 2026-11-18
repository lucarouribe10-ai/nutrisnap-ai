-- La función es_admin() pasa a SECURITY INVOKER: la lectura de `admins` queda protegida por su propia política
-- (cada persona solo ve SU fila), así ya no hay una función definer ejecutable desde la API.
create or replace function public.es_admin() returns boolean language sql stable security invoker set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;
create policy admins_ver_la_propia on public.admins for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admins to authenticated;
