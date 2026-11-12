// Cálculo del plan (Mifflin-St Jeor). Estimaciones, no consejo médico (ver /aviso-ia).
export type Objetivo = 'definir' | 'ganar' | 'mantener';
export type Sexo = 'hombre' | 'mujer';

export interface Perfil {
  objetivo?: Objetivo;
  sexo?: Sexo;
  edad?: number;
  estatura?: number; // cm
  peso?: number; // kg
  meta?: number; // kg (opcional)
  dias?: number; // días de entrenamiento por semana (2, 4, 6, 7)
}

export interface Plan {
  kcal: number;
  proteina: number;
  grasas: number;
  carbos: number;
  tdee: number;
  ritmoKgSemana: number; // negativo = baja
  avisoMeta?: string;
}

const FACTOR_ACTIVIDAD: Record<number, number> = { 2: 1.375, 4: 1.55, 6: 1.725, 7: 1.8 };
const PISO_KCAL: Record<Sexo, number> = { hombre: 1500, mujer: 1200 };

export function perfilCompleto(p: Perfil): p is Required<Omit<Perfil, 'meta'>> & { meta?: number } {
  return Boolean(p.objetivo && p.sexo && p.edad && p.estatura && p.peso && p.dias);
}

export function calcularPlan(p: Required<Omit<Perfil, 'meta'>> & { meta?: number }): Plan {
  const base = 10 * p.peso + 6.25 * p.estatura - 5 * p.edad + (p.sexo === 'hombre' ? 5 : -161);
  const tdee = Math.round(base * (FACTOR_ACTIVIDAD[p.dias] ?? 1.55));
  const ajuste = p.objetivo === 'definir' ? -0.2 : p.objetivo === 'ganar' ? 0.1 : 0;
  let kcal = Math.round((tdee * (1 + ajuste)) / 10) * 10;
  // Seguridad: nunca por debajo del piso ni más de 1% del peso por semana de pérdida.
  kcal = Math.max(kcal, PISO_KCAL[p.sexo]);
  const maxDeficitDia = (0.01 * p.peso * 7700) / 7;
  if (p.objetivo === 'definir') kcal = Math.max(kcal, Math.round((tdee - maxDeficitDia) / 10) * 10);
  const proteina = Math.round((p.objetivo === 'definir' ? 2.0 : p.objetivo === 'ganar' ? 1.8 : 1.6) * p.peso);
  const grasas = Math.round((kcal * 0.25) / 9);
  const carbos = Math.max(0, Math.round((kcal - proteina * 4 - grasas * 9) / 4));
  const ritmoKgSemana = Math.round((((kcal - tdee) * 7) / 7700) * 100) / 100;

  let avisoMeta: string | undefined;
  if (p.meta) {
    const imc = p.meta / Math.pow(p.estatura / 100, 2);
    if (imc < 18.5) avisoMeta = 'Tu meta queda por debajo de un peso saludable para tu estatura. Te sugiero hablarlo con un profesional de la salud.';
    else if (p.objetivo === 'definir' && p.meta >= p.peso) avisoMeta = 'Tu meta es igual o mayor a tu peso actual; revisa que sea la que quieres.';
  }
  return { kcal, proteina, grasas, carbos, tdee, ritmoKgSemana, avisoMeta };
}

export const ETIQUETA_OBJETIVO: Record<Objetivo, string> = {
  definir: 'definir',
  ganar: 'ganar músculo',
  mantener: 'mantener tu peso',
};
