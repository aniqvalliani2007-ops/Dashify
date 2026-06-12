-- Enable pgcrypto extension for crypt functions if needed
create extension if not exists pgcrypto;

-- Users table (replaces profiles, synchronizes with Supabase Auth)
create table if not exists public.users (
    id uuid primary key references auth.users on delete cascade,
    email varchar(255) unique not null,
    password_hash text, -- Optional: populated if doing custom credentials, or synced from auth.users
    full_name varchar(255),
    avatar_url text,
    email_verified boolean default false,
    verification_token uuid default gen_random_uuid(),
    reset_token uuid,
    reset_token_expires timestamptz,
    is_active boolean default true,
    last_login_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- User sessions table
create table if not exists public.sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    session_token uuid default gen_random_uuid() unique,
    ip_address inet,
    user_agent text,
    expires_at timestamptz not null default (now() + interval '7 days'),
    created_at timestamptz default now(),
    revoked_at timestamptz
);

-- Login attempts tracking
create table if not exists public.login_attempts (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null,
    ip_address inet,
    success boolean default false,
    attempted_at timestamptz default now()
);

-- Indexes for Auth Tables
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_verification_token on public.users(verification_token);
create index if not exists idx_users_reset_token on public.users(reset_token);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_session_token on public.sessions(session_token);
create index if not exists idx_login_attempts_email on public.login_attempts(email);

-- Enable RLS
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.login_attempts enable row level security;

-- Trigger to sync auth.users with public.users on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, password_hash, full_name, avatar_url, email_verified)
  values (
    new.id,
    new.email,
    coalesce(new.encrypted_password, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    (new.email_confirmed_at is not null)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to sync updates from auth.users (like email_confirmed_at or email updates)
create or replace function public.handle_update_user()
returns trigger as $$
begin
  update public.users
  set 
    email = new.email,
    email_verified = (new.email_confirmed_at is not null),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_update_user();
