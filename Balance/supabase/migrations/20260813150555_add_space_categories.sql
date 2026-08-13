create table public.space_categories (
  space_id uuid not null references public.spaces(id) on delete cascade,
  id text not null default gen_random_uuid()::text,
  type text not null,
  name text not null,
  icon text not null default 'CircleEllipsis',
  is_default boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid not null references auth.users(id) on delete restrict,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (space_id, id),
  unique (space_id, id, type),
  constraint space_categories_type check (type in ('income', 'expense')),
  constraint space_categories_name_length check (char_length(btrim(name)) between 1 and 40),
  constraint space_categories_icon_length check (char_length(btrim(icon)) between 1 and 64),
  constraint space_categories_sort_order check (sort_order between 0 and 10000)
);

create index space_categories_space_active_idx
  on public.space_categories(space_id, type, sort_order, created_at)
  where archived_at is null;

create unique index space_categories_active_name_idx
  on public.space_categories(space_id, type, lower(btrim(name)))
  where archived_at is null;

create or replace function private.seed_space_categories()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.space_categories
    (space_id, id, type, name, icon, is_default, sort_order, created_by)
  values
    (new.id, 'salary', 'income', 'Зарплата', 'BriefcaseBusiness', true, 10, new.created_by),
    (new.id, 'side', 'income', 'Підробіток', 'Sparkles', true, 20, new.created_by),
    (new.id, 'gift', 'income', 'Подарунок', 'Gift', true, 30, new.created_by),
    (new.id, 'investment', 'income', 'Інвестиції', 'TrendingUp', true, 40, new.created_by),
    (new.id, 'income-other', 'income', 'Інше', 'CircleEllipsis', true, 90, new.created_by),
    (new.id, 'food', 'expense', 'Продукти', 'ShoppingBasket', true, 10, new.created_by),
    (new.id, 'home', 'expense', 'Житло', 'House', true, 20, new.created_by),
    (new.id, 'transport', 'expense', 'Транспорт', 'TramFront', true, 30, new.created_by),
    (new.id, 'places', 'expense', 'Заклади', 'Utensils', true, 40, new.created_by),
    (new.id, 'shopping', 'expense', 'Покупки', 'ShoppingBag', true, 50, new.created_by),
    (new.id, 'fun', 'expense', 'Розваги', 'Clapperboard', true, 60, new.created_by),
    (new.id, 'health', 'expense', 'Здоров’я', 'HeartPulse', true, 70, new.created_by),
    (new.id, 'pets', 'expense', 'Тварини', 'PawPrint', true, 80, new.created_by),
    (new.id, 'expense-other', 'expense', 'Інше', 'CircleEllipsis', true, 90, new.created_by)
  on conflict (space_id, id) do nothing;
  return new;
end;
$$;

revoke all on function private.seed_space_categories() from public, anon, authenticated;

insert into public.space_categories
  (space_id, id, type, name, icon, is_default, sort_order, created_by)
select space.id, category.id, category.type, category.name, category.icon, true, category.sort_order, space.created_by
from public.spaces as space
cross join (values
  ('salary', 'income', 'Зарплата', 'BriefcaseBusiness', 10),
  ('side', 'income', 'Підробіток', 'Sparkles', 20),
  ('gift', 'income', 'Подарунок', 'Gift', 30),
  ('investment', 'income', 'Інвестиції', 'TrendingUp', 40),
  ('income-other', 'income', 'Інше', 'CircleEllipsis', 90),
  ('food', 'expense', 'Продукти', 'ShoppingBasket', 10),
  ('home', 'expense', 'Житло', 'House', 20),
  ('transport', 'expense', 'Транспорт', 'TramFront', 30),
  ('places', 'expense', 'Заклади', 'Utensils', 40),
  ('shopping', 'expense', 'Покупки', 'ShoppingBag', 50),
  ('fun', 'expense', 'Розваги', 'Clapperboard', 60),
  ('health', 'expense', 'Здоров’я', 'HeartPulse', 70),
  ('pets', 'expense', 'Тварини', 'PawPrint', 80),
  ('expense-other', 'expense', 'Інше', 'CircleEllipsis', 90)
) as category(id, type, name, icon, sort_order)
on conflict (space_id, id) do nothing;

create trigger spaces_seed_categories
after insert on public.spaces
for each row execute function private.seed_space_categories();

create trigger space_categories_set_updated_at
before update on public.space_categories
for each row execute function private.set_updated_at();

create or replace function private.prepare_space_category_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.name := btrim(new.name);
    new.icon := btrim(new.icon);
    return new;
  end if;

  if new.space_id is distinct from old.space_id
    or new.id is distinct from old.id
    or new.type is distinct from old.type
    or new.created_by is distinct from old.created_by
    or new.is_default is distinct from old.is_default
    or new.created_at is distinct from old.created_at then
    raise exception 'category_identity_is_immutable' using errcode = '22023';
  end if;

  if old.archived_at is null and new.archived_at is not null and not exists (
    select 1
    from public.space_categories as category
    where category.space_id = old.space_id
      and category.type = old.type
      and category.id <> old.id
      and category.archived_at is null
  ) then
    raise exception 'last_active_category' using errcode = '22023';
  end if;

  new.name := btrim(new.name);
  new.icon := btrim(new.icon);
  return new;
end;
$$;

revoke all on function private.prepare_space_category_write() from public, anon, authenticated;

create trigger space_categories_prepare_write
before insert or update on public.space_categories
for each row execute function private.prepare_space_category_write();

create or replace function private.validate_transaction_category_active()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
    and new.category_id is not distinct from old.category_id
    and new.type is not distinct from old.type then
    return new;
  end if;

  if not exists (
    select 1 from public.space_categories
    where space_id = new.space_id
      and id = new.category_id
      and type = new.type
      and archived_at is null
  ) then
    raise exception 'transaction_category_unavailable' using errcode = '22023';
  end if;
  return new;
end;
$$;

revoke all on function private.validate_transaction_category_active() from public, anon, authenticated;

create trigger transactions_validate_category_active
before insert or update of category_id, type on public.transactions
for each row execute function private.validate_transaction_category_active();

alter table public.transactions
  drop constraint transactions_category_matches_type;

alter table public.transactions
  add constraint transactions_category_space_type_fkey
  foreign key (space_id, category_id, type)
  references public.space_categories(space_id, id, type)
  on update cascade
  on delete restrict;

alter table public.space_categories enable row level security;

create policy space_categories_select_members
on public.space_categories for select to authenticated
using ((select private.is_space_member(space_id)));

create policy space_categories_insert_members
on public.space_categories for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (select private.is_space_member(space_id))
);

create policy space_categories_update_creator_or_owner
on public.space_categories for update to authenticated
using (
  (select private.is_space_member(space_id))
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

revoke all on public.space_categories from public, anon;
grant select, insert, update on public.space_categories to authenticated;

create or replace function private.realtime_category_space_id(p_topic text)
returns uuid
language sql
immutable
strict
set search_path = ''
as $$
  select case
    when p_topic ~ '^space:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}:categories$'
      then split_part(p_topic, ':', 2)::uuid
    else null
  end;
$$;

revoke all on function private.realtime_category_space_id(text) from public, anon;
grant execute on function private.realtime_category_space_id(text) to authenticated;

create policy category_members_receive_broadcasts
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension = 'broadcast'
  and (
    select private.is_space_member(
      private.realtime_category_space_id((select realtime.topic()))
    )
  )
);

create or replace function private.broadcast_space_category_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_space_id uuid := coalesce(new.space_id, old.space_id);
begin
  perform realtime.broadcast_changes(
    'space:' || v_space_id::text || ':categories',
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );

  return null;
end;
$$;

revoke all on function private.broadcast_space_category_change() from public, anon, authenticated;

create trigger broadcast_space_category_change
after insert or update or delete
on public.space_categories
for each row
execute function private.broadcast_space_category_change();
