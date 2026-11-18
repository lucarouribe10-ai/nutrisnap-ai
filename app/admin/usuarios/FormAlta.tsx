'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Loader2, UserPlus, X } from 'lucide-react';
import { altaManual, type Resultado } from './acciones';

const campo = 'mt-1 h-12 w-full rounded-[16px] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]';

/** La acción principal de la pantalla: un botón negro; al tocarlo se despliega el formulario (así la lista no queda debajo del pliegue). */
export function FormAlta() {
  const formRef = useRef<HTMLFormElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState<Resultado>(null);
  const [, accion, pendiente] = useActionState<Resultado, FormData>(async (prev, datos) => {
    const r = await altaManual(prev, datos);
    setAviso(r);
    if (r?.ok) { formRef.current?.reset(); setAbierto(false); }
    return r;
  }, null);

  useEffect(() => {
    if (!aviso?.ok) return;
    const t = setTimeout(() => setAviso(null), 9000);
    return () => clearTimeout(t);
  }, [aviso]);

  return (
    <div>
      {!abierto && (
        <button type="button" onClick={() => { setAviso(null); setAbierto(true); }} className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] px-6 text-[15px] font-semibold text-[var(--on-negro)] transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100">
          <UserPlus size={18} aria-hidden="true" /> Agregar a una persona
        </button>
      )}
      {aviso && !abierto && <p role={aviso.ok ? 'status' : 'alert'} className={`mt-3 animate-[aparece_.3s_ease-out] motion-reduce:animate-none rounded-[16px] p-3 text-[14px] font-medium ${aviso.ok ? 'bg-[var(--lima)] text-[var(--text-primary)]' : 'bg-[var(--durazno)] text-[#8A3A06]'}`}>{aviso.mensaje}</p>}
      {abierto && (
        <form ref={formRef} action={accion} className="hairline-card rounded-[var(--radius-card)] p-4" aria-label="Agregar una persona">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold [font-family:var(--font-display)]">Agregar a una persona</h2>
              <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Para cuando a alguien no le llega el acceso. Solo necesitas su correo y su nombre.</p>
            </div>
            <button type="button" aria-label="Cerrar" onClick={() => { setAbierto(false); setAviso(null); }} className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"><X size={20} aria-hidden="true" /></button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Correo</span><input name="email" type="email" required autoFocus autoComplete="off" inputMode="email" placeholder="persona@correo.com" className={campo} /></label>
            <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Nombre</span><input name="nombre" required maxLength={40} autoComplete="off" placeholder="Nombre" className={campo} /></label>
            <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Días de acceso</span><input name="dias" type="number" min={1} max={365} defaultValue={30} required inputMode="numeric" className={campo} /></label>
            <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Motivo (opcional)</span><input name="motivo" maxLength={200} autoComplete="off" placeholder="Ej: no le llegó el correo de Hotmart" className={campo} /></label>
          </div>
          {aviso && !aviso.ok && <p role="alert" className="mt-3 rounded-[16px] bg-[var(--durazno)] p-3 text-[14px] font-medium text-[#8A3A06]">{aviso.mensaje}</p>}
          <button type="submit" disabled={pendiente} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] text-[16px] font-semibold text-[var(--on-negro)] transition-transform active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto sm:px-8">
            {pendiente ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Guardando…</> : 'Agregar y dar acceso'}
          </button>
        </form>
      )}
    </div>
  );
}
