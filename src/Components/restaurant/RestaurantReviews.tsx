import { Star } from "lucide-react";

import { dummyReviews } from "../../assets/assets";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    visitedDate: string;
    createdAt: string;
}

export default function RestaurantReviews() {
    const reviews: Review[] = dummyReviews;

    return (
        <section className="space-y-8 pt-6 border-t border-outline-variant/10 text-left">

            {/* Heading */}
            <h3 className="font-display text-xl font-semibold text-primary">
                Guest Experiences
            </h3>

            {/* Reviews */}
            <div className="space-y-6">

                {/* No Reviews */}
                {reviews.length === 0 ? (
                    <p className="text-xs text-black/55 italic">
                        No reviews yet. Be the first to
                        share your experience!
                    </p>
                ) : (

                    /* Reviews List */
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className="pb-6 border-b border-outline-variant/10 last:border-b-0 space-y-2"
                        >

                            {/* User + Rating */}
                            <div className="flex items-center justify-between gap-4">

                                {/* User */}
                                <div>
                                    <h4 className="text-sm font-medium text-primary">
                                        {review.userName}
                                    </h4>

                                    <span className="text-xs text-black/55">
                                        Visited{" "}
                                        {new Date(
                                            review.visitedDate
                                        ).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>

                                {/* Rating Stars */}
                                <div
                                    className="flex items-center gap-0.5 text-secondary"
                                    aria-label={`Rating: ${review.rating} out of 5`}
                                >
                                    {Array.from(
                                        { length: 5 },
                                        (_, index) => {
                                            const filled =
                                                index <
                                                review.rating;

                                            return (
                                                <Star
                                                    key={index}
                                                    size={12}
                                                    fill={
                                                        filled
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                    className={
                                                        filled
                                                            ? ""
                                                            : "text-outline-variant"
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* Comment */}
                            <p className="text-xs text-black/55 max-w-lg leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}