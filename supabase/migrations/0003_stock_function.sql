-- Atomic stock decrement, used by the checkout Server Action (via the
-- service-role client) to avoid overselling when two orders race for the
-- same product.
create or replace function decrement_stock(p_product_id uuid, p_qty int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected int;
begin
  update products set stock = stock - p_qty
  where id = p_product_id and stock >= p_qty;
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;
