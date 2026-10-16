-- One-time cleanup + backend authorization for FoundHere.
-- Review the table names before running in Supabase SQL Editor.

begin;

create table if not exists public.item_matches (id uuid primary key default gen_random_uuid(), item_id uuid references public.items(id) on delete cascade, matched_item_id uuid references public.items(id) on delete cascade, score integer not null default 0, created_at timestamptz not null default now());
create table if not exists public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, item_id uuid references public.items(id) on delete cascade, matched_item_id uuid references public.items(id) on delete cascade, kind text not null default 'match', read_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.claims (id uuid primary key default gen_random_uuid(), item_id uuid references public.items(id) on delete cascade, claimant_user_id uuid references auth.users(id) on delete cascade, status text not null default 'pending', created_at timestamptz not null default now());

-- One-time cleanup: remove claims, notifications, matches, item photos metadata, then reports.
-- Storage objects are deleted separately below because database DELETE cannot remove files from Storage.
delete from public.claims;
delete from public.notifications;
delete from public.item_matches;
delete from public.items;

-- Remove every object in the item-photos bucket. This deletes report photos only.
delete from storage.objects where bucket_id = 'item-photos';

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'student')) default 'student',
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security invoker set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = (select auth.uid()) and role = 'admin') $$;

drop policy if exists "users can read own role" on public.user_roles;
create policy "users can read own role" on public.user_roles for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admins manage roles" on public.user_roles;
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'akobirsaidov023@gmail.com'
on conflict (user_id) do update set role = excluded.role;

alter table public.items enable row level security;
drop policy if exists "public can view active reports" on public.items;
create policy "public can view active reports" on public.items for select to anon, authenticated using (owner_deleted_at is null and deleted_by_owner is not true);
drop policy if exists "owners and admins update reports" on public.items;
create policy "owners and admins update reports" on public.items for update to authenticated using (owner_user_id = (select auth.uid()) or public.is_admin()) with check (owner_user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "owners and admins delete reports" on public.items;
create policy "owners and admins delete reports" on public.items for delete to authenticated using (owner_user_id = (select auth.uid()) or public.is_admin());

alter table public.profiles enable row level security;
drop policy if exists "profiles own row" on public.profiles;
create policy "profiles own row" on public.profiles for all to authenticated using (id = (select auth.uid()) or public.is_admin()) with check (id = (select auth.uid()) or public.is_admin());

commit;

-- Exact effect: deletes all claims, match/notification rows, all item rows, and all files in item-photos.
-- User accounts, profiles, and auth identities are retained.
