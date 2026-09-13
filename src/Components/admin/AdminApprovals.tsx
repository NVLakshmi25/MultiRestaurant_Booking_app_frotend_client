import { Link } from "react-router-dom";

import {
    CheckCircle,
    Utensils,
    MapPin,
    Users,
} from "lucide-react";

import type { Restaurant } from "../../types";

interface AdminApprovalsProps {
    restaurants: Restaurant[];

    onStatusChange: (
        restaurantId: string,
        status: "approved" | "rejected"
    ) => Promise<void>;

    loadingId: string | null;
}

export default function AdminApprovals({
    restaurants,
    onStatusChange,
    loadingId,
}: AdminApprovalsProps) {
    /* ----------------------------------------
       Separate Pending / Processed Restaurants
    ----------------------------------------- */

    const pendingRestaurants =
        restaurants.filter(
            (restaurant) =>
                restaurant.status === "pending"
        );

    const otherRestaurants =
        restaurants.filter(
            (restaurant) =>
                restaurant.status ===
                    "approved" ||
                restaurant.status ===
                    "rejected"
        );

    /* ----------------------------------------
       Render
    ----------------------------------------- */

    return (
        <div className="space-y-8 text-left">
            {/* --------------------------------
                Pending Restaurants
            --------------------------------- */}

            <div className="space-y-4">
                <h3 className="font-display text-lg font-medium text-primary flex items-center gap-2">
                    Pending Registration Requests (
                    {pendingRestaurants.length})
                </h3>

                {pendingRestaurants.length ===
                0 ? (
                    <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                        <CheckCircle
                            size={32}
                            className="mx-auto text-green-600 mb-2"
                        />

                        <p className="text-xs text-black/55 italic">
                            All restaurant
                            registrations have
                            been processed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRestaurants.map(
                            (restaurant) => (
                                <div
                                    key={
                                        restaurant._id
                                    }
                                    className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                >
                                    {/* Restaurant Information */}

                                    <div className="space-y-1.5 flex-1">
                                        <h4 className="font-display text-base font-medium text-primary">
                                            {
                                                restaurant.name
                                            }
                                        </h4>

                                        <p className="text-xs text-black/55 leading-relaxed">
                                            {
                                                restaurant.description
                                            }
                                        </p>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-black/50 pt-2">
                                            {/* Cuisine */}

                                            <span className="flex items-center gap-1">
                                                <Utensils
                                                    size={
                                                        12
                                                    }
                                                />

                                                {
                                                    restaurant.cuisine
                                                }
                                            </span>

                                            {/* Address */}

                                            <span className="flex items-center gap-1">
                                                <MapPin
                                                    size={
                                                        12
                                                    }
                                                />

                                                {
                                                    restaurant.address
                                                }
                                            </span>

                                            {/* Capacity */}

                                            <span className="flex items-center gap-1">
                                                <Users
                                                    size={
                                                        12
                                                    }
                                                />

                                                Capacity:{" "}
                                                {
                                                    restaurant.totalSeats
                                                }{" "}
                                                seats
                                            </span>
                                        </div>

                                        {/* Owner */}

                                        <p className="text-[10px] text-secondary font-medium tracking-wide uppercase pt-1">
                                            Owner ID:{" "}
                                            {typeof restaurant.owner ===
                                            "object"
                                                ? restaurant
                                                      .owner
                                                      ?._id
                                                : restaurant.owner}
                                        </p>
                                    </div>

                                    {/* Actions */}

                                    <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                                        {/* Approve */}

                                        <button
                                            type="button"
                                            disabled={
                                                loadingId ===
                                                restaurant._id
                                            }
                                            onClick={() =>
                                                void onStatusChange(
                                                    restaurant._id,
                                                    "approved"
                                                )
                                            }
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingId ===
                                            restaurant._id
                                                ? "Updating..."
                                                : "Approve"}
                                        </button>

                                        {/* Reject */}

                                        <button
                                            type="button"
                                            disabled={
                                                loadingId ===
                                                restaurant._id
                                            }
                                            onClick={() =>
                                                void onStatusChange(
                                                    restaurant._id,
                                                    "rejected"
                                                )
                                            }
                                            className="px-4 py-2 bg-error hover:bg-error/85 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingId ===
                                            restaurant._id
                                                ? "Updating..."
                                                : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* --------------------------------
                Existing Restaurants
            --------------------------------- */}

            <div className="space-y-4">
                <h3 className="font-display text-lg font-medium text-primary">
                    Registered Establishments (
                    {otherRestaurants.length})
                </h3>

                {otherRestaurants.length ===
                0 ? (
                    <p className="text-xs text-black/40 italic">
                        No approved or rejected
                        restaurant records.
                    </p>
                ) : (
                    <div className="bg-white border border-outline-variant/20 rounded-md overflow-x-auto shadow-sm">
                        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-medium tracking-wider text-black/55 uppercase">
                                    <th className="p-4">
                                        Establishment
                                    </th>

                                    <th className="p-4">
                                        Cuisine & City
                                    </th>

                                    <th className="p-4">
                                        Owner Account
                                    </th>

                                    <th className="p-4 text-right">
                                        Status /
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-outline-variant/10">
                                {otherRestaurants.map(
                                    (
                                        restaurant
                                    ) => (
                                        <tr
                                            key={
                                                restaurant._id
                                            }
                                            className="hover:bg-surface/50"
                                        >
                                            {/* Establishment */}

                                            <td className="p-4 font-medium text-primary">
                                                <Link
                                                    to={`/restaurant/${restaurant.slug}`}
                                                    className="hover:text-secondary"
                                                >
                                                    {
                                                        restaurant.name
                                                    }
                                                </Link>
                                            </td>

                                            {/* Cuisine / Location */}

                                            <td className="p-4">
                                                {
                                                    restaurant.cuisine
                                                }{" "}
                                                •{" "}
                                                {
                                                    restaurant.location
                                                }
                                            </td>

                                            {/* Owner */}

                                            <td className="p-4 text-black/55">
                                                {typeof restaurant.owner ===
                                                "object"
                                                    ? restaurant
                                                          .owner
                                                          ?._id
                                                    : restaurant.owner}
                                            </td>

                                            {/* Status / Actions */}

                                            <td className="p-4 text-right">
                                                <span
                                                    className={`inline-block py-0.5 px-2 text-[9px] font-medium tracking-wider uppercase rounded-sm ${
                                                        restaurant.status ===
                                                        "approved"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-error-container text-on-error-container"
                                                    }`}
                                                >
                                                    {
                                                        restaurant.status
                                                    }
                                                </span>

                                                {restaurant.status ===
                                                "approved" ? (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loadingId ===
                                                            restaurant._id
                                                        }
                                                        onClick={() =>
                                                            void onStatusChange(
                                                                restaurant._id,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="ml-3 text-error hover:underline text-[10px] uppercase font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loadingId ===
                                                        restaurant._id
                                                            ? "Updating..."
                                                            : "Suspend"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loadingId ===
                                                            restaurant._id
                                                        }
                                                        onClick={() =>
                                                            void onStatusChange(
                                                                restaurant._id,
                                                                "approved"
                                                            )
                                                        }
                                                        className="ml-3 text-green-600 hover:underline text-[10px] uppercase font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loadingId ===
                                                        restaurant._id
                                                            ? "Updating..."
                                                            : "Re-Approve"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}