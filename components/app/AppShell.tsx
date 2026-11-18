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
      <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
        <ul className="grid grid-cols-5 items-center rounded-[34px] bg-[rgb(255_255_255/.92)] px-2 py-2 shadow-[0_16px_30px_-14px_rgb(21_25_26/.45),0_0_0_1px_rgb(21_25_26/.07)] backdrop-blur-xl">
          {TABS.map((t) => {
            const activa = t.href === '/app' ? ruta === '/app' : ruta.startsWith(t.href);
            const Icono = t.icon;
            if ('fab' in t) {
              return (
                <li key={t.href} className="flex justify-center">
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <Link href={t.href} aria-label="Registrar una comida" className="-mt-8 flex size-[60px] items-center justify-center rounded-full border-4 border-[var(--bg)] bg-[var(--negro)] text-[var(--lima)] shadow-[0_12px_22px_-10px_rgb(21_25_26/.6)]">
                      <Icono size={26} aria-hidden="true" />
                    </Link>
                  </motion.div>
                </li>
              );
            }
            return (
              <li key={t.href}>
                <Link href={t.href} aria-current={activa ? 'page' : undefined} className={`mx-auto flex min-h-12 w-[60px] flex-col items-center justify-center gap-0.5 rounded-[22px] text-[12px] font-bold ${activa ? 'caja-lima text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  <Icono size={20} aria-hidden="true" />
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
