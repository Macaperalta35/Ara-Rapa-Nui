-- Ara Rapa Nui — site settings (theme colors + category visibility)
-- Single-row table controlling the whole site's look and which nav
-- categories are shown, editable from /admin/apariencia.

create table site_settings (
  id int primary key default 1,
  color_volcanic text not null default '#211d16',
  color_volcanic_light text not null default '#3a332a',
  color_ocean text not null default '#0f7a80',
  color_ocean_light text not null default '#14a5a8',
  color_terracotta text not null default '#b3543a',
  color_terracotta_light text not null default '#c97854',
  color_sunset text not null default '#e8792e',
  color_sand text not null default '#f5efe0',
  color_sand_dark text not null default '#e8dcc4',
  color_hibiscus text not null default '#d94f70',
  color_hibiscus_light text not null default '#ef7d97',
  color_palm text not null default '#3f7a53',
  color_background text not null default '#faf6ee',
  color_foreground text not null default '#211d16',
  show_packages boolean not null default true,
  show_experiences boolean not null default true,
  show_products boolean not null default true,
  show_vehicle_rentals boolean not null default true,
  show_resident_products boolean not null default true,
  show_businesses boolean not null default true,
  show_special_request boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

create trigger site_settings_set_updated_at before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "site_settings_public_select" on site_settings
  for select using (true);
create policy "site_settings_admin_write" on site_settings
  for update using (is_admin()) with check (is_admin());
