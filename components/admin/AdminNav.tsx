'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PESTANAS = [
  { href: '/admin', texto: 'Resumen', lista: true },
  { href: '/admin/ventas', texto: 'Ventas', lista: false },
  { href: '/admin/usuarios', texto: 'Usuarios', lista: true },
  { href: '/admin/salud', texto: 'Salud', lista: false },
  { href: '/admin/uso', texto: 'Uso', lista: false },
  { href: '/admin/negocio', texto: 'Negocio', lista: false },
  { href: '/admin/ia', texto: 'Costo de IA', lista: false },
] as const;

/** Barra de pestañas del panel. Las que todavía no están construidas se ven apagadas y dicen «Pronto» (nada falso). */
export function AdminNav() {
  const ruta = usePathname();
  return (
    <nav aria-label="Secciones del panel" className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {PESTANAS.map((p) => {
          const activa = p.href === '/admin' ? ruta === '/admin' : ruta.startsWith(p.href);
          if (!p.lista) {
            return (
              <li key={p.href}>
                <span aria-disabled="true" title="Llega en una de las próximas fases" className="flex h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-[color-mix(in_oklab,var(--text-secondary)_65%,transparent)]">
                  {p.texto}<span className="rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">Pronto</span>
                </span>
              </li>
            );
          }
          return (
            <li key={p.href}>
              <Link href={p.href} aria-current={activa ? 'page' : undefined} className={`flex h-11 items-center rounded-full px-4 text-[14px] font-semibold ${activa ? 'bg-[var(--negro)] text-[var(--on-negro)]' : 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'}`}>
                {p.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
