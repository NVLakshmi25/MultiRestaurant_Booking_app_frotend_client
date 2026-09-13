import {
    MapPin,
    Clock,
    Utensils,
    ChefHat,
} from "lucide-react";

import type { Restaurant } from "../../types";

interface RestaurantInfoProps {
    restaurant: Restaurant | null;
}

export default function RestaurantInfo({
    restaurant,
}: RestaurantInfoProps) {
    if (!restaurant) {
        return null;
    }

    return (
        <div className="space-y-12 text-left">

            {/* =========================
                INFO RIBBON
            ========================== */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-outline-variant/10">

                {/* Chef */}
                <div className="text-center border-r border-outline-variant/10 px-2">
                    <ChefHat
                        className="text-secondary mx-auto mb-2"
                        size={20}
                    />

                    <span className="block text-[9px] tracking-wider text-black/55 uppercase">
                        CHEF
                    </span>

                    <span className="text-xs text-primary mt-1 block">
                        {restaurant.chef}
                    </span>
                </div>

                {/* Cuisine */}
                <div className="text-center border-r border-outline-variant/10 px-2">
                    <Utensils
                        className="text-secondary mx-auto mb-2"
                        size={20}
                    />

                    <span className="block text-[9px] tracking-wider text-black/55 uppercase">
                        CUISINE
                    </span>

                    <span className="text-xs text-primary mt-1 block">
                        {restaurant.cuisine}
                    </span>
                </div>

                {/* Opening */}
                <div className="text-center px-2">
                    <Clock
                        className="text-secondary mx-auto mb-2"
                        size={20}
                    />

                    <span className="block text-[9px] tracking-wider text-black/55 uppercase">
                        OPENING
                    </span>

                    <span className="text-xs text-primary mt-1 block">
                        5:00 PM - 11:00 PM
                    </span>
                </div>
            </div>

            {/* =========================
                ABOUT
            ========================== */}
            <section className="space-y-4">

                <h3 className="font-display text-xl font-semibold text-primary">
                    About the Dining Room
                </h3>

                <p className="text-sm text-black/55 leading-relaxed">
                    {restaurant.description}
                </p>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-black/55 pt-2">
                    <MapPin
                        size={16}
                        className="text-secondary shrink-0 mt-0.5"
                    />

                    <span>
                        {restaurant.address}
                    </span>
                </div>

                {/* Tags */}
                {restaurant.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {restaurant.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1.5 bg-surface-container-low text-[10px] tracking-wider uppercase text-black/55 border border-outline-variant/20 rounded-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}