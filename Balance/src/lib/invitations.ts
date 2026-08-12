export function normalizeInviteCode(value: string) {
  return value
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-ZА-ЯІЇЄҐ0-9-]/g, '')
    .slice(0, 18)
}
