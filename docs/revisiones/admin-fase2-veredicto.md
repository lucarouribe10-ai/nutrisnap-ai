# VEREDICTO revisor-visual — Panel de administración, fase 2 (Resumen, Salud, Uso, Costo de IA)
Fecha: 2026-11-18 00:00
Alcance: herramienta interna del dueño (no vende: Copy N-A). Capturas de ESCRITORIO, NO hay captura a 375px de ninguna de las cuatro; todo lo móvil se juzgó solo por código (certeza baja). Gate: >=36/40 y >=16/20.
Nota: la captura del Resumen está desactualizada respecto al código (muestra «Cuando esté lista la pestaña Salud verás…» y no muestra el enlace «Ver en Salud» que el código ya tiene). Hay que recapturar.
Nota: las capturas miden ~1634-1714 px de ancho y el contenido ocupa casi todo, aunque el código limita a 960px; no parece un viewport real de 1440. Recapturar a 1440 y a 375.

---

## Pantalla: Resumen
Screenshot: docs/revisiones/admin-resumen-1440.png
Usabilidad: 27/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:2 h8:3 h9:2 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:2 movimiento:1 encaje:3
Top defectos:
1. [Aviso peach superior] «Alguien pudo chocar con un problema en la app» es vago y la captura no tiene enlace a Salud (el código sí; recapturar). Fix: «1 error sin resolver: ver cuál» con el enlace visible.
2. [Tarjeta «Ganancia real de este mes»] La métrica más importante es una frase de 15px sin héroe, y el texto en código remite a «la pestaña Ajustes de la próxima fase», que no existe (jerga del constructor). Fix: héroe «—» o «$0» a 44px con una línea y quitar la mención a Ajustes.
3. [Todo el cuerpo] 3 de 5 tarjetas son «Sin datos» idénticas y el héroe 32px apenas supera al título 28px: nada manda. Fix: héroe 44-48px en «Personas con cuenta» y agrupar las tarjetas vacías en un bloque «Aún sin datos: se llenan cuando…».
4. [Personas con cuenta] «2» héroe repetido en el chip «2 nuevas 7 días»; y no cuadra con Uso (activas 30 días = 1 aquí, «abrieron la app 30 días = 0» allá) sin explicación. Fix: unificar la definición de «activa» o rotular la diferencia.
5. [Movimiento] Solo el aviso entra con fade; las tarjetas no escalonan, el número no cuenta. Fix: envolver cada Tarjeta en Entrada con i incremental y contar el héroe.

---

## Pantalla: Salud
Screenshot: docs/revisiones/admin-salud-1440.png
Usabilidad: 25/40
Craft: 10/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:2 h4:3 h5:2 h6:3 h7:2 h8:3 h9:2 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:2 movimiento:1 encaje:2
Top defectos:
1. [Banner verde «Todo en orden»] Dice todo bien mientras Hotmart no está conectado y las diferencias de cobro no se pueden medir: tranquilidad falsa para el dueño. Fix: estado neutro «Sin problemas conocidos; falta conectar Hotmart» (gris/lima suave con ícono distinto).
2. [Botón «Marcar como resuelto», solo visible en código] Cierra de golpe TODOS los errores con ese mensaje, sin confirmar, sin feedback de envío, sin deshacer ni reabrir, y si falla solo hace console.error (silencioso). Fix: estado pendiente (useFormStatus), aviso «Marcados N como resueltos · Deshacer» y mensaje visible si falla.
3. [Tarjeta «Diferencias de cobro»] No tiene chip de ícono: el título queda más cerca del texto (58px vs 76px de las otras) y la tarjeta se ve de otra familia. Fix: darle ícono (Scale/Receipt) o reservar la misma altura de cabecera.
4. [Lista de errores, solo código] Muestra `e.mensaje` crudo (puede ser técnico) bajo un subtítulo que promete «lenguaje claro», y sin límite de elementos (con 2000 filas, lista sin tope). Fix: traducir mensajes conocidos y mostrar los 5 primeros con «Ver todos».
5. [Estado de error] La captura solo muestra el estado resuelto: el estado con errores no está verificado visualmente. Fix: capturarlo con un error de ejemplo.

---

## Pantalla: Uso
Screenshot: docs/revisiones/admin-uso-1440.png
Usabilidad: 27/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:2 h8:2 h9:3 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:2 movimiento:2 encaje:2
Top defectos:
1. [Recorrido de venta] 8 filas de las cuales 6 son «0 0%» con barra vacía: ruido, y «0» + «0%» juntos es redundante. Fix: mostrar solo la tasa de paso al siguiente escalón y plegar los escalones en cero.
2. [Retención] Tres tiles idénticos con «Sin datos: nadie cumple aún ese día» a 11px (bajo contraste/legibilidad) y «—» como héroe. Fix: un solo mensaje «Sin datos todavía: se llena cuando alguien cumpla 1 día» a 14px.
3. [Navegación del período] «Últimos 30 días» fijo, sin selector 7/30/90 ni fechas reales (regla de vistas temporales). Fix: píldoras 7·30·90 con rango de fechas visible.
4. [Código del embudo] `<ol>` contiene `<div>` (Entrada) antes del `<li>`: HTML inválido que rompe la semántica de lista; además las barras no se dibujan (ancho estático) ni cuentan los números. Fix: animar el ancho de la barra de 0 al valor y mover la animación dentro del `<li>`.
5. [Vocabulario] «Chequeo de aceite» en el embudo vs «Chequeo de Grasas Ocultas» en la ayuda; «Activación» y «Retención» son jerga de producto para una dueña no técnica. Fix: unificar el nombre y renombrar a «Primera comida registrada» / «Vuelven a la app».

---

## Pantalla: Costo de IA
Screenshot: docs/revisiones/admin-ia-1440.png
Usabilidad: 25/40
Craft: 10/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Detalle usabilidad: h1:2 h2:2 h3:3 h4:2 h5:3 h6:3 h7:2 h8:2 h9:3 h10:3
Detalle craft: jerarquía:2 profundidad:3 identidad:2 movimiento:1 encaje:2
Top defectos:
1. [Banner verde «El gasto de IA está en orden»] Aparece con CERO llamadas medidas: un verde afirmativo sin datos que lo respalden, contrario a la regla de no inventar. Fix: estado neutro «Aún no hay gasto que evaluar» cuando delMes.length === 0.
2. [Cuatro tarjetas «Sin datos»] Costo del mes, Costo de hoy, Llamadas y Rapidez dicen casi lo mismo y ocupan la mitad de la pantalla. Fix: un único bloque vacío que explique «se llena al activar la clave de producción» y mostrar las 4 métricas solo con datos.
3. [Jerga] «con tokens reales», «precio del modelo», «clave de producción»: lenguaje de ingeniero para la dueña. Fix: «Cuánto cuesta analizar las fotos» y «Falta activar la IA real» / «Falta anotar el precio de la IA».
4. [Iconos y cabeceras] El mismo ícono Cpu en «Costo del mes» y «Llamadas del mes»; «Últimos 14 días» sin chip (espaciado distinto). Fix: íconos únicos (Wallet, Phone-call/Hash, Gauge, Timer) y chip en todas las tarjetas.
5. [Gráfico de 14 días, solo código] 14 filas de barras negras con barra de ancho estático, orden del más nuevo al más viejo (al revés de lo habitual en gráficos temporales) y sin animación de dibujo. Fix: ordenar de más viejo a más nuevo y animar el ancho.

---

## Defectos comunes (las 4)
- Banners verdes «todo en orden» sin datos que los respalden (Salud, IA; Resumen igual con «este mes»/«esta semana» incoherente).
- Jerarquía plana: héroe 32px ≈ h1 28px, las métricas clave son frases, todas las tarjetas pesan igual y hay muchos «Sin datos» repetidos; falta un protagonista por pantalla.
- Movimiento casi nulo: solo aviso/embudo hacen fade; no hay conteo de números, ni barras que se dibujan, ni transición de pestañas.
- Móvil sin verificar: la barra de pestañas (5 píldoras, ~475px) hace scroll horizontal oculto sin indicio y la pestaña activa «Costo de IA» puede quedar fuera de vista en 375px; el menú ℹ de 40px (<44) cambia el layout al abrir y no cierra con Escape ni fuera.
- Fidelidad a FICHA-ARTE v3: paleta (#F5F7F2/#FEFFFC/lima/durazno/negro píldora), radios 24 y Figtree coinciden; desvío menor: hex directos (#A83D06, #8A3A06) en componentes en vez de tokens. Tampoco clona Capítulo ni Umbral.
- Sin pestaña ni selector de período ni fechas reales en Resumen/Uso/IA.
