import { Bug, Plug, Scale } from 'lucide-react';
import { SinDatos, Tarjeta } from '@/components/admin/Tarjeta';
import { Aviso } from '@/components/admin/Aviso';
import { Entrada } from '@/components/admin/Entrada';
import { ListaErrores, type GrupoError } from '@/components/admin/ListaErrores';

export type DatosSalud = {
  falloCarga: boolean;
  grupos: GrupoError[];
  abiertos: number;
  hotTotal: number;
  hotFallos: number;
  hotUltimo: string | null; // texto «hace 3 h»
};

export function SaludVista({ d, demo = false }: { d: DatosSalud; demo?: boolean }) {
  const hayProblema = d.abiertos > 0 || d.hotFallos > 0;
  const hotmartConectado = d.hotTotal > 0;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] [font-family:var(--font-display)]">Salud</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">Errores de la app y estado de las conexiones, en lenguaje claro.</p>
      </div>

      {hayProblema
        ? <Aviso tono="atencion" titulo="Hay cosas que revisar" detalle={`${d.abiertos > 0 ? `${d.abiertos} ${d.abiertos === 1 ? 'error sin resolver' : 'errores sin resolver'} en los últimos 7 días. ` : ''}${d.hotFallos > 0 ? `${d.hotFallos} ${d.hotFallos === 1 ? 'aviso de Hotmart con problema.' : 'avisos de Hotmart con problema.'}` : ''}`.trim()} />
        : hotmartConectado
          ? <Aviso tono="ok" titulo="Todo en orden" detalle="Sin errores abiertos esta semana y los avisos de Hotmart llegan bien." />
          : <Aviso tono="neutro" titulo="Sin problemas conocidos" detalle="No hay errores abiertos esta semana. Falta conectar Hotmart: hasta entonces los cobros no se pueden vigilar." />}

      <Entrada i={1}>
        <Tarjeta titulo="Errores sin resolver (7 días)" ayuda="Problemas que vivieron las personas en la app, agrupados: primero los que más se repiten. Cuando arreglas uno, márcalo como resuelto (puedes deshacerlo)." icono={<Bug size={18} />}>
          {d.falloCarga ? <SinDatos>No se pudieron cargar los errores. Recarga la página; si sigue igual, avisa a soporte técnico.</SinDatos>
            : d.grupos.length === 0 ? <SinDatos>Sin errores abiertos esta semana.</SinDatos>
            : <ListaErrores grupos={d.grupos} demo={demo} />}
        </Tarjeta>
      </Entrada>

      <Entrada i={2}>
        <Tarjeta titulo="Conexión con Hotmart" ayuda="Si Hotmart está avisando a tu app cuando alguien paga. Si falla, los pagos podrían no dar acceso." icono={<Plug size={18} />}>
          {!hotmartConectado ? <SinDatos>Hotmart todavía no está conectado. Se llena cuando conectemos el cobro.</SinDatos>
            : <p className="text-[15px]">Último aviso recibido {d.hotUltimo}. {d.hotFallos === 0 ? 'Todos los recientes se procesaron bien.' : `${d.hotFallos} de los últimos ${d.hotTotal} tuvieron problema. Entra a Hotmart y revisa que el aviso (webhook) hacia tu app esté activo; si sigue fallando, avisa a soporte técnico.`}</p>}
        </Tarjeta>
      </Entrada>

      <Entrada i={3}>
        <Tarjeta titulo="Diferencias de cobro" ayuda="Compara lo que dice Hotmart con lo que dice tu base de datos. Lo sano es cero diferencias." icono={<Scale size={18} />}>
          <SinDatos>Se calcula cuando haya cobros reales.</SinDatos>
        </Tarjeta>
      </Entrada>
    </div>
  );
}
