create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create policy "Users view own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create table public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  created_at timestamptz not null default now()
);
grant select, insert on public.admin_requests to authenticated;
grant all on public.admin_requests to service_role;
alter table public.admin_requests enable row level security;

create policy "Users request admin for themselves"
on public.admin_requests for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users view own request"
on public.admin_requests for select to authenticated
using (auth.uid() = user_id);

create policy "Admins view all requests"
on public.admin_requests for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins view all profiles"
on public.profiles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.approve_admin(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'not authorized';
  end if;
  insert into public.user_roles (user_id, role) values (_user_id, 'admin') on conflict do nothing;
  delete from public.admin_requests where user_id = _user_id;
end;
$$;

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'akobirsaidov023@gmail.com'
on conflict do nothing;

create or replace function public.grant_bootstrap_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'akobirsaidov023@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_bootstrap_admin
  after insert on auth.users
  for each row execute function public.grant_bootstrap_admin();