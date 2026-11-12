'use client';

import { motion } from 'motion/react';
import { Check, Droplet, Flag, Flame, Lock, ShieldCheck, Zap } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { nivelDe } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function Logros() {
  const [d] = useAppData();
  if (!d) return <Esqueleto />;
  const nivel = nivelDe(d.xp);
  const total = d.grasasSemana.reduce((a, b) => a + b, 0);
  const maxG = Math.max(1, ...d.grasasSemana);
  const proteinaDias = d.proteinaDias.filter(Boolean).length;
  const r = 32;
  const c = 2 * Math.PI * r;
  const pctRacha = Math.min(1, d.racha / 30);
  const medallas = [
    { n: 'Cazador de grasas', ok: true, icon: Droplet, tono: 'o' },
    { n: '25% del camino', ok: true, icon: Flag, tono: 'g' },
    { n: '50% del camino', ok: true, icon: Flag, tono: 'g' },
    { n: 'Meta alcanzada', ok: false, icon: Lock, tono: 'z' },
  ];
  return (
    <main className="px-5 pt-5">
      <header className="flex items-center justify-between">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]">Logros</h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#A83D06] px-3 py-1 text-[13px] font-extrabold text-white"><Zap size={13} aria-hidden="true" /> Nivel {nivel.actual.n} · {d.xp} XP</span>
      </header>
      <p className="text-[14px] text-[var(--text-secondary)]">Constancia, no kilos a lo bruto.</p>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu siguiente logro" className="relative mt-4 overflow-hidden rounded-[18px] p-4 text-[#F4FAF5] shadow-[0_16px_28px_-12px_rgb(47_86_64/.8)] [background:radial-gradient(150px_110px_at_85%_10%,rgb(255_138_61/.55),transparent_70%),linear-gradient(160deg,#3F7358,#2F5640_60%,#24432F)]">
        <p className="text-[12px] font-bold uppercase tracking-[0.09em] opacity-85">Tu siguiente logro</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative size-20 shrink-0 [filter:drop-shadow(0_0_10px_rgb(255_138_61/.55))]">
            <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r={r} fill="none" strokeWidth="9" stroke="rgb(255 255 255/.2)" />
              <motion.circle cx="40" cy="40" r={r} fill="none" strokeWidth="9" stroke="#FF8A3D" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pctRacha) }} transition={{ duration: 0.9, ease: EASE }} transform="rotate(-90 40 40)" />
            </svg>
            <Flame size={26} className="absolute inset-0 m-auto text-[#FFD2B0]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[17px] font-extrabold [font-family:var(--font-display)]">Racha de 30 días</h2>
            <p className="text-[32px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]"><Cuenta valor={d.racha} /> <span className="text-[14px] font-semibold opacity-85">de 30 días</span></p>
            <p className="mt-1 text-[14px] font-bold text-[#FFD2B0]">Te faltan {30 - d.racha} · premio +100 XP</p>
          </div>
        </div>
      </motion.section>

      <section aria-label="Casi lo logras" className="mt-5">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Casi lo logras</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {[
            { t: 'Semana del Chequeo', v: '5 / 7', p: 5 / 7, nota: 'Responde el Chequeo 2 días más', icon: ShieldCheck, o: false },
            { t: 'Cazador de grasas II', v: `${Math.max(640, total)} / 1.000 kcal`, p: Math.min(1, Math.max(640, total) / 1000), nota: `Te faltan ${Math.max(0, 1000 - Math.max(640, total))} kcal por atrapar`, icon: Droplet, o: true },
          ].map((x) => (
            <li key={x.t} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-3">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${x.o ? 'bg-[rgb(232_89_12/.14)] text-[#A83D06]' : 'bg-[var(--chip-bg)] text-[var(--accent)]'}`}><x.icon size={18} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <p className="flex justify-between gap-2 text-[15px] font-bold"><span>{x.t}</span><span className={`text-[14px] tabular-nums ${x.o ? 'text-[#A83D06]' : 'text-[var(--accent)]'}`}>{x.v}</span></p>
                <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><motion.span initial={{ width: 0 }} animate={{ width: `${x.p * 100}%` }} transition={{ duration: 0.8, ease: EASE }} className="block h-full rounded-full" style={{ background: x.o ? 'linear-gradient(90deg,#FF8A3D,#E8590C)' : 'linear-gradient(90deg,#4B8062,#3D6B4F)' }} /></span>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{x.nota}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Ya son tuyos" className="mt-5">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Ya son tuyos</h2>
        <ul className="mt-3 grid grid-cols-4 gap-2">
          {medallas.map((m, i) => (
            <motion.li key={m.n} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 * i }} className="text-center">
              <span className={`relative mx-auto flex size-14 items-center justify-center rounded-full ${m.tono === 'o' ? 'text-white [background:linear-gradient(145deg,#FF8A3D,#E8590C)] shadow-[0_6px_14px_-4px_rgb(232_89_12/.7)]' : m.tono === 'g' ? 'text-white [background:linear-gradient(145deg,#5B9576,#3D6B4F)] shadow-[0_6px_14px_-4px_rgb(61_107_79/.7)]' : 'border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] text-[var(--text-secondary)]'}`}>
                <m.icon size={22} aria-hidden="true" />
                {m.ok && <span className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[#2F5640] text-white"><Check size={10} strokeWidth={3.5} /></span>}
              </span>
              <span className="mt-1.5 block text-[12px] font-bold leading-tight">{m.n}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <section aria-label="Tu semana" className="hairline-card mt-5 rounded-[var(--radius-card)] p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu semana</h2>
            <p className="text-[26px] font-extrabold leading-tight tabular-nums text-[#A83D06] [font-family:var(--font-display)]"><Cuenta valor={total} /> <span className="text-[14px] font-semibold text-[var(--text-primary)]">kcal atrapadas</span></p>
          </div>
          <span className="rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-bold text-[var(--accent)]">Proteína {proteinaDias} de 7 días</span>
        </div>
        <div className="mt-3 flex h-20 items-end gap-2" role="img" aria-label={`Grasas atrapadas por día: ${d.grasasSemana.join(', ')} kcal`}>
          {d.grasasSemana.map((g, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <motion.span initial={{ height: 0 }} animate={{ height: g === 0 ? 4 : `${(g / maxG) * 100}%` }} transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }} className="block w-full rounded-t-[6px] rounded-b-[3px]" style={{ background: g === 0 ? 'color-mix(in oklab, var(--text-secondary) 30%, transparent)' : 'linear-gradient(180deg,#FF8A3D,#E8590C)' }} />
              <span className={`text-[12px] font-extrabold ${i === 6 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{DIAS[i]}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
