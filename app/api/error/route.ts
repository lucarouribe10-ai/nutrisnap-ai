// Recibe errores de las pantallas (Error Boundary) y los guarda en error_log. Con límite de intentos para que no se use de spam.
import { z } from 'zod';
import { adminDisponible, createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ipDe, limitado, mismoOrigen } from '@/lib/servidor/limite';

const Cuerpo = z.object({
  mensaje: z.string().min(1).max(500),
  contexto: z.string().max(120).optional(),
  sid: z.string().max(64).optional(),
});

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return new Response(null, { status: 403 });
  if (limitado(`er:${ipDe(req)}`, 20, 60_000)) return new Response(null, { status: 429 });
  const crudo = await req.text();
  if (crudo.length > 3000) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(crudo); } catch { return new Response(null, { status: 400 }); }
  const p = Cuerpo.safeParse(json);
  if (!p.success) return new Response(null, { status: 400 });
  if (!adminDisponible()) return new Response(null, { status: 204 });

  let userId: string | null = null;
  try {
    const { data } = await (await createClient()).auth.getClaims();
    userId = (data?.claims?.sub as string | undefined) ?? null;
  } catch { /* anónimo */ }

  const agente = (req.headers.get('user-agent') ?? '').slice(0, 200) || null;
  const { error } = await createAdminClient().from('error_log').insert({ mensaje: p.data.mensaje, contexto: p.data.contexto ?? null, sid: p.data.sid ?? null, user_id: userId, agente });
  if (error) console.error('[error] no se pudo guardar:', error.code);
  return new Response(null, { status: 204 });
}
