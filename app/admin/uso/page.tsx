import { Suspense } from 'react';
import { Camera, Filter, Repeat, Zap } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/guard';
import { SinDatos, Heroe, Tarjeta } from '@/components/admin/Tarjeta';
import { Entrada } from '@/components/admin/Entrada';

type Uso = {
  dias: number;
  embudo: { evento: string; personas: number }[];
  comidas: { hoy: number; semana: number; periodo: number; por_foto: number; rapidas: number };
  activacion: { cuentas: number; activadas: number };
  retencion: { dia: number; elegibles: number; volvieron: number }[];
  sesiones: { hoy: number; semana: number; mes: number };
};

const PASOS: Record<string, string> = {
  landing_vista: 'Vieron la página de ventas',
  onboarding_iniciado: 'Empezaron el recorrido',
  resultado_visto: 'Vieron el resultado de su foto',
  chequeo_respondido: 'Respondieron el Chequeo de aceite',
  plan_construido: 'Vieron su plan',
  paywall_visto: 'Llegaron a la pantalla de planes',
  checkout_iniciado: 'Tocaron «Empezar mis 3 días gratis»',
  login_exitoso: 'Entraron con su código',
};

const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : null);

async function Contenido() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc('admin_uso', { dias: 30 });
  const u = (data ?? null) as Uso | null;
  if (error || !u) return <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--durazno)] p-4 text-[14px] text-[#8A3A06]">No se pudo cargar el uso. Recarga la página; si sigue igual, avisa a soporte técnico.</p>;
  const base = u.embudo[0]?.personas ?? 0;
  const hayEmbudo = u.embudo.some((p) => p.personas > 0);
  const max = Math.max(1, ...u.embudo.map((p) => p.personas));
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Uso</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Qué hace la gente en tu app. Últimos {u.dias} días.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Tarjeta titulo="Comidas registradas" ayuda="Cuántas comidas registró la gente: la acción principal de la app. Foto = con Chequeo de Grasas Ocultas; rápida = escrita a mano." icono={<Camera size={18} />}>
          {u.comidas.periodo === 0 ? <SinDatos>Sin datos: todavía nadie registró una comida en la app publicada.</SinDatos> : (
            <><Heroe>{u.comidas.periodo}</Heroe>
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Hoy {u.comidas.hoy} · 7 días {u.comidas.semana} · {u.comidas.por_foto} con foto · {u.comidas.rapidas} rápidas</p></>
          )}
        </Tarjeta>
        <Tarjeta titulo="Activación" ayuda="De las cuentas creadas en este periodo, cuántas ya registraron al menos una comida. Es la señal de que la app les sirvió." icono={<Zap size={18} />}>
          {u.activacion.cuentas === 0 ? <SinDatos>Sin datos: no hay cuentas nuevas en este periodo.</SinDatos> : (
            <><Heroe>{pct(u.activacion.activadas, u.activacion.cuentas)}</Heroe>
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{u.activacion.activadas} de {u.activacion.cuentas} cuentas registraron su primera comida.</p></>
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Recorrido de venta" ayuda="Cuántas personas distintas llegan a cada paso, de la página de ventas a entrar a la app. Donde más bajan es donde más se pierden." icono={<Filter size={18} />}>
        {!hayEmbudo ? <SinDatos>Sin datos: las visitas empiezan a contarse desde ahora. Se llena cuando entre gente a tu página.</SinDatos> : (
          <ol className="flex flex-col gap-2.5">
            {u.embudo.map((p, i) => (
              <Entrada key={p.evento} i={i}>
                <li className="list-none">
                  <div className="flex items-baseline justify-between gap-3 text-[14px]"><span>{PASOS[p.evento] ?? p.evento}</span><span className="shrink-0 font-bold tabular-nums">{p.personas}{base > 0 && i > 0 ? <span className="ml-1.5 text-[12px] font-semibold text-[var(--text-secondary)]">{pct(p.personas, base)}</span> : null}</span></div>
                  <span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]"><span className="block h-full rounded-full bg-[var(--negro)]" style={{ width: `${(p.personas / max) * 100}%` }} /></span>
                </li>
              </Entrada>
            ))}
          </ol>
        )}
      </Tarjeta>

      <Tarjeta titulo="Retención" ayuda="De las personas que ya cumplieron N días con cuenta, cuántas volvieron justo ese día. Mide si la app genera hábito. Con pocas cuentas el porcentaje no es confiable." icono={<Repeat size={18} />}>
        <ul className="grid grid-cols-3 gap-2 text-center">
          {u.retencion.map((r) => (
            <li key={r.dia} className="rounded-[16px] bg-[var(--surface-2)] px-2 py-3">
              <p className="text-[12px] font-semibold text-[var(--text-secondary)]">Día {r.dia}</p>
              <p className="mt-1 text-[22px] font-extrabold tabular-nums">{r.elegibles === 0 ? '—' : pct(r.volvieron, r.elegibles)}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{r.elegibles === 0 ? 'Sin datos: nadie cumple aún ese día' : `${r.volvieron} de ${r.elegibles}`}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-[var(--text-secondary)]">Personas que abrieron la app: hoy {u.sesiones.hoy} · 7 días {u.sesiones.semana} · 30 días {u.sesiones.mes}.</p>
      </Tarjeta>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" aria-busy="true" />}>
      <Contenido />
    </Suspense>
  );
}
