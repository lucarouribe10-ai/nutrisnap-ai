'use client';
import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { guardarApp, leerApp, type AppData } from '@/lib/app-store';

/** Lee/guarda los datos de la app interna; mientras carga devuelve null (la pantalla muestra su esqueleto). */
export function useAppData() {
  const [d, setD] = useState<AppData | null>(null);
  useEffect(() => setD(leerApp()), []);
  const actualizar = (fn: (x: AppData) => AppData) => setD((prev) => { if (!prev) return prev; const n = fn(prev); guardarApp(n); return n; });
  return [d, actualizar] as const;
}

/** Número que cuenta hasta su valor al aparecer (baseline 2). */
export function Cuenta({ valor, decimales = 0 }: { valor: number; decimales?: number }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) return setV(valor);
    const c = animate(0, valor, { duration: 0.9, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [valor, reduce]);
  return <>{new Intl.NumberFormat('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(decimales ? v : Math.round(v))}</>;
}

export function Esqueleto() {
  return (
    <main className="px-5 pt-6" aria-busy="true" aria-label="Cargando">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-[var(--surface-2)]" />
      <div className="mt-5 h-36 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      <div className="mt-3 h-28 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      <div className="mt-3 h-20 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
    </main>
  );
}
