'use client';

import { CreditCard, PenLine, ScanEye, Scale, Timer } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { ChequeoDemo } from '@/components/landing/ChequeoDemo';

// Modelo 2 (onboarding-first, aprobado en Sesión 1): el CTA va a /onboarding, no al checkout.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Probar mi primera foto gratis';

export default function Page() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="NutriSnap AI"
        loginHref="/entrar"
        h1Marked="Tu foto no ve el [acento]aceite[/acento]. NutriSnap sí lo pregunta"
        subtitleMarked="El [b]Chequeo de Grasas Ocultas[/b] completa tu registro en 3 segundos"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Prueba de 7 días · Aviso antes de cobrar · Reembolso de 7 días</span>}
        visual={<ChequeoDemo />}
      />

      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Timer, textoMarked: '¿Tardas más registrando el plato que [b]comiéndotelo[/b]?' },
          { icon: ScanEye, textoMarked: '¿Tu app dice 440 kcal y [b]no vio el aceite[/b]?' },
          { icon: PenLine, textoMarked: '¿Corriges cada comida [b]a mano[/b], ingrediente por ingrediente?' },
          { icon: CreditCard, textoMarked: '¿Te cobraron un año entero tras una prueba gratis?' },
          { icon: Scale, textoMarked: '¿Cierras el día sin saber si [b]de verdad[/b] estás en déficit?' },
        ]}
      />

      <Agitacion
        frases={[
          'Una cucharada de aceite suma [acento]120 kcal[/acento] que la cámara no puede ver.',
          'En un mes son [b]3.600 kcal[/b]: casi medio kilo de grasa que tu déficit no cuenta.',
          'Meses de gimnasio tapados por números que [b]nunca fueron reales[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Tu app dice 1.900 kcal. Con el aceite y los aderezos, fueron más.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo estancamiento y la misma culpa del domingo.',
        }}
      />

      <Solucion
        tituloMarked="Foto en 3 segundos, [acento]aceite incluido[/acento]"
        mecanismo="el Chequeo de Grasas Ocultas"
        bigIdeaMarked="No abandonas el conteo por flojera: la foto no ve el aceite. El Chequeo [b]pregunta lo que la cámara no ve[/b]."
        pasos={[
          { titulo: 'Toma la foto', detalle: 'Calorías y macros en 3 segundos, sin buscar ingredientes.' },
          { titulo: 'Responde el chequeo', detalle: 'Un toque o tu voz: «1 cucharada de aceite». Dos segundos.' },
          { titulo: 'Mira tu avance', detalle: 'Tu proteína, tu día y tu camino a la meta, al instante.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'La foto dice 440 kcal y se olvida del aceite.',
          labelDespues: 'Después',
          despues: '560 kcal con el aceite: el Chequeo atrapó 120 que no se veían.',
        }}
      />

      <AppPorDentro
        tituloMarked="Tu día, [acento]claro de un vistazo[/acento]"
        frames={[
          { label: 'Tu primer resultado en 3 segundos', nombrePantalla: 'Primer resultado' },
          { label: 'Tu avance hacia la meta', nombrePantalla: 'Pantalla de hoy' },
          { label: 'Atrapa el aceite en un toque', nombrePantalla: 'Chequeo de grasas' },
          { label: 'Escanea códigos sin pagar', nombrePantalla: 'Escáner' },
          { label: 'Tus logros y tu semana', nombrePantalla: 'Logros' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]US$4.17 al mes[/acento]"
        trialDias={7}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR PRECIO',
          precioMes: 'US$4.17',
          totalAnual: 'Se cobra US$49.99/año',
          ahorro: 'Casi 6 meses gratis',
          descomposicionDia: 'menos de US$0.14 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
            'Corrección por voz en 2 segundos',
            'Escáner de códigos y de etiquetas',
            'Puntos, logros y tu camino a la meta',
            'Reporte semanal de grasas atrapadas',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$7.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
            'Corrección por voz en 2 segundos',
            'Escáner de códigos y de etiquetas',
            'Puntos, logros y tu camino a la meta',
            'Cancelas cuando quieras',
          ],
        }}
      />

      <Garantia
        nombre="la Garantía de Cero Sorpresas"
        condicionMarked="Te avisamos 2 días antes de cobrar. Si igual no te sirve, un correo en 7 días y [b]te devolvemos todo[/b]. Sin preguntas."
        pisoLegal="Respaldada por la garantía de 7 días de Hotmart"
      />

      <Faq
        items={[
          { pregunta: '¿La IA no me inventará las calorías?', respuestaMarked: 'Es una estimación y te lo decimos. Por eso el [b]Chequeo de Grasas Ocultas[/b] pregunta lo que la cámara no ve y tú ajustas en segundos.' },
          { pregunta: '¿Me van a cobrar por sorpresa?', respuestaMarked: 'No. Te avisamos 2 días antes por correo y en la app, cancelas en 2 toques y tienes [b]7 días de reembolso[/b].' },
          { pregunta: '¿Entiende mis comidas y mi forma de hablar?', respuestaMarked: 'Está pensada para el español de Latinoamérica. Si se equivoca con un plato, lo corriges en segundos y [b]aprende tus costumbres[/b].' },
          { pregunta: '¿Y si la dejo a los 3 días?', respuestaMarked: 'Por eso hay racha, puntos y logros que muestran tu avance, sin culpa. Si una racha se rompe, tienes 48 horas para recuperarla.' },
          { pregunta: '¿El escáner de códigos es gratis?', respuestaMarked: 'Sí, sin límite de tiempo. La foto con chequeo, la voz y el historial son de pago.' },
          { pregunta: '¿Cómo pago desde Colombia?', respuestaMarked: 'El pago lo procesa Hotmart, que te muestra los medios disponibles en Colombia al pagar.' },
          { pregunta: '¿Qué datos guardan de mí?', respuestaMarked: 'Tu comida, tu peso y tus metas, para calcular tu avance. [b]No vendemos tus datos[/b]. Las fotos no se guardan; solo una miniatura.' },
        ]}
      />

      <CtaFinal
        h2Marked="Imagina cerrar el día [acento]sabiendo dónde estás[/acento]"
        futurePacingMarked="Hoy tomas la foto, tocas «1 cucharada» y sigues con tu vida. Tres segundos, sin culpa."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · Aviso antes de cobrar · Reembolso de 7 días"
        psMarked="PS: NutriSnap atrapa las grasas ocultas que tu foto no ve. Empiezas con 7 días gratis, sin cobros sorpresa."
      />

      <FooterLegal
        appName="NutriSnap AI"
        anio={2026}
        soporteEmail="soporte@PENDIENTE-dominio.com"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
