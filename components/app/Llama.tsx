'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';

/** La llama de la racha: encendida (naranja, respira) o apagada (gris). Patrón de Duolingo, dibujo propio. */
export function Llama({ size = 48, encendida = true }: { size?: number; encendida?: boolean }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  return (
    <motion.svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" animate={encendida && !reduce ? { scale: [1, 1.06, 0.98, 1.04, 1], rotate: [0, -2, 1.5, -1, 0] } : undefined} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} style={{ originY: 1 }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={encendida ? '#FFB347' : '#C9CDC9'} /><stop offset="0.55" stopColor={encendida ? '#FF7A1F' : '#B4B9B4'} /><stop offset="1" stopColor={encendida ? '#E8590C' : '#A3A8A3'} /></linearGradient>
      </defs>
      <path d="M24 3c2 7 11 11 11 22a11 11 0 0 1-22 0c0-4 2-7 4-9 0 4 2 6 4.5 6.5C19 17 20 9 24 3z" fill={`url(#g${id})`} />
      <path d="M24 22c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2.5-5 0 2 .8 3 2 3 0-2-.5-4 .5-7z" fill={encendida ? '#FFE3A8' : '#E4E7E4'} opacity={encendida ? 0.95 : 0.8} />
    </motion.svg>
  );
}
