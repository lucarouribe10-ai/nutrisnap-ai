/** Versión vigente de los textos legales (privacidad, términos, aviso de IA). Si cambian de fondo, se actualiza y se vuelve a pedir la autorización. */
export const VERSION_LEGAL = '2026-11-18';

/** Finalidades que la persona autoriza (separadas: no es una casilla única para todo). */
export const FINALIDADES = {
  datos_sensibles: 'Tratar tus datos de salud (peso, estatura, edad, sexo, alimentación), que son datos sensibles.',
  servicio: 'Crear tu cuenta y prestar el servicio (registro de comidas, plan, progreso).',
  ia_internacional: 'Enviar tus fotos al proveedor de inteligencia artificial en EE. UU. para estimar tus calorías.',
} as const;

export const TEXTO_AUTORIZACION = 'Autorizo el tratamiento de mis datos personales, incluidos mis datos de salud (peso, estatura y alimentación, que son datos sensibles) y la transferencia de mis fotos a un proveedor de inteligencia artificial en EE. UU., según la Política de privacidad, y acepto los Términos y condiciones.';

/** Responsable del tratamiento de los datos (Ley 1581 de 2012). Persona natural. */
export const RESPONSABLE = {
  nombre: 'Luisa',
  pais: 'Colombia',
  correo: 'soporte.nutrisnap@gmail.com',
  producto: 'NutriSnap AI',
  actualizacion: '18 de noviembre de 2026',
} as const;
