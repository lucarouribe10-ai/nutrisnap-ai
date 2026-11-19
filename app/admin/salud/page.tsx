import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin/guard';
import { errorClaro, hace } from '@/lib/admin/formato';
import { SaludVista, type DatosSalud } from '@/components/admin/vistas/SaludVista';
import type { GrupoError } from '@/components/admin/ListaErrores';

type Err = { mensaje: string; contexto: string | null; created_at: string; user_id: string | null; sid: string | null; resuelto: boolean };

async function Contenido() {
  const { supabase } = await requireAdmin();
  const desde = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [errR, hotR] = await Promise.all([
    supabase.from('error_log').select('mensaje,contexto,created_at,user_id,sid,resuelto').gte('created_at', desde).order('created_at', { ascending: false }).limit(2000),
    supabase.from('hotmart_events').select('received_at,firma_ok,procesado,error').order('received_at', { ascending: false }).limit(50),
  ]);
  const abiertos = ((errR.data ?? []) as Err[]).filter((e) => !e.resuelto);
  const mapa = new Map<string, { mensaje: string; contexto: string | null; n: number; ultimo: string; personas: Set<string> }>();
  for (const e of abiertos) {
    const k = `${e.contexto ?? ''}|${e.mensaje}`;
    const g = mapa.get(k) ?? { mensaje: e.mensaje, contexto: e.contexto, n: 0, ultimo: e.created_at, personas: new Set<string>() };
    g.n += 1;
    if (e.created_at > g.ultimo) g.ultimo = e.created_at;
    g.personas.add(e.user_id ?? e.sid ?? 'anónima');
    mapa.set(k, g);
  }
  const grupos: GrupoError[] = [...mapa.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .map(([clave, g]) => ({ clave, claro: errorClaro(g.mensaje), mensaje: g.mensaje, contexto: g.contexto, n: g.n, personas: g.personas.size, hace: hace(g.ultimo) }));
  const hot = hotR.data ?? [];
  const datos: DatosSalud = {
    falloCarga: Boolean(errR.error),
    grupos,
    abiertos: abiertos.length,
    hotTotal: hot.length,
    hotFallos: hot.filter((h) => !h.firma_ok || h.error).length,
    hotUltimo: hot[0] ? hace(hot[0].received_at) : null,
  };
  return <SaludVista d={datos} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido />
    </Suspense>
  );
}
