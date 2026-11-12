'use client';
// Datos de la app interna (vista previa SIN servidor): se guardan en el navegador.
// Con datos de ejemplo realistas del mundo de Mateo (32: la app nunca se enseña vacía).
import { calcularPlan, perfilCompleto, type Perfil } from './plan';
import { leerEstado } from './onboarding-store';

export interface Comida {
  id: string;
  hora: string; // HH:MM
  titulo: string;
  nota?: string;
  kcal: number;
  proteina: number;
  carbos: number;
  grasas: number;
  foto?: string; // miniatura (data URL o ruta)
  aceite?: number; // kcal atrapadas por el Chequeo
}
export interface AppData {
  version: 1;
  demo: boolean;
  nombre: string;
  metaKcal: number;
  metaProteina: number;
  pesoInicial: number;
  pesoMeta: number;
  pesos: { semana: number; kg: number }[]; // semana 0 = hace 8 semanas
  kcalSemana: number[]; // últimos 7 días (hoy al final se calcula con las comidas)
  proteinaDias: boolean[]; // últimos 7 días: ¿llegó a su meta?
  grasasSemana: number[]; // kcal atrapadas por día (7)
  racha: number;
  xp: number;
  comidasHoy: Comida[];
  fecha: string; // YYYY-MM-DD de las comidas de hoy
}
const KEY = 'ns_app_v1';
const hoyISO = () => new Date().toISOString().slice(0, 10);

export function semilla(perfil?: Perfil): AppData {
  const plan = perfil && perfilCompleto(perfil) ? calcularPlan(perfil) : null;
  const peso = perfil?.peso ?? 79.4;
  const meta = perfil?.meta ?? 76;
  return {
    version: 1,
    demo: true,
    nombre: perfil?.nombre ?? 'Mateo',
    metaKcal: plan?.kcal ?? 2480,
    metaProteina: plan?.proteina ?? 164,
    pesoInicial: Math.round((peso + 2.6) * 10) / 10,
    pesoMeta: meta,
    pesos: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ semana: s, kg: Math.round((peso + 2.6 - (2.6 / 8) * s + (s % 2 === 0 ? 0.15 : -0.1)) * 10) / 10 })).map((p, i, a) => (i === a.length - 1 ? { ...p, kg: peso } : p)),
    kcalSemana: [2410, 2520, 2380, 2610, 2450, 2490, 0],
    proteinaDias: [true, true, false, true, true, false, false],
    grasasSemana: [120, 90, 0, 140, 110, 100, 0],
    racha: 12,
    xp: 340,
    fecha: hoyISO(),
    comidasHoy: [
      { id: 's1', hora: '08:10', titulo: 'Avena con huevos', nota: 'Foto · segundos', kcal: 520, proteina: 28, carbos: 58, grasas: 18, foto: '/fotos/desayuno.jpg' },
      { id: 's2', hora: '13:05', titulo: 'Pollo con arroz y frijoles', nota: 'Foto + voz', kcal: 640, proteina: 52, carbos: 62, grasas: 18, foto: '/fotos/pollo.jpg', aceite: 120 },
      { id: 's3', hora: '16:30', titulo: 'Batido de proteína', nota: 'Escáner de código', kcal: 210, proteina: 30, carbos: 12, grasas: 4, foto: '/fotos/batido.jpg' },
    ],
  };
}

export function leerApp(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as AppData;
      if (d.fecha !== hoyISO()) return { ...d, fecha: hoyISO(), comidasHoy: [] , proteinaDias: [...d.proteinaDias.slice(1), false], grasasSemana: [...d.grasasSemana.slice(1), 0], kcalSemana: [...d.kcalSemana.slice(1), 0] };
      return d;
    }
  } catch {
    /* ignorar */
  }
  const d = semilla(leerEstado().perfil);
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
    ['ns_app_v1', 'ns_onb_v1'].forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch {
    /* ignorar */
  }
}

export function totalesHoy(d: AppData) {
  return d.comidasHoy.reduce((t, c) => ({ kcal: t.kcal + c.kcal, proteina: t.proteina + c.proteina, carbos: t.carbos + c.carbos, grasas: t.grasas + c.grasas, aceite: t.aceite + (c.aceite ?? 0) }), { kcal: 0, proteina: 0, carbos: 0, grasas: 0, aceite: 0 });
}

export function agregarComida(d: AppData, c: Omit<Comida, 'id' | 'hora'>): AppData {
  const ahora = new Date();
  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const nueva: Comida = { ...c, id: `c${Date.now()}`, hora };
  const sig: AppData = { ...d, comidasHoy: [...d.comidasHoy, nueva], xp: d.xp + 10 + (c.aceite ? 5 : 0) };
  const t = totalesHoy(sig);
  sig.kcalSemana = [...sig.kcalSemana.slice(0, 6), t.kcal];
  sig.proteinaDias = [...sig.proteinaDias.slice(0, 6), t.proteina >= sig.metaProteina];
  sig.grasasSemana = [...sig.grasasSemana.slice(0, 6), t.aceite];
  return sig;
}

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
