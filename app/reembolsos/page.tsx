import Link from 'next/link';

export const metadata = { title: 'Política de reembolsos — NutriSnap AI' };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4">← Volver</Link>
      <h1 className="mt-6 text-3xl font-extrabold [font-family:var(--font-display)]">Política de reembolsos</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: 3 de noviembre de 2026</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">La Garantía de Cero Sorpresas</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Si te cobramos y no te sirve, escribe un correo dentro de los 7 días siguientes al cobro y te devolvemos el dinero completo, sin preguntas.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Cómo se procesa</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">El reembolso se tramita a través de Hotmart, el procesador de pagos, al mismo medio de pago que usaste.</p>
    </main>
  );
}
