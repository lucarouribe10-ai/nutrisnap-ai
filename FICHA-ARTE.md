# FICHA DE DIRECCIÓN DE ARTE — NutriSnap AI (v3 APROBADA por el usuario 2026-11-17 — COSA JUZGADA)

> v3 (2026-11-17): la dueña rechazó el encabezado oscuro de Hoy (2 opciones de foto) y pidió un estilo MÁS CLARO/PASTEL con 5 referencias de Pinterest (apps de nutrición: platos recortados en círculo, macros en tarjetas pastel, barra inferior blanca, acentos negros). Propuesta en 3 pantallas (docs/revisiones/estilo-v3/propuesta-clara.html) → "Sí, aplícalo". Reemplaza la identidad v2 (verde oscuro #3D6B4F en barra/botones, foto a pantalla completa, rejilla técnica). Punto de retorno: `git tag punto-antes-de-v3`.
> REGLAS v3 (mandan sobre lo de v2 de abajo cuando se contradigan): fondo #F5F7F2 · superficie #FEFFFC · pasteles de bloque: LIMA #D8F0AE (profundo #C6E88F), DURAZNO #FFE2C2, CIELO #D3ECF7, MENTA #D2F0DF, LILA #E6E1FB · NEGRO #15191A para botones principales, selección y día de hoy (texto #F5F7F2) · acento de texto verde #2F5E3E · NARANJA #E8590C solo racha/XP/aceite atrapado · texto #15191A / #525E57 · radios: tarjeta 24, bloque 28-32, botón píldora · sombras tintadas rgb(21 25 26) · barra inferior BLANCA translúcida flotante (pestaña activa en lima, botón central NEGRO con cámara lima) · macros: Proteína=lima, Grasas=durazno, Carbos=cielo (barra negra) · comidas: foto de plato RECORTADA EN CÍRCULO con borde blanco y sombra (nunca rectángulo con capa oscura) · Hoy: tarjeta lima con franja de 7 días (hoy en negro) + medidor semicircular de kcal · resultado de foto: bloque lima con plato grande en círculo + 3 mosaicos de macros + tarjeta durazno del Chequeo · logo: plano en SVG (components/landing/Isotipo.tsx) en espacios chicos; logo original brillante de la dueña como favicon/icono (public/logo/original.webp, app/icon.png).
> Fotos de ejemplo: Unsplash (docs/proyecto/FOTOS-LICENCIAS.md). Los textos siempre oscuros sobre fondos claros (AA).

## (Histórico v2 — vigente solo en lo que v3 no contradiga)

> v2 (2026-11-11): el usuario pidió ELEVAR el estilo con nuevas referencias de Pinterest (video ILABS Nutrition tracking, Nutrilens, Caltalk). Ruta: 3 estilos A/B/C aplicados completos (direcciones-abc.html) → COMBINACIÓN: colores y letra de A «Lima fresca», HOY con foto a pantalla completa (composición de B), LOGROS = camino sinuoso aprobado antes, resto como A. Reemplaza la identidad v1 (salvia + Chivo/Hanken); la v1 queda recuperable con `git tag punto-antes-de-elevar`.

## Referencia del usuario
- Imágenes de referencia: SÍ, 2 capturas de Pinterest/apps de calorías (parciales: no pidió replicarlas). Rasgos tomados (a ojo, no extracción hex): tarjeta verde pálida de calorías con anillo y llama · macros en anillos de color · foto de comida a pantalla completa con hoja inferior · escáner con modos (Foto/Código/Etiqueta) · botón de cámara central.
- Dijo textualmente: le gusta el visual de la A, quiere ver el avance hacia su objetivo y fotos de comida. Ruta: combinación A+B.

## Identidad derivada
- TABLA DE LÍDERES (de conocimiento, sin capturas): Cal AI → número héroe, anillos, tarjetas claras · Fitia/BitePal → verde claro, macros en tarjetas, foto en cada comida · Strava → energía deportiva, datos protagonistas · Duolingo → racha/XP/logros con color pleno.
- Combinación tipográfica: Chivo (display 700/800) + Hanken Grotesk (body 400-700) — banco 10 "Salvia técnica"; vecinas del par sans sólida de la fila fitness/nutrición del 29. Validada contra líderes: PARCIAL (sin capturas; confirmar al construir).
- Arquetipo: instrumento de medición amable con energía de gym · Mundo del sujeto: gym + cocina + control de datos.
- Banco 54 dirección usada: #10 Salvia técnica (paleta tal cual) + naranja de la #4 Retro-deportiva como 2ª nota (solo gamificación).

## Personalidad compilada
- Adjetivos: ENÉRGICO (dominante) + CÁLIDO + SOBRIO (sobrio en cifras, dinero y salud).
- spring bounce 0.25 / stiffness ~400 · duración base 220ms · exclamaciones máx 1/pantalla
- celebración N1: check con punch · N2: overlay rápido de logro/XP · N3: confetti corto + háptica (solo hitos grandes, nunca por registro normal)
- radio tendencial 14-16px · color emocional: acento verde protagónico en CTA/progreso; naranja SOLO para racha, XP y grasas atrapadas
- voz: COACH ENÉRGICO modulado a sobrio en cobro, error y salud. Nunca culpa ni vergüenza corporal.

## Brand kit final v2 (va a globals.css/@theme y components/landing/tokens.css)
- Fondo #F6F8F1 · Superficie #FDFEFB · Hundido #E8EEDF · Texto 1º #242B24 (tinta de barra #1E2820) · Texto 2º #5E6A60 (#4F5B51 en texto pequeño)
- Bloque de cabecera LIMA #E4F2C9 (--tint; profundo #D2E8AE) — es la firma de la app: cabecera redondeada abajo (radio 26) en Logros, Progreso, Perfil, Racha
- Acento verde #3D6B4F (selección, progreso, checks, macro proteína) · NARANJA #E8590C degradé #F5A524→#E8590C (botón Registrar, anillo/barra de calorías, racha, XP, grasas atrapadas) · 3ª de dato #C9A227 (solo carbos) · pastel de comida: desayuno #E4F2C9, almuerzo #FFE6CC, merienda #FFF1B8, cena #DCE8F5
- Semánticos: éxito #3D6B4F · error #C0392B · aviso #D98A00
- UNA sola familia: Figtree (400-800). Display = Figtree 700/800 con tracking -0.02 a -0.05em; body 400-600 · Escala móvil: display 44 (número héroe) / title 20 / body 14-15 / label 11-12 · cifras tabulares siempre
- Radios: tarjeta 16-22 · hoja superior 26 · botón píldora 99 · foto de comida en círculo
- Profundidad: sombras tintadas 2 capas + hairline en la tarjeta clave · Espaciado 4·8·12·16·24·32·48·64
- Dispositivos ownables: (1) cabecera lima con hoja redondeada · (2) barra inferior OSCURA flotante (#1E2820, radio 28) con botón central naranja que sobresale · (3) foto de comida protagonista (Hoy: foto a pantalla completa con las kcal restantes encima y hoja que sube) · Íconos SVG en chips, nunca emojis
- Hoy SIN foto (primer día real): la cabecera lima reemplaza a la foto, con el número grande (nunca una foto inventada)
- Logros: CAMINO sinuoso (SVG) con nodos naranja (logrado + check), actual con aro, bloqueado punteado
- Motion: ease-out cubic-bezier(0.16,1,0.3,1), 220ms; UN spring reservado a logros/XP; anillos y barras se dibujan; los números cuentan y se detienen en seco

## Trazabilidad y vetos
- Ruta de diseño: propuesta propia (PASO 0 del 54) → A/B/C → combinación A+B pedida por el usuario
- Protocolo A/B/C: opción elegida COMBINACIÓN A+B · descartada: B "Pista de gym" oscura (se tomó solo su gamificación) y C "Cítrica rápida" · comparativa: docs/revisiones/direcciones-abc.html · combinación: docs/revisiones/direcciones-abc-combinacion.html · screenshots: docs/revisiones/*.jpg
- Tour de la app: docs/revisiones/vista-previa-app.html · vistas: onboarding, primer resultado, plan/paywall, hoy, logros · aprobado por el usuario: SÍ 2026-11-03 (con 1 ajuste: pantalla de logros rediseñada para mostrar avance)
- Paleta derivada de: banco 54 #10 Salvia técnica (tal cual) + naranja #4 · Dispositivo: rejilla + ticks
- Registro anti-repetición: paleta lima/verde/naranja #E4F2C9/#3D6B4F/#E8590C + Figtree VETADOS para el próximo proyecto del SO (v1 vetada: salvia + Chivo/Hanken)
- Protocolo A/B/C v2 (2026-11-11): opciones A «Lima fresca» (Figtree), B «Foto protagonista» (DM Sans), C «Bloques de color» (Sora, oscuro) · elegida: COMBINACIÓN A+foto-de-B+camino · comparativa: direcciones-abc.html (raíz, con la combinación como primera fila) · screenshots: docs/revisiones/abc-ab.png, abc-a.png, abc-b.png, abc-c.png, direcciones-abc.png · tour: la propia fila de la combinación (Hoy, Chequeo, Logros, Progreso, ventas) aprobada por el usuario 2026-11-11 con «Sí, aplícala a todo»
- Modo CLARO derivado por: avatar urbano que registra de día/comida (luz natural), líderes del nicho claros (Cal AI, Fitia) y la preferencia del usuario por el visual de la A
- Pendientes de calidad: fotos del mockup son de Wikimedia (la app usará propias/licenciadas); líderes sin capturas reales

- Nota v2: Chivo/Hanken ya no se usan; el bloque oscuro de la landing y su acento claro siguen vigentes.
- EXCEPCIÓN DOCUMENTADA (2026-11-07): en la landing, el bloque de CTA final es una sección INVERTIDA (fondo #242B24) con acento claro #9AD0AE (token --accent-on-dark) para cumplir contraste AA; el acento #3D6B4F sobre ese fondo daba ~2.4:1. Solo aplica a esa sección.

## Idioma UI: español neutro (tuteo) · Cierre: 2026-11-03 · Aprobada por el usuario: SÍ
