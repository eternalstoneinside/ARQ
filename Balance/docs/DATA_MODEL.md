# Data Model

## Transaction

Database fields: `id`, `space_id`, `type`, `amount_minor`, `currency`, `category_id`, `person_id`, `person_name`, `transaction_date`, nullable `comment`, `created_by`, `created_at`, `updated_at`, nullable `deleted_at`, nullable `deleted_by`.

`amount_minor` is a positive integer. Never store money as floating point: `21050` means `210,50 PLN`. `type` determines whether the amount increases or decreases derived balance. Queries exclude rows with `deleted_at` and derive balance, income, expense, and analytics from transactions.

## Permissions

Supabase RLS allows space members to read active shared transactions. The author or space owner may update or soft-delete an active transaction. Delete operations set `deleted_at` and `deleted_by`; they do not remove rows.

## Space categories

Categories belong to a space and are shared by its members. Each category has a stable `id`, transaction `type`, editable name and icon, order, creator, and nullable `archived_at`. Existing and future spaces receive the same starting set, but the labels are not globally hard-coded.

Archiving is used instead of deletion. Historical transactions retain their category reference and label; an archived category cannot be selected for a new transaction. A composite foreign key binds each transaction to a category from the same space and with the same type. The database prevents archiving the last active income or expense category.

Any member may create a category. Its creator or the space owner may rename, change the icon, archive, or restore it. RLS and immutable identity fields enforce these rules, and private Realtime broadcasts synchronize changes between members.

## Supporting entities

`space` owns one currency (`PLN` at launch), members, categories, transactions, invitations, and future recurrences. A person/member reference on a transaction is attribution for history/filtering/analytics, not fund ownership.

## Recurrence safety

A recurrence stores `id`, `couple_space_id`, template transaction reference or immutable payload, frequency (`weekly`, `monthly`, `yearly`), timezone-aware next run, active status, audit fields, and last-run metadata. Server-side execution must be idempotent with a uniqueness key per recurrence and scheduled occurrence. Each successful occurrence creates a normal transaction linked through `recurrence_id` and atomically advances the schedule. The client never fabricates future transactions.

## Boundaries

TypeScript domain types use camelCase while database adapters explicitly map snake_case. Supabase Auth, tables, RLS, migrations, and Realtime are production infrastructure; only recurrence scheduling remains deferred.
