// BFF de la primera foto (30): la clave de IA vive SOLO en el servidor (ANTHROPIC_API_KEY).
// Sin clave configurada devuelve un resultado de DEMO marcado demo:true (nunca se hace pasar por real).
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { adminDisponible, createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { VENTA_ACTIVA } from '@/lib/hotmart';
import { accesoVigente } from '@/lib/hotmart-eventos';


const Salida = z.object({
  plato: z.string().min(1).transform((t) => (t.length > 80 ? `${t.slice(0, 77).trimEnd()}…` : t)),
  kcal: z.number().min(0).max(3000),
  proteina_g: z.number().min(0).max(300),
  carbos_g: z.number().min(0).max(500),
  grasas_g: z.number().min(0).max(300),
  pregunta_aceite: z.object({ texto: z.string().max(120), una_cucharada_kcal: z.number().min(40).max(200) }),
});

const DEMO = {
  demo: true as const,
  plato: 'Bowl de garbanzos',
  kcal: 440,
  proteina_g: 38,
  carbos_g: 41,
  grasas_g: 14,
  pregunta_aceite: { texto: '¿Cuánto aceite llevó?', una_cucharada_kcal: 120 },
};

// Límite simple en memoria por IP (el límite real vive en la base de datos — Sesión 6).
const intentos = new Map<string, { n: number; t: number }>();
function limitado(ip: string) {
  const ahora = Date.now();
  const e = intentos.get(ip);
  if (!e || ahora - e.t > 10 * 60_000) {
    intentos.set(ip, { n: 1, t: ahora });
    return false;
  }
  e.n += 1;
  return e.n > 8;
}

type Quien = { userId: string | null; ipHash: string };

/** Quién llama: la cuenta (si hay sesión) o una huella de la IP (nunca se guarda la IP). */
async function identidad(req: Request): Promise<Quien> {
  let userId: string | null = null;
  try {
    const { data } = await (await createClient()).auth.getClaims();
    userId = (data?.claims?.sub as string | undefined) ?? null;
  } catch { /* anónimo (vista previa del recorrido) */ }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const ipHash = createHash('sha256').update(`${process.env.IP_SALT ?? 'nutrisnap'}:${ip}`).digest('hex').slice(0, 32);
  return { userId, ipHash };
}

/**
 * Topes que protegen el dinero, contados en la base (no en memoria): por cuenta (8 fotos/día), por visitante anónimo (3/día),
 * y topes globales del día (llamadas y USD). Si no se puede contar, se bloquea (falla CERRADO): mejor una demo que una factura sorpresa.
 */
async function superaCupo(q: Quien): Promise<null | 'usuario' | 'anonimo' | 'global'> {
  if (!adminDisponible()) return 'global';
  try {
    const adm = createAdminClient();
    const desde = new Date(Date.now() - 86_400_000).toISOString();
    const topeLlamadas = Number(process.env.AI_TOPE_DIARIO_LLAMADAS ?? 300);
    const topeUsd = Number(process.env.AI_TOPE_DIARIO_USD ?? 5);
    const limiteUsuario = Number(process.env.AI_LIMITE_USUARIO_DIA ?? 8);
    const limiteAnonimo = Number(process.env.AI_LIMITE_ANONIMO_DIA ?? 3);
    const base = () => adm.from('ai_calls').select('id', { count: 'exact', head: true }).eq('demo', false).gte('created_at', desde);
    const propio = q.userId ? base().eq('user_id', q.userId) : base().is('user_id', null).eq('ip_hash', q.ipHash);
    const [glob, mio, costos] = await Promise.all([
      base(),
      propio,
      adm.from('ai_calls').select('costo_usd').eq('demo', false).gte('created_at', desde).not('costo_usd', 'is', null).limit(5000),
    ]);
    if (glob.error || mio.error || costos.error) return 'global';
    if ((glob.count ?? 0) >= topeLlamadas) return 'global';
    const gastoUsd = (costos.data ?? []).reduce((t, c) => t + Number(c.costo_usd), 0);
    if (topeUsd > 0 && gastoUsd >= topeUsd) return 'global';
    if (q.userId && (mio.count ?? 0) >= limiteUsuario) return 'usuario';
    if (!q.userId && (mio.count ?? 0) >= limiteAnonimo) return 'anonimo';
    return null;
  } catch {
    return 'global';
  }
}

/** Guarda cada llamada a la IA con su costo real (ai_calls). Nunca rompe la respuesta: si no se puede guardar, solo se avisa en el registro. */
async function registrarLlamada(q: Quien, f: { ok: boolean; demo?: boolean; modelo?: string; entrada?: number; salida?: number; ms?: number; error?: string }) {
  if (!adminDisponible()) return;
  try {
    // Precios por millón de tokens, en USD, configurables en el servidor. Sin precio → costo null ("Sin datos" en el panel), nunca inventado.
    const pIn = Number(process.env.AI_PRICE_IN_USD_PER_MTOK);
    const pOut = Number(process.env.AI_PRICE_OUT_USD_PER_MTOK);
    const costo = f.entrada !== undefined && f.salida !== undefined && pIn > 0 && pOut > 0 ? (f.entrada * pIn + f.salida * pOut) / 1_000_000 : null;
    const { error } = await createAdminClient().from('ai_calls').insert({ user_id: q.userId, ip_hash: q.userId ? null : q.ipHash, feature: 'analisis_foto', modelo: f.modelo ?? null, tokens_entrada: f.entrada ?? null, tokens_salida: f.salida ?? null, costo_usd: costo, duracion_ms: f.ms ?? null, ok: f.ok, demo: f.demo ?? false, error: f.error ?? null });
    if (error) console.error('[analizar] no se pudo registrar la llamada:', error.code);
  } catch (e) {
    console.error('[analizar] registro de llamada falló:', e instanceof Error ? e.name : 'desconocido');
  }
}

const PROMPT = `Eres un nutricionista que estima calorías desde una foto de comida. Conoces muy bien la cocina colombiana y latinoamericana (arepa de maíz con carne, huevo o queso; bandeja paisa; ajiaco; sancocho; empanadas; patacones; pandebono; changua; arroz con pollo; frijoles; plátano maduro; chicharrón; buñuelos; etc.) y también comida casera.
Responde SOLO con JSON válido, sin texto extra, con esta forma exacta:
{"plato":"nombre corto en español, máximo 60 caracteres; si hay varios platos, resúmelos","kcal":número,"proteina_g":número,"carbos_g":número,"grasas_g":número,"pregunta_aceite":{"texto":"pregunta corta sobre el aceite o grasa que no se ve","una_cucharada_kcal":120}}
Reglas:
- Identifica el plato por lo que realmente se ve; no lo cambies por uno parecido de otra cocina (una arepa NO es una hamburguesa ni pan árabe).
- Estima el tamaño de las porciones por la foto (tamaño del plato, cubiertos, manos). Si la foto muestra varias porciones o platos, suma todo lo visible.
- Estima SOLO lo que se ve y la preparación visible; NO sumes aceite ni aderezos invisibles: el usuario los agrega después con el Chequeo de Grasas Ocultas. Son estimaciones.
- La pregunta del aceite debe ser específica a lo que se ve: si hay fritura o carne frita, pregunta por el aceite de freír; si hay tocino, por la grasa que soltó; si hay ensalada, por el aderezo; si hay arroz o guiso, por el aceite del sofrito. Una sola pregunta, máximo 100 caracteres.
- "una_cucharada_kcal" es lo que suma 1 cucharada de ese aceite o grasa (entre 40 y 200; el aceite vegetal es 120).
- Si el usuario dejó una nota sobre el plato, úsala (hecho en casa, cantidad de personas, ingredientes) y tenla por más confiable que tu suposición.
Si la imagen no es comida, responde {"plato":"No veo comida","kcal":0,"proteina_g":0,"carbos_g":0,"grasas_g":0,"pregunta_aceite":{"texto":"","una_cucharada_kcal":120}}.`;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limitado(ip)) return NextResponse.json({ error: 'demasiados_intentos' }, { status: 429 });

  // Solo desde esta misma app (otro sitio no puede usar tu IA desde el navegador de alguien).
  const origen = req.headers.get('origin');
  if (origen) {
    try {
      if (new URL(origen).host !== req.headers.get('host')) return NextResponse.json({ error: 'origen_no_permitido' }, { status: 403 });
    } catch {
      return NextResponse.json({ error: 'origen_no_permitido' }, { status: 403 });
    }
  }
  const crudo = await req.text();
  if (crudo.length > 3_600_000) return NextResponse.json({ error: 'imagen_invalida' }, { status: 413 });
  let body: { imagen?: string; demo?: boolean; nota?: string };
  try {
    body = JSON.parse(crudo);
  } catch {
    return NextResponse.json({ error: 'solicitud_invalida' }, { status: 400 });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (body.demo || !key) return NextResponse.json(DEMO);

  const nota = typeof body.nota === 'string' ? body.nota.replace(/[\r\n]+/g, ' ').trim().slice(0, 200) : '';
  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(body.imagen ?? '');
  if (!m || m[2].length > 2_500_000) return NextResponse.json({ error: 'imagen_invalida' }, { status: 400 });

  const quien = await identidad(req);
  // Con la venta encendida, la foto con IA es del plan de pago: se verifica EN EL SERVIDOR (nunca solo escondiendo botones).
  if (VENTA_ACTIVA && quien.userId) {
    const { data: permiso } = await createAdminClient().from('entitlements').select('plan,estado,renueva_el').eq('user_id', quien.userId).maybeSingle();
    if (!accesoVigente(permiso)) return NextResponse.json({ error: 'plan_requerido' }, { status: 402 });
  }
  const tope = await superaCupo(quien);
  if (tope === 'usuario') return NextResponse.json({ error: 'limite_diario' }, { status: 429 });
  if (tope !== null) return NextResponse.json({ ...DEMO, limite: true }); // visitante o tope global: resultado de ejemplo, honesto (demo:true)

  const t0 = Date.now();
  const modelo = process.env.AI_MODEL ?? 'claude-haiku-5-5';
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: modelo,
        max_tokens: 1024,
        thinking: { type: 'disabled' },
        messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } }, { type: 'text', text: nota ? `${PROMPT}\n\nNota del usuario sobre este plato: ${nota}` : PROMPT }] }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) {
      // Diagnóstico seguro: solo código y tipo de error del proveedor (nunca la clave ni la imagen).
      const cuerpo = await r.text().catch(() => '');
      console.error('[analizar] proveedor IA respondió', r.status, cuerpo.slice(0, 200));
      await registrarLlamada(quien, { ok: false, modelo, ms: Date.now() - t0, error: `proveedor_${r.status}` });
      return NextResponse.json({ error: 'ia_no_disponible' }, { status: 502 });
    }
    const data = (await r.json()) as { content?: { type: string; text?: string }[]; stop_reason?: string; usage?: { input_tokens?: number; output_tokens?: number } };
    const uso = { entrada: data.usage?.input_tokens, salida: data.usage?.output_tokens, modelo, ms: Date.now() - t0 };
    const texto = data.content?.find((c) => c.type === 'text')?.text ?? '';
    let json: unknown;
    try {
      json = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1));
    } catch {
      console.error('[analizar] la IA no devolvió JSON válido. motivo:', data.stop_reason, 'bloques:', (data.content ?? []).map((c) => c.type).join(','), 'tokens salida:', data.usage?.output_tokens, 'texto:', texto.slice(0, 120).replace(/\s+/g, ' '));
      await registrarLlamada(quien, { ok: false, error: 'json_invalido', ...uso });
      return NextResponse.json({ error: 'respuesta_invalida' }, { status: 502 });
    }
    const ok = Salida.safeParse(json);
    if (!ok.success) {
      console.error('[analizar] la respuesta no cumple el formato:', JSON.stringify(ok.error.issues.slice(0, 2)).slice(0, 200));
      await registrarLlamada(quien, { ok: false, error: 'formato_invalido', ...uso });
      return NextResponse.json({ error: 'respuesta_invalida' }, { status: 502 });
    }
    await registrarLlamada(quien, { ok: true, ...uso });
    return NextResponse.json({ demo: false, ...ok.data });
  } catch (e) {
    console.error('[analizar] fallo al llamar a la IA:', e instanceof Error ? e.name + ' ' + e.message.slice(0, 120) : 'desconocido');
    await registrarLlamada(quien, { ok: false, modelo, ms: Date.now() - t0, error: 'sin_respuesta' });
    return NextResponse.json({ error: 'ia_no_disponible' }, { status: 502 });
  }
}
