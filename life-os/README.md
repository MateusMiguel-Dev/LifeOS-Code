# LIFE OS

Starter do LIFE OS: Next.js + TypeScript + Tailwind CSS + Supabase.

## Requisitos
- Node.js 20.9+
- Projeto Supabase

## Rodar localmente
```bash
npm install
cp .env.example .env.local
npm run dev
```
Abra http://localhost:3000.

## Conectar o Supabase
1. Crie um projeto em https://supabase.com/dashboard.
2. Em Project Settings → API, copie Project URL e anon/public key.
3. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local`.
4. No SQL Editor do Supabase, execute `supabase/migrations/0001_initial_schema.sql`.
5. Reinicie o servidor.

> Não coloque a `service_role` key em variáveis `NEXT_PUBLIC_*` nem no frontend.

## O que está pronto
- Dashboard responsivo em dark mode.
- Sidebar e navegação inicial.
- Widgets de indicadores, tarefas, foco e hábitos (dados demonstrativos nos widgets ainda não conectados).
- Tela de tarefas com criação, conclusão e exclusão.
- Persistência de tarefas no Supabase quando as credenciais e a migration estiverem configuradas.
- Schema inicial para tarefas, hábitos, registros de hábitos e metas, com RLS.

## Próximas entregas
1. Supabase Auth (login, cadastro, recuperação de senha e proteção de rotas).
2. CRUD de hábitos e metas + dashboard com métricas reais.
3. Agenda, projetos, notas e financeiro.
4. Busca global, notificações e revisão diária.
