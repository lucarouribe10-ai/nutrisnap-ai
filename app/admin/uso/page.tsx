import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin/guard';
import { rangoDias } from '@/lib/admin/formato';
import { PERIODOS, UsoVista, type DatosUso } from '@/components/admin/vistas/UsoVista';

async function Contenido({ params }: { params: Promise<{ dias?: string }> }) {
  const { dias: crudo } = await params;
  const pedido = Number(crudo);
  const dias = (PERIODOS as readonly number[]).includes(pedido) ? pedido : 30;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc('admin_uso', { dias });
  const u = (data ?? null) as DatosUso | null;
  if (error || !u) return <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--durazno)] p-4 text-[14px] text-[var(--durazno-tinta)]">No se pudo cargar el uso. Recarga la página; si sigue igual, avisa a soporte técnico.</p>;
  return <UsoVista u={{ ...u, dias }} rango={rangoDias(dias)} />;
}

export default function Page({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido params={searchParams} />
    </Suspense>
  );
}
