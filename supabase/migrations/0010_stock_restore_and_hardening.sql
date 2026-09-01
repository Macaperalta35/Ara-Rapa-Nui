-- Ara Rapa Nui — self-audit fixes: stock restoration + tighter image types
-- See conversation: checkout could permanently lose stock on a mid-flow
-- failure (payment preference error, partial multi-item failure) with no
-- way to give it back. This adds the atomic counterpart to decrement_stock.

create or replace function increment_stock(p_product_id uuid, p_qty int)
returns void
language sql
security definer
set search_path = public
as $$
  update products set stock = stock + p_qty where id = p_product_id;
$$;
