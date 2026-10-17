-- One-time cleanup + backend authorization for FoundHere.
-- Review the table names before running in Supabase SQL Editor.

begin;

create table if not exists public.item_matches (id uuid primary key default gen_random_uuid(), item_id uuid references public.items(id) on delete cascade, matched_item_id uuid references public.items(id) on delete cascade, score integer not null default 0, created_at timestamptz not null default now());
create table if not exists public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, item_id uuid references public.items(id) on delete cascade, matched_item_id uuid references public.items(id) on delete cascade, kind text not null default 'match', read_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.claims (id uuid primary key default gen_random_uuid(), item_id uuid references public.items(id) on delete cascade, claimant_user_id uuid references auth.users(id) on delete cascade, status text not null default 'pending', created_at timestamptz not null default now());

-- Ensure linked records cannot orphan when an item is deleted.
alter table public.claims drop constraint if exists claims_item_id_fkey;
alter table public.claims add constraint claims_item_id_fkey foreign key (item_id) references public.items(id) on delete cascade;
alter table public.notifications drop constraint if exists notifications_item_id_fkey;
alter table public.notifications add constraint notifications_item_id_fkey foreign key (item_id) references public.items(id) on delete cascade;
alter table public.notifications drop constraint if exists notifications_matched_item_id_fkey;
alter table public.notifications add constraint notifications_matched_item_id_fkey foreign key (matched_item_id) references public.items(id) on delete cascade;
alter table public.item_matches drop constraint if exists item_matches_item_id_fkey;
alter table public.item_matches add constraint item_matches_item_id_fkey foreign key (item_id) references public.items(id) on delete cascade;
alter table public.item_matches drop constraint if exists item_matches_matched_item_id_fkey;
alter table public.item_matches add constraint item_matches_matched_item_id_fkey foreign key (matched_item_id) references public.items(id) on delete cascade;

-- No data cleanup is performed here. Deleting an individual item through the app/API
-- removes its linked rows by cascade; storage files are removed by the delete handler.

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'student')) default 'student',
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  )
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "users can read own role" on public.user_roles;
create policy "users can read own role" on public.user_roles for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admins manage roles" on public.user_roles;
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'akobirsaidov023@gmail.com'
on conflict (user_id) do update set role = excluded.role;

alter table public.items enable row level security;
drop policy if exists "authenticated users create reports" on public.items;
create policy "authenticated users create reports" on public.items for insert to authenticated with check (owner_user_id = (select auth.uid()));
drop policy if exists "public can view active reports" on public.items;
create policy "public can view active reports" on public.items for select to anon, authenticated using (owner_deleted_at is null and deleted_by_owner is not true);
drop policy if exists "owners and admins update reports" on public.items;
create policy "owners and admins update reports" on public.items for update to authenticated using (owner_user_id = (select auth.uid()) or public.is_admin()) with check (owner_user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "owners and admins delete reports" on public.items;
create policy "owners and admins delete reports" on public.items for delete to authenticated using (owner_user_id = (select auth.uid()) or public.is_admin());

alter table public.claims enable row level security;
alter table public.notifications enable row level security;
alter table public.item_matches enable row level security;
drop policy if exists "claimants and admins read claims" on public.claims;
create policy "claimants and admins read claims" on public.claims for select to authenticated using (claimant_user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "claimants create claims" on public.claims;
create policy "claimants create claims" on public.claims for insert to authenticated with check (claimant_user_id = (select auth.uid()));
drop policy if exists "admins manage claims" on public.claims;
create policy "admins manage claims" on public.claims for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "owners read notifications" on public.notifications;
create policy "owners read notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "owners update notifications" on public.notifications;
create policy "owners update notifications" on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "owners read matches" on public.item_matches;
create policy "owners read matches" on public.item_matches for select to authenticated using (exists (select 1 from public.items i where i.id = item_id and i.owner_user_id = (select auth.uid())) or exists (select 1 from public.items i where i.id = matched_item_id and i.owner_user_id = (select auth.uid())));

alter table storage.objects enable row level security;
drop policy if exists "authenticated upload own photos" on storage.objects;
create policy "authenticated upload own photos" on storage.objects for insert to authenticated with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "authenticated read item photos" on storage.objects;
create policy "authenticated read item photos" on storage.objects for select to authenticated using (bucket_id = 'item-photos');
drop policy if exists "owners delete photos" on storage.objects;
create policy "owners delete photos" on storage.objects for delete to authenticated using (bucket_id = 'item-photos' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));
-- New uploads must remain in the owner's folder; this makes direct API deletion owner-scoped too.

alter table public.profiles enable row level security;
drop policy if exists "profiles own row" on public.profiles;
create policy "profiles own row" on public.profiles for all to authenticated using (id = (select auth.uid()) or public.is_admin()) with check (id = (select auth.uid()) or public.is_admin());

commit;

-- Exact effect when run: creates/replaces idempotent role, admin-check, ownership,
-- cascade, and storage policies. It does not delete existing data. User accounts,
-- profiles, and auth identities are retained. Run this script in Supabase SQL Editor;
-- it is safe to run twice.
