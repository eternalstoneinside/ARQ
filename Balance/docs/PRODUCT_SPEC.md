# ARQ Balance — Product Specification

## Purpose

ARQ Balance is a mobile-first shared finance application for couples. Its primary question is: “Скільки грошей у нас зараз разом?” It is not a budgeting, banking, accounting, debt, investment, or financial-education product. Transaction history is the source of truth; shared balance and summaries are derived from active income and expense transactions.

## Launch constraints

- Ukrainian-only product language; PLN-only couple spaces.
- Couples are the launch audience; web/PWA first with future native packaging kept possible.
- Authentication is required in the real product; backend: Supabase.
- Approved client stack: React, TypeScript, Vite, Tailwind CSS, React Router, Supabase, TanStack Query, React Hook Form, Zod, and Lucide.

## Navigation and screens

Bottom navigation contains `Головна`, `Аналітика`, and `Налаштування`. A floating action button opens the Add Transaction bottom sheet; Add is not a tab. Full history opens from `Переглянути всі` on Home.

Home prioritizes couple-space name, shared balance, income/expense summary, recent transactions, Add button, then navigation. `Спільний баланс` is the dominant element.

Analytics stays simple: income, expenses, balance change for a selected period, expenses by category, five largest expenses, and an optional person filter. Total shared balance primarily belongs on Home.

## Transactions

Types are `income` and `expense`. The user enters an unsigned amount; type defines its effect. Every transaction records a person for history, filtering, and analytics only—not debt or ownership. Authors and space owners may edit or soft-delete active transactions; other members may view them.

Default expense categories: Продукти, Житло, Транспорт, Заклади, Покупки, Розваги, Здоров’я, Тварини, Інше. Default income categories: Зарплата, Підробіток, Подарунок, Інвестиції, Інше.

Categories are space-level vocabulary, not a universal taxonomy. Members may add a precise category such as `Айва`, `Сигарети`, `Жабка`, or `Інтернет`; authorized managers may rename or archive categories without rewriting historical operations. Everyone in the space sees the same category set.

Recurrence frequencies: weekly, monthly, yearly. A server-side scheduler must safely create a new transaction; recurrence must never be simulated only in frontend state.

History search: category, comment, person, amount. Filters: all, income, expense, today, 7 days, 30 days, current month, all time, custom period, category, person.

## Authentication and onboarding

Google is the beta authentication method; there is no anonymous mode. After authentication, a user creates a space or joins an existing one using a time-limited invitation code. New spaces default to PLN. A member may belong to multiple spaces and choose one active space. Apple sign-in may be added later.

## Notifications

MVP concepts: partner added a transaction, recurring transaction created, partner joined. No guilt-based reminders.

## Explicit exclusions

No budgets, limits, bank accounts, wallets, bank sync, multiple currencies per space, exchange rates, partner debts, bill splitting, receipts/OCR, AI advice, goals, investments, gamification, financial scores, or complex charts.
