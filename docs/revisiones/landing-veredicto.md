# VEREDICTO revisor-visual — landing (tercera revisión)
Fecha: 2026-11-07 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hero, fila de confianza bajo el CTA] Sigue cayendo en 2 líneas desbalanceadas: "Garantía de Cero / Sorpresas", "Reembolso de 7 / días" (huérfano "días"). Se ve a simple vista en el primer pantallazo, justo bajo el CTA héroe. Fix: textos cortos de 1 línea ("Cero Sorpresas · 3 días gratis · 7 días de reembolso") o chips con ícono; text-balance y whitespace-nowrap por columna.
2. [Sección "costo de seguir igual", justo tras "¿Te suena?"] Las 3 tarjetas de cifras (120 / 3.600 / ≈0,5) y el bloque Hoy/En 6 meses NO tienen título ni kicker: el lector pasa de 5 tarjetas grises de preguntas a 5 tarjetas grises más sin ningún encabezado que enmarque "el costo". Falla la prueba solo-titulares y se crea un muro de 10 cajas gris-verdoso casi idénticas sin respiro. Fix: agregar kicker + h2 ("Lo que no cuenta, cuenta") y dar al par Hoy/6 meses un tratamiento distinto (sin caja o con acento naranja de la ficha); además hacer que 120 y 3.600 cuenten de 0 al entrar (conteo héroe).
3. [Footer] "Aviso de IA" cae solo en una 2ª línea, sangrado 8px respecto al logo y al © (los enlaces llevan padding, el resto no); sin ningún canal de contacto/soporte. Fix: lista flex-wrap 2x2 con -ml-2 o sin padding lateral, alineada a x=40; añadir correo de soporte.
4. [Oferta, cards Anual/Mensual] La garantía de 7 días aparece como bullet solo en el Mensual: el Anual (el que se promueve y el de mayor desembolso, US$49.99) parece NO tenerla, contradiciendo hero/FAQ/Garantía. Fix: quitar el bullet del Mensual y poner bajo el CTA del Anual una línea "Reembolso de 7 días · aviso 1 día antes de cobrar" en ambos planes.
5. [Cierre y consistencia con FICHA-ARTE] CTA final con verde menta (~#9FD1AE) y fondo oscuro: ambos fuera del brand kit aprobado (modo claro, acento #3D6B4F); no están documentados en la ficha. Además el sticky CTA coexiste con los CtaFila/carrusel (dos botones idénticos apilados en pantalla en secciones 5, 6 y 9). Fix: documentar el verde menta y el bloque oscuro en FICHA-ARTE como excepción de cierre (o tokenizarlo), y ocultar el sticky mientras haya un CtaFila/CTA inline visible.
Otros (menores): 440→560 aparece 5 veces (hero demo, pregunta 2 de "¿Te suena?", Antes/Después, frame 1 del carrusel, cierre) y dilata la especificidad; dots del carrusel con área de 24px (<44px) y marco del frame 1 con ~12% de vacío antes del botón; el aviso de 2 líneas en mayúsculas del carrusel es largo; las FAQ afirman funciones ("fotos no se guardan, solo miniatura", "hasta 8 al día", "48 h para recuperar racha") de una app que aún no existe, atenuado por el aviso de Acceso anticipado; sin prueba social real (omitida a propósito, el techo de especificidad queda en 3); labels de 11-12px en el demo (Solo la foto / Con el Chequeo) en el límite; rejilla+ticks aparece una sola vez en toda la página.

Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
(h9 = sin estados de error en una landing; se puntúa neutro, no 4. h3/h7 verificados en código: sticky CTA con 2 estados, FAQ cierra/abre con aria-expanded y teclado nativo, dots tocables, botones nativos; sin atajos ni ancla de navegación superior, por eso no 4.)
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Copy: idea:4 especificidad:3 emoción:3 oferta:3 acción:3
Gate de carga cognitiva: 0-1 fallas (5 tarjetas en "¿Te suena?" en el límite; 440/560 repetido). Sin sobrecarga crítica. Una acción primaria repetida con el mismo label; sin elementos tapables falsos (las tarjetas del problema ya no parecen botones).
Verificado en código: reveal escalonado whileInView una sola vez + useReducedMotion (ui.tsx useReveal), whileTap 0.97 en CtaButton/sticky/Oferta, conteo 440→560 en ChequeoDemo (al montar y al tocar, con aria-live), acordeón con altura animada y reduced-motion, @media prefers-reduced-motion en tokens.css, rutas /onboarding /entrar /privacidad /terminos /reembolsos /aviso-ia existen. Faltan: conteo en las cifras 120/3.600, anillos/barras dibujados (solo imágenes estáticas en el carrusel); celebración N/A en landing.
Consistencia con FICHA-ARTE: paleta #EFF2ED/#F9FBF7/#3D6B4F, Chivo + Hanken, radios 14-16, rejilla+ticks e isotipo coinciden. Desvíos: bloque oscuro de cierre y CTA verde menta no están en la ficha (modo claro). No coincide con los clones vetados (Capítulo = papel cálido + Petrona/Karla; Umbral = pizarra + latón): fondo salvia fría + Chivo/Hanken. Conversión: titular con énfasis en acento, hairline degradé en demo/oferta/garantía, chips SVG sin emojis, secciones alternadas, checkmarks custom: cumple.
Copy: traza a ficha — hero (dolor 2 + deseo 2, objeción 1), cobros sorpresa (dolor 4, objeción 2) en Problema/Garantía/FAQ, mecanismo "Chequeo de Grasas Ocultas" bautizado en hero, solución, oferta y FAQ. Garantía con nombre y plazo (7 días) inmediatamente tras la oferta y repetida en CtaFila. Message-match: N/A (sin anuncio de origen). Cero claims de ingresos/salud; "≈0,5 kg" trazable (120×30/7.700). Techo en especificidad/emoción por falta de prueba real y de la escena del restaurante.
Umbral: LISTA exige >=36/40 usabilidad, >=16/20 craft y >=16/20 copy sin eje <=2. Copy cumple (16); usabilidad 30 y craft 14 no.

## Auditoría de escaneabilidad mobile (375px)
| # | Sección | ¿Bloque >4 líneas seguidas? | ¿Ícono/número en dolores/beneficios/pasos? | ¿Pasa solo-titulares? | ¿Respiro visual? | Caja/acordeón | Qué corregir |
|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ máx 3 líneas (H1) | ✅ demo con ícono de gota | ✅ H1 + CTA cuentan la historia | ✅ | n/a | Fila de confianza en 2 líneas con "días" huérfano: acortar a 1 línea por columna |
| 2 | ¿Te suena? | ✅ 2 líneas por tarjeta | ✅ 5 chips de ícono | ❌ título genérico ("¿Te suena?"); el mensaje está en el cuerpo de las tarjetas | ✅ gap 16px, 5 ítems (límite) | ✅ tarjetas sin apariencia de botón | Título con promesa ("5 señales de que tu conteo está incompleto") |
| 3 | El costo de seguir igual | ✅ máx 2 líneas | ✅ ícono + cifra héroe 32px | ❌ no tiene título: sin encabezado el bloque no se lee en solo-titulares | ❌ continúa el muro de cajas grises de la sección 2 sin pausa | ✅ cajas | Añadir kicker+h2; diferenciar Hoy/6 meses del resto; contar las cifras al entrar |
| 4 | Cómo funciona | ✅ intro 3 líneas, pasos 2 | ✅ pasos 01-02-03 | ✅ "Foto en segundos, aceite incluido" + 3 títulos de paso | ✅ | ✅ Antes/Después en 2 columnas (440/560 se leen bien) | Quitar repetición del 440→560 (ya está en el hero) o variar el ejemplo |
| 5 | CTA tras el mecanismo | ✅ | n/a | ✅ | ✅ | n/a | Ocultar el sticky cuando este botón es visible (botón duplicado) |
| 6 | La app por dentro | ✅ | ✅ cada frame con etiqueta; 5 dots | ✅ | ✅ | ✅ marcos de teléfono | Dots a 44px; recortar vacío de 12% en frame 1; acortar kicker de 2 líneas |
| 7 | Planes y precios | ✅ bullets de 1-2 líneas | ✅ checkmarks custom | ✅ "Empieza gratis. Sigue por US$4.17 al mes" | ✅ | ✅ 2 cajas, anual destacada con badge | Garantía solo en el bullet del Mensual: ponerla en ambos |
| 8 | Garantía | ✅ 4 líneas justas (centradas, en el límite) | ✅ escudo | ✅ "La Garantía de Cero Sorpresas" | ✅ | ✅ caja con hairline | Alinear a la izquierda o recortar a 3 líneas |
| 9 | CTA tras la garantía | ✅ | n/a | ✅ | ✅ | n/a | Mismo punto que 5 (sticky duplicado) |
| 10 | Preguntas frecuentes | ✅ respuestas de 4 líneas | ✅ chevrons | ✅ 6 preguntas se leen solas | ✅ | ✅ acordeón (1 abierto) | Abrir/cerrar OK; sin cambios |
| 11 | Empieza hoy (cierre) | ✅ 3 líneas | n/a | ✅ | ✅ | n/a | Documentar el bloque oscuro y el verde menta en la ficha |
| 12 | Footer | ✅ | ✅ isotipo | n/a | ❌ enlace huérfano "Aviso de IA" sangrado | n/a | Alinear a x=40 y balancear; añadir contacto |

Resumen: 12 secciones, 9 completamente ✅; ❌ en 3 (título faltante + muro de cajas), 2 (título genérico en solo-titulares), 12 (footer) y la fila de confianza del hero.
