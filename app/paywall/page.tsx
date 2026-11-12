import { Suspense } from 'react';
import { Paywall } from '@/components/onboarding/Paywall';

export const metadata = { title: 'Tu plan — NutriSnap AI', robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[var(--bg)]" />}>
      <Paywall />
    </Suspense>
  );
}
