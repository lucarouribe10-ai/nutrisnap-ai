# VEREDICTO revisor-visual — landing
Fecha: 2026-11-12 10:00
Screenshot: docs/revisiones/landing-375.png (puntuado sobre las 12 capturas por sección: docs/revisiones/landing-secciones/01-hero.png a 12-footer.png)
Usabilidad: 31/40
Craft: 15/20
Copy: 17/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:4 especificidad:3 emoción:3 oferta:3 acción:4
Fidelidad: 1 de 6 desvíos leves (la landing no usa la cabecera lima ni la barra oscura de la referencia; el resto coincide: modo claro, verde/naranja, Figtree, radios 16-22/píldora, sombras tintadas). No llega a 2 fallos.
Gate cognitivo: 0-1 fallas (5 ítems de dolor en el límite; 5-6 CTAs repetidos de la MISMA acción, aceptable). No hay sobrecarga crítica.
Verificado en código: aria-expanded/aria-controls en FAQ, aria-live en el demo, aria-pressed en chips, whileTap 0.97 en CTAs, useReducedMotion en reveal/contadores/FAQ/sticky, stagger de entrada, conteo animado de cifras y del 560, CTA >=52px ancho completo, contraste blanco sobre #3D6B4F ~6:1. Rutas destino existen (/onboarding, /entrar, /privacidad, /terminos, /reembolsos, /aviso-ia). No verificable en estático: celebración, anillos/barras (no aplican a landing). Sticky con dos estados (ver precios / CTA comercial).
Sub-checks: Message-match N/A (sin dato de anuncio). Garantía nombrada con plazo cerca del CTA: PASA (sección Garantía + CtaFila contiguos; en la tarjeta de oferta solo dice "Reembolso de 7 días" sin el nombre).

Top defectos:
1. [Hero, tarjeta del demo del Chequeo] El título "Ensalada fresca / Almuerzo · 13:05" queda centrado (hereda text-center del hero) y flota desalineado respecto a la foto; los chips "1 cda · +120" y "2 cdas · +240" parten en dos líneas con el punto colgando al final de la primera. Además usa hex sueltos (#C2490A, #FFF3E6, #A83D06) en vez de tokens. -> text-left en el bloque, etiqueta en dos líneas explícitas ("1 cda" / "+120 kcal") sin el "·" y pasar los hex a tokens.
2. [Fondos de las secciones 02, 03, 04, 06] La alternancia base/elevado es casi invisible (#F6F8F1 vs #FDFEFB, y tarjetas #F6F8F1 sobre blanco): problema, cifras y mecanismo se funden en un solo plano; la firma de la ficha (bloque lima #E4F2C9, naranja de dato) casi no aparece fuera del hero y de las capturas del carrusel, así que la página parece "verde + blanco + Figtree" intercambiable. -> pintar una sección entera (cifras o mecanismo) con --tint lima/hundido #E8EEDF y llevar el naranja a los números de costo (120 / 3.600).
3. [Sección 03 "Lo que tu foto no cuenta"] Tres tarjetas idénticas del mismo peso: no hay número héroe; el 0,5 kg (el golpe emocional) pesa igual que el 120. Además el formato numérico es incoherente (3.600 y 0,5 con formato español vs US$4.17 y US$0.14 con punto). -> dar a "3.600 kcal → ≈0,5 kg" tamaño display ~56px como héroe, 120 como apoyo, y unificar decimales (US$4,17).
4. [Oferta, título y tarjetas] "Empieza gratis. Sigue por US$4.17 al mes" anuncia un precio que es el anual prorrateado (se cobran US$49.99 de golpe) y el mensual cuesta US$7.99; además conviven dos "gratis" distintos (primera foto sin tarjeta vs 3 días de prueba) y ambos planes llevan el mismo CTA "Probar mi primera foto gratis": el usuario relee para entender qué paga y cuándo. La nota bajo el CTA anual no nombra "Garantía de Cero Sorpresas". -> título "US$4.17 al mes con plan anual", CTA del plan "Empezar 3 días gratis · Anual/Mensual" o nota que diga qué es gratis y cuándo se cobra, y nombrar la garantía en la nota.
5. [Viudas tipográficas] "días" suelto en "Aviso 1 día antes de cobrar · Reembolso de 7 / días" (tarjeta Anual), "después" suelto bajo el CTA de la sección 05, y los enlaces del footer rompen con "Aviso de IA" huérfano en segunda fila. -> text-balance + whitespace-nowrap en "7 días", acortar a "3 días de prueba" y footer en grilla 2x2.
