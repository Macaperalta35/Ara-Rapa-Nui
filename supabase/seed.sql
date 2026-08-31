-- Ara Rapa Nui — sample catalog data
-- Run this in the Supabase SQL Editor AFTER 0001, 0002 and 0003, once your
-- project is set up. Safe to run more than once (it clears existing rows
-- with these slugs first). Cover images are left blank on purpose — replace
-- cover_image_url with real photos whenever you have them; the site shows
-- a placeholder icon until then.

-- Packages ------------------------------------------------------------

insert into packages (slug, name_es, name_en, description_es, description_en, duration_days, price_clp, max_participants, is_active)
values
  (
    'isla-completa-3-dias',
    'Isla Completa 3 Días',
    'Full Island 3 Days',
    'Recorre lo esencial de Rapa Nui: el circuito de moai de Rano Raraku, la plataforma ceremonial de Ahu Tongariki y un atardecer en la playa de Anakena. Incluye guía local y transporte.',
    'Cover the essentials of Rapa Nui: the moai quarry at Rano Raraku, the ceremonial platform at Ahu Tongariki, and a sunset at Anakena beach. Includes local guide and transport.',
    3, 350000, 10, true
  ),
  (
    'rapa-nui-esencial-1-dia',
    'Rapa Nui Esencial 1 Día',
    'Rapa Nui Essentials 1 Day',
    'Un día para conocer el cráter ceremonial de Orongo y ver el atardecer en Ahu Tahai. Ideal si tienes poco tiempo en la isla.',
    'One day to see the ceremonial crater at Orongo and watch the sunset at Ahu Tahai. Perfect if you only have a short time on the island.',
    1, 90000, 12, true
  ),
  (
    'aventura-volcanica-2-dias',
    'Aventura Volcánica 2 Días',
    'Volcanic Adventure 2 Days',
    'Trekking al volcán Rano Kau y ascenso al Terevaka, el punto más alto de la isla, con vistas de 360°.',
    'Trekking to the Rano Kau volcano and a climb up Terevaka, the island''s highest point, with 360° views.',
    2, 180000, 8, true
  )
on conflict (slug) do nothing;

-- Experiences -----------------------------------------------------------

insert into experiences (slug, name_es, name_en, description_es, description_en, price_clp, duration_hours, requires_date, is_active)
values
  (
    'atardecer-ahu-tahai',
    'Atardecer en Ahu Tahai',
    'Sunset at Ahu Tahai',
    'Observa el atardecer junto a los moai de Ahu Tahai, acompañado de un guía local que comparte la historia del lugar.',
    'Watch the sunset next to the Ahu Tahai moai, accompanied by a local guide who shares the site''s history.',
    25000, 2, true, true
  ),
  (
    'buceo-anakena',
    'Buceo en Anakena',
    'Diving at Anakena',
    'Explora las aguas cristalinas de Anakena en una salida de buceo guiada, apta para principiantes.',
    'Explore the crystal-clear waters of Anakena on a guided dive, suitable for beginners.',
    60000, 3, true, true
  ),
  (
    'clase-tallado-madera',
    'Clase de Tallado en Madera',
    'Wood Carving Class',
    'Aprende de un artesano local a tallar tu propio moai en madera, siguiendo técnicas tradicionales.',
    'Learn from a local artisan how to carve your own wooden moai, following traditional techniques.',
    35000, 2.5, true, true
  ),
  (
    'noche-de-curanto',
    'Noche de Curanto',
    'Curanto Night',
    'Cena tradicional cocinada bajo tierra (curanto) acompañada de música y danza rapa nui.',
    'Traditional earth-oven feast (curanto) accompanied by Rapa Nui music and dance.',
    45000, 3, true, true
  )
on conflict (slug) do nothing;

-- Products ----------------------------------------------------------------

insert into products (slug, name_es, name_en, description_es, description_en, price_clp, stock, sku, is_active)
values
  (
    'moai-tallado-mano',
    'Moai de Madera Tallado a Mano',
    'Hand-Carved Wooden Moai',
    'Réplica de moai tallada a mano por artesanos locales en madera de toromiro.',
    'Hand-carved moai replica made by local artisans from toromiro wood.',
    45000, 15, 'RN-MOAI-01', true
  ),
  (
    'collar-concha-rapa-nui',
    'Collar de Concha Rapa Nui',
    'Rapa Nui Shell Necklace',
    'Collar artesanal hecho con conchas recolectadas en las costas de la isla.',
    'Handmade necklace made with shells collected from the island''s coastline.',
    18000, 30, 'RN-COLLAR-01', true
  ),
  (
    'miel-rapa-nui',
    'Miel de Rapa Nui',
    'Rapa Nui Honey',
    'Miel pura producida por apicultores locales en la isla.',
    'Pure honey produced by local beekeepers on the island.',
    12000, 40, 'RN-MIEL-01', true
  ),
  (
    'poncho-tradicional-tejido',
    'Poncho Tradicional Tejido',
    'Traditional Woven Poncho',
    'Poncho tejido a mano siguiendo patrones tradicionales rapa nui.',
    'Hand-woven poncho following traditional Rapa Nui patterns.',
    55000, 8, 'RN-PONCHO-01', true
  ),
  (
    'cafe-rapa-nui-250g',
    'Café de Rapa Nui — 250g',
    'Rapa Nui Coffee — 250g',
    'Café de grano cultivado y tostado en la isla, formato 250 gramos.',
    'Coffee grown and roasted on the island, 250 gram bag.',
    9000, 50, 'RN-CAFE-01', true
  )
on conflict (slug) do nothing;
