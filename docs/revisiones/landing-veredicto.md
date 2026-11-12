# VEREDICTO revisor-visual — landing (cuarta revisión, estilo v2 Lima fresca)
Fecha: 2026-11-12 10:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos:
1. [Screenshot completo, de ~y=250 a y=2000 en la vista reducida] Evidencia inválida: Problema, Agitación, Solución, App por dentro, Oferta, Garantía, FAQ y el cuerpo del CTA final salen EN BLANCO (el bloque oscuro final es un degradé vacío). Los reveals whileInView (useReveal en ui.tsx, once, amount 0.2) no se dispararon en la captura de página completa, así que ~75% de la página no está verificada visualmente (la propia regla: sin screenshot que muestre la sección, no cuenta). Fix: recapturar haciendo scroll por toda la página antes del full-page (o forzar estado visible con MotionConfig reducedMotion / ?capture=1) y volver a pasar al revisor.
2. [Hero, mockup del Chequeo y CTA] La 2ª nota naranja de la ficha (#E8590C, "grasas atrapadas") no aparece en nada visible de la landing, mientras la referencia (abc-ab.png) la usa en chip "+120 de aceite atrapadas", barra y botón; además tokens.css define --accent-2 como #C2490A (no el de la ficha) y ChequeoDemo hardcodea hex (#4B8062, #2F5640, #F4FAF5, #12261A en ui.tsx) en vez de tokens. Resultado: la landing se lee casi monocroma verde y menos "de la misma familia" que la app. Fix: chip naranja degradé #F5A524→#E8590C con "+120 kcal de aceite atrapadas" junto al 560, corregir --accent-2 a #E8590C y tokenizar los hex.
3. [Hero, fondo y composición] La firma v2 (cabecera lima con hoja redondeada radio 26 y foto de comida protagonista) no está: el hero es un degradé lineal tint→bg con miniatura de 52px; ni la hoja redondeada ni la foto grande aparecen. El dispositivo ownable queda reducido a rejilla+ticks (una vez) e isotipo. Fix: hero con bloque lima de borde inferior redondeado 26 y foto de la ensalada grande con las kcal encima, el demo subiendo como hoja.
4. [Hero, demo y leyendas] Textos de 11px ("Solo la foto", "Con el Chequeo", "Ejemplo ilustrativo...") y fila de confianza de 14px/13px tirando a pequeño; el 440 tachado en #4F5B51 sobre panel-campo pierde jerarquía; el mensaje de garantía compite con 3 líneas de iconos sobre un CTA ya fuerte. Fix: mínimo 12px en labels, 2 líneas de garantía máx.
5. [AppPorDentro y FAQ, copy] El kicker "VISTA PREVIA DEL DISEÑO · LA APP ESTÁ EN CONSTRUCCIÓN" más "Acceso anticipado" socavan la confianza justo antes de pedir pago, y las FAQ afirman funciones aún inexistentes (fotos no se guardan, escudo de racha, 8 fotos/día). Además el CTA del plan Mensual rompe el verbo único ("Probar con el plan mensual"). Fix: mover el aviso de preview a letra pequeña, unificar el verbo del CTA, y marcar en FAQ solo lo que ya existe.

Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
(h4 y h8 bajan por inconsistencia de tokens/naranja ausente y por no poder verificar el equilibrio visual de las secciones en blanco; h3/h7 verificados en código: sticky CTA con 2 estados y ocultación frente a CTAs inline, FAQ con aria-expanded, dots tocables, enlaces Entrar y legales, demo tocable con default razonable; h9 neutro en landing.)
Craft: jerarquía:3 profundidad:2 identidad:2 movimiento:3 encaje:3
(profundidad: hero con tint→bg y sombras tintadas, pero 3 niveles no verificables en el resto por blancos; identidad: Figtree + lima/verde no coincide con los clones vetados Capítulo/Umbral, pero sin hoja lima, sin foto héroe, sin naranja; movimiento verificado en código: reveal escalonado + reduced-motion, conteo 440→560 y cifras, whileTap 0.97 en CtaButton/sticky/Oferta, acordeón; faltan anillos/barras dibujados.)
Copy: idea:4 especificidad:3 emoción:3 oferta:3 acción:3
(trazado a FICHA-AVATAR: hero dolor 1/2 + deseo 1, objeción cobros sorpresa en hero/Oferta/Garantía/FAQ, mecanismo "Chequeo de Grasas Ocultas" bautizado en hero, solución, oferta y FAQ; Garantía de Cero Sorpresas con nombre y plazo de 7 días tras la oferta; precio US$49.99/US$4.17/US$0.14 día; sin claims de ingresos/salud; sin prueba social real; message-match N/A.)
Gate de carga cognitiva: 0-1 fallas (Problema con 5 ítems en el límite). Una acción primaria repetida.
CTA héroe vivo: contraste #F6F8F1 sobre #3D6B4F ≈ 5.9:1 OK; whileTap 0.97 OK; nunca disabled OK; alto 52px y ancho completo OK.
Fidelidad vs abc-ab.png: modo claro, hue verde, Figtree, radios 12-16 y sombras tintadas coinciden; un desvío visible (ausencia del naranja y de la hoja/foto) = 1 de 6 fallos, por debajo del umbral de 2, FIEL con reserva.
Umbral: LISTA exige >=36/40 usabilidad, >=16/20 craft y >=16/20 copy sin eje <=2. Copy cumple (16); usabilidad 28 y craft 13 no.
