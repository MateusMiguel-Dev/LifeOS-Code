# Configuração do Supabase — LIFE OS

O frontend é exportado como site estático no GitHub Pages. O navegador usa somente a chave pública (anon/publishable); nunca coloque a `service_role` no frontend.

## 1. Criar o banco

No painel do projeto Supabase, abra **SQL Editor** e execute, nesta ordem:

1. `migrations/0001_initial_schema.sql`
2. `migrations/0002_daily_life_modules.sql`
3. `migrations/0003_oracle_draws.sql`
4. `migrations/0004_push_subscriptions.sql`
5. `migrations/0005_reminder_push_delivery.sql`

As políticas RLS limitam cada registro ao usuário autenticado.

## 2. Configurar o GitHub Pages

No repositório **Settings → Secrets and variables → Actions → Variables**, crie:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública anon/publishable.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: chave pública VAPID.

Depois, execute **Deploy LIFE OS to GitHub Pages** em Actions.

## 3. Ativar notificações push com o site fechado

O service worker e a inscrição do navegador estão no projeto. Para enviar lembretes com o site fechado, implante a Edge Function:

```bash
supabase functions deploy send-reminders
supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:seu-email@exemplo.com
```

A função também usa automaticamente `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente Supabase. A chave privada e a service role ficam somente no servidor.

Agende a chamada da função a cada minuto com Supabase Cron/pg_net, enviando o cabeçalho `Authorization: Bearer <service-role-key>` para `/functions/v1/send-reminders`. Guarde a chave em Supabase Vault; nunca coloque a chave em SQL público, GitHub Pages ou variáveis `NEXT_PUBLIC_*`.

Sem implantar e agendar a função, as notificações do navegador funcionam enquanto o LIFE OS estiver aberto, mas não há envio automático quando o site está fechado.

## 4. Oráculo

Com Supabase configurado e usuário autenticado, as tiragens são gravadas em `oracle_draws`, com restrição única por usuário e data. Sem banco configurado, o navegador usa armazenamento local.
