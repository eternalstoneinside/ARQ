# Data Model

## Transaction

Database fields: `id`, `couple_space_id`, `type`, `amount_minor`, `currency`, `category_id`, `person_id`, `transaction_date`, nullable `comment`, nullable `recurrence_id`, `created_by`, `created_at`, `updated_at`, nullable `deleted_at`, nullable `deleted_by`.

`amount_minor` is a positive integer. Never store money as floating point: `21050` means `210,50 PLN`. `type` determines whether the amount increases or decreases derived balance. Queries exclude rows with `deleted_at` and derive balance, income, expense, and analytics from transactions.

## Permissions

Supabase RLS allows space members to read active shared transactions. The author or space owner may update or soft-delete an active transaction. Delete operations set `deleted_at` and `deleted_by`; they do not remove rows.

## Supporting entities

`couple_space` owns one currency (`PLN` at launch), members, categories, transactions, invitations, and recurrences. A person/member reference on a transaction is attribution for history/filtering/analytics, not fund ownership.

## Recurrence safety

A recurrence stores `id`, `couple_space_id`, template transaction reference or immutable payload, frequency (`weekly`, `monthly`, `yearly`), timezone-aware next run, active status, audit fields, and last-run metadata. Server-side execution must be idempotent with a uniqueness key per recurrence and scheduled occurrence. Each successful occurrence creates a normal transaction linked through `recurrence_id` and atomically advances the schedule. The client never fabricates future transactions.

## Boundaries

TypeScript domain types use camelCase while database adapters will explicitly map snake_case. Supabase tables, RLS, migrations, authentication, and scheduler are intentionally deferred until foundation review.
