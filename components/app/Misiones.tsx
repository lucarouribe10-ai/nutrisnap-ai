'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Droplet, Dumbbell, Gift, Lock, Utensils } from 'lucide-react';
import { abrirCofre, cofreListo, misiones, XP_COFRE, type AppData } from '@/lib/app-store';
import { BotonGordo } from './ui3d';
import { vibrar } from '@/lib/haptics';
import { EASE } from '@/components/onboarding/ui';

const ICONOS = { cubiertos: Utensils, musculo: Dumbbell, gota: Droplet };

/** Misiones del día + cofre (patrón de las metas diarias de Duolingo). Se completan comiendo y registrando, sin presión. */
export function Misiones({ d, actualizar }: { d: AppData; actualizar: (fn: (x: AppData) => AppData) => void }) {
  const [premio, setPremio] = useState<{ xp: number; nivel: boolean } | null>(null);
  const lista = misiones(d);
  const hechas = lista.filter((m) => m.actual >= m.meta).length;
  const listo = cofreListo(d);
  const abierto = d.cofre === new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const abrir = () => {
    const r = abrirCofre(d);
    actualizar(() => r.data);
    setPremio({ xp: XP_COFRE, nivel: r.subioNivel });
    vibrar([20, 40, 20]);
  };
  return (
    <section aria-label="Misiones de hoy" className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="text-[17px] font-extrabold [font-family:var(--font-display)]">Misiones de hoy</h2><p className="text-[14px] text-[var(--text-secondary)]">{hechas} de 3 · cofre de +{XP_COFRE} XP</p></div>
        <button type="button" onClick={abrir} disabled={!listo || abierto} aria-label={abierto ? 'Cofre abierto' : listo ? 'Abrir el cofre del día' : 'Cofre bloqueado: completa las 3 misiones'} className={`relative flex size-14 shrink-0 items-center justify-center rounded-[16px] ${abierto ? 'bg-[var(--chip-bg)] text-[var(--accent)]' : listo ? 'bg-[#E8590C] text-white shadow-[0_4px_0_#A83D06] active:translate-y-[3px] active:shadow-[0_1px_0_#A83D06]' : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'}`}>
          {abierto ? <Check size={26} strokeWidth={3} aria-hidden="true" /> : listo ? <motion.span animate={{ rotate: [0, -8, 8, -5, 0], scale: [1, 1.08, 1] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}><Gift size={26} aria-hidden="true" /></motion.span> : <Lock size={22} aria-hidden="true" />}
        </button>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {lista.map((m) => {
          const Ic = ICONOS[m.icono];
          const ok = m.actual >= m.meta;
          return (
            <li key={m.id} className="flex items-center gap-3">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--chip-bg)] text-[var(--accent)]'}`}>{ok ? <Check size={16} strokeWidth={3.5} aria-label="Hecha" /> : <Ic size={17} aria-hidden="true" />}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2 text-[14px] font-bold"><span>{m.titulo}</span><span className="whitespace-nowrap text-[13px] tabular-nums text-[var(--text-secondary)]">{m.actual}/{m.meta}{'unidad' in m && m.unidad ? ` ${m.unidad}` : ''}</span></span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.actual / m.meta) * 100)}%` }} transition={{ duration: 0.7, ease: EASE }} className="block h-full rounded-full bg-[var(--accent)]" /></span>
              </span>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {premio && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={() => setPremio(null)}>
            <motion.div initial={{ scale: 0.7, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }} role="dialog" aria-modal="true" aria-label="Cofre abierto" onClick={(e) => e.stopPropagation()} className="w-full max-w-[340px] rounded-[24px] bg-[var(--bg)] p-6 text-center">
              <motion.span initial={{ rotate: -20, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.15 }} className="mx-auto flex size-20 items-center justify-center rounded-[24px] bg-[#E8590C] text-white shadow-[0_6px_0_#A83D06]"><Gift size={38} aria-hidden="true" /></motion.span>
              <p className="mt-5 text-[26px] font-extrabold [font-family:var(--font-display)]">¡Cofre abierto!</p>
              <p className="mt-1 text-[20px] font-extrabold text-[#A83D06]">+{premio.xp} XP</p>
              {premio.nivel && <p className="mt-2 text-[15px] font-semibold text-[var(--accent)]">Subiste de nivel y ganaste un escudo de racha.</p>}
              <div className="mt-6"><BotonGordo onClick={() => setPremio(null)}>Genial</BotonGordo></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
