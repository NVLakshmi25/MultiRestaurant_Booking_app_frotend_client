import { useEffect, useState } from "react";
import {
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAppContext } from "../../context/AppContext";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

import RestaurantWizard from "../../components/owner/RestaurantWizard";
import PendingApproval from "../../components/owner/PendingApproval";
import RequestRejected from "../../components/owner/RequestRejected";
import OwnerBookings from "../../components/owner/OwnerBookings";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails";

import type { Booking, Restaurant } from "../../types";
import api from "../../lib/api";

export default function OwnerDashboard() {
  const { logout, user } = useAppContext();

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] = useState<
    "bookings" | "details"
  >("bookings");

  /**
   * Fetch restaurant and booking data
   * for the currently logged-in owner.
   */
  const fetchOwnerData = async () => {
    try {
      setLoading(true);

      // User is not logged in
      if (!user) {
        setRestaurant(null);
        setBookings([]);
        return;
      }

      /**
       * Get owner's restaurant
       *
       * GET /api/owner/restaurant
       */
      const restaurantResponse =
        await api.get("/owner/restaurant");

      const restaurantData =
        restaurantResponse.data?.restaurant ??
        restaurantResponse.data?.data ??
        restaurantResponse.data ??
        null;

      setRestaurant(restaurantData);

      /**
       * Only approved restaurants
       * can access owner bookings.
       */
      if (
        restaurantData &&
        restaurantData.status === "approved"
      ) {
        /**
         * Get owner bookings
         *
         * GET /api/owner/bookings
         */
        const bookingsResponse =
          await api.get("/owner/bookings");

        const bookingsData =
          bookingsResponse.data?.bookings ??
          bookingsResponse.data?.data ??
          bookingsResponse.data ??
          [];

        setBookings(
          Array.isArray(bookingsData)
            ? bookingsData
            : []
        );
      } else {
        setBookings([]);
      }
    } catch (error: any) {
      console.error(
        "Failed to load owner dashboard:",
        error
      );

      setRestaurant(null);
      setBookings([]);

      const status = error?.response?.status;

      if (status === 401) {
        toast.error(
          "Your session has expired. Please login again."
        );
      } else if (status === 403) {
        toast.error(
          "You are not authorized to access the owner dashboard."
        );
      } else if (status === 404) {
        // 404 can simply mean the owner has not created
        // a restaurant yet.
        setRestaurant(null);
        setBookings([]);
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load dashboard data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load owner data whenever the logged-in user changes.
   */
  useEffect(() => {
    fetchOwnerData();
  }, [user]);

  /**
   * Loading state
   */
  if (loading) {
    return (
      <Loader text="Loading Owner Dashboard..." />
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-20">
      <Navbar />

      <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-primary">
              Restaurant Portal
            </h1>

            <p className="text-xs text-black/55 mt-1.5">
              Manage your restaurant and reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="bg-error-container text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* 
          No restaurant
          Show restaurant registration wizard
        */}
        {!restaurant && (
          <RestaurantWizard
            setRestaurant={setRestaurant}
          />
        )}

        {/* 
          Restaurant exists but is waiting for admin approval
        */}
        {restaurant &&
          restaurant.status === "pending" && (
            <PendingApproval
              restaurant={restaurant}
            />
          )}

        {/* 
          Restaurant registration was rejected
        */}
        {restaurant &&
          restaurant.status === "rejected" && (
            <RequestRejected
              restaurantName={restaurant.name}
            />
          )}

        {/* 
          Restaurant approved
        */}
        {restaurant &&
          restaurant.status === "approved" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Sidebar */}
              <aside className="lg:col-span-3 bg-white border border-outline-variant/20 p-6 rounded-md shadow-sm h-fit">
                {/* Restaurant information */}
                <div className="flex items-center gap-3.5 border-b border-outline-variant/10 pb-5">
                  <span className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                    {restaurant.name
                      ?.charAt(0)
                      ?.toUpperCase() || "R"}
                  </span>

                  <div>
                    <h4 className="font-display font-medium text-primary text-base">
                      {restaurant.name}
                    </h4>

                    <span className="text-[9px] text-secondary tracking-widest uppercase">
                      Approved
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1.5 mt-6">
                  {/* Bookings */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("bookings")
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer ${
                      activeTab === "bookings"
                        ? "bg-primary text-white"
                        : "text-black/55 hover:bg-surface"
                    }`}
                  >
                    <CalendarIcon size={14} />

                    <span>
                      Bookings ({bookings.length})
                    </span>
                  </button>

                  {/* Profile Details */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("details")
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer ${
                      activeTab === "details"
                        ? "bg-primary text-white"
                        : "text-black/55 hover:bg-surface"
                    }`}
                  >
                    <SettingsIcon size={14} />

                    <span>Profile Details</span>
                  </button>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                  <OwnerBookings
                    bookings={bookings}
                    setBookings={setBookings}
                    totalSeats={
                      restaurant.totalSeats
                    }
                  />
                )}

                {/* Profile Details Tab */}
                {activeTab === "details" && (
                  <OwnerProfileDetails
                    restaurant={restaurant}
                    setRestaurant={setRestaurant}
                  />
                )}
              </div>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
}