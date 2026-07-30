# ARQ Balance

Mobile-first PWA foundation for a Ukrainian-language shared finance product for couples. The application answers one question: “Скільки грошей у нас зараз разом?”

All product and interface work must follow the canonical ARQ documents beginning with [`../brand/00_SOURCE_OF_TRUTH.md`](../brand/00_SOURCE_OF_TRUTH.md).

## Current scope

Frontend product prototype: application shell, launch and welcome flow, design tokens, domain types, mock data, Home, Add Transaction sheet, Analytics, transaction history and details, shared-space members, Settings, empty states, and product documentation. Authentication and Supabase persistence are intentionally not connected yet.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` only when a reviewed Supabase project is ready. Money is always represented as integer minor units; `21050` means `210,50 PLN`.

## Structure

- `src/components` — reusable UI, layout, and transaction components
- `src/context` — temporary in-memory mock state
- `src/data` — realistic Ukrainian mock records
- `src/domain` — framework-independent product types
- `src/i18n` — Ukrainian localization foundation
- `src/lib` — centralized formatting and parsing
- `src/pages` — route-level screens
- `docs` — durable product and engineering decisions
