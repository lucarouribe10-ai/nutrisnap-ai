'use client';

// Botón repetido a lo largo del scroll (regla de la landing: tras el mecanismo y tras la
// garantía, para quien ya está listo). Mismo verbo y mismo destino que el hero.
import { CtaButton } from './ui';

export function CtaFila({ label, href, nota }: { label: string; href: string; nota?: string }) {
  return (
    <div data-cta-inline className="bg-[var(--bg)] px-5 py-8">
      <div className="mx-auto flex max-w-[420px] flex-col items-center gap-2 text-center">
        <CtaButton href={href}>{label}</CtaButton>
        {nota && <p className="text-[13px] text-[var(--text-secondary)]">{nota}</p>}
      </div>
    </div>
  );
}
