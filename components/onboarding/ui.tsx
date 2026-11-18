'use client';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Barra de progreso fina (goal gradient): arranca en 8%, % real, botón atrás 44px. */
export function BarraProgreso({ pct, onAtras }: { pct: number; onAtras?: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-4">
      <button
        type="button"
        onClick={onAtras}
        disabled={!onAtras}
        aria-label="Volver al paso anterior"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] disabled:opacity-0"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_12%,transparent)]" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <motion.div className="h-full rounded-full bg-[var(--accent)]" initial={false} animate={{ width: `${Math.max(8, pct)}%` }} transition={{ duration: 0.3, ease: EASE }} />
      </div>
      <span className="w-9 text-right text-[12px] font-semibold tabular-nums text-[var(--text-secondary)]">{Math.round(Math.max(8, pct))}%</span>
    </div>
  );
}

export function Pregunta({ titulo, sub }: { titulo: ReactNode; sub?: string }) {
  return (
    <div className="px-5 pt-8">
      <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</h1>
      {sub && <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{sub}</p>}
    </div>
  );
}

export function ChipOpcion({
  icon: Icono,
  titulo,
  detalle,
  seleccionado,
  onClick,
  disabled,
  indice = 0,
}: {
  indice?: number;
  icon?: LucideIcon;
  titulo: string;
  detalle?: string;
  seleccionado: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.06 * indice, ease: EASE }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={seleccionado}
      className={`flex min-h-[60px] w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3 text-left transition-colors ${
        seleccionado
          ? 'border-[1.5px] border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_9%,var(--surface))] shadow-[var(--shadow-1)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {Icono && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--chip-bg)] text-[var(--accent)]">
          <Icono size={20} strokeWidth={2.2} aria-hidden="true" />
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[16px] font-semibold text-[var(--text-primary)]">{titulo}</span>
        {detalle && <span className="block text-[13px] text-[var(--text-secondary)]">{detalle}</span>}
      </span>
      <motion.span
        initial={false}
        animate={{ scale: seleccionado ? 1 : 0.5, opacity: seleccionado ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex size-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)]"
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      </motion.span>
    </motion.button>
  );
}

export function BotonPrimario({ children, onClick, disabled, type = 'button', href }: { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; href?: string }) {
  const cls = `flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] px-4 text-center text-[17px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_rgb(21_25_26/.25)] transition-opacity [touch-action:manipulation] ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;
  if (href) return <motion.a whileTap={{ scale: 0.97 }} href={href} className={cls}>{children}</motion.a>;
  return (
    <motion.button whileTap={disabled ? undefined : { scale: 0.97 }} type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </motion.button>
  );
}

export function PieFijo({ children }: { children: ReactNode }) {
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_oklab,var(--text-secondary)_20%,transparent)] bg-[var(--bg)] px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">{children}</div>;
}

export function Anillo({ pct, size = 112 }: { pct: number; size?: number }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(pct)} por ciento`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={9} stroke="color-mix(in oklab, var(--text-primary) 12%, transparent)" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={9} stroke="var(--accent)" strokeLinecap="round" strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 0.7, ease: EASE }} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}
