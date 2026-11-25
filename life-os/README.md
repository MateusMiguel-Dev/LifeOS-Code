# LIFE OS

LIFE OS é um painel pessoal de organização construído com Next.js, TypeScript, Tailwind CSS e Supabase.

## Hospedagem: GitHub Pages

O projeto está configurado para exportação estática (output: export). O GitHub Actions compila o site e publica a pasta out automaticamente.

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Faça um push na branch main; o workflow publica o site em https://mateusmiguel-dev.github.io/LifeOS-Code/.

O build usa o diretório life-os, pois o código-fonte está nessa pasta do repositório.

## Configurar o Supabase

1. Crie um projeto em https://supabase.com/dashboard.
2. Em **Project Settings → API**, copie a Project URL e a chave **anon/public**.
3. No repositório GitHub, abra **Settings → Secrets and variables → Actions → Variables**.
4. Crie as variáveis:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Em **Authentication → URL Configuration** no Supabase, configure a URL do site e adicione https://mateusmiguel-dev.github.io/LifeOS-Code/** às Redirect URLs.
6. No SQL Editor do Supabase, execute supabase/migrations/0001_initial_schema.sql.

A chave anon/public é destinada ao cliente e deve ser protegida por políticas RLS. **Nunca publique a chave service_role**.

## Desenvolvimento

Requer Node.js 20.9+ para executar localmente. A publicação normal é feita pelo GitHub Actions; não é necessário rodar o servidor no computador.

## Observações da exportação estática

GitHub Pages serve arquivos estáticos. Por isso, autenticação e acesso ao Supabase acontecem no navegador; não há middleware, API routes ou server actions no site hospedado.
