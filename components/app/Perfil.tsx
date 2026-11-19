'use client';

import { CabeceraLima } from './Cabecera';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, FileText, Loader2, LogOut, ShieldCheck, Trash2, Undo2, UserX } from 'lucide-react';
import { Esqueleto, useAppData } from './uso';
import { borrarTodo, nivelDe } from '@/lib/app-store';
import { BotonPrimario } from '@/components/onboarding/ui';

export function Perfil() {
  const router = useRouter();
  const [d] = useAppData();
  const [confirmar, setConfirmar] = useState(false);
  const [cuenta, setCuenta] = useState<'no' | 'confirmar' | 'ocupado' | 'error'>('no');
  const eliminarCuenta = async () => {
    setCuenta('ocupado');
    try {
      const r = await fetch('/api/cuenta/eliminar', { method: 'POST' });
      if (!r.ok) throw new Error('no');
      borrarTodo();
      router.replace('/');
      router.refresh();
    } catch {
      setCuenta('error');
    }
  };
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
      <section aria-label="Tu cuenta" className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--lima)] text-[16px] font-extrabold text-[var(--accent)] [font-family:var(--font-display)]" aria-hidden="true">{d.nombre.slice(0, 2).toUpperCase()}</span>
          <div><p className="text-[18px] font-extrabold [font-family:var(--font-display)]">{d.nombre}</p><p className="text-[14px] text-[var(--text-secondary)]">Nivel {n.actual.n} · {n.actual.nombre} · racha de {d.racha} días</p></div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[[d.metaKcal.toLocaleString('es-CO'), 'kcal al día', 'var(--lima-2)'], [`${d.metaProteina} g`, 'de proteína', '#BCE0F2'], [`${d.pesoMeta} kg`, 'tu meta', '#FFD3A3']].map(([v, l, f]) => (
            <div key={l} className="rounded-[16px] border-2 p-2" style={{ borderColor: f }}><dd className="text-[18px] font-extrabold tabular-nums [font-family:var(--font-display)]">{v}</dd><dt className="text-[12px] text-[var(--text-secondary)]">{l}</dt></div>
          ))}
        </dl>
      </section>

      <section aria-label="Tu plan" className="caja-lima mt-4 rounded-[var(--radius-card)] p-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Tu plan</p>
        <p className="mt-1 text-[17px] font-bold">Prueba de 3 días · plan anual</p>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Sin cobro hoy. Te avisamos 1 día antes. Cancelas cuando quieras y tienes 7 días de reembolso.</p>
        <p className="mt-2 rounded-[14px] bg-[var(--surface-2)] p-2 text-center text-[13px] text-[var(--text-secondary)]">Vista previa: el estado real de tu suscripción se conecta con Hotmart.</p>
      </section>

      <nav aria-label="Información" className="mt-4 overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-[var(--shadow-2)]">
        <ul className="divide-y divide-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)]">
          {enlaces.map((e) => (
            <li key={e.href}><Link href={e.href} className="flex min-h-14 items-center gap-3 px-4 text-[15px] font-semibold"><e.i size={18} className="text-[var(--accent)]" aria-hidden="true" />{e.t}<ChevronRight size={18} className="ml-auto text-[var(--text-secondary)]" aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 flex flex-col gap-2">
        <form action="/auth/salir" method="post" className="flex flex-col">
          <button type="submit" className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold"><LogOut size={17} aria-hidden="true" /> Cerrar sesión</button>
        </form>
        {!confirmar ? (
          <button type="button" onClick={() => setConfirmar(true)} className="flex min-h-12 items-center justify-center gap-2 text-[15px] font-semibold text-[var(--durazno-tinta)]"><Trash2 size={17} aria-hidden="true" /> Borrar mis datos de este dispositivo</button>
        ) : (
          <div role="alertdialog" aria-label="Confirmar borrado" className="rounded-[var(--radius-card)] border border-[var(--durazno-tinta)]/40 bg-[var(--surface)] p-4">
            <p className="text-[15px] font-bold">¿Borrar tu plan, tus comidas y tu progreso de este dispositivo?</p>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">No se puede deshacer.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmar(false)} className="min-h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold">Cancelar</button>
              <BotonPrimario onClick={() => { borrarTodo(); router.push('/'); }}>Borrar todo</BotonPrimario>
            </div>
          </div>
        )}
        {cuenta === 'no' ? (
          <button type="button" onClick={() => setCuenta('confirmar')} className="flex min-h-12 items-center justify-center gap-2 text-[15px] font-semibold text-[var(--durazno-tinta)]"><UserX size={17} aria-hidden="true" /> Eliminar mi cuenta y mis datos</button>
        ) : (
          <div role="alertdialog" aria-label="Confirmar eliminación de la cuenta" className="rounded-[var(--radius-card)] border border-[var(--durazno-tinta)]/40 bg-[var(--surface)] p-4">
            <p className="text-[15px] font-bold">¿Eliminar tu cuenta y todos tus datos?</p>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Se borran tu cuenta, tu plan, tus comidas, tu peso y tu progreso, y no se puede deshacer. Si tienes una suscripción activa, esto no la cancela: cancélala primero en Hotmart para que no te sigan cobrando.</p>
            {cuenta === 'error' && <p role="alert" className="mt-2 text-[14px] font-semibold text-[var(--durazno-tinta)]">No pudimos eliminar tu cuenta. Intenta de nuevo; si sigue igual, escríbenos y lo hacemos nosotros.</p>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" disabled={cuenta === 'ocupado'} onClick={() => setCuenta('no')} className="min-h-12 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] text-[15px] font-semibold disabled:opacity-60">Cancelar</button>
              <BotonPrimario onClick={eliminarCuenta} disabled={cuenta === 'ocupado'}>{cuenta === 'ocupado' ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Eliminando…</> : 'Eliminar todo'}</BotonPrimario>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
