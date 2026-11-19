import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Isotipo } from '@/components/landing/Isotipo';
import { AdminNav } from '@/components/admin/AdminNav';

/** Marco común del panel: cabecera, pestañas y columna de contenido. Lo usan el panel real y la vista previa de desarrollo. */
export function Marco({ children, rutaForzada }: { children: ReactNode; rutaForzada?: string }) {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto max-w-[960px] px-5 pb-16 pt-5">
        <header className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[18px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]"><Isotipo size={28} /> Panel</p>
          <Link href="/app" className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[var(--text-secondary)]"><ArrowLeft size={16} aria-hidden="true" /> Volver a la app</Link>
        </header>
        <div className="mt-3"><AdminNav rutaForzada={rutaForzada} /></div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
