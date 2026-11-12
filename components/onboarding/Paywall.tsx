'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Camera, Check, Droplet, Mic, ScanLine, ShieldCheck, X } from 'lucide-react';
import { BotonPrimario, EASE, PieFijo } from './ui';
import { calcularPlan, DOLORES, ETIQUETA_OBJETIVO, fechaMeta, perfilCompleto, type Plan } from '@/lib/plan';
import { leerEstado, type EstadoOnboarding } from '@/lib/onboarding-store';
import { track } from '@/lib/eventos';

type Elegido = 'anual' | 'mensual';
const fecha = (d: Date) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' }).format(d);
const suma = (dias: number) => { const d = new Date(); d.setDate(d.getDate() + dias); return d; };

function Cuenta({ valor, sufijo = '' }: { valor: number; sufijo?: string }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) return setV(valor);
    const c = animate(0, valor, { duration: 0.9, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [valor, reduce]);
  return <>{v.toLocaleString('es-CO')}{sufijo}</>;
}

export function Paywall() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<EstadoOnboarding | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [elegido, setElegido] = useState<Elegido>(params.get('plan') === 'mensual' ? 'mensual' : 'anual');
  const [fechas, setFechas] = useState({ hoy: '', aviso: '', cobro: '' });
  const [errorNav, setErrorNav] = useState(false);

  useEffect(() => {
    const e = leerEstado();
    if (!perfilCompleto(e.perfil)) {
      router.replace('/onboarding');
      return;
    }
    setEstado(e);
    setPlan(calcularPlan(e.perfil));
    setFechas({ hoy: fecha(suma(0)), aviso: fecha(suma(2)), cobro: fecha(suma(3)) });
    track('paywall_visto');
  }, [router]);

  if (!estado || !plan || !estado.perfil.objetivo) {
    return (
      <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] px-5 pt-16" aria-busy="true" aria-label="Cargando tu plan">
        <div className="h-9 w-3/4 animate-pulse rounded-lg bg-[var(--surface-2)]" />
        <div className="mt-4 h-24 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="mt-4 h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </main>
    );
  }

  const { perfil, xp } = estado;
  const monto = elegido === 'anual' ? 'US$49.99' : 'US$7.99';
  const periodo = elegido === 'anual' ? 'año' : 'mes';
  const metaFecha = fechaMeta(perfil, plan);
  const freno = perfil.dolor ? DOLORES[perfil.dolor] : null;
  const entrada = (n: number) => (reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.06 * n, ease: EASE } });
  const cerrar = () => { track('paywall_cerrado'); router.push('/app?plan=gratis'); };
  const empezar = () => {
    try {
      track('checkout_iniciado', { plan: elegido });
      router.push(`/entrar?plan=${elegido}`);
    } catch {
      setErrorNav(true);
    }
  };

  const nodos: [string, string, boolean][] = [
    [`Hoy · ${fechas.hoy}`, 'Acceso completo, sin cobro.', true],
    [`${fechas.aviso}`, 'Te avisamos por correo y en la app.', true],
    [`${fechas.cobro}`, `Primer cobro: ${monto}/${periodo}. Cancela antes y no pagas.`, false],
  ];

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] px-5 pb-44 pt-3 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <button type="button" aria-label="Cerrar" onClick={cerrar} className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={20} aria-hidden="true" /></button>

      <motion.div {...entrada(0)} className="mt-1">
        <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">
          {perfil.nombre ? `${perfil.nombre}, tu` : 'Tu'} plan para <span className="text-[var(--accent)]">{ETIQUETA_OBJETIVO[perfil.objetivo!]}</span> está listo
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Hecho con <strong className="font-semibold text-[var(--text-primary)]">tus respuestas</strong> y tu primera foto.</p>
        {xp > 0 && <p className="mt-3 text-[14px]"><strong className="font-bold text-[#A83D06]">{xp} XP · racha de 1 día.</strong> <span className="text-[var(--text-secondary)]">Se guardan con tu cuenta.</span></p>}
      </motion.div>

      <motion.section {...entrada(1)} aria-label="Tu plan" className="hairline-card mt-5 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-1)]">
        <div className="panel-campo grid grid-cols-2 gap-3 rounded-[12px] p-3 text-center">
          <div><p className="text-[32px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]"><Cuenta valor={plan.kcal} /></p><p className="mt-1 text-[14px] font-semibold text-[var(--text-secondary)]">kcal al día</p></div>
          <div><p className="text-[32px] font-extrabold leading-none tabular-nums text-[var(--accent)] [font-family:var(--font-display)]"><Cuenta valor={plan.proteina} sufijo=" g" /></p><p className="mt-1 text-[14px] font-semibold text-[var(--text-secondary)]">de proteína</p></div>
        </div>
        <p className="mt-3 text-[14px] leading-snug text-[var(--text-secondary)]">
          {metaFecha && perfil.meta ? <>Llegarías a <strong className="text-[var(--text-primary)]">{perfil.meta} kg</strong> hacia el {new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' }).format(metaFecha)} (estimado). </> : null}
          {freno ? <>Tu freno era «{freno.freno.toLowerCase()}»: {freno.solucion.charAt(0).toLowerCase() + freno.solucion.slice(1)}</> : 'Lo afinamos con tu registro de cada día.'}
        </p>
      </motion.section>

      {estado.resultado && (
        <motion.section {...entrada(1)} aria-label="Lo que ya atrapaste" className="mt-4 rounded-[var(--radius-card)] border-l-4 border-[var(--accent-2)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu primera foto</p>
          {estado.resultado.extraAceite > 0 ? (
            <>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[22px] font-extrabold tabular-nums [font-family:var(--font-display)]">
                <span className="text-[var(--text-secondary)] line-through decoration-2">{estado.resultado.kcalBase}</span>
                <ArrowRight size={18} aria-hidden="true" />
                <span>{estado.resultado.kcalBase + estado.resultado.extraAceite} kcal</span>
              </p>
              <p className="mt-1 flex items-start gap-2 text-[14px] text-[var(--text-secondary)]"><Droplet size={16} className="mt-0.5 shrink-0 text-[var(--accent-2)]" aria-hidden="true" /> El Chequeo atrapó {estado.resultado.extraAceite} kcal que tu foto no veía.</p>
            </>
          ) : (
            <p className="mt-1 text-[15px]">Registraste tu primera comida en segundos: <strong>{estado.resultado.kcalBase} kcal</strong>.</p>
          )}
        </motion.section>
      )}

      <motion.section {...entrada(4)} aria-label="Elige tu plan" className="mt-7 flex flex-col gap-3" role="radiogroup">
        {([
          ['anual', 'Anual', 'US$49.99 al año', 'US$4.17', 'Mejor precio'],
          ['mensual', 'Mensual', 'Cancelas cuando quieras', 'US$7.99', ''],
        ] as const).map(([id, nombre, det, precio, badge]) => (
          <motion.button key={id} type="button" whileTap={{ scale: 0.98 }} role="radio" aria-checked={elegido === id} onClick={() => setElegido(id)} className={`relative rounded-[var(--radius-card)] border p-4 text-left ${elegido === id ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] shadow-[var(--shadow-2)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)]'}`}>
            {badge && <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">{badge}</span>}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${elegido === id ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)]'}`}>{elegido === id && <Check size={14} strokeWidth={3.5} />}</span>
                <div><p className="text-[17px] font-bold">{nombre}</p><p className="text-[14px] text-[var(--text-secondary)]">{det}</p></div>
              </div>
              <p className="text-right text-[26px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{precio}<span className="text-[14px] font-semibold text-[var(--text-secondary)]">/mes</span></p>
            </div>
          </motion.button>
        ))}
      </motion.section>

      <motion.section {...entrada(2)} aria-label="Qué incluye" className="mt-5">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Con tu prueba desbloqueas</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {([[Camera, 'Fotos con el Chequeo de Grasas Ocultas (hasta 8 al día)'], [Mic, 'Corrección por voz, puntos, logros y tu camino a la meta'], [ScanLine, 'El escáner de códigos sigue gratis, siempre']] as const).map(([Icono, t]) => (
            <li key={t} className="flex items-center gap-3 text-[15px]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[var(--accent)]"><Icono size={20} aria-hidden="true" /></span>
              {t}
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section {...entrada(3)} aria-label="Cómo funciona tu prueba" className="mt-6">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Así funciona tu prueba de 3 días</h2>
        <ol className="relative mt-3 flex flex-col gap-4 pl-7">
          <motion.span aria-hidden="true" initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ originY: 0 }} className="absolute left-[7px] top-2 h-[calc(100%-1.5rem)] w-[2px] bg-[color-mix(in_oklab,var(--accent)_40%,transparent)]" />
          {nodos.map(([t, d, lleno]) => (
            <li key={t} className="relative">
              <span aria-hidden="true" className={`absolute -left-7 top-1 size-4 rounded-full border-2 border-[var(--accent)] ${lleno ? 'bg-[var(--accent)]' : 'bg-[var(--bg)]'}`} />
              <p className="text-[15px] font-bold">{t}</p>
              <p className="text-[14px] text-[var(--text-secondary)]">{d}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.div {...entrada(5)} className="mt-5 space-y-3 text-[14px] text-[var(--text-secondary)]">
        <p className="flex items-start gap-2"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" /><span><strong className="font-bold text-[var(--text-primary)]">Garantía de Cero Sorpresas:</strong> cancelas cuando quieras y tienes 7 días de reembolso, sin preguntas.</span></p>
        <p className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] p-3 text-center">Vista previa: el pago de Hotmart y el aviso por correo se activan cuando conectemos tus cuentas.</p>
        <p className="text-center"><Link href="/terminos" className="underline underline-offset-4">Términos</Link> · <Link href="/privacidad" className="underline underline-offset-4">Privacidad</Link> · <Link href="/reembolsos" className="underline underline-offset-4">Reembolsos</Link></p>
      </motion.div>

      <PieFijo>
        {errorNav && <p role="alert" className="mb-2 text-center text-[14px] font-semibold text-[#A83D06]">No pudimos continuar. Revisa tu conexión e intenta de nuevo.</p>}
        <BotonPrimario onClick={empezar}>Empezar mis 3 días gratis</BotonPrimario>
        <p className="mt-2 text-center text-[14px] text-[var(--text-secondary)]">Hoy US$0. Luego {monto}/{periodo} el {fechas.cobro}.</p>
        <p className="mt-0.5 flex items-center justify-center gap-1.5 text-center text-[14px] font-semibold text-[var(--text-primary)]"><ShieldCheck size={15} className="text-[var(--accent)]" aria-hidden="true" /> Aviso 1 día antes · 7 días de reembolso</p>
        <button type="button" onClick={cerrar} className="mx-auto mt-1 flex min-h-11 items-center px-3 text-[14px] font-semibold text-[var(--text-secondary)] underline underline-offset-4">Ahora no, seguir con el escáner gratis</button>
      </PieFijo>
    </main>
  );
}
