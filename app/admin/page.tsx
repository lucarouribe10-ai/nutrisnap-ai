import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin/guard';
import { inicioDeMes, mesYAnio } from '@/lib/admin/formato';
import { ResumenVista, type DatosResumen } from '@/components/admin/vistas/ResumenVista';

async function Contenido() {
  const { supabase } = await requireAdmin();
  const mes = inicioDeMes();
  const [resumenR, ordenesR, iaR] = await Promise.all([
    supabase.rpc('admin_resumen'),
    supabase.from('ordenes').select('moneda,bruto_minor,estado').gte('creada_en', mes).limit(5000),
    supabase.from('ai_calls').select('costo_usd,ok,demo').gte('created_at', mes).limit(20000),
  ]);

  // Ingresos del mes por moneda (nunca se mezclan monedas). Solo cuentan ventas aprobadas.
  const ventas = (ordenesR.data ?? []).filter((o) => o.estado === 'aprobada' || o.estado === 'prueba');
  const porMoneda = new Map<string, number>();
  for (const o of ventas) porMoneda.set(o.moneda, (porMoneda.get(o.moneda) ?? 0) + Number(o.bruto_minor));

  // Costo de IA del mes: solo llamadas reales (las de ejemplo no cuestan) con precio configurado; si hay llamadas sin precio se dice.
  const llamadas = (iaR.data ?? []).filter((c) => !c.demo);
  const conCosto = llamadas.filter((c) => c.costo_usd !== null);

  const datos: DatosResumen = {
    mes: mesYAnio(),
    r: (resumenR.data ?? null) as DatosResumen['r'],
    ventas: ventas.length,
    porMoneda: [...porMoneda],
    llamadas: llamadas.length,
    conCosto: conCosto.length,
    costoIA: conCosto.reduce((t, c) => t + Number(c.costo_usd), 0),
    sinPrecio: llamadas.length - conCosto.length,
  };
  return <ResumenVista d={datos} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido />
    </Suspense>
  );
}
