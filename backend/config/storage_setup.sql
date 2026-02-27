-- Create a new storage bucket for car images
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true);

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'car-images' );

-- Allow authenticated users (admins) to upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'car-images' and auth.role() = 'authenticated' );

-- Allow authenticated users to update/delete their images (optional, good for management)
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'car-images' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'car-images' and auth.role() = 'authenticated' );
