# VEREDICTO revisor-visual — onboarding
Fecha: 2026-11-11 13:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) Pantalla del aha sobrecargada: titular + tarjeta de plato + panel 440/560 (el 560 se repite en titular y panel) + tarjeta Chequeo + tarjeta "23% de tus kcal" + tarjeta Recompensa (XP, racha, nivel, barra, logro) = 6 bloques y 3 sistemas de progreso; falla el gate de carga cognitiva -> quitar la barra de Nivel y fusionar el 23% dentro del panel de cifras, dejar Recompensa en una sola línea con logro. (2) La recompensa del aha nace bajo el CTA fijo (y~680-885 de 812px) y no hay scrollIntoView tras elegir cucharadas: el usuario no ve lo que ganó -> scroll suave a la Recompensa o mostrarla dentro de la tarjeta verde. (3) Contraste AA en el naranja pequeño: chip "Día 1" blanco sobre #E8590C (~3.6:1 a 12px) y "25 XP ganados" naranja sobre tinte rosado (~3:1 estimado, medir) -> oscurecer el naranja de texto a >=4.5:1 o usar texto oscuro. (4) Reduced-motion incompleto: ui.tsx (ChipOpcion stagger, whileTap, Anillo, BarraProgreso) y Recompensa.tsx (springs, barra XP) no consultan useReducedMotion y no hay MotionConfig global -> MotionConfig reducedMotion="user" en el layout. (5) Dictado por voz sin feedback (rec.start() sin estado "Escuchando", sin onerror; si falla no pasa nada) y abreviatura "cdas" -> estado escuchando/error con mensaje y "cucharadas" completo; además "Primero ves tu primer resultado. Después decides." se repite en 3 pasos y el paso de nombre deja >50% de la pantalla vacía.
