// Recibe los eventos de uso del navegador (contrato 36/60) y los guarda en event_log con la clave secreta.
// Anónimo por diseño: sesión aleatoria, sin correo ni datos personales. Sesiones QA descartadas. Sin clave secreta → se ignora en silencio.
import { z } from 'zod';
import { adminDisponible, createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ipDe, limitado, mismoOrigen } from '@/lib/servidor/limite';

const Cuerpo = z.object({
  tipo: z.string().regex(/^[a-z][a-z0-9_]{2,59}$/),
  sid: z.string().max(64).optional(),
  qa: z.boolean().optional(),
  props: z.record(z.string().max(40), z.union([z.string().max(120), z.number(), z.boolean()])).optional(),
});

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return new Response(null, { status: 403 });
  if (limitado(`ev:${ipDe(req)}`, 120, 60_000)) return new Response(null, { status: 429 });
  const crudo = await req.text();
  if (crudo.length > 4000) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(crudo); } catch { return new Response(null, { status: 400 }); }
  const p = Cuerpo.safeParse(json);
  if (!p.success) return new Response(null, { status: 400 });
  if (p.data.qa || !adminDisponible()) return new Response(null, { status: 204 });

  let userId: string | null = null;
  try {
    const { data } = await (await createClient()).auth.getClaims();
    userId = (data?.claims?.sub as string | undefined) ?? null;
  } catch { /* anónimo */ }

  const props = Object.fromEntries(Object.entries(p.data.props ?? {}).slice(0, 20));
  const { error } = await createAdminClient().from('event_log').insert({ tipo: p.data.tipo, sid: p.data.sid ?? null, user_id: userId, props, origen: 'web' });
  if (error) console.error('[evento] no se pudo guardar:', error.code);
  return new Response(null, { status: 204 });
}
