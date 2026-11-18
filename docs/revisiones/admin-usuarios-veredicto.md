# VEREDICTO revisor-visual — admin-usuarios
Fecha: 2026-11-18 12:50
Screenshot: docs/revisiones/admin-usuarios-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) Filtro sin resultados (p. ej. «Vencidas») muestra «Todavía no hay cuentas.» aunque haya cuentas: mensaje falso, sin salida (app/admin/usuarios/page.tsx línea 34). (2) Craft 13/20: identidad ownable casi ausente en el panel (solo borde lima + pastillas; sin isotipo/detalle firma) y movimiento limitado a entrada escalonada + tap (chips de filtro sin feedback de tap, sin transición entre pestañas). (3) Tarjeta repite información («Origen: Alta manual» y «Motivo: Alta manual») y a la administradora se le muestra «Sin acceso» + «Dar acceso 30 días», confuso. (4) Errores con jerga y sin solución: «Falta configurar la clave secreta del servidor», «Datos no válidos», «Sin datos:». (5) Pestañas y filtros se ven idénticos (dos filas de píldoras iguales), el botón «Buscar» con borde grueso de 2px compite con la acción principal, y la escala tipográfica usa ~8 tamaños (11 a 28 px) en vez de máx. 3-4.
