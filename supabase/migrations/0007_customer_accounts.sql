-- Ara Rapa Nui — customer accounts (registration/login + order history)
-- Separate from the admin `profiles` table: every Supabase Auth user gets
-- a `customers` row via trigger, but only accounts explicitly added to
-- `profiles` (via /admin/administradores) get admin/superadmin access.

create table customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table customers enable row level security;

create policy "customers_select_own" on customers
  for select using (id = auth.uid());
create policy "customers_update_own" on customers
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Auto-create a customer row for every new auth user (registration or
-- admin-created accounts alike — harmless for admin accounts, which just
-- won't use it). Reads name/phone passed as signUp() metadata.
create or replace function handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into customers (id, email, name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_customer();

-- Link orders to the customer account that placed them (guest checkout
-- still works — this stays null for guests).
alter table orders add column if not exists customer_id uuid references auth.users(id);
create index if not exists orders_customer_id_idx on orders (customer_id);

create policy "orders_customer_select_own" on orders
  for select using (customer_id = auth.uid());

create policy "order_items_customer_select_own" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );
