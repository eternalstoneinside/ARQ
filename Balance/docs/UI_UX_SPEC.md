# UI/UX Specification

## Experience principles

Mobile-first, Ukrainian-only, calm and direct. The interface should feel architectural: structured, spacious, warm, premium, and trustworthy. Desktop centers the mobile experience in a quiet shell.

Balance inherits the root ARQ Source of Truth. Architectural means hierarchy, proportion, rhythm, and durable structure—not literal arches, buildings, or decorative geometry.

## Home

Order: `ARQ / Balance` product lockup and couple-space context; `Спільний баланс`; income and expense summaries; recent transactions with `Переглянути`; floating Add button; three-item bottom navigation. The balance is uncontained, uses display numerals, and visually subordinates the currency in PLN formatting such as `8 530,00 zł`.

## Add transaction

A modal bottom sheet contains: type (`Витрата` / `Дохід`), amount, category, person, date, optional comment, repeat toggle, conditional weekly/monthly/yearly frequency, Save. It closes by explicit close, backdrop click, or Escape. Validation is inline. Saving mock data updates visible totals and history; the UI explains that recurrence execution is not active.

## Analytics and settings

Analytics presents a period selector, three summaries, restrained category bars, and category breakdowns. Settings exposes only working profile/session and shared-space management actions; static product facts must not look interactive.

## Accessibility and states

Use semantic landmarks, labels, minimum 44px controls, keyboard-visible focus, modal semantics, Escape dismissal, icons plus signs/text for money direction, and sufficient contrast. Loading and empty-state foundations must be reusable. Avoid controls that silently do nothing.

## Future history

History is a secondary route reached from Home, never a permanent tab. Search covers category, comment, person, and amount; filters match the product specification.
