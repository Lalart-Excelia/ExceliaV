# Excelia (MVP Estrutural)

Este repositório é a **estrutura base** do produto Excelia, conforme o PRD que definimos:
- Landing/Preço/Exemplos
- App autenticado (shell)
- Ferramentas: Dashboards, Excel Master, Fórmulas, Templates, Scripts, Automations
- Sistema de créditos (monthly + rollover + promo + purchase)
- Pagamentos: Stripe (cartão + Pix para avulsos), compra avulsa de export (PDF/PPTX)
- API de IA (Anthropic) com roteamento Haiku/Sonnet
- Esquema Supabase (SQL) incluído

## Rodar local
1) Instale deps:
```bash
npm i
```

2) Copie `.env.example` para `.env.local` e preencha.

3) Rode:
```bash
npm run dev
```

## Supabase
- Crie um projeto no Supabase
- Execute `supabase/schema.sql` no SQL Editor
- Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`

## Stripe
- Crie produtos/price IDs conforme sua estratégia (assinatura + compras avulsas)
- Configure webhooks para `/api/stripe/webhook`

## Observação
Este MVP está pronto para ser evoluído: o “gerador” de dashboard e alguns fluxos ainda estão em modo **mock** (ex.: render 16:9 sem export real). As rotas e contratos estão definidos e a lógica de créditos está implementada para produção.


## Decisões (config atual)
- Pix: apenas para pagamentos avulsos (promo/packs/exports)
- Consumo de créditos: mês → promo → compra → acumulado
- Dashboard gerado via promo: sem watermark (mesmo usuário Free)
