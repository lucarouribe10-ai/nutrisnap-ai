'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, CircleHelp, Droplet, Flag, Flame, Lock, Shield, Star, X, Zap } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { NIVELES, nivelDe } from '@/lib/app-store';
import { LOGROS, QUE_DA_SUBIR, REGLAS_XP, type IconoLogro } from '@/lib/logros';
import { EASE } from '@/components/onboarding/ui';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const ICONOS: Record<IconoLogro, typeof Flame> = { flame: Flame, drop: Droplet, flag: Flag, star: Star };

export function Logros() {
  const [d] = useAppData();
  const [ayuda, setAyuda] = useState(false);
  if (!d) return <Esqueleto />;
  const nivel = nivelDe(d.xp);
  const total = d.grasasSemana.reduce((a, b) => a + b, 0);
  const maxG = Math.max(1, ...d.grasasSemana);
  const proteinaDias = d.proteinaDias.filter(Boolean).length;
  const pendientes = LOGROS.filter((l) => !d.logros.includes(l.id)).map((l) => ({ l, p: l.progreso(d) })).sort((a, b) => b.p.actual / b.p.meta - a.p.actual / a.p.meta);
  const siguiente = pendientes[0];
  const casi = pendientes.slice(1, 3);
  const ganados = LOGROS.filter((l) => d.logros.includes(l.id));
  const r = 32;
  const c = 2 * Math.PI * r;
  const Hero = siguiente ? ICONOS[siguiente.l.icono] : Star;
  return (
    <main className="px-5 pt-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]">Logros</h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#A83D06] px-3 py-1 text-[13px] font-extrabold text-white"><Zap size={13} aria-hidden="true" /> Nivel {nivel.actual.n} · {d.xp} XP</span>
      </header>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-[14px] text-[var(--text-secondary)]">Constancia, no kilos a lo bruto.</p>
        <button type="button" onClick={() => setAyuda(true)} className="inline-flex min-h-11 items-center gap-1 text-[14px] font-bold text-[var(--accent)] underline underline-offset-4"><CircleHelp size={16} aria-hidden="true" /> ¿Cómo funciona?</button>
      </div>

      {siguiente && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu siguiente logro" className="relative mt-3 overflow-hidden rounded-[18px] p-4 text-[#F4FAF5] shadow-[0_16px_28px_-12px_rgb(47_86_64/.8)] [background:radial-gradient(150px_110px_at_85%_10%,rgb(255_138_61/.55),transparent_70%),linear-gradient(160deg,#3F7358,#2F5640_60%,#24432F)]">
          <p className="text-[12px] font-bold uppercase tracking-[0.09em] opacity-85">Tu siguiente logro</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative size-20 shrink-0 [filter:drop-shadow(0_0_10px_rgb(255_138_61/.55))]">
              <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r={r} fill="none" strokeWidth="9" stroke="rgb(255 255 255/.2)" />
                <motion.circle cx="40" cy="40" r={r} fill="none" strokeWidth="9" stroke="#FF8A3D" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - siguiente.p.actual / siguiente.p.meta) }} transition={{ duration: 0.9, ease: EASE }} transform="rotate(-90 40 40)" />
              </svg>
              <Hero size={26} className="absolute inset-0 m-auto text-[#FFD2B0]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold leading-tight [font-family:var(--font-display)]">{siguiente.l.nombre}</h2>
              <p className="text-[14px] opacity-90">{siguiente.l.como}</p>
              <p className="mt-1 text-[24px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]"><Cuenta valor={siguiente.p.actual} /> <span className="text-[14px] font-semibold opacity-85">de {siguiente.p.meta.toLocaleString('es-CO')} {siguiente.l.unidad}</span></p>
              <p className="mt-1 text-[14px] font-bold text-[#FFD2B0]">Premio: +{siguiente.l.xp} XP</p>
            </div>
          </div>
        </motion.section>
      )}

      {casi.length > 0 && (
        <section aria-label="Casi lo logras" className="mt-5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Casi lo logras</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {casi.map(({ l, p }) => {
              const Ic = ICONOS[l.icono];
              const naranja = l.icono === 'drop' || l.icono === 'flame';
              return (
                <li key={l.id} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${naranja ? 'bg-[rgb(232_89_12/.14)] text-[#A83D06]' : 'bg-[var(--chip-bg)] text-[var(--accent)]'}`}><Ic size={18} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between gap-2 text-[15px] font-bold"><span>{l.nombre}</span><span className={`text-[14px] tabular-nums ${naranja ? 'text-[#A83D06]' : 'text-[var(--accent)]'}`}>{p.actual} / {p.meta}{l.unidad ? ` ${l.unidad}` : ''}</span></p>
                    <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><motion.span initial={{ width: 0 }} animate={{ width: `${(p.actual / p.meta) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} className="block h-full rounded-full" style={{ background: naranja ? 'linear-gradient(90deg,#FF8A3D,#E8590C)' : 'linear-gradient(90deg,#4B8062,#3D6B4F)' }} /></span>
                    <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{l.como} · +{l.xp} XP</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-label="Ya son tuyos" className="mt-5">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Ya son tuyos ({ganados.length} de {LOGROS.length})</h2>
        {ganados.length === 0 ? (
          <p className="mt-2 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)] p-4 text-[14px] text-[var(--text-secondary)]">Aún no tienes logros. El primero llega al registrar tu primera comida.</p>
        ) : (
          <ul className="mt-3 grid grid-cols-4 gap-2">
            {ganados.map((m, i) => {
              const Ic = ICONOS[m.icono];
              const g = m.icono === 'flag';
              return (
                <motion.li key={m.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.08 * i }} className="text-center">
                  <span className={`relative mx-auto flex size-14 items-center justify-center rounded-full text-white ${g ? '[background:linear-gradient(145deg,#5B9576,#3D6B4F)] shadow-[0_6px_14px_-4px_rgb(61_107_79/.7)]' : '[background:linear-gradient(145deg,#FF8A3D,#E8590C)] shadow-[0_6px_14px_-4px_rgb(232_89_12/.7)]'}`}>
                    <Ic size={22} aria-hidden="true" />
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[#2F5640] text-white"><Check size={10} strokeWidth={3.5} aria-label="Logrado" /></span>
                  </span>
                  <span className="mt-1.5 block text-[12px] font-bold leading-tight">{m.nombre}</span>
                </motion.li>
              );
            })}
            <li className="text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-full border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] text-[var(--text-secondary)]"><Lock size={20} aria-hidden="true" /></span><span className="mt-1.5 block text-[12px] font-bold leading-tight text-[var(--text-secondary)]">Más por ganar</span></li>
          </ul>
        )}
      </section>

      <section aria-label="Tu semana" className="hairline-card mt-5 rounded-[var(--radius-card)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Grasas atrapadas esta semana</h2>
            <p className="text-[26px] font-extrabold leading-tight tabular-nums text-[#A83D06] [font-family:var(--font-display)]"><Cuenta valor={total} /> <span className="text-[14px] font-semibold text-[var(--text-primary)]">kcal</span></p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-bold text-[var(--accent)]">Proteína {proteinaDias}/7 días</span>
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

      {ayuda && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setAyuda(false)}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: EASE }} role="dialog" aria-modal="true" aria-label="Cómo funcionan los puntos y los premios" onClick={(e) => e.stopPropagation()} className="max-h-[85dvh] w-full max-w-[480px] overflow-y-auto rounded-t-[24px] bg-[var(--bg)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_30px_-10px_rgb(0_0_0/.25)]">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[20px] font-extrabold leading-tight [font-family:var(--font-display)]">Cómo funcionan los puntos y los premios</h2>
              <button type="button" autoFocus onClick={() => setAyuda(false)} aria-label="Cerrar" className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={20} aria-hidden="true" /></button>
            </div>
            <h3 className="mt-3 flex items-center gap-2 text-[15px] font-extrabold"><Flame size={16} className="text-[#A83D06]" aria-hidden="true" /> La racha</h3>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Suma 1 día cada vez que registras al menos una comida. No importa cuántas calorías: importa la constancia.</p>
            <h3 className="mt-4 flex items-center gap-2 text-[15px] font-extrabold"><Shield size={16} className="text-[var(--accent)]" aria-hidden="true" /> El escudo de racha</h3>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Si falta un solo día, un escudo protege tu racha: no pasa nada. Empiezas con 1 y tienes {d.escudos} ahora. Si faltan dos días o más, la racha se pausa y empiezas de nuevo; lo que lograste no se pierde.</p>
            <h3 className="mt-4 flex items-center gap-2 text-[15px] font-extrabold"><Zap size={16} className="text-[#A83D06]" aria-hidden="true" /> Los puntos (XP)</h3>
            <ul className="mt-1 divide-y divide-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] text-[14px]">
              {REGLAS_XP.map((x) => <li key={x.t} className="flex justify-between gap-3 py-2"><span>{x.t}</span><strong className="whitespace-nowrap text-[#A83D06]">{x.xp}</strong></li>)}
            </ul>
            <h3 className="mt-4 text-[15px] font-extrabold">Los niveles</h3>
            <ul className="mt-1 text-[14px]">
              {NIVELES.map((n) => <li key={n.n} className={`flex justify-between gap-3 py-1.5 ${n.n === nivel.actual.n ? 'font-extrabold text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}><span>Nivel {n.n} · {n.nombre}{n.n === nivel.actual.n ? ' (tú)' : ''}</span><span className="tabular-nums">{n.desde} XP</span></li>)}
            </ul>
            <p className="mt-2 rounded-[12px] bg-[var(--chip-bg)] p-3 text-[14px] font-semibold text-[var(--accent)]">{QUE_DA_SUBIR}</p>
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">Aquí no hay castigos ni cuenta regresiva: los premios se ganan por constancia, no por bajar kilos a lo bruto.</p>
          </motion.div>
        </div>
      )}
    </main>
  );
}
