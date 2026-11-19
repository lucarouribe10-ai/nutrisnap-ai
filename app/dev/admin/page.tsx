import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { mesYAnio, rangoDias } from '@/lib/admin/formato';
import { Suspense } from 'react';
import { Marco } from '@/components/admin/Marco';
import { ResumenVista, type DatosResumen } from '@/components/admin/vistas/ResumenVista';
import { SaludVista, type DatosSalud } from '@/components/admin/vistas/SaludVista';
import { UsoVista, type DatosUso } from '@/components/admin/vistas/UsoVista';
import { IaVista, type DatosIa } from '@/components/admin/vistas/IaVista';

// SOLO desarrollo con DEV_BYPASS_AUTH=1: muestra las 4 pestañas con datos de EJEMPLO (llenas, vacías y con errores) para revisarlas a 375 y 1440 px.
// En producción responde 404 y no toca ningún dato real.

const resumenVacio: Omit<DatosResumen, 'mes'> = { r: { usuarios_total: 2, nuevos_7d: 2, activos_7d: 2, activos_30d: 2, con_datos: 1, con_acceso: 1, eventos_24h: 14, errores_abiertos: 0 }, ventas: 0, porMoneda: [], llamadas: 0, conCosto: 0, costoIA: 0, sinPrecio: 0 };
const resumenLleno: Omit<DatosResumen, 'mes'> = { r: { usuarios_total: 128, nuevos_7d: 23, activos_7d: 61, activos_30d: 97, con_datos: 84, con_acceso: 52, eventos_24h: 640, errores_abiertos: 3 }, ventas: 41, porMoneda: [['USD', 20_459], ['COP', 380_000]], llamadas: 1840, conCosto: 1840, costoIA: 0.62, sinPrecio: 0 };

const grupos = [
  { clave: 'a', claro: 'Se cortó la conexión mientras la app guardaba o pedía algo', mensaje: 'TypeError: Failed to fetch', contexto: 'Registrar comida', n: 7, personas: 3, hace: 'hace 2 h' },
  { clave: 'b', claro: 'Una pantalla intentó usar un dato que no existía', mensaje: "TypeError: Cannot read properties of undefined (reading 'kcal')", contexto: 'Hoy', n: 2, personas: 2, hace: 'hace 1 día' },
  { clave: 'c', claro: 'Algo falló en la app', mensaje: 'Unexpected end of JSON input', contexto: 'Progreso', n: 1, personas: 1, hace: 'hace 3 días' },
];
const saludVacia: DatosSalud = { falloCarga: false, grupos: [], abiertos: 0, hotTotal: 0, hotFallos: 0, hotUltimo: null };
const saludConErrores: DatosSalud = { falloCarga: false, grupos, abiertos: 10, hotTotal: 12, hotFallos: 1, hotUltimo: 'hace 3 h' };

const usoVacio: DatosUso = { dias: 30, embudo: ['landing_vista', 'onboarding_iniciado', 'resultado_visto', 'chequeo_respondido', 'plan_construido', 'paywall_visto', 'checkout_iniciado', 'login_exitoso'].map((evento) => ({ evento, personas: 0 })), comidas: { hoy: 0, semana: 0, periodo: 0, por_foto: 0, rapidas: 0 }, activacion: { cuentas: 2, activadas: 1 }, retencion: [1, 7, 30].map((dia) => ({ dia, elegibles: 0, volvieron: 0 })), sesiones: { hoy: 1, semana: 2, mes: 2 } };
const usoLleno: DatosUso = { dias: 30, embudo: [{ evento: 'landing_vista', personas: 940 }, { evento: 'onboarding_iniciado', personas: 410 }, { evento: 'resultado_visto', personas: 322 }, { evento: 'chequeo_respondido', personas: 288 }, { evento: 'plan_construido', personas: 250 }, { evento: 'paywall_visto', personas: 201 }, { evento: 'checkout_iniciado', personas: 64 }, { evento: 'login_exitoso', personas: 0 }], comidas: { hoy: 96, semana: 702, periodo: 2814, por_foto: 2190, rapidas: 624 }, activacion: { cuentas: 128, activadas: 97 }, retencion: [{ dia: 1, elegibles: 120, volvieron: 66 }, { dia: 7, elegibles: 84, volvieron: 31 }, { dia: 30, elegibles: 0, volvieron: 0 }], sesiones: { hoy: 44, semana: 118, mes: 301 } };

const dias14 = (f: (i: number) => number) => Array.from({ length: 14 }, (_, i) => { const n = f(i); return { etiqueta: `${5 + i} nov`, n, costo: n * 0.000178, con: n > 0 ? n : 0 }; });
const iaVacia: DatosIa = { llamadasMes: 0, conPrecioMes: 0, costoMes: 0, llamadasHoy: 0, conPrecioHoy: 0, costoHoy: 0, fallidas: 0, promedioMs: null, pctIngresos: null, precioConfigurado: true, hayReales: false, porDia: dias14(() => 0) };
const iaLlena: DatosIa = { llamadasMes: 1840, conPrecioMes: 1840, costoMes: 0.62, llamadasHoy: 96, conPrecioHoy: 96, costoHoy: 0.02, fallidas: 12, promedioMs: 1240, pctIngresos: 0.8, precioConfigurado: true, hayReales: true, porDia: dias14((i) => [0, 0, 12, 40, 88, 120, 96, 150, 170, 140, 160, 180, 210, 96][i]) };

async function Contenido({ params }: { params: Promise<{ v?: string; e?: string }> }) {
  if (process.env.NODE_ENV === 'production' || process.env.DEV_BYPASS_AUTH !== '1') notFound();
  await connection();
  const { v = 'resumen', e = 'vacio' } = await params;
  const lleno = e === 'lleno';
  const ruta = v === 'salud' ? '/admin/salud' : v === 'uso' ? '/admin/uso' : v === 'ia' ? '/admin/ia' : '/admin';
  return (
    <Marco rutaForzada={ruta}>
      {v === 'salud' ? <SaludVista d={lleno ? saludConErrores : saludVacia} demo />
        : v === 'uso' ? <UsoVista u={lleno ? usoLleno : usoVacio} rango={rangoDias(30)} enlaces={false} />
        : v === 'ia' ? <IaVista d={lleno ? iaLlena : iaVacia} />
        : <ResumenVista d={{ ...(lleno ? resumenLleno : resumenVacio), mes: mesYAnio() }} />}
    </Marco>
  );
}

export default function Page({ searchParams }: { searchParams: Promise<{ v?: string; e?: string }> }) {
  return <Suspense fallback={null}><Contenido params={searchParams} /></Suspense>;
}
