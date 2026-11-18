/** Solo se permite volver a rutas internas de la app o del panel (evita redirecciones abiertas a otros sitios). */
export function destinoSeguro(next: string | null | undefined): string {
  if (!next) return '/app';
  if (!/^\/(app|admin)(\/[A-Za-z0-9\-_/]*)?$/.test(next)) return '/app';
  return next;
}
