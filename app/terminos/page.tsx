import { PaginaLegal, Lista } from '@/components/legal/PaginaLegal';
import { RESPONSABLE } from '@/lib/legal';

export const metadata = { title: 'Términos y condiciones — NutriSnap AI' };

export default function Page() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      intro={<p>Al crear una cuenta o usar NutriSnap AI aceptas estos términos. Léelos: son cortos y escritos para que se entiendan.</p>}
      secciones={[
        {
          titulo: 'Qué es NutriSnap AI',
          cuerpo: <p>Una app web para registrar tus comidas con foto, voz o escáner de códigos, y seguir tu avance hacia una meta de peso. Es ofrecida por {RESPONSABLE.nombre}, persona natural, desde {RESPONSABLE.pais}.</p>,
        },
        {
          titulo: 'Qué NO es',
          cuerpo: <p>NutriSnap AI no es un servicio médico ni de nutrición profesional. Las calorías, macros, metas y fechas son <strong>estimaciones calculadas con inteligencia artificial y fórmulas generales</strong>, con margen de error. No diagnostican ni tratan nada ni reemplazan a un médico o nutricionista. Tú decides qué hacer con esa información y bajo tu responsabilidad. Lee también el <a href="/aviso-ia" className="font-semibold text-[var(--text-primary)] underline underline-offset-4">aviso sobre la inteligencia artificial</a>.</p>,
        },
        {
          titulo: 'Quién puede usarla',
          cuerpo: <p>Personas mayores de 18 años. Eres responsable de la veracidad de los datos que ingresas y de mantener el acceso a tu correo, que es tu llave de entrada.</p>,
        },
        {
          titulo: 'Plan gratuito y plan de pago',
          cuerpo: (
            <Lista items={[
              'Plan gratuito: incluye el escáner de códigos de barras, sin límite de tiempo.',
              'Plan de pago: incluye fotos con el Chequeo de Grasas Ocultas (hasta 8 por día), corrección por voz, puntos, logros y tu camino a la meta. Precios de lanzamiento: US$9.99 al mes o US$89.99 al año.',
              'Los cobros los procesa Hotmart. El valor final en tu moneda puede variar según tu banco o el tipo de cambio.',
            ]} />
          ),
        },
        {
          titulo: 'Prueba gratis, renovación y cancelación',
          cuerpo: (
            <Lista items={[
              <>La suscripción empieza con 7 días de prueba gratis. Al terminar, se cobra el plan que elegiste y <strong>se renueva automáticamente</strong> cada mes o cada año hasta que canceles.</>,
              'Te avisamos por correo 1 día antes del primer cobro, con la fecha y el monto.',
              'Puedes cancelar cuando quieras, sin llamar a nadie, desde tu cuenta de Hotmart (el enlace está en el correo de compra). Si cancelas, conservas el acceso hasta el final del periodo ya pagado. Si no puedes, escríbenos y lo cancelamos por ti.',
              'La garantía y los reembolsos están en la página de Reembolsos.',
            ]} />
          ),
        },
        {
          titulo: 'Uso justo y conducta',
          cuerpo: <p>El plan de pago incluye hasta 8 análisis por foto al día para mantener el servicio sostenible; los visitantes sin cuenta tienen un cupo menor de prueba. No puedes intentar vulnerar la app, extraer su contenido de forma automática, revender el acceso ni usarla para fines ilegales. Podemos suspender o cerrar cuentas que lo hagan.</p>,
        },
        {
          titulo: 'Tus datos y tus resultados',
          cuerpo: <p>Tus datos y tus fotos son tuyos; nos das permiso solo para tratarlos como explica la Política de privacidad. Los resultados que genera la IA para ti (estimaciones de calorías y macros) puedes usarlos libremente para tu uso personal. La app, su diseño, su código y su marca son de {RESPONSABLE.nombre}.</p>,
        },
        {
          titulo: 'Limitación de responsabilidad',
          cuerpo: <p>Damos el servicio «tal cual», haciendo lo posible por que funcione bien, pero no garantizamos que no tenga errores ni interrupciones, ni resultados de salud o de peso. En la medida que la ley lo permita, no respondemos por decisiones que tomes a partir de las estimaciones de la app ni por daños indirectos. Nuestra responsabilidad total se limita a lo que hayas pagado en los últimos 12 meses. Esto no limita los derechos que la ley colombiana te da como consumidor.</p>,
        },
        {
          titulo: 'Cambios, ley aplicable y disputas',
          cuerpo: <p>Si cambiamos estos términos de fondo, te avisamos por correo y en la app, y te pedimos aceptarlos de nuevo. Se rigen por las leyes de la República de Colombia. Si hay un conflicto, primero intentemos resolverlo escribiéndonos; si no, serán competentes las autoridades colombianas, incluida la Superintendencia de Industria y Comercio para temas de consumidor.</p>,
        },
      ]}
    />
  );
}
