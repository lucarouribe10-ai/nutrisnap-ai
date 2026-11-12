'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { Camera, Check, Dumbbell, Droplet, Flag, ImageIcon, Loader2, Mic, Target, Zap } from 'lucide-react';
import { Anillo, BarraProgreso, BotonPrimario, ChipOpcion, EASE, PieFijo, Pregunta } from './ui';
import { calcularPlan, ETIQUETA_OBJETIVO, perfilCompleto, type Objetivo, type Perfil, type Sexo } from '@/lib/plan';
import { guardarEstado, leerEstado, type ResultadoFoto } from '@/lib/onboarding-store';
import { track } from '@/lib/eventos';

type Paso = 'objetivo' | 'datos' | 'actividad' | 'foto' | 'analizando' | 'resultado' | 'plan';
const PCT: Record<Paso, number> = { objetivo: 12, datos: 30, actividad: 46, foto: 62, analizando: 72, resultado: 86, plan: 96 };
const ATRAS: Partial<Record<Paso, Paso>> = { datos: 'objetivo', actividad: 'datos', foto: 'actividad', resultado: 'foto' };

interface RespuestaIA {
  demo: boolean;
  plato: string;
  kcal: number;
  proteina_g: number;
  carbos_g: number;
  grasas_g: number;
  pregunta_aceite: { texto: string; una_cucharada_kcal: number };
}

async function comprimir(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.8);
}

const num = (s: string) => (s.trim() === '' ? undefined : Number(s.replace(',', '.')));

export function OnboardingFlow() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [paso, setPaso] = useState<Paso>('objetivo');
  const [perfil, setPerfil] = useState<Perfil>({});
  const [campos, setCampos] = useState({ edad: '', estatura: '', peso: '', meta: '' });
  const [foto, setFoto] = useState<{ url: string; demo: boolean } | null>(null);
  const [ia, setIa] = useState<RespuestaIA | null>(null);
  const [errorIA, setErrorIA] = useState(false);
  const [aceite, setAceite] = useState<0 | 1 | 2 | null>(null);
  const [porVoz, setPorVoz] = useState(false);
  const bloqueado = useRef(false);

  useEffect(() => {
    const e = leerEstado();
    if (e.perfil.objetivo) setPerfil(e.perfil);
    track('onboarding_iniciado');
  }, []);

  const ir = useCallback((p: Paso) => {
    setPaso(p);
    window.scrollTo(0, 0);
    track('paso_completado', { paso: p });
  }, []);

  const elegir = (fn: () => void, siguiente: Paso) => {
    if (bloqueado.current) return;
    bloqueado.current = true;
    fn();
    setTimeout(() => {
      bloqueado.current = false;
      ir(siguiente);
    }, reduce ? 0 : 300);
  };

  /* ───────── DATOS ───────── */
  const edad = num(campos.edad);
  const estatura = num(campos.estatura);
  const peso = num(campos.peso);
  const meta = num(campos.meta);
  const pideMeta = perfil.objetivo !== 'mantener';
  const errores = {
    edad: edad !== undefined && (edad < 18 ? 'NutriSnap es para mayores de 18 años.' : edad > 90 ? 'Revisa tu edad.' : ''),
    estatura: estatura !== undefined && (estatura < 120 || estatura > 230 ? 'Escribe tu estatura en cm (120 a 230).' : ''),
    peso: peso !== undefined && (peso < 35 || peso > 250 ? 'Escribe tu peso en kg (35 a 250).' : ''),
    meta: meta !== undefined && (meta < 35 || meta > 250 ? 'Escribe tu meta en kg (35 a 250).' : ''),
  };
  const datosValidos = Boolean(perfil.sexo && edad && estatura && peso) && !errores.edad && !errores.estatura && !errores.peso && !errores.meta;

  /* ───────── FOTO / IA ───────── */
  const analizar = useCallback(async (imagen: string | null, demo: boolean) => {
    setErrorIA(false);
    setIa(null);
    ir('analizando');
    const inicio = Date.now();
    try {
      const r = await fetch('/api/analizar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imagen, demo }) });
      if (!r.ok) throw new Error('ia');
      const data = (await r.json()) as RespuestaIA;
      const resto = Math.max(0, 4200 - (Date.now() - inicio));
      await new Promise((res) => setTimeout(res, reduce ? 0 : resto));
      setIa(data);
      setAceite(null);
      setPorVoz(false);
      track('resultado_visto', { demo: data.demo });
      ir('resultado');
    } catch {
      setErrorIA(true);
    }
  }, [ir, reduce]);

  const alElegirArchivo = async (f: File | undefined) => {
    if (!f) return;
    try {
      const url = await comprimir(f);
      setFoto({ url, demo: false });
      void analizar(url, false);
    } catch {
      setErrorIA(true);
      ir('analizando');
    }
  };
  const usarEjemplo = () => {
    setFoto({ url: '/fotos/ensalada.jpg', demo: true });
    void analizar(null, true);
  };

  /* ───────── RESULTADO ───────── */
  const extra = ia && aceite !== null ? ia.pregunta_aceite.una_cucharada_kcal * aceite : 0;
  const totalObjetivo = ia ? Math.round(ia.kcal + extra) : 0;
  const [totalMostrado, setTotalMostrado] = useState(0);
  useEffect(() => {
    if (!ia) return;
    if (reduce) return setTotalMostrado(totalObjetivo);
    const c = animate(totalMostrado || ia.kcal, totalObjetivo, { duration: 0.6, ease: EASE, onUpdate: (v) => setTotalMostrado(Math.round(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalObjetivo, ia]);

  const dictar = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'es-CO';
    rec.onresult = (ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const t = ev.results[0][0].transcript.toLowerCase();
      const n = /nada|sin aceite|no llev/.test(t) ? 0 : /\b(dos|2)\b/.test(t) ? 2 : 1;
      setAceite(n as 0 | 1 | 2);
      setPorVoz(true);
    };
    rec.start();
  };
  const vozDisponible = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const continuarAPlan = () => {
    if (!ia || aceite === null) return;
    const res: ResultadoFoto = { plato: ia.plato, kcalBase: ia.kcal, proteina: ia.proteina_g, carbos: ia.carbos_g, grasas: ia.grasas_g, extraAceite: extra, demo: ia.demo };
    guardarEstado({ perfil, resultado: res, xp: 15 });
    track('chequeo_respondido', { aceite, voz: porVoz });
    ir('plan');
  };

  const plan = useMemo(() => (perfilCompleto(perfil) ? calcularPlan(perfil) : null), [perfil]);

  /* ───────── PLAN (labor illusion → paywall) ───────── */
  const [lineaPlan, setLineaPlan] = useState(0);
  const [pctPlan, setPctPlan] = useState(0);
  useEffect(() => {
    if (paso !== 'plan' || !plan) return;
    const hitos = [
      [0, 6, 0],
      [1100, 34, 1],
      [2300, 58, 2],
      [3500, 83, 3],
      [4600, 100, 4],
    ] as const;
    const ts = hitos.map(([at, pct, l]) => setTimeout(() => { setPctPlan(pct); setLineaPlan(l); }, reduce ? 0 : at));
    const fin = setTimeout(() => { track('plan_construido'); router.push('/paywall'); }, reduce ? 300 : 5200);
    return () => { ts.forEach(clearTimeout); clearTimeout(fin); };
  }, [paso, plan, reduce, router]);

  const lineasPlan = perfil.objetivo && plan ? [
    `Analizando tu objetivo: ${ETIQUETA_OBJETIVO[perfil.objetivo]}`,
    `Ajustando a tu estatura de ${perfil.estatura} cm y ${perfil.peso} kg`,
    `Calculando tus calorías: ${plan.kcal.toLocaleString('es-CO')} al día`,
    `Fijando tu meta de proteína: ${plan.proteina} g`,
  ] : [];

  const retroceder = ATRAS[paso] ? () => setPaso(ATRAS[paso] as Paso) : undefined;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] pb-28 text-[var(--text-primary)] [font-family:var(--font-body)]">
      {paso !== 'analizando' && paso !== 'plan' && <BarraProgreso pct={PCT[paso]} onAtras={retroceder} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {paso === 'objetivo' && (
            <>
              <Pregunta titulo={<>¿Cuál es tu <span className="text-[var(--accent)]">objetivo</span>?</>} sub="Con esto calculo tus calorías y tu meta de proteína." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                {([
                  ['definir', Target, 'Definir (bajar grasa)', 'Déficit sin perder músculo'],
                  ['ganar', Dumbbell, 'Ganar músculo', 'Superávit con proteína alta'],
                  ['mantener', Flag, 'Mantener mi peso', 'Comer parejo y constante'],
                ] as const).map(([id, icon, t, d]) => (
                  <ChipOpcion key={id} icon={icon} titulo={t} detalle={d} seleccionado={perfil.objetivo === id} onClick={() => elegir(() => setPerfil((p) => ({ ...p, objetivo: id as Objetivo })), 'datos')} />
                ))}
              </div>
              <p className="mt-6 px-5 text-center text-[13px] text-[var(--text-secondary)]">Primero ves tu primer resultado. Después decides.</p>
            </>
          )}

          {paso === 'datos' && (
            <>
              <Pregunta titulo={<>Cuéntame de <span className="text-[var(--accent)]">ti</span></>} sub="Solo para calcular tus números. No se comparten." />
              <div className="mt-6 flex flex-col gap-4 px-5">
                <div className="grid grid-cols-2 gap-3" role="group" aria-label="Sexo">
                  {(['hombre', 'mujer'] as Sexo[]).map((s) => (
                    <ChipOpcion key={s} titulo={s === 'hombre' ? 'Hombre' : 'Mujer'} seleccionado={perfil.sexo === s} onClick={() => setPerfil((p) => ({ ...p, sexo: s }))} />
                  ))}
                </div>
                {([
                  ['edad', 'Edad', 'años', campos.edad, errores.edad],
                  ['estatura', 'Estatura', 'cm', campos.estatura, errores.estatura],
                  ['peso', 'Peso actual', 'kg', campos.peso, errores.peso],
                  ...(pideMeta ? [['meta', 'Peso meta (opcional)', 'kg', campos.meta, errores.meta]] : []),
                ] as [keyof typeof campos, string, string, string, string | false][]).map(([k, label, unidad, valor, err]) => (
                  <label key={k} className="block">
                    <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{label}</span>
                    <span className={`mt-1 flex h-14 items-center rounded-[var(--radius-card)] border bg-[var(--surface)] px-4 ${err ? 'border-[var(--accent-2)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] focus-within:border-[var(--accent)]'}`}>
                      <input
                        inputMode="decimal"
                        value={valor}
                        onChange={(e) => setCampos((c) => ({ ...c, [k]: e.target.value.replace(/[^0-9.,]/g, '') }))}
                        className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold tabular-nums outline-none"
                        aria-invalid={Boolean(err)}
                      />
                      <span className="text-[14px] text-[var(--text-secondary)]">{unidad}</span>
                    </span>
                    {err && <span role="alert" className="mt-1 block text-[13px] font-medium text-[var(--accent-2)]">{err}</span>}
                  </label>
                ))}
              </div>
              <PieFijo>
                <BotonPrimario disabled={!datosValidos} onClick={() => { setPerfil((p) => ({ ...p, edad, estatura, peso, meta: pideMeta ? meta : undefined })); ir('actividad'); }}>Continuar</BotonPrimario>
              </PieFijo>
            </>
          )}

          {paso === 'actividad' && (
            <>
              <Pregunta titulo={<>¿Cuántos días <span className="text-[var(--accent)]">entrenas</span>?</>} sub="Por semana, en promedio." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                {([[2, '1 a 2 días', 'Estoy empezando'], [4, '3 a 4 días', 'Constante'], [6, '5 a 6 días', 'Le doy duro'], [7, 'Todos los días', 'Es parte de mi vida']] as const).map(([d, t, det]) => (
                  <ChipOpcion key={d} titulo={t} detalle={det} seleccionado={perfil.dias === d} onClick={() => elegir(() => setPerfil((p) => ({ ...p, dias: d })), 'foto')} />
                ))}
              </div>
            </>
          )}

          {paso === 'foto' && (
            <>
              <Pregunta titulo={<>Ahora tu <span className="text-[var(--accent)]">primera foto</span></>} sub="Toma una foto de tu comida. Te muestro lo que la cámara no ve." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[17px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]">
                  <Camera size={20} aria-hidden="true" /> Tomar o elegir una foto
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => alElegirArchivo(e.target.files?.[0])} />
                </label>
                <button type="button" onClick={usarEjemplo} className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[16px] font-semibold text-[var(--accent)]">
                  <ImageIcon size={18} aria-hidden="true" /> No tengo comida a la mano: usar una de ejemplo
                </button>
              </div>
              <p className="mt-6 px-5 text-center text-[13px] text-[var(--text-secondary)]">Tu foto se analiza y no se guarda; solo conservamos una miniatura.</p>
            </>
          )}

          {paso === 'analizando' && (
            <div className="px-5 pt-16 text-center" aria-live="polite" aria-busy={!errorIA}>
              {!errorIA ? (
                <AnalisisEnCurso foto={foto?.url} />
              ) : (
                <div>
                  <p className="text-[22px] font-extrabold [font-family:var(--font-display)]">No pudimos analizar tu foto</p>
                  <p className="mx-auto mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">Tus respuestas están guardadas. Puedes reintentar o usar la foto de ejemplo.</p>
                  <div className="mt-8 flex flex-col gap-3">
                    <BotonPrimario onClick={() => (foto && !foto.demo ? analizar(foto.url, false) : usarEjemplo())}>Reintentar</BotonPrimario>
                    <button type="button" onClick={usarEjemplo} className="h-12 text-[15px] font-semibold text-[var(--accent)] underline underline-offset-4">Usar la foto de ejemplo</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {paso === 'resultado' && ia && (
            <>
              <div className="px-5 pt-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu primera foto</p>
                <h1 className="mt-1 text-balance text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">
                  {aceite === null ? <>La foto dice <span className="text-[var(--accent)]">{ia.kcal} kcal</span>. ¿Y el aceite?</> : <>{totalMostrado} kcal, con el <span className="text-[var(--accent)]">aceite incluido</span></>}
                </h1>
                <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {foto && <img src={foto.url} alt={ia.plato} width={56} height={56} className="size-14 rounded-[12px] object-cover" />}
                  <div>
                    <p className="text-[16px] font-bold">{ia.plato}</p>
                    <p className="text-[13px] text-[var(--text-secondary)]">{ia.demo ? 'Ejemplo ilustrativo (estimado)' : 'Estimado con margen de error'}</p>
                  </div>
                </div>
                <div className="panel-campo mt-3 rounded-[var(--radius-card)] p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Solo la foto</p>
                      <p className={`text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)] ${aceite !== null ? 'text-[var(--text-secondary)] line-through decoration-2' : ''}`}>{ia.kcal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-[var(--accent)]">Con el Chequeo</p>
                      <p aria-live="polite" className="text-[44px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{aceite === null ? '—' : totalMostrado}<span className="ml-1 text-[14px] font-semibold text-[var(--text-secondary)]">kcal</span></p>
                    </div>
                  </div>
                  <div className="tick-escala mt-3" aria-hidden="true" />
                </div>
                <div className="mt-3 rounded-[var(--radius-card)] p-4 text-[#F4FAF5] [background:linear-gradient(160deg,#4B8062,#3D6B4F_60%,#2F5640)]">
                  <p className="flex items-center gap-2 text-[15px] font-bold"><Droplet size={16} aria-hidden="true" /> {ia.pregunta_aceite.texto || '¿Cuánto aceite llevó?'}</p>
                  <p className="mt-1 text-[13px] opacity-90">La cámara no lo ve. Tócalo o dilo por voz.</p>
                  <div className="mt-3 flex gap-2" role="group" aria-label="Cantidad de aceite">
                    {([0, 1, 2] as const).map((n) => (
                      <button key={n} type="button" aria-pressed={aceite === n} onClick={() => { setAceite(n); setPorVoz(false); }} className={`min-h-12 flex-1 rounded-[10px] px-1 text-[13px] font-bold ${aceite === n ? 'bg-[#F4FAF5] text-[#2F5640]' : 'bg-white/15'}`}>
                        {n === 0 ? 'Nada' : `${n} cda${n > 1 ? 's' : ''} · +${ia.pregunta_aceite.una_cucharada_kcal * n}`}
                      </button>
                    ))}
                    {vozDisponible && (
                      <button type="button" onClick={dictar} aria-label="Decirlo por voz" className="flex min-h-12 w-12 items-center justify-center rounded-[10px] bg-white/15"><Mic size={18} aria-hidden="true" /></button>
                    )}
                  </div>
                  {porVoz && <p className="mt-2 text-[13px] font-semibold">Entendí tu voz y lo sumé.</p>}
                </div>
                <AnimatePresence>
                  {aceite !== null && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_10%,var(--surface))] p-3">
                      <span className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--surface)] text-[var(--accent-2)]"><Zap size={18} aria-hidden="true" /></span>
                      <div>
                        <p className="text-[14px] font-bold">+15 XP · tu racha empieza hoy</p>
                        <p className="text-[12px] text-[var(--text-secondary)]">{extra > 0 ? `Atrapaste ${extra} kcal que la foto no veía.` : 'Registrado sin grasas extra.'}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <PieFijo>
                <BotonPrimario disabled={aceite === null} onClick={continuarAPlan}>{aceite === null ? 'Elige una opción para ver tu total' : 'Ver mi plan'}</BotonPrimario>
              </PieFijo>
            </>
          )}

          {paso === 'plan' && plan && (
            <div className="px-5 pt-16 text-center" aria-live="polite" aria-busy={pctPlan < 100}>
              <div className="relative mx-auto size-28">
                <Anillo pct={pctPlan} />
                <span className="absolute inset-0 flex items-center justify-center text-[24px] font-extrabold tabular-nums [font-family:var(--font-display)]">{pctPlan}%</span>
              </div>
              <h1 className="mt-6 text-[24px] font-extrabold [font-family:var(--font-display)]">Construyendo tu plan…</h1>
              <ul className="mx-auto mt-8 flex max-w-[340px] flex-col gap-4 text-left">
                {lineasPlan.map((l, i) => (
                  <li key={l} className={`flex items-start gap-3 transition-opacity duration-300 ${i > lineaPlan ? 'opacity-40' : 'opacity-100'}`}>
                    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${i < lineaPlan ? 'bg-[var(--accent)] text-[var(--bg)]' : 'border border-[color-mix(in_oklab,var(--text-secondary)_50%,transparent)]'}`}>
                      {i < lineaPlan ? <Check size={12} strokeWidth={3.5} aria-hidden="true" /> : i === lineaPlan ? <Loader2 size={12} className="animate-spin text-[var(--accent)]" aria-hidden="true" /> : null}
                    </span>
                    <span className="text-[15px] leading-snug">{l}</span>
                  </li>
                ))}
              </ul>
              {plan.avisoMeta && <p role="note" className="mx-auto mt-8 max-w-[340px] rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3 text-left text-[13px] text-[var(--text-secondary)]">{plan.avisoMeta}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function AnalisisEnCurso({ foto }: { foto?: string }) {
  const [i, setI] = useState(0);
  const lineas = ['Reconociendo tu plato…', 'Buscando grasas que la cámara no ve…', 'Calculando calorías y macros…'];
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, lineas.length - 1)), 1400);
    return () => clearInterval(t);
  }, [lineas.length]);
  return (
    <div>
      {foto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt="Tu foto en análisis" width={160} height={160} className="mx-auto size-40 rounded-[24px] object-cover shadow-[var(--shadow-2)]" />
      )}
      <h1 className="mt-8 text-[24px] font-extrabold [font-family:var(--font-display)]">Analizando tu foto…</h1>
      <ul className="mx-auto mt-6 flex max-w-[320px] flex-col gap-3 text-left">
        {lineas.map((l, k) => (
          <li key={l} className={`flex items-center gap-3 text-[15px] transition-opacity ${k > i ? 'opacity-40' : ''}`}>
            <span className={`flex size-5 items-center justify-center rounded-full ${k < i ? 'bg-[var(--accent)] text-[var(--bg)]' : 'border border-[color-mix(in_oklab,var(--text-secondary)_50%,transparent)]'}`}>
              {k < i ? <Check size={12} strokeWidth={3.5} aria-hidden="true" /> : k === i ? <Loader2 size={12} className="animate-spin text-[var(--accent)]" aria-hidden="true" /> : null}
            </span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
