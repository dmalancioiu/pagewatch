# File structure overview

```text
vibe-agent-saas/
├─ app/
│  ├─ (dashboard)/
│  │  └─ dashboard/
│  │     ├─ configuration/page.tsx
│  │     ├─ outputs/page.tsx
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ api/health/route.ts
│  ├─ login/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ dashboard/
│  │  ├─ config-form.tsx
│  │  ├─ output-feed.tsx
│  │  ├─ sidebar.tsx
│  │  └─ status-card.tsx
│  └─ ui/
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ input.tsx
│     └─ textarea.tsx
├─ lib/
│  ├─ actions/
│  │  ├─ agent-config-actions.ts
│  │  └─ trigger-agent-run.ts
│  ├─ data/
│  │  ├─ agent-configs.ts
│  │  └─ agent-outputs.ts
│  ├─ supabase/
│  │  ├─ admin.ts
│  │  ├─ browser.ts
│  │  └─ server.ts
│  ├─ auth.ts
│  ├─ env.ts
│  ├─ types.ts
│  └─ utils.ts
├─ supabase/
│  └─ migrations/
│     └─ 20260404_001_agent_scaffold.sql
├─ trigger/
│  ├─ agents/
│  │  ├─ compose.ts
│  │  └─ research.ts
│  ├─ lib/
│  │  ├─ supabase.ts
│  │  └─ types.ts
│  ├─ prompts/
│  │  └─ default-agent-prompt.ts
│  ├─ providers/
│  │  ├─ anthropic.ts
│  │  ├─ exa.ts
│  │  └─ firecrawl.ts
│  └─ tasks/
│     ├─ agent-lifecycle.ts
│     └─ sync-user-schedule.ts
├─ docs/
│  └─ file-structure.md
├─ .env.example
├─ README.md
├─ next.config.mjs
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ trigger.config.ts
└─ tsconfig.json
```
