'use client';
import { sesionAnonima } from './eventos';

/** Manda un error de pantalla al servidor (error_log). Nunca lanza: reportar no debe causar otro error. */
export function reportarError(mensaje: string, contexto: string) {
  try {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    const cuerpo = JSON.stringify({ mensaje: mensaje.slice(0, 500) || 'Error sin mensaje', contexto: contexto.slice(0, 120), sid: sesionAnonima() });
    void fetch('/api/error', { method: 'POST', body: cuerpo, headers: { 'content-type': 'application/json' }, keepalive: true });
  } catch {
    /* sin red: se ignora */
  }
}
