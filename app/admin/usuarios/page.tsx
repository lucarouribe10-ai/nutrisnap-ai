import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { fechaCorta, hace } from '@/lib/admin/formato';
import { FormAlta } from './FormAlta';
import { AccionesUsuario } from './AccionesUsuario';
import { Entrada } from '@/components/admin/Entrada';

type Fila = { id: string; email: string; nombre: string | null; creado_en: string; ultimo_acceso: string | null; plan: string; estado: string; renueva_el: string | null; motivo: string | null; creado_via: string; es_admin: boolean };

const ETIQUETA: Record<string, { t: string; clase: string }> = {
  activo: { t: 'Con acceso', clase: 'bg-[var(--lima)] text-[var(--accent)]' },
  prueba: { t: 'En prueba', clase: 'bg-[var(--cielo)] text-[#1E5A78]' },
  ninguno: { t: 'Sin acceso', clase: 'bg-[var(--surface-2)] text-[var(--text-secondary)]' },
  vencido: { t: 'Vencido', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
  cancelado: { t: 'Cancelado', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
  reembolsado: { t: 'Reembolsado', clase: 'bg-[var(--durazno)] text-[#8A3A06]' },
};

type Filtro = 'todos' | 'con' | 'sin' | 'vencido';
const FILTROS: { v: Filtro; t: string }[] = [{ v: 'todos', t: 'Todas' }, { v: 'con', t: 'Con acceso' }, { v: 'sin', t: 'Sin acceso' }, { v: 'vencido', t: 'Vencidas' }];

async function Lista({ q, filtro }: { q: string; filtro: Filtro }) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc('admin_listar_usuarios', { buscar: q || null, limite: 100, desplazamiento: 0 });
  const ahora = Date.now();
  const clasif = (u: Fila): Filtro => {
    const conEstado = u.estado === 'activo' || u.estado === 'prueba';
    if (conEstado && (!u.renueva_el || new Date(u.renueva_el).getTime() > ahora)) return 'con';
    return conEstado || u.estado === 'cancelado' || u.estado === 'vencido' || u.estado === 'reembolsado' ? 'vencido' : 'sin';
  };
  const filas = ((data ?? []) as Fila[]).filter((u) => filtro === 'todos' || clasif(u) === filtro);
  if (error) return <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--durazno)] p-4 text-[14px] text-[#8A3A06]">No se pudo cargar la lista. Recarga la página; si sigue igual, avisa a soporte técnico.</p>;
  if (filas.length === 0) {
    const total = (data ?? []).length;
    const nombreFiltro = FILTROS.find((f) => f.v === filtro)?.t.toLowerCase();
    return (
      <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-[15px] text-[var(--text-secondary)]">
        {q ? `Nadie coincide con «${q}».` : filtro !== 'todos' && total > 0 ? `Nadie está en «${nombreFiltro}» por ahora.` : 'Todavía no hay cuentas.'}
        {(q || (filtro !== 'todos' && total > 0)) && <a href="/admin/usuarios" className="ml-2 inline-flex min-h-11 items-center font-semibold text-[var(--accent)] underline underline-offset-4">Ver todas</a>}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3" aria-label="Personas con cuenta">
      {filas.map((u, idx) => {
        const vigente = (u.estado === 'activo' || u.estado === 'prueba') && (!u.renueva_el || new Date(u.renueva_el).getTime() > ahora);
        const et = u.es_admin ? { t: 'Acceso total', clase: 'bg-[var(--negro)] text-[var(--on-negro)]' } : ETIQUETA[vigente ? u.estado : u.estado === 'activo' || u.estado === 'prueba' ? 'vencido' : u.estado] ?? ETIQUETA.ninguno;
        const origen = u.creado_via === 'admin' ? 'Alta manual' : 'Registro propio';
        return (
          <li key={u.id}><Entrada i={idx} className="hairline-card rounded-[var(--radius-card)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[17px] font-bold">{u.nombre ?? 'Sin nombre'}{u.es_admin && <span className="ml-2 rounded-full bg-[var(--lima)] px-2 py-0.5 align-middle text-[11px] font-bold text-[var(--accent)]">Administradora</span>}</p>
                <p className="truncate text-[14px] text-[var(--text-secondary)]">{u.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${et.clase}`}>{et.t}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px] sm:grid-cols-4">
              <div><dt className="text-[var(--text-secondary)]">Se unió</dt><dd className="font-semibold">{fechaCorta(u.creado_en)}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Última vez</dt><dd className="font-semibold">{hace(u.ultimo_acceso)}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Acceso hasta</dt><dd className="font-semibold">{u.es_admin ? 'Siempre' : u.renueva_el ? fechaCorta(u.renueva_el) : u.plan === 'free' ? '—' : 'Sin fecha'}</dd></div>
              <div><dt className="text-[var(--text-secondary)]">Origen</dt><dd className="font-semibold">{origen}</dd></div>
            </dl>
            {u.motivo && u.motivo !== origen && !u.es_admin && <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Motivo: {u.motivo}</p>}
            {!u.es_admin && <AccionesUsuario id={u.id} tieneAcceso={vigente} />}
          </Entrada></li>
        );
      })}
    </ul>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; estado?: string }> }) {
  const { q = '', estado = 'todos' } = await searchParams;
  const buscar = q.trim().slice(0, 80);
  const filtro: Filtro = (['con', 'sin', 'vencido'] as const).includes(estado as 'con') ? (estado as Filtro) : 'todos';
  const enlace = (v: Filtro) => `/admin/usuarios?${new URLSearchParams({ ...(buscar ? { q: buscar } : {}), ...(v !== 'todos' ? { estado: v } : {}) }).toString()}`;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Usuarios</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">Quién tiene cuenta, quién tiene acceso y cómo ayudarle.</p>
        </div>
        <FormAlta />
      </div>
      <form method="get" role="search" className="flex gap-2">
        {filtro !== 'todos' && <input type="hidden" name="estado" value={filtro} />}
        <label className="relative block flex-1"><span className="sr-only">Buscar por correo o nombre</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" aria-hidden="true" />
          <input name="q" defaultValue={buscar} placeholder="Buscar por correo o nombre" className="h-12 w-full rounded-full border border-[color-mix(in_oklab,var(--text-secondary)_28%,transparent)] bg-[var(--surface)] pl-11 pr-4 text-[16px] outline-none focus:border-[var(--accent)]" />
        </label>
        <button type="submit" className="h-12 rounded-full border border-[color-mix(in_oklab,var(--text-primary)_35%,transparent)] px-5 text-[15px] font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100">Buscar</button>
      </form>
      <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <a key={f.v} href={enlace(f.v)} aria-current={filtro === f.v ? 'true' : undefined} className={`flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${filtro === f.v ? 'bg-[var(--negro)] text-[var(--on-negro)]' : 'bg-[var(--surface)] shadow-[var(--shadow-1)]'}`}>{f.t}</a>
        ))}
      </nav>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
        <Lista q={buscar} filtro={filtro} />
      </Suspense>
    </div>
  );
}
