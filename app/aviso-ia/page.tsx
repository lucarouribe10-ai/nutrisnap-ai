import { PaginaLegal, Lista } from '@/components/legal/PaginaLegal';

export const metadata = { title: 'Aviso sobre la inteligencia artificial — NutriSnap AI' };

export default function Page() {
  return (
    <PaginaLegal
      titulo="Aviso sobre la inteligencia artificial"
      secciones={[
        {
          titulo: 'Qué hace la IA en NutriSnap',
          cuerpo: <p>Cuando tomas una foto de tu comida, un modelo de inteligencia artificial de Anthropic (EE. UU.) la mira y estima qué plato es y sus calorías y macros. La voz se transcribe con el servicio de tu navegador y se usa para completar el Chequeo de Grasas Ocultas.</p>,
        },
        {
          titulo: 'Son estimaciones',
          cuerpo: <p>El resultado es un estimado con margen de error: la cámara no ve el aceite, las porciones ni los ingredientes ocultos. Por eso el Chequeo de Grasas Ocultas te pregunta lo que la foto no muestra y puedes corregir cualquier dato. La IA puede equivocarse o generar información incorrecta o incompleta; verifícala cuando importe.</p>,
        },
        {
          titulo: 'No es consejo médico',
          cuerpo: (
            <>
              <p>Lo que ves es orientación general, no un consejo médico, nutricional ni profesional, y no reemplaza a un médico o nutricionista. Tú decides qué hacer con ella y bajo tu responsabilidad.</p>
              <Lista items={['Si tienes una condición de salud (diabetes, enfermedad renal, etc.), estás embarazada o en lactancia, o tomas medicamentos, consulta a un profesional antes de cambiar tu alimentación.', 'Si tienes o tuviste un trastorno de la conducta alimentaria, no uses la app para restringir tu comida sin acompañamiento profesional.', 'Un déficit de calorías muy agresivo puede ser dañino: la app no sustituye el criterio de un especialista.']} />
            </>
          ),
        },
        {
          titulo: 'Qué debes saber de tus fotos',
          cuerpo: <p>Tus fotos se envían al proveedor de IA solo para analizarlas. No guardamos la foto original, solo una miniatura y el resultado. Evita fotografiar documentos, rostros de otras personas o información sensible. Más detalles en la Política de privacidad.</p>,
        },
      ]}
    />
  );
}
