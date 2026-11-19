import { CalendarDays, Camera, Sparkles, Sun, Timer, Wallet } from 'lucide-react';
import { num, usd } from '@/lib/admin/formato';
import { Heroe, SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Aviso } from '@/components/admin/Aviso';
import { Entrada } from '@/components/admin/Entrada';
import { Barra } from '@/components/admin/Barra';

export type DatosIa = {
  llamadasMes: number;
  conPrecioMes: number;
  costoMes: number;
  llamadasHoy: number;
  conPrecioHoy: number;
  costoHoy: number;
  fallidas: number;
  promedioMs: number | null;
  pctIngresos: number | null;
  precioConfigurado: boolean;
  hayReales: boolean;
  /** Del día más viejo al más nuevo (así se lee un gráfico en el tiempo). `etiqueta` ya viene como «13 nov». */
  porDia: { etiqueta: string; n: number; costo: number; con: number }[];
};

export function IaVista({ d }: { d: DatosIa }) {
  const maxN = Math.max(1, ...d.porDia.map((x) => x.n));
  const aviso: { tono: 'ok' | 'atencion' | 'neutro'; t: string; d: string } =
    d.pctIngresos !== null && d.pctIngresos > 20
      ? { tono: 'atencion', t: `La IA se está comiendo el ${Math.round(d.pctIngresos)}% de lo que cobras`, d: 'Pasa del 20% sano. Revisa los límites de uso por persona o el precio de los planes.' }
      : !d.precioConfigurado && d.llamadasMes > 0
        ? { tono: 'atencion', t: 'Falta anotar el precio de la IA', d: 'Sin ese precio no se puede calcular cuánto cuestan las fotos. Avisa a soporte técnico para anotarlo.' }
        : d.llamadasMes === 0
          ? { tono: 'neutro', t: 'Aún no hay gasto que evaluar', d: 'Se llena con las primeras fotos analizadas de verdad.' }
          : { tono: 'ok', t: 'El gasto de IA está en orden', d: d.pctIngresos !== null ? `Es el ${num(d.pctIngresos, 1)}% de lo que cobras este mes.` : 'Todavía no hay ingresos con los que compararlo.' };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Costo de IA</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Cuánto cuesta analizar las fotos de la gente.</p>
      </div>

      <Aviso tono={aviso.tono} titulo={aviso.t} detalle={aviso.d} />

      {d.llamadasMes === 0 ? (
        <Entrada i={1}>
          <Tarjeta titulo="Costo de las fotos" ayuda="Aquí verás el costo del mes y de hoy, cuántas fotos se analizaron y qué tan rápido responde la IA. Las pruebas de ejemplo no cuentan." icono={<Sparkles size={18} />}>
            <SinDatos>Todavía no hay fotos analizadas con la IA real este mes. En cuanto alguien registre una comida con foto, aquí verás cuánto cuesta.</SinDatos>
          </Tarjeta>
        </Entrada>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Entrada i={1} className="h-full">
            <Tarjeta titulo="Costo del mes" ayuda="Suma del costo de las fotos analizadas este mes. Las pruebas de ejemplo (sin IA real) no cuentan." icono={<Wallet size={18} />}>
              {d.conPrecioMes === 0 ? <SinDatos>{d.llamadasMes} fotos analizadas, pero falta anotar el precio de la IA para calcular el costo.</SinDatos>
                : <><Heroe grande valor={d.costoMes} prefijo="USD " decimales={d.costoMes < 0.01 ? 4 : d.costoMes < 10 ? 2 : 0} /><p className="mt-2 text-[13px] text-[var(--text-secondary)]">{d.pctIngresos !== null ? `${num(d.pctIngresos, 1)}% de tus ingresos del mes.` : 'Aún no hay ingresos con los que compararlo.'}</p></>}
            </Tarjeta>
          </Entrada>
          <Entrada i={2} className="h-full">
            <Tarjeta titulo="Costo de hoy" ayuda="Lo que costó la IA desde las 00:00 de hoy." icono={<Sun size={18} />}>
              {d.llamadasHoy === 0 ? <SinDatos>Hoy no se analizó ninguna foto.</SinDatos>
                : d.conPrecioHoy === 0 ? <SinDatos>{d.llamadasHoy} fotos hoy, sin precio anotado.</SinDatos>
                : <Heroe>{usd(d.costoHoy)}</Heroe>}
            </Tarjeta>
          </Entrada>
          <Entrada i={3} className="h-full">
            <Tarjeta titulo="Fotos analizadas" ayuda="Cuántas fotos se analizaron con la IA este mes y cuántas fallaron." icono={<Camera size={18} />}>
              <Heroe valor={d.llamadasMes} />
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{d.fallidas === 0 ? 'Ninguna falló.' : `${d.fallidas} fallaron (${Math.round((d.fallidas / d.llamadasMes) * 100)}%).`}</p>
            </Tarjeta>
          </Entrada>
          <Entrada i={4} className="h-full">
            <Tarjeta titulo="Rapidez" ayuda="Tiempo promedio que tarda la IA en responder una foto." icono={<Timer size={18} />}>
              {d.promedioMs === null ? <SinDatos>Todavía no hay tiempos medidos.</SinDatos> : <Heroe valor={d.promedioMs / 1000} decimales={1} sufijo=" s" />}
            </Tarjeta>
          </Entrada>
        </div>
      )}

      <Entrada i={5}>
        <Tarjeta titulo="Últimos 14 días" ayuda="Fotos analizadas por día y su costo (si el precio está anotado). De izquierda a derecha en el tiempo: arriba el día más antiguo." icono={<CalendarDays size={18} />}>
          {!d.hayReales ? <SinDatos>Aún no hay fotos analizadas con la IA real.</SinDatos> : (
            <ul className="flex flex-col gap-2">
              {d.porDia.map((x, i) => (
                <li key={x.etiqueta} className="flex items-center gap-3 text-[13px]">
                  <span className="w-12 shrink-0 text-[var(--text-secondary)]">{x.etiqueta}</span>
                  <Barra pct={(x.n / maxN) * 100} i={i} />
                  <span className="w-32 shrink-0 whitespace-nowrap text-right font-semibold tabular-nums">{x.n} · {x.con > 0 ? usd(x.costo) : '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </Entrada>
    </div>
  );
}
