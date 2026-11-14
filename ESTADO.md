# ESTADO — NutriSnap AI
Última actualización: 2026-11-03 | Sesión actual: 3 (página de ventas) en curso

⏸️ CHECKPOINT (2026-11-14): IA real de fotos FUNCIONA y se probó con 4 fotos reales del usuario (4/4 OK, ~1,5 s, 1 foto con variación ±15%). Estilo v2 aplicado; 2 rondas de revisión (todas NO LISTA, documentadas en Problemas conocidos). Siguiente acción exacta: el usuario compara los números con lo que esperaba; luego decidir: Etapa 6 (Supabase/Hotmart/Resend/dominio) o 3ª ronda de pulido. Pendiente de seguridad: borrar claves de prueba y crear una de producción con límite de gasto. Punto de retorno al estilo v1: git tag punto-antes-de-elevar.

## Qué es esta app
Registro de calorías y macros por FOTO con IA + corrección por VOZ + escáner de código de barras incluido. Para gente que entrena en el gym (22-38) y quiere déficit/proteína sin pesar ni teclear. Suscripción freemium: US$6.99/mes · US$39.99/año · trial 3 días con tarjeta.

## Promesa central
"Ayudo a personas que entrenan en el gimnasio a dominar su déficit calórico con precisión exacta, sin sufrir la imprecisión de las fotos solas que ignoran aceites ocultos ni pagar suscripciones abusivas de $20/mes." (Versión B — Foto + Voz)

## Reporte de validación (IDEA YA VALIDADA por el usuario — NO re-validar, NO proponer alternativas)
- Fuente completa: docs/proyecto/IDEA-VALIDADA-NutriSnap.txt (texto del PDF "Primer idea de App_NutriSnap")
- Nombre: NutriSnap AI (alt: SnapMacros AI, NutriVoice AI)
- Competencia: Cal AI ($19.99, sin escáner ni voz) · MyFitnessPal (UI vieja, escáner tras paywall $19.99) · Fitia (exceso de funciones)
- Hueco: foto + voz + escáner a $6.99. Consciencia: Product-Aware. Mercado maduro/saturado en interfaces, no en velocidad.
- Evidencia citada en el PDF: compra de Cal AI por MyFitnessPal (2026), quejas del escáner bloqueado, Sensor Tower +21%.
- Canal #1: TikTok/Reels orgánico (demos de tiempo de registro) + afiliados 30% recurrente a entrenadores.

## Verificación independiente (2026-11-03) — VEREDICTO: VIABLE CON AJUSTES
- Confirmado: MyFitnessPal compró Cal AI (anunciado 2-mar-2026). Ventas: CEO de MFP dice >US$40M/12 meses; terceros estiman ~US$30M.
- CONTRADICE EL PDF: Cal AI sí parece tener escáner de código de barras (ficha App Store); su precio real no está claro (fuentes dicen desde ~US$9/mes, no US$19.99). MFP ya ofrece escáner IA de comidas + voz + código de barras. Fitia (español, LATAM) ya tiene foto (Premium) + voz + texto.
- Implicación: el diferenciador NO puede ser "somos los únicos con voz/escáner". Debe ser velocidad + corrección por voz en español local + precio + simplicidad. Replantear en Sesión 1 (posicionamiento) y verificar precios reales en las stores.
- Pendiente: precio real de Fitia, Cal AI y MFP desde las stores; reseñas 1-2★ con cita; cobertura LATAM del escáner.

## IDEA AJUSTADA v2 (propuesta 2026-11-03 — pendiente OK del usuario)
- Cuña: "la foto NO te miente en las grasas ocultas". Dato: estudio NIH citado por varias fuentes → apps de foto subestiman 250-345 kcal/comida, la grasa es el mayor error (fuentes de proveedores; verificar original).
- Mecanismo: Foto → la app detecta el tipo de plato y PREGUNTA lo que la cámara no ve (aceite, aderezo, mantequilla, queso) → respuesta en 1 toque o por voz → recuerda tus hábitos (menos toques con el tiempo).
- Escáner: se mantiene como función base; si el código no existe en la base abierta (cobertura LATAM baja/inconsistente), plan B = foto de la etiqueta nutricional leída por IA.
- Retención: racha + reporte semanal "grasas ocultas que atrapaste" (lo que la foto sola habría fallado).
- Posicionamiento: velocidad + honestidad de precisión + precio bajo. YA NO: "Cal AI sin escáner", "$20/mes", "única con voz/escáner", "precisión exacta".
- Precio: propuesto US$5.99-6.99/mes · US$39.99/año (se fija con unit economics). Fitia (competidor LATAM): trial 3 días solo en plan anual.
- Pendiente de evidencia: platos latinos mal reconocidos (solo lo afirma Fitia en su marketing), precios reales por tienda, reseñas con cita.
- Riesgo mayor: mercado con gigantes (MFP+Cal AI) y Fitia en español → el foso es distribución (TikTok + afiliados), no la tecnología.

## Precios reales verificados (2026-11-03) — CORRIGE EL PDF
- Cal AI (App Store EE.UU.): US$14.99/mes · US$39.99/año (NO US$19.99). MyFitnessPal: US$19.99/mes · US$79.99/año.
- Nuestro anual de US$39.99 del PDF = igual a Cal AI y NO pasa el gate de margen. Detalle en docs/proyecto/UNIT-ECONOMICS.md.

## Estrategia de monetización (APROBADA por el usuario 2026-11-03)
- Modelo: onboarding-first + trial (matriz 02C fila C fitness/tracking). Sin plan gratis permanente: el onboarding regala el PRIMER análisis y luego aparece el paywall. Motivo: el freemium convierte menos y cada foto gratis cuesta IA.
- Precio: US$7.99/mes · US$49.99/año (se muestra como US$4.17/mes). Prueba 3 días (antes 7). Tope 8 registros por foto/día (protege el margen).
- Afiliados: 30% recurrente en mensual; en anual 30% solo del primer pago.
- Mejoras aprobadas 2026-11-03: (1) COBRO SIN SORPRESAS: aviso 2 días antes del fin de la prueba, cancelar en 2 toques, reembolso fácil, monto y fecha visibles. (2) ESCÁNER DE CÓDIGOS GRATIS PARA SIEMPRE (plan gratis mínimo: solo escáner + tablero básico, sin IA → costo ≈ 0); foto con chequeo de grasas, voz, historial/tendencias = pago. Reemplaza el 'sin plan gratis permanente' anterior.
- Flujo: vista previa sin cuenta → paywall → login → app.

## Avatar (resumen; la FICHA-AVATAR.md se completa en Sesión 1)
- Mateo Torres, 28, ingeniero de software híbrido, gym 4-5x/sem, quiere abdomen marcado sin perder músculo.
- Dolor #1: "Tardo más registrando el plato que comiéndomelo." Deseo #1: foto + 2 seg de voz y seguir con su vida.
- Objeciones: ¿la IA inventa calorías? · ¿cobran $20 y bloquean lo básico? · ¿la voz entiende mi español local? · ¿lo uso 3 días y lo borro?
- 3 razones dominantes (Jim Edwards): ahorrar tiempo/evitar esfuerzo · escapar del dolor mental (culpa) · estatus/elogios.
- NO decirle: "aprende a medir macros", "comunidad de recetas", "planes de alimentación personalizados".

## MVP (del PDF)
- 4 funciones núcleo: foto→desglose · corrección por voz · escáner código de barras · tablero diario (kcal, P, C, G).
- NO construir: recetarios, planes de entreno, hidratación, relojes, comunidad.
- Plan gratis: 3 fotos/día con desglose básico. Pago: ilimitado foto+voz+escáner+gráficos de tendencia.
- Primera victoria <5 min: onboarding de 3 preguntas (objetivo, estatura, actividad) → foto → desglose en <3 s.

## Discrepancias / huecos del PDF a resolver en Sesión 1 (el SO decide)
- Modelo "freemium + trial 3 días con tarjeta" es mixto: decidir con matriz A-F del 02C.
- Falta costo por cliente (IA visión + voz) → calcular en 40-UNIT-ECONOMICS; validar que $6.99 y 3 fotos/día gratis pasen el gate.
- Falta la 5ª objeción, las 3 tomas de video y la ventaja personal del usuario → derivar/pedir con opciones.
- Escáner de código de barras requiere base de datos externa (p. ej. Open Food Facts): cobertura LATAM a verificar (GATE 4: integración de terceros).
- Voz: definir motor de voz→texto y dialectos LATAM.
- Promesa "precisión exacta" es riesgosa: suavizar en copy (regla de no inventar datos).

## DIRECCIÓN DE ARTE (APROBADA 2026-11-03 — detalle en FICHA-ARTE.md)
- Estilo A+B "Salvia clínica con energía de gym": claro · fondo #EFF2ED · acento #3D6B4F · 2ª nota #E8590C (racha/XP/grasas atrapadas) · Chivo + Hanken Grotesk · radio 14-16 · rejilla + ticks · fotos de comida.
- Personalidad: enérgico + cálido + sobrio. Registro anti-repetición: paleta salvia y par Chivo/Hanken vetados para el próximo proyecto.
- Tokens a volcar en globals.css al crear el proyecto (Sesión 3).

## CONSTITUCIÓN DEL PRODUCTO (APROBADA por el usuario 2026-11-03 — cosa juzgada)
- Promesa: "Ayudo a personas que entrenan a registrar sus comidas en segundos y a que las grasas ocultas no arruinen su déficit, sin cobros sorpresa."
- Primera victoria (<2 min): 3 preguntas (objetivo, estatura, actividad) → foto → macros → chequeo de grasas ocultas y se ve cómo cambia el número.
- MVP: (1) foto + chequeo de grasas ocultas · (2) ajuste por voz o 1 toque · (3) escáner de códigos gratis para siempre · (4) tablero diario (kcal, P, C, G) + gamificación: puntos (XP), niveles, logros, racha, reporte semanal.
- Gamificación (propuesta del usuario): XP por acción útil (registro +10, chequeo +5, meta de proteína +20, día en rango +20); niveles nunca se pierden; logros por hitos del plan (25/50/100%) medidos por constancia y días en rango, NO solo kilos; logros "Cazador de grasas" y "Semana sin ceguera"; racha con reparación 48 h; lógica en servidor. Sin ranking social.
- NO construir aún: recetas, planes de comida/entreno, hidratación, relojes, comunidad.
- NUNCA: inventar números sin marcar estimado · cobrar sin aviso previo con fecha y monto · culpa/vergüenza corporal · vender/compartir datos o fotos · premiar bajar de peso a lo bruto (aviso si la meta es agresiva).

- Garantía (usuario, 2026-11-03/04): reembolso de 7 días, sin preguntas (un correo). PRUEBA GRATIS: 3 días (cambio decidido por el usuario 2026-11-04: antes 7; para que garantía 7 > prueba 3). Aviso 1 día antes del cobro. Configurar Hotmart con 7 días ANTES de prometerlo.

- País de lanzamiento (decidido por el usuario 2026-11-03): COLOMBIA. Español neutro con tuteo, ejemplos de comida colombianos (arepa, bandeja paisa light, huevos pericos, pollo con arroz, aguacate, jugo de lulo), precios mostrados en USD + referencia COP pendiente de verificar con Hotmart.

## Decisiones técnicas (Sesión 1 — internas, 2026-11-03)
- Framework: Next.js 16 App Router (landing con SEO + rutas API/BFF para IA y webhook). Tailwind v4. PWA instalable (cámara, micrófono, escáner por navegador).
- Backend: Supabase (Postgres + Auth + RLS). Auth: vista previa anónima → paywall → login (magic link + Google). Hosting: Vercel. Cobro: Hotmart (webhook verificado). Email: Resend.
- IA: BFF en servidor, nunca claves en el navegador. Foto comprimida en el dispositivo → modelo de visión barato → JSON de platos/macros + lista de "preguntas de grasas ocultas". Voz: audio corto → transcripción servidor → ajuste. SÍNCRONO (objetivo <5 s); sin cola. Fotos originales no se guardan (solo miniatura). Kill-switch con tabla ai_calls y tope 8 fotos/día.
- Datos (tablas): profiles, entitlements, meals, meal_items, user_habits (defaults de aceite/cocido-crudo), daily_targets, streaks, ai_calls, barcode_cache. RLS por user_id en todas.
- Escáner: base abierta (Open Food Facts) + plan B lectura de etiqueta por IA; cobertura LATAM a medir.
- Idioma UI: español neutro mono-idioma.

## Avatar y venta: FICHA-AVATAR.md APROBADA 2026-11-03 (19 frases reales en docs/proyecto/VOC-resenas.md).
## Hallazgo mayor (VoC): Fitia domina el español (72k calificaciones MX, 4.88★) pero sus peores reseñas son COBROS SORPRESA tras trial y paywall tras onboarding largo. MFP: escáner de pago y app lenta. Oportunidad: transparencia de cobro + onboarding corto + chequeo de grasas.

## Secuencia maestra de construcción
- Estado: sin iniciar (pendiente). Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`

## Sesión 3 — estado de la página de ventas (en curso)
- Proyecto: Next.js 16 + Tailwind v4 en la raíz. Kit copiado a components/landing/ (EJEMPLO-page.tsx eliminado); tokens.css tematizado con FICHA-ARTE; fuentes Chivo + Hanken Grotesk vía next/font; copy en docs/copy/landing.md; página en app/page.tsx; hero con mini-demo honesta (ChequeoDemo.tsx).
- Mecanismo bautizado: "el Chequeo de Grasas Ocultas". Garantía con nombre: "la Garantía de Cero Sorpresas" (7 días, Hotmart). País: Colombia.
- Páginas legales creadas como BORRADOR (privacidad, términos, reembolsos, aviso-ia) — pendiente revisión legal (47) y email de soporte real; stubs de /onboarding y /entrar (Sesión 4).
- Carrusel 'La app por dentro': placeholders rotulados — pendiente montar screenshots reales cuando exista la app.
- Evidencia: docs/revisiones/landing-375.png (Playwright, scripts/screenshot.mjs); audit-conversion: los críticos restantes son falsos positivos del propio código del kit (comentarios/strings), el copy visible pasa.

- Cambios 2026-11-04 tras el 1er veredicto (NO LISTA 28/12/14): prueba 3 d; contraste del bloque oscuro (--accent-on-dark + CtaButton sobreOscuro); total anual a 15px; garantía nombrada en hero y cards; CTA único con ?plan=; mini-demo tocable (rejilla+ticks+foto); carrusel con VISTA PREVIA DEL DISEÑO (frames de las maquetas, rotulado); claims acotados; FAQ de 6; correo de soporte retirado hasta tener dominio.
- Desviaciones del kit (documentadas): CtaButton.sobreOscuro, FooterLegal.soporteEmail opcional + separadores, Oferta total anual 15px, Hero sin doble marco. Falsos positivos de audit-conversion en el código del kit (strings/comentarios).
- Nuevo 2026-11-04: scripts/screenshot.mjs (captura 375px completa) y scripts/captura-frames.mjs (frames del carrusel desde las maquetas).

- 2026-11-07 elevación de la landing (pedida por el usuario, prompt /landing): AgitacionCifras (3 cifras con ícono), antes→después en 2 columnas, CtaFila tras mecanismo y tras garantía, tarjetas del problema sin look de botón, Isotipo propio, aviso 'Acceso anticipado' en la oferta. CTA = /onboarding (Modelo 2, ya decidido). Carrusel manual (el 19 prohíbe auto-avance). Scripts: scripts/screenshot-secciones.mjs. Evidencia por sección en docs/revisiones/landing-secciones/. Revisión independiente nº3 pendiente.

## Sesión 4 — recorrido de inicio, plan y acceso (en curso, 2026-11-11)
- Rutas: /onboarding → /paywall → /entrar → /app (stub de Sesión 5). Quiz (auto-avance): nombre · objetivo · lo más difícil (VoC real) · datos · días de entreno → primera foto → resultado con el Chequeo de Grasas Ocultas → 'Construyendo tu plan' (5 líneas personalizadas) → Diagnóstico personalizado (kcal, proteína, fecha estimada de meta, tu freno + cómo lo resolvemos) → paywall.
- Recompensas (el usuario las aprobó y pidió conservarlas): +15 XP/racha día 1/logro 'Primer hallazgo' al completar el Chequeo (spring + barra de XP) y +10 XP por perfil completo (25 XP se muestran en el paywall como lo que se guarda con la cuenta). El ejercicio del Chequeo ahora también muestra 'esta comida ya es el X% de tus kcal de hoy'.
- Análisis de la propuesta de Gemini (2026-11-11): ADOPTADO nombre, pregunta del dolor, diagnóstico con reflejo de respuestas, fecha estimada de meta, titular y 'US$0 hoy'. RECHAZADO: precios US$39.99/US$6.99 (no pasan el gate de margen), rating 4.8★ y cita inventados, 'tiempo de registro: 3 segundos' como dato (no medido), pregunta 'cuánto tiempo quieres dedicar' (decorativa, no cambia nada), pedir permisos solo tras el paywall (la cámara es la primera victoria: se pide al tocar 'Tomar foto'; el micrófono solo al tocar el micro).
- lib/plan.ts (Mifflin-St Jeor con piso de kcal, tope 1% del peso/semana, aviso de meta bajo peso saludable, solo mayores de 18), lib/eventos.ts (?qa=1), lib/onboarding-store.ts. BFF /api/analizar: clave solo en servidor; SIN clave devuelve DEMO marcado; foto sin comida y errores tienen estado propio. La IA real NO se ha ejecutado nunca → no declarar el momento-wow listo hasta probar con clave (pendiente del usuario, sin pasarla por chat).
- Paywall: CTA fijo abajo con precio y fecha de cobro, timeline con fechas reales, garantía nombrada, textos ≥14px, enlaces legales. Pago real (Hotmart) y aviso por correo = vista previa honesta (Sesión 6); 'Continuar con Google' se agrega con la auth real.
- Verificado: tsc ✓ build ✓ · flujo completo por Playwright a 375px (scripts/flujo-onboarding.mjs) sin errores de consola · capturas en docs/revisiones/flujo/. Veredictos del revisor (1ª pasada: onboarding 29/12/14, paywall 27/14/13, NO LISTA) → 2ª revisión pendiente tras los cambios.

- Análisis de la propuesta de Gemini sobre paywall (2026-11-11): YA TENÍAMOS ubicación tras el quiz, timeline de prueba, anual como $/mes, titular con nombre+meta, CTA de prueba gratis. ADOPTADO: prueba personal (tu primera foto 440→560) en vez de reseña. RECHAZADO: precios US$39.99/6.99 (no pasan margen), reseña 5★ inventada, cancelar 'en 1 toque desde la App Store/Play Store' (somos web + Hotmart), RevenueCat/Superwall/Adapty (SDK de apps de tienda: el equivalente web son feature flags/experimentos, archivo 37, Sesión 8), estadísticas sin fuente (5x, +30% LATAM). RIESGO ANOTADO: la promesa 'cancela cuando quieras' debe verificarse con el flujo REAL de cancelación de Hotmart (18) antes de lanzar; se retiró '2 toques' de los textos hasta confirmarlo.

## Sesión 5 — app interna (en curso, 2026-11-11)
- Secciones (4 + registrar): Hoy (protagonista: camino a la meta + calorías del día + comidas con foto) · Progreso (tendencia de peso vs meta, calorías de la semana, proteína 5/7) · Logros (siguiente logro, casi lo logras, medallas, semana de grasas atrapadas) · Perfil (plan, enlaces legales, borrar mis datos) · Registrar (hoja de pantalla completa: foto + Chequeo de Grasas Ocultas, foto de ejemplo, registro rápido; código de barras y etiqueta marcados 'Pronto').
- Datos: lib/app-store.ts (localStorage, SIN servidor) con semilla realista del mundo de Mateo (comidas con foto, 8 semanas de peso, racha 12, 340 XP); marcado 'Vista previa con datos de ejemplo'. Registrar una comida actualiza kcal, macros, XP y 'grasas atrapadas'; guarda SOLO una miniatura (160px) de la foto. Borrar datos del dispositivo funciona.
- Verificado: tsc ✓ build ✓ · flujo Playwright (scripts/flujo-app.mjs) a 375px: navegación, registro de una comida y actualización de Hoy · sin desborde horizontal a 375 y 360px · sin errores de consola · capturas en docs/revisiones/app/. Veredicto del revisor visual de la pantalla principal (Hoy): pendiente.
- NO construido aún (Sesión 6): servidor/base de datos, auth real, IA real (clave rechazada), Hotmart, escáner de código y de etiqueta.

## Auditoría 2026-11-11 — ejecución aprobada (opción 1: primero claridad de rachas/premios y primer día honesto; luego Etapa 6)
- HECHO: reglas de racha reales (1 comida/día; escudo de racha que protege 1 día faltante; 2+ días la pausa sin castigo), tarjeta de racha en Hoy con los 7 días y próximo premio, 12 logros data-driven con XP (lib/logros.ts), hoja '¿Cómo funciona?' (racha, escudo, XP, niveles), celebración al registrar (racha, logro, subida de nivel con escudo de premio), primer día REAL honesto (empieza en racha 1, sin datos de Mateo; datos de ejemplo solo en modo demo), Progreso con fechas reales + registrar peso + estado vacío, promesa de '48 h' reemplazada por el escudo. Evidencia: scripts/flujo-racha.mjs y capturas en docs/revisiones/racha/.
- ANTES DE LANZAR (promesas que dependen de servicios, ver auditoría): aviso 1 día antes de cobrar (Resend), cancelar cuando quiera y reembolso 7 días (Hotmart), escáner de códigos gratis (no existe aún). Sin conectarlas y probarlas, se retiran de los textos.
- SIGUIENTE (Etapa 6, requiere cuentas del usuario): Supabase (datos+auth+RLS), Hotmart (cobro+webhook), Resend, dominio, IA real.

- 2026-11-11 referente de rachas/premios = Duolingo (solo PATRONES, nada de marca/mascota/colores; paleta y fuentes de FICHA-ARTE intactas). Adoptado: pantalla 'Racha ampliada' tras la primera comida del día (llama grande animada, número que sube, semana) + resumen de 3 tarjetas + premios, botones 'gruesos' en momentos de premio, calendario de racha mensual con escudos, misiones del día con cofre (+30 XP), insignias por niveles (Bronce/Plata/Oro/Diamante), llama que se apaga si hoy no cuenta, vibración corta en premios. NO adoptado a propósito: ligas/ranking, gemas/tienda, vidas (castigan; la constitución dice sin culpa, sin comunidad). Evidencia: scripts/flujo-racha.mjs, docs/revisiones/racha/.

- 2026-11-11 Logros ahora es un CAMINO (patrón del camino de Duolingo): 12 logros por dificultad en zigzag, el actual con anillo pulsante y progreso, los siguientes bloqueados (components/app/CaminoLogros.tsx). El usuario compartió 2 referencias (Nutrilens, Caltalk) y pregunta por subir el nivel 'premium' del diseño: pendiente su decisión (elevar dentro del estilo aprobado vs cambiar de dirección). FICHA-ARTE sigue siendo cosa juzgada hasta que el usuario la cambie explícitamente. Los enlaces de Pinterest (pin.it) no se pudieron abrir; se usaron las capturas adjuntas.

## Sesiones completadas ✅
- Instalación del SO (v6.10.0) y punto de guardado git — 2026-11-03
- Sesión 2 — identidad visual (A/B/C → combinación A+B, tour aprobado, FICHA-ARTE) — 2026-11-03
- Sesión 1 — verificación de mercado, idea ajustada v2, unit economics, monetización, FICHA-AVATAR aprobada, arquitectura — 2026-11-03

## Sesión en progreso 🔧
- Ninguna (Sesión 1 cerrada).

## Próximas sesiones 📋
- Sesión 2: identidad visual y tour de la app. Sesión 3: página de ventas. Sesiones 4-8 según el plan maestro.

## Problemas conocidos ⚠️
- veredicto pantalla principal (Hoy): estilo v2, 2ª revisión (2026-11-12) NO LISTA: usab 30/40 · craft 15/20 (gates 36/16; fiel a la referencia). Evolución 26/15 → 30/15. Pendiente: check claro en el día de hoy (2:1), compactar racha, tokens para colores sueltos, mostrar macros en vez de 'Foto', explicar escudo/XP, transición entre pestañas y salida animada de hoja/toast, captura fullPage real. Decisión del usuario pendiente (otra ronda o avanzar).
- IA real de fotos FUNCIONA (2026-11-14): /api/analizar con foto real (pollo.jpg) devolvió demo:false, 650 kcal, P58/C80/G13 y la pregunta del aceite, HTTP 200. Causa del 401 previo: el botón Copy de la consola copia un ejemplo curl completo (se guardaron 318 caracteres) y las claves nuevas empiezan con sk-ant-usr- (no sk-ant-api). Comando de guardado robusto: extraer con grep del portapapeles. SEGURIDAD: varias claves quedaron visibles en el terminal y en el registro de la sesión → borrar todas las de prueba en console.anthropic.com y crear una clave NUEVA y separada para producción (con límite de gasto) en Etapa 6. Pendiente: evals de calidad (30/31), límite de uso por usuario en servidor, probar con varias fotos reales de platos latinos, comprobar version de API (2023-06-01 funciona). [Prueba 2026-11-14 con 4 fotos reales del usuario: tras apagar thinking (thinking disabled), subir max_tokens a 1024 y acortar 'plato' >80 caracteres en vez de rechazar, 4/4 responden en ~1,5 s. Variación entre corridas: 1 foto osciló 620–820 kcal (≈±15%), las otras 3 estables; 'temperature' no se puede usar en este modelo. Pendiente: comparar con lo que el usuario espera, caché por foto (misma foto → mismo resultado), límite de uso por usuario, evals (31).]
- veredicto paywall y onboarding: estilo v2, 2ª revisión (2026-11-12) NO LISTA: onboarding usab 28/40 · craft 15/20 · copy 14/20 (fiel); paywall usab 30/40 · craft 15/20 · copy 14/20 (fiel). Evolución onboarding 28/12/14 → 28/15/14; paywall 29/14/15 → 30/15/14. Pendiente onboarding: CTA 'Quiero mi prueba gratis' + línea fija de aviso/cancelación/garantía, acortar esperas fingidas (hoy ~10 s) con 'Saltar', caja de foto tocable, recompensa en una línea, pushState para el gesto atrás, tokens. Pendiente paywall: pie fijo más corto (tapa el plan Mensual), reformular 'Llegarías a 76 kg… 26 de enero' como supuesto, ahorro anual (48%) visible, miniatura de la foto, guard de doble toque. Confirmar plazos en Hotmart (FICHA-MERCADO §4). Decisión del usuario pendiente.
- veredicto paywall: 2ª revisión v2 NO LISTA (usab 30/40 · craft 15/20 · copy 14/20; gates 36/16/16), pospuesto con decisión del usuario pendiente; pendientes en la línea anterior (pie fijo, supuesto de fecha, ahorro anual, miniatura de foto, guard de doble toque).
- veredicto landing: estilo v2, 2ª revisión (2026-11-12) NO LISTA: usab 31/40 · craft 15/20 · copy 17/20 (copy ya pasa; fiel). Evolución 28/13/16 → 31/15/17. Pendiente: alinear texto del demo (text-left) y chips sin partir, alternar secciones con fondo lima/hundido y llevar el naranja a las cifras de costo, número héroe en 'costo', aclarar 'US$4.17 al mes con plan anual', nombrar la garantía en la oferta, viudas tipográficas, tokens. Correo de soporte requiere dominio; prueba social real pendiente. Decisión del usuario pendiente.
- (resuelto 2026-11-04) plazos de garantía: el usuario eligió prueba 3 días + garantía 7 días; FICHA-MERCADO §4 completada (M>N).
- FICHA-MODELO: existe como BORRADOR (modelo propuesto: Cal AI). Falta verificar ≥2 señales de revenue con fuente/fecha y extraer su plano (onboarding, paywall, ads) — se hace en Sesión 1 antes de la Sesión 3. Estado: pospuesto a investigación de Sesión 1.

## Pendientes del usuario
- [ ] Aprobar la página de ventas (Sesión 3)
- [ ] Más adelante: dominio y correo de soporte real (hoy el pie no muestra correo); cuenta de Hotmart (configurar reembolso de 7 días antes de lanzar)

## Notas para la próxima sesión
- Usuario no técnico, español neutro con tuteo. Una pregunta por mensaje, opciones en formato visual.
