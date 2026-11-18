'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Entrada suave y escalonada de cada tarjeta (50 ms entre una y otra); sin movimiento si la persona lo pidió así. */
export function Entrada({ i = 0, children, className }: { i?: number; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
