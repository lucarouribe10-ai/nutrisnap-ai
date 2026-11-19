'use client';

import { motion, useReducedMotion } from 'motion/react';

/** Barra horizontal que se dibuja de 0 al valor (pct 0-100). Sin movimiento si la persona lo pidió así. */
export function Barra({ pct, i = 0, alto = 'h-2.5' }: { pct: number; i?: number; alto?: string }) {
  const reduce = useReducedMotion();
  const ancho = `${Math.max(0, Math.min(100, pct))}%`;
  return (
    <span className={`block ${alto} flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]`} aria-hidden="true">
      <motion.span className="block h-full rounded-full bg-[var(--negro)]" initial={reduce ? false : { width: 0 }} animate={{ width: ancho }} transition={{ duration: 0.6, delay: Math.min(i, 10) * 0.04, ease: [0.16, 1, 0.3, 1] }} />
    </span>
  );
}
