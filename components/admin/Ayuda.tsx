'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';

/** Botón ℹ que abre/cierra la explicación al tocar. Se cierra con Escape o al tocar fuera, y flota sobre la tarjeta (no la mueve). */
export function Ayuda({ texto }: { texto: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  const raiz = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!abierta) return;
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierta(false); };
    const fuera = (e: PointerEvent) => { if (raiz.current && !raiz.current.contains(e.target as Node)) setAbierta(false); };
    document.addEventListener('keydown', tecla);
    document.addEventListener('pointerdown', fuera);
    return () => { document.removeEventListener('keydown', tecla); document.removeEventListener('pointerdown', fuera); };
  }, [abierta]);
  return (
    <span ref={raiz} className="relative inline-flex">
      <button type="button" aria-expanded={abierta} aria-controls={id} aria-label="¿Qué mide esto?" onClick={() => setAbierta((a) => !a)} className="-m-3.5 inline-flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]">
        <Info size={14} aria-hidden="true" />
      </button>
      {abierta && <span id={id} role="note" className="absolute left-0 top-full z-20 mt-2 w-[min(260px,72vw)] rounded-[12px] bg-[var(--surface)] p-3 text-[13px] font-medium normal-case leading-snug tracking-normal text-[var(--text-primary)] shadow-[var(--shadow-2)] ring-1 ring-[var(--lima-2)]">{texto}</span>}
    </span>
  );
}
