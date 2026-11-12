import type { ReactNode } from 'react';

const FONDO = '[background:radial-gradient(220px_150px_at_90%_0%,rgb(255_255_255/.55),transparent_70%),var(--tint)]';

/** Firma visual de la app: bloque lima suave con esquinas inferiores redondeadas. La usan Logros, Progreso, Perfil y Racha. */
export function CabeceraLima({ titulo, sub, derecha, children }: { titulo: string; sub?: string; derecha?: ReactNode; children?: ReactNode }) {
  return (
    <header className={`-mx-5 rounded-b-[26px] px-5 pb-4 pt-5 ${FONDO}`}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] [font-family:var(--font-display)]">{titulo}</h1>
          {sub && <p className="text-[14px] text-[var(--text-secondary)]">{sub}</p>}
        </div>
        {derecha}
      </div>
      {children}
    </header>
  );
}

/** Contenedor lima sin título (para la pantalla de racha con su llama grande). */
export function BloqueLima({ children }: { children: ReactNode }) {
  return <div className={`-mx-5 rounded-b-[26px] px-5 pb-5 pt-3 ${FONDO}`}>{children}</div>;
}
