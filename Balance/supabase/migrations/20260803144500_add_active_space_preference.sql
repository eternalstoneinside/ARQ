alter table public.profiles
  add column active_space_id uuid references public.spaces(id) on delete set null;

create index profiles_active_space_id_idx
  on public.profiles(active_space_id)
  where active_space_id is not null;

create or replace function private.validate_active_space_selection()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.active_space_id is not null
    and not private.is_space_member(new.active_space_id, new.id)
  then
    raise exception 'space_membership_required' using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_active_space_selection() from public, anon, authenticated;

create trigger profiles_validate_active_space
before insert or update of active_space_id on public.profiles
for each row execute function private.validate_active_space_selection();

update public.profiles as profile
set active_space_id = membership.space_id
from (
  select distinct on (user_id) user_id, space_id
  from public.space_members
  order by user_id, joined_at desc, space_id
) as membership
where profile.id = membership.user_id
  and profile.active_space_id is null;
