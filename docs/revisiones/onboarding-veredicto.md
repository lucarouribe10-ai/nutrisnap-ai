# VEREDICTO revisor-visual — onboarding
Fecha: 2026-11-12 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 28/40
Craft: 12/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): NO FIEL
Veredicto: NO LISTA
Top defectos:
1. [Chequeo en resultado + toda la identidad] Falta la firma de la ficha v2 y de la referencia abc-ab.png: no hay cabecera lima #E4F2C9 con hoja redondeada ni foto protagonista (la foto es un thumbnail de 56px); el Chequeo es un bloque verde oscuro en degradé, no la hoja clara con pastilla naranja seleccionada de la referencia; todo el fondo es #F6F8F1 plano. Fidelidad: 2 de 6 desvíos (profundidad/dispositivos y color de selección). Fix: hoja lima en resultado/plan, foto grande arriba, Chequeo en superficie clara con opción elegida en naranja #E8590C.
2. [Pasos nombre, foto, plan/analizando y resultado, zona inferior] Vacío muerto: el paso nombre queda ~55% vacío, foto ~35%, el cargador del plan ~55%, y el resultado deja ~145px entre el Chequeo y el CTA. Fix: llenar con valor (mini vista previa del plan, qué recibirás, dato de la foto) o anclar/centrar el contenido en min-h-dvh.
3. [Resultado, fila de opciones del Chequeo y número héroe] "1 cucharada" y "2 cucharadas" se parten en 3 líneas y la palabra casi toca los bordes del botón (px-1, ~75px de ancho); el micrófono sin etiqueta roba ancho; el "—" de "Con el Chequeo" se ve como una barra negra gruesa que parece un bug. Fix: 3 opciones en filas o grilla 2x2 con kcal a la derecha, micrófono aparte con texto, y "—" reemplazado por "?" o "..." en color secundario.
4. [Cargadores analizando (4.2s forzados) y plan (5.6s), y paso diagnóstico] Control y libertad: ninguna espera de 3s+ tiene cancelar o volver, el plan no se puede saltar, y el diagnóstico no tiene volver. Además la pantalla de resultado junta 5 bloques (titular, plato, comparación, Chequeo, tarjeta de XP con racha y logro) y la tarjeta naranja compite con el CTA. Fix: botón visible "Volver" o "Cancelar" en los cargadores, acortar las esperas fingidas, y reducir la tarjeta de recompensa a una sola línea.
5. [Copy de plan/diagnóstico y CTAs] "Analizando tu objetivo: definir" y "Tu plan de definir está listo" salen del token crudo ETIQUETA_OBJETIVO.definir y quedan mal escritos; el CTA es "Continuar" o "Ver mi plan" (genérico, repetido para dos acciones distintas); la promesa de la ficha de avatar es "3 preguntas" y el flujo hace 5 más foto; la objeción de cobros solo se responde si el usuario eligió ese dolor; hay hex sueltos en Recompensa y el Chequeo (#F4FAF5, #FFD2B0, #A83D06, #5A4A40). Fix: etiqueta "bajar grasa", CTAs en primera persona con beneficio ("Quiero ver mi plan"), aviso de cobro visible en todos los casos, mover los hex a tokens.

Notas de verificación:
- Gate de carga cognitiva (resultado): 2 fallas (más de 4 bloques en la primera vista; tarjeta de recompensa con 4 piezas). No es sobrecarga crítica.
- CTA héroe vivo: cumple 4/4 (contraste verde #3D6B4F sobre claro, whileTap 0.97, nunca disabled y valida al click con hint, h-14 de ancho completo).
- Movimiento (código): hay entrada escalonada solo en ChipOpcion, cuenta del número del total, anillo del plan que se dibuja, whileTap, transición entre pasos, spring en Recompensa/logro y MotionConfig reducedMotion="user". Faltan escalonado en títulos y paneles, y el número héroe no cuenta al entrar.
- Anti-clon: no coincide con Capítulo ni Umbral (Figtree, lima/verde, rejilla con ticks como dispositivo propio). Eje 3 no es 0, pero queda en 2 porque falta la cabecera lima.
- Copy: idea 3, especificidad 3, emoción 3, oferta 2, acción 3 = 14/20 (bajo el umbral 16, y el eje de oferta es ≤2).
- Fidelidad usabilidad: h1:3 h2:3 h3:2 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3.
