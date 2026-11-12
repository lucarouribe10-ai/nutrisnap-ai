# VEREDICTO revisor-visual — pantalla-principal (Hoy)
Fecha: 2026-11-12 10:00
Screenshot: docs/revisiones/hoy-375.png
Usabilidad: 26/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. Sobrecarga en la primera vista (gate cognitivo: 7 bloques en total, 5 antes del primer scroll; racha y semana duplican el mismo dato) -> fusionar la RachaCard y la tira de 7 días en un solo bloque, mover Misiones y "Camino a tu meta" a otra sección o bajarlos.
2. Editar comida (Hoy.tsx, submit del formulario del sheet): si el nombre o las kcal son inválidos el formulario no hace nada y no dice nada -> mostrar el error inline ("Pon un nombre y calorías entre 1 y 3.000") y marcar el campo.
3. Tarjeta de racha (zona media): el texto cae a 2 líneas con "días." huérfano y mete "1 escudo" y "Premio en 2 días" sin explicar -> una sola línea ("Hoy ya cuenta · 1 escudo") y el premio en otra línea o con nombre.
4. Cabecera con foto: el número 1.110 y "Te quedan hoy" van en blanco sobre pollo y arroz claros, y el degradé de oscurecido es casi nulo a esa altura (0.05 al 46%) -> subir la opacidad del degradé en la franja 50-100% y medir el contraste (>=4.5:1).
5. Movimiento y tokens: sin transición entre pestañas, sin stagger en racha, semana y macros, el sheet de detalle no tiene animación de salida, y hay muchos hex sueltos en componentes (#A83D06, #5A2D05, #7A4A1C, #E8590C) -> añadir AnimatePresence y stagger de 60ms, y pasarlos a tokens.
