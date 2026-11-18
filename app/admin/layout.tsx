import { Suspense } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = { title: 'Panel — NutriSnap AI', robots: { index: false, follow: false } };

// La verificación va dentro de Suspense porque lee la sesión (datos por persona, nunca en caché compartida).
async function Entrada({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto max-w-[960px] px-5 pb-16 pt-5">
        <header className="flex items-center justify-between">
          <p className="text-[18px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]">Panel</p>
          <Link href="/app" className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-[var(--text-secondary)]"><ArrowLeft size={16} aria-hidden="true" /> Volver a la app</Link>
        </header>
        <div className="mt-3"><AdminNav /></div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[var(--bg)]" aria-busy="true" />}>
      <Entrada>{children}</Entrada>
    </Suspense>
  );
}
