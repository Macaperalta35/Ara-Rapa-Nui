import { getApprovedReviews, averageRating } from "@/lib/supabase/reviews";
import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import type { ReviewTargetType } from "@/lib/types/review";

export async function ReviewsSection({
  targetType,
  targetId,
}: {
  targetType: ReviewTargetType;
  targetId: string;
}) {
  const reviews = await getApprovedReviews(targetType, targetId);
  const avg = averageRating(reviews);

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-volcanic">Reseñas</h2>
        {avg !== null && (
          <div className="flex items-center gap-2">
            <StarRating value={avg} />
            <span className="text-sm text-volcanic/60">
              {avg.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-volcanic/60">Todavía no hay reseñas — sé el primero.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-sand-dark bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-volcanic">{review.customer_name}</p>
                <StarRating value={review.rating} size={14} />
              </div>
              {review.comment && <p className="mt-1 text-sm text-volcanic/70">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <ReviewForm targetType={targetType} targetId={targetId} />
      </div>
    </section>
  );
}
