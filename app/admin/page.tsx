import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin/guard';

// FASE 0 (cimientos): confirma que la entrada segura funciona y muestra lo que YA se está capturando de verdad.
// Las secciones del panel (Resumen, Usuarios, etc.) llegan en las fases siguientes del plan aprobado.
async function Estado() {
  const { email, supabase } = await requireAdmin();
  const cuenta = async (tabla: 'event_log' | 'error_log' | 'ai_calls' | 'hotmart_events' | 'ordenes') => {
    const { count, error } = await supabase.from(tabla).select('*', { count: 'exact', head: true });
    return error ? null : count ?? 0;
  };
  const [eventos, errores, ia, hot, ordenes] = await Promise.all([cuenta('event_log'), cuenta('error_log'), cuenta('ai_calls'), cuenta('hotmart_events'), cuenta('ordenes')]);
  const filas: [string, number | null, string][] = [
    ['Eventos de uso capturados', eventos, 'Empiezan a llegar cuando haya visitas en internet.'],
    ['Errores registrados', errores, 'Sin errores es una buena noticia.'],
    ['Llamadas de IA con costo', ia, 'Se llenan cuando se active la clave de IA de producción.'],
    ['Avisos de Hotmart recibidos', hot, 'Se llenan al conectar el cobro con Hotmart.'],
    ['Ventas registradas', ordenes, 'Se llenan al conectar el cobro con Hotmart.'],
  ];
  return (
    <main className="mx-auto min-h-dvh max-w-[720px] bg-[var(--bg)] px-5 py-8 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">Panel de administración</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight [font-family:var(--font-display)]">Cimientos listos</h1>
      <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Entraste como administradora{email ? ` (${email})` : ''}. La entrada está verificada en el servidor y las tablas protegidas están creadas. Esto es lo que ya se está guardando de verdad:</p>
      <ul className="mt-5 flex flex-col gap-2">
        {filas.map(([t, n, nota]) => (
          <li key={t} className="hairline-card flex items-center justify-between gap-3 rounded-[var(--radius-card)] p-4">
            <span><span className="block text-[16px] font-bold">{t}</span><span className="block text-[13px] text-[var(--text-secondary)]">{nota}</span></span>
            <span className="text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)]">{n === null ? 'Sin datos' : n}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] text-[var(--text-secondary)]">Siguiente: Resumen y Usuarios (con alta manual).</p>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Estado />
    </Suspense>
  );
}
