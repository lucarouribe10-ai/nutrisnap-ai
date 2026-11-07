// Isotipo de NutriSnap: visor de cámara con una gota (la grasa oculta). Usa tokens de marca.
export function Isotipo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path
        d="M9 13v-2a2 2 0 0 1 2-2h2M19 9h2a2 2 0 0 1 2 2v2M23 19v2a2 2 0 0 1-2 2h-2M13 23h-2a2 2 0 0 1-2-2v-2"
        stroke="var(--bg)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M16 11.5s3.4 3.6 3.4 6.2a3.4 3.4 0 0 1-6.8 0c0-2.6 3.4-6.2 3.4-6.2z" fill="var(--accent-2)" />
    </svg>
  );
}
