'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';

/** Botón "grueso" con borde inferior que se hunde al tocar (patrón de los momentos de premio). */
export function BotonGordo({ children, onClick, href, tono = 'verde', disabled }: { children: ReactNode; onClick?: () => void; href?: string; tono?: 'verde' | 'naranja'; disabled?: boolean }) {
  const base = 'flex h-14 w-full items-center justify-center gap-2 rounded-[16px] px-4 text-[16px] font-extrabold uppercase tracking-[0.05em] transition-transform duration-100 [touch-action:manipulation] active:translate-y-[4px]';
  const t = tono === 'verde' ? 'bg-[var(--accent)] text-[var(--bg)] shadow-[0_5px_0_#2F5640] active:shadow-[0_1px_0_#2F5640]' : 'bg-[#E8590C] text-white shadow-[0_5px_0_#A83D06] active:shadow-[0_1px_0_#A83D06]';
  if (href) return <Link href={href} className={`${base} ${t}`}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${t} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>{children}</button>;
}
