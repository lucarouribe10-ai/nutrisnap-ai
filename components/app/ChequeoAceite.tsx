'use client';

import { useState } from 'react';
import { Droplet, Mic } from 'lucide-react';

/** El Chequeo de Grasas Ocultas (mismo mecanismo que el recorrido de inicio): toque o voz. */
export function ChequeoAceite({ kcalUna, valor, onChange, pidiendo }: { kcalUna: number; valor: 0 | 1 | 2 | null; onChange: (n: 0 | 1 | 2, porVoz: boolean) => void; pidiendo?: boolean }) {
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
    <div className="rounded-[var(--radius-card)] p-4 text-[#F4FAF5] [background:linear-gradient(160deg,#4B8062,#3D6B4F_60%,#2F5640)]">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-90">Chequeo de Grasas Ocultas</p>
      <p className="mt-1 flex items-center gap-2 text-[17px] font-bold"><Droplet size={18} aria-hidden="true" /> ¿Cuánto aceite llevó?</p>
      <p className={`mt-1 text-[14px] ${pidiendo && valor === null ? 'font-bold text-[#FFD2B0]' : 'opacity-90'}`}>{pidiendo && valor === null ? 'Elige una opción para guardar.' : 'La cámara no lo ve. Tócalo o dilo por voz.'}</p>
      <div className="mt-3 flex gap-2" role="group" aria-label="Cantidad de aceite">
        {([0, 1, 2] as const).map((n) => (
          <button key={n} type="button" aria-pressed={valor === n} onClick={() => onChange(n, false)} className={`min-h-14 flex-1 rounded-[10px] px-1 py-1.5 text-[14px] font-bold leading-tight ${valor === n ? 'bg-[#F4FAF5] text-[#2F5640]' : 'bg-[#10241A]/40'}`}>
            {n === 0 ? 'Nada' : <>{n} cucharada{n > 1 ? 's' : ''}<span className="block text-[13px] font-semibold opacity-90">+{kcalUna * n} kcal</span></>}
          </button>
        ))}
        {voz && <button type="button" onClick={dictar} aria-label={escuchando ? 'Escuchando…' : 'Decirlo por voz'} aria-pressed={escuchando} className={`flex min-h-14 w-12 items-center justify-center rounded-[10px] ${escuchando ? 'animate-pulse bg-[#F4FAF5] text-[#2F5640]' : 'bg-[#10241A]/40'}`}><Mic size={18} aria-hidden="true" /></button>}
      </div>
      {escuchando && <p className="mt-2 text-[14px] font-semibold">Escuchando… di, por ejemplo, «una cucharada».</p>}
      {error && <p role="alert" className="mt-2 text-[14px] font-semibold text-[#FFD2B0]">{error}</p>}
    </div>
  );
}
