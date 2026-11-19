import type { ReactNode } from 'react';
import { Ayuda } from './Ayuda';
import { Contar } from './Contar';

/** Tarjeta de métrica: título pequeño con ℹ (qué mide), chip de ícono (siempre, para que todas midan lo mismo), dato héroe o mensaje honesto. */
export function Tarjeta({ titulo, ayuda, children, icono }: { titulo: string; ayuda: string; children: ReactNode; icono: ReactNode }) {
  return (
    <section className="hairline-card h-full rounded-[var(--radius-card)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex flex-wrap items-center gap-1 text-[12px] font-bold uppercase tracking-[0.07em] text-[var(--text-secondary)]">
          {titulo}
          <Ayuda texto={ayuda} />
        </h2>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lima)] text-[var(--accent)]" aria-hidden="true">{icono}</span>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Dato héroe. `grande` (44 px) es para EL protagonista de la pantalla; el normal (32 px) para los de apoyo. Con `valor` cuenta de 0 al número. */
export function Heroe({ children, grande = false, valor, decimales, prefijo, sufijo }: { children?: ReactNode; grande?: boolean; valor?: number; decimales?: number; prefijo?: string; sufijo?: string }) {
  return (
    <p className={`${grande ? 'text-[44px]' : 'text-[32px]'} font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]`}>
      {valor !== undefined ? <Contar valor={valor} decimales={decimales} prefijo={prefijo} sufijo={sufijo} /> : children}
    </p>
  );
}

export const SinDatos = ({ children }: { children: ReactNode }) => <p className="text-[15px] text-[var(--text-secondary)]">{children}</p>;
