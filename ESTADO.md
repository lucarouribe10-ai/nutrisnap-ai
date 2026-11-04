# ESTADO — NutriSnap AI
Última actualización: 2026-11-03 | Sesión actual: 1 (Validación, avatar, monetización, arquitectura)

⏸️ CHECKPOINT — Última acción completada: idea validada recibida (PDF de 3 pestañas) y guardada como contexto base. / Siguiente acción exacta: arrancar Sesión 1 → leer 57-AVATAR + 02C + 40-UNIT-ECONOMICS, completar FICHA-AVATAR y FICHA-MODELO, proponer precio/planes.

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

## Dirección de Arte / Avatar / Monetización / Decisiones técnicas
- Pendientes (Sesiones 1-2). Ninguna decidida aún.

## Secuencia maestra de construcción
- Estado: nada construido. Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`

## Sesiones completadas ✅
- Instalación del SO (v6.10.0) y punto de guardado git — 2026-11-03

## Sesión en progreso 🔧
- Sesión 1 — iniciando.

## Pendientes del usuario
- [ ] (ninguno por ahora)

## Notas para la próxima sesión
- Usuario no técnico, español neutro con tuteo. Una pregunta por mensaje, opciones en formato visual.
