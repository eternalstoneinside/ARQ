create or replace function public.delete_transaction(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_space_id uuid;
  v_created_by uuid;
  v_deleted_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select space_id, created_by, deleted_at
    into v_space_id, v_created_by, v_deleted_at
    from public.transactions
    where id = p_transaction_id
    for update;

  if not found or v_deleted_at is not null then
    raise exception 'transaction_not_found' using errcode = '22023';
  end if;
  if not private.is_space_member(v_space_id, v_user_id) then
    raise exception 'space_membership_required' using errcode = '42501';
  end if;
  if v_created_by <> v_user_id and not private.is_space_owner(v_space_id, v_user_id) then
    raise exception 'transaction_write_forbidden' using errcode = '42501';
  end if;

  update public.transactions
  set deleted_at = now(), deleted_by = v_user_id
  where id = p_transaction_id;
end;
$$;

revoke all on function public.delete_transaction(uuid) from public, anon;
grant execute on function public.delete_transaction(uuid) to authenticated;
