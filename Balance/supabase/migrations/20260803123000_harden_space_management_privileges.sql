-- Keep Data API privileges intentionally narrower than the row-level policies.
-- Space creation and membership/invite mutations remain available only through
-- the authenticated SECURITY DEFINER functions defined by the initial schema.
revoke all on table public.profiles from authenticated;
revoke all on table public.spaces from authenticated;
revoke all on table public.space_members from authenticated;
revoke all on table public.space_invites from authenticated;

grant select, update on table public.profiles to authenticated;
grant select, update, delete on table public.spaces to authenticated;
grant select on table public.space_members to authenticated;
grant select on table public.space_invites to authenticated;
