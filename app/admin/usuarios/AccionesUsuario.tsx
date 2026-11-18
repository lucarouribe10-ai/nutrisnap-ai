'use client';

import { useActionState } from 'react';
import { cambiarAcceso, type Resultado } from './acciones';

/** Botones de acceso de una persona. «Quitar» pide confirmación (es lo único que corta el acceso). */
export function AccionesUsuario({ id, tieneAcceso }: { id: string; tieneAcceso: boolean }) {
  const [estado, accion, pendiente] = useActionState<Resultado, FormData>(cambiarAcceso, null);
  const boton = 'flex min-h-11 items-center justify-center rounded-full px-4 text-[13px] font-semibold disabled:opacity-60';
  return (
    <div className="mt-3">
      <form action={accion} className="flex flex-wrap gap-2">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dias" value="30" />
        <button type="submit" name="accion" value={tieneAcceso ? 'extender' : 'dar'} disabled={pendiente} className={`${boton} bg-[var(--negro)] text-[var(--on-negro)]`}>{tieneAcceso ? 'Extender 30 días' : 'Dar acceso 30 días'}</button>
        {tieneAcceso && (
          <button type="submit" name="accion" value="quitar" disabled={pendiente} onClick={(e) => { if (!confirm('¿Quitar el acceso a esta persona? Dejará de poder usar la app completa.')) e.preventDefault(); }} className={`${boton} border border-[#A83D06]/40 text-[#A83D06]`}>Quitar acceso</button>
        )}
      </form>
      {estado && <p role={estado.ok ? 'status' : 'alert'} className={`mt-2 text-[13px] font-medium ${estado.ok ? 'text-[var(--accent)]' : 'text-[#A83D06]'}`}>{estado.mensaje}</p>}
    </div>
  );
}
