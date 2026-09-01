-- Ara Rapa Nui — referral credit: award + atomic redemption
-- A customer's referral_code is shared; when someone they referred makes
-- their first paid order, the referrer earns credit_clp. That credit can
-- be redeemed at checkout, atomically, the same way decrement_stock works.

alter table site_settings add column if not exists referral_reward_clp int not null default 5000;
alter table customers add column if not exists referral_reward_given boolean not null default false;
alter table orders add column if not exists credit_applied_clp int not null default 0;

create or replace function redeem_credit(p_customer_id uuid, p_amount int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected int;
begin
  if p_amount <= 0 then
    return true;
  end if;
  update customers set credit_clp = credit_clp - p_amount
  where id = p_customer_id and credit_clp >= p_amount;
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

create or replace function add_credit(p_customer_id uuid, p_amount int)
returns void
language sql
security definer
set search_path = public
as $$
  update customers set credit_clp = credit_clp + p_amount where id = p_customer_id;
$$;
