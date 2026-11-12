import Link from 'next/link';

export const metadata = { title: 'Tu app — NutriSnap AI', robots: { index: false } };

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center [font-family:var(--font-body)]">
      <h1 className="text-2xl font-extrabold [font-family:var(--font-display)]">
        Aquí irá <span className="text-[var(--accent)]">tu app</span> (Sesión 5)
      </h1>
      <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Hoy, progreso, logros y escáner. Se construye en la siguiente etapa.</p>
      <Link href="/" className="mt-6 font-semibold text-[var(--accent)] underline underline-offset-4">Volver al inicio</Link>
    </main>
  );
}
