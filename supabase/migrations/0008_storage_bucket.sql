-- Ara Rapa Nui — public storage bucket for uploaded photos
-- Uploads always go through server actions using the service-role client
-- (see uploadAdminImage/uploadPublicImage), so no Storage RLS policies
-- are needed here — same "service role writes, everything else read-only"
-- pattern used for orders/special_requests/businesses.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;
