import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin/guard';
import { inicioDeMes } from '@/lib/admin/formato';
import { IaVista, type DatosIa } from '@/components/admin/vistas/IaVista';

type Llamada = { created_at: string; costo_usd: number | null; ok: boolean; duracion_ms: number | null; user_id: string | null; demo: boolean };

async function Contenido() {
  const { supabase } = await requireAdmin();
  const mes = inicioDeMes();
  const hace14 = new Date(Date.now() - 14 * 86_400_000).toISOString();
  const [llamR, ordR] = await Promise.all([
    supabase.from('ai_calls').select('created_at,costo_usd,ok,duracion_ms,user_id,demo').gte('created_at', hace14 < mes ? hace14 : mes).order('created_at', { ascending: false }).limit(20000),
    supabase.from('ordenes').select('moneda,bruto_minor,estado').gte('creada_en', mes).limit(5000),
  ]);
  const reales = ((llamR.data ?? []) as Llamada[]).filter((c) => !c.demo);
  const delMes = reales.filter((c) => c.created_at >= mes);
  const hoyIso = new Date(new Date().toISOString().slice(0, 10)).toISOString();
  const deHoy = reales.filter((c) => c.created_at >= hoyIso);
  const suma = (l: Llamada[]) => l.filter((c) => c.costo_usd !== null).reduce((t, c) => t + Number(c.costo_usd), 0);
  const conPrecio = (l: Llamada[]) => l.filter((c) => c.costo_usd !== null).length;
  const ms = delMes.filter((c) => c.duracion_ms !== null);

  // Ingresos del mes en USD solo si TODOS están en USD (nunca se mezclan monedas).
  const ventas = (ordR.data ?? []).filter((o) => o.estado === 'aprobada' || o.estado === 'prueba');
  const soloUsd = ventas.length > 0 && ventas.every((o) => o.moneda === 'USD');
  const ingresosUsd = soloUsd ? ventas.reduce((t, o) => t + Number(o.bruto_minor), 0) / 100 : null;

  // Por día: del más viejo al más nuevo, 14 días.
  const corta = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });
  const porDia = Array.from({ length: 14 }, (_, k) => new Date(Date.now() - (13 - k) * 86_400_000).toISOString().slice(0, 10)).map((d) => {
    const l = reales.filter((c) => c.created_at.slice(0, 10) === d);
    return { etiqueta: corta.format(new Date(`${d}T12:00:00`)), n: l.length, costo: suma(l), con: conPrecio(l) };
  });

  const datos: DatosIa = {
    llamadasMes: delMes.length,
    conPrecioMes: conPrecio(delMes),
    costoMes: suma(delMes),
    llamadasHoy: deHoy.length,
    conPrecioHoy: conPrecio(deHoy),
    costoHoy: suma(deHoy),
    fallidas: delMes.filter((c) => !c.ok).length,
    promedioMs: ms.length ? Math.round(ms.reduce((t, c) => t + Number(c.duracion_ms), 0) / ms.length) : null,
    pctIngresos: ingresosUsd && ingresosUsd > 0 ? (suma(delMes) / ingresosUsd) * 100 : null,
    precioConfigurado: Number(process.env.AI_PRICE_IN_USD_PER_MTOK) > 0 && Number(process.env.AI_PRICE_OUT_USD_PER_MTOK) > 0,
    hayReales: reales.length > 0,
    porDia,
  };
  return <IaVista d={datos} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido />
    </Suspense>
  );
}
