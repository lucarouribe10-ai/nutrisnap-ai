import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/admin/guard';
import { Marco } from '@/components/admin/Marco';

export const metadata = { title: 'Panel — NutriSnap AI', robots: { index: false, follow: false } };

// La verificación va dentro de Suspense porque lee la sesión (datos por persona, nunca en caché compartida).
async function Entrada({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <Marco>{children}</Marco>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[var(--bg)]" aria-busy="true" />}>
      <Entrada>{children}</Entrada>
    </Suspense>
  );
}
