# Configuração do Supabase — LIFE OS

O frontend é exportado como site estático no GitHub Pages. O navegador usa somente a chave pública (anon/publishable); nunca coloque a `service_role` no frontend.

## 1. Criar o banco

No painel do projeto Supabase, abra **SQL Editor** e execute, nesta ordem:

1. `migrations/0001_initial_schema.sql`
2. `migrations/0002_daily_life_modules.sql`
3. `migrations/0003_oracle_draws.sql`
4. `migrations/0004_push_subscriptions.sql`

As políticas RLS limitam cada registro ao usuário autenticado.

## 2. Configurar o GitHub Pages

No repositório **Settings → Secrets and variables → Actions → Variables**, crie:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública anon/publishable.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: chave pública VAPID (opcional, para inscrição push).

Depois, execute o workflow **Deploy LIFE OS to GitHub Pages** em Actions.

## 3. Push com o site fechado

O service worker e a inscrição do navegador estão preparados. Para enviar notificações quando o site estiver fechado, ainda é necessário implantar um emissor Web Push no Supabase (Edge Function), configurar `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` e `VAPID_SUBJECT` como secrets do Supabase e agendar a verificação de lembretes. A chave privada jamais deve ir para GitHub Pages ou para variáveis `NEXT_PUBLIC_*`.

Sem esse emissor, o LIFE OS envia notificações locais enquanto a aplicação está aberta; a inscrição push sozinha não envia mensagens.

## 4. Oráculo

Com Supabase configurado e usuário autenticado, as tiragens são gravadas em `oracle_draws`, com restrição única por usuário e data. Sem banco configurado, o navegador usa armazenamento local.
