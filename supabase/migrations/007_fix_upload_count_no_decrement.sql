-- Remove the old delete trigger and function that was decrementing the count
drop trigger if exists on_csv_file_deleted on public.csv_files;
drop function if exists public.handle_csv_delete();
drop function if exists public.decrement_csv_upload_count(uuid);

-- Ensure only the upload trigger exists (this recreates it to be safe)
drop trigger if exists on_csv_file_uploaded on public.csv_files;
drop function if exists public.handle_csv_upload();
drop function if exists public.increment_csv_upload_count(uuid);

-- Recreate the increment function (only increments, never decrements)
create or replace function public.increment_csv_upload_count(user_uuid uuid)
returns void as $$
begin
  update public.users
  set csv_upload_count = csv_upload_count + 1,
      updated_at = now()
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- Recreate the upload trigger
create or replace function public.handle_csv_upload()
returns trigger as $$
begin
  perform public.increment_csv_upload_count(new.user_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_csv_file_uploaded
  after insert on public.csv_files
  for each row execute procedure public.handle_csv_upload();

-- Important: Verify no delete trigger exists
do $$
begin
  if exists (
    select 1 from pg_trigger 
    where tgname = 'on_csv_file_deleted'
  ) then
    raise notice 'WARNING: Delete trigger still exists and was not removed!';
  else
    raise notice 'SUCCESS: Delete trigger has been removed. Upload count will no longer decrement on file deletion.';
  end if;
end $$;
