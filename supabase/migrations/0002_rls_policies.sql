-- Ara Rapa Nui — Row Level Security policies
-- Run after 0001_init_schema.sql.

alter table profiles enable row level security;
alter table packages enable row level security;
alter table experiences enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table special_requests enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid());
$$ language sql stable security definer set search_path = public;

-- profiles: a user can read their own row; admins can read all
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());

-- Catalog: public read of active rows, admin-only write
create policy "packages_public_select" on packages
  for select using (is_active or is_admin());
create policy "packages_admin_write" on packages
  for all using (is_admin()) with check (is_admin());

create policy "experiences_public_select" on experiences
  for select using (is_active or is_admin());
create policy "experiences_admin_write" on experiences
  for all using (is_admin()) with check (is_admin());

create policy "products_public_select" on products
  for select using (is_active or is_admin());
create policy "products_admin_write" on products
  for all using (is_admin()) with check (is_admin());

-- Orders / order_items / special_requests: no public insert policy.
-- All writes happen server-side via the service role key (bypasses RLS),
-- so the app can revalidate price/stock before charging. Only admins can
-- read/update through the normal (anon/authenticated) client.
create policy "orders_admin_select" on orders
  for select using (is_admin());
create policy "orders_admin_update" on orders
  for update using (is_admin()) with check (is_admin());

create policy "order_items_admin_select" on order_items
  for select using (is_admin());

create policy "special_requests_admin_select" on special_requests
  for select using (is_admin());
create policy "special_requests_admin_update" on special_requests
  for update using (is_admin()) with check (is_admin());
