create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(display_name) <= 100)
);

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint spaces_name_length check (char_length(btrim(name)) between 1 and 80)
);

create table public.space_members (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id),
  constraint space_members_role check (role in ('owner', 'member'))
);

create index space_members_user_id_idx on public.space_members(user_id);
create index space_members_space_id_role_idx on public.space_members(space_id, role);

create table public.space_invites (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  code_hash text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '14 days'),
  max_uses integer not null default 20,
  used_count integer not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint space_invites_usage check (max_uses between 1 and 100 and used_count between 0 and max_uses)
);

create index space_invites_space_active_idx on public.space_invites(space_id, expires_at)
  where revoked_at is null;

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger spaces_set_updated_at before update on public.spaces
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of raw_user_meta_data on auth.users
for each row execute function private.handle_new_user();

insert into public.profiles (id, display_name, avatar_url)
select id,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', ''),
  nullif(raw_user_meta_data ->> 'avatar_url', '')
from auth.users
on conflict (id) do nothing;

create or replace function private.is_space_member(p_space_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select p_user_id is not null and exists (
    select 1 from public.space_members
    where space_id = p_space_id and user_id = p_user_id
  );
$$;

create or replace function private.is_space_owner(p_space_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select p_user_id is not null and exists (
    select 1 from public.space_members
    where space_id = p_space_id and user_id = p_user_id and role = 'owner'
  );
$$;

create or replace function private.new_invite_code()
returns text language sql volatile set search_path = '' as $$
  select 'ARQ-' || upper(substr(raw_code, 1, 4)) || '-' ||
    upper(substr(raw_code, 5, 4)) || '-' || upper(substr(raw_code, 9, 4))
  from (select encode(extensions.gen_random_bytes(6), 'hex') as raw_code) generated;
$$;

alter table public.profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.space_invites enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated
using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy spaces_select_members on public.spaces for select to authenticated
using ((select private.is_space_member(id)));
create policy spaces_update_owners on public.spaces for update to authenticated
using ((select private.is_space_owner(id))) with check ((select private.is_space_owner(id)));
create policy spaces_delete_owners on public.spaces for delete to authenticated
using ((select private.is_space_owner(id)));
create policy space_members_select_members on public.space_members for select to authenticated
using ((select private.is_space_member(space_id)));
create policy space_invites_select_owners on public.space_invites for select to authenticated
using ((select private.is_space_owner(space_id)));

create or replace function public.create_space_with_invite(p_name text)
returns table (space_id uuid, space_name text, invite_code text)
language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_space_id uuid;
  v_name text := btrim(p_name);
  v_code text;
  v_attempt integer := 0;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if v_name is null or char_length(v_name) < 1 or char_length(v_name) > 80 then
    raise exception 'invalid_space_name' using errcode = '22023';
  end if;

  insert into public.spaces (name, created_by) values (v_name, v_user_id)
  returning id into v_space_id;
  insert into public.space_members (space_id, user_id, role)
  values (v_space_id, v_user_id, 'owner');

  loop
    v_attempt := v_attempt + 1;
    v_code := private.new_invite_code();
    begin
      insert into public.space_invites (space_id, code_hash, created_by)
      values (v_space_id, encode(extensions.digest(v_code, 'sha256'), 'hex'), v_user_id);
      exit;
    exception when unique_violation then
      if v_attempt >= 5 then raise; end if;
    end;
  end loop;

  return query select v_space_id, v_name, v_code;
end;
$$;

create or replace function public.create_space_invite(p_space_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_code text;
  v_attempt integer := 0;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if not private.is_space_owner(p_space_id, v_user_id) then
    raise exception 'space_owner_required' using errcode = '42501';
  end if;

  update public.space_invites set revoked_at = now()
  where space_id = p_space_id and revoked_at is null and expires_at > now() and used_count < max_uses;

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

create or replace function public.join_space_by_code(p_code text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s+', '', 'g'));
  v_invite public.space_invites%rowtype;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_invite from public.space_invites
  where code_hash = encode(extensions.digest(v_code, 'sha256'), 'hex')
  for update;

  if not found or v_invite.revoked_at is not null or v_invite.expires_at <= now() then
    raise exception 'invalid_invite_code' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.space_members
    where space_id = v_invite.space_id and user_id = v_user_id
  ) then
    return v_invite.space_id;
  end if;
  if v_invite.used_count >= v_invite.max_uses then
    raise exception 'invalid_invite_code' using errcode = '22023';
  end if;

  insert into public.space_members (space_id, user_id, role)
  values (v_invite.space_id, v_user_id, 'member');
  update public.space_invites set used_count = used_count + 1 where id = v_invite.id;
  return v_invite.space_id;
end;
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_space_member(uuid, uuid) to authenticated;
grant execute on function private.is_space_owner(uuid, uuid) to authenticated;

revoke all on public.profiles, public.spaces, public.space_members, public.space_invites from anon;
grant select, update on public.profiles to authenticated;
grant select, update, delete on public.spaces to authenticated;
grant select on public.space_members to authenticated;
grant select on public.space_invites to authenticated;

revoke all on function public.create_space_with_invite(text) from public, anon;
revoke all on function public.create_space_invite(uuid) from public, anon;
revoke all on function public.join_space_by_code(text) from public, anon;
grant execute on function public.create_space_with_invite(text) to authenticated;
grant execute on function public.create_space_invite(uuid) to authenticated;
grant execute on function public.join_space_by_code(text) to authenticated;
