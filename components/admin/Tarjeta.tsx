import type { ReactNode } from 'react';
import { Ayuda } from './Ayuda';

/** Tarjeta de métrica: título pequeño con ℹ (qué mide), dato héroe o mensaje honesto («No medido todavía»). */
export function Tarjeta({ titulo, ayuda, children, icono }: { titulo: string; ayuda: string; children: ReactNode; icono?: ReactNode }) {
  return (
    <section className="hairline-card rounded-[var(--radius-card)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex flex-wrap items-center gap-1 text-[12px] font-bold uppercase tracking-[0.07em] text-[var(--text-secondary)]">
          {titulo}
          <Ayuda texto={ayuda} />
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
