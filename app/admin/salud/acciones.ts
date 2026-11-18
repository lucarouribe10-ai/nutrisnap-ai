'use server';

import { revalidatePath } from 'next/cache';
import { adminOrNull } from '@/lib/admin/guard';
import { createClient } from '@/lib/supabase/server';

/** Marca como resueltos todos los errores con ese mensaje y pantalla. Usa la sesión de la administradora (la base decide con RLS). */
export async function marcarResuelto(formData: FormData): Promise<void> {
  if (!(await adminOrNull())) return;
  const mensaje = String(formData.get('mensaje') ?? '').slice(0, 500);
  const contexto = String(formData.get('contexto') ?? '').slice(0, 120);
  if (!mensaje) return;
  const supabase = await createClient();
  let q = supabase.from('error_log').update({ resuelto: true }).eq('mensaje', mensaje).eq('resuelto', false);
  q = contexto ? q.eq('contexto', contexto) : q.is('contexto', null);
  const { error } = await q;
  if (error) console.error('[admin] marcar resuelto falló:', error.code);
  revalidatePath('/admin/salud');
  revalidatePath('/admin');
}
