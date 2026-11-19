'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';

/** Número que cuenta de 0 al valor al aparecer (400-700 ms). Sin movimiento si la persona lo pidió así. */
export function Contar({ valor, decimales = 0, prefijo = '', sufijo = '' }: { valor: number; decimales?: number; prefijo?: string; sufijo?: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? valor : 0);
  const ref = useRef(valor);
  useEffect(() => {
    ref.current = valor;
    if (reduce) { setN(valor); return; }
    const c = animate(0, valor, { duration: 0.7, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [valor, reduce]);
  const txt = new Intl.NumberFormat('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n);
  return <span aria-label={`${prefijo}${new Intl.NumberFormat('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(valor)}${sufijo}`}><span aria-hidden="true">{prefijo}{txt}{sufijo}</span></span>;
}
