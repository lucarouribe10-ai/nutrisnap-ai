'use client';

import { CabeceraLima } from './Cabecera';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, FileText, LogOut, ShieldCheck, Trash2, Undo2 } from 'lucide-react';
import { Esqueleto, useAppData } from './uso';
import { borrarTodo, nivelDe } from '@/lib/app-store';
import { BotonPrimario } from '@/components/onboarding/ui';

export function Perfil() {
  const router = useRouter();
  const [d] = useAppData();
  const [confirmar, setConfirmar] = useState(false);
  if (!d) return <Esqueleto />;
  const n = nivelDe(d.xp);
  const enlaces = [
    { href: '/terminos', t: 'Términos y condiciones', i: FileText },
    { href: '/privacidad', t: 'Privacidad', i: ShieldCheck },
    { href: '/reembolsos', t: 'Reembolsos (7 días)', i: Undo2 },
    { href: '/aviso-ia', t: 'Aviso sobre la inteligencia artificial', i: FileText },
  ];
  return (
    <main className="px-5">
      <CabeceraLima titulo="Perfil" sub="Tu cuenta, tu plan y tus datos." />
      <section aria-label="Tu cuenta" className="hairline-card mt-4 rounded-[var(--radius-card)] p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,var(--surface))] text-[16px] font-extrabold text-[var(--accent)] [font-family:var(--font-display)]" aria-hidden="true">{d.nombre.slice(0, 2).toUpperCase()}</span>
          <div><p className="text-[18px] font-extrabold [font-family:var(--font-display)]">{d.nombre}</p><p className="text-[14px] text-[var(--text-secondary)]">Nivel {n.actual.n} · {n.actual.nombre} · racha de {d.racha} días</p></div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[[d.metaKcal.toLocaleString('es-CO'), 'kcal al día'], [`${d.metaProteina} g`, 'de proteína'], [`${d.pesoMeta} kg`, 'tu meta']].map(([v, l]) => (
            <div key={l} className="rounded-[12px] bg-[var(--surface-2)] p-2"><dd className="text-[18px] font-extrabold tabular-nums [font-family:var(--font-display)]">{v}</dd><dt className="text-[12px] text-[var(--text-secondary)]">{l}</dt></div>
          ))}
        </dl>
      </section>

      <section aria-label="Tu plan" className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] p-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu plan</p>
        <p className="mt-1 text-[17px] font-bold">Prueba de 3 días · plan anual</p>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Sin cobro hoy. Te avisamos 1 día antes. Cancelas cuando quieras y tienes 7 días de reembolso.</p>
        <p className="mt-2 rounded-[10px] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] p-2 text-center text-[13px] text-[var(--text-secondary)]">Vista previa: el estado real de tu suscripción se conecta con Hotmart.</p>
      </section>

      <nav aria-label="Información" className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_16%,transparent)] bg-[var(--surface)]">
        <ul className="divide-y divide-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]">
          {enlaces.map((e) => (
            <li key={e.href}><Link href={e.href} className="flex min-h-14 items-center gap-3 px-4 text-[15px] font-semibold"><e.i size={18} className="text-[var(--accent)]" aria-hidden="true" />{e.t}<ChevronRight size={18} className="ml-auto text-[var(--text-secondary)]" aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 flex flex-col gap-2">
        <button type="button" onClick={() => router.push('/')} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold"><LogOut size={17} aria-hidden="true" /> Cerrar sesión (vista previa)</button>
        {!confirmar ? (
          <button type="button" onClick={() => setConfirmar(true)} className="flex min-h-12 items-center justify-center gap-2 text-[15px] font-semibold text-[#A83D06]"><Trash2 size={17} aria-hidden="true" /> Borrar mis datos de este dispositivo</button>
        ) : (
          <div role="alertdialog" aria-label="Confirmar borrado" className="rounded-[var(--radius-card)] border border-[#A83D06]/40 bg-[var(--surface)] p-4">
            <p className="text-[15px] font-bold">¿Borrar tu plan, tus comidas y tu progreso de este dispositivo?</p>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">No se puede deshacer.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmar(false)} className="min-h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold">Cancelar</button>
              <BotonPrimario onClick={() => { borrarTodo(); router.push('/'); }}>Borrar todo</BotonPrimario>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
