import Link from 'next/link';
import { Camera, Filter, Repeat, Zap } from 'lucide-react';
import { Heroe, SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Entrada } from '@/components/admin/Entrada';
import { Barra } from '@/components/admin/Barra';

export type DatosUso = {
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
  chequeo_respondido: 'Respondieron el Chequeo de Grasas Ocultas',
  plan_construido: 'Vieron su plan',
  paywall_visto: 'Llegaron a la pantalla de planes',
  checkout_iniciado: 'Tocaron «Empezar mis 7 días gratis»',
  login_exitoso: 'Entraron con su código',
};

const PRINCIPALES = ['landing_vista', 'resultado_visto', 'paywall_visto', 'checkout_iniciado', 'login_exitoso'];
export const PERIODOS = [7, 30, 90] as const;
const n = (v: number) => new Intl.NumberFormat('es-CO').format(v);
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : null);

export function UsoVista({ u, rango, enlaces = true }: { u: DatosUso; rango: string; enlaces?: boolean }) {
  // Cinco pasos principales (los que deciden el dinero); los del recorrido de inicio van plegados para no saturar.
  const activos = u.embudo.filter((p) => p.personas > 0);
  const principales = u.embudo.filter((p) => PRINCIPALES.includes(p.evento));
  const intermedios = u.embudo.filter((p) => !PRINCIPALES.includes(p.evento));
  const max = Math.max(1, ...u.embudo.map((p) => p.personas));
  const hayRetencion = u.retencion.some((r) => r.elegibles > 0);
  const tasaActivacion = pct(u.activacion.activadas, u.activacion.cuentas);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Uso</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Qué hace la gente en tu app.</p>
      </div>

      <div>
        <ul className="flex gap-2" aria-label="Periodo">
          {PERIODOS.map((p) => {
            const activo = p === u.dias;
            const clases = `flex h-11 items-center rounded-full px-4 text-[14px] font-semibold ${activo ? 'bg-[var(--negro)] text-[var(--on-negro)]' : 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'}`;
            return <li key={p}>{enlaces ? <Link href={`/admin/uso?dias=${p}`} aria-current={activo ? 'true' : undefined} className={clases}>{p} días</Link> : <span className={clases}>{p} días</span>}</li>;
          })}
        </ul>
        <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{rango}</p>
      </div>

      <Entrada i={1}>
        <Tarjeta titulo="Comidas registradas" ayuda="Cuántas comidas registró la gente: la acción principal de la app. Foto = con Chequeo de Grasas Ocultas; rápida = escrita a mano." icono={<Camera size={18} />}>
          {u.comidas.periodo === 0 ? <SinDatos>Todavía nadie registró una comida en la app publicada.</SinDatos> : (
            <>
              <Heroe grande valor={u.comidas.periodo} />
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Hoy {n(u.comidas.hoy)} · últimos 7 días {n(u.comidas.semana)} · {n(u.comidas.por_foto)} con foto · {n(u.comidas.rapidas)} rápidas</p>
            </>
          )}
        </Tarjeta>
      </Entrada>

      <Entrada i={2}>
        <Tarjeta titulo="Primera comida registrada" ayuda="De las cuentas creadas en este periodo, cuántas ya registraron al menos una comida. Es la señal de que la app les sirvió." icono={<Zap size={18} />}>
          {u.activacion.cuentas === 0 ? <SinDatos>No hay cuentas nuevas en este periodo.</SinDatos> : (
            <>
              <Heroe valor={tasaActivacion ?? 0} sufijo="%" />
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{u.activacion.activadas} de {u.activacion.cuentas} {u.activacion.cuentas === 1 ? 'cuenta registró' : 'cuentas registraron'} su primera comida.</p>
            </>
          )}
        </Tarjeta>
      </Entrada>

      <Entrada i={3}>
        <Tarjeta titulo="Recorrido de venta" ayuda="Cuántas personas distintas llegan a cada paso, de la página de ventas a entrar a la app. Donde más bajan es donde más se pierden." icono={<Filter size={18} />}>
          {activos.length === 0 ? <SinDatos>Las visitas empiezan a contarse desde ahora. Se llena cuando entre gente a tu página.</SinDatos> : (
            <>
              <ol className="flex flex-col gap-4">
                {principales.map((p, i) => {
                  const previo = i > 0 ? principales[i - 1].personas : null;
                  const paso = previo !== null && previo > 0 ? pct(p.personas, previo) : null;
                  return (
                    <li key={p.evento}>
                      <div className="flex items-baseline justify-between gap-3 text-[14px]">
                        <span>{PASOS[p.evento] ?? p.evento}</span>
                        <span className="shrink-0 font-bold tabular-nums">{n(p.personas)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <Barra pct={(p.personas / max) * 100} i={i} />
                        <span className="w-20 shrink-0 text-right text-[12px] font-semibold text-[var(--text-secondary)]">{paso !== null ? `${paso}% pasó` : ''}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {intermedios.length > 0 && (
                <details className="mt-3 text-[13px] text-[var(--text-secondary)]">
                  <summary className="flex min-h-11 cursor-pointer items-center font-semibold underline underline-offset-4">Ver los pasos del recorrido de inicio ({intermedios.length})</summary>
                  <ul className="mt-1 flex flex-col gap-2">
                    {intermedios.map((p) => <li key={p.evento} className="flex items-baseline justify-between gap-3"><span>{PASOS[p.evento] ?? p.evento}</span><strong className="tabular-nums text-[var(--text-primary)]">{n(p.personas)}</strong></li>)}
                  </ul>
                </details>
              )}
            </>
          )}
        </Tarjeta>
      </Entrada>

      <Entrada i={4}>
        <Tarjeta titulo="Vuelven a la app" ayuda="De las personas que ya cumplieron N días con cuenta, cuántas volvieron justo ese día. Mide si la app genera hábito. Con pocas cuentas el porcentaje no es confiable." icono={<Repeat size={18} />}>
          {!hayRetencion ? <SinDatos>Todavía no hay datos: se llena cuando alguien cumpla 1 día con cuenta.</SinDatos> : (
            <ul className="grid grid-cols-3 gap-2 text-center">
              {u.retencion.map((r) => (
                <li key={r.dia} className="rounded-[16px] bg-[var(--surface-2)] px-2 py-3">
                  <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Día {r.dia}</p>
                  <p className="mt-1 text-[22px] font-extrabold tabular-nums">{r.elegibles === 0 ? '—' : `${pct(r.volvieron, r.elegibles)}%`}</p>
                  <p className="text-[13px] text-[var(--text-secondary)]">{r.elegibles === 0 ? 'Aún nadie' : `${r.volvieron} de ${r.elegibles}`}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[13px] text-[var(--text-secondary)]">Personas que abrieron la app: hoy {u.sesiones.hoy} · 7 días {u.sesiones.semana} · 30 días {u.sesiones.mes}.</p>
        </Tarjeta>
      </Entrada>
    </div>
  );
}
