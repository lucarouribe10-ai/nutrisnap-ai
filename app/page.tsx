'use client';

import { Vista } from '@/components/Vista';
import { CreditCard, PenLine, ScanEye, Scale, Timer } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { AgitacionCifras } from '@/components/landing/AgitacionCifras';
import { Droplet, CalendarDays, ShieldCheck } from 'lucide-react';
import { CtaFila } from '@/components/landing/CtaFila';
import { Isotipo } from '@/components/landing/Isotipo';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { ChequeoDemo } from '@/components/landing/ChequeoDemo';
import { RESPONSABLE } from '@/lib/legal';

// Modelo 2 (onboarding-first, aprobado en Sesión 1): el CTA va a /onboarding, no al checkout.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Probar mi primera foto gratis';

export default function Page() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="NutriSnap AI"
        logo={<Isotipo size={32} />}
        loginHref="/entrar"
        h1Marked="Tu foto no ve el [acento]aceite[/acento]. NutriSnap sí lo pregunta"
        subtitleMarked="El [b]Chequeo de Grasas Ocultas[/b] completa tu registro en segundos"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <ul className="mx-auto flex w-fit flex-col gap-1 text-left text-[14px]">
            {['Garantía de Cero Sorpresas', 'Prueba de 3 días, aviso antes de cobrar', 'Reembolso de 7 días, sin preguntas'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-[var(--accent)]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        }
        visual={<ChequeoDemo />}
      />

      <Problema
        titulo="Registrar tu comida no debería ser tan lento"
        preguntas={[
          { icon: Timer, textoMarked: '¿Tardas más registrando el plato que [b]comiéndotelo[/b]?' },
          { icon: ScanEye, textoMarked: '¿Tu app dice 440 kcal y [b]no vio el aceite[/b]?' },
          { icon: PenLine, textoMarked: '¿Corriges cada comida [b]a mano[/b], ingrediente por ingrediente?' },
          { icon: CreditCard, textoMarked: '¿Te cobraron un año entero tras una prueba gratis?' },
          { icon: Scale, textoMarked: '¿Cierras el día sin saber si [b]de verdad[/b] estás en déficit?' },
        ]}
      />

      <AgitacionCifras
        tituloMarked="Lo que tu foto [acento]no cuenta[/acento]"
        cifras={[
          { icon: Droplet, valor: 120, unidad: 'kcal', etiquetaMarked: 'en [b]una cucharada de aceite[/b] que la cámara no ve' },
          { icon: CalendarDays, valor: 3600, unidad: 'kcal', etiquetaMarked: 'al mes, si sumas [b]una al día[/b]' },
          { icon: Scale, valor: 0.5, decimales: 1, prefijo: '≈ ', unidad: 'kg', etiquetaMarked: 'de grasa que [b]tu déficit no cuenta[/b]' },
        ]}
        cierreMarked="Meses de gimnasio con [b]números incompletos[/b]."
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
          antesDato: '440',
          antes: 'La foto se olvida del aceite.',
          labelDespues: 'Después',
          despuesDato: '560',
          despues: 'El Chequeo atrapó 120 kcal que no se veían.',
        }}
      />

      <CtaFila label={CTA_LABEL} href={CTA_HREF} nota="Sin tarjeta para tu primera foto · 3 días de prueba después" />

      <Vista evento="landing_vista" />

      <AppPorDentro
        tituloMarked="Tu día, [acento]claro de un vistazo[/acento]"
        frames={[
          { src: '/app-preview/primer-resultado.jpg', alt: 'Vista previa del diseño: primer resultado con el Chequeo', label: 'Tu primer resultado, aceite incluido' },
          { src: '/app-preview/hoy.jpg', alt: 'Vista previa del diseño: pantalla de hoy con tu avance a la meta', label: 'Tu avance hacia la meta' },
          { src: '/app-preview/chequeo.jpg', alt: 'Vista previa del diseño: detalle de comida con el Chequeo', label: 'Atrapa el aceite en un toque' },
          { src: '/app-preview/progreso.jpg', alt: 'Vista previa del diseño: progreso con tu peso hacia la meta y tus calorías de la semana', label: 'Tu tendencia, no el número de un día' },
          { src: '/app-preview/logros.jpg', alt: 'Vista previa del diseño: logros y tu semana', label: 'Tus logros y tu semana' },
        ]}
        kicker="ASÍ SE VE POR DENTRO · DATOS DE EJEMPLO"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]US$7.50 al mes[/acento]"
        trialDias={3}
        aviso="Acceso anticipado: estamos terminando la app y estás entre los primeros en probarla."
        anual={{
          nombre: 'Anual',
          badge: '3 MESES GRATIS',
          precioMes: 'US$7.50',
          totalAnual: 'Se cobra US$89.99 una vez al año',
          ahorro: 'Pagas 9 meses y usas 12',
          descomposicionDia: 'menos de US$0.25 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: '/onboarding?plan=anual',
          notaCta: 'Aviso 1 día antes de cobrar · Reembolso de 7 días',
          features: [
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
            'Corrección por voz en 2 segundos',
            'Puntos, logros y tu camino a la meta',
            'Reporte semanal de grasas atrapadas',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$9.99',
          ctaLabel: 'Probar mi primera foto gratis',
          ctaHref: '/onboarding?plan=mensual',
          notaCta: 'Aviso 1 día antes de cobrar · Reembolso de 7 días',
          features: [
            'Todo lo del plan anual, mes a mes',
            'Cancelas cuando quieras, sin llamar a nadie',
            'El escáner de códigos sigue gratis siempre',
            'Fotos con Chequeo de Grasas Ocultas (hasta 8 al día)',
          ],
        }}
      />

      <Garantia
        nombre="La Garantía de Cero Sorpresas"
        condicionMarked="Te avisamos 1 día antes de cobrar. Si no te sirve, un correo y [b]te devolvemos todo[/b]. 7 días, sin preguntas."
        pisoLegal="El reembolso se tramita a través de Hotmart"
      />

      <CtaFila label={CTA_LABEL} href={CTA_HREF} nota="Aviso 1 día antes de cobrar · Reembolso de 7 días" />

      <Faq
        items={[
          { pregunta: '¿La IA no me inventará las calorías?', respuestaMarked: 'Es una estimación y te lo decimos. Por eso el [b]Chequeo de Grasas Ocultas[/b] pregunta lo que la cámara no ve y tú ajustas en segundos.' },
          { pregunta: '¿Me van a cobrar por sorpresa?', respuestaMarked: 'No. Te avisamos 1 día antes por correo y en la app, cancelas cuando quieras y tienes [b]7 días de reembolso[/b].' },
          { pregunta: '¿Entiende mis comidas y mi forma de hablar?', respuestaMarked: 'Está pensada para el español de Latinoamérica. Si se equivoca con un plato, lo corriges en segundos y [b]aprende tus costumbres[/b].' },
          { pregunta: '¿Y si la dejo a los 3 días?', respuestaMarked: 'Por eso hay racha, puntos y logros que muestran tu avance, sin presión. Si un día falta, un escudo de racha la protege.' },
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
        logo={<Isotipo size={20} />}
        anio={2026}
        soporteEmail={RESPONSABLE.correo}
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
