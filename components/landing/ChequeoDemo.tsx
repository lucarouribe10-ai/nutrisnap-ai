'use client';

// Mini-demo HONESTO del mecanismo (19: jerarquía de fidelidad nivel 2): reproduce el
// Chequeo de Grasas Ocultas con números de ejemplo y SÍ responde al toque. Está rotulado
// como ilustrativo; NO es una captura de la app terminada.
import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { Droplet, Mic } from 'lucide-react';

const OPCIONES = [
  { label: 'Nada', extra: 0 },
  { label: '1 cda · +120', extra: 120 },
  { label: '2 cdas · +240', extra: 240 },
] as const;
const BASE = 440;

export function ChequeoDemo() {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<0 | 1 | 2>(1);
  const [porVoz, setPorVoz] = useState(false);
  const [kcal, setKcal] = useState(BASE);
  const meta = BASE + OPCIONES[sel].extra;

  useEffect(() => {
    if (reduce) {
      setKcal(meta);
      return;
    }
    const c = animate(kcal, meta, { duration: 0.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setKcal(Math.round(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, reduce]);

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="hairline-card rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-2)]">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fotos/ensalada.jpg" alt="Ensalada fresca" width={72} height={72} className="size-[72px] rounded-full border-[3px] border-white object-cover shadow-[0_4px_10px_-4px_rgb(36_43_36/.35)]" />
          <div>
            <p className="text-[14px] font-bold text-[var(--text-primary)]">Ensalada fresca</p>
            <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Almuerzo · 13:05 · foto</p>
          </div>
        </div>

        {/* Dispositivo ownable: rejilla técnica + ticks de medición tras el número héroe */}
        <div className="panel-campo mt-3 rounded-[12px] p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Solo la foto</p>
              <p className="text-[22px] font-extrabold leading-none tabular-nums text-[var(--text-secondary)] line-through decoration-2 [font-family:var(--font-display)]">440</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-[var(--accent)]">Con el Chequeo</p>
              <p aria-live="polite" className="text-[40px] font-extrabold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                {kcal}<span className="ml-1 text-[13px] font-semibold text-[var(--text-secondary)]">kcal</span>
              </p>
            </div>
          </div>
          <div className="tick-escala mt-3" aria-hidden="true" />
          {kcal > 440 && <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] px-3 py-1 text-[13px] font-bold text-[#A83D06]"><Droplet size={14} aria-hidden="true" /> +{kcal - 440} kcal de aceite atrapadas</p>}
        </div>

        <div className="mt-3 rounded-[16px] bg-[var(--surface-2)] p-3 text-[var(--text-primary)]">
          <p className="flex items-center gap-1.5 text-[13px] font-bold">
            <Droplet size={14} strokeWidth={2.4} aria-hidden="true" /> ¿Cuánto aceite llevó? Pruébalo
          </p>
          <div className="mt-2 flex gap-1.5 text-[12px] font-bold" role="group" aria-label="Cantidad de aceite">
            {OPCIONES.map((o, i) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={sel === i}
                onClick={() => { setSel(i as 0 | 1 | 2); setPorVoz(false); }}
                className={`min-h-11 flex-1 rounded-full px-1 py-2 text-center transition-colors ${sel === i ? 'bg-[#C2490A] text-white shadow-[0_8px_14px_-8px_rgb(194_73_10/.8)]' : 'bg-white text-[var(--text-primary)] hover:bg-white/70'}`}
              >
                {o.label}
              </button>
            ))}
            <button
              type="button"
              aria-label="Decirlo por voz"
              aria-pressed={porVoz}
              onClick={() => { setSel(1); setPorVoz(true); }}
              className={`flex min-h-11 w-11 items-center justify-center rounded-full transition-colors ${porVoz ? 'bg-[#C2490A] text-white' : 'bg-white text-[var(--text-primary)] hover:bg-white/70'}`}
            >
              <Mic size={15} aria-hidden="true" />
            </button>
          </div>
          {porVoz && <p className="mt-2 text-[12px] font-semibold">Por voz: «1 cucharada de aceite» → +120 kcal</p>}
        </div>
      </div>
      <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">Ejemplo ilustrativo y tocable del Chequeo de Grasas Ocultas</p>
    </div>
  );
}
