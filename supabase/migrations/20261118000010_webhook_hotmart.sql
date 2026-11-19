-- Webhook de Hotmart: búsqueda de la cuenta por correo y aplicación ATÓMICA de cada aviso (idempotente por id de evento).
-- Solo las puede ejecutar el servidor (clave secreta); ni anónimos ni personas con sesión.

create or replace function public.buscar_usuario_por_email(p_email text) returns uuid
language sql stable security definer set search_path = '' as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1
$$;
revoke execute on function public.buscar_usuario_por_email(text) from public, anon, authenticated;
grant execute on function public.buscar_usuario_por_email(text) to service_role;

create or replace function public.aplicar_evento_hotmart(
  p_evento_id text, p_tipo text, p_transaccion text, p_user_id uuid, p_email text,
  p_plan text, p_estado text, p_renueva_el timestamptz, p_prueba_hasta timestamptz,
  p_moneda text, p_bruto_minor bigint, p_baja text, p_payload jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_insertado bigint;
  v_actual record;
  v_estado_orden text;
begin
  -- (1) IDEMPOTENCIA: el mismo aviso (reintentos de Hotmart) no se aplica dos veces.
  insert into public.hotmart_events (hotmart_event_id, tipo, firma_ok, procesado, payload)
  values (p_evento_id, left(p_tipo, 60), true, true, coalesce(p_payload, '{}'::jsonb))
  on conflict (hotmart_event_id) do nothing
  returning id into v_insertado;
  if v_insertado is null then return jsonb_build_object('status', 'duplicate'); end if;

  -- Aviso informativo, o sin cuenta a la que aplicarlo (p. ej. un reembolso de alguien que nunca entró): solo queda registrado.
  if p_estado is null or p_user_id is null then
    return jsonb_build_object('status', 'applied', 'cambio', false);
  end if;

  select * into v_actual from public.entitlements where user_id = p_user_id for update;

  -- (2) TRANSICIÓN LEGAL: un aviso viejo reenviado NO resucita un reembolso de la misma compra.
  if v_actual.estado = 'reembolsado' and p_estado in ('activo', 'prueba') and v_actual.hotmart_transaccion is not distinct from p_transaccion then
    update public.hotmart_events set error = 'transicion_ilegal', procesado = false where id = v_insertado;
    return jsonb_build_object('status', 'illegal');
  end if;

  -- (3) Registro económico de la compra (una fila por transacción de Hotmart).
  if p_transaccion is not null and p_moneda is not null then
    v_estado_orden := case
      when p_baja = 'contracargo' then 'contracargo'
      when p_estado = 'prueba' then 'prueba'
      when p_estado = 'activo' then 'aprobada'
      when p_estado = 'cancelado' then 'cancelada'
      when p_estado = 'vencido' then 'vencida'
      else 'reembolsada' end;
    insert into public.ordenes (hotmart_transaccion, user_id, email, plan, estado, moneda, bruto_minor, cancelada_en, reembolsada_en)
    values (p_transaccion, p_user_id, left(p_email, 254), p_plan, v_estado_orden, p_moneda, coalesce(p_bruto_minor, 0),
            case when p_estado = 'cancelado' then now() end, case when p_estado = 'reembolsado' then now() end)
    on conflict (hotmart_transaccion) do update
      set estado = excluded.estado,
          cancelada_en = coalesce(excluded.cancelada_en, public.ordenes.cancelada_en),
          reembolsada_en = coalesce(excluded.reembolsada_en, public.ordenes.reembolsada_en);
  end if;

  -- (4) Acceso de la persona.
  insert into public.entitlements (user_id, plan, estado, prueba_hasta, renueva_el, hotmart_transaccion, motivo)
  values (p_user_id, coalesce(p_plan, 'mensual'), p_estado, p_prueba_hasta, p_renueva_el, p_transaccion, left('Hotmart: ' || p_tipo, 200))
  on conflict (user_id) do update
    set plan = coalesce(p_plan, public.entitlements.plan),
        estado = p_estado,
        prueba_hasta = coalesce(p_prueba_hasta, public.entitlements.prueba_hasta),
        renueva_el = coalesce(p_renueva_el, public.entitlements.renueva_el),
        hotmart_transaccion = coalesce(p_transaccion, public.entitlements.hotmart_transaccion),
        motivo = left('Hotmart: ' || p_tipo, 200),
        otorgado_por = null;

  return jsonb_build_object('status', 'applied', 'cambio', true, 'estado', p_estado);
end $$;
revoke execute on function public.aplicar_evento_hotmart(text, text, text, uuid, text, text, text, timestamptz, timestamptz, text, bigint, text, jsonb) from public, anon, authenticated;
grant execute on function public.aplicar_evento_hotmart(text, text, text, uuid, text, text, text, timestamptz, timestamptz, text, bigint, text, jsonb) to service_role;
