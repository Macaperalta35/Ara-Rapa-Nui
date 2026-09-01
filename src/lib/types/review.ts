export type ReviewTargetType = "package" | "experience" | "product" | "vehicle_rental" | "business";
export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  target_type: ReviewTargetType;
  target_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  created_at: string;
};
