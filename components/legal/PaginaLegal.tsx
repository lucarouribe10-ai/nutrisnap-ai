import type { ReactNode } from 'react';
import Link from 'next/link';
import { RESPONSABLE } from '@/lib/legal';

export type SeccionLegal = { titulo: string; cuerpo: ReactNode };

/** Plantilla común de las páginas legales: título, fecha de actualización, secciones y contacto. */
export function PaginaLegal({ titulo, intro, secciones }: { titulo: string; intro?: ReactNode; secciones: SeccionLegal[] }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline underline-offset-4">← Volver</Link>
      <h1 className="mt-4 text-3xl font-extrabold [font-family:var(--font-display)]">{titulo}</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: {RESPONSABLE.actualizacion}</p>
      {intro && <div className="mt-4 leading-relaxed text-[var(--text-secondary)]">{intro}</div>}
      {secciones.map((s) => (
        <section key={s.titulo}>
          <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">{s.titulo}</h2>
          <div className="mt-2 space-y-3 leading-relaxed text-[var(--text-secondary)]">{s.cuerpo}</div>
        </section>
      ))}
      <section>
        <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Contacto</h2>
        <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Escríbenos a <a href={`mailto:${RESPONSABLE.correo}`} className="font-semibold text-[var(--text-primary)] underline underline-offset-4">{RESPONSABLE.correo}</a>. Te respondemos lo antes posible.</p>
      </section>
      <nav aria-label="Otros documentos" className="mt-10 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {[['/privacidad', 'Privacidad'], ['/terminos', 'Términos y condiciones'], ['/reembolsos', 'Reembolsos'], ['/aviso-ia', 'Aviso sobre la IA']].map(([h, t]) => (
          <Link key={h} href={h} className="inline-flex min-h-11 items-center underline underline-offset-4">{t}</Link>
        ))}
      </nav>
    </main>
  );
}

export const Lista = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
);
