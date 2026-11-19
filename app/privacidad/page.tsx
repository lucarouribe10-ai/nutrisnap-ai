import { PaginaLegal, Lista } from '@/components/legal/PaginaLegal';
import { RESPONSABLE } from '@/lib/legal';

export const metadata = { title: 'Política de privacidad — NutriSnap AI' };

export default function Page() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      intro={<p>Esta política explica qué datos tuyos trata NutriSnap AI, para qué, con quién los compartimos y cómo ejercer tus derechos. Aplica la Ley 1581 de 2012 de Colombia (protección de datos personales).</p>}
      secciones={[
        {
          titulo: 'Quién es el responsable',
          cuerpo: <p>{RESPONSABLE.nombre}, persona natural, desde {RESPONSABLE.pais}, es la responsable del tratamiento de tus datos. Contacto: {RESPONSABLE.correo}.</p>,
        },
        {
          titulo: 'Qué datos recogemos',
          cuerpo: (
            <Lista items={[
              <><strong>De tu cuenta:</strong> tu correo electrónico y tu nombre.</>,
              <><strong>De tu perfil (datos de salud, que son datos sensibles):</strong> objetivo, edad, sexo, estatura, peso actual y peso meta, nivel de actividad, y lo que registras de tu alimentación (comidas, calorías, macros y una miniatura de la foto).</>,
              <><strong>De tu uso:</strong> racha, puntos y logros; y registros técnicos de lo que haces en la app (por ejemplo, qué pantallas abres) con un identificador anónimo de tu navegador.</>,
              <><strong>Técnicos:</strong> errores de la app (mensaje, pantalla y tipo de navegador) y, para las llamadas a la IA, la fecha, el tamaño, el costo y una huella irreversible de tu conexión (no tu dirección IP) que usamos para limitar abusos.</>,
              <><strong>De tus pagos:</strong> los datos de la tarjeta o del medio de pago los recibe y guarda Hotmart; nosotros nunca los vemos. Recibimos de Hotmart tu correo, el plan, el monto y el estado de tu suscripción.</>,
            ]} />
          ),
        },
        {
          titulo: 'Para qué los usamos',
          cuerpo: <Lista items={['Crear tu cuenta, calcular tu plan y tu progreso, y mostrártelo en cualquier dispositivo.', 'Estimar las calorías y macros de tus fotos con inteligencia artificial.', 'Enviarte el código de acceso y avisos del servicio (por ejemplo, antes de un cobro).', 'Cobrar tu suscripción, atender reembolsos y darte soporte.', 'Mantener la app segura, medir su uso en conjunto y corregir errores.']} />,
        },
        {
          titulo: 'Datos sensibles',
          cuerpo: <p>Tu peso, estatura y alimentación son datos relacionados con la salud y la ley los trata como sensibles. No estás obligado a dárnoslos, pero sin ellos la app no puede calcular tu plan. Solo los usamos para darte el servicio, nunca para publicidad ni los vendemos. Los tratamos únicamente con tu autorización expresa, que te pedimos al crear tu cuenta.</p>,
        },
        {
          titulo: 'Fotos y voz',
          cuerpo: <Lista items={['Cuando tomas una foto, se envía a un proveedor de inteligencia artificial para estimar el plato. No guardamos la foto original: solo una miniatura y los resultados.', 'La voz se transcribe con el servicio de reconocimiento de voz de tu propio navegador (en Chrome lo procesa Google; en Safari, Apple). Nosotros solo recibimos el texto, nunca el audio.']} />,
        },
        {
          titulo: 'Con quién los compartimos',
          cuerpo: (
            <>
              <p>No vendemos tus datos. Solo los compartimos con los proveedores que hacen funcionar la app, y solo lo necesario para su función:</p>
              <Lista items={[
                <><strong>Supabase</strong> (EE. UU.): base de datos y acceso a tu cuenta.</>,
                <><strong>Vercel</strong> (EE. UU.): alojamiento de la app.</>,
                <><strong>Anthropic</strong> (EE. UU.): inteligencia artificial que analiza tus fotos. Según sus términos comerciales, no usa los datos enviados por su API para entrenar sus modelos.</>,
                <><strong>Resend</strong> (EE. UU.): envío del correo con tu código de acceso.</>,
                <><strong>Hotmart</strong> (Brasil): cobro de la suscripción y reembolsos.</>,
              ]} />
              <p>También podemos compartir datos si una autoridad competente lo exige conforme a la ley.</p>
            </>
          ),
        },
        {
          titulo: 'Transferencia internacional',
          cuerpo: <p>Los proveedores anteriores están fuera de Colombia, principalmente en EE. UU. Al autorizar esta política aceptas que tus datos, incluidas tus fotos, se procesen allí bajo los términos de cada proveedor.</p>,
        },
        {
          titulo: 'Cookies y almacenamiento',
          cuerpo: <p>Usamos solo lo indispensable: una cookie de sesión para mantenerte dentro de tu cuenta y almacenamiento local de tu navegador para guardar tu progreso. No usamos cookies de publicidad ni de seguimiento de terceros.</p>,
        },
        {
          titulo: 'Cuánto tiempo los guardamos',
          cuerpo: <p>Mientras tengas tu cuenta. Si la eliminas, borramos tu cuenta, tu perfil, tu progreso y tus registros de uso, errores y llamadas de IA. Solo conservamos los comprobantes de pago, sin vínculo con tu cuenta, durante el tiempo que exija la ley contable.</p>,
        },
        {
          titulo: 'Tus derechos y cómo ejercerlos',
          cuerpo: (
            <>
              <p>Tienes derecho a conocer, actualizar y rectificar tus datos, a pedir que los eliminemos, a revocar tu autorización, a pedir prueba de ella y a presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</p>
              <Lista items={[<><strong>Eliminar todo:</strong> desde la app, en Perfil → «Eliminar mi cuenta y mis datos». Es inmediato.</>, <><strong>Cualquier otra solicitud:</strong> escribe a {RESPONSABLE.correo}. Respondemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15 días hábiles.</>]} />
            </>
          ),
        },
        {
          titulo: 'Menores de edad',
          cuerpo: <p>NutriSnap AI es solo para mayores de 18 años. Si descubrimos una cuenta de un menor, la eliminamos.</p>,
        },
        {
          titulo: 'Cambios a esta política',
          cuerpo: <p>Si cambiamos algo de fondo, te lo avisamos por correo y en la app, y te pediremos de nuevo tu autorización antes de seguir. La fecha de arriba muestra la última versión.</p>,
        },
      ]}
    />
  );
}
