import Link from 'next/link';

export const metadata = { title: 'Términos y condiciones — NutriSnap AI' };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4">← Volver</Link>
      <h1 className="mt-6 text-3xl font-extrabold [font-family:var(--font-display)]">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: 3 de noviembre de 2026</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Qué es NutriSnap AI</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Una app para registrar tus comidas con foto, voz y escáner. Las calorías y macros son estimaciones y no sustituyen el consejo de un profesional de la salud.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Suscripción y cobros</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">La suscripción incluye 7 días de prueba gratis. Te avisamos 2 días antes de cobrar. Puedes cancelar desde la app en cualquier momento antes del cobro. Hay un plan gratuito con el escáner de códigos.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Uso justo</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">El plan de pago incluye hasta 8 registros por foto al día.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Contacto</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Escríbenos al correo de soporte indicado al pie de la página.</p>
    </main>
  );
}
