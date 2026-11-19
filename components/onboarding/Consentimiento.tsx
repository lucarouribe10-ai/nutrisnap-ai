'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { BotonPrimario } from './ui';

/** Casilla de autorización (nunca premarcada), con enlaces a lo que se acepta. */
export function CasillaAutorizacion({ marcada, onCambio }: { marcada: boolean; onCambio: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-[var(--text-secondary)]">
      <input type="checkbox" checked={marcada} onChange={(e) => onCambio(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--accent)]" />
      <span>
        Autorizo el tratamiento de mis datos personales, incluidos mis datos de salud (peso, estatura y alimentación, que son datos sensibles) y la transferencia de mis fotos a un proveedor de inteligencia artificial en EE. UU., según la{' '}
        <Link href="/privacidad" target="_blank" rel="noopener" className="font-semibold text-[var(--text-primary)] underline underline-offset-4">Política de privacidad</Link>, y acepto los{' '}
        <Link href="/terminos" target="_blank" rel="noopener" className="font-semibold text-[var(--text-primary)] underline underline-offset-4">Términos y condiciones</Link>.
      </span>
    </label>
  );
}

/** Pantalla para quien entra y aún no aceptó la versión vigente de los textos legales. */
export function Consentimiento() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState(false);

  const aceptar = async () => {
    if (!ok || ocupado) return;
    setOcupado(true);
    setError(false);
    try {
      const r = await fetch('/api/consentimiento', { method: 'POST' });
      if (!r.ok) throw new Error('no');
      router.replace('/app');
      router.refresh();
    } catch {
      setError(true);
      setOcupado(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[var(--bg)] px-5 pb-10 pt-12 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <span className="flex size-14 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--accent)]"><ShieldCheck size={28} aria-hidden="true" /></span>
      <h1 className="mt-5 text-balance text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">Un último paso antes de entrar</h1>
      <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Tu comida, tu peso y tus fotos son datos personales. Necesitamos tu autorización para cuidarlos y usarlos para darte el servicio.</p>
      <div className="mt-6"><CasillaAutorizacion marcada={ok} onCambio={setOk} /></div>
      {error && <p role="alert" className="mt-3 text-[14px] font-medium text-[var(--durazno-tinta)]">No pudimos guardar tu autorización. Revisa tu conexión e intenta de nuevo.</p>}
      <div className="mt-6">
        <BotonPrimario onClick={aceptar} disabled={!ok || ocupado}>{ocupado ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Guardando…</> : 'Aceptar y continuar'}</BotonPrimario>
      </div>
      <p className="mt-4 text-[13px] text-[var(--text-secondary)]">Puedes borrar tu cuenta y tus datos cuando quieras desde Perfil.</p>
    </main>
  );
}
