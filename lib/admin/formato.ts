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

export const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: n < 10 ? 2 : 0, maximumFractionDigits: n < 10 ? 2 : 0 }).format(n);

/** Importe en unidad menor + moneda ISO: nunca se mezclan monedas. */
export const dinero = (minor: number, moneda: string) => new Intl.NumberFormat(es, { style: 'currency', currency: moneda, maximumFractionDigits: moneda === 'COP' ? 0 : 2 }).format(minor / (moneda === 'COP' ? 1 : 100));

export const inicioDeMes = () => { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString(); };
