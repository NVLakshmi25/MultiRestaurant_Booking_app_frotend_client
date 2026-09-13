import type {
    Dispatch,
    SetStateAction,
} from "react";

import {
    Calendar,
    Users,
    Clock,
} from "lucide-react";

import toast from "react-hot-toast";

import type {
    Booking,
    BookingStatus,
} from "../../types";

import api from "../../lib/api";

interface OwnerBookingsProps {
    bookings: Booking[];
    setBookings: Dispatch<
        SetStateAction<Booking[]>
    >;
    totalSeats: number;
}

type OwnerUpdateStatus =
    | "completed"
    | "cancelled";

/* ----------------------------------------
   Format Time
----------------------------------------- */

function formatTime(time: string): string {
    if (!time) {
        return "N/A";
    }

    const [hourString, minute = "00"] =
        time.split(":");

    const hour = Number(hourString);

    if (!Number.isFinite(hour)) {
        return time;
    }

    const suffix =
        hour >= 12 ? "PM" : "AM";

    const displayHour =
        hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
}

/* ----------------------------------------
   Format Date
----------------------------------------- */

function formatDate(date: string): string {
    if (!date) {
        return "N/A";
    }

    const [year, month, day] = date
        .split("-")
        .map(Number);

    /*
     * Handles dates such as:
     * 2026-09-15
     */
    if (year && month && day) {
        return new Date(
            year,
            month - 1,
            day
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    }

    /*
     * Fallback for ISO dates
     */
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

/* ----------------------------------------
   Status Classes
----------------------------------------- */

function getStatusClasses(
    status: BookingStatus
): string {
    switch (status) {
        case "confirmed":
            return "bg-blue-100 text-blue-800";

        case "completed":
            return "bg-green-100 text-green-800";

        case "cancelled":
            return "bg-error-container text-on-error-container";

        case "pending":
            return "bg-yellow-100 text-yellow-800";

        default:
            return "bg-surface-container-low text-black/55";
    }
}

/* ----------------------------------------
   Owner Bookings Component
----------------------------------------- */

export default function OwnerBookings({
    bookings,
    setBookings,
    totalSeats,
}: OwnerBookingsProps) {
    /* ----------------------------------------
       Update Booking Status
    ----------------------------------------- */

    const handleUpdateBookingStatus = async (
        bookingId: string,
        newStatus: OwnerUpdateStatus
    ): Promise<void> => {
        if (!bookingId) {
            toast.error(
                "Booking ID is missing."
            );
            return;
        }

        try {
            /*
             * Backend endpoint:
             *
             * PUT /api/owner/bookings/:id/status
             *
             * Body:
             * {
             *   status: "completed"
             * }
             *
             * Your api instance should already
             * contain the baseURL /api and JWT
             * interceptor.
             */

            const response = await api.put(
                `/owner/bookings/${bookingId}/status`,
                {
                    status: newStatus,
                }
            );

            /*
             * Backend returns:
             *
             * {
             *   message: "...",
             *   booking: {...}
             * }
             */

            const updatedBooking =
                response.data?.booking;

            /*
             * Prefer the complete booking returned
             * from MongoDB.
             */

            if (updatedBooking) {
                setBookings((prevBookings) =>
                    prevBookings.map(
                        (booking) =>
                            booking._id === bookingId
                                ? updatedBooking
                                : booking
                    )
                );
            } else {
                /*
                 * Fallback in case the backend
                 * doesn't return the booking.
                 */

                setBookings((prevBookings) =>
                    prevBookings.map(
                        (booking) =>
                            booking._id === bookingId
                                ? {
                                      ...booking,
                                      status: newStatus,
                                  }
                                : booking
                    )
                );
            }

            toast.success(
                `Booking ${newStatus} successfully.`
            );
        } catch (error: any) {
            console.error(
                "Failed to update booking status:",
                error
            );

            const status =
                error?.response?.status;

            const message =
                error?.response?.data?.message;

            if (status === 401) {
                toast.error(
                    "Your session has expired. Please login again."
                );
                return;
            }

            if (status === 403) {
                toast.error(
                    "You are not authorized to update this booking."
                );
                return;
            }

            if (status === 404) {
                toast.error(
                    message ||
                        "Booking not found."
                );
                return;
            }

            if (status === 400) {
                toast.error(
                    message ||
                        "Invalid booking status."
                );
                return;
            }

            toast.error(
                message ||
                    "Unable to update booking status. Please try again."
            );
        }
    };

    /* ----------------------------------------
       Render
    ----------------------------------------- */

    return (
        <div className="space-y-6 text-left">
            {/* --------------------------------
                Header
            --------------------------------- */}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <h3 className="font-display text-lg font-medium text-primary">
                    Active Reservations
                </h3>

                <span className="text-xs text-black/55">
                    Total capacity:{" "}
                    {totalSeats} seats
                </span>
            </div>

            {/* --------------------------------
                Empty State
            --------------------------------- */}

            {bookings.length === 0 ? (
                <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                    <Calendar
                        size={32}
                        className="mx-auto text-outline-variant mb-3"
                    />

                    <p className="text-xs text-black/55 italic">
                        No booking records found.
                    </p>
                </div>
            ) : (
                /* --------------------------------
                   Booking List
                --------------------------------- */

                <div className="space-y-4">
                    {bookings.map(
                        (booking) => (
                            <div
                                key={
                                    booking._id
                                }
                                className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                            >
                                {/* --------------------------------
                                    Booking Information
                                --------------------------------- */}

                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-display text-base font-medium text-primary">
                                            {booking.user ||
                                                "Guest"}
                                        </h4>

                                        {booking.bookingId && (
                                            <span className="text-[9px] text-black/50 border border-outline-variant/30 px-1.5 py-0.5">
                                                {
                                                    booking.bookingId
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* --------------------------------
                                        Date / Time / Guests
                                    --------------------------------- */}

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/55">
                                        <span className="flex items-center gap-1">
                                            <Users
                                                size={
                                                    12
                                                }
                                            />

                                            {
                                                booking.guests
                                            }{" "}
                                            {booking.guests ===
                                            1
                                                ? "Guest"
                                                : "Guests"}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Clock
                                                size={
                                                    12
                                                }
                                            />

                                            {formatTime(
                                                booking.time
                                            )}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Calendar
                                                size={
                                                    12
                                                }
                                            />

                                            {formatDate(
                                                booking.date
                                            )}
                                        </span>
                                    </div>

                                    {/* --------------------------------
                                        Occasion
                                    --------------------------------- */}

                                    {booking.occasion && (
                                        <p className="text-xs text-black/55 mt-2">
                                            <strong>
                                                Occasion:
                                            </strong>{" "}
                                            {
                                                booking.occasion
                                            }
                                        </p>
                                    )}

                                    {/* --------------------------------
                                        Special Requests
                                    --------------------------------- */}

                                    {booking.specialRequests && (
                                        <p className="text-xs text-secondary/80 bg-secondary/5 px-3 py-1.5 rounded-sm border-l-2 border-secondary mt-2">
                                            <strong>
                                                Requests:
                                            </strong>{" "}
                                            {
                                                booking.specialRequests
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* --------------------------------
                                    Status + Actions
                                --------------------------------- */}

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                    {/* Status Badge */}

                                    <span
                                        className={`text-[9px] font-medium tracking-wider uppercase px-2 py-1 rounded-sm ${getStatusClasses(
                                            booking.status
                                        )}`}
                                    >
                                        {
                                            booking.status
                                        }
                                    </span>

                                    {/* --------------------------------
                                        Confirmed Booking Actions
                                    --------------------------------- */}

                                    {booking.status ===
                                        "confirmed" && (
                                        <div className="flex gap-2">
                                            {/* Complete */}

                                            <button
                                                type="button"
                                                disabled={
                                                    false
                                                }
                                                onClick={() =>
                                                    handleUpdateBookingStatus(
                                                        booking._id,
                                                        "completed"
                                                    )
                                                }
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Complete
                                            </button>

                                            {/* Cancel */}

                                            <button
                                                type="button"
                                                disabled={
                                                    false
                                                }
                                                onClick={() =>
                                                    handleUpdateBookingStatus(
                                                        booking._id,
                                                        "cancelled"
                                                    )
                                                }
                                                className="px-3 py-1.5 bg-error hover:bg-error/85 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}