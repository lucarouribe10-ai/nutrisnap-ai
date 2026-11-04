import Link from 'next/link';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center [font-family:var(--font-body)]">
      <h1 className="text-2xl font-extrabold [font-family:var(--font-display)]"><span className="text-[var(--accent)]">Aquí irá tu onboarding (Sesión 4)</span></h1>
      <Link href="/" className="mt-6 font-semibold text-[var(--accent)] underline underline-offset-4">Volver al inicio</Link>
    </main>
  );
}
