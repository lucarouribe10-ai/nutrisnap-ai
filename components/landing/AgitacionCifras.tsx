'use client';

// §3 AGITACIÓN en formato ESCANEABLE (regla de escaneabilidad mobile): el costo de la
// inacción va como CIFRAS en tarjetas con ícono, no como prosa. Mismos tokens y misma
// mecánica de reveal que el kit. Cálculo trazable: 1 cda de aceite ≈ 120 kcal;
// 120 × 30 = 3.600 kcal ≈ 0,47 kg de grasa (7.700 kcal/kg).
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { CalendarDays, Droplet, Scale, type LucideIcon } from 'lucide-react';
import { IconChip, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy } from './MarkedCopy';

export interface CifraAgitacion {
  icon: LucideIcon;
  /** Valor numérico: cuenta desde 0 al entrar en pantalla. */
  valor: number;
  decimales?: number;
  prefijo?: string;
  unidad?: string;
  etiquetaMarked: string;
}

export interface AgitacionCifrasProps {
  kicker?: string;
  /** Título MARCADO de la sección (solo-titulares). */
  tituloMarked: string;
  /** 3 cifras: el costo de seguir igual. */
  cifras: CifraAgitacion[];
  /** Frase de cierre corta. */
  cierreMarked: string;
  contraste: { labelHoy: string; hoy: string; labelFuturo: string; futuro: string };
  id?: string;
}

export const ICONOS_AGITACION = { Droplet, CalendarDays, Scale };

function Contador({ valor, decimales = 0, prefijo = '' }: { valor: number; decimales?: number; prefijo?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visto = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? valor : 0);
  useEffect(() => {
    if (reduce) { setV(valor); return; }
    if (!visto) return;
    const c = animate(0, valor, { duration: 0.9, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [visto, valor, reduce]);
  return (
    <span ref={ref}>
      {prefijo}
      {new Intl.NumberFormat('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(v)}
    </span>
  );
}

export function AgitacionCifras({ kicker = 'EL COSTO DE SEGUIR IGUAL', tituloMarked, cifras, cierreMarked, contraste, id }: AgitacionCifrasProps) {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} className="mx-auto max-w-[620px]">
        <motion.div variants={item} className="mb-6">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>
        <ul className="flex flex-col gap-3">
          {cifras.map((c, i) => (
            <motion.li
              key={i}
              variants={item}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--bg)] p-4"
            >
              <IconChip icon={c.icon} tone="accent" />
              <div>
                <p className="text-[32px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  <Contador valor={c.valor} decimales={c.decimales} prefijo={c.prefijo} />
                  {c.unidad && <span className="ml-1 text-[15px] font-semibold text-[var(--text-secondary)]">{c.unidad}</span>}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)]">
                  <MarkedCopy text={c.etiquetaMarked} />
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.p variants={item} className="mt-6 text-[17px] font-medium leading-snug text-[var(--text-primary)]">
          <MarkedCopy text={cierreMarked} />
        </motion.p>

        <motion.div variants={item} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border-l-4 border-[var(--accent)] bg-[var(--bg)] p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{contraste.labelHoy}</p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-primary)]">{contraste.hoy}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border-l-4 border-[var(--accent-2)] bg-[var(--surface-2)] p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-2)]">{contraste.labelFuturo}</p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{contraste.futuro}</p>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
