# Decisions

| Decision | Rationale |
|---|---|
| Transactions are the source of truth | Prevents mutable balance drift and keeps analytics reproducible. |
| Money uses positive integer minor units | Avoids floating-point errors; type provides direction. |
| One currency per couple space; PLN at launch | Matches launch scope and avoids exchange-rate complexity. |
| No global state library yet | A small provider is sufficient for Phase 1 mock state; server state will use TanStack Query. |
| Framework-independent domain types | Keeps a clean boundary for later Supabase adapters and possible native packaging. |
| React Router data router | Establishes scalable route composition without adding a framework. |
| CSS variables mapped to Tailwind tokens | Makes light/dark themes coherent and brand changes centralized. |
| Add is a bottom sheet, not a route/tab | Matches the fast primary action and approved navigation. |
| Recurrence execution is server-side and idempotent | Prevents duplicates and frontend-only false state. |
| Soft deletion and author-only mutation | Preserves audit history and implements MVP partner permissions. |
| Mock interactions provide explicit feedback | No apparently functional control silently fails. |
| Supabase/auth deferred | Required by Phase 1 boundary pending foundation review. |
| Balance inherits the root ARQ Source of Truth | Product-specific visual decisions may extend but cannot override the master brand, design language, or product philosophy. |
| Open composition makes balance primary | The product’s central number establishes hierarchy through typography and space, not a dashboard card. |
| Literal architectural symbols are prohibited | ARQ’s architectural inspiration is expressed through structure, proportion, rhythm, and relationships—not arches or decorative geometry. |
| The canonical mineral accent is used sparingly | Accent is reserved for focus, primary action, and product identity while semantic money colors remain muted. |
| Display typography carries product hierarchy | Large tabular numbers and deliberate tracking make financial information feel precise and premium. |
| Lists use hairlines instead of containers | Transaction and settings content reads as a calm consumer product rather than stacked admin cards. |
| Currency is subordinate to the primary number | The shared amount remains immediately scannable while currency stays explicit and locale-correct. |
