import { createClient } from "@/lib/supabase/server";
import { updateReviewStatus } from "@/lib/actions/reviews";
import { StarRating } from "@/components/reviews/StarRating";
import type { ReviewStatus, ReviewTargetType } from "@/lib/types/review";

const TARGET_LABEL: Record<ReviewTargetType, string> = {
  package: "Paquete",
  experience: "Experiencia",
  product: "Producto",
  vehicle_rental: "Vehículo",
  business: "Empresa",
};

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Reseñas</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        Solo las reseñas aprobadas se muestran públicamente.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {(reviews ?? []).map((review) => (
          <li key={review.id} className="rounded-2xl border border-sand-dark bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-volcanic">{review.customer_name}</p>
                <p className="text-xs text-volcanic/50">
                  {TARGET_LABEL[review.target_type as ReviewTargetType]} · {review.customer_email}
                </p>
              </div>
              <StarRating value={review.rating} size={14} />
            </div>
            {review.comment && <p className="mt-2 text-sm text-volcanic/70">{review.comment}</p>}

            <div className="mt-3 flex items-center gap-3">
              {(["pending", "approved", "rejected"] as ReviewStatus[]).map((status) => (
                <form
                  key={status}
                  action={updateReviewStatus.bind(null, review.id, status, review.target_type)}
                >
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      review.status === status
                        ? "bg-terracotta text-white"
                        : "bg-sand text-volcanic/70 hover:bg-sand-dark"
                    }`}
                  >
                    {status === "pending" ? "Pendiente" : status === "approved" ? "Aprobar" : "Rechazar"}
                  </button>
                </form>
              ))}
            </div>
          </li>
        ))}
        {(reviews ?? []).length === 0 && <p className="text-volcanic/50">Sin reseñas todavía.</p>}
      </ul>
    </div>
  );
}
