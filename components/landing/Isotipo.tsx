// Isotipo plano de NutriSnap (versión simplificada del logo de la dueña para espacios chicos):
// visor de cámara + manzana-corazón con gráfica. El logo original brillante vive en public/logo/ (icono de la app).
export function Isotipo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path
        d="M7.5 12V10.5a3 3 0 0 1 3-3H12M20 7.5h1.5a3 3 0 0 1 3 3V12M24.5 20v1.5a3 3 0 0 1-3 3H20M12 24.5h-1.5a3 3 0 0 1-3-3V20"
        stroke="var(--bg)"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M16 23.6c-5.4-3.6-6.6-7.6-4.6-9.8 1.7-1.8 3.8-1.2 4.6.5.8-1.7 2.9-2.3 4.6-.5 2 2.2.8 6.2-4.6 9.8z" fill="var(--tint)" />
      <path d="M16.4 14.4c-.1-2 1-3.5 3-4 .2 2-.9 3.5-3 4z" fill="var(--accent-on-dark)" />
      <rect x="13.3" y="18" width="1.7" height="3" rx=".85" fill="var(--accent)" />
      <rect x="15.2" y="16.7" width="1.7" height="4.3" rx=".85" fill="var(--accent)" />
      <rect x="17.1" y="15.6" width="1.7" height="5.4" rx=".85" fill="var(--accent)" />
    </svg>
  );
}
