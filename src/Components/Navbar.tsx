import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    CalendarDays,
    ShieldCheck,
    Store,
} from "lucide-react";

import {
    useAppContext,
} from "../context/AppContext";

import AuthModal from "./AuthModal";


// =====================================================
// COMPONENT
// =====================================================

export default function Navbar() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const {
        user,
        logout,
        setAuthModalOpen,
    } = useAppContext();


    // =================================================
    // STATE
    // =================================================

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    const [isUserMenuOpen, setIsUserMenuOpen] =
        useState(false);


    // =================================================
    // USER ROLE
    // =================================================

    const userRole =
        String(
            user?.role ?? "user",
        )
            .trim()
            .toLowerCase();


    const isOwner =
        userRole === "owner";


    const isAdmin =
        userRole === "admin";


    // =================================================
    // DASHBOARD PATH
    // =================================================

    const getDashboardPath = () => {

        switch (userRole) {

            case "admin":
                return "/admin/dashboard";

            case "owner":
                return "/owner/dashboard";

            default:
                return "/dashboard";
        }
    };


    // =================================================
    // DASHBOARD LABEL
    // =================================================

    const getDashboardLabel = () => {

        switch (userRole) {

            case "admin":
                return "Admin Dashboard";

            case "owner":
                return "Owner Dashboard";

            default:
                return "My Bookings";
        }
    };


    const dashboardPath =
        getDashboardPath();


    const dashboardLabel =
        getDashboardLabel();


    // =================================================
    // DASHBOARD CLICK
    // =================================================

    const handleDashboardClick = () => {

        // If user is not logged in,
        // open authentication modal.

        if (!user) {

            setAuthModalOpen(true);

            return;
        }


        // Navigate according to role.

        navigate(dashboardPath);


        // Close menus.

        setIsUserMenuOpen(false);

        setIsMobileMenuOpen(false);
    };


    // =================================================
    // LOGIN
    // =================================================

    const handleLogin = () => {

        setAuthModalOpen(true);

        setIsMobileMenuOpen(false);

        setIsUserMenuOpen(false);
    };


    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout = () => {

        setIsUserMenuOpen(false);

        setIsMobileMenuOpen(false);

        logout();
    };


    // =================================================
    // CLOSE MENUS WHEN ROUTE CHANGES
    // =================================================

    useEffect(() => {

        setIsMobileMenuOpen(false);

        setIsUserMenuOpen(false);

    }, [location.pathname]);


    // =================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =================================================

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent,
        ) => {

            const target =
                event.target as HTMLElement;


            if (
                !target.closest(
                    "[data-user-menu]",
                )
            ) {

                setIsUserMenuOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };

    }, []);


    // =================================================
    // ACTIVE LINK
    // =================================================

    const isActive = (
        path: string,
    ) => {

        return location.pathname === path;
    };


    // =================================================
    // UI
    // =================================================

    return (
        <>

            {/* =========================================
                NAVBAR
            ========================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-50
                    border-b
                    border-outline-variant/20
                    bg-surface/95
                    backdrop-blur-md
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-20
                        max-w-7xl
                        items-center
                        justify-between
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    {/* =================================
                        LOGO
                    ================================== */}

                    <Link
                        to="/"
                        className="
                            flex
                            items-center
                            gap-2
                            shrink-0
                        "
                    >

                        <span
                            className="
                                font-display
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-primary
                            "
                        >
                            QuickDine
                        </span>

                    </Link>


                    {/* =================================
                        DESKTOP NAVIGATION
                    ================================== */}

                    <nav
                        className="
                            hidden
                            items-center
                            gap-8
                            md:flex
                        "
                    >

                        <Link
                            to="/"
                            className={`
                                text-sm
                                transition-colors
                                ${
                                    isActive("/")
                                        ? "font-medium text-primary"
                                        : "text-black/60 hover:text-primary"
                                }
                            `}
                        >
                            Home
                        </Link>


                        <Link
                            to="/search"
                            className={`
                                text-sm
                                transition-colors
                                ${
                                    isActive("/search")
                                        ? "font-medium text-primary"
                                        : "text-black/60 hover:text-primary"
                                }
                            `}
                        >
                            Restaurants
                        </Link>

                    </nav>


                    {/* =================================
                        DESKTOP RIGHT SIDE
                    ================================== */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-3
                            md:flex
                        "
                    >

                        {/* ---------------------------------
                            NOT LOGGED IN
                        ---------------------------------- */}

                        {!user && (

                            <button
                                type="button"
                                onClick={handleLogin}
                                className="
                                    rounded-md
                                    border
                                    border-primary
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-primary
                                    transition
                                    hover:bg-primary
                                    hover:text-white
                                "
                            >
                                Sign In
                            </button>
                        )}


                        {/* ---------------------------------
                            LOGGED IN
                        ---------------------------------- */}

                        {user && (

                            <>

                                {/* Dashboard Button */}

                                <button
                                    type="button"
                                    onClick={
                                        handleDashboardClick
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-md
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-medium
                                        text-black/70
                                        transition
                                        hover:bg-black/5
                                        hover:text-primary
                                    "
                                >

                                    {isAdmin ? (
                                        <ShieldCheck
                                            size={16}
                                        />
                                    ) : isOwner ? (
                                        <Store
                                            size={16}
                                        />
                                    ) : (
                                        <CalendarDays
                                            size={16}
                                        />
                                    )}

                                    {dashboardLabel}

                                </button>


                                {/* User Dropdown */}

                                <div
                                    className="
                                        relative
                                    "
                                    data-user-menu
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsUserMenuOpen(
                                                (previous) =>
                                                    !previous,
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-md
                                            border
                                            border-black/10
                                            px-3
                                            py-2
                                            transition
                                            hover:border-primary
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-primary
                                                text-white
                                            "
                                        >
                                            <User size={16} />
                                        </div>


                                        <span
                                            className="
                                                max-w-28
                                                truncate
                                                text-sm
                                                font-medium
                                                text-primary
                                            "
                                        >
                                            {user.name}
                                        </span>


                                        <ChevronDown
                                            size={15}
                                            className={`
                                                transition-transform
                                                ${
                                                    isUserMenuOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }
                                            `}
                                        />

                                    </button>


                                    {/* Dropdown */}

                                    {isUserMenuOpen && (

                                        <div
                                            className="
                                                absolute
                                                right-0
                                                top-full
                                                mt-2
                                                w-60
                                                overflow-hidden
                                                rounded-md
                                                border
                                                border-black/10
                                                bg-white
                                                shadow-xl
                                            "
                                        >

                                            {/* User info */}

                                            <div
                                                className="
                                                    border-b
                                                    border-black/10
                                                    px-4
                                                    py-4
                                                "
                                            >

                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-primary
                                                    "
                                                >
                                                    {user.name}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-xs
                                                        text-black/50
                                                    "
                                                >
                                                    {user.email}
                                                </p>


                                                <span
                                                    className="
                                                        mt-2
                                                        inline-block
                                                        rounded-full
                                                        bg-black/5
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wider
                                                        text-black/60
                                                    "
                                                >
                                                    {userRole}
                                                </span>

                                            </div>


                                            {/* Dashboard */}

                                            <button
                                                type="button"
                                                onClick={
                                                    handleDashboardClick
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    px-4
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    text-black/70
                                                    transition
                                                    hover:bg-black/5
                                                    hover:text-primary
                                                "
                                            >

                                                {isAdmin ? (
                                                    <ShieldCheck
                                                        size={17}
                                                    />
                                                ) : isOwner ? (
                                                    <Store
                                                        size={17}
                                                    />
                                                ) : (
                                                    <CalendarDays
                                                        size={17}
                                                    />
                                                )}

                                                {dashboardLabel}

                                            </button>


                                            {/* Owner Panel */}

                                            {isOwner && (

                                                <button
                                                    type="button"
                                                    onClick={() => {

                                                        navigate(
                                                            "/owner/dashboard",
                                                        );

                                                        setIsUserMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        px-4
                                                        py-3
                                                        text-left
                                                        text-sm
                                                        text-black/70
                                                        transition
                                                        hover:bg-black/5
                                                        hover:text-primary
                                                    "
                                                >

                                                    <Store
                                                        size={17}
                                                    />

                                                    Owner Panel

                                                </button>
                                            )}


                                            {/* Admin Panel */}

                                            {isAdmin && (

                                                <button
                                                    type="button"
                                                    onClick={() => {

                                                        navigate(
                                                            "/admin/dashboard",
                                                        );

                                                        setIsUserMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        px-4
                                                        py-3
                                                        text-left
                                                        text-sm
                                                        text-black/70
                                                        transition
                                                        hover:bg-black/5
                                                        hover:text-primary
                                                    "
                                                >

                                                    <ShieldCheck
                                                        size={17}
                                                    />

                                                    Admin Panel

                                                </button>
                                            )}


                                            {/* Logout */}

                                            <button
                                                type="button"
                                                onClick={
                                                    handleLogout
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    border-t
                                                    border-black/10
                                                    px-4
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    text-red-600
                                                    transition
                                                    hover:bg-red-50
                                                "
                                            >

                                                <LogOut
                                                    size={17}
                                                />

                                                Logout

                                            </button>

                                        </div>
                                    )}

                                </div>

                            </>
                        )}

                    </div>


                    {/* =================================
                        MOBILE MENU BUTTON
                    ================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(
                                (previous) =>
                                    !previous,
                            )
                        }
                        className="
                            rounded-md
                            p-2
                            text-primary
                            md:hidden
                        "
                        aria-label="Toggle menu"
                    >

                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}

                    </button>

                </div>


                {/* =====================================
                    MOBILE MENU
                ====================================== */}

                {isMobileMenuOpen && (

                    <div
                        className="
                            border-t
                            border-black/10
                            bg-white
                            px-4
                            py-5
                            md:hidden
                        "
                    >

                        <nav
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >

                            {/* Home */}

                            <Link
                                to="/"
                                className="
                                    rounded-md
                                    px-4
                                    py-3
                                    text-sm
                                    text-black/70
                                    hover:bg-black/5
                                    hover:text-primary
                                "
                            >
                                Home
                            </Link>


                            {/* Restaurants */}

                            <Link
                                to="/search"
                                className="
                                    rounded-md
                                    px-4
                                    py-3
                                    text-sm
                                    text-black/70
                                    hover:bg-black/5
                                    hover:text-primary
                                "
                            >
                                Restaurants
                            </Link>


                            {/* --------------------------------
                                LOGGED IN
                            --------------------------------- */}

                            {user && (

                                <>

                                    {/* Dashboard */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleDashboardClick
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-md
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-black/70
                                            hover:bg-black/5
                                            hover:text-primary
                                        "
                                    >

                                        {isAdmin ? (
                                            <ShieldCheck
                                                size={17}
                                            />
                                        ) : isOwner ? (
                                            <Store
                                                size={17}
                                            />
                                        ) : (
                                            <CalendarDays
                                                size={17}
                                            />
                                        )}

                                        {dashboardLabel}

                                    </button>


                                    {/* Owner */}

                                    {isOwner && (

                                        <button
                                            type="button"
                                            onClick={() => {

                                                navigate(
                                                    "/owner/dashboard",
                                                );

                                                setIsMobileMenuOpen(
                                                    false,
                                                );
                                            }}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-md
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                text-black/70
                                                hover:bg-black/5
                                                hover:text-primary
                                            "
                                        >

                                            <Store
                                                size={17}
                                            />

                                            Owner Panel

                                        </button>
                                    )}


                                    {/* Admin */}

                                    {isAdmin && (

                                        <button
                                            type="button"
                                            onClick={() => {

                                                navigate(
                                                    "/admin/dashboard",
                                                );

                                                setIsMobileMenuOpen(
                                                    false,
                                                );
                                            }}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-md
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                text-black/70
                                                hover:bg-black/5
                                                hover:text-primary
                                            "
                                        >

                                            <ShieldCheck
                                                size={17}
                                            />

                                            Admin Panel

                                        </button>
                                    )}


                                    {/* Logout */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="
                                            mt-2
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            border-t
                                            border-black/10
                                            px-4
                                            py-4
                                            text-left
                                            text-sm
                                            text-red-600
                                        "
                                    >

                                        <LogOut
                                            size={17}
                                        />

                                        Logout

                                    </button>

                                </>
                            )}


                            {/* --------------------------------
                                NOT LOGGED IN
                            --------------------------------- */}

                            {!user && (

                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="
                                        mt-3
                                        w-full
                                        rounded-md
                                        bg-primary
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-white
                                    "
                                >
                                    Sign In
                                </button>
                            )}

                        </nav>

                    </div>
                )}

            </header>


            {/* =========================================
                AUTH MODAL
            ========================================== */}

            <AuthModal />

        </>
    );
}