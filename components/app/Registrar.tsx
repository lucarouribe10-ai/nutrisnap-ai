'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { animate, motion } from 'motion/react';
import { Barcode, Camera, Check, FileText, Flame, ImageIcon, Loader2, PenLine, Trophy, X } from 'lucide-react';
import { ChequeoAceite } from './ChequeoAceite';
import { useAppData } from './uso';
import { agregarComida, type AppData, type Hito } from '@/lib/app-store';
import { Llama } from './Llama';
import { BotonGordo } from './ui3d';
import { vibrar } from '@/lib/haptics';
import { BotonPrimario, EASE, PieFijo } from '@/components/onboarding/ui';
import { track } from '@/lib/eventos';

type Paso = 'elegir' | 'analizando' | 'resultado' | 'rapido' | 'error' | 'guardado';
interface IA { demo: boolean; plato: string; kcal: number; proteina_g: number; carbos_g: number; grasas_g: number; pregunta_aceite: { texto: string; una_cucharada_kcal: number } }

async function reducir(file: File, max: number, calidad: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', calidad);
}

export function Registrar() {
  const router = useRouter();
  const [datos, actualizar] = useAppData();
  const [hitos, setHitos] = useState<Hito[]>([]);
  const [racha, setRacha] = useState(0);
  const [fases, setFases] = useState<('resumen' | 'racha' | 'premios')[]>([]);
  const [fase, setFase] = useState(0);
  const [fin, setFin] = useState<{ data: AppData; antes: number } | null>(null);
  const [paso, setPaso] = useState<Paso>('elegir');
  const [errorTexto, setErrorTexto] = useState<string | null>(null);
  const [ia, setIa] = useState<IA | null>(null);
  const [foto, setFoto] = useState<string | undefined>();
  const [aceite, setAceite] = useState<0 | 1 | 2 | null>(null);
  const [pidiendo, setPidiendo] = useState(false);
  const [rapido, setRapido] = useState({ nombre: '', kcal: '' });
  const [intento, setIntento] = useState(false);
  const [xpGanado, setXpGanado] = useState(0);
  const [nota, setNota] = useState('');
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  const analizar = async (imagen: string | null, demo: boolean, miniatura?: string, notaUsar?: string) => {
    setFoto(miniatura);
    setImagenActual(imagen);
    setPaso('analizando');
    try {
      const r = await fetch('/api/analizar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imagen, demo, nota: (notaUsar ?? nota).trim() || undefined }) });
      if (!r.ok) throw new Error('ia');
      if (r.status === 429) { setErrorTexto('Ya usaste tus 8 fotos de hoy. Mañana se renuevan; mientras tanto puedes registrar con el registro rápido.'); setPaso('error'); return; }
      const data = (await r.json()) as IA;
      if (!data.kcal || data.kcal <= 0) { setPaso('error'); return; }
      setIa(data);
      setAceite(null);
      setPidiendo(false);
      setPaso('resultado');
    } catch {
      setPaso('error');
    }
  };
  const alElegir = async (f?: File) => {
    if (!f) return;
    try {
      const [grande, mini] = await Promise.all([reducir(f, 1024, 0.8), reducir(f, 160, 0.7)]);
      void analizar(grande, false, mini);
    } catch {
      setPaso('error');
    }
  };

  const extra = ia && aceite !== null ? ia.pregunta_aceite.una_cucharada_kcal * aceite : 0;
  const guardar = () => {
    if (!ia) return;
    if (aceite === null) { setPidiendo(true); return; }
    const xp = 10 + (extra > 0 ? 5 : 0);
    if (!datos) return;
    const r = agregarComida(datos, { titulo: ia.plato, nota: ia.demo ? 'Foto (ejemplo)' : 'Foto', kcal: Math.round(ia.kcal + extra), proteina: Math.round(ia.proteina_g), carbos: Math.round(ia.carbos_g), grasas: Math.round(ia.grasas_g), foto: foto ?? '/fotos/bowl-garbanzos.jpg', aceite: extra || undefined });
    actualizar(() => r.data);
    setHitos(r.hitos);
    setRacha(r.data.racha);
    setFin({ data: r.data, antes: r.rachaAnterior });
    setFases(['resumen', ...(r.rachaExtendida ? ['racha' as const] : []), ...(r.hitos.length ? ['premios' as const] : [])]);
    setFase(0);
    vibrar(15);
    track('comida_registrada', { via: 'foto', aceite: extra > 0 });
    setXpGanado(xp);
    setPaso('guardado');
  };
  const guardarRapido = () => {
    const kcal = Number(rapido.kcal.replace(',', '.'));
    if (rapido.nombre.trim().length < 2 || !(kcal > 0 && kcal <= 3000)) { setIntento(true); return; }
    if (!datos) return;
    const r = agregarComida(datos, { titulo: rapido.nombre.trim(), nota: 'Registro rápido', kcal: Math.round(kcal), proteina: 0, carbos: 0, grasas: 0 });
    actualizar(() => r.data);
    setHitos(r.hitos);
    setRacha(r.data.racha);
    setFin({ data: r.data, antes: r.rachaAnterior });
    setFases(['resumen', ...(r.rachaExtendida ? ['racha' as const] : []), ...(r.hitos.length ? ['premios' as const] : [])]);
    setFase(0);
    vibrar(15);
    track('comida_registrada', { via: 'rapido' });
    setXpGanado(10);
    setPaso('guardado');
  };

  const cerrar = () => router.push('/app');
  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] pb-32 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <header className="flex items-center justify-between px-5 pt-4">
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] [font-family:var(--font-display)]">{paso === 'guardado' ? 'Listo' : 'Registrar comida'}</h1>
        <button type="button" onClick={cerrar} aria-label="Cerrar" className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={22} aria-hidden="true" /></button>
      </header>

      {paso === 'elegir' && (
        <div className="px-5 pt-4">
          <p className="text-[15px] text-[var(--text-secondary)]">Una foto y el Chequeo de Grasas Ocultas. Toma segundos.</p>
          <label className="mt-4 block rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_24%,transparent)] bg-[var(--surface)] p-3">
            <span className="flex items-center gap-2 text-[14px] font-bold"><PenLine size={16} className="text-[var(--accent)]" aria-hidden="true" /> Cuéntale algo del plato <span className="font-medium text-[var(--text-secondary)]">(opcional)</span></span>
            <input value={nota} onChange={(e) => setNota(e.target.value)} maxLength={200} placeholder="Ej: arepa con carne frita, hecho en casa, entre 3 personas" className="mt-2 h-12 w-full rounded-[12px] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--bg)] px-3 text-[16px] outline-none focus:border-[var(--accent)]" />
            <span className="mt-1 block text-[13px] text-[var(--text-secondary)]">Escríbelo antes de tomar la foto: ayuda a la IA a acertar.</span>
          </label>
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-[var(--radius-card)] bg-[var(--negro)] px-4 text-[var(--bg)] shadow-[0_8px_30px_rgb(21_25_26/.25)]">
              <Camera size={24} aria-hidden="true" /><span><span className="block text-[17px] font-bold">Tomar o elegir una foto</span><span className="block text-[14px] opacity-90">Foto + Chequeo de Grasas Ocultas</span></span>
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => alElegir(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={() => analizar(null, true, '/fotos/bowl-garbanzos.jpg')} className="flex min-h-16 items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)] px-4 text-left"><ImageIcon size={22} className="text-[var(--accent)]" aria-hidden="true" /><span><span className="block text-[16px] font-bold">Usar una foto de ejemplo</span><span className="block text-[14px] text-[var(--text-secondary)]">Para probar sin comida a la mano</span></span></button>
            <button type="button" onClick={() => setPaso('rapido')} className="flex min-h-16 items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-left"><PenLine size={22} className="text-[var(--accent)]" aria-hidden="true" /><span><span className="block text-[16px] font-bold">Registro rápido</span><span className="block text-[14px] text-[var(--text-secondary)]">Escribe el nombre y las calorías</span></span></button>
            {[[Barcode, 'Escanear código de barras', 'El escáner gratis llega en la siguiente etapa'], [FileText, 'Leer etiqueta nutricional', 'Disponible pronto']].map(([Ic, t, d]) => {
              const I = Ic as typeof Barcode;
              return (
                <div key={t as string} aria-disabled="true" className="flex min-h-16 items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)] px-4 opacity-70">
                  <I size={22} className="text-[var(--text-secondary)]" aria-hidden="true" /><span className="flex-1"><span className="block text-[16px] font-bold">{t as string}</span><span className="block text-[14px] text-[var(--text-secondary)]">{d as string}</span></span><span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[12px] font-bold text-[var(--text-secondary)]">Pronto</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {paso === 'analizando' && (
        <div className="px-5 pt-16 text-center" aria-live="polite" aria-busy="true">
          {foto && /* eslint-disable-next-line @next/next/no-img-element */ <img src={foto} alt="Tu foto en análisis" width={144} height={144} className="mx-auto size-36 rounded-[24px] object-cover shadow-[var(--shadow-2)]" />}
          <p className="mt-6 flex items-center justify-center gap-2 text-[20px] font-extrabold [font-family:var(--font-display)]"><Loader2 size={20} className="animate-spin text-[var(--accent)]" aria-hidden="true" /> Analizando tu foto…</p>
          <p className="mt-1 text-[15px] text-[var(--text-secondary)]">Reconociendo tu plato y buscando grasas ocultas.</p>
        </div>
      )}

      {paso === 'error' && (
        <div className="px-5 pt-12 text-center">
          <p className="text-[24px] font-extrabold leading-tight [font-family:var(--font-display)]">{errorTexto ? 'Llegaste al máximo de hoy' : 'No pudimos analizar esa foto'}</p>
          <p className="mx-auto mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">{errorTexto ?? 'Prueba con otra foto donde se vea el plato completo y con buena luz, o usa el registro rápido.'}</p>
          <div className="mt-8 flex flex-col gap-3"><BotonPrimario onClick={() => { setErrorTexto(null); setPaso('elegir'); }}>{errorTexto ? 'Volver' : 'Probar otra foto'}</BotonPrimario><button type="button" onClick={() => setPaso('rapido')} className="min-h-12 text-[15px] font-semibold text-[var(--accent)] underline underline-offset-4">Usar el registro rápido</button></div>
        </div>
      )}

      {paso === 'resultado' && ia && (
        <div className="px-5 pt-4">
          <div className="caja-lima rounded-[32px] px-5 pb-8 pt-5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {foto && <img src={foto} alt={ia.plato} width={176} height={176} className="mx-auto size-44 rounded-full border-[6px] border-white object-cover shadow-[0_22px_34px_-14px_rgb(21_25_26/.55)]" />}
            <p className="mt-4 text-[22px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">{ia.plato}</p>
            <p className="mt-0.5 text-[14px] font-semibold text-[var(--accent)]">{ia.demo ? 'Ejemplo ilustrativo (estimado)' : 'Estimado con margen de error'}</p>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Calculado por IA. No es consejo médico. <a href="/aviso-ia" target="_blank" rel="noopener" className="underline underline-offset-4">Más información</a></p>
          </div>
          <ul className="-mt-4 mb-3 grid grid-cols-3 gap-2 px-1" aria-label="Macros de este plato">
            {[['Proteína', ia.proteina_g, 'var(--lima-2)'], ['Carbos', ia.carbos_g, '#BCE0F2'], ['Grasas', ia.grasas_g, '#FFD3A3']].map(([n, v, f]) => (
              <li key={n as string} className="rounded-[20px] border-2 bg-[var(--surface)] px-2 py-2.5 text-center" style={{ borderColor: f as string }}>
                <p className="text-[12px] font-bold text-[var(--text-secondary)]">{n as string}</p>
                <p className="text-[18px] font-extrabold tabular-nums tracking-[-0.03em] [font-family:var(--font-display)]">{Math.round(v as number)} g</p>
              </li>
            ))}
          </ul>
          <div className="caja-durazno rounded-[var(--radius-card)] p-4">
            <div className="flex items-end justify-between">
              <div><p className="text-[12px] font-bold text-[var(--text-secondary)]">Solo la foto</p><p className={`text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)] ${aceite !== null && extra > 0 ? 'text-[var(--text-secondary)] line-through decoration-2' : ''}`}>{Math.round(ia.kcal)}</p></div>
              <div className="text-right"><p className="text-[12px] font-bold text-[#8A3A06]">Con el Chequeo</p><p aria-live="polite" className="text-[40px] font-extrabold leading-none tabular-nums tracking-[-0.04em] [font-family:var(--font-display)]">{aceite === null ? <span className="text-[var(--text-secondary)]">?</span> : Math.round(ia.kcal + extra)}<span className="ml-1 text-[14px] font-semibold text-[var(--text-secondary)]">kcal</span></p></div>
            </div>
          </div>
          {!ia.demo && imagenActual && (
            <div className="mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_24%,transparent)] bg-[var(--surface)] p-3">
              <label className="block">
                <span className="text-[14px] font-bold">¿La IA no acertó? Cuéntale algo del plato</span>
                <input value={nota} onChange={(e) => setNota(e.target.value)} maxLength={200} placeholder="Ej: es una arepa, hecha en casa, entre 3 personas" className="mt-2 h-12 w-full rounded-[12px] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--bg)] px-3 text-[16px] outline-none focus:border-[var(--accent)]" />
              </label>
              <button type="button" disabled={nota.trim().length < 3} onClick={() => analizar(imagenActual, false, foto, nota)} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[15px] font-semibold text-[var(--accent)] disabled:opacity-45">Recalcular con tu nota</button>
            </div>
          )}
          <div className="mt-3"><ChequeoAceite kcalUna={ia.pregunta_aceite.una_cucharada_kcal} pregunta={ia.pregunta_aceite.texto} valor={aceite} pidiendo={pidiendo} onChange={(n) => setAceite(n)} /></div>
          <PieFijo><BotonPrimario onClick={guardar}>Guardar en mi día</BotonPrimario></PieFijo>
        </div>
      )}

      {paso === 'rapido' && (
        <div className="px-5 pt-4">
          <p className="text-[15px] text-[var(--text-secondary)]">Para cuando no puedes tomar foto.</p>
          <div className="mt-4 flex flex-col gap-4">
            <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">¿Qué comiste?</span>
              <input value={rapido.nombre} onChange={(e) => setRapido((r) => ({ ...r, nombre: e.target.value }))} placeholder="Arepa con queso" maxLength={60} className="mt-1 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[17px] outline-none focus:border-[var(--accent)]" />
              {intento && rapido.nombre.trim().length < 2 && <span role="alert" className="mt-1 block text-[14px] font-medium text-[#A83D06]">Escribe qué comiste.</span>}
            </label>
            <label className="block"><span className="text-[14px] font-semibold text-[var(--text-secondary)]">Calorías (kcal)</span>
              <input inputMode="decimal" value={rapido.kcal} onChange={(e) => setRapido((r) => ({ ...r, kcal: e.target.value.replace(/[^0-9.,]/g, '') }))} placeholder="350" className="mt-1 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[17px] tabular-nums outline-none focus:border-[var(--accent)]" />
              {intento && !(Number(rapido.kcal.replace(',', '.')) > 0 && Number(rapido.kcal.replace(',', '.')) <= 3000) && <span role="alert" className="mt-1 block text-[14px] font-medium text-[#A83D06]">Escribe las calorías (1 a 3000).</span>}
            </label>
          </div>
          <PieFijo><BotonPrimario onClick={guardarRapido}>Guardar en mi día</BotonPrimario></PieFijo>
        </div>
      )}

      {paso === 'guardado' && fin && (
        <motion.div key={fases[fase]} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex min-h-[80dvh] flex-col px-5 pt-8 text-center">
          {fases[fase] === 'resumen' && (
            <div className="flex flex-1 flex-col">
              <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }} className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--negro)] text-[var(--lima)]"><Check size={40} strokeWidth={3.5} aria-hidden="true" /></motion.span>
              <p className="mt-5 text-[28px] font-extrabold [font-family:var(--font-display)]">Guardado en tu día</p>
              <ul className="mt-6 grid grid-cols-3 gap-2" aria-label="Resumen">
                {[
                  { v: `+${xpGanado}`, l: 'XP ganados', c: '#A83D06', f: '#FBE6CF' },
                  { v: `${Math.min(999, Math.round((fin.data.comidasHoy.reduce((t, x) => t + x.kcal, 0) / fin.data.metaKcal) * 100))}%`, l: 'de tu día', c: '#2F5640', f: '#DDEBE0' },
                  { v: `${fin.data.comidasHoy.reduce((t, x) => t + (x.aceite ?? 0), 0)}`, l: 'kcal atrapadas', c: '#A83D06', f: '#FBE6CF' },
                ].map((x, i) => (
                  <motion.li key={x.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.3 }} className="rounded-[16px] p-3" style={{ background: x.f }}>
                    <p className="text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)]" style={{ color: x.c }}>{x.v}</p>
                    <p className="text-[13px] font-semibold text-[#5A4A40]">{x.l}</p>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pb-6 pt-8"><BotonGordo onClick={() => { vibrar(10); fase + 1 < fases.length ? setFase(fase + 1) : cerrar(); }}>{fase + 1 < fases.length ? 'Continuar' : 'Volver a Hoy'}</BotonGordo></div>
            </div>
          )}
          {fases[fase] === 'racha' && (
            <div className="flex flex-1 flex-col items-center">
              <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-[#A83D06]">Racha ampliada</p>
              <motion.div initial={{ scale: 0.3, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} className="mt-4"><Llama size={170} /></motion.div>
              <p className="-mt-2 text-[76px] font-extrabold leading-none tabular-nums tracking-[-0.04em] text-[#A83D06] [font-family:var(--font-display)]"><ContadorRacha desde={fin.antes} hasta={racha} /></p>
              <p className="text-[22px] font-extrabold [font-family:var(--font-display)]">{racha === 1 ? 'día seguido' : 'días seguidos'}</p>
              <ol className="mt-6 grid w-full grid-cols-7 gap-1.5" aria-label="Tu semana">
                {fin.data.kcalSemana.map((k, i) => (
                  <li key={i} className="text-center">
                    <motion.span initial={i === 6 ? { scale: 0.2 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.7 }} className={`mx-auto flex size-9 items-center justify-center rounded-full ${k > 0 ? 'bg-[#A83D06] text-white' : 'border border-[#A83D06]/30 text-[#A83D06]/60'}`}>{k > 0 ? <Check size={16} strokeWidth={3.5} aria-label="Registraste" /> : '·'}</motion.span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[15px] text-[var(--text-secondary)]">Vuelve mañana para sumar otro día.{fin.data.escudos > 0 ? ` Tienes ${fin.data.escudos} escudo${fin.data.escudos > 1 ? 's' : ''} por si un día falta.` : ''}</p>
              <div className="mt-auto w-full pb-6 pt-8"><BotonGordo tono="naranja" onClick={() => { vibrar([15, 30, 15]); fase + 1 < fases.length ? setFase(fase + 1) : cerrar(); }}>{fase + 1 < fases.length ? 'Continuar' : 'Volver a Hoy'}</BotonGordo></div>
            </div>
          )}
          {fases[fase] === 'premios' && (
            <div className="flex flex-1 flex-col">
              <p className="text-[28px] font-extrabold [font-family:var(--font-display)]">¡Lo lograste!</p>
              <ul className="mt-5 flex flex-col gap-3 text-left" aria-label="Lo que lograste">
                {hitos.map((h, i) => (
                  <motion.li key={h.titulo} initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.2 + 0.18 * i }} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.3)] bg-[linear-gradient(135deg,#FFF3E6,#FBE6CF)] p-3">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white [background:linear-gradient(145deg,#FF8A3D,#E8590C)] shadow-[0_6px_14px_-4px_rgb(232_89_12/.7)]">{h.tipo === 'racha' ? <Flame size={22} aria-hidden="true" /> : <Trophy size={22} aria-hidden="true" />}</span>
                    <span className="min-w-0 flex-1"><span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#7A4A1C]">{h.tipo === 'logro' ? 'Logro desbloqueado' : h.tipo === 'nivel' ? 'Subiste de nivel' : 'Racha'}</span><span className="block text-[17px] font-extrabold text-[#5A2D05]">{h.titulo}</span><span className="block text-[14px] text-[#7A4A1C]">{h.detalle}{h.xp ? ` · +${h.xp} XP` : ''}</span></span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pb-6 pt-8"><BotonGordo onClick={cerrar}>Volver a Hoy</BotonGordo></div>
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
}

function ContadorRacha({ desde, hasta }: { desde: number; hasta: number }) {
  const [v, setV] = useState(desde);
  useEffect(() => {
    const c = animate(desde, hasta, { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [desde, hasta]);
  return <>{v}</>;
}
