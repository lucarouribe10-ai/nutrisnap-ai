// Lógica PURA del aviso (webhook) de Hotmart: sin base de datos ni red, para poder probarla sola.
import crypto from 'node:crypto';

export type EstadoAcceso = 'prueba' | 'activo' | 'cancelado' | 'vencido' | 'reembolsado';

export type EventoInterpretado = {
  evento: string;
  eventoId: string;
  transaccion: string | null;
  email: string | null;
  productoId: string | null;
  oferta: string | null;
  /** Estado al que lleva el evento, o null si es informativo (no cambia el acceso). */
  estado: EstadoAcceso | null;
  baja: 'contracargo' | null;
  valorMinor: number | null;
  moneda: string | null;
  proximoCobroMs: number | null;
};

const GRACIA_MS = 3 * 86_400_000; // 3 días de gracia si un cobro se atrasa
export const DIAS_PRUEBA = 7;

/** Compara dos textos en tiempo constante (anti timing-attack). */
export function iguales(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a, 'utf8').digest();
  const hb = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(ha, hb);
}

const texto = (v: unknown, max = 200): string | null => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : typeof v === 'number' ? String(v) : null);
const numero = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string, any>;
const obj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {});

/**
 * Lee el JSON de Hotmart (formato 2.0) y decide a qué estado lleva.
 * ⚠️ POR VERIFICAR con una compra de prueba real: cómo marca Hotmart el INICIO de la prueba gratis.
 * Aquí se asume que llega como PURCHASE_APPROVED con valor 0 → «prueba»; con valor > 0 → «activo».
 */
export function interpretarEvento(payload: unknown): EventoInterpretado {
  const p = obj(payload);
  const d = obj(p.data);
  const compra = obj(d.purchase);
  const suscripcion = obj(d.subscription);
  const evento = texto(p.event, 60) ?? 'DESCONOCIDO';
  const transaccion = texto(compra.transaction, 60);
  const email = texto(obj(d.buyer).email, 254)?.toLowerCase() ?? null;
  const productoId = texto(obj(d.product).id, 40);
  const oferta = texto(obj(compra.offer).code, 40);
  const precio = obj(compra.price);
  const valor = numero(precio.value);
  const moneda = texto(precio.currency_value, 3)?.toUpperCase() ?? null;
  const proximoCobroMs = numero(compra.date_next_charge) ?? numero(suscripcion.date_next_charge);

  let estado: EstadoAcceso | null = null;
  let baja: 'contracargo' | null = null;
  switch (evento) {
    case 'PURCHASE_APPROVED':
    case 'PURCHASE_COMPLETE':
      estado = valor !== null && valor === 0 ? 'prueba' : 'activo';
      break;
    case 'PURCHASE_DELAYED':
      estado = 'activo'; // se mantiene con gracia (ver renuevaEl); no se corta de golpe
      break;
    case 'SUBSCRIPTION_CANCELLATION':
    case 'PURCHASE_CANCELED':
      estado = 'cancelado';
      break;
    case 'PURCHASE_EXPIRED':
      estado = 'vencido';
      break;
    case 'PURCHASE_REFUNDED':
      estado = 'reembolsado';
      break;
    case 'PURCHASE_CHARGEBACK':
      estado = 'reembolsado';
      baja = 'contracargo';
      break;
    default:
      estado = null; // informativo (p. ej. SWITCH_PLAN se registra pero no cambia el acceso aquí)
  }

  const id = texto(p.id, 100) ?? `${evento}:${transaccion ?? ''}:${texto(p.creation_date, 20) ?? ''}`;
  return { evento, eventoId: id, transaccion, email, productoId, oferta, estado, baja, valorMinor: valor === null ? null : Math.round(valor * 100), moneda, proximoCobroMs };
}

/** Hasta cuándo vale el acceso que da este evento (null = no cambia). */
export function renuevaEl(e: EventoInterpretado, plan: 'mensual' | 'anual' | null, ahoraMs: number): { renueva: number | null; pruebaHasta: number | null } {
  if (e.estado === 'prueba') {
    const fin = ahoraMs + DIAS_PRUEBA * 86_400_000;
    return { renueva: (e.proximoCobroMs ?? fin) + GRACIA_MS, pruebaHasta: fin };
  }
  if (e.estado === 'activo') {
    const largo = plan === 'anual' ? 368 : 33; // sin fecha de próximo cobro: periodo + gracia
    const base = e.evento === 'PURCHASE_DELAYED' ? ahoraMs + GRACIA_MS : (e.proximoCobroMs ?? ahoraMs + largo * 86_400_000 - GRACIA_MS) + GRACIA_MS;
    return { renueva: base, pruebaHasta: null };
  }
  if (e.estado === 'vencido' || e.estado === 'reembolsado') return { renueva: ahoraMs, pruebaHasta: null };
  return { renueva: null, pruebaHasta: null }; // cancelado: conserva el acceso hasta la fecha que ya tenía
}

/** ¿Esta persona tiene acceso al plan de pago ahora? Misma regla en toda la app. */
export function accesoVigente(e: { plan: string; estado: string; renueva_el: string | null } | null | undefined, ahoraMs = Date.now()): boolean {
  if (!e) return false;
  const vigente = e.renueva_el === null || new Date(e.renueva_el).getTime() > ahoraMs;
  if (e.estado === 'activo' || e.estado === 'prueba' || e.estado === 'cancelado') return vigente && !(e.estado !== 'cancelado' && e.plan === 'free');
  return false;
}
