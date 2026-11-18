'use client';

import { useEffect } from 'react';
import { reportarError } from '@/lib/errores';

// Si una pantalla falla, la persona ve esto (nunca una pantalla blanca) y el error queda registrado para la dueña.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportarError(error.message, typeof location === 'undefined' ? 'pantalla' : location.pathname);
  }, [error]);
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-[26px] font-extrabold leading-tight [font-family:var(--font-display)]">Algo no salió como esperábamos</h1>
      <p className="mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">Tus datos están a salvo. Intenta de nuevo; si sigue pasando, ya nos avisó solo.</p>
      <button type="button" onClick={reset} className="mt-6 flex h-14 w-full max-w-[320px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--negro)] text-[17px] font-semibold text-[var(--on-negro)]">Intentar de nuevo</button>
    </main>
  );
}
