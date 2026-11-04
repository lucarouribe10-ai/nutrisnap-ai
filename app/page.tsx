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
        subtitleMarked="El [b]Chequeo de Grasas Ocultas[/b] completa tu registro en segundos"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span className="inline-flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span className="whitespace-nowrap">Garantía de Cero Sorpresas</span>
            <span className="whitespace-nowrap">Prueba de 3 días</span>
            <span className="whitespace-nowrap">Reembolso de 7 días</span>
          </span>
        }
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
          'Una al día son [b]3.600 kcal[/b] al mes: casi medio kilo de grasa que no cuentas.',
          'Meses de gimnasio con [b]números incompletos[/b] y un déficit que no sabes si existe.',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Tu app dice 1.900 kcal. Con el aceite y los aderezos, fueron más.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo estancamiento y la misma frustración del domingo.',
        }}
      />

      <Solucion
        tituloMarked="Foto en segundos, [acento]aceite incluido[/acento]"
        mecanismo="El Chequeo de Grasas Ocultas"
        bigIdeaMarked="No abandonas el conteo por flojera: la foto no ve el aceite. El Chequeo [b]pregunta lo que la cámara no ve[/b]."
        pasos={[
          { titulo: 'Toma la foto', detalle: 'Calorías y macros en segundos, sin buscar ingredientes.' },
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
          { src: '/app-preview/primer-resultado.jpg', alt: 'Vista previa del diseño: primer resultado con el Chequeo', label: 'Tu primer resultado, aceite incluido' },
          { src: '/app-preview/hoy.jpg', alt: 'Vista previa del diseño: pantalla de hoy con tu avance a la meta', label: 'Tu avance hacia la meta' },
          { src: '/app-preview/chequeo.jpg', alt: 'Vista previa del diseño: detalle de comida con el Chequeo', label: 'Atrapa el aceite en un toque' },
          { src: '/app-preview/escaner.jpg', alt: 'Vista previa del diseño: escáner con modos foto, código, etiqueta y voz', label: 'Escanea códigos sin pagar' },
          { src: '/app-preview/logros.jpg', alt: 'Vista previa del diseño: logros y tu semana', label: 'Tus logros y tu semana' },
        ]}
        kicker="VISTA PREVIA DEL DISEÑO · LA APP ESTÁ EN CONSTRUCCIÓN"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]US$4.17 al mes[/acento]"
        trialDias={3}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR PRECIO',
          precioMes: 'US$4.17',
          totalAnual: 'Se cobra US$49.99 una vez al año',
          ahorro: 'Casi 6 meses gratis',
          descomposicionDia: 'menos de US$0.14 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: '/onboarding?plan=anual',
          features: [
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
            'Corrección por voz en 2 segundos',
            'Escáner de códigos incluido (gratis siempre)',
            'Puntos, logros y tu camino a la meta',
            'Reporte semanal de grasas atrapadas',
            'Garantía de Cero Sorpresas: reembolso de 7 días',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$7.99',
          ctaLabel: 'Probar con el plan mensual',
          ctaHref: '/onboarding?plan=mensual',
          features: [
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
            'Corrección por voz en 2 segundos',
            'Escáner de códigos incluido (gratis siempre)',
            'Puntos, logros y tu camino a la meta',
            'Reporte semanal de grasas atrapadas',
            'Garantía de Cero Sorpresas: reembolso de 7 días',
          ],
        }}
      />

      <Garantia
        nombre="La Garantía de Cero Sorpresas"
        condicionMarked="Te avisamos 1 día antes de cobrar. Si igual no te sirve, un correo y [b]te devolvemos todo[/b]: tienes 7 días de reembolso. Sin preguntas."
        pisoLegal="El reembolso se tramita a través de Hotmart"
      />

      <Faq
        items={[
          { pregunta: '¿La IA no me inventará las calorías?', respuestaMarked: 'Es una estimación y te lo decimos. Por eso el [b]Chequeo de Grasas Ocultas[/b] pregunta lo que la cámara no ve y tú ajustas en segundos.' },
          { pregunta: '¿Me van a cobrar por sorpresa?', respuestaMarked: 'No. Te avisamos 1 día antes por correo y en la app, cancelas en 2 toques y tienes [b]7 días de reembolso[/b].' },
          { pregunta: '¿Entiende mis comidas y mi forma de hablar?', respuestaMarked: 'Está pensada para el español de Latinoamérica. Si se equivoca con un plato, lo corriges en segundos y [b]aprende tus costumbres[/b].' },
          { pregunta: '¿Y si la dejo a los 3 días?', respuestaMarked: 'Por eso hay racha, puntos y logros que muestran tu avance, sin presión. Si una racha se rompe, tienes 48 horas para recuperarla.' },
          { pregunta: '¿El escáner de códigos es gratis?', respuestaMarked: 'Sí, sin límite de tiempo. La foto con chequeo, la voz y el historial son de pago.' },
          { pregunta: '¿Qué datos guardan de mí?', respuestaMarked: 'Tu comida, tu peso y tus metas, para calcular tu avance. [b]No vendemos tus datos[/b]. Las fotos no se guardan; solo una miniatura.' },
        ]}
      />

      <CtaFinal
        h2Marked="Imagina cerrar el día [acento]sabiendo dónde estás[/acento]"
        futurePacingMarked="Hoy tomas la foto, tocas «1 cucharada» y sigues con tu vida. Unos segundos, sin estrés."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="3 días gratis · Aviso antes de cobrar · Reembolso de 7 días"
        psMarked="PS: NutriSnap atrapa las grasas ocultas que tu foto no ve. Empiezas con 3 días gratis, sin cobros sorpresa."
      />

      <FooterLegal
        appName="NutriSnap AI"
        anio={2026}
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
