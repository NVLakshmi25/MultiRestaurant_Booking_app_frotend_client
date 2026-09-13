import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    BarChart3,
    LogOut,
    Users,
    UserCog,
} from "lucide-react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

import AdminStats from "../../components/admin/AdminStats";
import AdminApprovals from "../../components/admin/AdminApprovals";

import { useAppContext } from "../../context/AppContext";
import api from "../../lib/api";

import type {
    AdminStats as AdminStatsData,
    Restaurant,
} from "../../types";


export default function AdminDashboard() {

    /* ----------------------------------------
       Context
    ----------------------------------------- */

    const {
        user,
        logout,
    } = useAppContext();


    /* ----------------------------------------
       Navigation
    ----------------------------------------- */

    const navigate = useNavigate();


    /* ----------------------------------------
       State
    ----------------------------------------- */

    const [restaurants, setRestaurants] =
        useState<Restaurant[]>([]);

    const [stats, setStats] =
        useState<AdminStatsData | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [btnLoading, setBtnLoading] =
        useState<string | null>(null);

    const [activeTab, setActiveTab] =
        useState<
            "stats" | "approvals"
        >("stats");


    /* ----------------------------------------
       Fetch Admin Dashboard Data
    ----------------------------------------- */

    const fetchAdminData =
        useCallback(
            async (): Promise<void> => {

                try {

                    setLoading(true);


                    /* --------------------------------
                       Get Restaurants
                    --------------------------------- */

                    const restaurantsResponse =
                        await api.get(
                            "/admin/restaurants"
                        );


                    const restaurantData =
                        restaurantsResponse.data;


                    /*
                     * Support multiple response formats:
                     *
                     * [...]
                     *
                     * {
                     *     restaurants: [...]
                     * }
                     *
                     * {
                     *     data: [...]
                     * }
                     */

                    const restaurantList =
                        Array.isArray(
                            restaurantData
                        )
                            ? restaurantData
                            : restaurantData?.restaurants ??
                              restaurantData?.data ??
                              [];


                    setRestaurants(
                        restaurantList
                    );


                    /* --------------------------------
                       Get Admin Statistics
                    --------------------------------- */

                    const statsResponse =
                        await api.get(
                            "/admin/stats"
                        );


                    const statsData =
                        statsResponse.data;


                    /*
                     * Support:
                     *
                     * {
                     *     ...stats
                     * }
                     *
                     * OR
                     *
                     * {
                     *     stats: {...}
                     * }
                     *
                     * OR
                     *
                     * {
                     *     data: {...}
                     * }
                     */

                    const adminStats =
                        statsData?.stats ??
                        statsData?.data ??
                        statsData;


                    setStats(
                        adminStats ?? null
                    );

                } catch (
                    error: unknown
                ) {

                    console.error(
                        "Failed to load admin data:",
                        error
                    );


                    if (
                        typeof error ===
                            "object" &&
                        error !== null &&
                        "response" in error
                    ) {

                        const axiosError =
                            error as {
                                response?: {
                                    status?: number;
                                    data?: {
                                        message?: string;
                                    };
                                };
                            };


                        const status =
                            axiosError
                                .response
                                ?.status;


                        const message =
                            axiosError
                                .response
                                ?.data
                                ?.message;


                        if (
                            status === 401
                        ) {

                            toast.error(
                                "Your session has expired. Please login again."
                            );

                        } else if (
                            status === 403
                        ) {

                            toast.error(
                                "Admin access is required."
                            );

                        } else {

                            toast.error(
                                message ||
                                    "Failed to retrieve administrator data."
                            );
                        }

                    } else {

                        toast.error(
                            "Failed to retrieve administrator data."
                        );
                    }


                    setRestaurants([]);

                    setStats(null);

                } finally {

                    setLoading(false);
                }

            },
            []
        );


    /* ----------------------------------------
       Approve / Reject Restaurant
    ----------------------------------------- */

    const handleApproveStatus =
        async (
            restaurantId: string,
            status:
                | "approved"
                | "rejected"
        ): Promise<void> => {

            if (!restaurantId) {

                toast.error(
                    "Restaurant ID is missing."
                );

                return;
            }


            try {

                setBtnLoading(
                    restaurantId
                );


                /* --------------------------------
                   Update Restaurant Status
                --------------------------------- */

                await api.put(
                    `/admin/restaurants/${restaurantId}/approve`,
                    {
                        status,
                    }
                );


                toast.success(
                    `Restaurant has been marked as ${status}.`
                );


                /* --------------------------------
                   Refresh Dashboard
                --------------------------------- */

                await fetchAdminData();

            } catch (
                error: unknown
            ) {

                console.error(
                    "Failed to update restaurant approval status:",
                    error
                );


                if (
                    typeof error ===
                        "object" &&
                    error !== null &&
                    "response" in error
                ) {

                    const axiosError =
                        error as {
                            response?: {
                                status?: number;
                                data?: {
                                    message?: string;
                                };
                            };
                        };


                    const statusCode =
                        axiosError
                            .response
                            ?.status;


                    const message =
                        axiosError
                            .response
                            ?.data
                            ?.message;


                    if (
                        statusCode === 401
                    ) {

                        toast.error(
                            "Your session has expired. Please login again."
                        );

                    } else if (
                        statusCode === 403
                    ) {

                        toast.error(
                            "You are not authorized to approve restaurants."
                        );

                    } else if (
                        statusCode === 404
                    ) {

                        toast.error(
                            message ||
                                "Restaurant not found."
                        );

                    } else if (
                        statusCode === 400
                    ) {

                        toast.error(
                            message ||
                                "Invalid approval status."
                        );

                    } else {

                        toast.error(
                            message ||
                                "Failed to update restaurant approval status."
                        );
                    }

                } else {

                    toast.error(
                        "Failed to update restaurant approval status."
                    );
                }

            } finally {

                setBtnLoading(
                    null
                );
            }
        };


    /* ----------------------------------------
       Initial API Call
    ----------------------------------------- */

    useEffect(() => {

        void fetchAdminData();

    }, [fetchAdminData]);


    /* ----------------------------------------
       Loading State
    ----------------------------------------- */

    if (loading) {

        return (
            <Loader
                text="Loading Admin Dashboard..."
            />
        );
    }


    /* ----------------------------------------
       Failed State
    ----------------------------------------- */

    if (!stats) {

        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">

                <Navbar />


                <main className="grow flex items-center justify-center px-6">

                    <div className="text-center">

                        <h2 className="font-display text-xl text-primary mb-2">
                            Unable to load admin dashboard
                        </h2>


                        <p className="text-sm text-black/55 mb-5">
                            We could not retrieve the
                            administrator data.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                void fetchAdminData()
                            }
                            className="px-5 py-2.5 bg-primary text-white text-xs uppercase tracking-wider rounded-sm cursor-pointer hover:opacity-90"
                        >
                            Try Again
                        </button>

                    </div>

                </main>


                <Footer />

            </div>
        );
    }


    /* ----------------------------------------
       Dashboard
    ----------------------------------------- */

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">

            <Navbar />


            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">


                {/* --------------------------------
                    Header
                --------------------------------- */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8">

                    <div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                            Admin Portal
                        </p>


                        <h1 className="font-display text-2xl md:text-3xl text-primary">
                            Dashboard
                        </h1>


                        <p className="text-xs text-black/55 mt-1.5">
                            Welcome back,{" "}
                            {user?.name ||
                                "Admin"}
                            .
                        </p>

                    </div>


                    {/* --------------------------------
                        Header Actions
                    --------------------------------- */}

                    <div className="flex items-center gap-3">

                        {/* User Management */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/users"
                                )
                            }
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-[10px] font-medium tracking-widest uppercase cursor-pointer hover:opacity-90 transition-opacity"
                        >

                            <Users
                                size={14}
                            />

                            User Management

                        </button>


                        {/* Sign Out */}

                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 bg-error-container text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase cursor-pointer hover:opacity-90 transition-opacity"
                        >

                            <LogOut
                                size={14}
                            />

                            Sign Out

                        </button>

                    </div>

                </div>


                {/* --------------------------------
                    Quick User Management Card
                --------------------------------- */}

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                        className="group w-full text-left"
                    >

                        <div className="border border-outline-variant/10 bg-white p-5 md:p-6 transition-all hover:border-primary/30 hover:shadow-sm">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-11 w-11 items-center justify-center bg-primary text-white">

                                        <UserCog
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="font-display text-lg text-primary">
                                            User Management
                                        </h2>

                                        <p className="text-xs text-black/50 mt-1">
                                            Manage users and change their roles between User, Owner and Admin.
                                        </p>

                                    </div>

                                </div>


                                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-secondary group-hover:text-primary">
                                    Manage →
                                </span>

                            </div>

                        </div>

                    </button>

                </div>


                {/* --------------------------------
                    Navigation Tabs
                --------------------------------- */}

                <div className="flex items-center gap-2 border-b border-outline-variant/10 mb-8">

                    {/* Statistics */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab(
                                "stats"
                            )
                        }
                        className={`flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                            activeTab ===
                            "stats"
                                ? "text-primary border-b-2 border-primary"
                                : "text-black/50 hover:text-primary"
                        }`}
                    >

                        <BarChart3
                            size={15}
                        />

                        Statistics

                    </button>


                    {/* Restaurant Approvals */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab(
                                "approvals"
                            )
                        }
                        className={`px-5 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                            activeTab ===
                            "approvals"
                                ? "text-primary border-b-2 border-primary"
                                : "text-black/50 hover:text-primary"
                        }`}
                    >

                        Restaurant Approvals

                    </button>

                </div>


                {/* --------------------------------
                    Statistics
                --------------------------------- */}

                {activeTab ===
                    "stats" && (

                    <AdminStats
                        stats={stats}
                    />

                )}


                {/* --------------------------------
                    Restaurant Approvals
                --------------------------------- */}

                {activeTab ===
                    "approvals" && (

                    <AdminApprovals
                        restaurants={
                            restaurants
                        }
                        onStatusChange={
                            handleApproveStatus
                        }
                        loadingId={
                            btnLoading
                        }
                    />

                )}

            </main>


            <Footer />

        </div>
    );
}