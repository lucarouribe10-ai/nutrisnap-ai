'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import { BotonPrimario, EASE } from './ui';
import { calcularPlan, ETIQUETA_OBJETIVO, perfilCompleto, type Plan } from '@/lib/plan';
import { leerEstado, type EstadoOnboarding } from '@/lib/onboarding-store';
import { track } from '@/lib/eventos';

type Elegido = 'anual' | 'mensual';
const fecha = (d: Date) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' }).format(d);
const suma = (dias: number) => { const d = new Date(); d.setDate(d.getDate() + dias); return d; };

export function Paywall() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<EstadoOnboarding | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [elegido, setElegido] = useState<Elegido>(params.get('plan') === 'mensual' ? 'mensual' : 'anual');
  const [fechas, setFechas] = useState({ aviso: '', cobro: '' });

  useEffect(() => {
    const e = leerEstado();
    if (!perfilCompleto(e.perfil)) {
      router.replace('/onboarding');
      return;
    }
    setEstado(e);
    setPlan(calcularPlan(e.perfil));
    setFechas({ aviso: fecha(suma(2)), cobro: fecha(suma(3)) });
    track('paywall_visto');
  }, [router]);

  if (!estado || !plan || !estado.perfil.objetivo) return <main className="min-h-dvh bg-[var(--bg)]" aria-busy="true" />;

  const monto = elegido === 'anual' ? 'US$49.99' : 'US$7.99';
  const periodo = elegido === 'anual' ? 'año' : 'mes';
  const entrada = (n: number) => (reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.06 * n, ease: EASE } });

  const empezar = () => {
    track('checkout_iniciado', { plan: elegido });
    router.push(`/entrar?plan=${elegido}`);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] px-5 pb-10 pt-4 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="flex">
        <button type="button" aria-label="Cerrar" onClick={() => { track('paywall_cerrado'); router.push('/app?plan=gratis'); }} className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={20} aria-hidden="true" /></button>
      </div>

      <motion.div {...entrada(0)} className="mt-2">
        <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">
          Tu plan para <span className="text-[var(--accent)]">{ETIQUETA_OBJETIVO[estado.perfil.objetivo]}</span> está listo
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Hecho con <strong className="font-semibold text-[var(--text-primary)]">tus respuestas</strong> y tu primera foto.</p>
      </motion.div>

      <motion.section {...entrada(1)} aria-label="Tu plan" className="hairline-card mt-5 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-1)]">
        <div className="panel-campo grid grid-cols-2 gap-3 rounded-[12px] p-3 text-center">
          <div><p className="text-[32px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{plan.kcal.toLocaleString('es-CO')}</p><p className="mt-1 text-[12px] font-semibold text-[var(--text-secondary)]">kcal al día</p></div>
          <div><p className="text-[32px] font-extrabold leading-none tabular-nums text-[var(--accent)] [font-family:var(--font-display)]">{plan.proteina} g</p><p className="mt-1 text-[12px] font-semibold text-[var(--text-secondary)]">de proteína</p></div>
        </div>
        <p className="mt-3 text-[13px] leading-snug text-[var(--text-secondary)]">Estimado con tu estatura, peso y días de entreno. Lo afinamos con tu registro de cada día.</p>
      </motion.section>

      <motion.section {...entrada(2)} aria-label="Cómo funciona tu prueba" className="mt-5">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Así funciona tu prueba de 3 días</h2>
        <ol className="relative mt-3 flex flex-col gap-4 pl-7">
          <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1.5rem)] w-[2px] bg-[color-mix(in_oklab,var(--accent)_40%,transparent)]" />
          {[
            ['Hoy', 'Acceso completo, sin cobro.', true],
            ['Día 2' + (fechas.aviso ? ` · ${fechas.aviso}` : ''), 'Te avisamos por correo y en la app.', true],
            ['Día 3' + (fechas.cobro ? ` · ${fechas.cobro}` : ''), `Primer cobro: ${monto}/${periodo}. Cancela antes y no pagas.`, false],
          ].map(([t, d, lleno]) => (
            <li key={t as string} className="relative">
              <span aria-hidden="true" className={`absolute -left-7 top-1 size-4 rounded-full border-2 border-[var(--accent)] ${lleno ? 'bg-[var(--accent)]' : 'bg-[var(--bg)]'}`} />
              <p className="text-[15px] font-bold">{t as string}</p>
              <p className="text-[13px] text-[var(--text-secondary)]">{d as string}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section {...entrada(3)} aria-label="Elige tu plan" className="mt-6 flex flex-col gap-3" role="radiogroup">
        <button type="button" role="radio" aria-checked={elegido === 'anual'} onClick={() => setElegido('anual')} className={`relative rounded-[var(--radius-card)] border p-4 text-left ${elegido === 'anual' ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] shadow-[var(--shadow-2)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)]'}`}>
          <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">Mejor precio</span>
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-[16px] font-bold">Anual</p><p className="text-[13px] text-[var(--text-secondary)]">Se cobra US$49.99 una vez al año</p></div>
            <p className="text-[26px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">US$4.17<span className="text-[13px] font-semibold text-[var(--text-secondary)]">/mes</span></p>
          </div>
        </button>
        <button type="button" role="radio" aria-checked={elegido === 'mensual'} onClick={() => setElegido('mensual')} className={`rounded-[var(--radius-card)] border p-4 text-left ${elegido === 'mensual' ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] shadow-[var(--shadow-2)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)]'}`}>
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-[16px] font-bold">Mensual</p><p className="text-[13px] text-[var(--text-secondary)]">Cancelas cuando quieras</p></div>
            <p className="text-[26px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">US$7.99<span className="text-[13px] font-semibold text-[var(--text-secondary)]">/mes</span></p>
          </div>
        </button>
      </motion.section>

      <motion.div {...entrada(4)} className="mt-5">
        <BotonPrimario onClick={empezar}>Empezar mis 3 días gratis</BotonPrimario>
        <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">Hoy no pagas nada. Se cobra {monto} el {fechas.cobro || 'día 3'}; cancela antes y no pagas.</p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-secondary)]"><ShieldCheck size={14} aria-hidden="true" /> Reembolso de 7 días, sin preguntas</p>
        <button type="button" onClick={() => { track('paywall_cerrado'); router.push('/app?plan=gratis'); }} className="mx-auto mt-3 flex min-h-11 items-center px-3 text-[14px] font-semibold text-[var(--text-secondary)] underline underline-offset-4">Ahora no, seguir con el escáner gratis</button>
        <p className="mt-4 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] p-3 text-center text-[12px] text-[var(--text-secondary)]">Vista previa: aquí se abrirá el pago seguro de Hotmart cuando conectemos tu cuenta.</p>
      </motion.div>
    </main>
  );
}
