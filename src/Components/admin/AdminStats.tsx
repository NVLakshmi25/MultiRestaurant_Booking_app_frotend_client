import {
    Users,
    ShieldCheck,
    Utensils,
    Calendar,
} from "lucide-react";

import type {
    AdminStats as AdminStatsType,
} from "../../assets/assets";

interface AdminStatsProps {
    stats: AdminStatsType | null;
}

/*
=====================================================
FORMAT TIME
=====================================================
*/

function formatTime(time?: string | null): string {
    if (!time) {
        return "N/A";
    }

    const parts = time.split(":");

    const hourString = parts[0];
    const minuteString = parts[1];

    const hour = Number(hourString);

    if (Number.isNaN(hour)) {
        return time;
    }

    const minute = minuteString ?? "00";

    const period = hour >= 12 ? "PM" : "AM";

    const displayHour =
        hour % 12 === 0
            ? 12
            : hour % 12;

    return `${displayHour}:${minute} ${period}`;
}


/*
=====================================================
FORMAT DATE
=====================================================
*/

function formatDate(
    date?: string | Date | null
): string {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
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


/*
=====================================================
ADMIN STATS COMPONENT
=====================================================
*/

export default function AdminStats({
    stats,
}: AdminStatsProps) {

    /*
    --------------------------------------------------
    No statistics available
    --------------------------------------------------
    */

    if (!stats) {
        return (
            <div className="py-10 text-center">
                <p className="text-sm text-black/50">
                    No statistics available.
                </p>
            </div>
        );
    }


    /*
    --------------------------------------------------
    SUPPORT BOTH POSSIBLE BACKEND STRUCTURES
    --------------------------------------------------

    Structure 1:

    stats.users.totalUsers
    stats.users.totalOwners
    stats.restaurants.total
    stats.bookings.total

    Structure 2:

    stats.totalUsers
    stats.totalRestaurants
    stats.totalBookings
    --------------------------------------------------
    */

    const totalUsers =
        stats.users?.totalUsers ??
        (stats as any).totalUsers ??
        0;

    const totalOwners =
        stats.users?.totalOwners ??
        (stats as any).totalOwners ??
        0;

    const totalRestaurants =
        stats.restaurants?.total ??
        (stats as any).totalRestaurants ??
        0;

    const totalBookings =
        stats.bookings?.total ??
        (stats as any).totalBookings ??
        0;


    /*
    --------------------------------------------------
    LATEST BOOKINGS
    --------------------------------------------------
    */

    const latestBookings =
        stats.latestBookings ?? [];


    /*
    --------------------------------------------------
    KPI CARDS
    --------------------------------------------------
    */

    const kpiCards = [
        {
            title: "Active Diners",
            value: totalUsers,
            icon: Users,
        },
        {
            title: "Partners",
            value: totalOwners,
            icon: ShieldCheck,
        },
        {
            title: "Total Venues",
            value: totalRestaurants,
            icon: Utensils,
        },
        {
            title: "Bookings",
            value: totalBookings,
            icon: Calendar,
        },
    ];


    /*
    --------------------------------------------------
    RENDER
    --------------------------------------------------
    */

    return (
        <div className="space-y-8 text-left">

            {/* =========================================
                KPI CARDS
            ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {kpiCards.map(
                    ({
                        title,
                        value,
                        icon: Icon,
                    }) => (
                        <div
                            key={title}
                            className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-2"
                        >

                            <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">

                                <Icon
                                    size={12}
                                    className="text-secondary"
                                />

                                {title}

                            </span>

                            <h4 className="font-display text-2xl font-medium text-primary">
                                {value}
                            </h4>

                        </div>
                    )
                )}

            </div>


            {/* =========================================
                RECENT BOOKINGS
            ========================================= */}

            <div className="space-y-4">

                <h3 className="font-display text-lg font-medium text-primary">
                    Recent Bookings Activity
                </h3>


                {/* =====================================
                    NO BOOKINGS
                ===================================== */}

                {latestBookings.length === 0 ? (

                    <p className="text-xs text-black/40 italic">
                        No bookings recorded on the platform.
                    </p>

                ) : (

                    /* ==================================
                       BOOKINGS TABLE
                    ================================== */

                    <div className="bg-white border border-outline-variant/20 rounded-md overflow-x-auto shadow-sm">

                        <table className="w-full min-w-[800px] text-left text-xs border-collapse">

                            <thead>

                                <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] tracking-wider text-black/55 uppercase">

                                    <th className="p-4">
                                        Ref Code
                                    </th>

                                    <th className="p-4">
                                        Diner
                                    </th>

                                    <th className="p-4">
                                        Restaurant
                                    </th>

                                    <th className="p-4">
                                        Details
                                    </th>

                                    <th className="p-4 text-right">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-outline-variant/10">

                                {latestBookings.map(
                                    (booking) => {

                                        /*
                                        -----------------------------------------
                                        SAFE USER
                                        -----------------------------------------
                                        */

                                        const userName =
                                            booking.user?.name ??
                                            "Unknown User";

                                        const userEmail =
                                            booking.user?.email ??
                                            "No email available";


                                        /*
                                        -----------------------------------------
                                        SAFE RESTAURANT
                                        -----------------------------------------
                                        */

                                        const restaurantName =
                                            booking.restaurant?.name ??
                                            "Unknown Restaurant";


                                        /*
                                        -----------------------------------------
                                        SAFE BOOKING DATA
                                        -----------------------------------------
                                        */

                                        const bookingId =
                                            booking.bookingId ??
                                            "N/A";

                                        const guests =
                                            booking.guests ??
                                            0;

                                        const status =
                                            booking.status ??
                                            "unknown";


                                        /*
                                        -----------------------------------------
                                        RETURN TABLE ROW
                                        -----------------------------------------
                                        */

                                        return (
                                            <tr
                                                key={
                                                    booking._id ??
                                                    bookingId
                                                }
                                                className="hover:bg-surface/50"
                                            >

                                                {/* =============================
                                                    REF CODE
                                                ============================== */}

                                                <td className="p-4 text-primary">

                                                    {bookingId}

                                                </td>


                                                {/* =============================
                                                    DINER
                                                ============================== */}

                                                <td className="p-4">

                                                    <div className="text-primary">

                                                        {userName}

                                                    </div>

                                                    <div className="text-[10px] text-black/50">

                                                        {userEmail}

                                                    </div>

                                                </td>


                                                {/* =============================
                                                    RESTAURANT
                                                ============================== */}

                                                <td className="p-4 text-primary">

                                                    {restaurantName}

                                                </td>


                                                {/* =============================
                                                    DETAILS
                                                ============================== */}

                                                <td className="p-4 text-black/55">

                                                    {formatDate(
                                                        booking.date
                                                    )}

                                                    {" "}at{" "}

                                                    {formatTime(
                                                        booking.time
                                                    )}

                                                    {" "}•{" "}

                                                    {guests}

                                                    {" "}Guests

                                                </td>


                                                {/* =============================
                                                    STATUS
                                                ============================== */}

                                                <td className="p-4 text-right">

                                                    <span
                                                        className={`
                                                            inline-block
                                                            py-0.5
                                                            px-2
                                                            text-[9px]
                                                            tracking-wider
                                                            uppercase
                                                            rounded-sm
                                                            ${
                                                                status ===
                                                                "confirmed"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : status ===
                                                                      "completed"
                                                                      ? "bg-green-100 text-green-800"
                                                                      : status ===
                                                                        "cancelled"
                                                                        ? "bg-error-container text-on-error-container"
                                                                        : "bg-gray-100 text-gray-700"
                                                            }
                                                        `}
                                                    >

                                                        {status}

                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}