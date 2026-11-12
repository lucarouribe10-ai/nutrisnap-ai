'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Barcode, Camera, Check, FileText, Flame, ImageIcon, Loader2, PenLine, Trophy, X } from 'lucide-react';
import { ChequeoAceite } from './ChequeoAceite';
import { useAppData } from './uso';
import { agregarComida, type Hito } from '@/lib/app-store';
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
  const [paso, setPaso] = useState<Paso>('elegir');
  const [ia, setIa] = useState<IA | null>(null);
  const [foto, setFoto] = useState<string | undefined>();
  const [aceite, setAceite] = useState<0 | 1 | 2 | null>(null);
  const [pidiendo, setPidiendo] = useState(false);
  const [rapido, setRapido] = useState({ nombre: '', kcal: '' });
  const [intento, setIntento] = useState(false);
  const [xpGanado, setXpGanado] = useState(0);

  const analizar = async (imagen: string | null, demo: boolean, miniatura?: string) => {
    setFoto(miniatura);
    setPaso('analizando');
    try {
      const r = await fetch('/api/analizar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imagen, demo }) });
      if (!r.ok) throw new Error('ia');
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
    const r = agregarComida(datos, { titulo: ia.plato, nota: ia.demo ? 'Foto (ejemplo)' : 'Foto', kcal: Math.round(ia.kcal + extra), proteina: Math.round(ia.proteina_g), carbos: Math.round(ia.carbos_g), grasas: Math.round(ia.grasas_g), foto: foto ?? '/fotos/ensalada.jpg', aceite: extra || undefined });
    actualizar(() => r.data);
    setHitos(r.hitos);
    setRacha(r.data.racha);
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
          <div className="mt-5 flex flex-col gap-3">
            <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-[var(--radius-card)] bg-[var(--accent)] px-4 text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]">
              <Camera size={24} aria-hidden="true" /><span><span className="block text-[17px] font-bold">Tomar o elegir una foto</span><span className="block text-[14px] opacity-90">Foto + Chequeo de Grasas Ocultas</span></span>
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => alElegir(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={() => analizar(null, true, '/fotos/ensalada.jpg')} className="flex min-h-16 items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)] px-4 text-left"><ImageIcon size={22} className="text-[var(--accent)]" aria-hidden="true" /><span><span className="block text-[16px] font-bold">Usar una foto de ejemplo</span><span className="block text-[14px] text-[var(--text-secondary)]">Para probar sin comida a la mano</span></span></button>
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
          <p className="text-[24px] font-extrabold leading-tight [font-family:var(--font-display)]">No pudimos analizar esa foto</p>
          <p className="mx-auto mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">Prueba con otra foto donde se vea el plato completo y con buena luz, o usa el registro rápido.</p>
          <div className="mt-8 flex flex-col gap-3"><BotonPrimario onClick={() => setPaso('elegir')}>Probar otra foto</BotonPrimario><button type="button" onClick={() => setPaso('rapido')} className="min-h-12 text-[15px] font-semibold text-[var(--accent)] underline underline-offset-4">Usar el registro rápido</button></div>
        </div>
      )}

      {paso === 'resultado' && ia && (
        <div className="px-5 pt-4">
          <div className="hairline-card flex items-center gap-3 rounded-[var(--radius-card)] p-3 shadow-[var(--shadow-1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {foto && <img src={foto} alt={ia.plato} width={56} height={56} className="size-14 rounded-[12px] object-cover" />}
            <div><p className="text-[17px] font-bold">{ia.plato}</p><p className="text-[14px] text-[var(--text-secondary)]">{ia.demo ? 'Ejemplo ilustrativo (estimado)' : 'Estimado con margen de error'}</p></div>
          </div>
          <div className="panel-campo mt-3 rounded-[var(--radius-card)] p-4">
            <div className="flex items-end justify-between">
              <div><p className="text-[12px] font-semibold text-[var(--text-secondary)]">Solo la foto</p><p className={`text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)] ${aceite !== null && extra > 0 ? 'text-[var(--text-secondary)] line-through decoration-2' : ''}`}>{Math.round(ia.kcal)}</p></div>
              <div className="text-right"><p className="text-[12px] font-semibold text-[var(--accent)]">Con el Chequeo</p><p aria-live="polite" className="text-[40px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{aceite === null ? '—' : Math.round(ia.kcal + extra)}<span className="ml-1 text-[14px] font-semibold text-[var(--text-secondary)]">kcal</span></p></div>
            </div>
            <div className="tick-escala mt-3" aria-hidden="true" />
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Proteína {Math.round(ia.proteina_g)} g · Carbos {Math.round(ia.carbos_g)} g · Grasas {Math.round(ia.grasas_g)} g</p>
          </div>
          <div className="mt-3"><ChequeoAceite kcalUna={ia.pregunta_aceite.una_cucharada_kcal} valor={aceite} pidiendo={pidiendo} onChange={(n) => setAceite(n)} /></div>
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

      {paso === 'guardado' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="px-5 pt-12 text-center">
          <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }} className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)]"><Check size={40} strokeWidth={3.5} aria-hidden="true" /></motion.span>
          <p className="mt-5 text-[26px] font-extrabold [font-family:var(--font-display)]">Guardado en tu día</p>
          <p className="mt-2 inline-block rounded-full bg-[#A83D06] px-4 py-1.5 text-[15px] font-extrabold text-white">+{xpGanado} XP</p>
          {racha > 0 && <p className="mt-3 flex items-center justify-center gap-1.5 text-[16px] font-bold text-[#A83D06]"><Flame size={18} aria-hidden="true" /> Racha: {racha} {racha === 1 ? 'día' : 'días'} seguidos</p>}
          {hitos.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3 text-left" aria-label="Lo que lograste">
              {hitos.map((h, i) => (
                <motion.li key={h.titulo} initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.35 + 0.18 * i }} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[rgb(232_89_12/.3)] bg-[linear-gradient(135deg,#FFF3E6,#FBE6CF)] p-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white [background:linear-gradient(145deg,#FF8A3D,#E8590C)] shadow-[0_6px_14px_-4px_rgb(232_89_12/.7)]">{h.tipo === 'racha' ? <Flame size={22} aria-hidden="true" /> : <Trophy size={22} aria-hidden="true" />}</span>
                  <span className="min-w-0 flex-1"><span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#7A4A1C]">{h.tipo === 'logro' ? 'Logro desbloqueado' : h.tipo === 'nivel' ? 'Subiste de nivel' : 'Racha'}</span><span className="block text-[17px] font-extrabold text-[#5A2D05]">{h.titulo}</span><span className="block text-[14px] text-[#7A4A1C]">{h.detalle}{h.xp ? ` · +${h.xp} XP` : ''}</span></span>
                </motion.li>
              ))}
            </ul>
          )}
          <div className="mt-8"><BotonPrimario onClick={cerrar}>Volver a Hoy</BotonPrimario></div>
        </motion.div>
      )}
    </main>
  );
}
