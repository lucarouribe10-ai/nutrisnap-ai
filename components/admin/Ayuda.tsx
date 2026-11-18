'use client';

import { useId, useState } from 'react';
import { Info } from 'lucide-react';

/** Botón ℹ que abre/cierra la explicación al tocar (sirve en celular y con teclado; el «title» nativo solo sirve con ratón). */
export function Ayuda({ texto }: { texto: string }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  return (
    <span className="inline-flex flex-col">
      <button type="button" aria-expanded={abierta} aria-controls={id} aria-label="¿Qué mide esto?" onClick={() => setAbierta((a) => !a)} className="-m-2 inline-flex size-10 items-center justify-center rounded-full text-[var(--text-secondary)]">
        <Info size={14} aria-hidden="true" />
      </button>
      {abierta && <span id={id} role="note" className="mt-1 max-w-[260px] rounded-[12px] bg-[var(--surface-2)] p-2.5 text-[12px] font-medium normal-case leading-snug tracking-normal text-[var(--text-primary)]">{texto}</span>}
    </span>
  );
}
