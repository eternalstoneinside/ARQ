drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_select_space_members on public.profiles;

create policy profiles_select_visible
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.shares_space_with(profiles.id))
);
