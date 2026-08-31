-- Ara Rapa Nui — initial schema
-- Run this in the Supabase SQL Editor (or via `supabase db push` if using the CLI).

create extension if not exists pgcrypto;

-- Admin profiles -------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Catalog ---------------------------------------------------------------

create table packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  duration_days int not null default 1,
  price_clp int not null,
  max_participants int,
  is_active boolean not null default true,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  price_clp int not null,
  duration_hours numeric,
  requires_date boolean not null default true,
  is_active boolean not null default true,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  price_clp int not null,
  stock int not null default 0,
  sku text,
  is_active boolean not null default true,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders ------------------------------------------------------------------

create type order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled', 'failed');
create type order_item_type as enum ('package', 'experience', 'product');

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  status order_status not null default 'pending',
  total_clp int not null,
  currency text not null default 'CLP',
  mp_preference_id text,
  mp_payment_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  item_type order_item_type not null,
  item_id uuid not null,
  name_snapshot text not null,
  unit_price_clp int not null,
  quantity int not null default 1,
  selected_date date,
  created_at timestamptz not null default now()
);

-- Special requests ("pedido especial") -------------------------------------

create type request_status as enum ('new', 'contacted', 'closed');

create table special_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  description text not null,
  preferred_date date,
  status request_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now()
);

-- Indexes -------------------------------------------------------------------

create index on packages (is_active);
create index on experiences (is_active);
create index on products (is_active);
create index on orders (status);
create index on order_items (order_id);
create index on special_requests (status);

-- updated_at triggers ---------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger packages_set_updated_at before update on packages
  for each row execute function set_updated_at();
create trigger experiences_set_updated_at before update on experiences
  for each row execute function set_updated_at();
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();
create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();
