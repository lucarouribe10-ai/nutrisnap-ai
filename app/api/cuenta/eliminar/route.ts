import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminDisponible, createAdminClient } from '@/lib/supabase/admin';

/**
 * Borra la cuenta de la persona con sesión y TODOS sus datos: perfil, progreso, comidas, pesos, permisos, autorización
 * (por cascada), y además sus registros de uso, errores y llamadas de IA. Solo se conservan los comprobantes de pago
 * (obligación contable), sin vínculo con la cuenta. No cancela una suscripción en Hotmart: eso se hace allí.
 */
export async function POST(req: NextRequest) {
  const origen = req.headers.get('origin');
  if (origen && origen !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403 });
  if (!adminDisponible()) return NextResponse.json({ ok: false, motivo: 'no_disponible' }, { status: 503 });
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const sub = data?.claims?.sub;
    if (!sub) return NextResponse.json({ ok: false }, { status: 401 });
    const adm = createAdminClient();
    // Estos tres quedan con el vínculo en NULL al borrar la cuenta; se eliminan para no conservar nada de la persona.
    for (const tabla of ['ai_calls', 'event_log', 'error_log'] as const) {
      const { error } = await adm.from(tabla).delete().eq('user_id', sub);
      if (error) { console.error('[cuenta] no se pudo limpiar', tabla, error.code); return NextResponse.json({ ok: false }, { status: 500 }); }
    }
    const { error: errBorrar } = await adm.auth.admin.deleteUser(sub);
    if (errBorrar) { console.error('[cuenta] deleteUser falló:', errBorrar.status); return NextResponse.json({ ok: false }, { status: 500 }); }
    await supabase.auth.signOut().catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[cuenta] error inesperado:', e instanceof Error ? e.message : 'desconocido');
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
