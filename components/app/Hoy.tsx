'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Bell, Droplet, Flame, Plus, Trophy } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { totalesHoy, nivelDe } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';

const fechaLarga = () => {
  const t = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date());
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function Anillo({ pct, size = 76 }: { pct: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke="rgb(232 89 12 / .15)" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke="#E8590C" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(1, pct)) }} transition={{ duration: 0.9, ease: EASE }} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

export function Hoy() {
  const [d] = useAppData();
  if (!d) return <Esqueleto />;
  const t = totalesHoy(d);
  const restantes = Math.max(0, d.metaKcal - t.kcal);
  const progresoPeso = Math.max(0, Math.min(1, (d.pesoInicial - d.pesos[d.pesos.length - 1].kg) / (d.pesoInicial - d.pesoMeta)));
  const pesoActual = d.pesos[d.pesos.length - 1].kg;
  const nivel = nivelDe(d.xp);
  const macros = [
    { n: 'Proteína', v: t.proteina, m: d.metaProteina, c: 'var(--accent)' },
    { n: 'Grasas', v: t.grasas, m: Math.round((d.metaKcal * 0.25) / 9), c: '#E8590C' },
    { n: 'Carbos', v: t.carbos, m: Math.round((d.metaKcal - d.metaProteina * 4 - d.metaKcal * 0.25) / 4), c: '#C9A227' },
  ];
  return (
    <main className="px-5 pt-5">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,var(--surface))] text-[14px] font-extrabold text-[var(--accent)] [font-family:var(--font-display)]" aria-hidden="true">{d.nombre.slice(0, 2).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Hola, {d.nombre}</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">{fechaLarga()}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#A83D06] px-2.5 py-1 text-[13px] font-extrabold text-white"><Flame size={14} aria-hidden="true" />{d.racha}</span>
        <button type="button" aria-label="Avisos" className="flex size-11 items-center justify-center rounded-[12px] border border-[color-mix(in_oklab,var(--text-secondary)_20%,transparent)] bg-[var(--surface)] text-[var(--text-secondary)]"><Bell size={18} aria-hidden="true" /></button>
      </header>
      {d.demo && <p className="mt-3 inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-[13px] font-semibold text-[var(--text-secondary)]">Vista previa con datos de ejemplo</p>}

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Camino a tu meta" className="mt-4 rounded-[var(--radius-card)] p-4 text-[#F4FAF5] shadow-[0_14px_26px_-12px_rgb(61_107_79/.65)] [background:radial-gradient(120px_80px_at_100%_0%,rgb(255_255_255/.16),transparent_70%),linear-gradient(160deg,#4B8062,#3D6B4F_55%,#2F5640)]">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-85">Camino a tu meta</p>
        <p className="mt-1 text-[28px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={pesoActual} decimales={1} /> kg <span className="text-[14px] font-semibold opacity-80">→ meta {d.pesoMeta} kg</span></p>
        <div className="relative mt-3 h-2 rounded-full bg-white/20" role="progressbar" aria-valuenow={Math.round(progresoPeso * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Avance hacia tu meta">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progresoPeso * 100}%` }} transition={{ duration: 0.9, ease: EASE }} className="h-full rounded-full bg-[#F4FAF5]" />
          {[25, 50, 75].map((p) => <span key={p} className="absolute -top-[3px] h-[14px] w-[2px] rounded bg-white/55" style={{ left: `${p}%` }} />)}
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] font-bold opacity-90">
          {[25, 50, 75].map((p) => <span key={p}>{p}%{progresoPeso * 100 >= p ? ' ✓' : ''}</span>)}<span>Meta</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.04em]">
          <span>Nivel {nivel.actual.n} · {nivel.actual.nombre}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full [background:linear-gradient(90deg,#FF8A3D,#E8590C)]" style={{ width: `${nivel.progreso * 100}%` }} /></span>
          <span className="tabular-nums">{d.xp} XP</span>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06, ease: EASE }} aria-label="Calorías de hoy" className="hairline-card mt-3 flex items-center gap-4 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-2)]">
        <div className="relative shrink-0">
          <Anillo pct={t.kcal / d.metaKcal} />
          <Flame size={22} className="absolute inset-0 m-auto text-[#E8590C]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[28px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={t.kcal} /> <span className="text-[14px] font-semibold text-[var(--text-secondary)]">de {d.metaKcal.toLocaleString('es-CO')} kcal</span></p>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{restantes > 0 ? `Te quedan ${restantes.toLocaleString('es-CO')} kcal` : 'Llegaste a tu meta de hoy'}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {macros.map((m) => (
              <div key={m.n}>
                <p className="text-[15px] font-bold tabular-nums">{m.v} g</p>
                <p className="text-[12px] text-[var(--text-secondary)]">{m.n} de {m.m}</p>
                <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, (m.v / m.m) * 100)}%`, background: m.c }} /></span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section aria-label="Tus comidas de hoy" className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold tracking-[-0.01em] [font-family:var(--font-display)]">Tus comidas de hoy</h2>
          {t.aceite > 0 && <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#A83D06]"><Droplet size={14} aria-hidden="true" />{t.aceite} kcal atrapadas</span>}
        </div>
        {d.comidasHoy.length === 0 ? (
          <div className="mt-3 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)] p-6 text-center">
            <p className="text-[17px] font-bold">Registra tu primera comida de hoy</p>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Una foto y el Chequeo de Grasas Ocultas. Toma segundos.</p>
            <Link href="/app/registrar" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[16px] font-semibold text-[var(--bg)]"><Plus size={18} aria-hidden="true" /> Registrar comida</Link>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {d.comidasHoy.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + 0.06 * i, ease: EASE }} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-2 pr-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.foto ? <img src={c.foto} alt="" width={52} height={52} className="size-[52px] shrink-0 rounded-[12px] object-cover" /> : <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--chip-bg)] text-[var(--accent)]"><Plus size={20} aria-hidden="true" /></span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold">{c.titulo}</p>
                  <p className="truncate text-[13px] text-[var(--text-secondary)]">{c.hora} · {c.aceite ? <span className="font-semibold text-[#A83D06]">+{c.aceite} kcal de aceite</span> : c.nota ?? 'Registrado'}</p>
                </div>
                <p className="text-right text-[17px] font-extrabold tabular-nums [font-family:var(--font-display)]">{c.kcal}<span className="block text-[12px] font-medium text-[var(--text-secondary)]">kcal</span></p>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/app/logros" className="mt-4 flex min-h-14 items-center gap-3 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.25)] p-3 [background:linear-gradient(135deg,#FBE9D3,#F7D9B6)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-white/65 text-[#9A5A00]"><Trophy size={18} aria-hidden="true" /></span>
        <span className="min-w-0 flex-1"><span className="block text-[15px] font-bold text-[#5A2D05]">Casi lo logras: Semana sin ceguera</span><span className="block text-[13px] text-[#7A4A1C]">Te faltan 2 días respondiendo el Chequeo</span></span>
      </Link>
    </main>
  );
}
