import { describe, expect, it } from 'vitest'
import { decideAuthAccess, decideSpaceAccess } from '../src/lib/access'
import { normalizeInviteCode } from '../src/lib/invitations'

describe('protected entry flow', () => {
  it('waits for session resolution before redirecting', () => {
    expect(decideAuthAccess(true, false)).toBe('loading')
    expect(decideAuthAccess(false, false)).toBe('redirect')
    expect(decideAuthAccess(false, true)).toBe('allow')
  })

  it('routes an authenticated user without a space into onboarding', () => {
    expect(decideSpaceAccess(true, false)).toBe('loading')
    expect(decideSpaceAccess(false, false)).toBe('redirect')
    expect(decideSpaceAccess(false, true)).toBe('allow')
  })
})

describe('invitation input', () => {
  it('normalizes pasted invitation codes before joining', () => {
    expect(normalizeInviteCode(' arq-ab12 - cd34-ef56 ')).toBe('ARQ-AB12-CD34-EF56')
    expect(normalizeInviteCode('ARQ_1234<script>')).toBe('ARQ1234SCRIPT')
  })
})
