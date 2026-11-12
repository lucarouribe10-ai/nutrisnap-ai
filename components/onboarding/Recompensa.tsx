'use client';

import { motion } from 'motion/react';
import { Flame, Trophy, Zap } from 'lucide-react';

/** Recompensa por completar una acción real (24/56): XP que se llena, racha y, si aplica, un logro con spring. */
export function Recompensa({ xpGanado, xpTotal, titulo, detalle, logro }: { xpGanado: number; xpTotal: number; titulo: string; detalle: string; logro?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-3 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_9%,var(--surface))] p-4">
      <div className="flex items-center gap-3">
        <motion.span initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.1 }} className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--surface)] text-[var(--accent-2)] shadow-[var(--shadow-1)]">
          <Zap size={22} aria-hidden="true" />
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold leading-tight">+{xpGanado} XP · {titulo}</p>
          <p className="text-[14px] text-[var(--text-secondary)]">{detalle}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-2)] px-2.5 py-1 text-[12px] font-extrabold text-white"><Flame size={13} aria-hidden="true" /> Día 1</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]"><span>Nivel 1 · Novato</span><span className="tabular-nums">{xpTotal} / 100 XP</span></div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, xpTotal)}%` }} transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full [background:linear-gradient(90deg,#FF8A3D,#E8590C)]" />
        </div>
      </div>
      {logro && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.7 }} className="mt-3 flex items-center gap-2 rounded-[12px] bg-[var(--surface)] px-3 py-2">
          <Trophy size={18} className="text-[var(--accent-2)]" aria-hidden="true" />
          <span className="text-[14px] font-bold">Logro desbloqueado: {logro}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
