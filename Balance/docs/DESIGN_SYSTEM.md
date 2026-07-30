# ARQ Balance — Design System Extension

ARQ Balance inherits the canonical ARQ system. This document records only product-specific applications and may not override the master documents:

1. [`../../brand/01_BRAND_SYSTEM.md`](../../brand/01_BRAND_SYSTEM.md)
2. [`../../brand/02_DESIGN_LANGUAGE.md`](../../brand/02_DESIGN_LANGUAGE.md)
3. [`../../brand/03_PRODUCT_PHILOSOPHY.md`](../../brand/03_PRODUCT_PHILOSOPHY.md)

If this document conflicts with the master system, the master system wins.

## Product responsibility

ARQ Balance answers one question:

> How much money do we currently have together?

The shared balance is therefore the primary idea on Home. Income, expenses, analytics, navigation, and actions must remain visually subordinate.

## Product lockup

The product uses the canonical stacked naming relationship:

```text
ARQ
Balance
```

The lockup appears on Home and in low-frequency product-signature contexts. Repeated utility surfaces use `Balance` as quiet context instead of repeating the master logo.

No literal arch, building, column, blueprint, or decorative architectural symbol belongs to the Balance interface.

## Material tokens

Balance uses the canonical ARQ palette without product-specific recoloring:

| Role | Light | Dark |
|---|---|---|
| Paper | `#F6F4EE` | — |
| Paper Raised | `#FDFCF8` | — |
| Stone | `#ECEAE3` | — |
| Stone Line | `#D6D5CD` | `#363832` |
| Graphite | `#232421` | `#191B18` |
| Graphite Deep | — | `#111310` |
| Paper text | — | `#EEEDE7` |
| Ink | `#777970` | `#9A9D95` |
| Accent | `#607674` | `#91AAA7` |
| Accent Strong | `#405957` | `#B3C7C4` |
| Income | `#667B6C` | `#8AA090` |
| Expense | `#946B64` | `#BC8C84` |

Semantic color is always paired with a sign, label, or directional icon.

## Shared balance

- The balance is uncontained.
- It receives the largest typography and the largest surrounding interval.
- Numerals use the display role and tabular figures.
- Currency is smaller and lower contrast than the number.
- A short explanatory sentence states that the value is derived from active transactions.
- The visibility control has a text alternative and a 44 × 44 px target.
- Decorative geometry may not compete with or frame the number.

## Income and expenses

Income and expense summaries are ledger rows separated by hairlines. They are not cards. Each includes:

- a clear Ukrainian label;
- a directional icon;
- an explicit sign;
- muted semantic color;
- a locale-formatted PLN value.

## Transaction rows

Transactions form an open list:

- one quiet category icon for scanning;
- category as the row title;
- full person name, date, and optional comment as metadata;
- signed, tabular amount aligned to the trailing edge;
- hairline separation;
- no independent cards or shadows.

## Analytics

Analytics is expressed as financial movement, not a dashboard:

- one primary balance-change value;
- income and expense as a supporting two-column ledger;
- one-pixel category measures with direct labels;
- largest expenses reuse the transaction-list language;
- no ornamental chart grid or legend when direct labels are available.

## Navigation

Bottom navigation contains destinations only:

- Головна
- Аналітика
- Налаштування

Active state uses typography and icon weight. There are no pills or colored backgrounds.

The global Add action uses the approved constructed-square FAB with one consistent asymmetric corner. It is placed outside navigation, remains clear of content, and includes an accessible text alternative.

## Bottom sheet

The Add Transaction sheet is the strongest physical layer in Balance:

- product context is quiet and does not repeat the master logo;
- the title uses canonical terminology: `Додати операцію`;
- type uses text tabs;
- amount uses display typography and a ledger line;
- category, person, and date use aligned ledger rows;
- optional comment uses a Stone field;
- one primary completion action repeats the constructed corner;
- dismissal works by close control, backdrop, and Escape.

## Motion

- Immediate feedback: 80–140 ms.
- Color and opacity: 160–240 ms.
- Spatial interaction: 360–480 ms.
- Sheet entrance: 420–560 ms using the canonical spring curve.
- Loading uses quiet opacity breathing.
- Reduced-motion preference removes nonessential translation and scale.

## Quality bar

Balance is compliant when:

- the shared balance is unmistakably primary;
- the interface remains recognisable as ARQ without repeated logos;
- no literal architectural decoration is present;
- content follows the 8pt rhythm;
- body text remains readable;
- touch targets are at least 44 × 44 px;
- currency, dates, and numbers are locale-correct;
- semantic meaning does not rely on color alone;
- light and dark modes are reviewed independently;
- loading, empty, focus, error, and pressed states meet the same visual standard.
