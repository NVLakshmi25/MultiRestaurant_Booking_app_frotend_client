
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import Loader from "../components/Loader";

import RestaurantHero from "../components/restaurant/RestaurantHero";
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import RestaurantReviews from "../components/restaurant/RestaurantReviews";
import BookingWidget from "../components/restaurant/BookingWidget";

import type { Restaurant, Availability } from "../types";
import api from "../lib/api";

export default function RestaurantDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        setAuthModalOpen,
    } = useAppContext();

    const [restaurant, setRestaurant] =
        useState<Restaurant | null>(null);

    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState("");

    const [selectedGuests, setSelectedGuests] =
        useState("2");

    const [selectedSlot, setSelectedSlot] =
        useState("");

    const [slotsAvailability, setSlotsAvailability] =
        useState<Availability[]>([]);

    const [loadingSlots, setLoadingSlots] =
        useState(false);

    /*
     * --------------------------------------------------
     * Fetch restaurant details
     * --------------------------------------------------
     */
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!slug) {
                setRestaurant(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const res = await api.get(
                    `/restaurants/${slug}`
                );

                setRestaurant(res.data);

                // Set today's date
                const today = new Date()
                    .toISOString()
                    .split("T")[0];

                setSelectedDate(today);
            } catch (error: any) {
                console.error(
                    "Failed to fetch restaurant:",
                    error
                );

               toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load restaurant"
                );

                setRestaurant(null);

                navigate("/search");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [slug, navigate]);

    /*
     * --------------------------------------------------
     * Fetch restaurant availability
     * --------------------------------------------------
     */
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!restaurant?._id || !selectedDate) {
                setSlotsAvailability([]);
                return;
            }

            try {
                setLoadingSlots(true);

                const res = await api.get(
                    `/restaurants/${restaurant._id}/availability?date=${selectedDate}`
                );

                setSlotsAvailability(res.data);
            } catch (error: any) {
                console.error(
                    "Failed to fetch availability:",
                    error
                );

                setSlotsAvailability([]);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load available slots"
                );
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [restaurant?._id, selectedDate]);

    /*
     * --------------------------------------------------
     * Loading state
     * --------------------------------------------------
     */
    if (loading) {
        return (
            <Loader
                text="Loading Restaurant Details..."
            />
        );
    }

    /*
     * --------------------------------------------------
     * Restaurant not found
     * --------------------------------------------------
     */
    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col bg-surface">
                <Navbar />

                <main className="grow flex items-center justify-center px-6">
                    <div className="text-center">
                        <h1 className="font-display text-2xl text-primary mb-3">
                            Restaurant Not Found
                        </h1>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/search")
                            }
                            className="bg-primary text-white px-6 py-3 text-xs uppercase tracking-wider cursor-pointer"
                        >
                            Back to Restaurants
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    /*
     * --------------------------------------------------
     * Handle reservation
     * --------------------------------------------------
     */
    const handleReserveClick = () => {
        if (!selectedDate) {
            toast.error(
                "Please select a dining date."
            );
            return;
        }

        if (!selectedSlot) {
            toast.error(
                "Please select a dining time slot."
            );
            return;
        }

        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        /*
         * Create query parameters
         */
        const params = new URLSearchParams({
            slot: selectedSlot,
            date: selectedDate,
            guests: selectedGuests,
        });

        /*
         * Navigate to booking page
         */
        navigate(
            `/booking/${restaurant.slug}?${params.toString()}`
        );
    };

    /*
     * --------------------------------------------------
     * Page UI
     * --------------------------------------------------
     */
    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <AuthModal />

            <RestaurantHero
                restaurant={restaurant}
            />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Restaurant information */}
                    <div className="lg:col-span-8 space-y-12">
                        <RestaurantInfo
                            restaurant={restaurant}
                        />

                        <RestaurantReviews />
                    </div>

                    {/* Booking widget */}
                    <div className="lg:col-span-4 lg:sticky lg:top-36">
                        <BookingWidget
                            restaurant={restaurant}

                            selectedDate={
                                selectedDate
                            }

                            setSelectedDate={
                                setSelectedDate
                            }

                            selectedGuests={
                                selectedGuests
                            }

                            setSelectedGuests={
                                setSelectedGuests
                            }

                            selectedSlot={
                                selectedSlot
                            }

                            setSelectedSlot={
                                setSelectedSlot
                            }

                            slotsAvailability={
                                slotsAvailability
                            }

                            loadingSlots={
                                loadingSlots
                            }

                            isAuthenticated={
                                isAuthenticated
                            }

                            handleReserveClick={
                                handleReserveClick
                            }
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

