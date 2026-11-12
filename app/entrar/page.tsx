import { Suspense } from 'react';
import { Login } from '@/components/onboarding/Login';

export const metadata = { title: 'Entrar — NutriSnap AI', robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[var(--bg)]" />}>
      <Login />
    </Suspense>
  );
}
