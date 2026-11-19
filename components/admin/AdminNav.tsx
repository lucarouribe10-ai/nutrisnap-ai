'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PESTANAS = [
  { href: '/admin', texto: 'Resumen' },
  { href: '/admin/usuarios', texto: 'Usuarios' },
  { href: '/admin/salud', texto: 'Salud' },
  { href: '/admin/uso', texto: 'Uso' },
  { href: '/admin/ia', texto: 'Costo de IA' },
] as const;

/** Barra de pestañas del panel. Solo aparecen las secciones ya construidas. En el celular la pestaña activa se centra sola y el borde derecho se difumina para indicar que hay más. */
export function AdminNav({ rutaForzada }: { rutaForzada?: string } = {}) {
  const real = usePathname();
  const ruta = rutaForzada ?? real;
  const caja = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = caja.current;
    const activa = el?.querySelector('[aria-current="page"]') as HTMLElement | null;
    if (!el || !activa) return;
    el.scrollTo({ left: Math.max(0, activa.offsetLeft - (el.clientWidth - activa.offsetWidth) / 2), behavior: 'auto' });
  }, [ruta]);
  return (
    <nav ref={caja} aria-label="Secciones del panel" className="-mx-5 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] [scrollbar-width:none] md:[mask-image:none]">
      <ul className="flex w-max gap-2 pr-6">
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
