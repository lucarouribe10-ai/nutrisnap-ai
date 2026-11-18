'use client';

import { useState } from 'react';
import { Droplet, Mic } from 'lucide-react';

/** El Chequeo de Grasas Ocultas (mismo mecanismo que el recorrido de inicio): toque o voz. */
export function ChequeoAceite({ kcalUna, valor, onChange, pidiendo, pregunta }: { kcalUna: number; valor: 0 | 1 | 2 | null; onChange: (n: 0 | 1 | 2, porVoz: boolean) => void; pidiendo?: boolean; pregunta?: string }) {
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState('');
  const dictar = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setError('');
    const rec = new SR();
    rec.lang = 'es-CO';
    rec.onstart = () => setEscuchando(true);
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => { setEscuchando(false); setError('No pude escucharte. Toca una opción o intenta de nuevo.'); };
    rec.onresult = (ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const t = ev.results[0][0].transcript.toLowerCase();
      onChange(/nada|sin aceite|no llev/.test(t) ? 0 : /\b(dos|2)\b/.test(t) ? 2 : 1, true);
    };
    rec.start();
  };
  const voz = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  return (
    <div className="hairline-card rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--durazno)] px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-[#A83D06]"><Droplet size={13} aria-hidden="true" /> Chequeo de Grasas Ocultas</p>
      <p className="mt-2 text-[18px] font-extrabold leading-snug [font-family:var(--font-display)]">{pregunta?.trim() || '¿Cuánto aceite llevó?'}</p>
      <p className={`mt-1 text-[14px] ${pidiendo && valor === null ? 'font-bold text-[#A83D06]' : 'text-[var(--text-secondary)]'}`}>{pidiendo && valor === null ? 'Elige una opción para guardar.' : 'La cámara no lo ve. Tócalo o dilo por voz.'}</p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Cantidad de aceite">
        {([0, 1, 2] as const).map((n) => (
          <button key={n} type="button" aria-label={n === 0 ? 'Nada de aceite' : `${n} cucharada${n > 1 ? 's' : ''}, más ${kcalUna * n} kcal`} aria-pressed={valor === n} onClick={() => onChange(n, false)} className={`flex min-h-14 flex-col items-center justify-center rounded-full px-2 py-1.5 text-[15px] font-bold leading-tight ${valor === n ? 'bg-[var(--negro)] text-[var(--on-negro)] shadow-[0_8px_14px_-8px_rgb(21_25_26/.6)]' : 'border-2 border-[#FFD3A3] bg-[var(--surface)] text-[var(--text-primary)]'}`}>
            {n === 0 ? 'Nada' : <>{n} cda.<span className="block text-[13px] font-semibold opacity-90">+{kcalUna * n} kcal</span></>}
          </button>
        ))}
      </div>
      {voz && <button type="button" onClick={dictar} aria-pressed={escuchando} className={`mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold ${escuchando ? 'animate-pulse bg-[#C2490A] text-white' : 'border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[var(--text-primary)]'}`}><Mic size={18} aria-hidden="true" /> {escuchando ? 'Escuchando…' : 'Decirlo por voz'}</button>}
      {escuchando && <p className="mt-2 text-[14px] font-semibold">Escuchando… di, por ejemplo, «una cucharada».</p>}
      {error && <p role="alert" className="mt-2 text-[14px] font-semibold text-[#A83D06]">{error}</p>}
    </div>
  );
}
