'use client';

import { motion } from 'motion/react';
import { Check, Droplet, Flag, Flame, Lock, Star } from 'lucide-react';
import { LOGROS, type IconoLogro } from '@/lib/logros';
import type { AppData } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';

const ICONOS: Record<IconoLogro, typeof Flame> = { flame: Flame, drop: Droplet, flag: Flag, star: Star };
const COLOR: Record<IconoLogro, string> = {
  flame: 'linear-gradient(145deg,#FF8A3D,#E8590C)',
  drop: 'linear-gradient(145deg,#FFA35C,#D9480F)',
  flag: 'linear-gradient(145deg,#5B9576,#3D6B4F)',
  star: 'linear-gradient(145deg,#7FB896,#3D6B4F)',
};
const W = 300;
const PASO = 118;
const XS = [150, 78, 150, 222]; // zigzag suave

/** El camino de logros (patrón del "camino" de Duolingo): ordenado por dificultad, con el actual resaltado y lo que sigue bloqueado. */
export function CaminoLogros({ d }: { d: AppData }) {
  const nodos = LOGROS.map((l, i) => ({ l, x: XS[i % XS.length], y: 70 + i * PASO, ok: d.logros.includes(l.id) }));
  const actualIdx = nodos.findIndex((n) => !n.ok);
  const H = 70 + (nodos.length - 1) * PASO + 90;
  const trazo = (a: { x: number; y: number }, b: { x: number; y: number }) => `M${a.x} ${a.y} C${a.x} ${a.y + PASO * 0.55}, ${b.x} ${b.y - PASO * 0.55}, ${b.x} ${b.y}`;
  return (
    <section aria-label="Tu camino de logros" className="mt-5">
      <h2 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu camino · {d.logros.length} de {LOGROS.length}</h2>
      <div className="relative mx-auto mt-3 w-full max-w-[360px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {nodos.slice(0, -1).map((n, i) => {
            const sig = nodos[i + 1];
            const hecho = n.ok && (sig.ok || i + 1 === actualIdx);
            return <path key={i} d={trazo(n, sig)} fill="none" strokeWidth={hecho ? 8 : 6} strokeLinecap="round" stroke={hecho ? '#F6B073' : 'rgb(120 130 124 / .28)'} strokeDasharray={hecho ? undefined : '2 12'} />;
          })}
        </svg>
        <ol className="absolute inset-0 list-none">
          {nodos.map((n, i) => {
            const Ic = ICONOS[n.l.icono];
            const actual = i === actualIdx;
            const prog = n.l.progreso(d);
            return (
              <motion.li key={n.l.id} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 * i }} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}>
                <div className="relative mx-auto size-[68px]">
                  {actual && <motion.span aria-hidden="true" className="absolute -inset-2 rounded-full border-[3px] border-[#E8590C]" animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 2, repeat: Infinity }} />}
                  <span className={`relative flex size-full items-center justify-center rounded-full ${n.ok ? 'text-white shadow-[0_6px_0_rgb(0_0_0/.2)]' : actual ? 'border-[3px] border-[#E8590C] bg-[var(--surface)] text-[#E8590C] shadow-[0_6px_0_rgb(232_89_12/.25)]' : 'border-2 border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] bg-[var(--surface)] text-[var(--text-secondary)]'}`} style={n.ok ? { background: COLOR[n.l.icono] } : undefined}>
                    {n.ok ? <Ic size={28} aria-hidden="true" /> : actual ? <Ic size={28} aria-hidden="true" /> : <Lock size={22} aria-hidden="true" />}
                  </span>
                  {n.ok && <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[#2F5640] text-white"><Check size={13} strokeWidth={3.5} aria-label="Logrado" /></span>}
                </div>
                <p className={`mx-auto mt-2 max-w-[112px] text-[13px] font-extrabold leading-tight ${n.ok || actual ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{n.l.nombre}</p>
                {actual && (
                  <p className="mx-auto mt-1 inline-block rounded-full bg-[#A83D06] px-2.5 py-0.5 text-[12px] font-bold text-white">{prog.actual}/{prog.meta}{n.l.unidad ? ` ${n.l.unidad}` : ''} · +{n.l.xp} XP</p>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
