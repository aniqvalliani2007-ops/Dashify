-- Create storage bucket for CSV files
insert into storage.buckets (id, name, public)
values ('csv_files', 'csv_files', false)
on conflict (id) do nothing;

-- Storage policies for csv_files bucket
create policy "Users can upload their own CSV files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'csv_files' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own CSV files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'csv_files' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own CSV files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'csv_files' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own CSV files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'csv_files' and
  (storage.foldername(name))[1] = auth.uid()::text
);
