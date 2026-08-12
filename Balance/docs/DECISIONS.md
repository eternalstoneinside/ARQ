# Decisions

| Decision | Rationale |
|---|---|
| Transactions are the source of truth | Prevents mutable balance drift and keeps analytics reproducible. |
| Money uses positive integer minor units | Avoids floating-point errors; type provides direction. |
| One currency per couple space; PLN at launch | Matches launch scope and avoids exchange-rate complexity. |
| Context providers own session-scoped product state | Auth, active space, transactions, and privacy remain small enough for explicit providers. |
| Framework-independent domain types | Keeps a clean boundary for later Supabase adapters and possible native packaging. |
| React Router data router | Establishes scalable route composition without adding a framework. |
| CSS variables mapped to Tailwind tokens | Makes light/dark themes coherent and brand changes centralized. |
| Add is a bottom sheet, not a route/tab | Matches the fast primary action and approved navigation. |
| Recurrence execution is server-side and idempotent | Prevents duplicates and frontend-only false state. |
| Soft deletion and author-or-owner mutation | Preserves audit history while allowing the space owner to correct shared records; RLS enforces the same rule. |
| No fake settings | A visible control must either work or be presented as non-interactive information. |
| Supabase is the production source of truth | Auth, spaces, invitations, memberships, active-space preference, and transactions persist behind RLS. |
| Invite codes are hashed and time-limited | Stored values cannot be used directly; joining is serialized under a row lock. |
| Automated tests never mutate production | Product rules and migration contracts run locally; multi-account behavior uses a controlled checklist. |
| `main` is the production truth | The deployed product must map to reviewed code merged into `main`. |
| Balance inherits the root ARQ Source of Truth | Product-specific visual decisions may extend but cannot override the master brand, design language, or product philosophy. |
| Open composition makes balance primary | The product’s central number establishes hierarchy through typography and space, not a dashboard card. |
| Literal architectural symbols are prohibited | ARQ’s architectural inspiration is expressed through structure, proportion, rhythm, and relationships—not arches or decorative geometry. |
| The canonical mineral accent is used sparingly | Accent is reserved for focus, primary action, and product identity while semantic money colors remain muted. |
| Display typography carries product hierarchy | Large tabular numbers and deliberate tracking make financial information feel precise and premium. |
| Lists use hairlines instead of containers | Transaction and settings content reads as a calm consumer product rather than stacked admin cards. |
| Currency is subordinate to the primary number | The shared amount remains immediately scannable while currency stays explicit and locale-correct. |
