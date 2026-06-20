-- Add subscription tier fields to users table
alter table public.users 
add column if not exists subscription_tier varchar(20) default 'free' check (subscription_tier in ('free', 'pro')),
add column if not exists csv_upload_count integer default 0,
add column if not exists csv_upload_limit integer default 3,
add column if not exists subscription_started_at timestamptz,
add column if not exists subscription_expires_at timestamptz;

-- Create index for subscription queries
create index if not exists idx_users_subscription_tier on public.users(subscription_tier);

-- Update existing users to have free tier with 3 file limit
update public.users 
set subscription_tier = 'free', 
    csv_upload_limit = 3,
    csv_upload_count = 0
where subscription_tier is null;

-- Function to check if user can upload more files
create or replace function public.can_upload_csv(user_uuid uuid)
returns boolean as $$
declare
  user_tier varchar(20);
  upload_count integer;
  upload_limit integer;
begin
  select subscription_tier, csv_upload_count, csv_upload_limit
  into user_tier, upload_count, upload_limit
  from public.users
  where id = user_uuid;
  
  -- Pro users have unlimited uploads
  if user_tier = 'pro' then
    return true;
  end if;
  
  -- Free users check against limit
  return upload_count < upload_limit;
end;
$$ language plpgsql security definer;

-- Function to increment upload count (only increments, never decrements)
create or replace function public.increment_csv_upload_count(user_uuid uuid)
returns void as $$
begin
  update public.users
  set csv_upload_count = csv_upload_count + 1,
      updated_at = now()
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- Trigger to auto-increment count when CSV file is uploaded
create or replace function public.handle_csv_upload()
returns trigger as $$
begin
  perform public.increment_csv_upload_count(new.user_id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_csv_file_uploaded
  after insert on public.csv_files
  for each row execute procedure public.handle_csv_upload();

-- Initialize upload counts for existing users based on their current files
update public.users u
set csv_upload_count = (
  select count(*) 
  from public.csv_files cf 
  where cf.user_id = u.id
)
where exists (
  select 1 
  from public.csv_files cf 
  where cf.user_id = u.id
);
