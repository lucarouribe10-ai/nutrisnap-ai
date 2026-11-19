import { NextResponse, type NextRequest } from 'next/server';
import { adminDisponible, createAdminClient } from '@/lib/supabase/admin';
import { iguales, interpretarEvento, renuevaEl } from '@/lib/hotmart-eventos';
import { OFERTAS, PRODUCTO_ID_POR_DEFECTO } from '@/lib/hotmart';
import { ipDe, limitado } from '@/lib/servidor/limite';

/**
 * Aviso automático (webhook) de Hotmart. Orden obligatorio:
 *   límite de intentos → cuerpo crudo → AUTENTICIDAD (hottok, tiempo constante) → catálogo (producto y oferta permitidos)
 *   → crear la cuenta si hace falta (ANTES de marcar el aviso como procesado) → aplicar de forma atómica e idempotente.
 * Si algo falla DESPUÉS de autenticar, responde 500 para que Hotmart reintente (nunca 200 con un fallo real).
 * No se guarda el cuerpo completo ni el correo en los registros.
 */
export async function POST(req: NextRequest) {
  if (limitado(`hm:${ipDe(req)}`, 300, 60_000)) return new Response(null, { status: 429 });
  const crudo = await req.text();
  if (crudo.length > 200_000) return new Response(null, { status: 413 });

  // Sin hottok configurado el endpoint NO opera (falla cerrado).
  const secreto = process.env.HOTMART_HOTTOK;
  if (!secreto || !adminDisponible()) {
    console.error('[hotmart] webhook sin configurar: falta HOTMART_HOTTOK o la clave secreta de Supabase');
    return NextResponse.json({ error: 'no_disponible' }, { status: 503 });
  }

  let json: unknown = null;
  try { json = JSON.parse(crudo); } catch { /* se valida abajo */ }
  const recibido = req.headers.get('x-hotmart-hottok') ?? (typeof (json as { hottok?: unknown } | null)?.hottok === 'string' ? (json as { hottok: string }).hottok : '');
  const adm = createAdminClient();

  if (!recibido || !iguales(recibido, secreto)) {
    // Se deja constancia (con tope) para que el panel de Salud muestre intentos no autorizados; respuesta genérica.
    if (!limitado(`hm-mal:${ipDe(req)}`, 20, 60_000)) {
      await adm.from('hotmart_events').insert({ tipo: 'no_autorizado', firma_ok: false, procesado: false, error: 'hottok incorrecto', payload: {} });
    }
    return NextResponse.json({ error: 'no_autorizado' }, { status: 401 });
  }
  if (json === null || typeof json !== 'object') return NextResponse.json({ error: 'cuerpo_invalido' }, { status: 400 });

  const ev = interpretarEvento(json);
  const productos = (process.env.HOTMART_PRODUCT_IDS ?? PRODUCTO_ID_POR_DEFECTO).split(',').map((s) => s.trim());
  const registrar = (error: string) => adm.from('hotmart_events').insert({ hotmart_event_id: ev.eventoId, tipo: ev.evento.slice(0, 60), firma_ok: true, procesado: false, error, payload: { transaccion: ev.transaccion, producto: ev.productoId, oferta: ev.oferta } });

  // Catálogo: solo nuestro producto. Un aviso de otro producto no es nuestro: se anota y se responde 200 (no se reintenta).
  if (!ev.productoId || !productos.includes(ev.productoId)) {
    await registrar('producto_ajeno');
    return NextResponse.json({ received: true, ignored: 'producto' });
  }
  const plan = ev.oferta ? (OFERTAS[ev.oferta] ?? null) : null;
  const daAcceso = ev.estado === 'activo' || ev.estado === 'prueba';
  if (daAcceso && !plan) {
    await registrar('oferta_desconocida'); // nunca se da acceso por una oferta que no está en la lista
    return NextResponse.json({ received: true, ignored: 'oferta' });
  }

  try {
    // Cuenta de la persona (por correo). Si compra y aún no existe, se crea SIN enviar correo: entra después con su código.
    let userId: string | null = null;
    if (ev.email) {
      const { data: existente, error: errBuscar } = await adm.rpc('buscar_usuario_por_email', { p_email: ev.email });
      if (errBuscar) throw new Error(`buscar: ${errBuscar.code}`);
      userId = (existente as string | null) ?? null;
      if (!userId && daAcceso) {
        const creada = await adm.auth.admin.createUser({ email: ev.email, email_confirm: true });
        if (creada.error) {
          // Carrera con otro aviso del mismo correo: se vuelve a buscar.
          const { data: otra } = await adm.rpc('buscar_usuario_por_email', { p_email: ev.email });
          userId = (otra as string | null) ?? null;
          if (!userId) throw new Error(`crear: ${creada.error.status}`);
        } else {
          userId = creada.data.user.id;
        }
      }
    }

    const { renueva, pruebaHasta } = renuevaEl(ev, plan, Date.now());
    const { data, error } = await adm.rpc('aplicar_evento_hotmart', {
      p_evento_id: ev.eventoId, p_tipo: ev.evento, p_transaccion: ev.transaccion, p_user_id: userId, p_email: ev.email ?? '',
      p_plan: plan, p_estado: ev.estado, p_renueva_el: renueva === null ? null : new Date(renueva).toISOString(),
      p_prueba_hasta: pruebaHasta === null ? null : new Date(pruebaHasta).toISOString(),
      p_moneda: ev.moneda, p_bruto_minor: ev.valorMinor, p_baja: ev.baja,
      p_payload: { transaccion: ev.transaccion, producto: ev.productoId, oferta: ev.oferta, plan, estado: ev.estado, moneda: ev.moneda, valor_minor: ev.valorMinor },
    });
    if (error) throw new Error(`aplicar: ${error.code}`);
    return NextResponse.json({ received: true, result: (data as { status?: string } | null)?.status ?? 'ok' });
  } catch (e) {
    console.error('[hotmart] falló el procesamiento:', ev.evento, e instanceof Error ? e.message : 'desconocido');
    return NextResponse.json({ error: 'fallo_de_procesamiento' }, { status: 500 }); // Hotmart reintenta
  }
}
