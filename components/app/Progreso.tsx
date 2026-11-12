'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Droplet, TrendingDown } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { registrarPeso } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function Progreso() {
  const [d, actualizar] = useAppData();
  const [kgTxt, setKgTxt] = useState('');
  const [errKg, setErrKg] = useState(false);
  if (!d) return <Esqueleto />;
  const W = 320, H = 150, P = 14;
  const kgs = d.pesos.map((p) => p.kg);
  const min = Math.min(...kgs, d.pesoMeta) - 0.5, max = Math.max(...kgs) + 0.5;
  const x = (i: number) => P + (i / (d.pesos.length - 1)) * (W - 2 * P);
  const y = (v: number) => P + ((max - v) / (max - min)) * (H - 2 * P);
  const linea = d.pesos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.kg).toFixed(1)}`).join(' ');
  const actual = d.pesos[d.pesos.length - 1].kg;
  const bajado = Math.round((d.pesoInicial - actual) * 10) / 10;
  const falta = Math.round((actual - d.pesoMeta) * 10) / 10;
  const maxK = Math.max(d.metaKcal, ...d.kcalSemana) * 1.05;
  const proteinaDias = d.proteinaDias.filter(Boolean).length;
  const hayTendencia = d.pesos.length >= 2;
  const semanas = hayTendencia ? Math.max(1, Math.round((new Date(d.pesos[d.pesos.length - 1].fecha).getTime() - new Date(d.pesos[0].fecha).getTime()) / (7 * 86_400_000))) : 0;
  const guardarKg = () => { const k = Number(kgTxt.replace(',', '.')); if (!(k >= 35 && k <= 250)) { setErrKg(true); return; } setErrKg(false); setKgTxt(''); actualizar((x) => registrarPeso(x, Math.round(k * 10) / 10)); };
  return (
    <main className="px-5 pt-5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]">Progreso</h1>
      <p className="text-[14px] text-[var(--text-secondary)]">Tu tendencia, no el número de un día.</p>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Tu peso" className="hairline-card mt-4 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-2)]">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Peso actual</p>
            <p className="text-[34px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={actual} decimales={1} /> <span className="text-[15px] font-semibold text-[var(--text-secondary)]">kg</span></p>
          </div>
          {hayTendencia && <p className="flex items-center gap-1 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[14px] font-bold text-[var(--accent)]"><TrendingDown size={15} aria-hidden="true" /> {bajado >= 0 ? '−' : '+'}{Math.abs(bajado)} kg en {semanas} {semanas === 1 ? 'semana' : 'semanas'}</p>}
        </div>
        {!hayTendencia ? (
          <p className="mt-3 rounded-[12px] bg-[var(--surface-2)] p-4 text-[14px] text-[var(--text-secondary)]">Aún no hay tendencia. Registra tu peso una vez por semana y aquí verás tu línea hacia la meta.</p>
        ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`Peso de las últimas ${semanas} semanas: de ${d.pesoInicial} a ${actual} kilos. Meta ${d.pesoMeta}`}>
          <defs><linearGradient id="gPeso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3D6B4F" stopOpacity=".28" /><stop offset="1" stopColor="#3D6B4F" stopOpacity="0" /></linearGradient></defs>
          {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={P} x2={W - P} y1={P + f * (H - 2 * P)} y2={P + f * (H - 2 * P)} stroke="currentColor" strokeOpacity=".1" />)}
          <line x1={P} x2={W - P} y1={y(d.pesoMeta)} y2={y(d.pesoMeta)} stroke="#E8590C" strokeWidth="1.5" strokeDasharray="5 4" />
          <path d={`${linea} L${x(d.pesos.length - 1)} ${H - P} L${x(0)} ${H - P} Z`} fill="url(#gPeso)" />
          <motion.path d={linea} fill="none" stroke="#3D6B4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE }} />
          <circle cx={x(d.pesos.length - 1)} cy={y(actual)} r="5" fill="#3D6B4F" stroke="#F9FBF7" strokeWidth="2.5" />
        </svg>
        )}
        <div className="mt-1 flex items-center justify-between text-[13px] text-[var(--text-secondary)]"><span>{hayTendencia ? `Hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}` : 'Inicio'}</span><span className="flex items-center gap-1 font-semibold text-[#A83D06]"><span className="inline-block h-0 w-4 border-t-2 border-dashed border-[#E8590C]" aria-hidden="true" /> Meta {d.pesoMeta} kg</span><span>Hoy</span></div>
        <p className="mt-3 text-[15px]">{falta > 0 ? <>Te faltan <strong>{falta} kg</strong> para tu meta.{hayTendencia ? ' Vas a un ritmo sano y sostenible.' : ''}</> : <>Ya estás en tu meta de <strong>{d.pesoMeta} kg</strong>.</>}</p>
        <form className="mt-3 flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); guardarKg(); }}>
          <label className="block flex-1"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Registrar mi peso de hoy (kg)</span>
            <input inputMode="decimal" value={kgTxt} onChange={(e) => setKgTxt(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder={String(actual)} aria-invalid={errKg} className="mt-1 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] tabular-nums outline-none focus:border-[var(--accent)]" /></label>
          <button type="submit" className="h-12 rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--bg)]">Guardar</button>
        </form>
        {errKg && <p role="alert" className="mt-1 text-[14px] font-medium text-[#A83D06]">Escribe tu peso en kg (35 a 250).</p>}
      </motion.section>

      <section aria-label="Calorías de la semana" className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-4">
        <h2 className="text-[17px] font-extrabold [font-family:var(--font-display)]">Calorías de la semana</h2>
        <div className="relative mt-3 flex h-28 items-end gap-2" role="img" aria-label={`Calorías por día: ${d.kcalSemana.join(', ')}. Meta ${d.metaKcal}`}>
          <span aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-[#E8590C]" style={{ bottom: `${(d.metaKcal / maxK) * 100}%` }} />
          {d.kcalSemana.map((k, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[11px] font-bold tabular-nums text-[var(--text-secondary)]">{k > 0 ? (k / 1000).toFixed(1).replace('.', ',') : ''}</span>
              <motion.span initial={{ height: 0 }} animate={{ height: k === 0 ? 4 : `${(k / maxK) * 100}%` }} transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }} className="block w-full rounded-t-[6px] rounded-b-[3px]" style={{ background: k === 0 ? 'color-mix(in oklab, var(--text-secondary) 30%, transparent)' : k > d.metaKcal * 1.08 ? 'linear-gradient(180deg,#FF8A3D,#E8590C)' : i === 6 ? 'linear-gradient(180deg,#4B8062,#3D6B4F)' : 'color-mix(in oklab, var(--accent) 55%, var(--surface))' }} />
              <span className={`text-[12px] font-extrabold ${i === 6 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{DIAS[i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[13px] text-[var(--text-secondary)]">La línea naranja es tu meta de {d.metaKcal.toLocaleString('es-CO')} kcal (cifras en miles). Las barras naranjas se pasaron más de 8%. Hoy sigue en curso.</p>
      </section>

      <section aria-label="Proteína" className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between"><h2 className="text-[17px] font-extrabold [font-family:var(--font-display)]">Meta de proteína</h2><span className="text-[15px] font-bold tabular-nums text-[var(--accent)]">{proteinaDias} de 7 días</span></div>
        <ul className="mt-3 grid grid-cols-7 gap-2">
          {d.proteinaDias.map((ok, i) => (
            <li key={i} className="text-center"><span className={`mx-auto flex size-9 items-center justify-center rounded-full ${ok ? 'bg-[var(--accent)] text-[var(--bg)]' : 'border border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)] text-[var(--text-secondary)]'}`}>{ok ? <Check size={16} strokeWidth={3} aria-label="Llegaste a tu meta" /> : <span className="text-[14px]" aria-label="No llegaste">·</span>}</span><span className="mt-1 block text-[12px] font-bold text-[var(--text-secondary)]">{DIAS[i]}</span></li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-[14px] text-[var(--text-secondary)]"><Droplet size={16} className="mt-0.5 shrink-0 text-[#E8590C]" aria-hidden="true" /> Si te faltó proteína, un batido o huevos al final del día suelen alcanzar.</p>
      </section>
    </main>
  );
}
