import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { VERSION_LEGAL } from '@/lib/legal';

/** Si la persona tiene sesión y aún no autorizó la versión vigente de los textos legales, la lleva a hacerlo. No dibuja nada. */
export async function PuertaLegal() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) return null; // sin sesión: el proxy ya decide (o es el modo de desarrollo sin login)
    const { data: c, error } = await supabase.from('consentimientos').select('id').eq('version', VERSION_LEGAL).maybeSingle();
    if (error) return null; // si la consulta falla no se bloquea a nadie por un error nuestro
    if (!c) redirect('/consentimiento');
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e;
  }
  return null;
}
