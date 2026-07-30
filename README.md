# ARQ

ARQ is a product ecosystem built around structure, clarity, precision, calm, and timelessness.

## Source of Truth

Every ARQ product follows the canonical documents in [`brand/`](brand/):

1. [`00_SOURCE_OF_TRUTH.md`](brand/00_SOURCE_OF_TRUTH.md)
2. [`01_BRAND_SYSTEM.md`](brand/01_BRAND_SYSTEM.md)
3. [`02_DESIGN_LANGUAGE.md`](brand/02_DESIGN_LANGUAGE.md)
4. [`03_PRODUCT_PHILOSOPHY.md`](brand/03_PRODUCT_PHILOSOPHY.md)

## Products

### ARQ Balance

[`Balance/`](Balance/) is a mobile-first shared-finance product for couples. Its current frontend uses local mock data; authentication and Supabase persistence are intentionally not connected.

Run it locally:

```bash
cd Balance
npm install
npm run dev
```

Validation:

```bash
npm run typecheck
npm run lint
npm run build
```
