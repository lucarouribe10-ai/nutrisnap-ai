'use client';
// Guarda y lee los datos de la app en la cuenta de la persona (tabla app_state, protegida con RLS).
// Si no hay sesión o falla la red, la app sigue funcionando con lo guardado en el navegador.
import { createClient } from '@/lib/supabase/client';
import type { AppData } from './app-store';

let userId: string | null = null;
async function uid(): Promise<string | null> {
  if (userId) return userId;
  try {
    const { data } = await createClient().auth.getClaims();
    userId = data?.claims?.sub ?? null;
  } catch {
    userId = null;
  }
  return userId;
}

export async function cargarDeNube(): Promise<AppData | null> {
  const id = await uid();
  if (!id) return null;
  try {
    const { data, error } = await createClient().from('app_state').select('data').eq('user_id', id).maybeSingle();
    if (error || !data) return null;
    const d = data.data as Partial<AppData> | null;
    return d && d.version === 3 && typeof d.nombre === 'string' && Array.isArray(d.comidasHoy) ? (d as AppData) : null;
  } catch {
    return null;
  }
}

let pendiente: AppData | null = null;
let temporizador: ReturnType<typeof setTimeout> | null = null;

async function subirAhora() {
  const d = pendiente;
  pendiente = null;
  if (temporizador) { clearTimeout(temporizador); temporizador = null; }
  if (!d) return;
  const id = await uid();
  if (!id) return;
  try {
    await createClient().from('app_state').upsert({ user_id: id, version: 3, data: d }, { onConflict: 'user_id' });
  } catch {
    /* sin red: queda en el navegador y se vuelve a subir en el próximo cambio */
  }
}

/** Sube los datos con una pequeña espera para no enviar cada toque. Los datos de ejemplo (demo) NUNCA se suben. */
export function subirANube(d: AppData) {
  if (d.demo) return;
  pendiente = d;
  if (temporizador) clearTimeout(temporizador);
  temporizador = setTimeout(() => void subirAhora(), 700);
}

/** Envía de inmediato lo pendiente (al cambiar de pestaña o cerrar). */
export function subirPendiente() {
  if (pendiente) void subirAhora();
}
