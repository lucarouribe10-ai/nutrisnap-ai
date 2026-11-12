'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Droplet, Flame, Pencil, Plus, Trash2, Trophy, X } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { editarComida, eliminarComida, nivelDe, restaurarComida, totalesHoy, type Comida } from '@/lib/app-store';
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
  const [d, actualizar] = useAppData();
  const [abierta, setAbierta] = useState<Comida | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: '', kcal: '' });
  const [deshacer, setDeshacer] = useState<Comida | null>(null);
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
        <Link href="/app/logros" aria-label={`Racha de ${d.racha} días. Ver logros`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#A83D06] px-3 text-[14px] font-extrabold text-white"><Flame size={15} aria-hidden="true" />{d.racha} días</Link>
      </header>
      {d.demo && <p className="mt-3 inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-[13px] font-semibold text-[var(--text-secondary)]">Vista previa con datos de ejemplo</p>}

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Camino a tu meta" className="mt-4 rounded-[var(--radius-card)] p-4 text-[#F4FAF5] shadow-[0_14px_26px_-12px_rgb(61_107_79/.65)] [background:radial-gradient(120px_80px_at_100%_0%,rgb(255_255_255/.16),transparent_70%),linear-gradient(160deg,#4B8062,#3D6B4F_55%,#2F5640)]">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-85">Camino a tu meta</p>
        <p className="mt-1 text-[24px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={pesoActual} decimales={1} /> kg <span className="text-[14px] font-semibold opacity-80">→ meta {d.pesoMeta} kg</span></p>
        <div className="relative mt-3 h-2 rounded-full bg-white/20" role="progressbar" aria-valuenow={Math.round(progresoPeso * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Avance hacia tu meta">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progresoPeso * 100}%` }} transition={{ duration: 0.9, ease: EASE }} className="h-full rounded-full bg-[#F4FAF5]" />
          {[25, 50, 75].map((p) => <span key={p} className="absolute -top-[3px] h-[14px] w-[2px] rounded bg-white/55" style={{ left: `${p}%` }} />)}
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] font-bold opacity-90">
          {[25, 50, 75].map((p) => <span key={p}>{p}%{progresoPeso * 100 >= p ? ' ✓' : ''}</span>)}<span>Meta</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.04em]">
          <span>Nivel {nivel.actual.n} · {nivel.actual.nombre}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"><motion.span initial={{ width: 0 }} animate={{ width: `${nivel.progreso * 100}%` }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} className="block h-full rounded-full [background:linear-gradient(90deg,#FF8A3D,#E8590C)]" /></span>
          <span className="tabular-nums">{d.xp} / {nivel.sig ? nivel.sig.desde : d.xp} XP</span>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06, ease: EASE }} aria-label="Calorías de hoy" className="hairline-card mt-3 flex items-center gap-4 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-2)]">
        <div className="relative shrink-0">
          <Anillo pct={t.kcal / d.metaKcal} />
          <Flame size={22} className="absolute inset-0 m-auto text-[#E8590C]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[40px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={t.kcal} /></p>
          <p className="mt-1 text-[14px] font-semibold text-[var(--text-secondary)]">de {d.metaKcal.toLocaleString('es-CO')} kcal</p>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{restantes > 0 ? `Te quedan ${restantes.toLocaleString('es-CO')} kcal` : 'Llegaste a tu meta de hoy'}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {macros.map((m) => (
              <div key={m.n}>
                <p className="whitespace-nowrap text-[15px] font-bold tabular-nums">{m.v}<span className="text-[13px] font-medium text-[var(--text-secondary)]"> /{m.m} g</span></p>
                <p className="text-[12px] text-[var(--text-secondary)]">{m.n}</p>
                <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.v / m.m) * 100)}%` }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="block h-full rounded-full" style={{ background: m.c }} /></span>
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
              <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + 0.06 * i, ease: EASE }}>
                <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => { setAbierta(c); setEditando(false); }} aria-label={`${c.titulo}, ${c.kcal} kcal. Ver detalle`} className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)] p-2 pr-4 text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.foto ? <img src={c.foto} alt="" width={52} height={52} className="size-[52px] shrink-0 rounded-[12px] object-cover" /> : <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--chip-bg)] text-[var(--accent)]"><Plus size={20} aria-hidden="true" /></span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{c.titulo}</span>
                    <span className="block truncate text-[13px] text-[var(--text-secondary)]">{c.hora} · {c.aceite ? <span className="font-semibold text-[#A83D06]">+{c.aceite} kcal de aceite</span> : c.nota ?? 'Registrado'}</span>
                  </span>
                  <span className="text-right text-[17px] font-extrabold tabular-nums [font-family:var(--font-display)]">{c.kcal}<span className="block text-[12px] font-medium text-[var(--text-secondary)]">kcal</span></span>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/app/logros" className="mt-4 flex min-h-14 items-center gap-3 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.25)] p-3 [background:linear-gradient(135deg,#FBE9D3,#F7D9B6)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-white/65 text-[#9A5A00]"><Trophy size={18} aria-hidden="true" /></span>
        <span className="min-w-0 flex-1"><span className="block text-[15px] font-bold text-[#5A2D05]">Casi lo logras: Semana del Chequeo</span><span className="block text-[13px] text-[#7A4A1C]">Responde el Chequeo 2 días más</span></span>
      </Link>

      {abierta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setAbierta(null)}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: EASE }} role="dialog" aria-modal="true" aria-label={abierta.titulo} onClick={(e) => e.stopPropagation()} className="w-full max-w-[480px] rounded-t-[24px] bg-[var(--bg)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_30px_-10px_rgb(0_0_0/.25)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h2 className="text-[20px] font-extrabold leading-tight [font-family:var(--font-display)]">{abierta.titulo}</h2><p className="text-[14px] text-[var(--text-secondary)]">{abierta.hora} · {abierta.nota ?? 'Registrado'}</p></div>
              <button type="button" autoFocus onClick={() => setAbierta(null)} aria-label="Cerrar" className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={20} aria-hidden="true" /></button>
            </div>
            {!editando ? (
              <>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[[abierta.kcal, 'kcal'], [abierta.proteina, 'prot. g'], [abierta.carbos, 'carbos g'], [abierta.grasas, 'grasas g']].map(([v, l]) => (
                    <div key={l as string} className="rounded-[12px] bg-[var(--surface-2)] p-2"><p className="text-[18px] font-extrabold tabular-nums [font-family:var(--font-display)]">{v}</p><p className="text-[12px] text-[var(--text-secondary)]">{l}</p></div>
                  ))}
                </div>
                {abierta.aceite ? <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-[#A83D06]"><Droplet size={16} aria-hidden="true" /> El Chequeo atrapó {abierta.aceite} kcal de aceite.</p> : null}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setForm({ titulo: abierta.titulo, kcal: String(abierta.kcal) }); setEditando(true); }} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold"><Pencil size={16} aria-hidden="true" /> Editar</button>
                  <button type="button" onClick={() => { const c = abierta; actualizar((x) => eliminarComida(x, c.id)); setDeshacer(c); setAbierta(null); setTimeout(() => setDeshacer((cur) => (cur?.id === c.id ? null : cur)), 6000); }} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[#A83D06]/40 text-[15px] font-semibold text-[#A83D06]"><Trash2 size={16} aria-hidden="true" /> Eliminar</button>
                </div>
              </>
            ) : (
              <form className="mt-3 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); const k = Number(form.kcal.replace(',', '.')); if (form.titulo.trim().length < 2 || !(k > 0 && k <= 3000)) return; actualizar((x) => editarComida(x, abierta.id, { titulo: form.titulo.trim(), kcal: Math.round(k) })); setAbierta(null); }}>
                <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Nombre</span><input value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} maxLength={60} className="mt-1 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]" /></label>
                <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Calorías (kcal)</span><input inputMode="decimal" value={form.kcal} onChange={(e) => setForm((f) => ({ ...f, kcal: e.target.value.replace(/[^0-9.,]/g, '') }))} className="mt-1 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] tabular-nums outline-none focus:border-[var(--accent)]" /></label>
                <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setEditando(false)} className="min-h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold">Cancelar</button><button type="submit" className="min-h-12 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)]">Guardar</button></div>
              </form>
            )}
          </motion.div>
        </div>
      )}
      {deshacer && (
        <div role="status" className="fixed inset-x-5 bottom-28 z-50 mx-auto flex max-w-[440px] items-center justify-between gap-3 rounded-[var(--radius-card)] bg-[var(--text-primary)] px-4 py-3 text-[var(--bg)] shadow-[var(--shadow-2)]">
          <span className="text-[14px] font-semibold">Eliminaste «{deshacer.titulo}»</span>
          <button type="button" onClick={() => { const c = deshacer; actualizar((x) => restaurarComida(x, c)); setDeshacer(null); }} className="min-h-11 px-2 text-[14px] font-extrabold text-[var(--accent-on-dark)] underline underline-offset-4">Deshacer</button>
        </div>
      )}
    </main>
  );
}
