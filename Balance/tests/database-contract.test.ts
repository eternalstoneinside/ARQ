import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function migration(name: string) {
  return readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8')
}

const spaces = migration('20260802094000_create_spaces_and_invites.sql')
const transactions = migration('20260803183000_create_transactions.sql')
const transactionDelete = migration('20260803190000_add_transaction_delete_function.sql')
const categories = migration('20260813150555_add_space_categories.sql')

describe('authentication and spaces database contract', () => {
  it('requires authentication for creating and joining spaces', () => {
    expect(spaces).toMatch(/create_space_with_invite[\s\S]+auth\.uid\(\)[\s\S]+authentication_required/)
    expect(spaces).toMatch(/join_space_by_code[\s\S]+auth\.uid\(\)[\s\S]+authentication_required/)
  })

  it('hashes invitation codes and joins under a row lock', () => {
    expect(spaces).toContain("extensions.digest(v_code, 'sha256')")
    expect(spaces).toMatch(/select \* into v_invite[\s\S]+for update;/)
    expect(spaces).toMatch(/used_count >= v_invite\.max_uses/)
    expect(spaces).toMatch(/insert into public\.space_members/)
  })

  it('limits space management to owners and reads to members', () => {
    expect(spaces).toMatch(/spaces_select_members[\s\S]+private\.is_space_member/)
    expect(spaces).toMatch(/spaces_update_owners[\s\S]+private\.is_space_owner/)
    expect(spaces).toMatch(/spaces_delete_owners[\s\S]+private\.is_space_owner/)
  })
})

describe('transaction CRUD database contract', () => {
  it('stores money as positive integer minor units in PLN', () => {
    expect(transactions).toMatch(/amount_minor bigint not null/)
    expect(transactions).toMatch(/amount_minor between 1 and 999999999999/)
    expect(transactions).toMatch(/currency = 'PLN'/)
  })

  it('allows reads only to space members and writes only to author or owner', () => {
    expect(transactions).toMatch(/transactions_select_space_members[\s\S]+private\.is_space_member/)
    expect(transactions).toMatch(/transactions_insert_space_members[\s\S]+created_by = \(select auth\.uid\(\)\)/)
    expect(transactions).toMatch(/transactions_update_author_or_owner[\s\S]+created_by = \(select auth\.uid\(\)\)[\s\S]+private\.is_space_owner/)
  })

  it('soft-deletes through an authenticated, permission-checked function', () => {
    expect(transactionDelete).toMatch(/auth\.uid\(\)[\s\S]+authentication_required/)
    expect(transactionDelete).toMatch(/v_created_by <> v_user_id[\s\S]+private\.is_space_owner/)
    expect(transactionDelete).toMatch(/set deleted_at = now\(\), deleted_by = v_user_id/)
    expect(transactionDelete).not.toMatch(/delete from public\.transactions/)
  })
})

describe('space category database contract', () => {
  it('backfills existing spaces and seeds future spaces without changing transactions', () => {
    expect(categories).toMatch(/insert into public\.space_categories[\s\S]+from public\.spaces/)
    expect(categories).toMatch(/create trigger spaces_seed_categories[\s\S]+after insert on public\.spaces/)
    expect(categories).not.toMatch(/update public\.transactions/)
    expect(categories).not.toMatch(/delete from public\.transactions/)
  })

  it('keeps transaction category references valid and prevents category deletion', () => {
    expect(categories).toMatch(/foreign key \(space_id, category_id, type\)/)
    expect(categories).toMatch(/on update cascade[\s\S]+on delete restrict/)
    expect(categories).toMatch(/archived_at timestamptz/)
    expect(categories).toMatch(/transactions_validate_category_active[\s\S]+validate_transaction_category_active/)
  })

  it('restricts categories to space members and creator or owner management', () => {
    expect(categories).toMatch(/space_categories_select_members[\s\S]+private\.is_space_member/)
    expect(categories).toMatch(/space_categories_insert_members[\s\S]+created_by = \(select auth\.uid\(\)\)/)
    expect(categories).toMatch(/space_categories_update_creator_or_owner[\s\S]+private\.is_space_owner/)
    expect(categories).toMatch(/revoke all on public\.space_categories from public, anon/)
    expect(categories).toMatch(/category_identity_is_immutable/)
  })
})
