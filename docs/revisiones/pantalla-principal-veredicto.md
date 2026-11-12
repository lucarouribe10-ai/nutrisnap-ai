# VEREDICTO revisor-visual — pantalla-principal (Hoy)
Fecha: 2026-11-11 12:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 26/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Campana de avisos (Hoy.tsx L48) es un <button> sin onClick ni destino: elemento tapable que no hace nada; igual las filas de comida (li sin Link/button) y la pastilla de racha "12" parecen tapables y no responden. 2) No hay forma de editar, borrar ni deshacer una comida desde Hoy (control y libertad = 0 en código; una comida mal detectada queda para siempre). 3) Tarjeta de macros: las etiquetas "Proteína de 164 / Grasas de 69 / Carbos de 301" se parten en dos líneas y dejan el número meta huérfano ("164" solo abajo); en el tour aprobado eran etiquetas cortas de una línea. 4) Dos números héroe de 28px compiten (79,4 kg y 1.370 kcal) y la tarjeta verde mezcla dos métricas distintas (peso + nivel/XP); >3 tamaños de texto (28/20/18/17/15/14/13/12); el ritual diario (kcal de hoy) queda en 2º lugar. 5) Movimiento incompleto y sin estados de error/offline: filas, campana, banner y pastilla sin whileTap; sin transición entre pestañas; barras de macros/XP estáticas; sin celebración; lectura de datos solo con catch silencioso en app-store, sin mensaje de error ni estado offline. Además regresiones vs tour aprobado: racha sin etiqueta ("12" vs "12 DÍAS"), XP sin tope ("340 XP" vs "340/500 XP"), "Foto · segundos" ambiguo.
