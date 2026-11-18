'use client';
// Datos de la app interna (vista previa SIN servidor): se guardan en el navegador.
// Dos modos honestos: DEMO (datos de ejemplo del mundo de Mateo, solo para ver la app) y REAL
// (el usuario que terminó el recorrido empieza de cero: su primera foto, racha 1).
import { calcularPlan, perfilCompleto, type Perfil } from './plan';
import { leerEstado, type EstadoOnboarding } from './onboarding-store';
import { LOGROS } from './logros';

export interface Comida {
  id: string;
  hora: string;
  titulo: string;
  nota?: string;
  kcal: number;
  proteina: number;
  carbos: number;
  grasas: number;
  foto?: string;
  aceite?: number;
}
export interface AppData {
  version: 3;
  demo: boolean;
  nombre: string;
  metaKcal: number;
  metaProteina: number;
  pesoInicial: number;
  pesoMeta: number;
  pesos: { fecha: string; kg: number }[];
  kcalSemana: number[]; // 7 días, hoy al final
  proteinaDias: boolean[];
  grasasSemana: number[];
  racha: number;
  mejorRacha: number;
  escudos: number;
  ultimoRegistro: string | null;
  aviso?: 'escudo' | 'pausa';
  xp: number;
  registros: number;
  aceiteTotal: number;
  logros: string[];
  comidasHoy: Comida[];
  fecha: string;
  historial: string[]; // días con al menos una comida (para el calendario de racha)
  escudoDias: string[]; // días protegidos por un escudo
  cofre: string | null; // día en que se abrió el cofre diario
}
export interface Hito {
  tipo: 'racha' | 'nivel' | 'logro';
  titulo: string;
  detalle: string;
  xp?: number;
}

const KEY = 'ns_app_v3';
const DIA = 86_400_000;
export const isoDe = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
const hoyISO = () => isoDe(new Date());
const diasEntre = (a: string, b: string) => Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / DIA);
const haceDias = (n: number) => isoDe(new Date(Date.now() - n * DIA));
const desplazar = <T,>(arr: T[], n: number, relleno: T): T[] => (n >= arr.length ? arr.map(() => relleno) : [...arr.slice(n), ...Array(n).fill(relleno)]);

export const NIVELES = [
  { n: 1, nombre: 'Novato', desde: 0 },
  { n: 2, nombre: 'Aprendiz', desde: 100 },
  { n: 3, nombre: 'Regular', desde: 200 },
  { n: 4, nombre: 'Constante', desde: 300 },
  { n: 5, nombre: 'Definido', desde: 500 },
];
export function nivelDe(xp: number) {
  const actual = [...NIVELES].reverse().find((l) => xp >= l.desde) ?? NIVELES[0];
  const sig = NIVELES.find((l) => l.desde > actual.desde);
  return { actual, sig, progreso: sig ? (xp - actual.desde) / (sig.desde - actual.desde) : 1, faltan: sig ? sig.desde - xp : 0 };
}

export function totalesHoy(d: AppData) {
  return d.comidasHoy.reduce((t, c) => ({ kcal: t.kcal + c.kcal, proteina: t.proteina + c.proteina, carbos: t.carbos + c.carbos, grasas: t.grasas + c.grasas, aceite: t.aceite + (c.aceite ?? 0) }), { kcal: 0, proteina: 0, carbos: 0, grasas: 0, aceite: 0 });
}

/** Modo DEMO: datos de ejemplo del mundo de Mateo (solo para ver cómo luce la app). */
export function semilla(perfil?: Perfil): AppData {
  const plan = perfil && perfilCompleto(perfil) ? calcularPlan(perfil) : null;
  const peso = perfil?.peso ?? 79.4;
  const inicial = Math.round((peso + 2.6) * 10) / 10;
  const hoy = hoyISO();
  const d: AppData = {
    version: 3, demo: true, nombre: perfil?.nombre ?? 'Mateo',
    metaKcal: plan?.kcal ?? 2480, metaProteina: plan?.proteina ?? 164,
    pesoInicial: inicial, pesoMeta: perfil?.meta ?? 76,
    pesos: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ fecha: haceDias((8 - s) * 7), kg: s === 8 ? peso : Math.round((inicial - (2.6 / 8) * s + (s % 2 === 0 ? 0.15 : -0.1)) * 10) / 10 })),
    kcalSemana: [2410, 2520, 2380, 2610, 2450, 2490, 0],
    proteinaDias: [true, true, false, true, true, false, false],
    grasasSemana: [120, 90, 0, 140, 110, 100, 0],
    racha: 12, mejorRacha: 12, escudos: 1, ultimoRegistro: haceDias(1),
    xp: 340, registros: 120, aceiteTotal: 640,
    logros: ['primer_registro', 'primer_hallazgo', 'racha_3', 'racha_7', 'cazador_500', 'camino_25'],
    fecha: hoy, cofre: null,
    historial: [...Array.from({ length: 12 }, (_, i) => haceDias(i)), ...Array.from({ length: 30 }, (_, i) => i + 14).filter((i) => i % 5 !== 0).map((i) => haceDias(i))],
    escudoDias: [haceDias(26)],
    comidasHoy: [
      { id: 's1', hora: '08:10', titulo: 'Tostada con huevo', nota: 'Foto', kcal: 520, proteina: 28, carbos: 58, grasas: 18, foto: '/fotos/tostada-huevo.jpg' },
      { id: 's2', hora: '13:05', titulo: 'Poke bowl de pollo', nota: 'Foto + voz', kcal: 640, proteina: 52, carbos: 62, grasas: 18, foto: '/fotos/poke-pollo.jpg', aceite: 120 },
      { id: 's3', hora: '16:30', titulo: 'Batido de proteína', nota: 'Escáner de código', kcal: 210, proteina: 30, carbos: 12, grasas: 4, foto: '/fotos/batido.jpg' },
    ],
  };
  // Hoy ya tiene comidas: la semana refleja el día de hoy
  const t = totalesHoy(d);
  d.kcalSemana[6] = t.kcal; d.proteinaDias[6] = t.proteina >= d.metaProteina; d.grasasSemana[6] = t.aceite;
  d.ultimoRegistro = hoy;
  return d;
}

/** Modo REAL: quien terminó el recorrido empieza de cero con SU primera foto (primer día honesto). */
export function iniciarReal(e: EstadoOnboarding): AppData | null {
  const p = e.perfil;
  if (!perfilCompleto(p)) return null;
  const plan = calcularPlan(p);
  const hoy = hoyISO();
  const r = e.resultado;
  const comidas: Comida[] = r ? [{ id: 'primera', hora: new Date().toTimeString().slice(0, 5), titulo: r.plato, nota: 'Tu primera foto', kcal: Math.round(r.kcalBase + r.extraAceite), proteina: Math.round(r.proteina), carbos: Math.round(r.carbos), grasas: Math.round(r.grasas), foto: r.demo ? '/fotos/bowl-garbanzos.jpg' : undefined, aceite: r.extraAceite || undefined }] : [];
  const d: AppData = {
    version: 3, demo: false, nombre: p.nombre ?? 'Tú', metaKcal: plan.kcal, metaProteina: plan.proteina,
    pesoInicial: p.peso, pesoMeta: p.meta ?? p.peso, pesos: [{ fecha: hoy, kg: p.peso }],
    kcalSemana: [0, 0, 0, 0, 0, 0, 0], proteinaDias: Array(7).fill(false), grasasSemana: Array(7).fill(0),
    racha: comidas.length ? 1 : 0, mejorRacha: comidas.length ? 1 : 0, escudos: 1, ultimoRegistro: comidas.length ? hoy : null,
    xp: e.xp ?? 0, registros: comidas.length, aceiteTotal: r?.extraAceite ?? 0, logros: [], comidasHoy: comidas, fecha: hoy, cofre: null, historial: comidas.length ? [hoy] : [], escudoDias: [],
  };
  const t = totalesHoy(d);
  d.kcalSemana[6] = t.kcal; d.proteinaDias[6] = t.proteina >= d.metaProteina; d.grasasSemana[6] = t.aceite;
  d.logros = LOGROS.filter((l) => { const x = l.progreso(d); return x.actual >= x.meta; }).map((l) => l.id);
  return d;
}

/** Datos guardados con fotos o nombres de versiones anteriores: se actualizan a las fotos vigentes (nunca queda una imagen rota). */
const FOTOS_VIEJAS: Record<string, { foto: string; titulo?: string }> = {
  '/fotos/desayuno.jpg': { foto: '/fotos/tostada-huevo.jpg', titulo: 'Tostada con huevo' },
  '/fotos/pollo.jpg': { foto: '/fotos/poke-pollo.jpg', titulo: 'Poke bowl de pollo' },
  '/fotos/ensalada-pollo.jpg': { foto: '/fotos/poke-pollo.jpg', titulo: 'Poke bowl de pollo' },
  '/fotos/ensalada.jpg': { foto: '/fotos/bowl-garbanzos.jpg' },
};
export function migrarFotos(d: AppData): AppData {
  if (!d.comidasHoy.some((c) => c.foto && FOTOS_VIEJAS[c.foto])) return d;
  return { ...d, comidasHoy: d.comidasHoy.map((c) => { const n = c.foto ? FOTOS_VIEJAS[c.foto] : undefined; return n ? { ...c, foto: n.foto, titulo: d.demo && n.titulo ? n.titulo : c.titulo } : c; }) };
}

export function leerApp(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as AppData;
      if (d.version === 3 && d.demo) {
        // Quedó guardada la vista de ejemplo pero la persona ya completó su recorrido: manda lo real.
        const real = iniciarReal(leerEstado());
        if (real) { guardarApp(real); return real; }
      }
      if (d.version === 3) return migrarFotos(pasarElTiempo(d));
    }
  } catch {
    /* sigue con datos nuevos */
  }
  const e = leerEstado();
  const d = iniciarReal(e) ?? semilla(e.perfil);
  guardarApp(d);
  return d;
}
export function guardarApp(d: AppData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* ignorar */
  }
}
export function borrarTodo() {
  try {
    ['ns_app_v3', 'ns_app_v2', 'ns_app_v1', 'ns_onb_v1'].forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch {
    /* ignorar */
  }
}

/** Si pasó de día: corre la semana y aplica la regla de la racha (escudo de 1 día, sin castigo). */
export function pasarElTiempo(d: AppData): AppData {
  const hoy = hoyISO();
  if (d.fecha === hoy) return d;
  const dias = Math.max(1, diasEntre(d.fecha, hoy));
  const n: AppData = {
    ...d, fecha: hoy, comidasHoy: [],
    kcalSemana: desplazar(d.kcalSemana, dias, 0), proteinaDias: desplazar(d.proteinaDias, dias, false), grasasSemana: desplazar(d.grasasSemana, dias, 0),
  };
  if (d.ultimoRegistro && d.racha > 0) {
    const faltan = diasEntre(d.ultimoRegistro, hoy) - 1; // días completos sin registrar
    if (faltan === 1 && d.escudos > 0) { n.escudos = d.escudos - 1; n.aviso = 'escudo'; n.escudoDias = [...d.escudoDias, haceDias(1)]; }
    else if (faltan >= 1) { n.racha = 0; n.aviso = 'pausa'; }
  }
  guardarApp(n);
  return n;
}

function recalcular(sig: AppData): AppData {
  const t = totalesHoy(sig);
  return { ...sig, kcalSemana: [...sig.kcalSemana.slice(0, 6), t.kcal], proteinaDias: [...sig.proteinaDias.slice(0, 6), t.proteina >= sig.metaProteina], grasasSemana: [...sig.grasasSemana.slice(0, 6), t.aceite] };
}
export function eliminarComida(d: AppData, id: string): AppData {
  return recalcular({ ...d, comidasHoy: d.comidasHoy.filter((c) => c.id !== id) });
}
export function restaurarComida(d: AppData, c: Comida): AppData {
  return recalcular({ ...d, comidasHoy: [...d.comidasHoy, c].sort((a, b) => a.hora.localeCompare(b.hora)) });
}
export function editarComida(d: AppData, id: string, cambios: { titulo: string; kcal: number }): AppData {
  return recalcular({ ...d, comidasHoy: d.comidasHoy.map((c) => (c.id === id ? { ...c, ...cambios } : c)) });
}
export function registrarPeso(d: AppData, kg: number): AppData {
  const hoy = hoyISO();
  const resto = d.pesos.filter((p) => p.fecha !== hoy);
  return { ...d, pesos: [...resto, { fecha: hoy, kg }] };
}

/** Agrega una comida y devuelve los HITOS reales que provocó (racha, nivel, logros) para celebrarlos. */
export function agregarComida(d: AppData, c: Omit<Comida, 'id' | 'hora'>): { data: AppData; hitos: Hito[]; rachaExtendida: boolean; rachaAnterior: number } {
  const hitos: Hito[] = [];
  let rachaExtendida = false;
  const ahora = new Date();
  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const hoy = hoyISO();
  let s: AppData = recalcular({ ...d, comidasHoy: [...d.comidasHoy, { ...c, id: `c${Date.now()}`, hora }], registros: d.registros + 1, aceiteTotal: d.aceiteTotal + (c.aceite ?? 0), xp: d.xp + 10 + (c.aceite ? 5 : 0), aviso: undefined });
  if (d.ultimoRegistro !== hoy) {
    const racha = d.racha > 0 ? d.racha + 1 : 1;
    rachaExtendida = true;
    s = { ...s, racha, mejorRacha: Math.max(s.mejorRacha, racha), ultimoRegistro: hoy, historial: s.historial.includes(hoy) ? s.historial : [...s.historial, hoy] };
    if ([3, 7, 14, 30, 60, 100].includes(racha)) hitos.push({ tipo: 'racha', titulo: `${racha} días seguidos`, detalle: 'Tu constancia ya es un hábito.' });
  }
  // Logros nuevos (cada uno paga XP una sola vez)
  for (const l of LOGROS) {
    if (s.logros.includes(l.id)) continue;
    const p = l.progreso(s);
    if (p.actual >= p.meta) {
      s = { ...s, logros: [...s.logros, l.id], xp: s.xp + l.xp };
      hitos.push({ tipo: 'logro', titulo: l.nombre, detalle: l.como, xp: l.xp });
    }
  }
  // Subida de nivel: premio tangible = escudo de racha (máx. 2)
  const antes = nivelDe(d.xp).actual.n;
  const despues = nivelDe(s.xp).actual;
  if (despues.n > antes) {
    s = { ...s, escudos: Math.min(2, s.escudos + 1) };
    hitos.push({ tipo: 'nivel', titulo: `Nivel ${despues.n} · ${despues.nombre}`, detalle: 'Ganaste un Escudo de racha.' });
  }
  return { data: s, hitos, rachaExtendida, rachaAnterior: d.racha };
}

/** Misiones del día (como las metas diarias de Duolingo): pequeñas, medibles y de comida. */
export function misiones(d: AppData) {
  const t = totalesHoy(d);
  return [
    { id: 'tres', titulo: 'Registra 3 comidas', actual: Math.min(3, d.comidasHoy.length), meta: 3, icono: 'cubiertos' as const },
    { id: 'proteina', titulo: 'Llega a tu meta de proteína', actual: Math.min(d.metaProteina, t.proteina), meta: d.metaProteina, icono: 'musculo' as const, unidad: 'g' },
    { id: 'chequeo', titulo: 'Atrapa grasa con el Chequeo', actual: t.aceite > 0 ? 1 : 0, meta: 1, icono: 'gota' as const },
  ];
}
export const XP_COFRE = 30;
export function cofreListo(d: AppData) {
  return misiones(d).every((m) => m.actual >= m.meta);
}
export function abrirCofre(d: AppData): { data: AppData; subioNivel: boolean } {
  const hoy = hoyISO();
  if (d.cofre === hoy || !cofreListo(d)) return { data: d, subioNivel: false };
  const antes = nivelDe(d.xp).actual.n;
  let s: AppData = { ...d, cofre: hoy, xp: d.xp + XP_COFRE };
  const subio = nivelDe(s.xp).actual.n > antes;
  if (subio) s = { ...s, escudos: Math.min(2, s.escudos + 1) };
  return { data: s, subioNivel: subio };
}
