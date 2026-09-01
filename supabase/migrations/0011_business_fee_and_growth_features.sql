-- Ara Rapa Nui — business listing fee, reviews, and referrals

-- Business listing fee ------------------------------------------------

alter table businesses add column if not exists listing_fee_clp int not null default 0;
alter table businesses add column if not exists payment_status text not null default 'unpaid'
  check (payment_status in ('unpaid', 'paid'));
alter table businesses add column if not exists mp_preference_id text;
alter table businesses add column if not exists mp_payment_id text;

alter table site_settings add column if not exists business_listing_fee_clp int not null default 15000;

-- Reviews & ratings -----------------------------------------------------

create type review_target_type as enum ('package', 'experience', 'product', 'vehicle_rental', 'business');
create type review_status as enum ('pending', 'approved', 'rejected');

create table reviews (
  id uuid primary key default gen_random_uuid(),
  target_type review_target_type not null,
  target_id uuid not null,
  customer_name text not null,
  customer_email text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  status review_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index on reviews (target_type, target_id, status);

alter table reviews enable row level security;

create policy "reviews_public_select" on reviews
  for select using (status = 'approved' or is_admin());
create policy "reviews_admin_write" on reviews
  for update using (is_admin()) with check (is_admin());
create policy "reviews_admin_delete" on reviews
  for delete using (is_admin());
-- No public insert policy — submissions go through a server action using
-- the service-role client, same pattern as special_requests/businesses.

-- Referral program --------------------------------------------------------

alter table customers add column if not exists referral_code text unique;
alter table customers add column if not exists referred_by_code text;
alter table customers add column if not exists credit_clp int not null default 0;

alter table orders add column if not exists referral_code_used text;
alter table orders add column if not exists referral_credit_awarded boolean not null default false;

-- Backfill a referral code for any customers created before this migration.
update customers set referral_code = substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
where referral_code is null;

-- Extend the signup trigger (from 0007) to also generate a referral code
-- and capture who referred this new customer, if any.
create or replace function handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into customers (id, email, name, phone, referral_code, referred_by_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    nullif(new.raw_user_meta_data->>'referred_by_code', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
