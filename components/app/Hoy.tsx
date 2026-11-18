'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Droplet, Pencil, Plus, Trash2, X, Zap } from 'lucide-react';
import { Cuenta, Esqueleto, useAppData } from './uso';
import { editarComida, eliminarComida, nivelDe, restaurarComida, totalesHoy, type Comida } from '@/lib/app-store';
import { EASE } from '@/components/onboarding/ui';
import { RachaCard, SemanaFranja } from './RachaCard';
import { Misiones } from './Misiones';

const fechaLarga = () => {
  const t = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date());
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Medidor de calorías en medio arco: pista blanca translúcida, avance en negro, kcal restantes al centro. */
function Medidor({ pct, restantes, comido, meta }: { pct: number; restantes: number; comido: number; meta: number }) {
  const R = 100;
  const L = Math.PI * R;
  const arco = `M35 106 A${R} ${R} 0 0 1 235 106`;
  return (
    <div className="relative mx-auto mt-3 h-[150px] w-[270px]" role="group" aria-label={`Calorías de hoy: ${comido} de ${meta}`}>
      <svg width="270" height="116" viewBox="0 0 270 116" aria-hidden="true" className="absolute left-0 top-0">
        <path d={arco} fill="none" stroke="#E3F2C4" strokeWidth="16" strokeLinecap="round" />
        <motion.path d={arco} fill="none" stroke="var(--negro)" strokeWidth="16" strokeLinecap="round" strokeDasharray={L} initial={{ strokeDashoffset: L }} animate={{ strokeDashoffset: L * (1 - Math.min(1, Math.max(0.02, pct))) }} transition={{ duration: 1, ease: EASE }} />
      </svg>
      <div className="absolute inset-x-0 bottom-[22px] text-center">
        <p className="text-[13px] font-bold text-[var(--accent)]">{restantes > 0 ? 'Te quedan hoy' : 'Meta cumplida'}</p>
        <p className="text-[44px] font-extrabold leading-none tabular-nums tracking-[-0.05em] [font-family:var(--font-display)]"><Cuenta valor={restantes} /></p>
      </div>
      <p className="absolute bottom-0 left-0 w-[76px] text-center text-[12px] font-bold text-[var(--accent)]"><span className="block text-[17px] font-extrabold tabular-nums text-[var(--text-primary)]">{comido.toLocaleString('es-CO')}</span>Comido</p>
      <p className="absolute bottom-0 right-0 w-[76px] text-center text-[12px] font-bold text-[var(--accent)]"><span className="block text-[17px] font-extrabold tabular-nums text-[var(--text-primary)]">{meta.toLocaleString('es-CO')}</span>Tu meta</p>
    </div>
  );
}

/** La comida se clasifica por la hora real a la que se registró (nada inventado). */
function momento(hora: string) {
  const h = parseInt(hora, 10);
  if (h < 5) return { n: 'Madrugada', bg: '#DCE8F5' };
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
  const [errorForm, setErrorForm] = useState('');
  const [deshacer, setDeshacer] = useState<Comida | null>(null);
  if (!d) return <Esqueleto />;
  const t = totalesHoy(d);
  const restantes = Math.max(0, d.metaKcal - t.kcal);
  const progresoPeso = Math.max(0, Math.min(1, (d.pesoInicial - d.pesos[d.pesos.length - 1].kg) / (d.pesoInicial - d.pesoMeta)));
  const pesoActual = d.pesos[d.pesos.length - 1].kg;
  const nivel = nivelDe(d.xp);
  const fotoHero = [...d.comidasHoy].filter((c) => c.foto).sort((x, y) => y.kcal - x.kcal)[0]?.foto;
  const macros = [
    { n: 'Proteína', v: t.proteina, m: d.metaProteina, fondo: 'var(--lima-2)' },
    { n: 'Grasas', v: t.grasas, m: Math.round((d.metaKcal * 0.25) / 9), fondo: '#FFD3A3' },
    { n: 'Carbos', v: t.carbos, m: Math.round((d.metaKcal - d.metaProteina * 4 - d.metaKcal * 0.25) / 4), fondo: '#BCE0F2' },
  ];
  return (
    <main className="px-5 pt-5">
      {fotoHero && (
        <div aria-hidden="true" className="relative -mx-5 -mt-5 h-[372px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoHero} alt="" className="absolute inset-0 size-full object-cover" />
          {/* La foto se funde con el fondo: crema arriba (para leer el saludo) y abajo (para unirse a la tarjeta) */}
          <div className="absolute inset-0 [background:linear-gradient(180deg,rgb(245_247_242/.92)_0%,rgb(245_247_242/.55)_16%,rgb(245_247_242/0)_34%,rgb(245_247_242/0)_62%,rgb(245_247_242/.8)_90%,var(--bg)_100%)]" />
        </div>
      )}
      <header className={`relative flex items-center gap-3 ${fotoHero ? '-mt-[372px] mb-[196px] pt-5' : ''}`}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--lima)] text-[14px] font-extrabold text-[var(--accent)] [font-family:var(--font-display)]" aria-hidden="true">{d.nombre.slice(0, 2).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Hola, {d.nombre}</h1>
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">{fechaLarga()}{d.demo ? ' · datos de ejemplo' : ''}</p>
        </div>
        <Link href="/app/logros" aria-label={`Nivel ${nivel.actual.n}, ${d.xp} XP. Ver logros`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[var(--surface)] px-3 text-[13px] font-extrabold text-[#A83D06] shadow-[0_6px_16px_-8px_rgb(21_25_26/.3)]"><Zap size={14} aria-hidden="true" />{d.xp} XP</Link>
      </header>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} aria-label="Tu día" className={`relative rounded-[32px] px-3 pb-4 pt-4 ${fotoHero ? 'border-2 border-[var(--lima-2)] bg-[rgb(254_255_252/.95)] shadow-[0_18px_34px_-18px_rgb(21_25_26/.5)] backdrop-blur-md' : 'caja-lima mt-4'}`}>
        <SemanaFranja d={d} />
        <Medidor pct={t.kcal / d.metaKcal} restantes={restantes} comido={t.kcal} meta={d.metaKcal} />
      </motion.section>

      {d.aviso === 'escudo' && <p role="status" className="mt-3 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-3 text-[14px] font-semibold text-[var(--accent)]">Ayer faltó un día, pero tu escudo protegió tu racha. Hoy sigue.</p>}
      {d.aviso === 'pausa' && <p role="status" className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3 text-[14px] text-[var(--text-primary)]"><strong>Tu racha se pausó.</strong> Pasa, no se pierde lo que lograste. Registra una comida hoy y empieza una nueva.</p>}

      <div className="mt-3 grid grid-cols-3 gap-2" aria-label="Tus macros de hoy" role="group">
        {macros.map((m) => (
          <div key={m.n} className="rounded-[22px] border-2 bg-[var(--surface)] p-3" style={{ borderColor: m.fondo }}>
            <p className="text-[12px] font-bold text-[var(--text-secondary)]">{m.n}</p>
            <p className="mt-1 whitespace-nowrap text-[20px] font-extrabold tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]">{m.v}<span className="text-[12px] font-semibold tracking-normal text-[var(--text-secondary)]"> /{m.m} g</span></p>
            <span className="mt-2 block h-[5px] overflow-hidden rounded-full bg-[rgb(21_25_26/.1)]"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.v / m.m) * 100)}%` }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="block h-full rounded-full bg-[var(--negro)]" /></span>
          </div>
        ))}
      </div>

      <RachaCard d={d} compacta />

      <section aria-label="Tus comidas de hoy" className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold tracking-[-0.01em] [font-family:var(--font-display)]">Tus comidas de hoy</h2>
          {t.aceite > 0 && <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#A83D06]"><Droplet size={14} aria-hidden="true" />{t.aceite} kcal atrapadas</span>}
        </div>
        {d.comidasHoy.length === 0 ? (
          <div className="mt-3 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)] p-6 text-center">
            <p className="text-[17px] font-bold">Registra tu primera comida de hoy</p>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Una foto y el Chequeo de Grasas Ocultas. Toma segundos.</p>
            <Link href="/app/registrar" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] px-5 text-[16px] font-semibold text-[var(--bg)]"><Plus size={18} aria-hidden="true" /> Registrar comida</Link>
          </div>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {d.comidasHoy.map((c, i) => {
              const m = momento(c.hora);
              return (
                <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + 0.06 * i, ease: EASE }}>
                  <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => { setAbierta(c); setEditando(false); }} aria-label={`${m.n}: ${c.titulo}, ${c.kcal} kcal. Ver detalle`} className="flex w-full items-center gap-3 rounded-[24px] bg-[var(--surface)] py-2 pl-2 pr-4 text-left shadow-[0_10px_24px_-16px_rgb(21_25_26/.35)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {c.foto ? <img src={c.foto} alt="" width={56} height={56} className="size-[56px] shrink-0 rounded-full border-[3px] border-white object-cover shadow-[0_8px_14px_-8px_rgb(21_25_26/.5)]" /> : <span className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[var(--lima)] text-[var(--accent)]"><Plus size={22} aria-hidden="true" /></span>}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">{m.n} · {c.hora}</span>
                      <span className="block truncate text-[16px] font-bold leading-snug">{c.titulo}</span>
                      <span className="block truncate text-[13px] text-[var(--text-secondary)]">{c.aceite ? <span className="font-bold text-[#A83D06]">+{c.aceite} kcal de aceite atrapadas</span> : c.nota ?? 'Registrado'}</span>
                    </span>
                    <span className="text-right text-[20px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{c.kcal}<span className="mt-0.5 block text-[12px] font-semibold text-[var(--text-secondary)]">kcal</span></span>
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

      <Misiones d={d} actualizar={actualizar} />

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} aria-label="Camino a tu meta" className="caja-lima mt-4 rounded-[28px] p-4">
        <p className="text-[13px] font-bold text-[var(--accent)]">Camino a tu meta</p>
        <p className="mt-1 text-[28px] font-extrabold leading-none tabular-nums tracking-[-0.04em] [font-family:var(--font-display)]"><Cuenta valor={pesoActual} decimales={1} /> kg <span className="text-[14px] font-bold tracking-normal text-[var(--text-secondary)]">→ meta {d.pesoMeta} kg</span></p>
        <div className="relative mt-4 h-2 rounded-full bg-[rgb(21_25_26/.12)]" role="progressbar" aria-valuenow={Math.round(progresoPeso * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Avance hacia tu meta">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progresoPeso * 100}%` }} transition={{ duration: 0.9, ease: EASE }} className="h-full rounded-full bg-[var(--negro)]" />
        </div>
        <div className="mt-2 flex justify-between text-[12px] font-bold text-[var(--text-secondary)]">
          {[25, 50, 75].map((p) => <span key={p}>{p}%{progresoPeso * 100 >= p ? ' ✓' : ''}</span>)}<span>Meta</span>
        </div>
      </motion.section>




      {abierta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setAbierta(null)}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: EASE }} role="dialog" aria-modal="true" aria-label={abierta.titulo} onKeyDown={(e) => { if (e.key === 'Escape') setAbierta(null); }} onClick={(e) => e.stopPropagation()} className="w-full max-w-[480px] rounded-t-[24px] bg-[var(--bg)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_30px_-10px_rgb(0_0_0/.25)]">
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
                  <button type="button" onClick={() => { setForm({ titulo: abierta.titulo, kcal: String(abierta.kcal) }); setErrorForm(''); setEditando(true); }} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold"><Pencil size={16} aria-hidden="true" /> Editar</button>
                  <button type="button" onClick={() => { const c = abierta; actualizar((x) => eliminarComida(x, c.id)); setDeshacer(c); setAbierta(null); setTimeout(() => setDeshacer((cur) => (cur?.id === c.id ? null : cur)), 6000); }} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[#A83D06]/40 text-[15px] font-semibold text-[#A83D06]"><Trash2 size={16} aria-hidden="true" /> Eliminar</button>
                </div>
              </>
            ) : (
              <form className="mt-3 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); const k = Number(form.kcal.replace(',', '.')); if (form.titulo.trim().length < 2 || !(k > 0 && k <= 3000)) { setErrorForm('Pon un nombre y calorías entre 1 y 3.000.'); return; }
              setErrorForm(''); actualizar((x) => editarComida(x, abierta.id, { titulo: form.titulo.trim(), kcal: Math.round(k) })); setAbierta(null); }}>
                <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Nombre</span><input value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} maxLength={60} className="mt-1 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]" /></label>
                <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Calorías (kcal)</span><input inputMode="decimal" value={form.kcal} onChange={(e) => setForm((f) => ({ ...f, kcal: e.target.value.replace(/[^0-9.,]/g, '') }))} className="mt-1 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] tabular-nums outline-none focus:border-[var(--accent)]" /></label>
                {errorForm && <p role="alert" className="text-[14px] font-semibold text-[#C0392B]">{errorForm}</p>}
                <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setEditando(false)} className="min-h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold">Cancelar</button><button type="submit" className="min-h-12 rounded-[var(--radius-button)] bg-[var(--negro)] text-[15px] font-semibold text-[var(--bg)]">Guardar</button></div>
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
