# LIFE OS

Aplicativo pessoal de organização e produtividade.

A aplicação está em `life-os/` e é publicada como site estático pelo GitHub Actions.

**Acessar:** https://mateusmiguel-dev.github.io/LifeOS-Code/

## Publicação

O workflow em `.github/workflows/deploy.yml` compila o Next.js com exportação estática e publica o diretório `life-os/out` no GitHub Pages.

Em **Settings → Pages → Build and deployment**, mantenha **Source: GitHub Actions**.

## Configuração do Supabase

As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` devem ser adicionadas em **Settings → Secrets and variables → Actions → Variables** antes de habilitar autenticação e dados persistentes.

Nunca adicione a chave `service_role` ao site ou ao repositório.
