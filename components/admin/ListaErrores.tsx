'use client';

import { useState, useTransition } from 'react';
import { Check, Undo2 } from 'lucide-react';
import { marcarResuelto, reabrir } from '@/app/admin/salud/acciones';

export type GrupoError = { clave: string; claro: string; mensaje: string; contexto: string | null; n: number; personas: number; hace: string };

type Estado = { fase: 'abierto' } | { fase: 'resuelto'; ids: number[] } | { fase: 'fallo'; motivo: string };
const MAX = 5;

/** Lista de errores agrupados. «Marcar como resuelto» pide un toque, muestra qué pasó, se puede deshacer y avisa si falla. Muestra 5 y el resto bajo «Ver todos». */
export function ListaErrores({ grupos, demo = false }: { grupos: GrupoError[]; demo?: boolean }) {
  // Copia propia de los grupos: al marcar uno, la página se refresca y ese grupo sale de los datos, pero aquí debe quedarse para poder deshacer.
  const [lista] = useState(grupos);
  const [estados, setEstados] = useState<Record<string, Estado>>({});
  const [todos, setTodos] = useState(false);
  const [pendiente, empezar] = useTransition();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const visibles = todos ? lista : lista.slice(0, MAX);

  function resolver(g: GrupoError) {
    setOcupado(g.clave);
    if (demo) { setEstados((s) => ({ ...s, [g.clave]: { fase: 'resuelto', ids: [] } })); setOcupado(null); return; }
    empezar(async () => {
      const r = await marcarResuelto(g.mensaje, g.contexto ?? '');
      setEstados((s) => ({ ...s, [g.clave]: r.ok ? { fase: 'resuelto', ids: r.ids } : { fase: 'fallo', motivo: r.motivo } }));
      setOcupado(null);
    });
  }
  function deshacer(g: GrupoError, ids: number[]) {
    setOcupado(g.clave);
    if (demo) { setEstados((s) => ({ ...s, [g.clave]: { fase: 'abierto' } })); setOcupado(null); return; }
    empezar(async () => {
      const r = await reabrir(ids);
      setEstados((s) => ({ ...s, [g.clave]: r.ok ? { fase: 'abierto' } : { fase: 'fallo', motivo: 'No se pudo deshacer. Recarga la página.' } }));
      setOcupado(null);
    });
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {visibles.map((g, idx) => {
          const e = estados[g.clave] ?? { fase: 'abierto' as const };
          const trabajando = pendiente && ocupado === g.clave;
          if (e.fase === 'resuelto') {
            return (
              <li key={g.clave} role="status" className="flex items-center justify-between gap-3 rounded-[16px] bg-[var(--lima)] p-3">
                <p className="flex items-center gap-2 text-[14px] font-semibold"><Check size={16} aria-hidden="true" className="shrink-0 text-[var(--accent)]" /> Marcado como resuelto ({g.n} {g.n === 1 ? 'aviso' : 'avisos'})</p>
                <button type="button" disabled={trabajando} onClick={() => deshacer(g, e.ids)} className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold underline underline-offset-4 disabled:opacity-60"><Undo2 size={14} aria-hidden="true" /> Deshacer</button>
              </li>
            );
          }
          return (
            <li key={g.clave} className="rounded-[16px] bg-[var(--surface-2)] p-3">
              <p className={idx === 0 ? 'text-[16px] font-extrabold' : 'text-[14px] font-bold'}>{idx === 0 ? 'El que más se repite: ' : ''}{g.claro}</p>
              <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{g.contexto ?? 'No se sabe en qué pantalla'} · {g.n} {g.n === 1 ? 'vez' : 'veces'} · {g.personas} {g.personas === 1 ? 'persona' : 'personas'} · última {g.hace}</p>
              <details className="mt-1 text-[12px] text-[var(--text-secondary)]">
                <summary className="flex min-h-11 cursor-pointer items-center underline underline-offset-4">Ver el mensaje original</summary>
                <p className="break-words rounded-[12px] bg-[var(--surface)] p-2 [font-family:var(--font-mono,monospace)]">{g.mensaje}</p>
              </details>
              {e.fase === 'fallo' && <p role="alert" className="mt-1 text-[13px] font-semibold text-[var(--durazno-tinta)]">{e.motivo}</p>}
              <button type="button" disabled={trabajando} onClick={() => resolver(g)} className={`mt-2 flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold transition-transform ${idx === 0 ? 'bg-[var(--negro)] text-[var(--on-negro)]' : 'border-2 border-[var(--negro)]'} active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100`}>{trabajando ? 'Guardando…' : 'Marcar como resuelto'}</button>
            </li>
          );
        })}
      </ul>
      {lista.length > MAX && (
        <button type="button" onClick={() => setTodos((t) => !t)} aria-expanded={todos} className="mt-3 flex min-h-11 items-center text-[14px] font-bold underline underline-offset-4">{todos ? 'Ver menos' : `Ver todos (${lista.length})`}</button>
      )}
    </div>
  );
}
