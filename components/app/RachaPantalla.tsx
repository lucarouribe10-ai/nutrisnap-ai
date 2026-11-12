'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { Esqueleto, useAppData } from './uso';
import { BloqueLima } from './Cabecera';
import { Llama } from './Llama';
import { isoDe } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';

const CAB = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Calendario de racha (patrón de Duolingo): días registrados, días protegidos por escudo y hoy. */
export function RachaPantalla() {
  const [d] = useAppData();
  const [hoy, setHoy] = useState<Date | null>(null);
  const [mes, setMes] = useState({ y: 0, m: 0 });
  useEffect(() => {
    const h = new Date();
    setHoy(h);
    setMes({ y: h.getFullYear(), m: h.getMonth() });
  }, []);
  if (!d || !hoy) return <Esqueleto />;
  const primero = new Date(mes.y, mes.m, 1);
  const diasMes = new Date(mes.y, mes.m + 1, 0).getDate();
  const offset = (primero.getDay() + 6) % 7; // semana empieza en lunes
  const celdas = [...Array(offset).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)];
  const iso = (dia: number) => isoDe(new Date(mes.y, mes.m, dia));
  const hoyIso = isoDe(hoy);
  const esActual = mes.y === hoy.getFullYear() && mes.m === hoy.getMonth();
  const tituloBruto = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(primero).replace(' de ', ' ');
  const titulo = tituloBruto.charAt(0).toUpperCase() + tituloBruto.slice(1);
  const mover = (n: number) => setMes((x) => { const f = new Date(x.y, x.m + n, 1); return { y: f.getFullYear(), m: f.getMonth() }; });
  const registradoHoy = d.historial.includes(hoyIso);
  const hechosMes = celdas.filter((x) => x && d.historial.includes(iso(x))).length;
  return (
    <main className="px-5">
      <BloqueLima>
      <Link href="/app" className="inline-flex min-h-11 items-center gap-1 text-[15px] font-semibold text-[var(--accent)]"><ChevronLeft size={18} aria-hidden="true" /> Hoy</Link>
      <section className="mt-1 flex flex-col items-center text-center" aria-label="Tu racha">
        <Llama size={120} encendida={registradoHoy} />
        <p className="mt-1 text-[56px] font-extrabold leading-none tabular-nums tracking-[-0.03em] text-[#A83D06] [font-family:var(--font-display)]">{d.racha}</p>
        <p className="text-[20px] font-extrabold [font-family:var(--font-display)]">{d.racha === 1 ? 'día seguido' : 'días seguidos'}</p>
        <p className="mt-1 max-w-[300px] text-[15px] text-[var(--text-secondary)]">{registradoHoy ? 'Hoy ya cuenta. Vuelve mañana para sumar otro.' : 'Registra una comida hoy para sumar un día.'}</p>
      </section>
      </BloqueLima>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[[String(d.mejorRacha), 'mejor racha'], [String(d.escudos), d.escudos === 1 ? 'escudo' : 'escudos'], [String(d.historial.length), 'días registrados']].map(([v, l]) => (
          <div key={l} className="rounded-[14px] bg-[var(--surface-2)] p-3"><dd className="text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)]">{v}</dd><dt className="text-[13px] text-[var(--text-secondary)]">{l}</dt></div>
        ))}
      </dl>
      <section aria-label="Calendario" className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => mover(-1)} aria-label="Mes anterior" className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"><ChevronLeft size={20} aria-hidden="true" /></button>
          <h2 className="text-[17px] font-extrabold [font-family:var(--font-display)]">{titulo}</h2>
          <button type="button" onClick={() => mover(1)} disabled={esActual} aria-label="Mes siguiente" className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] disabled:opacity-30"><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
        <ol className="mt-2 grid grid-cols-7 gap-y-2" aria-label={`Días de ${titulo}`}>
          {CAB.map((c, i) => <li key={`c${i}`} className="text-center text-[12px] font-bold text-[var(--text-secondary)]">{c}</li>)}
          {celdas.map((dia, i) => {
            if (!dia) return <li key={`v${i}`} aria-hidden="true" />;
            const f = iso(dia);
            const hecho = d.historial.includes(f);
            const escudo = d.escudoDias.includes(f);
            const esHoy = f === hoyIso;
            const futuro = f > hoyIso;
            return (
              <motion.li key={f} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, delay: 0.008 * i, ease: EASE }} className="flex justify-center">
                <span aria-label={`${dia}: ${hecho ? 'registraste' : escudo ? 'protegido por escudo' : futuro ? 'aún no llega' : 'sin registro'}`} className={`flex size-9 items-center justify-center rounded-full text-[14px] font-bold tabular-nums ${hecho ? 'bg-[#A83D06] text-white' : escudo ? 'bg-[var(--accent)] text-[var(--bg)]' : esHoy ? 'border-2 border-dashed border-[#A83D06] text-[#A83D06]' : futuro ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]'}`}>
                  {hecho ? <Check size={16} strokeWidth={3.5} /> : escudo ? <Shield size={15} /> : dia}
                </span>
              </motion.li>
            );
          })}
        </ol>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--text-secondary)]">
          <li className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#A83D06]" aria-hidden="true" /> Registraste</li>
          <li className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[var(--accent)]" aria-hidden="true" /> Escudo</li>
          <li className="flex items-center gap-1.5"><span className="size-3 rounded-full border-2 border-dashed border-[#A83D06]" aria-hidden="true" /> Hoy</li>
        </ul>
        <p className="mt-2 text-[14px] font-semibold">{hechosMes} {hechosMes === 1 ? 'día registrado' : 'días registrados'} este mes.</p>
      </section>
      <p className="mt-3 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-3 text-[14px] text-[var(--accent)]"><strong>Escudo de racha:</strong> si falta un solo día, un escudo protege tu racha. Si faltan dos o más, la racha se pausa y empiezas de nuevo, sin castigo.</p>
    </main>
  );
}
