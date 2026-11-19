/**
 * Páginas de pago de Hotmart (públicas por diseño). Mensual y anual del producto NutriSnap.
 * VENTA_ACTIVA es un interruptor: mientras esté apagado, el botón de la pantalla de planes sigue yendo al login
 * (para no cobrar a nadie antes de que el aviso automático de Hotmart y el envío de códigos funcionen).
 * Se enciende poniendo NEXT_PUBLIC_VENTA_ACTIVA=1 en Vercel.
 */
export const CHECKOUT = {
  mensual: 'https://pay.hotmart.com/V108568529T?off=nqzy8nwo',
  anual: 'https://pay.hotmart.com/V108568529T?off=fv0tec1c',
} as const;

export const VENTA_ACTIVA = process.env.NEXT_PUBLIC_VENTA_ACTIVA === '1';

/** Arma la URL de pago con URL/URLSearchParams: `sck` lleva el identificador anónimo para conciliar la compra con la cuenta. */
export function urlDePago(plan: 'mensual' | 'anual', sck?: string): string {
  const u = new URL(CHECKOUT[plan]);
  if (sck) u.searchParams.set('sck', sck.slice(0, 64));
  return u.toString();
}
