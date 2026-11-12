'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, ChevronRight, Shield } from 'lucide-react';
import { Llama } from './Llama';
import { LOGROS } from '@/lib/logros';
import { EASE } from '@/components/onboarding/ui';
import type { AppData } from '@/lib/app-store';

const LETRAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/** La racha, clara: llama encendida o apagada, días seguidos, los últimos 7 días y el próximo premio. */
export function RachaCard({ d, compacta = false }: { d: AppData; compacta?: boolean }) {
  const hoy = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => ({ letra: LETRAS[new Date(hoy.getTime() - (6 - i) * 86_400_000).getDay()], hecho: d.kcalSemana[i] > 0, esHoy: i === 6 }));
  const siguiente = LOGROS.filter((l) => l.icono === 'flame' && !d.logros.includes(l.id))[0];
  const faltan = siguiente ? siguiente.progreso(d).meta - d.racha : 0;
  const registradoHoy = d.kcalSemana[6] > 0;
  if (compacta) {
    return (
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu racha" className="mt-4 rounded-[22px] border border-[rgb(232_89_12/.25)] bg-[linear-gradient(135deg,#FFF3E6,#FBE6CF)] p-3">
        <Link href="/app/racha" aria-label={`Racha de ${d.racha} días. Ver tu calendario de racha`} className="flex items-center gap-3">
          <Llama size={44} encendida={registradoHoy} />
          <span className="min-w-0 flex-1">
            <span className="block text-[22px] font-extrabold leading-none tabular-nums text-[#5A2D05] [font-family:var(--font-display)]">{d.racha} <span className="text-[14px] font-bold">{d.racha === 1 ? 'día seguido' : 'días seguidos'}</span></span>
            <span className="mt-0.5 block text-[13px] text-[#7A4A1C]">{registradoHoy ? 'Hoy ya cuenta.' : 'Registra una comida hoy para sumar.'} {d.escudos} escudo{d.escudos === 1 ? '' : 's'}.{siguiente && faltan > 0 ? ` Premio en ${faltan} ${faltan === 1 ? 'día' : 'días'}.` : ''}</span>
          </span>
          <ChevronRight size={20} className="shrink-0 text-[#7A4A1C]" aria-hidden="true" />
        </Link>
      </motion.section>
    );
  }
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu racha" className="mt-4 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.25)] bg-[linear-gradient(135deg,#FFF3E6,#FBE6CF)] p-4">
      <Link href="/app/racha" aria-label={`Racha de ${d.racha} días. Ver tu calendario de racha`} className="flex items-center gap-3">
        <Llama size={52} encendida={registradoHoy} />
        <span className="min-w-0 flex-1">
          <span className="block text-[28px] font-extrabold leading-none tabular-nums text-[#5A2D05] [font-family:var(--font-display)]">{d.racha} <span className="text-[15px] font-bold">{d.racha === 1 ? 'día seguido' : 'días seguidos'}</span></span>
          <span className="mt-0.5 block text-[14px] text-[#7A4A1C]">{registradoHoy ? 'Hoy ya cuenta.' : 'Registra una comida hoy para sumar.'}</span>
        </span>
        <ChevronRight size={20} className="shrink-0 text-[#7A4A1C]" aria-hidden="true" />
      </Link>
      <ol className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Últimos 7 días">
        {dias.map((x, i) => (
          <li key={i} className="text-center">
            <span className={`mx-auto flex size-8 items-center justify-center rounded-full ${x.hecho ? 'bg-[#A83D06] text-white' : x.esHoy ? 'border-2 border-dashed border-[#A83D06] text-[#A83D06]' : 'border border-[#A83D06]/30 text-[#A83D06]/60'}`}>{x.hecho ? <Check size={15} strokeWidth={3.5} aria-label="Registraste" /> : <span className="text-[13px] font-bold" aria-label={x.esHoy ? 'Falta hoy' : 'Sin registro'}>{x.esHoy ? '?' : '·'}</span>}</span>
            <span className={`mt-1 block text-[12px] font-bold ${x.esHoy ? 'text-[#5A2D05]' : 'text-[#7A4A1C]'}`}>{x.letra}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-start gap-2 text-[14px] text-[#5A2D05]"><Shield size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span><strong>{d.escudos} escudo{d.escudos === 1 ? '' : 's'}.</strong>{siguiente && faltan > 0 ? <> Próximo premio: <strong>{siguiente.nombre}</strong> en {faltan} {faltan === 1 ? 'día' : 'días'}.</> : null}</span></p>
    </motion.section>
  );
}
