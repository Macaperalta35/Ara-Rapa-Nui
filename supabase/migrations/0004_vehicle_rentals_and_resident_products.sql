-- Ara Rapa Nui — vehicle rentals + resident-only products
-- Run after 0001-0003.

-- Vehicle rentals ---------------------------------------------------------

create table vehicle_rentals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  vehicle_type text not null, -- e.g. 'car', 'suv', 'scooter', 'bike'
  brand_model text,
  capacity int,
  transmission text,
  price_clp_per_day int not null,
  is_active boolean not null default true,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on vehicle_rentals (is_active);

create trigger vehicle_rentals_set_updated_at before update on vehicle_rentals
  for each row execute function set_updated_at();

alter table vehicle_rentals enable row level security;

create policy "vehicle_rentals_public_select" on vehicle_rentals
  for select using (is_active or is_admin());
create policy "vehicle_rentals_admin_write" on vehicle_rentals
  for all using (is_admin()) with check (is_admin());

-- Order items: support the 'vehicle_rental' item type + a rental end date
alter type order_item_type add value if not exists 'vehicle_rental';
alter table order_items add column if not exists selected_end_date date;

-- Resident-only products: reuse the existing `products` table with an
-- audience flag, instead of duplicating the whole products schema.
alter table products
  add column if not exists audience text not null default 'tourist'
    check (audience in ('tourist', 'resident'));
