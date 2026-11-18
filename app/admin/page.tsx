import { Suspense } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, Users, Wallet, Activity, TrendingUp } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { dinero, inicioDeMes, usd } from '@/lib/admin/formato';
import { Heroe, SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Entrada } from '@/components/admin/Entrada';

type Resumen = { usuarios_total: number; nuevos_7d: number; activos_7d: number; activos_30d: number; con_datos: number; con_acceso: number; eventos_24h: number; errores_abiertos: number };

async function Contenido() {
  const { supabase } = await requireAdmin();
  const mes = inicioDeMes();
  const [resumenR, ordenesR, iaR] = await Promise.all([
    supabase.rpc('admin_resumen'),
    supabase.from('ordenes').select('moneda,bruto_minor,estado').gte('creada_en', mes).limit(5000),
    supabase.from('ai_calls').select('costo_usd,ok').gte('created_at', mes).limit(20000),
  ]);
  const r = (resumenR.data ?? null) as Resumen | null;

  // Ingresos del mes por moneda (nunca se mezclan monedas). Solo cuentan ventas aprobadas.
  const ventas = (ordenesR.data ?? []).filter((o) => o.estado === 'aprobada' || o.estado === 'prueba');
  const porMoneda = new Map<string, number>();
  for (const o of ventas) porMoneda.set(o.moneda, (porMoneda.get(o.moneda) ?? 0) + Number(o.bruto_minor));

  // Costo de IA del mes: solo llamadas con precio configurado; si hay llamadas sin precio se dice.
  const llamadas = iaR.data ?? [];
  const conCosto = llamadas.filter((c) => c.costo_usd !== null);
  const costoIA = conCosto.reduce((t, c) => t + Number(c.costo_usd), 0);
  const sinPrecio = llamadas.length - conCosto.length;

  const errores = r?.errores_abiertos ?? 0;
  const aviso = errores > 0
    ? { ok: false, titulo: `Hay ${errores} ${errores === 1 ? 'error' : 'errores'} sin resolver esta semana`, detalle: 'Alguien pudo chocar con un problema en la app. Cuando esté lista la pestaña Salud verás cuál es y cuántas personas afectó.' }
    : { ok: true, titulo: 'Todo en orden este mes', detalle: '' };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Resumen</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Lo que más te importa, de un vistazo.</p>
      </div>

      <Entrada i={0} className={`flex items-start gap-3 rounded-[var(--radius-card)] p-4 ${aviso.ok ? 'bg-[var(--lima)]' : 'bg-[var(--durazno)]'}`}>
        {aviso.ok ? <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" /> : <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[#A83D06]" aria-hidden="true" />}
        <div role="status"><p className="text-[16px] font-bold">{aviso.titulo}</p>{aviso.detalle && <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{aviso.detalle}</p>}</div>
      </Entrada>

      <Tarjeta titulo="Ganancia real de este mes" ayuda="Lo que te queda después de pagar Hotmart, comisiones, impuestos, IA, servidores y correos. Se calcula cuando haya ventas registradas." icono={<Wallet size={18} />}>
        {ventas.length === 0
          ? <SinDatos>Todavía no hay ventas registradas este mes. En cuanto entre la primera, este número se calcula solo.</SinDatos>
          : <SinDatos>Hay {ventas.length} {ventas.length === 1 ? 'venta' : 'ventas'}, pero aún faltan los costos para calcular lo que te queda. Se completa en la pestaña Ajustes de la próxima fase.</SinDatos>}
      </Tarjeta>

      <div className="grid gap-4 sm:grid-cols-2">
        <Tarjeta titulo="Costo de IA (mes)" ayuda="Lo que costaron las llamadas a la IA este mes, con tokens reales. Si el precio del modelo no está configurado, se avisa en vez de inventar un número." icono={<Cpu size={18} />}>
          {llamadas.length === 0 ? <SinDatos>Sin datos: todavía no hay llamadas de IA este mes.</SinDatos>
            : conCosto.length === 0 ? <SinDatos>{llamadas.length} llamadas registradas, pero falta configurar el precio del modelo para calcular el costo.</SinDatos>
            : (<><Heroe>{usd(costoIA)}</Heroe>{sinPrecio > 0 && <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{sinPrecio} llamadas sin precio no están incluidas.</p>}</>)}
        </Tarjeta>
        <Tarjeta titulo="Ingresos (mes)" ayuda="Lo cobrado este mes por tus ventas aprobadas, por moneda. Nunca se suman monedas distintas." icono={<TrendingUp size={18} />}>
          {porMoneda.size === 0 ? <SinDatos>No medido todavía: se llena al conectar el cobro con Hotmart.</SinDatos>
            : <ul className="flex flex-col gap-1">{[...porMoneda].map(([m, v]) => <li key={m}><Heroe>{dinero(v, m)}</Heroe></li>)}</ul>}
        </Tarjeta>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Tarjeta titulo="Personas con cuenta" ayuda="Cuentas creadas en total, nuevas en los últimos 7 días y quienes entraron en los últimos 7 y 30 días." icono={<Users size={18} />}>
          {r === null ? <SinDatos>Sin datos: no se pudo leer el resumen.</SinDatos> : (
            <>
              <Heroe>{r.usuarios_total}</Heroe>
              <ul className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[[r.nuevos_7d, 'nuevas 7 días'], [r.activos_7d, 'activas 7 días'], [r.activos_30d, 'activas 30 días']].map(([n, l]) => (
                  <li key={l as string} className="rounded-[16px] bg-[var(--surface-2)] px-2 py-2"><p className="text-[18px] font-extrabold tabular-nums">{n}</p><p className="text-[11px] font-semibold text-[var(--text-secondary)]">{l}</p></li>
                ))}
              </ul>
            </>
          )}
        </Tarjeta>
        <Tarjeta titulo="Actividad real" ayuda="Cuántas cuentas ya tienen datos propios (completaron el recorrido), cuántas tienen acceso activo y cuántos eventos de uso llegaron en las últimas 24 horas." icono={<Activity size={18} />}>
          {r === null ? <SinDatos>Sin datos: no se pudo leer el resumen.</SinDatos> : (
            <ul className="flex flex-col gap-2 text-[15px]">
              <li className="flex justify-between"><span>Cuentas con datos propios</span><strong className="tabular-nums">{r.con_datos}</strong></li>
              <li className="flex justify-between"><span>Cuentas con acceso activo</span><strong className="tabular-nums">{r.con_acceso}</strong></li>
              <li className="flex justify-between"><span>Eventos de uso (24 h)</span><strong className="tabular-nums">{r.eventos_24h}</strong></li>
            </ul>
          )}
        </Tarjeta>
      </div>
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
