// Logros y premios (24/56). Todo es verificable con los datos de la app: nada se regala ni se inventa.
import type { AppData } from './app-store';

export type IconoLogro = 'flame' | 'drop' | 'flag' | 'star';
export interface Logro {
  id: string;
  nombre: string;
  /** Qué hay que hacer, en palabras simples. */
  como: string;
  xp: number;
  icono: IconoLogro;
  unidad: string;
  progreso: (d: AppData) => { actual: number; meta: number };
}

const camino = (d: AppData) => {
  const total = d.pesoInicial - d.pesoMeta;
  const hecho = d.pesoInicial - (d.pesos[d.pesos.length - 1]?.kg ?? d.pesoInicial);
  return total > 0 ? Math.max(0, Math.min(100, Math.round((hecho / total) * 100))) : 0;
};

export const LOGROS: Logro[] = [
  { id: 'primer_registro', nombre: 'Primer registro', como: 'Registra tu primera comida', xp: 10, icono: 'star', unidad: '', progreso: (d) => ({ actual: Math.min(1, d.registros), meta: 1 }) },
  { id: 'primer_hallazgo', nombre: 'Primer hallazgo', como: 'Atrapa grasa oculta con el Chequeo', xp: 20, icono: 'drop', unidad: '', progreso: (d) => ({ actual: d.aceiteTotal > 0 ? 1 : 0, meta: 1 }) },
  { id: 'racha_3', nombre: 'Racha de 3 días', como: 'Registra comidas 3 días seguidos', xp: 20, icono: 'flame', unidad: 'días', progreso: (d) => ({ actual: Math.min(3, d.mejorRacha), meta: 3 }) },
  { id: 'racha_7', nombre: 'Semana completa', como: 'Registra comidas 7 días seguidos', xp: 50, icono: 'flame', unidad: 'días', progreso: (d) => ({ actual: Math.min(7, d.mejorRacha), meta: 7 }) },
  { id: 'cazador_500', nombre: 'Cazador de grasas', como: 'Atrapa 500 kcal de grasas ocultas', xp: 40, icono: 'drop', unidad: 'kcal', progreso: (d) => ({ actual: Math.min(500, d.aceiteTotal), meta: 500 }) },
  { id: 'camino_25', nombre: '25% del camino', como: 'Avanza un cuarto hacia tu peso meta', xp: 40, icono: 'flag', unidad: '%', progreso: (d) => ({ actual: Math.min(25, camino(d)), meta: 25 }) },
  { id: 'racha_14', nombre: 'Dos semanas', como: 'Registra comidas 14 días seguidos', xp: 80, icono: 'flame', unidad: 'días', progreso: (d) => ({ actual: Math.min(14, d.mejorRacha), meta: 14 }) },
  { id: 'camino_50', nombre: '50% del camino', como: 'Llega a la mitad de tu peso meta', xp: 60, icono: 'flag', unidad: '%', progreso: (d) => ({ actual: Math.min(50, camino(d)), meta: 50 }) },
  { id: 'cazador_1000', nombre: 'Cazador de grasas II', como: 'Atrapa 1.000 kcal de grasas ocultas', xp: 80, icono: 'drop', unidad: 'kcal', progreso: (d) => ({ actual: Math.min(1000, d.aceiteTotal), meta: 1000 }) },
  { id: 'racha_30', nombre: 'Un mes seguido', como: 'Registra comidas 30 días seguidos', xp: 150, icono: 'flame', unidad: 'días', progreso: (d) => ({ actual: Math.min(30, d.mejorRacha), meta: 30 }) },
  { id: 'camino_75', nombre: '75% del camino', como: 'Llega a tres cuartos de tu peso meta', xp: 80, icono: 'flag', unidad: '%', progreso: (d) => ({ actual: Math.min(75, camino(d)), meta: 75 }) },
  { id: 'camino_100', nombre: 'Meta alcanzada', como: 'Llega a tu peso meta', xp: 150, icono: 'flag', unidad: '%', progreso: (d) => ({ actual: Math.min(100, camino(d)), meta: 100 }) },
];

export const REGLAS_XP = [
  { t: 'Registrar una comida', xp: '+10 XP' },
  { t: 'Responder el Chequeo y atrapar aceite', xp: '+5 XP' },
  { t: 'Cada logro que desbloqueas', xp: '+20 a +150 XP' },
];
export const QUE_DA_SUBIR = 'Al subir de nivel ganas un Escudo de racha (máximo 2) y un título nuevo.';
