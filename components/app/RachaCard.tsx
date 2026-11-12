'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, ChevronRight, Flame, Shield } from 'lucide-react';
import { LOGROS } from '@/lib/logros';
import { EASE } from '@/components/onboarding/ui';
import type { AppData } from '@/lib/app-store';

const LETRAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/** La racha, clara: cuántos días llevas, cuáles de los últimos 7 contaron, la regla y el siguiente premio. */
export function RachaCard({ d }: { d: AppData }) {
  const hoy = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => ({ letra: LETRAS[new Date(hoy.getTime() - (6 - i) * 86_400_000).getDay()], hecho: d.kcalSemana[i] > 0, esHoy: i === 6 }));
  const siguiente = LOGROS.filter((l) => l.icono === 'flame' && !d.logros.includes(l.id))[0];
  const faltan = siguiente ? siguiente.progreso(d).meta - d.racha : 0;
  const registradoHoy = d.kcalSemana[6] > 0;
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu racha" className="mt-4 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.25)] bg-[linear-gradient(135deg,#FFF3E6,#FBE6CF)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-[14px] bg-[#A83D06] text-white" aria-hidden="true"><Flame size={22} /></span>
          <div>
            <p className="text-[26px] font-extrabold leading-none tabular-nums text-[#5A2D05] [font-family:var(--font-display)]">{d.racha} <span className="text-[15px] font-bold">{d.racha === 1 ? 'día seguido' : 'días seguidos'}</span></p>
            <p className="mt-0.5 text-[14px] text-[#7A4A1C]">{registradoHoy ? 'Hoy ya cuenta.' : 'Registra una comida hoy para sumar.'}</p>
          </div>
        </div>
        <Link href="/app/logros" aria-label="Ver cómo funcionan los puntos y premios" className="flex size-11 items-center justify-center rounded-full text-[#7A4A1C]"><ChevronRight size={20} aria-hidden="true" /></Link>
      </div>
      <ol className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Últimos 7 días">
        {dias.map((x, i) => (
          <li key={i} className="text-center">
            <span className={`mx-auto flex size-8 items-center justify-center rounded-full ${x.hecho ? 'bg-[#A83D06] text-white' : x.esHoy ? 'border-2 border-dashed border-[#A83D06] text-[#A83D06]' : 'border border-[#A83D06]/30 text-[#A83D06]/60'}`}>{x.hecho ? <Check size={15} strokeWidth={3.5} aria-label="Registraste" /> : <span className="text-[13px] font-bold" aria-label={x.esHoy ? 'Falta hoy' : 'Sin registro'}>{x.esHoy ? '?' : '·'}</span>}</span>
            <span className={`mt-1 block text-[12px] font-bold ${x.esHoy ? 'text-[#5A2D05]' : 'text-[#7A4A1C]'}`}>{x.letra}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-start gap-2 text-[14px] text-[#5A2D05]">
        <Shield size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p><strong>{d.escudos > 0 ? `${d.escudos} escudo${d.escudos > 1 ? 's' : ''} de racha.` : 'Sin escudo ahora.'}</strong> Si falta un día, un escudo protege tu racha.{siguiente && faltan > 0 ? <> Próximo premio: <strong>{siguiente.nombre}</strong> en {faltan} {faltan === 1 ? 'día' : 'días'} (+{siguiente.xp} XP).</> : null}</p>
      </div>
    </motion.section>
  );
}
