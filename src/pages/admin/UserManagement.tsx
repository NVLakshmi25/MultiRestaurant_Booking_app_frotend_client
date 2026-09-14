import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    RefreshCw,
    Shield,
    UserCog,
    Users,
    AlertCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    useNavigate,
} from "react-router-dom";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import { useAppContext } from "../../context/AppContext";

import api from "../../lib/api";


/* ----------------------------------------
   User Role
----------------------------------------- */

type UserRole =
    | "user"
    | "owner"
    | "admin";


/* ----------------------------------------
   User Interface
----------------------------------------- */

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}


/* ----------------------------------------
   API Response
----------------------------------------- */

interface UsersResponse {
    success: boolean;
    count: number;
    users: AdminUser[];
}


interface UpdateRoleResponse {
    success: boolean;
    message: string;
    user: AdminUser;
}


export default function UserManagement() {

    /* ----------------------------------------
       Context
    ----------------------------------------- */

    const {
        user: currentUser,
    } = useAppContext();


    /* ----------------------------------------
       Navigation
    ----------------------------------------- */

    const navigate =
        useNavigate();


    /* ----------------------------------------
       State
    ----------------------------------------- */

    const [users, setUsers] =
        useState<AdminUser[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [updatingUserId, setUpdatingUserId] =
        useState<string | null>(
            null
        );

    const [error, setError] =
        useState<string>("");


    /* ----------------------------------------
       Fetch Users
    ----------------------------------------- */

    const fetchUsers =
        useCallback(
            async (): Promise<void> => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await api.get<UsersResponse>(
                            "/admin/users"
                        );


                    setUsers(
                        response.data.users ||
                            []
                    );

                } catch (
                    error: any
                ) {

                    console.error(
                        "Failed to fetch users:",
                        error
                    );


                    const status =
                        error?.response
                            ?.status;

                    const message =
                        error?.response
                            ?.data
                            ?.message;


                    if (
                        status === 401
                    ) {

                        setError(
                            "Your session has expired. Please login again."
                        );

                    } else if (
                        status === 403
                    ) {

                        setError(
                            "Admin access is required."
                        );

                    } else {

                        setError(
                            message ||
                                "Failed to load users."
                        );
                    }

                } finally {

                    setLoading(false);
                }

            },
            []
        );


    /* ----------------------------------------
       Initial Load
    ----------------------------------------- */

    useEffect(() => {

        void fetchUsers();

    }, [fetchUsers]);


    /* ----------------------------------------
       Change Role
    ----------------------------------------- */

    const handleRoleChange =
        async (
            userId: string,
            newRole: UserRole
        ): Promise<void> => {

            try {

                setUpdatingUserId(
                    userId
                );

                setError("");


                /* --------------------------------
                   Update Role
                --------------------------------- */

                const response =
                    await api.put<UpdateRoleResponse>(
                        `/admin/users/${userId}/role`,
                        {
                            role: newRole,
                        }
                    );


                const updatedUser =
                    response.data.user;


                /* --------------------------------
                   Update UI Immediately
                --------------------------------- */

                setUsers(
                    (
                        previousUsers
                    ) =>
                        previousUsers.map(
                            (
                                existingUser
                            ) =>
                                existingUser._id ===
                                updatedUser._id
                                    ? {
                                          ...existingUser,
                                          role:
                                              updatedUser.role,
                                      }
                                    : existingUser
                        )
                );


                /* --------------------------------
                   Success Toast
                --------------------------------- */

                toast.success(
                    response.data.message
                );

            } catch (
                error: any
            ) {

                console.error(
                    "Failed to update user role:",
                    error
                );


                const status =
                    error?.response
                        ?.status;

                const message =
                    error?.response
                        ?.data
                        ?.message;


                if (
                    status === 400
                ) {

                    toast.error(
                        message ||
                            "Invalid role change."
                    );

                } else if (
                    status === 401
                ) {

                    toast.error(
                        "Your session has expired. Please login again."
                    );

                } else if (
                    status === 403
                ) {

                    toast.error(
                        "Only administrators can change user roles."
                    );

                } else if (
                    status === 404
                ) {

                    toast.error(
                        "User not found."
                    );

                } else {

                    toast.error(
                        message ||
                            "Failed to update user role."
                    );
                }


                /*
                 * Reload database state
                 * after failed update.
                 */

                await fetchUsers();

            } finally {

                setUpdatingUserId(
                    null
                );
            }
        };


    /* ----------------------------------------
       Format Date
    ----------------------------------------- */

    const formatDate =
        (
            date?: string
        ): string => {

            if (!date) {
                return "N/A";
            }


            return new Date(
                date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        };


    /* ----------------------------------------
       Role Badge
    ----------------------------------------- */

    const getRoleBadge =
        (
            role: UserRole
        ) => {

            switch (
                role
            ) {

                case "admin":

                    return (
                        <span className="inline-flex items-center gap-1.5 bg-error-container text-error px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider">

                            <Shield
                                size={13}
                            />

                            Admin

                        </span>
                    );


                case "owner":

                    return (
                        <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider">

                            <UserCog
                                size={13}
                            />

                            Owner

                        </span>
                    );


                default:

                    return (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider">

                            <Users
                                size={13}
                            />

                            User

                        </span>
                    );
            }
        };


    /* ----------------------------------------
       Statistics
    ----------------------------------------- */

    const totalUsers =
        users.length;


    const totalNormalUsers =
        users.filter(
            (item) =>
                item.role === "user"
        ).length;


    const totalOwners =
        users.filter(
            (item) =>
                item.role === "owner"
        ).length;


    const totalAdmins =
        users.filter(
            (item) =>
                item.role === "admin"
        ).length;


    /* ----------------------------------------
       Loading
    ----------------------------------------- */

    if (loading) {

        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">

                <Navbar />

                <main className="grow flex items-center justify-center">

                    <div className="flex flex-col items-center gap-3 text-black/50">

                        <Loader2
                            size={32}
                            className="animate-spin"
                        />

                        <p className="text-xs uppercase tracking-widest">
                            Loading Users...
                        </p>

                    </div>

                </main>

                <Footer />

            </div>
        );
    }


    /* ----------------------------------------
       Page
    ----------------------------------------- */

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">

            <Navbar />


            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">


                {/* --------------------------------
                    Header
                --------------------------------- */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-outline-variant/10 pb-8 mb-8">

                    <div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/dashboard"
                                )
                            }
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black/50 hover:text-primary mb-4 transition-colors"
                        >

                            <ArrowLeft
                                size={14}
                            />

                            Back to Dashboard

                        </button>


                        <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium mb-2">
                            Admin Portal
                        </p>


                        <h1 className="font-display text-2xl md:text-3xl text-primary">
                            User Management
                        </h1>


                        <p className="text-xs text-black/55 mt-1.5">
                            Manage registered users and their access roles.
                        </p>

                    </div>


                    {/* Refresh */}

                    <button
                        type="button"
                        onClick={() =>
                            void fetchUsers()
                        }
                        disabled={loading}
                        className="flex items-center justify-center gap-2 border border-outline-variant/20 bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                    >

                        <RefreshCw
                            size={14}
                        />

                        Refresh Users

                    </button>

                </div>


                {/* --------------------------------
                    Error
                --------------------------------- */}

                {error && (

                    <div className="mb-8 flex items-center gap-3 border border-error/20 bg-error-container px-4 py-3 text-xs text-error">

                        <AlertCircle
                            size={17}
                        />

                        {error}

                    </div>

                )}


                {/* --------------------------------
                    Statistics Cards
                --------------------------------- */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


                    {/* Total */}

                    <div className="bg-white border border-outline-variant/10 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-[10px] uppercase tracking-widest text-black/45">
                                    Total Users
                                </p>

                                <p className="font-display text-2xl text-primary mt-2">
                                    {
                                        totalUsers
                                    }
                                </p>

                            </div>


                            <Users
                                size={22}
                                className="text-black/30"
                            />

                        </div>

                    </div>


                    {/* Normal Users */}

                    <div className="bg-white border border-outline-variant/10 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-[10px] uppercase tracking-widest text-black/45">
                                    Users
                                </p>

                                <p className="font-display text-2xl text-primary mt-2">
                                    {
                                        totalNormalUsers
                                    }
                                </p>

                            </div>


                            <Users
                                size={22}
                                className="text-black/30"
                            />

                        </div>

                    </div>


                    {/* Owners */}

                    <div className="bg-white border border-outline-variant/10 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-[10px] uppercase tracking-widest text-black/45">
                                    Owners
                                </p>

                                <p className="font-display text-2xl text-purple-700 mt-2">
                                    {
                                        totalOwners
                                    }
                                </p>

                            </div>


                            <UserCog
                                size={22}
                                className="text-purple-300"
                            />

                        </div>

                    </div>


                    {/* Admins */}

                    <div className="bg-white border border-outline-variant/10 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-[10px] uppercase tracking-widest text-black/45">
                                    Admins
                                </p>

                                <p className="font-display text-2xl text-error mt-2">
                                    {
                                        totalAdmins
                                    }
                                </p>

                            </div>


                            <Shield
                                size={22}
                                className="text-error/40"
                            />

                        </div>

                    </div>

                </div>


                {/* --------------------------------
                    User Table
                --------------------------------- */}

                <div className="bg-white border border-outline-variant/10">


                    {/* Table Header */}

                    <div className="px-5 md:px-6 py-5 border-b border-outline-variant/10">

                        <div className="flex items-center gap-3">

                            <Users
                                size={18}
                                className="text-primary"
                            />

                            <div>

                                <h2 className="font-display text-lg text-primary">
                                    Registered Users
                                </h2>

                                <p className="text-[11px] text-black/45 mt-1">
                                    Change user roles dynamically without editing MongoDB manually.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Empty State */}

                    {users.length ===
                    0 ? (

                        <div className="py-20 text-center">

                            <Users
                                size={35}
                                className="mx-auto text-black/20 mb-3"
                            />

                            <p className="text-sm text-black/50">
                                No users found.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead>

                                    <tr className="border-b border-outline-variant/10 bg-black/[0.015]">

                                        <th className="px-5 md:px-6 py-3 text-left text-[10px] uppercase tracking-widest font-medium text-black/45">
                                            User
                                        </th>

                                        <th className="px-5 md:px-6 py-3 text-left text-[10px] uppercase tracking-widest font-medium text-black/45">
                                            Phone
                                        </th>

                                        <th className="px-5 md:px-6 py-3 text-left text-[10px] uppercase tracking-widest font-medium text-black/45">
                                            Current Role
                                        </th>

                                        <th className="px-5 md:px-6 py-3 text-left text-[10px] uppercase tracking-widest font-medium text-black/45">
                                            Change Role
                                        </th>

                                        <th className="px-5 md:px-6 py-3 text-left text-[10px] uppercase tracking-widest font-medium text-black/45">
                                            Joined
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {users.map(
                                        (
                                            item
                                        ) => {

                                            const isCurrentUser =
                                                currentUser?._id ===
                                                item._id;


                                            const isUpdating =
                                                updatingUserId ===
                                                item._id;


                                            return (

                                                <tr
                                                    key={
                                                        item._id
                                                    }
                                                    className="border-b border-outline-variant/10 last:border-b-0 hover:bg-black/[0.015] transition-colors"
                                                >

                                                    {/* User */}

                                                    <td className="px-5 md:px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-10 h-10 flex items-center justify-center bg-primary text-white text-sm font-medium">

                                                                {item.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <p className="text-sm font-medium text-primary">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </p>

                                                                <p className="text-[11px] text-black/45 mt-1">
                                                                    {
                                                                        item.email
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* Phone */}

                                                    <td className="px-5 md:px-6 py-5 text-xs text-black/55">

                                                        {
                                                            item.phone ||
                                                            "N/A"
                                                        }

                                                    </td>


                                                    {/* Current Role */}

                                                    <td className="px-5 md:px-6 py-5">

                                                        {getRoleBadge(
                                                            item.role
                                                        )}


                                                        {isCurrentUser && (

                                                            <p className="text-[9px] uppercase tracking-wider text-black/35 mt-2">
                                                                Your account
                                                            </p>

                                                        )}

                                                    </td>


                                                    {/* Change Role */}

                                                    <td className="px-5 md:px-6 py-5">

                                                        {isCurrentUser ? (

                                                            <span className="text-[10px] uppercase tracking-wider text-black/35">
                                                                Cannot change own role
                                                            </span>

                                                        ) : (

                                                            <div className="flex items-center gap-2">

                                                                <select
                                                                    value={
                                                                        item.role
                                                                    }
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        void handleRoleChange(
                                                                            item._id,
                                                                            event
                                                                                .target
                                                                                .value as UserRole
                                                                        )
                                                                    }
                                                                    className="min-w-[120px] border border-outline-variant/20 bg-white px-3 py-2 text-xs text-primary outline-none focus:border-primary disabled:opacity-50"
                                                                >

                                                                    <option value="user">
                                                                        User
                                                                    </option>

                                                                    <option value="owner">
                                                                        Owner
                                                                    </option>

                                                                    <option value="admin">
                                                                        Admin
                                                                    </option>

                                                                </select>


                                                                {isUpdating && (

                                                                    <Loader2
                                                                        size={15}
                                                                        className="animate-spin text-black/40"
                                                                    />

                                                                )}

                                                            </div>

                                                        )}

                                                    </td>


                                                    {/* Joined */}

                                                    <td className="px-5 md:px-6 py-5 text-xs text-black/45">

                                                        {
                                                            formatDate(
                                                                item.createdAt
                                                            )
                                                        }

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


                {/* --------------------------------
                    Information
                --------------------------------- */}

                <div className="mt-6 flex items-start gap-3 border border-outline-variant/10 bg-white px-5 py-4">

                    <CheckCircle
                        size={17}
                        className="mt-0.5 text-secondary shrink-0"
                    />

                    <div>

                        <p className="text-xs font-medium text-primary">
                            Role changes are saved automatically.
                        </p>

                        <p className="text-[11px] text-black/45 mt-1 leading-relaxed">
                            New registrations always receive the User role.
                            Only administrators can promote users to Owner or Admin.
                            You cannot change your own administrator role.
                        </p>

                    </div>

                </div>

            </main>


            <Footer />

        </div>
    );
}