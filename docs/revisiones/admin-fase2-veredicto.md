# VEREDICTO revisor-visual — Panel de administración, fase 2 (Resumen, Salud, Uso, Costo de IA) — SEGUNDA PASADA
Fecha: 2026-11-18 12:00
Alcance: herramienta interna de la dueña (no vende: Copy N-A; sin referencia visual). Capturas a 375 y 1440 px, vacío y lleno, con datos de ejemplo. Gate: >=36/40 y >=16/20 por pantalla.
Fidelidad a FICHA-ARTE v3: paleta (#F5F7F2 / #FEFFFC / lima / durazno / negro píldora), Figtree única, radio 24 y píldoras coinciden. No hay hex directos en components/admin (ya van por tokens; --durazno-tinta añadido). No clona Capítulo ni Umbral. Sin desvío.
Verificación en código: movimiento (Entrada con stagger, Contar, Barra que se dibuja) con useReducedMotion en las tres; tap con active:scale en pestañas y botones; Ayuda cierra con Escape y al tocar fuera, objetivo táctil 44px; «Marcar como resuelto» ahora tiene estado «Guardando…», aviso de qué pasó, «Deshacer» y mensaje de fallo visible (no pide confirmación previa, pero es reversible: aceptable). NO verificable en pantalla: los estados «resuelto/deshacer/fallo» no están capturados.
Nota de captura: Salud-lleno muestra «1 avisos de Hotmart» y Uso-lleno muestra «2190 con foto» sin separador, aunque el código actual ya pluraliza bien y usa el formateador. Parecen capturas anteriores a la última edición de SaludVista/UsoVista: recapturar. Lo que se ve se califica como se ve.

## RESOLUCIÓN DE DEFECTOS DE LA PRIMERA PASADA
Resumen: 1 resuelto (aviso con conteo y enlace «Ver cuál en Salud»). 2 parcial (ya no menciona Ajustes; pero el héroe sigue siendo un guion corto de 32px, incluso con 41 ventas). 3 resuelto en lo esencial (héroe 44px en «Personas con cuenta»). 4 sin resolver en vacío (tres tiles con «2 2 2»). 5 resuelto (stagger + conteo).
Salud: 1 resuelto (neutro «Sin problemas conocidos»). 2 resuelto en código (pendiente, deshacer, error visible), sin captura de esos estados. 3 resuelto (chip en las tres tarjetas, misma altura). 4 resuelto (frase clara + mensaje original plegado + tope de 5 con «Ver todos»). 5 parcial (estado con errores capturado; falta capturar el resuelto/fallo).
Uso: 1 resuelto (pasos en cero plegados en «1 paso más sin nadie»). 2 resuelto (un solo mensaje a 15px). 3 resuelto (píldoras 7·30·90 + rango de fechas real). 4 resuelto (barras se dibujan, HTML válido). 5 resuelto (nombre unificado, «Primera comida registrada», «Vuelven a la app»).
Costo de IA: 1 resuelto (neutro con 0 llamadas; verde solo con datos). 2 resuelto (una tarjeta vacía en vez de cuatro). 3 resuelto en lo visible. 4 resuelto (íconos únicos, chip en todas). 5 resuelto (viejo a nuevo, barras animadas).

---

## Pantalla: Resumen
Screenshot: docs/revisiones/admin-resumen-lleno-375.png (+ vacio-375, lleno/vacio-1440)
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:2 encaje:3
Top defectos:
1. [Tarjeta «Ganancia real de este mes», lleno] Tres formatos de dinero juntos: «US$ 204,59», «$ 380.000» y «$0.62» (el costo de IA en USD pierde «US$» y usa punto). La dueña no sabe qué moneda es cada «$». Fix: formatear todo con la misma función (moneda explícita: «US$ 0,62», «COP $ 380.000») en lugar de usd() en en-US.
2. [Héroe «—» de Ganancia real] Con 41 ventas el protagonista de la tarjeta es un guion de 32px que parece roto. Fix: calcular ganancia con lo que haya («Ingresos − IA») marcada como estimada, o un héroe de texto «Aún no se puede calcular» a 22px con el motivo debajo.
3. [Tarjeta «Personas con cuenta», vacío] Cuatro veces el mismo «2» (héroe + 3 tiles): dato repetido, sin información. Fix: con <5 cuentas ocultar los tiles y dejar «2 personas, ambas nuevas esta semana».
4. [Movimiento] Solo entrada, conteo del héroe y pestañas con tap; sin transición entre pestañas ni popover de ℹ animado. Fix: fade 200ms del contenido al cambiar de pestaña y entrada suave del popover.
5. [Navegación 375px] La pestaña «Costo de IA» queda fuera de vista cuando Resumen está activa (solo la sugiere el difuminado). Fix: dejar asomar medio chip o reducir el padding de píldora a 14px para que quepan 4,5.

---

## Pantalla: Salud
Screenshot: docs/revisiones/admin-salud-lleno-375.png (+ vacio-375, lleno/vacio-1440)
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:3 movimiento:2 encaje:3
Top defectos:
1. [Aviso naranja + tarjeta «Conexión con Hotmart», lleno] «1 avisos de Hotmart con problema» (gramática, ver nota de captura) y el problema no dice cuál es ni qué hacer; la tarjeta de Hotmart lo repite en texto plano sin tono de atención. Fix: tarjeta Hotmart con borde/chip durazno y frase «Hacer: revisar el aviso en Hotmart → Herramientas → Notificaciones» o enlace a ayuda.
2. [Tres bloques de error] Tres cajas grises idénticas, cada una con su botón con borde negro de 2px: pesa lo mismo el error repetido 7 veces que el de 1 vez; ninguna jerarquía. Fix: poner la cantidad («7 veces») como dato destacado a la derecha y ordenar/teñir en durazno solo el más frecuente.
3. [Tarjeta de errores, código] El estado «Marcado como resuelto · Deshacer» y el de fallo no están capturados; además marcarResuelto solo revalida '/admin' (no '/admin/salud'), así que el aviso de arriba «10 errores sin resolver» puede quedar desactualizado tras resolver. Fix: revalidatePath('/admin/salud') y capturar los dos estados.
4. [Jerarquía de pantalla] Sin héroe ni protagonista: título 28px y títulos de tarjeta de 12px en mayúsculas, todo pesa lo mismo. Fix: mostrar el número de errores abiertos como héroe 44px en la tarjeta de errores.
5. [Texto] «servidor» y «Pantalla desconocida» son lenguaje de ingeniero para la dueña. Fix: «Se cortó la conexión de internet de la persona» y «Pantalla sin nombre».

---

## Pantalla: Uso
Screenshot: docs/revisiones/admin-uso-lleno-375.png (+ vacio-375, lleno/vacio-1440)
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Top defectos:
1. [Recorrido de venta, lleno 375] La primera barra ocupa todo el ancho y las demás son más cortas porque reservan 80px para «% pasó»: 410 de 940 se ve como ~44% de una pista más corta. La escala miente. Fix: reservar siempre el espacio de la columna «% pasó» (también en la 1.ª fila) para que todas las pistas midan igual.
2. [Gate de carga] El embudo muestra 7 pasos seguidos (límite 4-5) más 4 tarjetas: sobrecarga leve. Fix: agrupar en 3 etapas (Descubren · Deciden · Entran) con el detalle plegado.
3. [Comidas registradas, lleno] «2190 con foto» sin separador junto al héroe «2.814» (ver nota de captura: el código ya lo corrige). Fix: recapturar y confirmar.
4. [Vacío, Vuelven a la app] Sigue mostrando la línea «Personas que abrieron la app: hoy 1 · 7 días 2 · 30 días 2» bajo un «Todavía no hay datos», y choca con «entraron en 7 días» del Resumen sin que se aclare. Fix: mover esa línea a su propia tarjeta «Abrieron la app» o unificar el término con el Resumen.
5. [Movimiento] Barras y conteo bien; faltan transición entre períodos (los números saltan al cambiar 7/30/90) y feedback inmediato al tocar la píldora. Fix: estado pendiente en la píldora (useTransition) mientras carga el nuevo período.

---

## Pantalla: Costo de IA
Screenshot: docs/revisiones/admin-ia-lleno-375.png (+ vacio-375, lleno/vacio-1440)
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Top defectos:
1. [Tarjetas «Costo del mes» y «Costo de hoy»] En la misma pantalla: «US$0,62» (coma, con US$) y «$0.02» (punto, sin US$), «0.8%» con punto vs «1,2 s» con coma. Dos convenciones numéricas y monetarias mezcladas. Fix: una sola función de formato es-CO con «US$» y coma decimal en todo (hero, filas de 14 días, Resumen).
2. [Cuadrícula 1440] «Costo de hoy» y «Rapidez» son más bajas que su vecina: alturas desiguales y huecos bajo ellas. Fix: grid con items-stretch y altura igual (h-full en Entrada/Tarjeta).
3. [Vacío, tarjeta «Cuánto cuesta analizar las fotos», 375] El título largo envuelve a 2 líneas y el ℹ queda huérfano en una 3.ª línea. Fix: acortar a «Costo de las fotos» o poner el chip y el ℹ en la misma línea que la primera palabra.
4. [Últimos 14 días] Dos filas «0 · —» con barra vacía y costos con precisión cambiante («$0.0021», «$0.02», «$0.04»): ruido y cifras no comparables. Fix: plegar los días vacíos y usar siempre 2-3 decimales en la columna de costo.
5. [Aviso verde] Con 1.840 fotos y 12 fallos (1%) dice «en orden» sin mirar los fallos; fix: pasar a atención si fallidas/llamadas > 5% y decir qué hacer.

---

## Resumen del gate
Ninguna de las cuatro pestañas llega a 36/40 ni a 16/20: todas NO LISTA. Mejora fuerte respecto a la primera pasada (25-27 a 29-30 en usabilidad; 10-11 a 13-14 en craft). Los bloqueos que quedan son de consistencia de formato (dinero/decimales), jerarquía de Salud, escala del embudo, alturas de la cuadrícula y movimiento (sin transición de pestañas). Recapturar Salud-lleno y Uso-lleno tras la última edición, y capturar los estados resuelto/deshacer/fallo.
