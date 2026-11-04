# UNIT ECONOMICS — NutriSnap AI (gate de viabilidad unitaria, 2026-11-03)
> TODO lo marcado EST es ESTIMACIÓN (no medido). Se reemplaza con datos reales en el panel tras vender.

## Supuestos
- Hotmart EST: 10% + US$0.30 por cobro (verificar en el panel). Impuestos/retenciones LATAM EST: 10%.
- IA EST: modelo barato tipo Haiku (~US$1/US$5 por millón de tokens in/out, ref. doc 30, jun-2026; verificar). Foto comprimida ≈ US$0.004; voz ≈ US$0.001.
  Uso mediana 3.5 registros/día → IA ≈ US$0.50/mes · p95 con tope 8 fotos/día → ≈ US$1.10/mes.
- Infra EST US$0.25 (no se guardan las fotos originales: se procesan y se descartan; solo miniatura). Email US$0.05.
- Churn mensual EST 15% (rango realista 10-20%). Reembolsos EST 4%.
- Afiliados (PDF): 30%. Regla del SO: recurrente en mensual; en anual SOLO sobre el primer pago.

## Resultado por usuario / mes (margen sobre ingreso NETO)
| Plan | Mediana | p95 (tope 8 fotos/día) |
|---|---|---|
| Mensual US$7.99 directo | 87% | 77% |
| Mensual US$7.99 afiliado 30% recurrente | 78% | 62% |
| Anual US$49.99 directo | 76% | 58% |
| Anual US$49.99 afiliado 30% (1er año) | 61% | 32% |
| (descartado) Anual US$39.99 directo | 70% | 47% |
| (descartado) Anual US$39.99 afiliado 30% (1er año) | 51% | 15% |

- Gate: margen ≥70% mediana en directo ✔ (mensual y anual a 49.99). Con afiliado en anual el 1er año baja a 61% → se trata como CAC de una sola vez (la renovación no paga comisión).
- IA ≤20% del precio de catálogo: ✔ en mensual (6-14%) y en anual 49.99 (12-26%: el p95 la supera → por eso el TOPE de 8 fotos/día).
- LTV mensual directo ≈ 6.09 × 0.87 / 0.15 ≈ US$35 (−4% reembolsos ≈ US$34) → CAC máximo tolerable ≈ US$11. Con afiliado recurrente 30%: LTV ≈ US$19 → CAC máx ≈ US$6.
- Break-even EST: costos fijos ~US$75/mes (dominio, Vercel, Supabase, Resend) ÷ ~US$3.5 margen mezcla ≈ 22-30 clientes de pago.
- Suelo 3 (canal pago, TikTok/Meta ads): un plan de US$8/mes casi nunca paga una compra en anuncios → crecer con orgánico + afiliados primero (se revisa antes de la 1ª campaña).

## Cupos (fórmula 02C: precio×0.20÷costo/resultado)
- Mensual 7.99: 7.99×0.20÷0.005 ≈ 320 registros/mes → tope práctico **8 registros por foto/día (≈240/mes)**.
