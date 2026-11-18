# VEREDICTO revisor-visual — admin-usuarios
Fecha: 2026-11-18 12:00
Screenshot: docs/revisiones/admin-usuarios-1440.png (escritorio; NO hay captura a 375px, docs/revisiones/admin-usuarios-375.png no existe)
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Sin movimiento en toda la pantalla (cero entrada escalonada, cero feedback de tap, cero transiciones, sin reduced-motion; los botones por fila solo se desactivan sin indicador de carga). 2) Jerarquía de acciones: el formulario de alta (4 campos) va antes que la lista y empuja a las personas bajo el pliegue; 4 botones negros del mismo peso (Agregar, Buscar, Extender/Dar acceso por fila) compiten, sin acción primaria clara. 3) 5 de 7 pestañas son "PRONTO" (ruido y más de 4 opciones); además la lista no tiene filtros por estado ni paginación (regla de más de 8-10 ítems). 4) El mensaje de éxito queda fijo entre los campos y el botón tras reiniciar el formulario; "Quitar acceso" usa confirm() nativo del navegador y no hay deshacer; el admin aparece como "Sin nombre". 5) Falta la captura a 375px: tabs con scroll horizontal, rejilla de 2 columnas y formulario apilado sin verificar.
