-- Ara Rapa Nui — business directory ("publicación de empresas")
-- Public submission form -> admin approval -> public directory listing.
-- Run after 0001-0004.

create type business_status as enum ('pending', 'approved', 'rejected');

create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- e.g. 'tour', 'restaurant', 'lodging', 'shop', 'transport', 'other'
  description text not null,
  phone text,
  whatsapp text,
  location text, -- free-text sector/address, e.g. "Hanga Roa centro"
  website_url text,
  instagram_url text,
  facebook_url text,
  hours text, -- free-text, e.g. "Lun-Sáb 9:00-19:00"
  cover_image_url text,
  contact_email text not null, -- not shown publicly, used to reach the submitter
  status business_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on businesses (status);
create index on businesses (category);

create trigger businesses_set_updated_at before update on businesses
  for each row execute function set_updated_at();

alter table businesses enable row level security;

-- Public can only see approved listings; admins see everything.
create policy "businesses_public_select" on businesses
  for select using (status = 'approved' or is_admin());

-- No public insert policy — submissions go through the service-role
-- client (see submitBusiness action), same pattern as special_requests.
create policy "businesses_admin_update" on businesses
  for update using (is_admin()) with check (is_admin());
create policy "businesses_admin_delete" on businesses
  for delete using (is_admin());
