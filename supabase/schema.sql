create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'pending'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can manage all profiles"
on public.profiles
for all
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
));

create policy "Approved users can view posts"
on public.posts
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.status = 'approved'
  )
);

create policy "Approved users can create posts"
on public.posts
for insert
with check (
  author_id = auth.uid() and
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.status = 'approved'
  )
);

create policy "Users can update their own posts"
on public.posts
for update
using (author_id = auth.uid());

create policy "Users can delete their own posts"
on public.posts
for delete
using (author_id = auth.uid());
