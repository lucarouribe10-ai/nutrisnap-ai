# VEREDICTO revisor-visual — paywall
Fecha: 2026-11-18 15:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Tarjeta "Tu plan", esquina superior derecha] La miniatura circular (56px, top -28px, right 16px) pisa la esquina del panel de cifras: su circulo cubre el borde lima del panel (~11px) y el borde de la tarjeta, se lee como pegatina chocando y no como firma. Ademas es chica frente al plato grande que pide la ficha v3. Fix: dar a la tarjeta pt-10/12 para que la miniatura viva en espacio libre (o subirla a 72-80px centrada sobre el panel) sin tocar ningun borde.
2. [Tarjeta "Tu plan", parrafo de 5 lineas + jerarquia numerica] El parrafo de 14px mezcla tres mensajes (fecha de meta, freno, mecanismo) y deja una viuda ("ve.") en la ultima linea: falla el "texto por bloque 3-4 lineas". Ademas tres cifras pesadas compiten con el titular de 30px (kcal 28, precios 26) y no hay un heroe claro. Fix: separar en 2 lineas (meta en una; el freno/Chequeo en una linea propia con text-pretty, max 3 lineas) y que solo un numero sea heroe (kcal a 32+ o precios a 22).
3. [Todo lo que esta bajo el pliegue: "Con tu prueba desbloqueas", linea de tiempo, enlaces] Siguen en el mismo plano sin separador ni superficie alterna (defecto repetido por tercera vez); la tarjeta "Tu primera foto" (la prueba del mecanismo) y el stack de valor quedan lejos del boton, y el pie fijo (~182px, 22% del alto, 4 elementos) sigue siendo denso. Fix: envolver beneficios+linea de tiempo en una superficie elevada con hairline, separar con hairline degradé, y fundir pie en 3 elementos (CTA, cobro+garantia en una linea, salida).
4. [Plan Anual/Mensual y cifras] Formato numerico mixto en la misma pantalla: "2.480 kcal" (separador de miles es-CO) junto a "US$4.17" y "US$49.99" (punto decimal). Un usuario lee 2.480 como 2,48. El aro y borde del plan no elegido (~1.5-2:1) quedan bajo 3:1, y el nodo del 20 de noviembre aparece relleno como si ya hubiera pasado. Fix: toLocaleString('en-US') en kcal/proteina (como landing y resto de la app); aro del no elegido a >=3:1; nodo 2 hueco.
5. [Encabezado "25 XP · racha de 1 día" y falta de respuesta de pago] Jerga de gamificacion para quien aun no usa la app, compite con el titular; y no hay respuesta a la objecion 5 de la ficha (pagar en mi moneda / es seguro): ni Hotmart ni medios de pago, y la nota de "Vista previa" solo sale en desarrollo. Tampoco hay transicion animada al cambiar de plan (el check aparece de golpe). Fix: quitar la linea XP del paywall (o bajarla a la tarjeta), agregar junto al cobro "Pago seguro con Hotmart" con medios por pais cuando FICHA-MERCADO se verifique, y animar el aro/check con spring corto.

## Detalle
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:4 h6:3 h7:3 h8:3 h9:3 h10:3 = 31
Craft: jerarquia:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15
Copy: idea:3 especificidad:3 emocion:3 oferta:3 accion:3 = 15 (ningun eje <=2; total <16)

Gate de carga cognitiva: 1 fallo (parrafo de 5 lineas; el pie es denso pero no se cuenta como fallo). No critico.
CTA heroe vivo: PASA los 4 (contraste #15191A sobre #F5F7F2; whileTap 0.97; nunca disabled por defecto, solo "Abriendo..." tras el clic y se reactiva a los 10 s con role=alert; h-14 ancho completo).
Anclas de conversion: titular con enfasis OK; hairline degradé en tarjeta Tu plan OK; chips SVG sin emojis OK; secciones adyacentes distinguibles: FALLA bajo el pliegue.
Sub-checks de copy: garantia nombrada junto al CTA: PASA ("Garantia de Cero Sorpresas · 7 dias de reembolso"). Message-match: N/A (sin dato de creativo).
Resueltos desde la pasada anterior: miniatura circular de la primera foto con borde blanco y sombra (identidad +1: ya hay dispositivo ownable de la ficha v3, aunque mal encajado), garantia nombrada, aviso no repetido, parrafo de garantia duplicado eliminado, pb-56 (224px) mas que el pie, "Abriendo..." con salida a 10 s, foco que sigue al radio, frase de meta reescrita, kcal a 28px, aria-live en el cobro.
Verificado en codigo: stagger de entrada, conteo de numeros (Cuenta), linea de tiempo que se dibuja, whileTap en CTA y planes, useReducedMotion en entrada y conteo. Faltan: transicion de seleccion de plan y celebracion (no aplica a paywall).
Contrato FICHA-ARTE v3: fondo #F5F7F2, negro #15191A en boton, acento verde #2F5E3E, lima en cabecera y marco, tarjeta 24 y boton pildora coinciden. Desvios: el panel interior de cifras usa radio 12px fuera de la escala (24 / 28-32); la tarjeta clave es blanca con marco lima en vez de bloque pastel pleno; plato circular presente pero pequeno.
Anti-clon: no coincide con Capitulo ni Umbral.
No verificable visualmente: la tarjeta "Tu primera foto" y el encabezado "Con tu prueba desbloqueas" quedan tapados por el pie fijo en la captura completa (el pie se dibuja a mitad); se juzgo por codigo. La "N" es del indicador de desarrollo de Next y no se penaliza.
Plazos NO VERIFICADOS (FICHA-MERCADO): prueba de 3 dias y garantia de 7 dias de Hotmart sin confirmar; no se penaliza como defecto de la pantalla, pero hay que confirmarlo antes de publicar, igual que el aviso por correo previo al cobro (aun no existe).
Gate doble: 31/40 (<36), 15/20 (<16), copy 15/20 (<16): NO LISTA.
Para llegar: craft +1 (arreglar el choque de la miniatura y la viuda del parrafo, separadores/superficie bajo el pliegue y transicion de seleccion del plan); usabilidad +5 es el grueso: pasar a 4 al menos cinco criterios (h2 sin jerga XP, h4 formato numerico unico, h6 stack de valor visible junto a los planes, h8 pie en 3 elementos y una sola jerarquia numerica, h10 respuesta de pago/Hotmart); copy +1 (oferta o emocion: subir el valor desbloqueado y la escena "la foto no ve el aceite" al nivel del titular, no en un parrafo de 14px).
