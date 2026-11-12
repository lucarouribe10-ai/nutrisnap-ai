# VEREDICTO revisor-visual — pantalla-principal (Hoy)
Fecha: 2026-11-12 12:00
Screenshot: docs/revisiones/hoy-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. [Evidencia] docs/revisiones/app/01-hoy.png es idéntica al viewport (750x1624, termina en la fila "Almuerzo" bajo la barra). La 3ª comida, "Añadir otra comida", Misiones/cofre y "Camino a tu meta" NO se vieron renderizados: solo están verificados por código. Fix: capturar página completa real (fullPage) y re-puntuar.
2. [Racha, fila de hoy "J 12"] el check verde #3D6B4F sobre la píldora oscura #242B24 casi no se ve (~2:1); además la tarjeta racha (peach, ~290px) es el 2º bloque más pesado y compite con el héroe de kcal. Fix: check claro (lima #E4F2C9/blanco) en el día de hoy y compactar la tarjeta (quitar números de fecha o bajar a una sola fila) para que el héroe domine.
3. [Código: Hoy/RachaCard/AppShell] hex sueltos en componentes (#A83D06, #E8590C, #C9A227, #F4FAF5, #1E2820, gradientes), RachaCard con dos variantes de color (tokens --racha-* vs hex) y radios mezclados 16/22/26/32 en la misma vista; momento() calcula pastel de comida (bg) que nunca se usa (la ficha prometía pasteles por comida). Fix: tokens CSS para todo color, un solo radio de tarjeta (16 o 22), usar o borrar m.bg.
4. [Fila "Avena con huevos"] subtítulo "Foto" no informa nada (relleno); "1 escudo" y "XP" sin explicación en esta pantalla. Fix: mostrar proteína/macros de la comida en lugar de "Foto" y añadir una ayuda breve (tooltip/hoja) a escudo y XP.
5. [Movimiento, código] sin transición entre tabs, hoja de detalle y toast de deshacer sin animación de salida, sin whileTap en píldora XP, tarjeta de racha ni "Añadir otra comida", anillo solo se dibuja en la variante sin foto; naranja (barra, racha, XP, grasas, aceite, FAB) esparcido en 6 sitios diluye el acento. Fix: AnimatePresence en rutas/hoja/toast, whileTap 0.97 en todos los links-card, limitar naranja a kcal+FAB+racha.
