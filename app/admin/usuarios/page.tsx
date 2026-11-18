import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { fechaCorta, hace } from '@/lib/admin/formato';
import { FormAlta } from './FormAlta';
import { AccionesUsuario } from './AccionesUsuario';

type Fila = { id: string; email: string; nombre: string | null; creado_en: string; ultimo_acceso: string | null; plan: string; estado: string; renueva_el: string | null; motivo: string | null; creado_via: string; es_admin: boolean };

const ETIQUETA: Record<string, { t: string; clase: string }> = {
  activo: { t: 'Con acceso', clase: 'bg-[var(--lima)] text-[var(--accent)]' },
  prueba: { t: 'En prueba', clase: 'bg-[var(--cielo)] text-[#1E5A78]' },
  ninguno: { t: 'Sin acceso', clase: 'bg-[var(--surface-2)] text-[var(--text-secondary)]' },
  vencido: { t: 'Vencido', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
  cancelado: { t: 'Cancelado', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
  reembolsado: { t: 'Reembolsado', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
};

async function Lista({ q }: { q: string }) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc('admin_listar_usuarios', { buscar: q || null, limite: 100, desplazamiento: 0 });
  const filas = (data ?? []) as Fila[];
  if (error) return <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--durazno)] p-4 text-[14px] text-[#8A3A06]">Sin datos: no se pudo leer la lista. Intenta de nuevo.</p>;
  if (filas.length === 0) return <p className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-[15px] text-[var(--text-secondary)]">{q ? 'Nadie coincide con esa búsqueda.' : 'Todavía no hay cuentas.'}</p>;
  const ahora = Date.now();
  return (
    <ul className="flex flex-col gap-3" aria-label="Personas con cuenta">
      {filas.map((u) => {
        const vigente = (u.estado === 'activo' || u.estado === 'prueba') && (!u.renueva_el || new Date(u.renueva_el).getTime() > ahora);
        const et = ETIQUETA[vigente ? u.estado : u.estado === 'activo' || u.estado === 'prueba' ? 'vencido' : u.estado] ?? ETIQUETA.ninguno;
        return (
          <li key={u.id} className="hairline-card rounded-[var(--radius-card)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[17px] font-bold">{u.nombre ?? 'Sin nombre'}{u.es_admin && <span className="ml-2 rounded-full bg-[var(--negro)] px-2 py-0.5 align-middle text-[11px] font-bold text-[var(--on-negro)]">Administradora</span>}</p>
                <p className="truncate text-[14px] text-[var(--text-secondary)]">{u.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${et.clase}`}>{et.t}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px] sm:grid-cols-4">
              <div><dt className="text-[var(--text-secondary)]">Se unió</dt><dd className="font-semibold">{fechaCorta(u.creado_en)}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Última vez</dt><dd className="font-semibold">{hace(u.ultimo_acceso)}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Acceso hasta</dt><dd className="font-semibold">{u.renueva_el ? fechaCorta(u.renueva_el) : u.plan === 'free' ? '—' : 'Sin fecha'}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Origen</dt><dd className="font-semibold">{u.creado_via === 'admin' ? 'Alta manual' : 'Registro propio'}</dd></div>
            </dl>
            {u.motivo && <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Motivo: {u.motivo}</p>}
            <AccionesUsuario id={u.id} tieneAcceso={vigente} />
          </li>
        );
      })}
    </ul>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const buscar = q.trim().slice(0, 80);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Usuarios</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Quién tiene cuenta, quién tiene acceso y cómo ayudarle.</p>
      </div>
      <FormAlta />
      <form method="get" role="search" className="flex gap-2">
        <label className="relative block flex-1"><span className="sr-only">Buscar por correo o nombre</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" aria-hidden="true" />
          <input name="q" defaultValue={buscar} placeholder="Buscar por correo o nombre" className="h-12 w-full rounded-full border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] pl-11 pr-4 text-[16px] outline-none focus:border-[var(--accent)]" />
        </label>
        <button type="submit" className="h-12 rounded-full bg-[var(--negro)] px-5 text-[15px] font-semibold text-[var(--on-negro)]">Buscar</button>
      </form>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
        <Lista q={buscar} />
      </Suspense>
    </div>
  );
}
