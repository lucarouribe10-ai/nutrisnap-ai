'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Camera, Home, Trophy, User } from 'lucide-react';
import type { ReactNode } from 'react';

const TABS = [
  { href: '/app', label: 'Hoy', icon: Home },
  { href: '/app/progreso', label: 'Progreso', icon: BarChart3 },
  { href: '/app/registrar', label: 'Registrar', icon: Camera, fab: true },
  { href: '/app/logros', label: 'Logros', icon: Trophy },
  { href: '/app/perfil', label: 'Perfil', icon: User },
] as const;

/** Estructura de la app interna: contenido + barra inferior de 4 secciones + botón central de registrar. */
export function AppShell({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const a = () => setOffline(!navigator.onLine);
    a();
    window.addEventListener('online', a);
    window.addEventListener('offline', a);
    return () => { window.removeEventListener('online', a); window.removeEventListener('offline', a); };
  }, []);
  if (ruta.startsWith('/app/registrar')) return <>{children}</>;
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] bg-[var(--bg)] pb-28 text-[var(--text-primary)] [font-family:var(--font-body)]">
      {offline && <p role="status" className="bg-[var(--surface-2)] px-5 py-2 text-center text-[14px] font-semibold text-[var(--text-secondary)]">Sin conexión: tus datos se guardan en este dispositivo.</p>}
      {children}
      <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-[color-mix(in_oklab,var(--text-secondary)_20%,transparent)] bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <ul className="grid grid-cols-5 items-end">
          {TABS.map((t) => {
            const activa = t.href === '/app' ? ruta === '/app' : ruta.startsWith(t.href);
            const Icono = t.icon;
            if ('fab' in t) {
              return (
                <li key={t.href} className="flex flex-col items-center">
                  <motion.div whileTap={{ scale: 0.94 }}>
                    <Link href={t.href} aria-label="Registrar una comida" className="-mt-7 flex size-14 items-center justify-center rounded-full border-[3px] border-[var(--bg)] text-[var(--bg)] shadow-[0_10px_20px_-6px_color-mix(in_oklab,var(--accent)_65%,transparent)] [background:linear-gradient(180deg,#4B8062,#3D6B4F)]">
                      <Icono size={24} aria-hidden="true" />
                    </Link>
                  </motion.div>
                  <span className="mt-0.5 text-[12px] font-semibold text-[var(--accent)]">Registrar</span>
                </li>
              );
            }
            return (
              <li key={t.href}>
                <Link href={t.href} aria-current={activa ? 'page' : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 text-[12px] font-semibold ${activa ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
                  <span className={`flex h-7 w-12 items-center justify-center rounded-[10px] ${activa ? 'bg-[var(--chip-bg)]' : ''}`}><Icono size={20} aria-hidden="true" /></span>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
