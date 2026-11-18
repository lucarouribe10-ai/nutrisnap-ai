-- Panel Fase 2: embudo del recorrido, comidas registradas, activación, retención D1/D7/D30 y sesiones. Solo administradoras.
create or replace function public.admin_uso(dias int default 30) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r jsonb; d int := greatest(1, least(coalesce(dias, 30), 365));
begin
  if not public.es_admin() then raise exception 'no autorizado' using errcode = '42501'; end if;
  select jsonb_build_object(
    'dias', d,
    'embudo', (
      select coalesce(jsonb_agg(jsonb_build_object('evento', e.tipo, 'personas', coalesce(c.n, 0)) order by e.ord), '[]'::jsonb)
      from (values ('landing_vista',1),('onboarding_iniciado',2),('resultado_visto',3),('chequeo_respondido',4),('plan_construido',5),('paywall_visto',6),('checkout_iniciado',7),('login_exitoso',8)) as e(tipo, ord)
      left join (select tipo, count(distinct coalesce(sid, user_id::text)) as n from public.event_log where created_at >= now() - make_interval(days => d) group by tipo) c on c.tipo = e.tipo
    ),
    'comidas', jsonb_build_object(
      'hoy', (select count(*) from public.event_log where tipo = 'comida_registrada' and created_at >= date_trunc('day', now())),
      'semana', (select count(*) from public.event_log where tipo = 'comida_registrada' and created_at >= now() - interval '7 days'),
      'periodo', (select count(*) from public.event_log where tipo = 'comida_registrada' and created_at >= now() - make_interval(days => d)),
      'por_foto', (select count(*) from public.event_log where tipo = 'comida_registrada' and props->>'via' = 'foto' and created_at >= now() - make_interval(days => d)),
      'rapidas', (select count(*) from public.event_log where tipo = 'comida_registrada' and props->>'via' = 'rapido' and created_at >= now() - make_interval(days => d))
    ),
    'activacion', jsonb_build_object(
      'cuentas', (select count(*) from auth.users where created_at >= now() - make_interval(days => d)),
      'activadas', (select count(*) from auth.users u where u.created_at >= now() - make_interval(days => d) and exists (select 1 from public.event_log e where e.user_id = u.id and e.tipo = 'comida_registrada'))
    ),
    'retencion', (
      select coalesce(jsonb_agg(jsonb_build_object('dia', n.n, 'elegibles', (select count(*) from auth.users u where u.created_at <= now() - make_interval(days => n.n)),
        'volvieron', (select count(*) from auth.users u where u.created_at <= now() - make_interval(days => n.n) and exists (select 1 from public.event_log e where e.user_id = u.id and e.created_at >= u.created_at + make_interval(days => n.n) and e.created_at < u.created_at + make_interval(days => n.n + 1)))
      ) order by n.n), '[]'::jsonb)
      from (values (1),(7),(30)) as n(n)
    ),
    'sesiones', jsonb_build_object(
      'hoy', (select count(distinct user_id) from public.event_log where tipo = 'sesion_iniciada' and user_id is not null and created_at >= now() - interval '24 hours'),
      'semana', (select count(distinct user_id) from public.event_log where tipo = 'sesion_iniciada' and user_id is not null and created_at >= now() - interval '7 days'),
      'mes', (select count(distinct user_id) from public.event_log where tipo = 'sesion_iniciada' and user_id is not null and created_at >= now() - interval '30 days')
    )
  ) into r;
  return r;
end $$;
revoke execute on function public.admin_uso(int) from public, anon;
grant execute on function public.admin_uso(int) to authenticated;
