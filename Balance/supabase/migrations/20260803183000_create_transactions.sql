create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  type text not null,
  amount_minor bigint not null,
  currency text not null default 'PLN',
  category_id text not null,
  person_id uuid not null references auth.users(id) on delete restrict,
  person_name text not null,
  transaction_date date not null default current_date,
  comment text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete restrict,
  constraint transactions_type check (type in ('income', 'expense')),
  constraint transactions_amount check (amount_minor between 1 and 999999999999),
  constraint transactions_currency check (currency = 'PLN'),
  constraint transactions_comment_length check (comment is null or char_length(comment) <= 160),
  constraint transactions_person_name_length check (char_length(btrim(person_name)) between 1 and 100),
  constraint transactions_category_matches_type check (
    (type = 'income' and category_id in ('salary', 'side', 'gift', 'investment', 'income-other'))
    or
    (type = 'expense' and category_id in ('food', 'home', 'transport', 'places', 'shopping', 'fun', 'health', 'pets', 'expense-other'))
  ),
  constraint transactions_deleted_state check (
    (deleted_at is null and deleted_by is null)
    or (deleted_at is not null and deleted_by is not null)
  )
);

create index transactions_space_date_active_idx
  on public.transactions(space_id, transaction_date desc, created_at desc)
  where deleted_at is null;

create index transactions_created_by_idx on public.transactions(created_by);
create index transactions_person_id_idx on public.transactions(person_id);

create or replace function private.prepare_transaction_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_person_name text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    new.created_by := v_user_id;
    new.created_at := now();
    new.deleted_at := null;
    new.deleted_by := null;
  else
    if old.deleted_at is not null then
      raise exception 'transaction_already_deleted' using errcode = '22023';
    end if;
    if new.id is distinct from old.id
      or new.space_id is distinct from old.space_id
      or new.created_by is distinct from old.created_by
      or new.created_at is distinct from old.created_at then
      raise exception 'transaction_identity_is_immutable' using errcode = '22023';
    end if;

    if new.deleted_at is distinct from old.deleted_at then
      if new.deleted_at is null then
        raise exception 'transaction_restore_not_supported' using errcode = '22023';
      end if;
      new.deleted_at := now();
      new.deleted_by := v_user_id;
    else
      new.deleted_by := old.deleted_by;
    end if;
  end if;

  if not private.is_space_member(new.space_id, v_user_id) then
    raise exception 'space_membership_required' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' or new.person_id is distinct from old.person_id then
    if not private.is_space_member(new.space_id, new.person_id) then
      raise exception 'transaction_person_must_be_space_member' using errcode = '22023';
    end if;

    select nullif(btrim(display_name), '')
      into v_person_name
      from public.profiles
      where id = new.person_id;

    new.person_name := coalesce(v_person_name, 'Учасник ARQ');
  else
    new.person_name := old.person_name;
  end if;

  new.currency := 'PLN';
  new.comment := nullif(btrim(new.comment), '');
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.prepare_transaction_write() from public, anon, authenticated;

create trigger transactions_prepare_write
before insert or update on public.transactions
for each row execute function private.prepare_transaction_write();

alter table public.transactions enable row level security;

create policy transactions_select_space_members
on public.transactions
for select
to authenticated
using (
  deleted_at is null
  and (select private.is_space_member(space_id))
);

create policy transactions_insert_space_members
on public.transactions
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and deleted_at is null
  and deleted_by is null
  and (select private.is_space_member(space_id))
);

create policy transactions_update_author_or_owner
on public.transactions
for update
to authenticated
using (
  deleted_at is null
  and (select private.is_space_member(space_id))
  and (
    created_by = (select auth.uid())
    or (select private.is_space_owner(space_id))
  )
)
with check (
  (select private.is_space_member(space_id))
  and (
    created_by = (select auth.uid())
    or (select private.is_space_owner(space_id))
  )
);

revoke all on table public.transactions from public, anon, authenticated;
grant select, insert, update on table public.transactions to authenticated;
