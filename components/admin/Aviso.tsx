import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Entrada } from './Entrada';

/**
 * Aviso de estado de una pestaña. Tres tonos, y el verde solo se usa cuando hay datos que lo respaldan:
 * «ok» (hay datos y todo bien), «atencion» (algo que revisar), «neutro» (no hay datos suficientes para afirmar nada).
 */
export function Aviso({ tono, titulo, detalle, children }: { tono: 'ok' | 'atencion' | 'neutro'; titulo: string; detalle?: string; children?: ReactNode }) {
  const fondo = tono === 'ok' ? 'bg-[var(--lima)]' : tono === 'atencion' ? 'bg-[var(--durazno)]' : 'bg-[var(--surface-2)]';
  return (
    <Entrada i={0} className={`flex items-start gap-3 rounded-[var(--radius-card)] p-4 ${fondo}`}>
      {tono === 'ok' ? <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        : tono === 'atencion' ? <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[var(--durazno-tinta)]" aria-hidden="true" />
        : <Info size={22} className="mt-0.5 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
      <div role="status" className="min-w-0">
        <p className="text-[16px] font-bold">{titulo}</p>
        {detalle && <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">{detalle}</p>}
        {children}
      </div>
    </Entrada>
  );
}
