'use client';
import type { Perfil } from './plan';

export interface ResultadoFoto {
  plato: string;
  kcalBase: number; // sin lo que la cámara no ve
  proteina: number;
  carbos: number;
  grasas: number;
  extraAceite: number; // kcal agregadas por el chequeo (0 si "Nada")
  demo: boolean;
  miniatura?: string; // foto reducida (≈112 px) o ruta de la foto de ejemplo; la foto original nunca se guarda
}
export interface EstadoOnboarding {
  perfil: Perfil;
  resultado?: ResultadoFoto;
  xp: number;
}
const KEY = 'ns_onb_v1';

export function leerEstado(): EstadoOnboarding {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as EstadoOnboarding;
  } catch {
    /* ignorar */
  }
  return { perfil: {}, xp: 0 };
}
export function guardarEstado(e: EstadoOnboarding) {
  try {
    localStorage.setItem(KEY, JSON.stringify(e));
  } catch {
    /* ignorar */
  }
}
