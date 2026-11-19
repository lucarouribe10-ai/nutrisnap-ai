import { PaginaLegal, Lista } from '@/components/legal/PaginaLegal';
import { RESPONSABLE } from '@/lib/legal';

export const metadata = { title: 'Política de reembolsos — NutriSnap AI' };

export default function Page() {
  return (
    <PaginaLegal
      titulo="Política de reembolsos"
      secciones={[
        {
          titulo: 'La Garantía de Cero Sorpresas',
          cuerpo: (
            <>
              <p>Si te cobramos y no te sirve, escribe un correo dentro de los <strong>7 días siguientes al cobro</strong> y te devolvemos el dinero completo, sin preguntas.</p>
              <Lista items={['Durante la prueba de 7 días no se cobra nada: si cancelas antes del primer cobro, no pagas.', 'Te avisamos por correo 1 día antes del primer cobro, con la fecha y el monto.', 'Esta garantía aplica al primer cobro de cada plan, mensual o anual.']} />
            </>
          ),
        },
        {
          titulo: 'Cómo pedirlo',
          cuerpo: <p>Escribe a {RESPONSABLE.correo} desde el correo con el que compraste, o pide el reembolso directamente en Hotmart desde tu comprobante de compra. No necesitas dar una razón.</p>,
        },
        {
          titulo: 'Cómo se procesa',
          cuerpo: <p>El reembolso lo tramita Hotmart, el procesador de pagos, al mismo medio de pago que usaste. El tiempo en que lo veas reflejado depende de tu banco o tarjeta. Al reembolsarse, tu acceso al plan de pago se corta; conservas el plan gratuito.</p>,
        },
        {
          titulo: 'Cancelar la renovación',
          cuerpo: <p>Cancelar es distinto de pedir un reembolso: cancelas cuando quieras desde tu cuenta de Hotmart para que no se renueve; conservas el acceso hasta el final del periodo pagado. Esta política no limita los derechos que tengas como consumidor según la ley colombiana.</p>,
        },
      ]}
    />
  );
}
