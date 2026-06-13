-- Sync existing auth.users to public.users table
insert into public.users (id, email, password_hash, full_name, avatar_url, email_verified, created_at)
select 
  au.id,
  au.email,
  coalesce(au.encrypted_password, ''),
  coalesce(au.raw_user_meta_data->>'full_name', ''),
  coalesce(au.raw_user_meta_data->>'avatar_url', ''),
  (au.email_confirmed_at is not null),
  au.created_at
from auth.users au
where not exists (
  select 1 from public.users pu where pu.id = au.id
);
