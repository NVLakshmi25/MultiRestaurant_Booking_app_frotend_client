import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Check,
    MapPin,
    Search as SearchIcon,
    SearchXIcon,
    SlidersHorizontal,
    X,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import RestaurantCard from "../Components/RestaurantCard";
import AuthModal from "../Components/AuthModal";

import api from "../lib/api";
import toast from "react-hot-toast";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const searchValue = searchParams.get("search") ?? "";
    const locationValue = searchParams.get("location") ?? "";
    const selectedCuisines = searchParams.getAll("cuisine");
    const selectedPrices = searchParams.getAll("priceRange");
    const sortValue = searchParams.get("sort") ?? "";

    const [tempSearch, setTempSearch] = useState(searchValue);
    const [tempLocation, setTempLocation] = useState(locationValue);

    const priceOptions = ["$", "$$", "$$$", "$$$$"];

    const cuisineOptions = [
        "Italian",
        "French",
        "Japanese",
        "Steakhouse",
        "Vegetarian",
    ];

    /*
     * Keep input fields synchronized with URL.
     */
    useEffect(() => {
        setTempSearch(searchValue);
        setTempLocation(locationValue);
    }, [searchValue, locationValue]);

    /*
     * Load restaurant data.
     *
     * This is dummy data for now.
     * Later this can become an Axios API request.
     */
useEffect(() => {
    const fetchRestaurants = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/restaurants?${searchParams.toString()}`
            );

            setRestaurants(res.data);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load restaurants"
            );
        } finally {
            setLoading(false);
        }
    };

    fetchRestaurants();
}, [searchParams]);

    /*
     * Apply search, location, cuisine,
     * price and sorting.
     */
    const filteredRestaurants = useMemo(() => {
        const search = searchValue.trim().toLowerCase();
        const location = locationValue.trim().toLowerCase();

        const filtered = restaurants.filter((restaurant) => {
            const matchesSearch =
                !search ||
                restaurant.name.toLowerCase().includes(search) ||
                restaurant.cuisine.toLowerCase().includes(search) ||
                restaurant.description.toLowerCase().includes(search);

            const matchesLocation =
                !location ||
                restaurant.location.toLowerCase().includes(location) ||
                restaurant.address.toLowerCase().includes(location);

            const matchesCuisine =
                selectedCuisines.length === 0 ||
                selectedCuisines.some(
                    (cuisine) =>
                        restaurant.cuisine.toLowerCase() ===
                        cuisine.toLowerCase()
                );

            const matchesPrice =
                selectedPrices.length === 0 ||
                selectedPrices.includes(restaurant.priceRange);

            return (
                matchesSearch &&
                matchesLocation &&
                matchesCuisine &&
                matchesPrice
            );
        });

        return [...filtered].sort((a, b) => {
            switch (sortValue) {
                case "price_low":
                    return (
                        a.priceRange.length -
                        b.priceRange.length
                    );

                case "price_high":
                    return (
                        b.priceRange.length -
                        a.priceRange.length
                    );

                case "rating":
                    return b.rating - a.rating;

                default:
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
            }
        });
    }, [
        restaurants,
        searchValue,
        locationValue,
        selectedCuisines,
        selectedPrices,
        sortValue,
    ]);

    const updateParams = (
        updater: (params: URLSearchParams) => void
    ) => {
        const nextParams = new URLSearchParams(searchParams);
        updater(nextParams);
        setSearchParams(nextParams);
    };

    const handleTextSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        updateParams((params) => {
            if (tempSearch.trim()) {
                params.set("search", tempSearch.trim());
            } else {
                params.delete("search");
            }

            if (tempLocation.trim()) {
                params.set("location", tempLocation.trim());
            } else {
                params.delete("location");
            }
        });
    };

    const handleCuisineToggle = (cuisine: string) => {
        updateParams((params) => {
            const cuisines = params.getAll("cuisine");

            params.delete("cuisine");

            if (cuisines.includes(cuisine)) {
                cuisines
                    .filter((item) => item !== cuisine)
                    .forEach((item) =>
                        params.append("cuisine", item)
                    );
            } else {
                cuisines.forEach((item) =>
                    params.append("cuisine", item)
                );

                params.append("cuisine", cuisine);
            }
        });
    };

    const handlePriceToggle = (price: string) => {
        updateParams((params) => {
            const prices = params.getAll("priceRange");

            params.delete("priceRange");

            if (prices.includes(price)) {
                prices
                    .filter((item) => item !== price)
                    .forEach((item) =>
                        params.append("priceRange", item)
                    );
            } else {
                prices.forEach((item) =>
                    params.append("priceRange", item)
                );

                params.append("priceRange", price);
            }
        });
    };

    const handleSortChange = (sort: string) => {
        updateParams((params) => {
            if (sort) {
                params.set("sort", sort);
            } else {
                params.delete("sort");
            }
        });
    };

    const clearAllFilters = () => {
        setSearchParams(new URLSearchParams());
        setTempSearch("");
        setTempLocation("");
        setShowMobileFilters(false);
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            {/* Search Bar */}
            <section className="bg-white border-b border-outline-variant/10 py-4 sticky top-16 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <form
                        onSubmit={handleTextSubmit}
                        className="flex flex-col md:flex-row items-center gap-3"
                    >
                        <div className="relative w-full md:w-72">
                            <SearchIcon
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/70"
                            />

                            <input
                                type="text"
                                placeholder="Search cuisine or name..."
                                value={tempSearch}
                                onChange={(event) =>
                                    setTempSearch(event.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2.5 text-xs border border-outline-variant/40 rounded-md focus:border-secondary focus:outline-none bg-surface"
                            />
                        </div>

                        <div className="relative w-full md:w-64">
                            <MapPin
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/70"
                            />

                            <input
                                type="text"
                                placeholder="Location..."
                                value={tempLocation}
                                onChange={(event) =>
                                    setTempLocation(event.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2.5 text-xs border border-outline-variant/40 rounded-md focus:border-secondary focus:outline-none bg-surface"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-wider uppercase px-6 py-3 rounded-md transition-colors cursor-pointer"
                        >
                            SEARCH
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowMobileFilters(true)
                            }
                            className="md:hidden w-full flex items-center justify-center gap-2 border border-outline-variant/50 px-4 py-3 text-xs cursor-pointer"
                        >
                            <SlidersHorizontal size={14} />
                            Filters
                        </button>
                    </form>
                </div>
            </section>

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-10 flex gap-10">
                {/* Desktop Filters */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-44 space-y-8">
                        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                            <h3 className="font-display text-lg font-medium text-primary">
                                Filters
                            </h3>

                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="text-[10px] font-medium text-secondary hover:text-primary tracking-wider uppercase cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Cuisine */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-primary tracking-wider uppercase">
                                Cuisine
                            </h4>

                            <div className="space-y-2">
                                {cuisineOptions.map((cuisine) => {
                                    const active =
                                        selectedCuisines.includes(
                                            cuisine
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={cuisine}
                                            onClick={() =>
                                                handleCuisineToggle(
                                                    cuisine
                                                )
                                            }
                                            className="w-full flex items-center justify-between text-left text-xs text-black/55 hover:text-primary py-1 cursor-pointer"
                                        >
                                            <span>{cuisine}</span>

                                            <span
                                                className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                                                    active
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-outline-variant"
                                                }`}
                                            >
                                                {active && (
                                                    <Check size={10} />
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-primary tracking-wider uppercase">
                                Price Range
                            </h4>

                            <div className="grid grid-cols-4 gap-1.5">
                                {priceOptions.map((price) => {
                                    const active =
                                        selectedPrices.includes(price);

                                    return (
                                        <button
                                            type="button"
                                            key={price}
                                            onClick={() =>
                                                handlePriceToggle(
                                                    price
                                                )
                                            }
                                            className={`py-2 text-xs border rounded-sm cursor-pointer ${
                                                active
                                                    ? "bg-primary border-primary text-white"
                                                    : "border-outline-variant/50 text-black/70 hover:border-primary"
                                            }`}
                                        >
                                            {price}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results */}
                <section className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-outline-variant/10">
                        <p className="text-sm text-black/55">
                            {filteredRestaurants.length}{" "}
                            {filteredRestaurants.length === 1
                                ? "Restaurant"
                                : "Restaurants"}{" "}
                            Available
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-black/55 tracking-wider uppercase">
                                SORT BY:
                            </span>

                            <select
                                value={sortValue}
                                onChange={(event) =>
                                    handleSortChange(
                                        event.target.value
                                    )
                                }
                                className="text-xs bg-transparent border border-outline-variant/30 px-3 py-1.5 focus:outline-none cursor-pointer rounded-sm"
                            >
                                <option value="">
                                    Default (Newest)
                                </option>

                                <option value="price_low">
                                    Price: Low to High
                                </option>

                                <option value="price_high">
                                    Price: High to Low
                                </option>

                                <option value="rating">
                                    Rating: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-10 h-10 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin" />
                        </div>
                    ) : filteredRestaurants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <SearchXIcon
                                size={36}
                                className="text-outline-variant mb-4"
                            />

                            <h3 className="font-display text-xl font-medium mb-2">
                                No Restaurants Found
                            </h3>

                            <p className="text-xs text-black/50 max-w-sm mb-6">
                                We couldn't find any restaurants
                                matching your current filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="bg-primary hover:bg-secondary text-white text-xs tracking-widest uppercase px-6 py-3 cursor-pointer"
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredRestaurants.map(
                                (restaurant) => (
                                    <RestaurantCard
                                        key={restaurant._id}
                                        restaurant={restaurant}
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
                    <div className="absolute right-0 top-0 h-full w-80 max-w-[90%] bg-white p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                                <h3 className="font-display text-lg font-medium text-primary">
                                    Filters
                                </h3>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowMobileFilters(false)
                                    }
                                    className="p-1 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="py-6 space-y-3">
                                <h4 className="text-xs font-medium text-primary tracking-wider uppercase">
                                    Cuisine
                                </h4>

                                {cuisineOptions.map((cuisine) => {
                                    const active =
                                        selectedCuisines.includes(
                                            cuisine
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={cuisine}
                                            onClick={() =>
                                                handleCuisineToggle(
                                                    cuisine
                                                )
                                            }
                                            className="w-full flex items-center justify-between text-xs text-black/55 py-1 cursor-pointer"
                                        >
                                            {cuisine}

                                            <span
                                                className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                                                    active
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-outline-variant"
                                                }`}
                                            >
                                                {active && (
                                                    <Check size={10} />
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-5 border-t border-outline-variant/10 space-y-3">
                                <h4 className="text-xs font-medium text-primary tracking-wider uppercase">
                                    Price Range
                                </h4>

                                <div className="grid grid-cols-4 gap-1.5">
                                    {priceOptions.map((price) => {
                                        const active =
                                            selectedPrices.includes(
                                                price
                                            );

                                        return (
                                            <button
                                                type="button"
                                                key={price}
                                                onClick={() =>
                                                    handlePriceToggle(
                                                        price
                                                    )
                                                }
                                                className={`py-2 text-xs border rounded-sm ${
                                                    active
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-outline-variant/50"
                                                }`}
                                            >
                                                {price}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-outline-variant/10 pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="flex-1 border border-outline-variant/50 py-3 text-xs font-medium tracking-widest uppercase cursor-pointer"
                            >
                                CLEAR
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMobileFilters(false)
                                }
                                className="flex-1 bg-primary text-white py-3 text-xs font-medium tracking-widest uppercase cursor-pointer"
                            >
                                APPLY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}