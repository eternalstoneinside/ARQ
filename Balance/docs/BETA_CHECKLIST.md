# ARQ Beta Release Checklist

This checklist protects existing production data. Automated tests use local fixtures and inspect committed SQL; they never write to hosted Supabase.

## Automated gate

```bash
npm run test
npm run typecheck
npm run lint
npm run build:pages
npm audit
```

Required: every command passes and `npm audit` reports zero known vulnerabilities.

## Existing-account smoke test

- Google sign-in restores the existing session and active space.
- Home balance equals active income minus active expenses.
- The eye hides the hero, summaries, transaction rows, Analytics, and details.
- Refreshing and switching tabs does not reveal hidden amounts during the session.
- Search finds transactions by category, person, description, and amount.
- Settings, Spaces, Members, and the space switcher open without document reload.
- Browser Back and the visible Back control return to the expected screen.
- The Add sheet opens promptly from the FAB without losing page state.
- iPhone Safari does not auto-link or underline names, dates, or email text.

## Two-account verification

Use one disposable test space; do not modify existing personal spaces.

1. Account A creates it and records the invitation code.
2. An invalid code fails without joining.
3. Account B joins with the valid code and sees the same space.
4. Account A adds a small test income; Account B receives it through realtime refresh.
5. Account B adds a small test expense; Account A receives it.
6. A member cannot rename/delete the space, transfer ownership, revoke invites, or edit another member’s operation.
7. The author can edit their operation; the owner can correct either operation.
8. Both accounts see the same balance and Analytics totals.
9. Account A regenerates the invitation; the previous code stops working.
10. Account B leaves and loses access.
11. Account A deletes only the disposable test space.

## Release decision

Ship only when the automated gate and existing-account smoke test pass. Complete this two-account checklist before declaring multi-user beta ready; record any skipped item in the PR.
