'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PESTANAS = [
  { href: '/admin', texto: 'Resumen', lista: true },
  { href: '/admin/usuarios', texto: 'Usuarios', lista: true },
  { href: '/admin/salud', texto: 'Salud', lista: true },
  { href: '/admin/uso', texto: 'Uso', lista: true },
  { href: '/admin/ia', texto: 'Costo de IA', lista: true },
] as const;

/** Barra de pestañas del panel. Solo aparecen las secciones ya construidas: cada fase suma la suya (nada que parezca botón y no haga nada). */
export function AdminNav() {
  const ruta = usePathname();
  return (
    <nav aria-label="Secciones del panel" className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {PESTANAS.map((p) => {
          const activa = p.href === '/admin' ? ruta === '/admin' : ruta.startsWith(p.href);
          return (
            <li key={p.href}>
              <Link href={p.href} aria-current={activa ? 'page' : undefined} className={`flex h-11 items-center rounded-full px-4 text-[14px] font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${activa ? 'bg-[var(--negro)] text-[var(--on-negro)]' : 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'}`}>
                {p.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
