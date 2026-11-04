# VEREDICTO revisor-visual — landing (segunda revisión)
Fecha: 2026-11-04 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Oferta, card Anual, botón] "Probar mi primera foto gratis" se parte en 2 líneas con el texto pegado a la izquierda dentro de un botón de ancho completo (px-8 + card con padding): es el CTA héroe de la página y se ve roto; el mismo CTA en hero/carrusel/final va en 1 línea centrada. Fix: reducir px del CtaButton dentro de cards (px-4) / text-center / text-[16px] para que quepa en 1 línea.
2. [Honestidad, Oferta + Garantía + FAQ + CTA final] La app no existe, pero solo el kicker del carrusel lo dice; la oferta, la prueba de 3 días, los features ("hasta 8 al día", "reporte semanal", "racha de 48 h") y la FAQ hablan en presente como producto vivo y el CTA lleva a /onboarding. Fix: si se vende ya, aviso visible junto a la oferta ("acceso anticipado / lanzamiento en X") o cambiar el CTA a lista de espera; si no, no cobrar por lo que no está.
3. [Hero, fila de confianza bajo el CTA; Footer; CtaFinal recap] Desencajes visibles de última milla: la fila "Garantía de Cero Sorpresas / Prueba de 3 días / Reembolso de 7 días" cae en 2 líneas desbalanceadas sin separadores; en el pie el "·" queda colgado al final de la línea 1 y "Aviso de IA" cae sangrado a la línea 2; el recap del CTA final deja "días" huérfano. Fix: grid 3 columnas o chips con separador en el hero; en el pie, lista con flex-wrap sin "·" textuales (usar gap + divisores por ::before); recap en 2 líneas controladas (text-balance).
4. [Agitación + Solución "Antes/Después" + hero + carrusel frame 1] El par 440→560 aparece 4 veces (hero demo, Antes/Después, frame 1 del carrusel, CTA final) y Agitación es texto puro en 3 párrafos + 2 cajas grises sin ícono, número héroe ni visual (regla "ninguna sección de conversión es solo texto"); además las 5 tarjetas de "¿Te suena?" parecen tocables y no hacen nada. Fix: eliminar el bloque Antes/Después (ya lo hace el demo del hero) y convertir Agitación en un dato héroe visual (120 kcal × 30 = 3.600 con barra/rejilla); quitar la apariencia de botón a las tarjetas de Problema (sin sombra/borde elevado).
5. [Oferta, 2 cards] 12 bullets (2 listas idénticas de 6, una de ellas repite la garantía que ya tiene su sección) en la zona donde el usuario decide: carga cognitiva alta y el Mensual queda tan largo como el Anual. Fix: lista de 4 ítems en el Anual y en el Mensual solo "Todo lo del Anual, mes a mes"; quitar el bullet de garantía (va en su sección y en el hero).
Otros (menores): logo = cuadrado verde liso sin glifo en header y pie (identidad blanda, parece placeholder); el frame del carrusel deja ~25% de vacío muerto dentro del teléfono antes del botón; carrusel muestra "Foto en 3 s" (claim de velocidad no probado); sin ninguna prueba social externa (testimonio/cifra real) -> especificidad solo apoyada en el demo ilustrativo y la garantía; el verde claro del CTA final (#9FD1AE aprox.) es un color fuera de la paleta de FICHA-ARTE (aceptable por contraste, documentarlo en la ficha).

Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:2
Copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Gate de carga cognitiva: 1 falla (listas de 6 ítems por card); 5 tarjetas en Problema en el límite. No es sobrecarga crítica.
Verificado en código: reveal escalonado whileInView una sola vez con useReducedMotion (ui.tsx useReveal), whileTap 0.97 en CTAs, conteo animado 440->560 en ChequeoDemo (al montar y al tocar), @media prefers-reduced-motion en tokens.css, sticky CTA con 2 estados y safe-area, FAQ y dots del carrusel tocables, todas las rutas enlazadas existen (/onboarding, /entrar, /privacidad, /terminos, /reembolsos, /aviso-ia). No hay anillos/barras que se dibujen ni celebración en la landing (n/a salvo imágenes estáticas).
Consistencia con FICHA-ARTE: paleta (#EFF2ED/#F9FBF7/#3D6B4F), Chivo + Hanken, radios 14-16 y dispositivo rejilla+ticks coinciden; sin desvío evidente. No coincide con los clones vetados (Capítulo/Umbral). Cumple conversión: titular con énfasis en acento, hairline degradé en card clave, chips SVG sin emojis, secciones alternadas.
Umbral: LISTA exige >=36/40 y >=16/20 craft y copy >=16/20 sin eje <=2: no se cumple (28, 13, 15).
