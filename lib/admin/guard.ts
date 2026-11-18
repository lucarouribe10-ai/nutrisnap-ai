import 'server-only';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Entrada del panel: SOLO administradores, verificado en el servidor (sesión firmada + lista `admins` vía RLS).
 * Cualquier otro caso (sin sesión, sin permiso, error) responde 404: no se revela que el panel existe.
 */
export async function requireAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const sub = data?.claims?.sub;
    if (error || !sub) { console.warn('[admin] 404: sin sesión válida en el servidor'); notFound(); }
    const { data: esAdmin, error: err2 } = await supabase.rpc('es_admin');
    if (err2) console.warn('[admin] 404: la consulta es_admin falló:', err2.code ?? err2.message);
    else if (esAdmin !== true) console.warn('[admin] 404: la cuenta no es administradora');
    if (err2 || esAdmin !== true) notFound();
    return { id: sub as string, email: (data?.claims as { email?: string } | undefined)?.email ?? null, supabase };
  } catch (e) {
    // notFound() lanza una señal propia de Next: se deja pasar; cualquier otro fallo también termina en 404.
    if (e && typeof e === 'object' && 'digest' in e) throw e;
    notFound();
  }
}
