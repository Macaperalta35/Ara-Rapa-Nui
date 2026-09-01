export type Package = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  duration_days: number;
  price_clp: number;
  max_participants: number | null;
  is_active: boolean;
  cover_image_url: string | null;
  gallery_urls: string[];
};

export type Experience = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price_clp: number;
  duration_hours: number | null;
  requires_date: boolean;
  is_active: boolean;
  cover_image_url: string | null;
  gallery_urls: string[];
};

export type ProductAudience = "tourist" | "resident";

export type Product = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price_clp: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  cover_image_url: string | null;
  gallery_urls: string[];
  audience: ProductAudience;
};

export type VehicleRental = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  vehicle_type: string;
  brand_model: string | null;
  capacity: number | null;
  transmission: string | null;
  price_clp_per_day: number;
  is_active: boolean;
  cover_image_url: string | null;
  gallery_urls: string[];
};

export type CatalogItemType = "package" | "experience" | "product" | "vehicle_rental";
