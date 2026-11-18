'use client';

import { useActionState, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cambiarAcceso, type Resultado } from './acciones';

const base = 'flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-transform active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100';

/** Botones de acceso de una persona. «Quitar» pide una confirmación propia en la misma tarjeta (es lo único que corta el acceso). */
export function AccionesUsuario({ id, tieneAcceso }: { id: string; tieneAcceso: boolean }) {
  const [estado, accion, pendiente] = useActionState<Resultado, FormData>(async (prev, datos) => {
    const r = await cambiarAcceso(prev, datos);
    setConfirmando(false);
    return r;
  }, null);
  const [confirmando, setConfirmando] = useState(false);
  return (
    <div className="mt-3">
      <form action={accion} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dias" value="30" />
        {!confirmando ? (
          <>
            <button type="submit" name="accion" value={tieneAcceso ? 'extender' : 'dar'} disabled={pendiente} className={`${base} border-2 border-[var(--negro)] text-[var(--text-primary)]`}>
              {pendiente && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{tieneAcceso ? 'Extender 30 días' : 'Dar acceso 30 días'}
            </button>
            {tieneAcceso && <button type="button" onClick={() => setConfirmando(true)} className={`${base} border border-[#A83D06]/40 text-[#A83D06]`}>Quitar acceso</button>}
          </>
        ) : (
          <>
            <span className="text-[13px] font-semibold">¿Quitar el acceso a esta persona?</span>
            <button type="submit" name="accion" value="quitar" disabled={pendiente} className={`${base} bg-[#A83D06] text-white`}>{pendiente && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}Sí, quitar</button>
            <button type="button" onClick={() => setConfirmando(false)} className={`${base} border border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)]`}>Cancelar</button>
          </>
        )}
      </form>
      {estado && <p role={estado.ok ? 'status' : 'alert'} className={`mt-2 text-[13px] font-medium ${estado.ok ? 'text-[var(--accent)]' : 'text-[#A83D06]'}`}>{estado.mensaje}</p>}
    </div>
  );
}
