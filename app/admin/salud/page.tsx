import { Suspense } from 'react';
import { AlertTriangle, CheckCircle2, Plug, Bug } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { hace } from '@/lib/admin/formato';
import { SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Entrada } from '@/components/admin/Entrada';
import { marcarResuelto } from './acciones';

type Err = { mensaje: string; contexto: string | null; created_at: string; user_id: string | null; sid: string | null; resuelto: boolean };

async function Contenido() {
  const { supabase } = await requireAdmin();
  const desde = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [errR, hotR] = await Promise.all([
    supabase.from('error_log').select('mensaje,contexto,created_at,user_id,sid,resuelto').gte('created_at', desde).order('created_at', { ascending: false }).limit(2000),
    supabase.from('hotmart_events').select('received_at,firma_ok,procesado,error').order('received_at', { ascending: false }).limit(50),
  ]);
  const filas = (errR.data ?? []) as Err[];
  const abiertos = filas.filter((e) => !e.resuelto);
  const grupos = new Map<string, { mensaje: string; contexto: string | null; n: number; ultimo: string; personas: Set<string> }>();
  for (const e of abiertos) {
    const k = `${e.contexto ?? ''}|${e.mensaje}`;
    const g = grupos.get(k) ?? { mensaje: e.mensaje, contexto: e.contexto, n: 0, ultimo: e.created_at, personas: new Set<string>() };
    g.n += 1;
    if (e.created_at > g.ultimo) g.ultimo = e.created_at;
    g.personas.add(e.user_id ?? e.sid ?? 'anónima');
    grupos.set(k, g);
  }
  const lista = [...grupos.values()].sort((a, b) => b.n - a.n);
  const hot = hotR.data ?? [];
  const hotFallos = hot.filter((h) => !h.firma_ok || h.error).length;
  const hayProblema = abiertos.length > 0 || hotFallos > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Salud</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Errores de la app y estado de las conexiones, en lenguaje claro.</p>
      </div>
      <Entrada i={0} className={`flex items-start gap-3 rounded-[var(--radius-card)] p-4 ${hayProblema ? 'bg-[var(--durazno)]' : 'bg-[var(--lima)]'}`}>
        {hayProblema ? <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[#A83D06]" aria-hidden="true" /> : <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />}
        <div role="status">
          <p className="text-[16px] font-bold">{hayProblema ? 'Hay cosas que revisar' : 'Todo en orden'}</p>
          <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{abiertos.length > 0 ? `${abiertos.length} ${abiertos.length === 1 ? 'error sin resolver' : 'errores sin resolver'} en los últimos 7 días. ` : ''}{hotFallos > 0 ? `${hotFallos} avisos de Hotmart con problema. ` : ''}{!hayProblema ? 'Sin errores abiertos esta semana.' : ''}</p>
        </div>
      </Entrada>

      <Tarjeta titulo="Errores sin resolver (7 días)" ayuda="Problemas que vivieron las personas en la app, agrupados: primero los que más se repiten. Cuando arreglas uno, márcalo como resuelto." icono={<Bug size={18} />}>
        {errR.error ? <SinDatos>No se pudieron cargar los errores. Recarga la página; si sigue igual, avisa a soporte técnico.</SinDatos>
          : lista.length === 0 ? <SinDatos>Sin errores abiertos. Es una buena noticia.</SinDatos> : (
          <ul className="flex flex-col gap-3">
            {lista.map((g) => (
              <li key={`${g.contexto}|${g.mensaje}`} className="rounded-[16px] bg-[var(--surface-2)] p-3">
                <p className="text-[14px] font-bold break-words">{g.mensaje}</p>
                <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{g.contexto ?? 'Pantalla desconocida'} · {g.n} {g.n === 1 ? 'vez' : 'veces'} · {g.personas.size} {g.personas.size === 1 ? 'persona' : 'personas'} · última {hace(g.ultimo)}</p>
                <form action={marcarResuelto} className="mt-2">
                  <input type="hidden" name="mensaje" value={g.mensaje} />
                  <input type="hidden" name="contexto" value={g.contexto ?? ''} />
                  <button type="submit" className="flex min-h-11 items-center rounded-full border-2 border-[var(--negro)] px-4 text-[13px] font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100">Marcar como resuelto</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta titulo="Conexión con Hotmart" ayuda="Si Hotmart está avisando a tu app cuando alguien paga. Si falla, los pagos podrían no dar acceso." icono={<Plug size={18} />}>
        {hot.length === 0 ? <SinDatos>Sin datos: Hotmart todavía no está conectado. Se llena cuando conectemos el cobro.</SinDatos>
          : <p className="text-[15px]">Último aviso recibido {hace(hot[0].received_at)}. {hotFallos === 0 ? 'Todos los recientes se procesaron bien.' : `${hotFallos} de los últimos ${hot.length} tuvieron problema.`}</p>}
      </Tarjeta>
      <Tarjeta titulo="Diferencias de cobro" ayuda="Compara lo que dice Hotmart con lo que dice tu base de datos. Lo sano es cero diferencias.">
        <SinDatos>Sin datos: se calcula cuando haya cobros reales.</SinDatos>
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
