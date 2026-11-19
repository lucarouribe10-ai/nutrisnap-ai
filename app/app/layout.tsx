import { Suspense } from 'react';
import { AppShell } from '@/components/app/AppShell';
import { PuertaLegal } from '@/components/app/PuertaLegal';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}><PuertaLegal /></Suspense>
      <AppShell>{children}</AppShell>
    </>
  );
}
