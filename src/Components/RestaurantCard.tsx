import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon, Star } from "lucide-react";

import type { Restaurant } from "../assets/assets";

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export default function RestaurantCard({
    restaurant,
}: RestaurantCardProps) {
    const navigate = useNavigate();

    const handleSlotClick = (
        event: MouseEvent<HTMLButtonElement>,
        slot: string
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const today = new Date();

        const date = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0"),
        ].join("-");

        navigate(
            `/booking/${restaurant.slug}?slot=${encodeURIComponent(
                slot
            )}&date=${date}&guests=2`
        );
    };

    const futureSlots = restaurant.availableSlots
        .filter((slot) => {
            const [hour, minute] = slot.split(":").map(Number);

            const now = new Date();
            const slotTime = new Date();

            slotTime.setHours(hour, minute, 0, 0);

            return slotTime.getTime() > now.getTime();
        })
        .slice(0, 3);

    return (
        <article className="group relative bg-white border border-outline-variant/10 overflow-hidden rounded-md flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            <Link
                to={`/restaurant/${restaurant.slug}`}
                className="relative h-60 overflow-hidden block"
            >
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {restaurant.exclusive && (
                        <span className="text-[9px] font-medium tracking-widest text-white bg-secondary py-1 px-2.5 uppercase">
                            Exclusive
                        </span>
                    )}

                    {restaurant.featured && (
                        <span className="text-[9px] font-medium tracking-widest text-white bg-primary py-1 px-2.5 uppercase">
                            Recommended
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-medium text-secondary tracking-widest uppercase">
                            {restaurant.cuisine}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-black/55">
                                {restaurant.priceRange}
                            </span>

                            <span className="text-black/30 text-xs">
                                •
                            </span>

                            <div className="flex items-center gap-0.5 text-secondary">
                                <Star
                                    size={12}
                                    fill="currentColor"
                                />

                                <span className="text-xs font-medium text-primary">
                                    {restaurant.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to={`/restaurant/${restaurant.slug}`}
                        className="block mb-2"
                    >
                        <h3 className="font-display text-lg font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                            {restaurant.name}
                        </h3>
                    </Link>

                    <p className="text-xs text-black/55 mb-4 flex items-center gap-1">
                        <MapPinIcon
                            size={14}
                            className="text-black/70"
                        />

                        {restaurant.location}
                    </p>

                    <p className="text-[11px] text-black/45 line-clamp-2">
                        {restaurant.description}
                    </p>
                </div>

                {/* Slots */}
                <div>
                    <div className="border-t border-outline-variant/10 my-4" />

                    <span className="block text-[9px] font-medium text-black/55 tracking-wider uppercase mb-2">
                        Quick Reservation
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                        {futureSlots.map((slot) => (
                            <button
                                type="button"
                                key={slot}
                                onClick={(event) =>
                                    handleSlotClick(event, slot)
                                }
                                className="text-[10px] font-medium border border-outline-variant/60 hover:border-primary px-3 py-1.5 transition-colors cursor-pointer text-black/55 hover:text-primary bg-surface"
                            >
                                {slot}
                            </button>
                        ))}

                        <Link
                            to={`/restaurant/${restaurant.slug}`}
                            className="text-[10px] font-medium border border-outline-variant/20 px-3 py-1.5 text-secondary hover:bg-secondary hover:text-white transition-colors"
                        >
                            ALL SLOTS
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}