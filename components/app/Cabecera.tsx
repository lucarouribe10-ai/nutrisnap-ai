import type { ReactNode } from 'react';

const FONDO = 'caja-lima';

/** Firma visual de la app: bloque lima suave con esquinas inferiores redondeadas. La usan Logros, Progreso, Perfil y Racha. */
export function CabeceraLima({ titulo, sub, derecha, children }: { titulo: string; sub?: string; derecha?: ReactNode; children?: ReactNode }) {
  return (
    <header className={`mt-5 rounded-[28px] px-4 pb-4 pt-4 ${FONDO}`}>
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
  return <div className={`mt-5 rounded-[28px] px-4 pb-5 pt-3 ${FONDO}`}>{children}</div>;
}
