// BFF de la primera foto (30): la clave de IA vive SOLO en el servidor (ANTHROPIC_API_KEY).
// Sin clave configurada devuelve un resultado de DEMO marcado demo:true (nunca se hace pasar por real).
import { NextResponse } from 'next/server';
import { z } from 'zod';


const Salida = z.object({
  plato: z.string().min(1).max(80),
  kcal: z.number().min(0).max(3000),
  proteina_g: z.number().min(0).max(300),
  carbos_g: z.number().min(0).max(500),
  grasas_g: z.number().min(0).max(300),
  pregunta_aceite: z.object({ texto: z.string().max(120), una_cucharada_kcal: z.number().min(40).max(200) }),
});

const DEMO = {
  demo: true as const,
  plato: 'Ensalada fresca',
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

const PROMPT = `Eres un nutricionista que estima calorías desde una foto de comida (cocina latinoamericana incluida).
Responde SOLO con JSON válido, sin texto extra, con esta forma exacta:
{"plato":"nombre corto en español","kcal":número,"proteina_g":número,"carbos_g":número,"grasas_g":número,"pregunta_aceite":{"texto":"¿Cuánto aceite o aderezo llevó?","una_cucharada_kcal":120}}
Estima SOLO lo que se ve, sin sumar aceite ni aderezos invisibles (el usuario los agrega después). Son estimaciones.
Si la imagen no es comida, responde {"plato":"No veo comida","kcal":0,"proteina_g":0,"carbos_g":0,"grasas_g":0,"pregunta_aceite":{"texto":"","una_cucharada_kcal":120}}.`;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limitado(ip)) return NextResponse.json({ error: 'demasiados_intentos' }, { status: 429 });

  let body: { imagen?: string; demo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'solicitud_invalida' }, { status: 400 });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (body.demo || !key) return NextResponse.json(DEMO);

  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(body.imagen ?? '');
  if (!m || m[2].length > 2_500_000) return NextResponse.json({ error: 'imagen_invalida' }, { status: 400 });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? 'claude-haiku-5-5',
        max_tokens: 500,
        messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } }, { type: 'text', text: PROMPT }] }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) return NextResponse.json({ error: 'ia_no_disponible' }, { status: 502 });
    const data = (await r.json()) as { content?: { type: string; text?: string }[] };
    const texto = data.content?.find((c) => c.type === 'text')?.text ?? '';
    const json = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1));
    const ok = Salida.safeParse(json);
    if (!ok.success) return NextResponse.json({ error: 'respuesta_invalida' }, { status: 502 });
    return NextResponse.json({ demo: false, ...ok.data });
  } catch {
    return NextResponse.json({ error: 'ia_no_disponible' }, { status: 502 });
  }
}
