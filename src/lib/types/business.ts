export type BusinessStatus = "pending" | "approved" | "rejected";

export type BusinessCategory =
  | "tour"
  | "restaurant"
  | "lodging"
  | "shop"
  | "transport"
  | "other";

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  hours: string | null;
  cover_image_url: string | null;
  contact_email: string;
  status: BusinessStatus;
  admin_notes: string | null;
  created_at: string;
};

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string }[] = [
  { value: "tour", label: "Tours y excursiones" },
  { value: "restaurant", label: "Restaurantes y comida" },
  { value: "lodging", label: "Alojamiento" },
  { value: "shop", label: "Tienda / artesanía" },
  { value: "transport", label: "Transporte" },
  { value: "other", label: "Otro" },
];
