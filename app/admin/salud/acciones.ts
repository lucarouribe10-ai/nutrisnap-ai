'use server';

import { revalidatePath } from 'next/cache';
import { adminOrNull } from '@/lib/admin/guard';
import { createClient } from '@/lib/supabase/server';

export type ResultadoResolver = { ok: true; ids: number[] } | { ok: false; motivo: string };

/** Marca como resueltos todos los errores abiertos con ese mensaje y pantalla. Devuelve sus números para poder deshacerlo. Usa la sesión de la administradora (la base decide con RLS). */
export async function marcarResuelto(mensaje: string, contexto: string): Promise<ResultadoResolver> {
  if (!(await adminOrNull())) return { ok: false, motivo: 'Tu sesión ya no tiene permiso. Vuelve a entrar.' };
  const m = String(mensaje ?? '').slice(0, 500);
  const c = String(contexto ?? '').slice(0, 120);
  if (!m) return { ok: false, motivo: 'Falta el mensaje del error.' };
  const supabase = await createClient();
  let q = supabase.from('error_log').update({ resuelto: true }).eq('mensaje', m).eq('resuelto', false);
  q = c ? q.eq('contexto', c) : q.is('contexto', null);
  const { data, error } = await q.select('id');
  if (error) { console.error('[admin] marcar resuelto falló:', error.code); return { ok: false, motivo: 'No se pudo guardar. Inténtalo de nuevo.' }; }
  revalidatePath('/admin');
  revalidatePath('/admin/salud');
  return { ok: true, ids: (data ?? []).map((f) => Number(f.id)) };
}

/** Deshace «marcar como resuelto»: reabre exactamente los errores que se acababan de cerrar. */
export async function reabrir(ids: number[]): Promise<{ ok: boolean }> {
  if (!(await adminOrNull())) return { ok: false };
  const lista = (Array.isArray(ids) ? ids : []).filter((n) => Number.isInteger(n)).slice(0, 2000);
  if (lista.length === 0) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase.from('error_log').update({ resuelto: false }).in('id', lista);
  if (error) { console.error('[admin] reabrir falló:', error.code); return { ok: false }; }
  revalidatePath('/admin');
  revalidatePath('/admin/salud');
  return { ok: true };
}
