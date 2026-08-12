create unique index space_members_one_owner_idx
  on public.space_members(space_id)
  where role = 'owner';

create or replace function private.shares_space_with(
  p_other_user_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_user_id is not null
    and p_other_user_id is not null
    and exists (
      select 1
      from public.space_members as own_membership
      join public.space_members as other_membership
        on other_membership.space_id = own_membership.space_id
      where own_membership.user_id = p_user_id
        and other_membership.user_id = p_other_user_id
    );
$$;

revoke all on function private.shares_space_with(uuid, uuid) from public, anon, authenticated;
grant execute on function private.shares_space_with(uuid, uuid) to authenticated;

create policy profiles_select_space_members
on public.profiles
for select
to authenticated
using ((select private.shares_space_with(profiles.id)));

create or replace function public.create_space_invite(p_space_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_code text;
  v_attempt integer := 0;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  perform 1 from public.spaces where id = p_space_id for update;
  if not found then
    raise exception 'space_not_found' using errcode = '22023';
  end if;
  if not private.is_space_owner(p_space_id, v_user_id) then
    raise exception 'space_owner_required' using errcode = '42501';
  end if;

  update public.space_invites
  set revoked_at = now()
  where space_id = p_space_id and revoked_at is null;

  loop
    v_attempt := v_attempt + 1;
    v_code := private.new_invite_code();
    begin
      insert into public.space_invites (space_id, code_hash, created_by)
      values (p_space_id, encode(extensions.digest(v_code, 'sha256'), 'hex'), v_user_id);
      exit;
    exception when unique_violation then
      if v_attempt >= 5 then raise; end if;
    end;
  end loop;

  return v_code;
end;
$$;

create or replace function public.revoke_space_invites(p_space_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  perform 1 from public.spaces where id = p_space_id for update;
  if not found then
    raise exception 'space_not_found' using errcode = '22023';
  end if;
  if not private.is_space_owner(p_space_id, v_user_id) then
    raise exception 'space_owner_required' using errcode = '42501';
  end if;

  update public.space_invites
  set revoked_at = now()
  where space_id = p_space_id and revoked_at is null;
end;
$$;

create or replace function public.transfer_space_ownership(
  p_space_id uuid,
  p_new_owner_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_current_role text;
  v_new_owner_role text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_new_owner_id is null or p_new_owner_id = v_user_id then
    raise exception 'invalid_new_owner' using errcode = '22023';
  end if;

  perform 1 from public.spaces where id = p_space_id for update;
  if not found then
    raise exception 'space_not_found' using errcode = '22023';
  end if;

  select role into v_current_role
  from public.space_members
  where space_id = p_space_id and user_id = v_user_id
  for update;

  select role into v_new_owner_role
  from public.space_members
  where space_id = p_space_id and user_id = p_new_owner_id
  for update;

  if v_current_role is distinct from 'owner' then
    raise exception 'space_owner_required' using errcode = '42501';
  end if;
  if v_new_owner_role is distinct from 'member' then
    raise exception 'new_owner_must_be_member' using errcode = '22023';
  end if;

  update public.space_members
  set role = 'member'
  where space_id = p_space_id and user_id = v_user_id;

  update public.space_members
  set role = 'owner'
  where space_id = p_space_id and user_id = p_new_owner_id;
end;
$$;

create or replace function public.remove_space_member(
  p_space_id uuid,
  p_member_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_member_role text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_member_id is null or p_member_id = v_user_id then
    raise exception 'use_leave_space' using errcode = '22023';
  end if;

  perform 1 from public.spaces where id = p_space_id for update;
  if not found then
    raise exception 'space_not_found' using errcode = '22023';
  end if;
  if not private.is_space_owner(p_space_id, v_user_id) then
    raise exception 'space_owner_required' using errcode = '42501';
  end if;

  select role into v_member_role
  from public.space_members
  where space_id = p_space_id and user_id = p_member_id
  for update;

  if v_member_role is null then
    raise exception 'space_member_not_found' using errcode = '22023';
  end if;
  if v_member_role = 'owner' then
    raise exception 'cannot_remove_owner' using errcode = '22023';
  end if;

  update public.profiles
  set active_space_id = null
  where id = p_member_id and active_space_id = p_space_id;

  delete from public.space_members
  where space_id = p_space_id and user_id = p_member_id;
end;
$$;

create or replace function public.leave_space(p_space_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_member_role text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  perform 1 from public.spaces where id = p_space_id for update;
  if not found then
    raise exception 'space_not_found' using errcode = '22023';
  end if;

  select role into v_member_role
  from public.space_members
  where space_id = p_space_id and user_id = v_user_id
  for update;

  if v_member_role is null then
    raise exception 'space_member_not_found' using errcode = '22023';
  end if;
  if v_member_role = 'owner' then
    raise exception 'transfer_or_delete_required' using errcode = '22023';
  end if;

  update public.profiles
  set active_space_id = null
  where id = v_user_id and active_space_id = p_space_id;

  delete from public.space_members
  where space_id = p_space_id and user_id = v_user_id;
end;
$$;

revoke all on function public.create_space_invite(uuid) from public, anon;
revoke all on function public.revoke_space_invites(uuid) from public, anon;
revoke all on function public.transfer_space_ownership(uuid, uuid) from public, anon;
revoke all on function public.remove_space_member(uuid, uuid) from public, anon;
revoke all on function public.leave_space(uuid) from public, anon;

grant execute on function public.create_space_invite(uuid) to authenticated;
grant execute on function public.revoke_space_invites(uuid) to authenticated;
grant execute on function public.transfer_space_ownership(uuid, uuid) to authenticated;
grant execute on function public.remove_space_member(uuid, uuid) to authenticated;
grant execute on function public.leave_space(uuid) to authenticated;
