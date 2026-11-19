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

/**
 * ¿La petición viene de esta misma app? Rechaza las que declaran venir de otro sitio (cabecera Origin distinta o
 * Sec-Fetch-Site «cross-site»). Sin ninguna de las dos cabeceras (herramientas de línea de comandos) no se bloquea:
 * el límite de intentos y los topes de la base de datos cubren ese caso.
 */
export function mismoOrigen(req: Request): boolean {
  const origen = req.headers.get('origin');
  if (origen) {
    try {
      return new URL(origen).host === req.headers.get('host');
    } catch {
      return false;
    }
  }
  const sitio = req.headers.get('sec-fetch-site');
  return !sitio || sitio === 'same-origin' || sitio === 'same-site' || sitio === 'none';
}
