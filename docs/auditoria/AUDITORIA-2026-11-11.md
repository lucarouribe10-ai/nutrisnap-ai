# AUDITORÍA — NutriSnap AI (2026-11-11) · modo: diagnóstico, SIN cambios
Evidencia: se recorrió la app a 375px con Playwright y se MIRARON las capturas renderizadas: landing (12 secciones), recorrido de inicio (nombre→diagnóstico), paywall, login, Hoy, Progreso, Logros, Perfil y Registrar (docs/revisiones/). Código leído: app/, components/, lib/, scripts/. `npm audit` (producción): 0 vulnerabilidades. No hay pruebas automatizadas ni Lighthouse medido.

## Estado por dimensión
| Dim | Resultado | Resumen |
|---|---|---|
| 1 Producto, retención, monetización | ⚠️ | Primera victoria y paywall sólidos; retención poco clara; sin plan de adquisición; promesas de cobro aún sin respaldo técnico. |
| 2 Diseño y verificación visual | ⚠️ | Identidad derivada del cliente y coherente. Revisor: landing 30/14/16 · onboarding 29/15 · planes 29/14/15 · Hoy 26/13 (gate 36/16/16): ninguna certificada. |
| 3 UX y diseño emocional | ⚠️ | Estados vacío/carga/error/offline parciales; celebración solo en onboarding/registro; falta en hitos de la app. |
| 4 Backend, datos, infra | ❌ | No hay backend: todo vive en el navegador (localStorage). |
| 5 Auth y ciberseguridad | ❌ | Sin cuentas ni sesión; /app abierto; API sin autorización; sin cabeceras de seguridad. |
| 6 IA | ❌ | La IA real nunca se ejecutó (clave rechazada); ruta lista pero sin evals, guardrails ni control de costo. |

## Hallazgos priorizados
| Sev | Hallazgo | Dónde | Mejora propuesta |
|---|---|---|---|
| Crítico | Los datos del usuario solo existen en su navegador; se pierden al limpiar o cambiar de teléfono | lib/app-store.ts | Base de datos con cuentas (Supabase), RLS, migraciones, backups |
| Crítico | Sin auth real: login es vista previa; /app es público | Login.tsx, app/app | Magic link + Google, proteger /app en servidor, sesión httpOnly, anti-enumeración |
| Crítico | Cobro no conectado: sin Hotmart, sin webhook con firma e idempotencia, sin planes en servidor; el tope de 8 fotos/día no se aplica | Paywall.tsx | Producto y checkout Hotmart, webhook firmado, tabla de suscripciones, tope en servidor |
| Crítico | IA real sin probar y sin red de seguridad: parseo de texto (no structured output), sin moderación ni anti-inyección, sin registro de costo/tokens, sin golden set | app/api/analizar/route.ts | Resolver la clave, tool-use estructurado, ai_calls, evals, tope de gasto |
| Crítico | /api/analizar sin sesión ni plan; límite por IP en memoria y falsificable (x-forwarded-for); sin validar tipo real de imagen; sin comprobación de origen | route.ts | Autorizar sesión+plan, límite persistente por usuario, validar bytes de imagen, comprobar Origin |
| Crítico | Promesas que hoy no se pueden cumplir: aviso 1 día antes (no hay correo), cancelar cuando quieras (flujo Hotmart sin verificar), reembolso 7 días (Hotmart sin configurar), escáner gratis (no existe), reparar racha 48 h (no existe) | landing, paywall, FAQ | Conectar y probar cada una antes de lanzar, o retirar la promesa |
| Crítico | La app muestra a un usuario real los datos de ejemplo de Mateo (racha 12, 340 XP, comidas inventadas) | app-store.ts semilla | Primer día real: vacío honesto, racha 1, XP 0; la semilla solo en modo demo |
| Crítico | Datos de salud y envío de fotos a un proveedor de IA sin consentimiento explícito antes de enviar; textos legales son borradores sin revisión, sin correo de contacto | onboarding, /privacidad | Consentimiento claro, revisión legal (Ley 1581), correo y dominio reales |
| Importante | Rachas y premios poco claros (tu observación): la racha es una pastilla chica en Hoy; los XP no dicen para qué sirven; el "premio +100 XP" es abstracto; no se ve la semana de racha; nivel sin recompensa tangible; Logros mezcla racha, grasas y proteína | Hoy.tsx, Logros.tsx | Tarjeta de racha en Hoy con los 7 días, regla explícita ("1 comida al día"), pantalla "cómo funcionan los puntos", premios tangibles, celebración al lograr un hito |
| Importante | Ninguna de las 4 pantallas que deciden el dinero pasa el gate del revisor | docs/revisiones/*-veredicto.md | Re-puntuar con app y IA reales; prueba social real |
| Importante | Sin pruebas automatizadas ni CI; solo scripts de recorrido | package.json | Pruebas de lib/plan.ts, e2e del funnel, axe de accesibilidad, CI |
| Importante | Sin analítica real: los eventos solo viven en la sesión del navegador | lib/eventos.ts | Eventos al servidor, funnel, exclusión de sesiones QA |
| Importante | Sin plan de adquisición ni retención de ingresos (afiliados, TikTok, correos de cobro, recuperación de pagos) | — | Sesión 8: plan de tráfico, dunning, lanzamiento |
| Importante | Rendimiento sin medir; imágenes sin optimizar (frames de 130 KB x5, fotos de 100-170 KB) | landing, public/ | Lighthouse móvil, next/image, presupuesto de rendimiento |
| Importante | Fotos de ejemplo vienen de Wikimedia con licencias que exigen atribución | public/fotos | Fotos propias o con licencia, o mostrar créditos |
| Importante | Sin cabeceras de seguridad (CSP, HSTS, X-Frame, Referrer) | next.config.ts | Cabeceras y CSP con nonce |
| Pulido | Gráfica de calorías de la semana: barras casi iguales, no informan | Progreso.tsx | Mostrar diferencia contra la meta (±%) |
| Pulido | Más de 3 tamaños de texto por pantalla en Hoy; rejilla técnica no se ve en la app | Hoy.tsx | Simplificar escala; llevar el dispositivo de marca a Hoy |
| Pulido | Logo es un isotipo simple; sin favicon ni imagen para compartir; metadata mínima | layout.tsx | Logo final, favicon, OG, sitemap, robots |
| Pulido | Archivos duplicados "… 2.ts" aparecen en .next y rompen tsc | .next | Limpiar y excluir del chequeo |

## Puntaje actual: 4 / 10
Experiencia visible (landing, recorrido, app): ~6.5/10. Lo que sostiene un negocio (datos, cuentas, cobro, IA real, seguridad, medición): ~1/10.

## Las 3 mejoras de mayor impacto para llegar a 10/10
1. Backend real con cuentas, datos protegidos y cobro verificado (Supabase + auth + Hotmart con webhook).
2. IA de fotos real, con salida estructurada, topes de costo, evals y consentimiento claro.
3. Retención clara y honesta + primer día real, y certificar las pantallas con el revisor.
