-- Ara Rapa Nui — superadmin role
-- Allows a 'superadmin' role that can create and manage other admin
-- accounts from the panel, on top of the existing 'admin' role.

alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('admin', 'superadmin'));

-- Promote your own account to superadmin (replace with your email):
-- update profiles set role = 'superadmin' where email = 'tu@email.com';
