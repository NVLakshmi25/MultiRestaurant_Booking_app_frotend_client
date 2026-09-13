import type { ReactNode } from "react";

import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    ShieldAlert,
} from "lucide-react";

import {
    useAppContext,
    type UserRole,
} from "../context/AppContext";

import AuthModal from "./AuthModal";
import Loader from "./Loader";


// =====================================================
// PROTECTED ROUTE PROPS
// =====================================================

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}


// =====================================================
// PROTECTED ROUTE
// =====================================================

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {

    const {
        user,
        loading,
        isAuthenticated,
        setAuthModalOpen,
    } = useAppContext();


    const location = useLocation();


    // =================================================
    // DEBUG - PROTECTED ROUTE INITIAL STATE
    // =================================================

    console.log(
        "=========================================="
    );

    console.log(
        "PROTECTED ROUTE CHECK"
    );

    console.log(
        "Current Path:",
        location.pathname
    );

    console.log(
        "Loading:",
        loading
    );

    console.log(
        "Is Authenticated:",
        isAuthenticated
    );

    console.log(
        "User:",
        user
    );

    console.log(
        "Allowed Roles:",
        allowedRoles
    );


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        console.log(
            "PROTECTED ROUTE RESULT: LOADING"
        );

        return (
            <Loader
                text="Loading Panel Access..."
            />
        );
    }


    // =================================================
    // NOT AUTHENTICATED
    // =================================================

    if (
        !isAuthenticated ||
        !user
    ) {

        console.log(
            "PROTECTED ROUTE RESULT: NOT AUTHENTICATED"
        );

        console.log(
            "User:",
            user
        );

        return (
            <div
                className="
                    min-h-screen
                    bg-surface
                    flex
                    flex-col
                    items-center
                    justify-center
                    p-6
                    text-center
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        rounded-lg
                        border
                        border-outline-variant/20
                        bg-white
                        p-10
                        ambient-shadow
                        flex
                        flex-col
                        items-center
                    "
                >

                    {/* Icon */}

                    <ShieldAlert
                        size={40}
                        className="
                            mb-6
                            text-secondary
                        "
                    />


                    {/* Title */}

                    <h2
                        className="
                            mb-3
                            font-display
                            text-2xl
                            text-primary
                        "
                    >
                        Login to continue
                    </h2>


                    {/* Message */}

                    <p
                        className="
                            mb-8
                            text-sm
                            leading-relaxed
                            text-black/70
                        "
                    >
                        You need to be logged in
                        to access this page.
                    </p>


                    {/* Login Button */}

                    <button
                        type="button"
                        onClick={() =>
                            setAuthModalOpen(true)
                        }
                        className="
                            w-full
                            cursor-pointer
                            bg-primary
                            px-4
                            py-3.5
                            text-xs
                            font-medium
                            uppercase
                            tracking-widest
                            text-white
                            transition-colors
                            hover:bg-primary-container
                            hover:text-secondary
                            focus:outline-none
                        "
                    >
                        AUTHENTICATE
                    </button>


                    {/* Auth Modal */}

                    <AuthModal />

                </div>

            </div>
        );
    }


    // =================================================
    // CURRENT USER ROLE
    // =================================================

    const currentRole =
        String(
            user.role ?? "",
        )
            .trim()
            .toLowerCase() as UserRole;


    // =================================================
    // DEBUG - ROLE INFORMATION
    // =================================================

    console.log(
        "------------------------------------------"
    );

    console.log(
        "USER ROLE DEBUG"
    );

    console.log(
        "User ID:",
        user._id
    );

    console.log(
        "User Name:",
        user.name
    );

    console.log(
        "User Email:",
        user.email
    );

    console.log(
        "User Role From Context:",
        user.role
    );

    console.log(
        "Current Role After Normalize:",
        currentRole
    );

    console.log(
        "Allowed Roles:",
        allowedRoles
    );


    // =================================================
    // NO ROLE RESTRICTION
    // =================================================

    if (!allowedRoles) {

        console.log(
            "ROLE CHECK: No role restriction"
        );

        console.log(
            "PROTECTED ROUTE RESULT: AUTHORIZED"
        );

        return (
            <>
                {children}
            </>
        );
    }


    // =================================================
    // CHECK ROLE
    // =================================================

    const hasPermission =
        allowedRoles.some(
            (role) => {

                const normalizedAllowedRole =
                    role
                        .toLowerCase()
                        .trim();

                const matched =
                    normalizedAllowedRole ===
                    currentRole;

                console.log(
                    "Role Comparison:",
                    {
                        allowedRole:
                            normalizedAllowedRole,

                        currentRole:
                            currentRole,

                        matched:
                            matched,
                    }
                );

                return matched;
            }
        );


    // =================================================
    // DEBUG - FINAL PERMISSION
    // =================================================

    console.log(
        "Has Permission:",
        hasPermission
    );


    // =================================================
    // ROLE NOT AUTHORIZED
    // =================================================

    if (!hasPermission) {

        console.log(
            "PROTECTED ROUTE RESULT: ACCESS DENIED"
        );


        // ---------------------------------------------
        // Fallback dashboard
        // ---------------------------------------------

        let fallbackPath =
            "/dashboard";


        if (
            currentRole === "owner"
        ) {

            fallbackPath =
                "/owner/dashboard";

        } else if (
            currentRole === "admin"
        ) {

            fallbackPath =
                "/admin/dashboard";
        }


        console.log(
            "Current Role:",
            currentRole
        );

        console.log(
            "Redirecting To:",
            fallbackPath
        );


        return (
            <Navigate
                to={fallbackPath}
                replace
                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }


    // =================================================
    // AUTHORIZED
    // =================================================

    console.log(
        "PROTECTED ROUTE RESULT: AUTHORIZED"
    );

    console.log(
        "Showing Protected Page:",
        location.pathname
    );

    console.log(
        "=========================================="
    );


    return (
        <>
            {children}
        </>
    );
}