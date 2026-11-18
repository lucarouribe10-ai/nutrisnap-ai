import 'server-only';

// Límite de intentos por clave en memoria (mejor esfuerzo: en Vercel cada instancia lleva su cuenta).
// Para topes de dinero (IA) el límite real vive en la base de datos.
const cubos = new Map<string, { n: number; t: number }>();

export function limitado(clave: string, max: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  if (cubos.size > 5000) for (const [k, v] of cubos) if (ahora - v.t > ventanaMs) cubos.delete(k);
  const e = cubos.get(clave);
  if (!e || ahora - e.t > ventanaMs) {
    cubos.set(clave, { n: 1, t: ahora });
    return false;
  }
  e.n += 1;
  return e.n > max;
}

export function ipDe(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
}
