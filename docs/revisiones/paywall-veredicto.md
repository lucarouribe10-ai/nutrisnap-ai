# VEREDICTO revisor-visual — paywall
Fecha: 2026-11-12 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): NO FIEL
Veredicto: NO LISTA
Top defectos:
1. [Vista inicial 375px, y~1160-1255 del screenshot] El selector Anual/Mensual queda cortado por el pie fijo (solo asoma la etiqueta "MEJOR PRECIO"). La primera pantalla son 3 bloques densos (titular, plan, primera foto) y la elección de plan no se ve sin scroll. Fix: subir las tarjetas de plan encima de "Tu primera foto" o compactar el plan, y reducir el pie fijo de 4 filas a 2-3.
2. [Final del scroll, caja punteada "Vista previa: el pago de Hotmart y el aviso por correo se activan cuando conectemos tus cuentas"] Texto de desarrollo visible al comprador. Dice "Hotmart" y "conectemos tus cuentas", y desmiente el pago justo en la pantalla que cobra. Fix: quitarlo del render de producción (flag de entorno) o reemplazarlo por copy de pago real.
3. [Toda la pantalla vs FICHA-ARTE v2 y abc-ab.png] Faltan los dispositivos firma de la ficha. No hay cabecera lima redondeada (radio 26), ni foto de comida en la tarjeta "Tu primera foto", ni naranja degradé. El CTA es un rectángulo de 12px (--radius-button: 12px), no la píldora 99 de la ficha. --accent-2 es #C2490A y no #E8590C. El fondo es plano. Fix: envolver titular y cifras en el bloque lima #E4F2C9 con hoja inferior de 26, poner miniatura circular de la foto y alinear --radius-button con la ficha (o corregir la ficha).
4. [Pie fijo bajo el CTA vs bloque "Garantía de Cero Sorpresas" al final, y lista "Con tu prueba desbloqueas"] La garantía con nombre solo aparece al final del scroll. Junto al CTA hay plazo pero no nombre. El 3er bullet "El escáner sigue gratis" está bajo el título "desbloqueas", lo que es contradictorio y confunde la oferta. Fix: poner "Garantía de Cero Sorpresas" en el pie fijo y sacar el bullet del escáner de la lista de desbloqueos.
5. [Jerarquía y redundancia, página completa] Hay unos 8 tamaños de letra (30/32/26/22/17/15/14/12). El titular 30/800 compite con "2.480" 32/800. El aviso/reembolso se repite 3 veces (pie, línea de tiempo, garantía). Hay 7 secciones antes del pie. No hay FAQ para la objeción de pago (moneda US$ y medios para LATAM). El CTA no tiene estado de carga ni bloqueo de doble tap, y el try/catch de errorNav es código muerto. Fix: dejar 3 tamaños, fundir línea de tiempo y garantía en un solo bloque, añadir 2 preguntas de pago y un estado "Abriendo…" en el CTA.

Detalle: usabilidad h1:3 h2:3 h3:3 h4:3 h5:3 h6:2 h7:3 h8:3 h9:3 h10:3 | craft jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:3 | copy idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Fidelidad: 2 de 6 fallos (radios de botón: 12px frente a la píldora de la ficha y la referencia; lógica de profundidad: sin cabecera lima ni capas de foto).
Gate de carga cognitiva: 1-2 fallas (texto de 4 líneas en el plan, demasiados bloques), no es crítico.
CTA héroe vivo: cumple los 4 (contraste verde #3D6B4F sobre #F6F8F1 cerca de 5.7:1, whileTap 0.97, nunca disabled, 56px de alto y ancho completo).
Claim de salud a vigilar: "Llegarías a 76 kg hacia el 26 de enero" lleva "(estimado)", pero sigue siendo una proyección de resultado.
Sub-check garantía nombrada cerca del CTA: FALLA (el nombre está al final; en el pie solo va el plazo).
Anti-clon: no coincide con Capítulo ni Umbral (Figtree, lima/verde/naranja).
Movimiento verificado en código: stagger de entrada OK, conteo de números OK, línea de tiempo que se dibuja OK, whileTap OK, reduced-motion OK. Faltan celebración (no aplica) y transición animada al cambiar de plan.
