const es = 'es-CO';

export const fechaCorta = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat(es, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—';

/** «hace 3 h», «hace 2 días», «nunca» — lenguaje de persona, no de ingeniero. */
export function hace(iso: string | null | undefined): string {
  if (!iso) return 'nunca';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return 'hace un momento';
  if (s < 3600) return `hace ${Math.round(s / 60)} min`;
  if (s < 86400) return `hace ${Math.round(s / 3600)} h`;
  const d = Math.round(s / 86400);
  return d === 1 ? 'hace 1 día' : d < 60 ? `hace ${d} días` : fechaCorta(iso);
}

/** Número en formato es-CO (coma decimal, punto de miles). */
export const num = (n: number, dec = 0) => new Intl.NumberFormat(es, { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);

/** Dólares legibles con la moneda escrita («USD 0,62»): los montos diminutos (una foto cuesta menos de un centavo) llevan 4 decimales para no leerse como «0,00». */
export const usd = (n: number) => {
  const chico = n > 0 && n < 0.01;
  const dec = chico ? 4 : n < 10 ? 2 : 0;
  return `USD ${num(n, dec)}`;
};

/** Rango de fechas real de «los últimos N días», p. ej. «13 nov – 18 nov 2026». */
export function rangoDias(dias: number): string {
  const fin = new Date();
  const ini = new Date(Date.now() - (dias - 1) * 86_400_000);
  const corta = new Intl.DateTimeFormat(es, { day: 'numeric', month: 'short' });
  return `${corta.format(ini)} – ${new Intl.DateTimeFormat(es, { day: 'numeric', month: 'short', year: 'numeric' }).format(fin)}`;
}

/** Traduce el mensaje técnico de un error a una frase que entienda una persona no técnica. El mensaje original se conserva aparte. */
export function errorClaro(mensaje: string): string {
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(mensaje)) return 'Se cortó la conexión mientras la app guardaba o pedía algo';
  if (/chunk|dynamically imported module|loading css/i.test(mensaje)) return 'La app no pudo cargar una pieza (suele pasar justo después de una actualización)';
  if (/hydrat/i.test(mensaje)) return 'Una pantalla se dibujó distinto de lo esperado';
  if (/cannot read|undefined|is not a function|null/i.test(mensaje)) return 'Una pantalla intentó usar un dato que no existía';
  if (/quota|storage/i.test(mensaje)) return 'El navegador no dejó guardar datos en el celular';
  return 'Algo falló en la app';
}

export const mesYAnio = () => new Intl.DateTimeFormat(es, { month: 'long', year: 'numeric' }).format(new Date());

/** Importe en unidad menor + moneda ISO: nunca se mezclan monedas. */
export const dinero = (minor: number, moneda: string) => `${moneda} ${num(minor / (moneda === 'COP' ? 1 : 100), moneda === 'COP' ? 0 : 2)}`;

export const inicioDeMes = () => { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString(); };
