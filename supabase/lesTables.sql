-- À exécuter dans Supabase > SQL Editor.
-- Ce script crée les tables uniquement si elles n'existent pas.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  is_admin boolean not null default false,
  photo_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists photo_url text,
  add column if not exists onboarding_completed boolean not null default false;

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
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Ces commandes évitent les erreurs si le script est exécuté plusieurs fois.
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Approved users can view posts" on public.posts;
create policy "Approved users can view posts"
on public.posts for select
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.status = 'approved'
));

drop policy if exists "Approved users can create posts" on public.posts;
create policy "Approved users can create posts"
on public.posts for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.status = 'approved'
  )
);
