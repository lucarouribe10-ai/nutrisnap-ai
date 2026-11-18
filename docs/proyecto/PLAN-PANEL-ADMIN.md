# PLAN DEL PANEL DE ADMINISTRACIÓN — NutriSnap AI (para aprobación de la dueña, 2026-11-18)

> Origen: docs/proyecto/PROMPT-PANEL-ADMIN.txt. Guías leídas: 21-BACKOFFICE, 36 (contrato de eventos), 31 (ai_calls), 40 (margen), 09/26 (acceso admin + RLS), 17 (gráficos), 60/18 (funnel y Hotmart).
> Regla: panel REAL (cero demo). Si un dato no existe todavía → «Sin datos» + qué falta para tenerlo. NO se construye nada hasta el OK de la dueña.

## 1. Qué datos existen HOY y cuáles faltan (honesto)
| Dato | Hoy | Para tenerlo |
|---|---|---|
| Usuarios (cuentas, altas, plan/estado) | SÍ: auth.users, profiles, app_state, entitlements | solo leerlos de forma segura |
| Eventos de uso y funnel | NO: `lib/eventos.ts` guarda solo en el navegador | endpoint de servidor + tabla `event_log` (nace al construir) |
| Retención D1/D7/D30, activación | NO (necesita event_log) | empieza a acumular desde el día 1 de la captura |
| Costo de IA real | NO: `ia_usos` existe pero /api/analizar no escribe; sin clave real | registrar tokens/costo por llamada (`ai_calls`) y activar la clave de producción |
| Ventas, compras, cancelaciones, MRR, churn | NO | webhook de Hotmart firmado → tablas de órdenes/eventos |
| Ganancia real | NO | ventas + costos (IA, infra, email, comisiones) |
| LTV / CAC / canal | NO | `profiles.source` + gasto por canal que ingresa la dueña |
| Errores | NO | `error_log` desde los Error Boundaries y los catch del servidor |

## 2. Secciones (rutas /admin/*)
1. **Resumen** — banner de AVISOS (qué pasó → por qué importa → qué hacer; si todo bien: «✅ Todo en orden este mes») + 6 cifras héroe (ingresos del mes, ganancia que queda, usuarios activos, activación, costo de IA del día, errores abiertos), cada una con tendencia e insight en lenguaje simple.
2. **Ventas** — ingresos, compras, cancelaciones, MRR, churn separado en voluntario vs involuntario, trial→pago, reembolsos. (Fuente: webhook Hotmart.)
3. **Ganancia real** — «Facturaste $X y te quedaron $Y limpios (Z% de margen)». Ingresos − Hotmart − afiliados − impuestos − IA − infra − email. Rotulado «Estimación» hasta conciliar con la liquidación de Hotmart. Importes en unidad menor + moneda (nunca sumar COP con USD).
4. **Usuarios** — lista con búsqueda por correo, estado (prueba/activo/vencido/cancelado/reembolsado/cortesía), alta, último uso. **Alta manual** (correo + nombre) y acciones de soporte: dar/quitar/extender acceso, reenviar acceso. Total, activos hoy/semana/mes.
5. **Uso** — acción principal (fotos registradas), funnel del recorrido (landing → inicio → resultado → planes → registro), activación, retención D1/D7/D30, CURR semanal, pagadores fantasma.
6. **Negocio** — LTV, CAC, LTV:CAC (≥3:1), payback, ganancia por canal (`profiles.source`); formulario para ingresar el gasto por canal.
7. **IA** — costo real por función y por persona usuaria, gasto del día, tope diario, % de los ingresos.
8. **Salud y errores** — errores agrupados por frecuencia, estado del webhook de Hotmart (últimos eventos, fallos), diferencias entre lo cobrado y lo que dice la base (drift).
9. **Ajustes** — costos fijos mensuales (infra, email), % de comisión/impuestos, administradores, registro de acciones (quién hizo qué y cuándo).

## 3. Seguridad (lo más importante)
- Entrada solo para administradores: lista `admins` en la base + verificación EN EL SERVIDOR en cada página y cada acción (no basta con esconder la ruta: eso sería IDOR). Cualquier otra persona recibe 404.
- Los datos del panel se leen con funciones de base de datos que comprueban «¿eres admin?» (RLS): una persona usuaria normal no puede leerlos ni con la clave pública.
- Las acciones que crean o cambian usuarios usan la clave secreta de Supabase SOLO en el servidor (variable `SUPABASE_SECRET_KEY` en Vercel, la pega la dueña directo en el panel de Vercel; jamás en el chat) y repiten la verificación de admin.
- Registro de auditoría de toda acción manual (dar acceso, quitar acceso, cambios de costos).
- Límite de intentos y entrada con el mismo código por correo; propuesta: doble verificación opcional para /admin.
- `noindex`, sin caché compartida, sin datos personales en URLs.

## 4. Tablas nuevas (todas con RLS: lectura solo admin; el cliente solo inserta lo suyo cuando aplica)
`admins`, `event_log`, `error_log`, `ai_calls`, `hotmart_events` (bruto del webhook, idempotente), `ordenes` (ledger: bruto, comisión, afiliado, impuestos, neto, moneda), `acquisition_spend`, `costos_fijos`, `admin_audit`. Y `profiles.source`/`profiles.role`-equivalente vía `admins`. Ya existen: profiles, app_state, comidas, pesos, ia_usos, entitlements.

## 5. Cambios en la app para alimentar el panel (necesarios, sin features nuevas)
- `track()` envía eventos al servidor (sesión anónima, sin datos personales; sesiones QA excluidas).
- /api/analizar registra costo en `ai_calls` y respeta el tope por usuario (8 fotos/día) y un tope global diario.
- Error Boundaries + catch del servidor escriben en `error_log` (endpoint con límite de intentos).
- Webhook de Hotmart (etapa de cobro) llena `hotmart_events` y `ordenes`.

## 6. Fases (cada una se cierra con tsc + build + prueba real + captura + veredicto del revisor-visual)
- **Fase 0 — Cimientos:** tablas + RLS, admins, guard del servidor, `event_log`/`error_log`/`ai_calls` capturando datos reales, clave secreta en Vercel.
- **Fase 1 — Resumen + Usuarios (con alta manual y acciones de soporte).** Ya útil para operar.
- **Fase 2 — Uso + IA + Salud y errores.**
- **Fase 3 — Ventas + Ganancia + Negocio.** Se construyen completas; muestran «Sin datos» hasta conectar Hotmart; se llenan solas al conectarlo.
- **Fase 4 — Ajustes y avisos automáticos completos.**

## 7. Lo que necesito de la dueña
1. OK a este plan (o ajustes).
2. Confirmar el correo de administradora: `lucarouribe10@gmail.com`.
3. Crear la clave secreta de Supabase y pegarla en Vercel (yo guío; nunca por el chat).
4. Decidir el acceso por defecto de una alta manual: propuesta «acceso completo por 30 días, ajustable» (o prueba de 3 días / permanente).
5. Nota: el aviso de acceso por correo solo llega a su propio correo hasta verificar el dominio con Resend; hasta entonces el alta manual crea la cuenta y la persona entra pidiendo su código desde /entrar cuando el correo ya salga a cualquiera.

## 8. Fuera de alcance (a ESTADO.md si se piden)
Cobros desde el panel, reembolsos desde el panel, emails masivos, multi-admin con roles finos, exportación contable.
