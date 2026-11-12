# VEREDICTO revisor-visual — paywall
Fecha: 2026-11-12 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. [Zona de planes, primer viewport] El pie fijo (CTA + 2 líneas legales + enlace, ~185px = 23% de la altura) tapa a medias la tarjeta Mensual: solo se ve el precio, y "Cancelas cuando quieras" se corta en "Cancelas cuando". La decisión de plan no se ve completa sin scroll. Fix: compactar el pie (fundir las dos líneas legales en una) y/o reducir el bloque lima para que ambos planes entren sobre el pie; acortar el detalle de Mensual a "Cancela cuando quieras" en una línea.
2. [Tarjeta "Tu plan", párrafo inferior] "Llegarías a 76 kg hacia el 26 de enero (estimado)" es una promesa de resultado de salud sin prueba (la ficha prohíbe prometer; "estimado" no basta). Fix: reformular como supuesto ("A este ritmo, tu meta de 76 kg cae cerca del 26 de enero; depende de tu constancia") o quitar la fecha.
3. [Oferta / garantía] La garantía con plazo (7 días de reembolso) solo vive al final de la página, lejos del CTA; junto al CTA solo hay "Garantía de Cero Sorpresas · aviso 1 día antes". Además FICHA-MERCADO marca los plazos de Hotmart (prueba 3 días en ambos planes, garantía 7 días) como NO VERIFICADO: no se pueden afirmar como definitivos. Fix: en el pie, "Garantía de Cero Sorpresas: aviso 1 día antes + 7 días de reembolso", y confirmar los plazos en Hotmart antes de publicar.
4. [Tarjetas de plan y bloque "Con tu prueba desbloqueas"] Oferta débil: el anual no muestra el ahorro (~48% vs mensual), "MEJOR PRECIO" es adjetivo, y el stack de valor son 2 viñetas bajo el pliegue. Formatos numéricos mezclados (2.480 con punto de miles junto a US$4.17 con punto decimal). Fix: "Ahorras 48% vs mensual" en la tarjeta anual, 3 viñetas de valor con ícono más arriba y formato numérico unificado.
5. [Tarjeta "Tu primera foto" y secciones inferiores] La tarjeta (dispositivo ownable de la ficha: foto de comida protagonista) es solo texto, sin miniatura de la foto, y en la captura completa queda oculta tras el pie fijo (no verificable). Las secciones bajo el pliegue (beneficios, línea de tiempo, garantía) comparten el mismo plano sin separador. Fix: miniatura circular de la foto real en la tarjeta y alternar superficie elevada/base o hairline entre secciones.

Otros hallazgos (menores): CTA sin estado de carga ni bloqueo de doble toque (empezar() hace router.push sin guard; el catch casi nunca se dispara); role=radio sin navegación por flechas; whileTap del botón sin reduced-motion; la línea "25 XP · racha" en óxido #A83D06 compite con el titular; tarjeta Mensual más alta que Anual por salto de línea; más de 3 tamaños tipográficos (30/32/26/22/17/15/14/12), el 32 de kcal pesa más que el titular de 30; sin transición animada al cambiar de plan.

## Detalle
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: idea:3 especificidad:2 emoción:3 oferta:3 acción:3 (eje especificidad <=2: se corrige aunque el total pase)
Gate carga cognitiva: 1 fallo (pie fijo denso); no crítico.
CTA héroe vivo: contraste OK (~6.4:1), tap scale 0.97 OK, nunca disabled OK, h-14 ancho completo OK; falla solo la ausencia de estado de carga.
Fidelidad vs abc-ab.png: modo claro, hue lima/verde, Figtree, radios 16-26 y profundidad coinciden (0 de 6 fallos). El CTA verde en vez de barra oscura lo justifica la ficha.
Anti-clon: no coincide con Capítulo ni Umbral; paleta y tipografía coinciden con FICHA-ARTE v2 (#E4F2C9 / #3D6B4F, Figtree).
Message-match: N/A (sin dato de creativo).
