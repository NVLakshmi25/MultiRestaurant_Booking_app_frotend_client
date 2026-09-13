
import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import BookingSuccess from "../components/booking/BookingSuccess";
import BookingSummary from "../components/booking/BookingSummary";
import BookingForm from "../components/booking/BookingForm";

import type { Restaurant, Booking } from "../types";
import api from "../lib/api";

export default function BookingConfirmation() {
    const { slug } = useParams<{ slug: string }>();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { user, isAuthenticated } = useAppContext();

    const [restaurant, setRestaurant] =
        useState<Restaurant | null>(null);

    const [loading, setLoading] = useState(true);

    const [confirming, setConfirming] =
        useState(false);

    const [confirmedBooking, setConfirmedBooking] =
        useState<Booking | null>(null);

    const [name, setName] =
        useState(user?.name ?? "");

    const [email, setEmail] =
        useState(user?.email ?? "");

    const [phone, setPhone] =
        useState(user?.phone ?? "");

    const [occasion, setOccasion] =
        useState("");

    const [specialRequests, setSpecialRequests] =
        useState("");

    /*
     * Get booking details from URL
     */
    const slot =
        searchParams.get("slot") ?? "";

    const date =
        searchParams.get("date") ?? "";

    const guests =
        searchParams.get("guests") ?? "2";

    /*
     * --------------------------------------------------
     * Keep user information synchronized
     * --------------------------------------------------
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone ?? "");
    }, [user]);

    /*
     * --------------------------------------------------
     * Check authentication
     * --------------------------------------------------
     */
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error(
                "Please login to continue with your reservation."
            );

            navigate("/");
        }
    }, [isAuthenticated, navigate]);

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
     * Confirm booking
     * --------------------------------------------------
     */
    const handleConfirmSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        /*
         * Restaurant validation
         */
        if (!restaurant) {
            toast.error(
                "Restaurant details are unavailable."
            );
            return;
        }

        /*
         * Booking date and time validation
         */
        if (!slot || !date) {
            toast.error(
                "Reservation details are missing. Please return to the restaurant page."
            );
            return;
        }

        /*
         * Guest count validation
         */
        const guestCount = Number(guests);

        if (
            !Number.isInteger(guestCount) ||
            guestCount < 1
        ) {
            toast.error(
                "Please select a valid number of guests."
            );
            return;
        }

        /*
         * User information validation
         */
        if (!name.trim()) {
            toast.error("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!phone.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }

        try {
            setConfirming(true);

            /*
             * Send booking to backend
             */
            const res = await api.post("/bookings", {
                restaurantId: restaurant._id,
                date,
                time: slot,
                guests: guestCount,
                occasion: occasion.trim(),
                specialRequests:
                    specialRequests.trim(),
            });

            /*
             * Store confirmed booking
             */
            setConfirmedBooking(res.data);

            toast.success(
                "Reservation confirmed!"
            );
        } catch (error: any) {
            console.error(
                "Booking confirmation failed:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to confirm reservation. Please try again."
            );
        } finally {
            setConfirming(false);
        }
    };

    /*
     * --------------------------------------------------
     * Loading state
     * --------------------------------------------------
     */
    if (loading) {
        return (
            <Loader
                text="Retrieving Dining Details..."
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

                <main className="grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-2xl text-primary">
                            Restaurant Not Found
                        </h1>

                        <Link
                            to="/search"
                            className="inline-block mt-4 bg-primary text-white px-6 py-3 text-xs uppercase"
                        >
                            Back to Search
                        </Link>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    /*
     * --------------------------------------------------
     * Booking successfully confirmed
     * --------------------------------------------------
     */
    if (confirmedBooking) {
        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">
                <Navbar />

                <main className="grow flex items-center justify-center py-12 px-6">
                    <BookingSuccess
                        confirmedBooking={
                            confirmedBooking
                        }
                        restaurant={restaurant}
                        date={date}
                        slot={slot}
                        guests={guests}
                    />
                </main>

                <Footer />
            </div>
        );
    }

    /*
     * --------------------------------------------------
     * Booking confirmation form
     * --------------------------------------------------
     */
    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-10 pb-4 border-b border-outline-variant/10 text-xs text-black/55">

                    <Link
                        to={`/restaurant/${restaurant.slug}`}
                        className="hover:text-primary"
                    >
                        {restaurant.name}
                    </Link>

                    <ChevronRight size={14} />

                    <span className="text-primary">
                        Details & Confirmation
                    </span>
                </div>

                {/* Booking content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Booking summary */}
                    <div className="lg:col-span-5">
                        <BookingSummary
                            restaurant={restaurant}
                            date={date}
                            slot={slot}
                            guests={guests}
                        />
                    </div>

                    {/* Booking form */}
                    <div className="lg:col-span-7">
                        <BookingForm
                            name={name}
                            setName={setName}

                            email={email}
                            setEmail={setEmail}

                            phone={phone}
                            setPhone={setPhone}

                            occasion={occasion}
                            setOccasion={setOccasion}

                            specialRequests={
                                specialRequests
                            }
                            setSpecialRequests={
                                setSpecialRequests
                            }

                            confirming={confirming}

                            onSubmit={
                                handleConfirmSubmit
                            }
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

