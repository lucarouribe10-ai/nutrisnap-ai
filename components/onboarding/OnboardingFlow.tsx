'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { Camera, Check, CreditCard, Dumbbell, Droplet, Flag, ImageIcon, Loader2, Mic, Repeat, ScanEye, Target, Timer } from 'lucide-react';
import { Recompensa } from './Recompensa';
import { Anillo, BarraProgreso, BotonPrimario, ChipOpcion, EASE, PieFijo, Pregunta } from './ui';
import { calcularPlan, DOLORES, ETIQUETA_OBJETIVO, fechaMeta, perfilCompleto, type Dolor, type Objetivo, type Perfil, type Sexo } from '@/lib/plan';
import { guardarEstado, leerEstado, type ResultadoFoto } from '@/lib/onboarding-store';
import { track } from '@/lib/eventos';

type Paso = 'nombre' | 'objetivo' | 'dolor' | 'datos' | 'actividad' | 'foto' | 'analizando' | 'resultado' | 'plan' | 'diagnostico';
const PCT: Record<Paso, number> = { nombre: 6, objetivo: 15, dolor: 26, datos: 38, actividad: 50, foto: 62, analizando: 72, resultado: 84, plan: 94, diagnostico: 98 };
const ATRAS: Partial<Record<Paso, Paso>> = { objetivo: 'nombre', dolor: 'objetivo', datos: 'dolor', actividad: 'datos', foto: 'actividad', resultado: 'foto' };

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

/** Miniatura cuadrada de ~112 px (la foto original no se guarda). Si algo falla devuelve undefined: la miniatura es un detalle, nunca bloquea el recorrido. */
async function hacerMiniatura(dataUrl: string): Promise<string | undefined> {
  try {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const lado = Math.min(img.width, img.height);
    const c = document.createElement('canvas');
    c.width = 112;
    c.height = 112;
    c.getContext('2d')!.drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 112, 112);
    return c.toDataURL('image/jpeg', 0.7);
  } catch {
    return undefined;
  }
}

const num = (s: string) => (s.trim() === '' ? undefined : Number(s.replace(',', '.')));

export function OnboardingFlow() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [paso, setPaso] = useState<Paso>('nombre');
  const [perfil, setPerfil] = useState<Perfil>({});
  const [campos, setCampos] = useState({ edad: '', estatura: '', peso: '', meta: '' });
  const [foto, setFoto] = useState<{ url: string; demo: boolean } | null>(null);
  const [mini, setMini] = useState<string | undefined>(undefined);
  const [ia, setIa] = useState<RespuestaIA | null>(null);
  const [errorIA, setErrorIA] = useState<false | 'ia' | 'nocomida'>(false);
  const [intentado, setIntentado] = useState(false);
  const [pideAceite, setPideAceite] = useState(false);
  const [nombreTxt, setNombreTxt] = useState('');
  const [intentoNombre, setIntentoNombre] = useState(false);
  const [aceite, setAceite] = useState<0 | 1 | 2 | null>(null);
  const [porVoz, setPorVoz] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [errorVoz, setErrorVoz] = useState('');
  const recompensaRef = useRef<HTMLDivElement | null>(null);
  const bloqueado = useRef(false);

  useEffect(() => {
    const e = leerEstado();
    if (e.perfil.objetivo) { setPerfil(e.perfil); setNombreTxt(e.perfil.nombre ?? ''); }
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
  const falta = (v: number | undefined, msg: string, bad: (n: number) => boolean, msgBad: string) => (v === undefined ? (intentado ? msg : '') : bad(v) ? msgBad : '');
  const errores = {
    edad: falta(edad, 'Escribe tu edad.', (n) => n < 18 || n > 90, edad !== undefined && edad < 18 ? 'NutriSnap es para mayores de 18 años.' : 'Revisa tu edad.'),
    estatura: falta(estatura, 'Escribe tu estatura en cm.', (n) => n < 120 || n > 230, 'Escribe tu estatura en cm (120 a 230).'),
    peso: falta(peso, 'Escribe tu peso en kg.', (n) => n < 35 || n > 250, 'Escribe tu peso en kg (35 a 250).'),
    meta: meta !== undefined && (meta < 35 || meta > 250) ? 'Escribe tu meta en kg (35 a 250).' : '',
    sexo: intentado && !perfil.sexo ? 'Elige una opción.' : '',
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
      if (!data.kcal || data.kcal <= 0) {
        setErrorIA('nocomida');
        return;
      }
      const resto = Math.max(0, 4200 - (Date.now() - inicio));
      await new Promise((res) => setTimeout(res, reduce ? 0 : resto));
      setIa(data);
      setAceite(null);
      setPideAceite(false);
      setPorVoz(false);
      track('resultado_visto', { demo: data.demo });
      ir('resultado');
    } catch {
      setErrorIA('ia');
    }
  }, [ir, reduce]);

  const alElegirArchivo = async (f: File | undefined) => {
    if (!f) return;
    try {
      const url = await comprimir(f);
      setFoto({ url, demo: false });
      setMini(undefined);
      void hacerMiniatura(url).then(setMini);
      void analizar(url, false);
    } catch {
      setErrorIA('ia');
      ir('analizando');
    }
  };
  const usarEjemplo = () => {
    setFoto({ url: '/fotos/bowl-garbanzos.jpg', demo: true });
    setMini('/fotos/bowl-garbanzos.jpg');
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
    setErrorVoz('');
    const rec = new SR();
    rec.lang = 'es-CO';
    rec.onstart = () => setEscuchando(true);
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => { setEscuchando(false); setErrorVoz('No pude escucharte. Toca una opción o intenta de nuevo.'); };
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
    if (!ia) return;
    if (aceite === null) {
      setPideAceite(true);
      return;
    }
    const res: ResultadoFoto = { plato: ia.plato, kcalBase: ia.kcal, proteina: ia.proteina_g, carbos: ia.carbos_g, grasas: ia.grasas_g, extraAceite: extra, demo: ia.demo, miniatura: mini };
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
      [1000, 28, 1],
      [2000, 50, 2],
      [3000, 72, 3],
      [3900, 90, 4],
      [4800, 100, 5],
    ] as const;
    const ts = hitos.map(([at, pct, l]) => setTimeout(() => { setPctPlan(pct); setLineaPlan(l); }, reduce ? 0 : at));
    const fin = setTimeout(() => {
      track('plan_construido');
      guardarEstado({ perfil, resultado: leerEstado().resultado, xp: 25 });
      ir('diagnostico');
    }, reduce ? 300 : 5600);
    return () => { ts.forEach(clearTimeout); clearTimeout(fin); };
  }, [paso, plan, reduce, perfil, ir]);

  const lineasPlan = perfil.objetivo && plan ? [
    `Analizando tu objetivo: ${ETIQUETA_OBJETIVO[perfil.objetivo]}`,
    `Ajustando a tu estatura de ${perfil.estatura} cm y ${perfil.peso} kg`,
    `Calculando tus calorías: ${plan.kcal.toLocaleString('es-CO')} al día`,
    `Fijando tu meta de proteína: ${plan.proteina} g`,
    perfil.dolor === 'aceite' ? 'Preparando tu Chequeo de Grasas Ocultas' : perfil.dolor === 'cobros' ? 'Programando tu aviso antes de cualquier cobro' : perfil.dolor === 'constancia' ? 'Armando tu racha, tus puntos y tus logros' : 'Preparando tu registro en segundos',
  ] : [];

  const dolorFrase = perfil.dolor ? DOLORES[perfil.dolor] : null;
  const metaFecha = plan && perfilCompleto(perfil) ? fechaMeta(perfil, plan) : null;
  const cuota = plan && ia ? Math.round(((ia.kcal + extra) / plan.kcal) * 100) : null;
  useEffect(() => {
    if (aceite !== null) setTimeout(() => recompensaRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }), 450);
  }, [aceite, reduce]);
  const retroceder = ATRAS[paso] ? () => setPaso(ATRAS[paso] as Paso) : undefined;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] [background:linear-gradient(180deg,color-mix(in_oklab,var(--tint)_35%,var(--bg)),var(--bg)_300px)] pb-28 text-[var(--text-primary)] [font-family:var(--font-body)]">
      {paso !== 'analizando' && paso !== 'plan' && paso !== 'diagnostico' && <BarraProgreso pct={PCT[paso]} onAtras={retroceder} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {paso === 'nombre' && (
            <>
              <Pregunta titulo={<>¿Cómo te <span className="text-[var(--accent)]">llamas</span>?</>} sub="Para hablarte por tu nombre. Solo tu primer nombre." />
              <div className="mt-8 px-5">
                <label className="block">
                  <span className="sr-only">Tu nombre</span>
                  <input
                    autoFocus
                    autoComplete="given-name"
                    value={nombreTxt}
                    maxLength={30}
                    placeholder="Mateo"
                    onChange={(e) => setNombreTxt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    aria-invalid={intentoNombre && nombreTxt.trim().length < 2}
                    className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[18px] font-semibold outline-none focus:border-[var(--accent)]"
                  />
                </label>
                {intentoNombre && nombreTxt.trim().length < 2 && <p role="alert" className="mt-1 text-[13px] font-medium text-[var(--accent-2)]">Escribe tu nombre.</p>}
              </div>
              <p className="mt-6 px-5 text-center text-[14px] text-[var(--text-secondary)]">Primero ves tu primer resultado. Después decides.</p>
              <PieFijo>
                <BotonPrimario onClick={() => { const n = nombreTxt.trim(); if (n.length < 2) { setIntentoNombre(true); return; } setPerfil((p) => ({ ...p, nombre: n.charAt(0).toUpperCase() + n.slice(1) })); ir('objetivo'); }}>Continuar</BotonPrimario>
              </PieFijo>
            </>
          )}

          {paso === 'objetivo' && (
            <>
              <Pregunta titulo={<>{perfil.nombre ? `${perfil.nombre}, ¿cuál` : '¿Cuál'} es tu <span className="text-[var(--accent)]">objetivo</span>?</>} sub="Con esto calculo tus calorías y tu meta de proteína." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                {([
                  ['definir', Target, 'Definir (bajar grasa)', 'Déficit sin perder músculo'],
                  ['ganar', Dumbbell, 'Ganar músculo', 'Superávit con proteína alta'],
                  ['mantener', Flag, 'Mantener mi peso', 'Comer parejo y constante'],
                ] as const).map(([id, icon, t, d]) => (
                  <ChipOpcion key={id} indice={['definir', 'ganar', 'mantener'].indexOf(id)} icon={icon} titulo={t} detalle={d} seleccionado={perfil.objetivo === id} onClick={() => elegir(() => setPerfil((p) => ({ ...p, objetivo: id as Objetivo })), 'dolor')} />
                ))}
              </div>
              <div className="hairline-card mx-5 mt-8 rounded-[var(--radius-card)] p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Al final verás</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
                  <li className="flex items-center gap-2"><Check size={16} strokeWidth={3} className="text-[var(--accent)]" aria-hidden="true" /> Tus calorías y tu meta de proteína</li>
                  <li className="flex items-center gap-2"><Check size={16} strokeWidth={3} className="text-[var(--accent)]" aria-hidden="true" /> El aceite que tu foto no ve</li>
                </ul>
              </div>
              <p className="mt-5 px-5 text-center text-[14px] text-[var(--text-secondary)]">Primero ves tu primer resultado. Después decides.</p>
            </>
          )}

          {paso === 'dolor' && (
            <>
              <Pregunta titulo={<>¿Qué ha sido lo <span className="text-[var(--accent)]">más difícil</span> al contar calorías?</>} sub="Elige lo que más te pasa." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                {([['tiempo', Timer], ['aceite', ScanEye], ['cobros', CreditCard], ['constancia', Repeat]] as [Dolor, typeof Timer][]).map(([id, icon], i) => (
                  <ChipOpcion key={id} indice={i} icon={icon} titulo={DOLORES[id].opcion} seleccionado={perfil.dolor === id} onClick={() => elegir(() => setPerfil((p) => ({ ...p, dolor: id })), 'datos')} />
                ))}
              </div>
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
                {errores.sexo && <p role="alert" className="-mt-2 text-[13px] font-medium text-[var(--accent-2)]">{errores.sexo}</p>}
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
                        placeholder={({ edad: '28', estatura: '178', peso: '80', meta: '75' } as Record<string, string>)[k]}
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
                <BotonPrimario onClick={() => { if (!datosValidos) { setIntentado(true); return; } setPerfil((p) => ({ ...p, edad, estatura, peso, meta: pideMeta ? meta : undefined })); ir('actividad'); }}>Continuar</BotonPrimario>
              </PieFijo>
            </>
          )}

          {paso === 'actividad' && (
            <>
              <Pregunta titulo={<>¿Cuántos días <span className="text-[var(--accent)]">entrenas</span>?</>} sub="Por semana, en promedio." />
              <div className="mt-8 flex flex-col gap-3 px-5">
                {([[2, '1 a 2 días', 'Estoy empezando'], [4, '3 a 4 días', 'Constante'], [6, '5 a 6 días', 'Le doy duro'], [7, 'Todos los días', 'Es parte de mi vida']] as const).map(([d, t, det]) => (
                  <ChipOpcion key={d} indice={[2, 4, 6, 7].indexOf(d)} titulo={t} detalle={det} seleccionado={perfil.dias === d} onClick={() => elegir(() => setPerfil((p) => ({ ...p, dias: d })), 'foto')} />
                ))}
              </div>
            </>
          )}

          {paso === 'foto' && (
            <>
              <Pregunta titulo={<>Ahora tu <span className="text-[var(--accent)]">primera foto</span></>} sub="Toma una foto de tu comida. Te muestro lo que la cámara no ve." />
              <div className="mx-5 mt-6 flex h-44 items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--surface)]" aria-hidden="true">
                <div className="relative flex size-24 items-center justify-center rounded-[18px] text-[var(--accent)]">
                  <span className="absolute left-0 top-0 size-5 rounded-tl-lg border-l-[3px] border-t-[3px] border-current" /><span className="absolute right-0 top-0 size-5 rounded-tr-lg border-r-[3px] border-t-[3px] border-current" />
                  <span className="absolute bottom-0 left-0 size-5 rounded-bl-lg border-b-[3px] border-l-[3px] border-current" /><span className="absolute bottom-0 right-0 size-5 rounded-br-lg border-b-[3px] border-r-[3px] border-current" />
                  <Droplet size={34} strokeWidth={2.2} className="text-[var(--accent-2)]" />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 px-5">
                <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] text-[17px] font-semibold text-[var(--bg)] shadow-[0_8px_30px_rgb(21_25_26/.25)]">
                  <Camera size={20} aria-hidden="true" /> Tomar o elegir una foto
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => alElegirArchivo(e.target.files?.[0])} />
                </label>
                <button type="button" onClick={usarEjemplo} className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[16px] font-semibold text-[var(--accent)]">
                  <ImageIcon size={18} aria-hidden="true" /> Usar una foto de ejemplo
                </button>
              </div>
              <p className="mt-6 px-5 text-center text-[13px] text-[var(--text-secondary)]">Tu foto se analiza y no se guarda.</p>
            </>
          )}

          {paso === 'analizando' && (
            <div className="px-5 pt-16 text-center" aria-live="polite" aria-busy={!errorIA}>
              {!errorIA ? (
                <AnalisisEnCurso foto={foto?.url} />
              ) : (
                <div>
                  <p className="text-[24px] font-extrabold leading-tight [font-family:var(--font-display)]">{errorIA === 'nocomida' ? 'No veo comida en esa foto' : 'No pudimos analizar tu foto'}</p>
                  <p className="mx-auto mt-2 max-w-[320px] text-[15px] text-[var(--text-secondary)]">{errorIA === 'nocomida' ? 'Prueba con otra foto donde se vea el plato completo y con buena luz.' : 'Tus respuestas están guardadas. Puedes reintentar o usar la foto de ejemplo.'}</p>
                  <div className="mt-8 flex flex-col gap-3">
                    {errorIA === 'nocomida' ? (
                      <BotonPrimario onClick={() => { setErrorIA(false); setPaso('foto'); }}>Tomar otra foto</BotonPrimario>
                    ) : (
                      <BotonPrimario onClick={() => (foto && !foto.demo ? analizar(foto.url, false) : usarEjemplo())}>Reintentar</BotonPrimario>
                    )}
                    <button type="button" onClick={usarEjemplo} className="min-h-12 text-[15px] font-semibold text-[var(--accent)] underline underline-offset-4">Usar la foto de ejemplo</button>
                    <button type="button" onClick={() => { setErrorIA(false); setPaso('foto'); }} className="min-h-12 text-[15px] font-semibold text-[var(--text-secondary)]">Volver</button>
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
                <div className="hairline-card mt-4 flex items-center gap-3 rounded-[var(--radius-card)] p-3 shadow-[var(--shadow-1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {foto && <img src={foto.url} alt={ia.plato} width={72} height={72} className="size-[72px] rounded-full border-[3px] border-white object-cover shadow-[0_4px_10px_-4px_rgb(36_43_36/.35)]" />}
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
                      <p className="text-[12px] font-bold text-[var(--accent)]">Con el Chequeo</p>
                      <p aria-live="polite" className="text-[44px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{aceite === null ? <span className="text-[var(--text-secondary)]">?</span> : totalMostrado}<span className="ml-1 text-[14px] font-semibold text-[var(--text-secondary)]">kcal</span></p>
                    </div>
                  </div>
                  <div className="tick-escala mt-3" aria-hidden="true" />
                  {aceite !== null && cuota !== null && plan && (
                    <p className="mt-3 text-[14px]"><strong className="font-bold">Ya es el {cuota}%</strong> de tus {plan.kcal.toLocaleString('es-CO')} kcal de hoy.</p>
                  )}
                </div>
                <div className="hairline-card mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[#A83D06]"><Droplet size={13} aria-hidden="true" /> Chequeo de Grasas Ocultas</p>
                  <p className="mt-2 text-[18px] font-extrabold leading-snug [font-family:var(--font-display)]">{ia.pregunta_aceite.texto || '¿Cuánto aceite llevó?'}</p>
                  <p className={`mt-1 text-[14px] ${pideAceite && aceite === null ? 'font-bold text-[#A83D06]' : 'text-[var(--text-secondary)]'}`}>{pideAceite && aceite === null ? 'Elige una opción para ver tu total.' : 'La cámara no lo ve. Tócalo o dilo por voz.'}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Cantidad de aceite">
                    {([0, 1, 2] as const).map((n) => (
                      <button key={n} type="button" aria-label={n === 0 ? 'Nada de aceite' : `${n} cucharada${n > 1 ? 's' : ''}, más ${ia.pregunta_aceite.una_cucharada_kcal * n} kcal`} aria-pressed={aceite === n} onClick={() => { setAceite(n); setPorVoz(false); }} className={`flex min-h-14 flex-col items-center justify-center rounded-full px-2 py-1.5 text-[15px] font-bold leading-tight ${aceite === n ? 'bg-[var(--negro)] text-[var(--on-negro)] shadow-[0_8px_14px_-8px_rgb(21_25_26/.6)]' : 'bg-[var(--surface-2)] text-[var(--text-primary)]'}`}>
                        {n === 0 ? 'Nada' : <>{n} cda.<span className="block text-[13px] font-semibold opacity-90">+{ia.pregunta_aceite.una_cucharada_kcal * n} kcal</span></>}
                      </button>
                    ))}
                  </div>
                  {vozDisponible && (
                    <button type="button" onClick={dictar} aria-pressed={escuchando} className={`mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold ${escuchando ? 'animate-pulse bg-[#C2490A] text-white' : 'border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[var(--text-primary)]'}`}><Mic size={18} aria-hidden="true" /> {escuchando ? 'Escuchando…' : 'Decirlo por voz'}</button>
                  )}
                  {escuchando && <p className="mt-2 text-[14px] font-semibold">Escuchando… di, por ejemplo, «una cucharada».</p>}
                  {errorVoz && <p role="alert" className="mt-2 text-[14px] font-semibold text-[#A83D06]">{errorVoz}</p>}
                  {porVoz && !escuchando && <p className="mt-2 text-[14px] font-semibold">Entendí tu voz y lo sumé.</p>}
                </div>
                {aceite !== null && (
                  <div ref={recompensaRef} className="scroll-mb-32">
                  <Recompensa compacto xpGanado={15} xpTotal={15} titulo="tu racha empieza hoy" detalle={extra > 0 ? `Atrapaste ${extra} kcal que la foto no veía.` : 'Registrado sin grasas extra.'} logro={extra > 0 ? 'Primer hallazgo' : undefined} />
                  </div>
                )}
              </div>
              <PieFijo>
                <BotonPrimario onClick={continuarAPlan}>Ver mi plan</BotonPrimario>
              </PieFijo>
            </>
          )}

          {paso === 'diagnostico' && plan && perfil.objetivo && (
            <div className="px-5 pb-32 pt-10">
              <h1 className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">
                {perfil.nombre ? `${perfil.nombre}, tu` : 'Tu'} plan de <span className="text-[var(--accent)]">{ETIQUETA_OBJETIVO[perfil.objetivo]}</span> está listo
              </h1>
              <div className="hairline-card mt-6 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-1)]">
                <div className="panel-campo grid grid-cols-2 gap-3 rounded-[12px] p-3 text-center">
                  <div><p className="text-[32px] font-extrabold leading-none tabular-nums [font-family:var(--font-display)]">{plan.kcal.toLocaleString('es-CO')}</p><p className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">kcal al día</p></div>
                  <div><p className="text-[32px] font-extrabold leading-none tabular-nums text-[var(--accent)] [font-family:var(--font-display)]">{plan.proteina} g</p><p className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">de proteína</p></div>
                </div>
                {metaFecha && perfil.meta && (
                  <p className="mt-3 text-[15px] leading-snug">A este ritmo llegarías a <strong>{perfil.meta} kg</strong> hacia el <strong>{new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(metaFecha)}</strong>. <span className="text-[var(--text-secondary)]">Es un estimado: depende de tu constancia.</span></p>
                )}
                {plan.avisoMeta && <p role="note" className="mt-3 rounded-[12px] bg-[var(--surface-2)] p-3 text-[14px] text-[var(--text-secondary)]">{plan.avisoMeta}</p>}
              </div>
              {dolorFrase && (
                <div className="mt-3 rounded-[var(--radius-card)] border-l-4 border-[var(--accent)] bg-[var(--surface)] p-4">
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu freno principal</p>
                  <p className="mt-1 text-[16px] font-bold">{dolorFrase.freno}</p>
                  <p className="mt-1 text-[15px] text-[var(--text-secondary)]">{dolorFrase.solucion}</p>
                </div>
              )}
              <Recompensa xpGanado={10} xpTotal={25} titulo="perfil completo" detalle="Tu progreso se guarda al crear tu cuenta." />
              <PieFijo>
                <BotonPrimario onClick={() => router.push('/paywall')}>Ver mi plan y empezar la prueba</BotonPrimario>
              </PieFijo>
            </div>
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
