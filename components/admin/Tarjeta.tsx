import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

/** Tarjeta de métrica: título pequeño con ℹ (qué mide), dato héroe o mensaje honesto («No medido todavía»). */
export function Tarjeta({ titulo, ayuda, children, icono }: { titulo: string; ayuda: string; children: ReactNode; icono?: ReactNode }) {
  return (
    <section className="hairline-card rounded-[var(--radius-card)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.07em] text-[var(--text-secondary)]">
          {titulo}
          <span title={ayuda} role="img" aria-label={ayuda} className="inline-flex cursor-help text-[var(--text-secondary)]"><Info size={14} aria-hidden="true" /></span>
        </h2>
        {icono && <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lima)] text-[var(--accent)]" aria-hidden="true">{icono}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export const Heroe = ({ children }: { children: ReactNode }) => (
  <p className="text-[32px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]">{children}</p>
);

export const SinDatos = ({ children }: { children: ReactNode }) => <p className="text-[15px] text-[var(--text-secondary)]">{children}</p>;
