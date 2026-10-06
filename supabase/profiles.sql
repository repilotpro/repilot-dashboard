-- Profiles table, indexes, and signup trigger.
-- Public signUp stores the name in raw_user_meta_data.full_name.
-- This trigger copies that name and defaults role to user.
-- Run once in the Supabase SQL editor.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'agent', 'user');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone_number text,
  role public.user_role default 'user' not null,
  is_verified boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create unique index if not exists idx_profiles_email on public.profiles (lower(email));
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_role_verified on public.profiles (role, is_verified);
create index if not exists idx_profiles_created_at_desc on public.profiles (created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_app_meta_data->>'role')::public.user_role, 'user'::public.user_role),
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_user_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and (old.email_confirmed_at is null or old.email_confirmed_at is distinct from new.email_confirmed_at) then
    update public.profiles
    set is_verified = true, updated_at = now()
    where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_verified on auth.users;
create trigger on_auth_user_verified
  after update of email_confirmed_at on auth.users
  for each row execute procedure public.handle_user_verification();

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);
