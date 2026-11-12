// Vibración corta en momentos de premio (solo si el dispositivo la tiene y la persona no pidió menos movimiento).
export function vibrar(patron: number | number[] = 12) {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    navigator.vibrate?.(patron);
  } catch {
    /* sin vibración */
  }
}
