'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import { BotonPrimario, EASE } from './ui';
import { Isotipo } from '@/components/landing/Isotipo';
import { track } from '@/lib/eventos';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Login() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [espera, setEspera] = useState(0);
  const valido = EMAIL.test(email.trim());

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((e) => e - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const enviar = async () => {
    if (!valido || estado === 'enviando') return;
    setEstado('enviando');
    track('login_enlace_solicitado', { plan: params.get('plan') ?? undefined });
    // Vista previa: el envío real del enlace se conecta con la autenticación (Sesión 6).
    await new Promise((r) => setTimeout(r, 900));
    setEstado('enviado');
    setEspera(60);
  };

  const entrada = (n: number) => (reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.06 * n, ease: EASE } });

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[var(--bg)] px-5 pb-10 pt-6 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <motion.div {...entrada(0)}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold"><Isotipo size={28} /> NutriSnap AI</Link>
      </motion.div>

      {estado !== 'enviado' ? (
        <>
          <motion.div {...entrada(1)} className="mt-10">
            <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">Entra a tu <span className="text-[var(--accent)]">plan</span></h1>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Para guardarlo y verlo en cualquier dispositivo.</p>
          </motion.div>
          <motion.form {...entrada(2)} className="mt-8 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); void enviar(); }} noValidate>
            <label className="block">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu correo</span>
              <input type="email" inputMode="email" autoComplete="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); if (estado === 'error') setEstado('idle'); }} placeholder="tu@correo.com" className="mt-1 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[17px] outline-none focus:border-[var(--accent)]" />
            </label>
            {estado === 'error' && <p role="alert" className="text-[14px] font-medium text-[var(--accent-2)]">No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.</p>}
            <BotonPrimario type="submit" disabled={!valido || estado === 'enviando'}>
              {estado === 'enviando' ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Enviando…</> : 'Enviarme mi enlace de acceso'}
            </BotonPrimario>
          </motion.form>
          <motion.p {...entrada(3)} className="mt-4 flex items-start gap-2 text-[13px] text-[var(--text-secondary)]"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> Sin contraseñas: te llegará un enlace de un solo uso.</motion.p>
          <p className="mt-6 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] p-3 text-center text-[12px] text-[var(--text-secondary)]">Vista previa: el envío real del enlace y “Continuar con Google” se activan cuando conectemos las cuentas.</p>
        </>
      ) : (
        <motion.div {...entrada(1)} className="mt-14 text-center" aria-live="polite">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--accent)]"><MailCheck size={30} aria-hidden="true" /></span>
          <h1 className="mt-5 text-[28px] font-extrabold leading-[1.1] [font-family:var(--font-display)]">Revisa tu correo</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">Te enviamos el enlace a <strong className="text-[var(--text-primary)]">{email.trim()}</strong>. Ábrelo desde este dispositivo.</p>
          <button type="button" disabled={espera > 0} onClick={() => { setEspera(60); track('login_enlace_reenviado'); }} className="mx-auto mt-6 flex min-h-11 items-center px-3 text-[14px] font-semibold text-[var(--accent)] underline underline-offset-4 disabled:text-[var(--text-secondary)] disabled:no-underline">
            {espera > 0 ? `Reenviar en ${espera}s` : 'Reenviar el enlace'}
          </button>
          <div className="mt-8"><BotonPrimario href="/app">Ver mi app (vista previa)</BotonPrimario></div>
        </motion.div>
      )}
    </main>
  );
}
