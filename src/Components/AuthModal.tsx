import {
    useEffect,
    useState,
    type FormEvent,
} from "react";

import {
    X,
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    Phone,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAppContext,
} from "../context/AppContext";


export default function AuthModal() {

    const navigate = useNavigate();

    const {
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        registerOwner,
        loading,
    } = useAppContext();


    // =================================================
    // MODE
    // =================================================

    const [isLogin, setIsLogin] =
        useState(true);


    // =================================================
    // REGISTRATION TYPE
    // =================================================

    const [accountType, setAccountType] =
        useState<"user" | "owner">("user");


    // =================================================
    // FORM DATA
    // =================================================

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [phone, setPhone] =
        useState("");


    // =================================================
    // PASSWORD VISIBILITY
    // =================================================

    const [showPassword, setShowPassword] =
        useState(false);


    // =================================================
    // RESET FORM
    // =================================================

    const resetForm = () => {

        setName("");

        setEmail("");

        setPassword("");

        setPhone("");

        setShowPassword(false);

        setAccountType("user");
    };


    // =================================================
    // CLOSE MODAL
    // =================================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        setAuthModalOpen(false);

        resetForm();
    };


    // =================================================
    // SWITCH LOGIN / REGISTER
    // =================================================

    const handleModeChange = (
        loginMode: boolean,
    ) => {

        if (loading) {
            return;
        }

        setIsLogin(loginMode);

        resetForm();
    };


    // =================================================
    // ESCAPE KEY
    // =================================================

    useEffect(() => {

        if (!isAuthModalOpen) {
            return;
        }


        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {

            if (
                event.key === "Escape" &&
                !loading
            ) {
                handleClose();
            }
        };


        window.addEventListener(
            "keydown",
            handleKeyDown,
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };

    }, [
        isAuthModalOpen,
        loading,
    ]);


    // =================================================
    // FORM SUBMIT
    // =================================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {

        event.preventDefault();


        // =================================================
        // CLEAN VALUES
        // =================================================

        const trimmedName =
            name.trim();

        const trimmedEmail =
            email.trim().toLowerCase();

        const trimmedPhone =
            phone.trim();


        // =================================================
        // LOGIN
        // =================================================

        if (isLogin) {

            if (
                !trimmedEmail ||
                !password
            ) {
                return;
            }


            const success =
                await login(
                    trimmedEmail,
                    password,
                );


            if (success) {

                const savedUser =
                    localStorage.getItem(
                        "user",
                    );


                if (!savedUser) {

                    console.error(
                        "User was not available after login.",
                    );

                    return;
                }


                try {

                    const parsedUser =
                        JSON.parse(
                            savedUser,
                        );


                    const role =
                        String(
                            parsedUser?.role ||
                            "user",
                        )
                            .trim()
                            .toLowerCase();


                    console.log(
                        "USER AFTER LOGIN:",
                        parsedUser,
                    );

                    console.log(
                        "FINAL AUTHORITATIVE ROLE:",
                        role,
                    );


                    setAuthModalOpen(false);

                    resetForm();


                    // =====================================
                    // ROLE BASED REDIRECT
                    // =====================================

                    switch (role) {

                        case "admin":

                            console.log(
                                "REDIRECT → /admin/dashboard",
                            );

                            navigate(
                                "/admin/dashboard",
                                {
                                    replace: true,
                                },
                            );

                            break;


                        case "owner":

                            console.log(
                                "REDIRECT → /owner/dashboard",
                            );

                            navigate(
                                "/owner/dashboard",
                                {
                                    replace: true,
                                },
                            );

                            break;


                        case "user":

                            console.log(
                                "REDIRECT → /dashboard",
                            );

                            navigate(
                                "/dashboard",
                                {
                                    replace: true,
                                },
                            );

                            break;


                        default:

                            console.error(
                                "UNKNOWN ROLE:",
                                role,
                            );

                            navigate(
                                "/dashboard",
                                {
                                    replace: true,
                                },
                            );

                            break;
                    }

                } catch (error) {

                    console.error(
                        "Failed to parse logged-in user:",
                        error,
                    );
                }
            }


            return;
        }


        // =================================================
        // REGISTER
        // =================================================

        if (
            !trimmedName ||
            !trimmedEmail ||
            !password
        ) {
            return;
        }


        // =================================================
        // OWNER REGISTRATION
        // =================================================

        const success =
            accountType === "owner"
                ? await registerOwner(
                    trimmedName,
                    trimmedEmail,
                    password,
                    trimmedPhone ||
                    undefined,
                )
                : await register(
                    trimmedName,
                    trimmedEmail,
                    password,
                    trimmedPhone ||
                    undefined,
                );


        // =================================================
        // REGISTRATION SUCCESS
        // =================================================

        if (success) {

            setAuthModalOpen(false);

            resetForm();


            // =============================================
            // Owner → Owner Dashboard
            // User → User Dashboard
            // =============================================

            if (accountType === "owner") {

                console.log(
                    "REGISTRATION REDIRECT → /owner/dashboard",
                );

                navigate(
                    "/owner/dashboard",
                    {
                        replace: true,
                    },
                );

            } else {

                console.log(
                    "REGISTRATION REDIRECT → /dashboard",
                );

                navigate(
                    "/dashboard",
                    {
                        replace: true,
                    },
                );
            }
        }
    };


    // =================================================
    // DO NOT RENDER
    // =================================================

    if (!isAuthModalOpen) {
        return null;
    }


    // =================================================
    // UI
    // =================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/60
                backdrop-blur-sm
                p-4
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }
            }}
        >

            <div
                className="
                    relative
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-lg
                    bg-white
                    shadow-2xl
                "
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >

                {/* CLOSE */}

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="
                        absolute
                        right-4
                        top-4
                        z-10
                        rounded-full
                        p-2
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-black
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                    aria-label="Close"
                >
                    <X size={20} />
                </button>


                {/* HEADER */}

                <div className="px-8 pt-8">

                    <h2
                        className="
                            font-display
                            text-3xl
                            font-semibold
                            text-primary
                        "
                    >
                        {isLogin
                            ? "Welcome Back"
                            : "Create Account"}
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-relaxed
                            text-black/60
                        "
                    >
                        {isLogin
                            ? "Sign in to continue to QuickDine."
                            : "Create your QuickDine account to start exploring restaurants."}
                    </p>

                </div>


                {/* LOGIN / REGISTER TABS */}

                <div
                    className="
                        mx-8
                        mt-6
                        flex
                        border-b
                        border-gray-200
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            handleModeChange(true)
                        }
                        disabled={loading}
                        className={`
                            flex-1
                            border-b-2
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                isLogin
                                    ? "border-primary text-primary"
                                    : "border-transparent text-black/50 hover:text-primary"
                            }
                        `}
                    >
                        Login
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            handleModeChange(false)
                        }
                        disabled={loading}
                        className={`
                            flex-1
                            border-b-2
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                !isLogin
                                    ? "border-primary text-primary"
                                    : "border-transparent text-black/50 hover:text-primary"
                            }
                        `}
                    >
                        Register
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 p-8"
                >

                    {/* NAME */}

                    {!isLogin && (

                        <div>

                            <label
                                htmlFor="auth-name"
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-black/60
                                "
                            >
                                Full Name
                            </label>


                            <div className="relative">

                                <User
                                    size={17}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-black/40
                                    "
                                />


                                <input
                                    id="auth-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-200
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-primary
                                        disabled:bg-gray-100
                                    "
                                />

                            </div>

                        </div>
                    )}


                    {/* EMAIL */}

                    <div>

                        <label
                            htmlFor="auth-email"
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-black/60
                            "
                        >
                            Email
                        </label>


                        <div className="relative">

                            <Mail
                                size={17}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-black/40
                                "
                            />


                            <input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-200
                                    py-3
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-primary
                                    disabled:bg-gray-100
                                "
                            />

                        </div>

                    </div>


                    {/* PHONE */}

                    {!isLogin && (

                        <div>

                            <label
                                htmlFor="auth-phone"
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-black/60
                                "
                            >
                                Phone

                                <span
                                    className="
                                        ml-1
                                        normal-case
                                        tracking-normal
                                        text-black/40
                                    "
                                >
                                    (optional)
                                </span>
                            </label>


                            <div className="relative">

                                <Phone
                                    size={17}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-black/40
                                    "
                                />


                                <input
                                    id="auth-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-200
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-primary
                                        disabled:bg-gray-100
                                    "
                                />

                            </div>

                        </div>
                    )}


                    {/* ACCOUNT TYPE */}

                    {!isLogin && (

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-black/60
                                "
                            >
                                Account Type
                            </label>


                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        setAccountType("user")
                                    }
                                    className={`
                                        rounded-md
                                        border
                                        px-3
                                        py-3
                                        text-xs
                                        font-medium
                                        transition

                                        ${
                                            accountType === "user"
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-200 text-black/60 hover:border-primary hover:text-primary"
                                        }
                                    `}
                                >
                                    Diner
                                </button>


                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        setAccountType("owner")
                                    }
                                    className={`
                                        rounded-md
                                        border
                                        px-3
                                        py-3
                                        text-xs
                                        font-medium
                                        transition

                                        ${
                                            accountType === "owner"
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-200 text-black/60 hover:border-primary hover:text-primary"
                                        }
                                    `}
                                >
                                    Restaurant Owner
                                </button>

                            </div>

                        </div>
                    )}


                    {/* PASSWORD */}

                    <div>

                        <label
                            htmlFor="auth-password"
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-black/60
                            "
                        >
                            Password
                        </label>


                        <div className="relative">

                            <Lock
                                size={17}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-black/40
                                "
                            />


                            <input
                                id="auth-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete={
                                    isLogin
                                        ? "current-password"
                                        : "new-password"
                                }
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-200
                                    py-3
                                    pl-10
                                    pr-12
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-primary
                                    disabled:bg-gray-100
                                "
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous,
                                    )
                                }
                                disabled={loading}
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-black/40
                                    transition
                                    hover:text-primary
                                    disabled:cursor-not-allowed
                                "
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >

                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* REGISTER INFO */}

                    {!isLogin && (

                        <p
                            className="
                                text-xs
                                leading-relaxed
                                text-black/50
                            "
                        >
                            {accountType === "owner"
                                ? "Restaurant owners can create and manage their restaurant profile after registration."
                                : "Create a regular diner account to explore restaurants and make bookings."}
                        </p>
                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !email.trim() ||
                            !password ||
                            (!isLogin &&
                                !name.trim())
                        }
                        className="
                            mt-2
                            w-full
                            rounded-md
                            bg-primary
                            px-4
                            py-3.5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-white
                            transition
                            hover:bg-primary-container
                            hover:text-secondary
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Sign In"
                                : accountType === "owner"
                                    ? "Register as Owner"
                                    : "Create Account"}

                    </button>

                </form>

            </div>

        </div>
    );
}