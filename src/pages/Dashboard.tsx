
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import RestaurantCard from "../components/RestaurantCard";

import type { Booking, Restaurant } from "../types";
import api from "../lib/api";

export default function Dashboard() {
  const { user } = useAppContext();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(true);

  /*
   * ==========================================
   * FETCH USER BOOKINGS
   * ==========================================
   */
 useEffect(() => {
  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoadingBookings(false);
      return;
    }

    try {
      setLoadingBookings(true);

      const response = await api.get("/bookings/my");

      console.log("Bookings API response:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else if (Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        console.error(
          "Unexpected bookings response:",
          data,
        );

        setBookings([]);
        toast.error(
          "Invalid bookings data received from server.",
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to load bookings:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load your bookings.",
      );

      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  fetchBookings();
}, [user]);

  /*
   * ==========================================
   * FETCH FEATURED RESTAURANTS
   * ==========================================
   */
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);

        const response = await api.get("/restaurants/featured");

        setRecommendations(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load recommendations:",
          error,
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load recommended restaurants.",
        );

        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);

  /*
   * ==========================================
   * CANCEL BOOKING
   * ==========================================
   */
  const handleCancelBooking = async (
    bookingId: string,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    // User clicked Cancel in confirmation popup
    if (!confirmed) {
      return;
    }

    try {
      await api.put(
        `/bookings/${bookingId}/cancel`,
      );

      // Update UI immediately
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking,
        ),
      );

      toast.success(
        "Reservation cancelled successfully.",
      );
    } catch (error: any) {
      console.error(
        "Cancellation failed:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to cancel reservation.",
      );
    }
  };

  /*
   * ==========================================
   * SEPARATE UPCOMING AND PAST BOOKINGS
   * ==========================================
   */
  const {
    upcomingBookings,
    pastBookings,
  } = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter(
      (booking) => {
        const bookingDate = new Date(
          booking.date,
        );

        bookingDate.setHours(0, 0, 0, 0);

        return (
          bookingDate >= today &&
          booking.status === "confirmed"
        );
      },
    );

    const past = bookings.filter(
      (booking) => {
        const bookingDate = new Date(
          booking.date,
        );

        bookingDate.setHours(0, 0, 0, 0);

        return (
          bookingDate < today ||
          booking.status !== "confirmed"
        );
      },
    );

    return {
      upcomingBookings: upcoming,
      pastBookings: past,
    };
  }, [bookings]);

  /*
   * ==========================================
   * IF USER IS NOT LOGGED IN
   * ==========================================
   */
  if (!user) {
    return null;
  }

  /*
   * ==========================================
   * DASHBOARD UI
   * ==========================================
   */
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-20">
      <Navbar />

      <AuthModal />

      <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
        <div className="space-y-10">

          {/* =================================
              HEADER
          ================================== */}
          <div className="pb-4 border-b border-outline-variant/10">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary">
              Welcome back,{" "}
              {user.name.split(" ")[0]}
            </h2>

            <p className="text-xs text-black/55 mt-1.5">
              Manage your upcoming dining
              experiences.
            </p>
          </div>

          {/* =================================
              UPCOMING BOOKINGS
          ================================== */}
          <section className="space-y-4">
            <h3 className="font-display text-lg font-medium text-primary">
              Upcoming Bookings
            </h3>

            {/* Loading */}
            {loadingBookings ? (
              <div className="bg-white border border-outline-variant/10 p-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin" />
              </div>
            ) : upcomingBookings.length ===
              0 ? (
              /* No bookings */
              <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                <CalendarDaysIcon
                  size={36}
                  className="mx-auto text-outline-variant mb-3"
                />

                <p className="text-xs text-black/55">
                  No upcoming reservations
                  scheduled.
                </p>

                <Link
                  to="/search"
                  className="inline-block mt-4 bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-widest uppercase px-6 py-2.5"
                >
                  Book a Table
                </Link>
              </div>
            ) : (
              /* Bookings */
              <div className="space-y-4">
                {upcomingBookings.map(
                  (booking) => (
                    <div
                      key={booking._id}
                      className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-6">

                        {/* Restaurant */}
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 bg-surface">
                            <img
                              src={
                                booking
                                  .restaurant
                                  ?.image
                              }
                              alt={
                                booking
                                  .restaurant
                                  ?.name ||
                                "Restaurant"
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-medium text-secondary tracking-widest uppercase">
                              {booking
                                .restaurant
                                ?.cuisine ||
                                "Restaurant"}
                            </span>

                            <h4 className="font-display text-base font-medium text-primary">
                              {booking
                                .restaurant
                                ?.name ||
                                "Restaurant"}
                            </h4>

                            <p className="text-xs text-black/55 flex items-center gap-1">
                              <MapPinIcon
                                size={12}
                              />

                              {booking
                                .restaurant
                                ?.location ||
                                "Location unavailable"}
                            </p>
                          </div>
                        </div>

                        {/* Booking information */}
                        <div className="flex flex-wrap items-center gap-5 text-xs bg-surface-container-low p-4 rounded-md border border-outline-variant/10">

                          {/* Date */}
                          <div className="flex items-center gap-2">
                            <CalendarIcon
                              size={14}
                              className="text-secondary"
                            />

                            <span>
                              {new Date(
                                booking.date,
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2">
                            <ClockIcon
                              size={14}
                              className="text-secondary"
                            />

                            <span>
                              {booking.time}
                            </span>
                          </div>

                          {/* Guests */}
                          <div className="flex items-center gap-2">
                            <UsersIcon
                              size={14}
                              className="text-secondary"
                            />

                            <span>
                              {booking.guests}{" "}
                              {booking.guests ===
                              1
                                ? "Guest"
                                : "Guests"}
                            </span>
                          </div>
                        </div>

                        {/* Cancel */}
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelBooking(
                                booking._id,
                              )
                            }
                            className="px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase text-error border border-outline-variant/40 rounded-sm cursor-pointer hover:bg-error-container transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* =================================
              DINING HISTORY
          ================================== */}
          {!loadingBookings &&
            pastBookings.length > 0 && (
              <section className="space-y-4">

                <h3 className="font-display text-lg font-medium text-primary">
                  Dining History
                </h3>

                <div className="bg-white border border-outline-variant/20 rounded-md overflow-x-auto shadow-sm">
                  <table className="w-full text-left text-xs">

                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] tracking-wider text-black/55 uppercase">

                        <th className="p-4">
                          Restaurant
                        </th>

                        <th className="p-4">
                          Date &amp; Time
                        </th>

                        <th className="p-4">
                          Party
                        </th>

                        <th className="p-4">
                          Status
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-outline-variant/10">

                      {pastBookings.map(
                        (booking) => (
                          <tr
                            key={booking._id}
                          >

                            {/* Restaurant */}
                            <td className="p-4 font-medium text-primary">

                              {booking
                                .restaurant
                                ?.slug ? (
                                <Link
                                  to={`/restaurant/${booking.restaurant.slug}`}
                                  className="hover:text-secondary"
                                >
                                  {booking
                                    .restaurant
                                    ?.name ||
                                    "Restaurant"}
                                </Link>
                              ) : (
                                <span>
                                  {booking
                                    .restaurant
                                    ?.name ||
                                    "Restaurant"}
                                </span>
                              )}

                            </td>

                            {/* Date & Time */}
                            <td className="p-4">
                              {new Date(
                                booking.date,
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {booking.time}
                            </td>

                            {/* Guests */}
                            <td className="p-4">
                              {booking.guests}{" "}
                              {booking.guests ===
                              1
                                ? "Guest"
                                : "Guests"}
                            </td>

                            {/* Status */}
                            <td className="p-4">

                              <span
                                className={`inline-block py-1 px-2 text-[9px] font-medium uppercase rounded-sm ${
                                  booking.status ===
                                  "completed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status ===
                                        "cancelled"
                                      ? "bg-error-container text-on-error-container"
                                      : "bg-surface-container-low text-black/60"
                                }`}
                              >
                                {
                                  booking.status
                                }
                              </span>

                            </td>

                          </tr>
                        ),
                      )}

                    </tbody>
                  </table>
                </div>
              </section>
            )}

          {/* =================================
              RECOMMENDATIONS
          ================================== */}
          {!loadingRecommendations &&
            recommendations.length > 0 && (
              <section className="space-y-4 pt-10 border-t border-outline-variant/10">

                <h3 className="font-display text-lg font-medium text-primary">
                  Recommended for You
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {recommendations
                    .slice(0, 3)
                    .map((restaurant) => (
                      <RestaurantCard
                        key={restaurant._id}
                        restaurant={restaurant}
                      />
                    ))}

                </div>
              </section>
            )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

