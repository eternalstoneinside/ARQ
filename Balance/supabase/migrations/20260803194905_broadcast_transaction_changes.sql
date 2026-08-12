alter publication supabase_realtime drop table public.transactions;

create or replace function private.realtime_transaction_space_id(p_topic text)
returns uuid
language sql
immutable
strict
set search_path = ''
as $$
  select case
    when p_topic ~ '^space:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}:transactions$'
      then split_part(p_topic, ':', 2)::uuid
    else null
  end;
$$;

revoke all on function private.realtime_transaction_space_id(text) from public, anon;
grant execute on function private.realtime_transaction_space_id(text) to authenticated;

drop policy if exists transaction_members_receive_broadcasts on realtime.messages;
create policy transaction_members_receive_broadcasts
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension = 'broadcast'
  and (
    select private.is_space_member(
      private.realtime_transaction_space_id((select realtime.topic()))
    )
  )
);

create or replace function private.broadcast_transaction_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_space_id uuid := coalesce(new.space_id, old.space_id);
begin
  perform realtime.broadcast_changes(
    'space:' || v_space_id::text || ':transactions',
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

revoke all on function private.broadcast_transaction_change() from public, anon, authenticated;

drop trigger if exists broadcast_transaction_change on public.transactions;
create trigger broadcast_transaction_change
after insert or update or delete
on public.transactions
for each row
execute function private.broadcast_transaction_change();
