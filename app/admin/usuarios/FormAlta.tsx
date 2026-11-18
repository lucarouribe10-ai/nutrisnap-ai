'use client';

import { useActionState, useRef } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { altaManual, type Resultado } from './acciones';

const campo = 'mt-1 h-12 w-full rounded-[16px] border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)]';

export function FormAlta() {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, accion, pendiente] = useActionState<Resultado, FormData>(async (prev, datos) => {
    const r = await altaManual(prev, datos);
    if (r?.ok) formRef.current?.reset();
    return r;
  }, null);
  return (
    <form ref={formRef} action={accion} className="hairline-card rounded-[var(--radius-card)] p-5" aria-label="Agregar una persona">
      <h2 className="flex items-center gap-2 text-[18px] font-extrabold [font-family:var(--font-display)]"><UserPlus size={20} aria-hidden="true" /> Agregar a una persona</h2>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Para cuando a alguien no le llega el acceso. Solo necesitas su correo y su nombre.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Correo</span><input name="email" type="email" required autoComplete="off" inputMode="email" placeholder="persona@correo.com" className={campo} /></label>
        <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Nombre</span><input name="nombre" required maxLength={40} autoComplete="off" placeholder="Nombre" className={campo} /></label>
        <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Días de acceso</span><input name="dias" type="number" min={1} max={365} defaultValue={30} required inputMode="numeric" className={campo} /></label>
        <label className="block"><span className="text-[13px] font-semibold text-[var(--text-secondary)]">Motivo (opcional)</span><input name="motivo" maxLength={200} autoComplete="off" placeholder="Ej: no le llegó el correo de Hotmart" className={campo} /></label>
      </div>
      {estado && <p role={estado.ok ? 'status' : 'alert'} className={`mt-3 rounded-[16px] p-3 text-[14px] font-medium ${estado.ok ? 'bg-[var(--lima)] text-[var(--text-primary)]' : 'bg-[var(--durazno)] text-[#8A3A06]'}`}>{estado.mensaje}</p>}
      <button type="submit" disabled={pendiente} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--negro)] text-[16px] font-semibold text-[var(--on-negro)] disabled:opacity-60 sm:w-auto sm:px-8">
        {pendiente ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Guardando…</> : 'Agregar y dar acceso'}
      </button>
    </form>
  );
}
