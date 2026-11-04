import Link from 'next/link';

export const metadata = { title: 'Aviso sobre la inteligencia artificial — NutriSnap AI' };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4">← Volver</Link>
      <h1 className="mt-6 text-3xl font-extrabold [font-family:var(--font-display)]">Aviso sobre la inteligencia artificial</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: 3 de noviembre de 2026</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Son estimaciones</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">NutriSnap usa inteligencia artificial para estimar los alimentos y sus calorías desde una foto o tu voz. El resultado es un estimado con margen de error. Por eso el Chequeo de Grasas Ocultas te pregunta lo que la cámara no ve y puedes ajustar cualquier dato.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">No es consejo médico</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">La app no diagnostica ni reemplaza a un nutricionista o médico. Si tienes una condición de salud o un trastorno alimentario, consulta a un profesional antes de seguir un déficit calórico.</p>
    </main>
  );
}
