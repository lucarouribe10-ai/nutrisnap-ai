'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import { BotonPrimario, EASE } from './ui';
import { CasillaAutorizacion } from './Consentimiento';
import { Isotipo } from '@/components/landing/Isotipo';
import { track } from '@/lib/eventos';
import { createClient } from '@/lib/supabase/client';
import { destinoSeguro } from '@/lib/supabase/destino';

type Paso = 'correo' | 'codigo';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LARGO_CODIGO = 8; // Supabase envía códigos de 8 dígitos (Authentication → Sign In / Providers → Email)

function mensajeDeError(e: { message?: string; status?: number } | null, paso: Paso): string {
  const msg = (e?.message ?? '').toLowerCase();
  if (e?.status === 429 || msg.includes('rate') || msg.includes('seconds')) return 'Pediste muchos códigos seguidos. Espera un minuto e intenta de nuevo.';
  if (paso === 'codigo') return 'Ese código no es válido o ya venció. Revisa los números o pide uno nuevo.';
  if (msg.includes('invalid') && msg.includes('email')) return 'Ese correo no parece válido. Revísalo e intenta de nuevo.';
  return 'No pudimos enviar el código. Revisa tu conexión e intenta de nuevo.';
}

export function Login() {
  const params = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [paso, setPaso] = useState<Paso>('correo');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [autoriza, setAutoriza] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(params.get('error') === 'enlace' ? 'Ese enlace ya se usó o venció. Pide un código nuevo.' : null);
  const [espera, setEspera] = useState(0);
  const enviando = useRef(false);
  const valido = EMAIL.test(email.trim());
  const destino = destinoSeguro(params.get('next'));

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((e) => e - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const pedirCodigo = async () => {
    if (!valido || !autoriza || enviando.current) return;
    enviando.current = true;
    setOcupado(true);
    setError(null);
    track('login_codigo_solicitado', { plan: params.get('plan') ?? undefined });
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true },
      });
      if (err) {
        setError(mensajeDeError(err, 'correo'));
      } else {
        setPaso('codigo');
        setCodigo('');
        setEspera(60);
      }
    } catch {
      setError('No pudimos enviar el código. Revisa tu conexión e intenta de nuevo.');
    } finally {
      enviando.current = false;
      setOcupado(false);
    }
  };

  const verificar = async (valor: string) => {
    if (valor.length !== LARGO_CODIGO || enviando.current) return;
    enviando.current = true;
    setOcupado(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: valor, type: 'email' });
      if (err) {
        setError(mensajeDeError(err, 'codigo'));
        setCodigo('');
      } else {
        track('login_exitoso');
        // La autorización se registra ya con la cuenta verificada. Si fallara, la puerta de la app la vuelve a pedir.
        await fetch('/api/consentimiento', { method: 'POST' }).catch(() => undefined);
        router.replace(destino);
        router.refresh();
        return;
      }
    } catch {
      setError('No pudimos verificar el código. Revisa tu conexión e intenta de nuevo.');
    }
    enviando.current = false;
    setOcupado(false);
  };

  const entrada = (n: number) => (reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.06 * n, ease: EASE } });

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[var(--bg)] px-5 pb-10 pt-6 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <motion.div {...entrada(0)}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold"><Isotipo size={28} /> NutriSnap AI</Link>
      </motion.div>

      {paso === 'correo' ? (
        <>
          <motion.div {...entrada(1)} className="mt-10">
            <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">Entra a tu <span className="text-[var(--accent)]">plan</span></h1>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Para guardarlo y verlo en cualquier dispositivo.</p>
          </motion.div>
          <motion.form {...entrada(2)} className="mt-8 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); void pedirCodigo(); }} noValidate>
            <label className="block">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu correo</span>
              <input type="email" inputMode="email" autoComplete="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }} placeholder="tu@correo.com" className="mt-1 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[17px] outline-none focus:border-[var(--accent)]" />
            </label>
            {error && <p role="alert" className="text-[14px] font-medium text-[var(--accent-2)]">{error}</p>}
            <CasillaAutorizacion marcada={autoriza} onCambio={setAutoriza} />
            <BotonPrimario type="submit" disabled={!valido || !autoriza || ocupado}>
              {ocupado ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Enviando…</> : 'Enviarme mi código'}
            </BotonPrimario>
          </motion.form>
          <motion.p {...entrada(3)} className="mt-4 flex items-start gap-2 text-[13px] text-[var(--text-secondary)]"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> Sin contraseñas: te llega un código de {LARGO_CODIGO} números a tu correo.</motion.p>
        </>
      ) : (
        <motion.div {...entrada(1)} className="mt-12 text-center" aria-live="polite">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--accent)]"><MailCheck size={30} aria-hidden="true" /></span>
          <h1 className="mt-5 text-[28px] font-extrabold leading-[1.1] [font-family:var(--font-display)]">Revisa tu correo</h1>
          <p className="mx-auto mt-2 max-w-[330px] text-[15px] text-[var(--text-secondary)]">Te enviamos un código de {LARGO_CODIGO} números a <strong className="text-[var(--text-primary)]">{email.trim()}</strong>. Escríbelo aquí, o toca el enlace del correo.</p>
          <form className="mx-auto mt-6 flex max-w-[320px] flex-col gap-3" onSubmit={(e) => { e.preventDefault(); void verificar(codigo); }} noValidate>
            <label className="block text-left">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Código de {LARGO_CODIGO} números</span>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={LARGO_CODIGO}
                value={codigo}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, LARGO_CODIGO);
                  setCodigo(v);
                  if (error) setError(null);
                  if (v.length === LARGO_CODIGO) void verificar(v);
                }}
                placeholder={'0'.repeat(LARGO_CODIGO)}
                aria-label={`Código de ${LARGO_CODIGO} números`}
                className="mt-1 h-16 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-center text-[24px] font-bold tracking-[0.3em] outline-none placeholder:tracking-[0.3em] placeholder:text-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] focus:border-[var(--accent)]"
              />
            </label>
            {error && <p role="alert" className="text-left text-[14px] font-medium text-[var(--accent-2)]">{error}</p>}
            <BotonPrimario type="submit" disabled={codigo.length !== LARGO_CODIGO || ocupado}>
              {ocupado ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Verificando…</> : 'Entrar'}
            </BotonPrimario>
          </form>
          <div className="mt-4 flex flex-col items-center gap-1">
            <button type="button" disabled={espera > 0 || ocupado} onClick={() => { track('login_codigo_reenviado'); void pedirCodigo(); }} className="flex min-h-11 items-center px-3 text-[14px] font-semibold text-[var(--accent)] underline underline-offset-4 disabled:text-[var(--text-secondary)] disabled:no-underline">
              {espera > 0 ? `Pedir otro código en ${espera}s` : 'Pedir otro código'}
            </button>
            <button type="button" onClick={() => { setPaso('correo'); setError(null); setCodigo(''); }} className="flex min-h-11 items-center px-3 text-[14px] font-medium text-[var(--text-secondary)] underline underline-offset-4">Usar otro correo</button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
