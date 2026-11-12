'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Droplet, Flame, Pencil, Plus, Trash2, X, Zap } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { editarComida, eliminarComida, nivelDe, restaurarComida, totalesHoy, type Comida } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';
import { RachaCard } from './RachaCard';
import { Misiones } from './Misiones';

const fechaLarga = () => {
  const t = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date());
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const LETRAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/** Anillo grande de calorías: degradé ámbar→naranja sobre pista clara, número de kcal restantes al centro. */
function AnilloGrande({ pct, size = 188 }: { pct: number; size?: number }) {
  const sw = 16;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="absolute inset-0">
      <defs>
        <linearGradient id="anillo-hoy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5A524" />
          <stop offset="100%" stopColor="#E8590C" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} stroke="rgb(255 255 255 / .75)" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} stroke="url(#anillo-hoy)" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(1, Math.max(0.02, pct))) }} transition={{ duration: 1, ease: EASE }} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

/** La comida se clasifica por la hora real a la que se registró (nada inventado). */
function momento(hora: string) {
  const h = parseInt(hora, 10);
  if (h < 11) return { n: 'Desayuno', bg: '#E4F2C9' };
  if (h < 15) return { n: 'Almuerzo', bg: '#FFE6CC' };
  if (h < 18) return { n: 'Merienda', bg: '#FFF1B8' };
  return { n: 'Cena', bg: '#DCE8F5' };
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
  const hoyF = new Date();
  const semana = Array.from({ length: 7 }, (_, k) => { const f = new Date(hoyF.getTime() - (6 - k) * 86_400_000); return { letra: LETRAS[f.getDay()], dia: f.getDate(), hecho: d.kcalSemana[k] > 0, esHoy: k === 6 }; });
  const macros = [
    { n: 'Proteína', v: t.proteina, m: d.metaProteina, c: 'var(--accent)' },
    { n: 'Grasas', v: t.grasas, m: Math.round((d.metaKcal * 0.25) / 9), c: '#E8590C' },
    { n: 'Carbos', v: t.carbos, m: Math.round((d.metaKcal - d.metaProteina * 4 - d.metaKcal * 0.25) / 4), c: '#C9A227' },
  ];
  return (
    <main className="px-5">
      <section aria-label="Tu día" className="-mx-5 rounded-b-[32px] bg-[var(--tint)] px-5 pb-5 pt-5 [background:radial-gradient(260px_180px_at_85%_0%,rgb(255_255_255/.55),transparent_70%),var(--tint)]">
        <header className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] text-[14px] font-extrabold text-[var(--accent)] shadow-[0_2px_8px_-2px_rgb(36_43_36/.25)] [font-family:var(--font-display)]" aria-hidden="true">{d.nombre.slice(0, 2).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Hola, {d.nombre}</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">{fechaLarga()}</p>
          </div>
          <Link href="/app/logros" aria-label={`Nivel ${nivel.actual.n}, ${d.xp} XP. Ver logros`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[var(--surface)] px-3 text-[13px] font-extrabold text-[#A83D06] shadow-[0_2px_8px_-2px_rgb(36_43_36/.2)]"><Zap size={14} aria-hidden="true" />{d.xp} XP</Link>
        </header>
        {d.demo && <p className="mt-3 inline-block rounded-full bg-white/70 px-3 py-1 text-[13px] font-semibold text-[var(--text-secondary)]">Vista previa con datos de ejemplo</p>}

        <ol aria-label="Últimos 7 días" className="mt-4 grid grid-cols-7 gap-1.5">
          {semana.map((x, i) => (
            <li key={i} className={`flex flex-col items-center rounded-[16px] py-1.5 ${x.esHoy ? 'bg-[var(--text-primary)] text-[var(--bg)]' : ''}`}>
              <span className={`text-[12px] font-semibold ${x.esHoy ? 'opacity-80' : 'text-[var(--text-secondary)]'}`}>{x.letra}</span>
              <span className="text-[16px] font-extrabold tabular-nums [font-family:var(--font-display)]">{x.dia}</span>
              <span className={`mt-0.5 flex size-4 items-center justify-center rounded-full ${x.hecho ? 'bg-[var(--accent)] text-white' : x.esHoy ? 'border border-dashed border-white/60' : 'border border-[var(--text-secondary)]/35'}`}>{x.hecho && <Check size={10} strokeWidth={4} aria-label="Registraste" />}</span>
            </li>
          ))}
        </ol>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} role="group" aria-label={`Calorías de hoy: ${t.kcal} de ${d.metaKcal}`} className="mt-4 flex items-center justify-between gap-2">
          <div className="w-[68px] text-center">
            <p className="text-[18px] font-extrabold tabular-nums [font-family:var(--font-display)]"><Cuenta valor={t.kcal} /></p>
            <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Comido</p>
          </div>
          <div className="relative size-[188px] shrink-0">
            <AnilloGrande pct={t.kcal / d.metaKcal} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame size={20} className="text-[#E8590C]" aria-hidden="true" />
              <p className="text-[44px] font-extrabold leading-none tabular-nums tracking-[-0.04em] [font-family:var(--font-display)]"><Cuenta valor={restantes} /></p>
              <p className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">{restantes > 0 ? 'kcal restantes' : 'Meta cumplida'}</p>
            </div>
          </div>
          <div className="w-[68px] text-center">
            <p className="text-[18px] font-extrabold tabular-nums [font-family:var(--font-display)]">{d.metaKcal.toLocaleString('es-CO')}</p>
            <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Tu meta</p>
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-[20px] bg-[var(--surface)] p-3 shadow-[0_6px_16px_-8px_rgb(36_43_36/.25)]">
          {macros.map((m) => (
            <div key={m.n}>
              <p className="text-[12px] font-semibold text-[var(--text-secondary)]">{m.n}</p>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.v / m.m) * 100)}%` }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="block h-full rounded-full" style={{ background: m.c }} /></span>
              <p className="mt-1 whitespace-nowrap text-[14px] font-bold tabular-nums">{m.v}<span className="text-[12px] font-medium text-[var(--text-secondary)]"> / {m.m} g</span></p>
            </div>
          ))}
        </div>
      </section>

      {d.aviso === 'escudo' && <p role="status" className="mt-3 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-3 text-[14px] font-semibold text-[var(--accent)]">Ayer faltó un día, pero tu escudo protegió tu racha. Hoy sigue.</p>}
      {d.aviso === 'pausa' && <p role="status" className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3 text-[14px] text-[var(--text-primary)]"><strong>Tu racha se pausó.</strong> Pasa, no se pierde lo que lograste. Registra una comida hoy y empieza una nueva.</p>}
      <RachaCard d={d} compacta />

      <Misiones d={d} actualizar={actualizar} />

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Camino a tu meta" className="mt-4 rounded-[var(--radius-card)] p-4 text-[#F4FAF5] shadow-[0_14px_26px_-12px_rgb(61_107_79/.65)] [background:radial-gradient(120px_80px_at_100%_0%,rgb(255_255_255/.16),transparent_70%),linear-gradient(160deg,#4B8062,#3D6B4F_55%,#2F5640)]">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-85">Camino a tu meta</p>
        <p className="mt-1 text-[24px] font-extrabold leading-none tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]"><Cuenta valor={pesoActual} decimales={1} /> kg <span className="text-[14px] font-semibold tracking-normal opacity-80">→ meta {d.pesoMeta} kg</span></p>
        <div className="relative mt-3 h-2 rounded-full bg-white/20" role="progressbar" aria-valuenow={Math.round(progresoPeso * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Avance hacia tu meta">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progresoPeso * 100}%` }} transition={{ duration: 0.9, ease: EASE }} className="h-full rounded-full bg-[#F4FAF5]" />
          {[25, 50, 75].map((p) => <span key={p} className="absolute -top-[3px] h-[14px] w-[2px] rounded bg-white/55" style={{ left: `${p}%` }} />)}
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] font-bold opacity-90">
          {[25, 50, 75].map((p) => <span key={p}>{p}%{progresoPeso * 100 >= p ? ' ✓' : ''}</span>)}<span>Meta</span>
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
          <ul className="mt-3 flex flex-col gap-3">
            {d.comidasHoy.map((c, i) => {
              const m = momento(c.hora);
              return (
                <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + 0.06 * i, ease: EASE }}>
                  <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => { setAbierta(c); setEditando(false); }} aria-label={`${m.n}: ${c.titulo}, ${c.kcal} kcal. Ver detalle`} className="flex w-full items-center gap-3 rounded-[22px] p-3 pr-4 text-left" style={{ background: m.bg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {c.foto ? <img src={c.foto} alt="" width={60} height={60} className="size-[60px] shrink-0 rounded-full border-[3px] border-white object-cover shadow-[0_4px_10px_-4px_rgb(36_43_36/.35)]" /> : <span className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-white/80 text-[var(--accent)]"><Plus size={22} aria-hidden="true" /></span>}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[#3F4A40]">{m.n} · {c.hora}</span>
                      <span className="block truncate text-[16px] font-bold leading-snug">{c.titulo}</span>
                      <span className="block truncate text-[13px] text-[#3F4A40]">{c.aceite ? <span className="font-bold text-[#A83D06]">+{c.aceite} kcal de aceite atrapadas</span> : c.nota ?? 'Registrado'}</span>
                    </span>
                    <span className="text-right text-[22px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{c.kcal}<span className="mt-0.5 block text-[12px] font-semibold text-[#3F4A40]">kcal</span></span>
                  </motion.button>
                </motion.li>
              );
            })}
            <li>
              <Link href="/app/registrar" className="flex min-h-14 items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[15px] font-bold text-[var(--accent)]"><Plus size={18} aria-hidden="true" /> Añadir otra comida</Link>
            </li>
          </ul>
        )}
      </section>


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
