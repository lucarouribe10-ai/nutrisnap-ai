'use client';

import { useEffect } from 'react';
import { track } from '@/lib/eventos';

/** Registra una vista (p. ej. la página de ventas) una sola vez por visita. No dibuja nada. */
export function Vista({ evento }: { evento: string }) {
  useEffect(() => { track(evento); }, [evento]);
  return null;
}
