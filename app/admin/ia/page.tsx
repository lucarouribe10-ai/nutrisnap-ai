import { Suspense } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, Gauge, Timer } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { inicioDeMes, usd } from '@/lib/admin/formato';
import { Heroe, SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Entrada } from '@/components/admin/Entrada';

type Llamada = { created_at: string; costo_usd: number | null; ok: boolean; duracion_ms: number | null; user_id: string | null; demo: boolean };

async function Contenido() {
  const { supabase } = await requireAdmin();
  const mes = inicioDeMes();
  const hace14 = new Date(Date.now() - 14 * 86_400_000).toISOString();
  const [llamR, ordR] = await Promise.all([
    supabase.from('ai_calls').select('created_at,costo_usd,ok,duracion_ms,user_id,demo').gte('created_at', hace14 < mes ? hace14 : mes).order('created_at', { ascending: false }).limit(20000),
    supabase.from('ordenes').select('moneda,bruto_minor,estado').gte('creada_en', mes).limit(5000),
  ]);
  const todas = (llamR.data ?? []) as Llamada[];
  const reales = todas.filter((c) => !c.demo);
  const delMes = reales.filter((c) => c.created_at >= mes);
  const hoyIso = new Date(new Date().toISOString().slice(0, 10)).toISOString();
  const deHoy = reales.filter((c) => c.created_at >= hoyIso);
  const suma = (l: Llamada[]) => l.filter((c) => c.costo_usd !== null).reduce((t, c) => t + Number(c.costo_usd), 0);
  const conPrecio = (l: Llamada[]) => l.filter((c) => c.costo_usd !== null).length;
  const precioConfigurado = Number(process.env.AI_PRICE_IN_USD_PER_MTOK) > 0 && Number(process.env.AI_PRICE_OUT_USD_PER_MTOK) > 0;
  const fallidas = delMes.filter((c) => !c.ok).length;
  const ms = delMes.filter((c) => c.duracion_ms !== null);
  const promedioMs = ms.length ? Math.round(ms.reduce((t, c) => t + Number(c.duracion_ms), 0) / ms.length) : null;

  // Ingresos del mes en USD solo si TODOS están en USD (nunca se mezclan monedas).
  const ventas = (ordR.data ?? []).filter((o) => o.estado === 'aprobada' || o.estado === 'prueba');
  const soloUsd = ventas.length > 0 && ventas.every((o) => o.moneda === 'USD');
  const ingresosUsd = soloUsd ? ventas.reduce((t, o) => t + Number(o.bruto_minor), 0) / 100 : null;
  const pct = ingresosUsd && ingresosUsd > 0 ? (suma(delMes) / ingresosUsd) * 100 : null;
  const aviso = pct !== null && pct > 20
    ? { ok: false, t: `La IA se está comiendo el ${Math.round(pct)}% de lo que cobras`, d: 'Pasa del 20% sano. Revisa los límites de uso por persona o el precio de los planes.' }
    : !precioConfigurado && delMes.length > 0
      ? { ok: false, t: 'Falta el precio del modelo para calcular el costo', d: 'Sin ese precio, el costo de IA no se puede calcular. Avisa a soporte técnico para configurarlo.' }
      : { ok: true, t: 'El gasto de IA está en orden', d: '' };

  // Por día (últimos 14).
  const dias = Array.from({ length: 14 }, (_, i) => new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10));
  const porDia = dias.map((d) => { const l = reales.filter((c) => c.created_at.slice(0, 10) === d); return { d, n: l.length, costo: suma(l), con: conPrecio(l) }; });
  const maxN = Math.max(1, ...porDia.map((x) => x.n));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Costo de IA</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Cuánto cuesta de verdad analizar las fotos, con tokens reales.</p>
      </div>
      <Entrada i={0} className={`flex items-start gap-3 rounded-[var(--radius-card)] p-4 ${aviso.ok ? 'bg-[var(--lima)]' : 'bg-[var(--durazno)]'}`}>
        {aviso.ok ? <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" /> : <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[#A83D06]" aria-hidden="true" />}
        <div role="status"><p className="text-[16px] font-bold">{aviso.t}</p>{aviso.d && <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{aviso.d}</p>}</div>
      </Entrada>
      <div className="grid gap-4 sm:grid-cols-2">
        <Tarjeta titulo="Costo del mes" ayuda="Suma del costo de las llamadas reales a la IA este mes. Las llamadas de ejemplo (sin clave) no cuentan." icono={<Cpu size={18} />}>
          {delMes.length === 0 ? <SinDatos>Sin datos: todavía no hay llamadas reales de IA este mes.</SinDatos>
            : conPrecio(delMes) === 0 ? <SinDatos>{delMes.length} llamadas registradas, pero falta configurar el precio del modelo para calcular el costo.</SinDatos>
            : <><Heroe>{usd(suma(delMes))}</Heroe><p className="mt-2 text-[13px] text-[var(--text-secondary)]">{pct !== null ? `${pct.toFixed(1)}% de tus ingresos del mes.` : 'Sin datos de ingresos todavía para compararlo.'}</p></>}
        </Tarjeta>
        <Tarjeta titulo="Costo de hoy" ayuda="Lo que costó la IA desde las 00:00 de hoy." icono={<Gauge size={18} />}>
          {deHoy.length === 0 ? <SinDatos>Sin datos: hoy no hubo llamadas reales.</SinDatos>
            : conPrecio(deHoy) === 0 ? <SinDatos>{deHoy.length} llamadas hoy, sin precio configurado.</SinDatos>
            : <Heroe>{usd(suma(deHoy))}</Heroe>}
        </Tarjeta>
        <Tarjeta titulo="Llamadas del mes" ayuda="Cuántas veces se llamó a la IA este mes y cuántas fallaron." icono={<Cpu size={18} />}>
          {delMes.length === 0 ? <SinDatos>Sin datos todavía.</SinDatos> : <><Heroe>{delMes.length}</Heroe><p className="mt-2 text-[13px] text-[var(--text-secondary)]">{fallidas === 0 ? 'Ninguna falló.' : `${fallidas} fallaron (${Math.round((fallidas / delMes.length) * 100)}%).`}</p></>}
        </Tarjeta>
        <Tarjeta titulo="Rapidez" ayuda="Tiempo promedio que tarda la IA en responder una foto." icono={<Timer size={18} />}>
          {promedioMs === null ? <SinDatos>Sin datos todavía.</SinDatos> : <Heroe>{(promedioMs / 1000).toFixed(1)} s</Heroe>}
        </Tarjeta>
      </div>
      <Tarjeta titulo="Últimos 14 días" ayuda="Llamadas reales por día y su costo (si el precio está configurado).">
        {reales.length === 0 ? <SinDatos>Sin datos: aún no hay llamadas reales de IA. Se llenan cuando se active la clave de producción.</SinDatos> : (
          <ul className="flex flex-col gap-1.5">
            {porDia.map((x) => (
              <li key={x.d} className="flex items-center gap-3 text-[13px]">
                <span className="w-20 shrink-0 text-[var(--text-secondary)]">{new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date(x.d + 'T12:00:00'))}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]"><span className="block h-full rounded-full bg-[var(--negro)]" style={{ width: `${(x.n / maxN) * 100}%` }} /></span>
                <span className="w-24 shrink-0 text-right font-semibold tabular-nums">{x.n} · {x.con > 0 ? usd(x.costo) : '—'}</span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido />
    </Suspense>
  );
}
