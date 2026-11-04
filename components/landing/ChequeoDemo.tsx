// Mini-demo HONESTO del mecanismo (19: jerarquía de fidelidad nivel 2): reproduce el
// Chequeo de Grasas Ocultas con números de ejemplo. Está rotulado como ilustrativo;
// NO es una captura de la app terminada.
import { Droplet, Mic } from 'lucide-react';

export function ChequeoDemo() {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="hairline-card rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-2)]">
        <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--text-secondary)]">
          <span>Almuerzo · 13:05</span>
          <span>Ensalada con pollo</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[12px] bg-[var(--surface-2)] p-3">
            <p className="text-[11px] font-semibold text-[var(--text-secondary)]">Solo la foto</p>
            <p className="mt-1 text-[26px] font-extrabold leading-none tabular-nums text-[var(--text-secondary)] line-through decoration-2 [font-family:var(--font-display)]">440</p>
            <p className="text-[11px] text-[var(--text-secondary)]">kcal</p>
          </div>
          <div className="rounded-[12px] bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] p-3 ring-1 ring-[color-mix(in_oklab,var(--accent)_40%,transparent)]">
            <p className="text-[11px] font-semibold text-[var(--accent)]">Con el Chequeo</p>
            <p className="mt-1 text-[26px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">560</p>
            <p className="text-[11px] text-[var(--text-secondary)]">kcal</p>
          </div>
        </div>
        <div className="mt-3 rounded-[12px] p-3 text-[#F4FAF5] [background:linear-gradient(160deg,#4B8062,#3D6B4F_60%,#2F5640)]">
          <p className="flex items-center gap-1.5 text-[12.5px] font-bold">
            <Droplet size={14} strokeWidth={2.4} aria-hidden="true" /> ¿Cuánto aceite llevó?
          </p>
          <div className="mt-2 flex gap-1.5 text-[12px] font-bold">
            <span className="flex-1 rounded-[9px] bg-white/15 py-1.5 text-center">Nada</span>
            <span className="flex-1 rounded-[9px] bg-[#F4FAF5] py-1.5 text-center text-[#2F5640]">1 cda · +120</span>
            <span className="flex-1 rounded-[9px] bg-white/15 py-1.5 text-center">2 cdas</span>
            <span className="flex w-9 items-center justify-center rounded-[9px] bg-white/15" aria-label="o dilo por voz"><Mic size={14} aria-hidden="true" /></span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-[var(--text-secondary)]">Ejemplo ilustrativo del Chequeo de Grasas Ocultas</p>
    </div>
  );
}
