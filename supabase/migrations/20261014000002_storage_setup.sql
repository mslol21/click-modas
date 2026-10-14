-- ==============================================================================
-- CLICK MODAS 25 - STORAGE SETUP 20261014000002_storage_setup.sql
-- ==============================================================================

-- Create buckets for products and banners
insert into storage.buckets (id, name, public)
values 
    ('products', 'products', true),
    ('banners', 'banners', true)
on conflict (id) do update set public = true;

-- Storage policies: Public can read
create policy "Public Access to Product Images"
on storage.objects for select
using (bucket_id in ('products', 'banners'));

-- Admins can upload, update, and delete
create policy "Admin Upload Images"
on storage.objects for insert
with check (
    bucket_id in ('products', 'banners')
    and (public.is_admin(auth.uid()) or auth.role() = 'service_role')
);

create policy "Admin Update Images"
on storage.objects for update
using (
    bucket_id in ('products', 'banners')
    and (public.is_admin(auth.uid()) or auth.role() = 'service_role')
);

create policy "Admin Delete Images"
on storage.objects for delete
using (
    bucket_id in ('products', 'banners')
    and (public.is_admin(auth.uid()) or auth.role() = 'service_role')
);
