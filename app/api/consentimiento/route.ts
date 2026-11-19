import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FINALIDADES, VERSION_LEGAL } from '@/lib/legal';

/** Registra la autorización de la persona con sesión (la base solo deja escribir la propia fila). */
export async function POST(req: NextRequest) {
  const origen = req.headers.get('origin');
  if (origen && origen !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403 });
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const sub = data?.claims?.sub;
    if (!sub) return NextResponse.json({ ok: false }, { status: 401 });
    const { error } = await supabase.from('consentimientos').upsert(
      { user_id: sub, version: VERSION_LEGAL, finalidades: FINALIDADES, locale: 'es-CO' },
      { onConflict: 'user_id,version', ignoreDuplicates: true },
    );
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
