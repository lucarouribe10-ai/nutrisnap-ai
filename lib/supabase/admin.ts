import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** ¿Está configurada la clave secreta? Sin ella, el servidor no puede escribir eventos/costos/usuarios (y no rompe nada). */
export function adminDisponible(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

/**
 * Cliente con la clave SECRETA: salta RLS. SOLO servidor (este módulo no puede importarse desde el navegador).
 * Úsalo únicamente tras verificar al administrador o en endpoints con validación y límite de intentos.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Clave secreta de Supabase no configurada');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
