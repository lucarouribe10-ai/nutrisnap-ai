import Link from 'next/link';

export const metadata = { title: 'Política de privacidad — NutriSnap AI' };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4">← Volver</Link>
      <h1 className="mt-6 text-3xl font-extrabold [font-family:var(--font-display)]">Política de privacidad</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Última actualización: 3 de noviembre de 2026</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Qué datos recogemos</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Tu correo, tu objetivo, estatura, peso y nivel de actividad; lo que registras (comidas, calorías y macros); y los datos de uso de la app (por ejemplo, tu racha y tus logros).</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Fotos y voz</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Las fotos y los audios se procesan para estimar tus calorías. No guardamos la foto original: conservamos solo una miniatura y los resultados. El audio se transcribe y se descarta.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Con quién los compartimos</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Con los proveedores que hacen funcionar la app: la inteligencia artificial que analiza tus fotos y voz, el alojamiento y la base de datos, el envío de correos y el procesador de pagos (Hotmart). No vendemos tus datos.</p>
      <h2 className="mt-8 text-xl font-bold [font-family:var(--font-display)]">Tus derechos</h2>
      <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Puedes pedir ver, corregir o borrar tus datos escribiendo al correo de soporte. Esta política aplica a usuarios en Colombia conforme a la Ley 1581 de 2012.</p>
    </main>
  );
}
