import Link from 'next/link';
import { Activity, Users, Wallet } from 'lucide-react';
import { dinero, usd } from '@/lib/admin/formato';
import { Heroe, SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Aviso } from '@/components/admin/Aviso';
import { Entrada } from '@/components/admin/Entrada';

export type DatosResumen = {
  mes: string; // «noviembre de 2026», calculado por la página (después del acceso dinámico)
  r: { usuarios_total: number; nuevos_7d: number; activos_7d: number; activos_30d: number; con_datos: number; con_acceso: number; eventos_24h: number; errores_abiertos: number } | null;
  ventas: number;
  porMoneda: [string, number][];
  llamadas: number;
  conCosto: number;
  costoIA: number;
  sinPrecio: number;
};

export function ResumenVista({ d }: { d: DatosResumen }) {
  const { r, ventas, porMoneda, llamadas, conCosto, costoIA, sinPrecio } = d;
  const errores = r?.errores_abiertos ?? 0;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Resumen</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Lo que más te importa, de un vistazo · {d.mes}</p>
      </div>

      {errores > 0
        ? (
          <Aviso tono="atencion" titulo={`${errores} ${errores === 1 ? 'error sin resolver' : 'errores sin resolver'} esta semana`} detalle="Alguien pudo chocar con un problema en la app.">
            <Link href="/admin/salud" className="mt-1 inline-flex min-h-11 items-center text-[14px] font-bold text-[var(--durazno-tinta)] underline underline-offset-4">Ver cuál en Salud</Link>
          </Aviso>
        )
        : <Aviso tono="neutro" titulo="Sin errores abiertos esta semana" detalle="Los cobros todavía no se miden: falta conectar Hotmart." />}

      <Entrada i={1}>
        <Tarjeta titulo="Personas con cuenta" ayuda="Cuentas creadas en total. Debajo: cuántas son nuevas esta semana y cuántas iniciaron sesión en los últimos 7 y 30 días (iniciar sesión no es lo mismo que abrir la app: eso lo ves en la pestaña Uso)." icono={<Users size={18} />}>
          {r === null ? <SinDatos>Sin datos: no se pudo leer el resumen. Recarga la página.</SinDatos> : (
            <>
              <Heroe grande valor={r.usuarios_total} />
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">cuentas en total</p>
              <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
                {([[r.nuevos_7d, 'nuevas en 7 días'], [r.activos_7d, 'entraron en 7 días'], [r.activos_30d, 'entraron en 30 días']] as const).map(([n, l]) => (
                  <li key={l} className="rounded-[16px] bg-[var(--surface-2)] px-2 py-3"><p className="text-[18px] font-extrabold tabular-nums">{n}</p><p className="mt-1 text-[12px] font-semibold text-[var(--text-secondary)]">{l}</p></li>
                ))}
              </ul>
            </>
          )}
        </Tarjeta>
      </Entrada>

      <Entrada i={2}>
        <Tarjeta titulo="Dinero de este mes" ayuda="Ingresos: lo cobrado por tus ventas aprobadas, por moneda (nunca se suman monedas distintas). Ganancia real: lo que te queda después de pagar Hotmart, comisiones, impuestos, IA, servidores y correos; se calcula cuando haya ventas y se registren esos costos." icono={<Wallet size={18} />}>
          {porMoneda.length > 0
            ? <div className="flex flex-col gap-1">{porMoneda.map(([m, v], k) => <Heroe key={m} grande={k === 0}>{dinero(v, m)}</Heroe>)}<p className="mt-1 text-[13px] text-[var(--text-secondary)]">Ingresos del mes · {ventas} {ventas === 1 ? 'venta' : 'ventas'}</p></div>
            : <><p className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Sin ventas todavía</p><p className="mt-1 text-[13px] text-[var(--text-secondary)]">Los ingresos del mes aparecen con la primera venta.</p></>}
          <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--surface-2)] pt-3 text-[15px]">
            <li className="flex items-baseline justify-between gap-3"><span className="shrink-0">Ganancia real</span><span className="text-right font-medium text-[var(--text-secondary)]">{ventas === 0 ? 'Se calcula con la primera venta' : 'Aún no se calcula'}</span></li>
            <li className="flex items-baseline justify-between gap-3">
              <span>Costo de la IA</span>
              <strong className="text-right tabular-nums">
                {llamadas === 0 ? <span className="font-medium text-[var(--text-secondary)]">Sin fotos analizadas</span>
                  : conCosto === 0 ? <span className="font-medium text-[var(--text-secondary)]">Falta anotar el precio</span>
                  : usd(costoIA)}
              </strong>
            </li>
          </ul>
          {sinPrecio > 0 && conCosto > 0 && <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{sinPrecio} {sinPrecio === 1 ? 'llamada' : 'llamadas'} sin precio no están incluidas.</p>}
        </Tarjeta>
      </Entrada>

      <Entrada i={3}>
        <Tarjeta titulo="Actividad real" ayuda="Cuántas cuentas ya tienen datos propios (completaron el recorrido), cuántas tienen acceso activo y cuántos eventos de uso llegaron en las últimas 24 horas." icono={<Activity size={18} />}>
          {r === null ? <SinDatos>Sin datos: no se pudo leer el resumen.</SinDatos> : (
            <ul className="flex flex-col gap-2 text-[15px]">
              <li className="flex justify-between gap-3"><span>Cuentas con datos propios</span><strong className="tabular-nums">{r.con_datos}</strong></li>
              <li className="flex justify-between gap-3"><span>Cuentas con acceso activo</span><strong className="tabular-nums">{r.con_acceso}</strong></li>
              <li className="flex justify-between gap-3"><span>Eventos de uso (24 h)</span><strong className="tabular-nums">{r.eventos_24h}</strong></li>
            </ul>
          )}
        </Tarjeta>
      </Entrada>
    </div>
  );
}
