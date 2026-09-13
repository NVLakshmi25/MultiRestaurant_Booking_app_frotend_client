import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import api from "../lib/api";


// =====================================================
// USER ROLE
// =====================================================

export type UserRole =
    | "user"
    | "owner"
    | "admin";


// =====================================================
// USER TYPE
// =====================================================

export interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
}


// =====================================================
// CONTEXT TYPE
// =====================================================

interface AppContextType {

    user: UserType | null;

    token: string | null;

    loading: boolean;

    isAuthenticated: boolean;

    isAuthModalOpen: boolean;

    setAuthModalOpen: (
        open: boolean
    ) => void;

    login: (
        email: string,
        password: string,
    ) => Promise<boolean>;

    register: (
        name: string,
        email: string,
        password: string,
        phone?: string,
    ) => Promise<boolean>;

    registerOwner: (
        name: string,
        email: string,
        password: string,
        phone?: string,
    ) => Promise<boolean>;

    logout: () => void;
}


// =====================================================
// PROVIDER PROPS
// =====================================================

interface AppContextProviderProps {
    children: ReactNode;
}


// =====================================================
// CREATE CONTEXT
// =====================================================

const AppContext =
    createContext<
        AppContextType | undefined
    >(undefined);


// =====================================================
// PROVIDER
// =====================================================

export function AppContextProvider({
    children,
}: AppContextProviderProps) {

    const [user, setUser] =
        useState<UserType | null>(null);

    const [token, setToken] =
        useState<string | null>(() =>
            localStorage.getItem("token")
        );

    const [loading, setLoading] =
        useState(true);

    const [isAuthModalOpen, setAuthModalOpen] =
        useState(false);


    // =================================================
    // NORMALIZE USER
    // =================================================

    const normalizeUser = (
        data: any,
    ): UserType => {

        const rawUser =
            data?.user ?? data;

        return {

            _id:
                rawUser?._id ??
                rawUser?.id ??
                "",

            name:
                rawUser?.name ??
                "",

            email:
                rawUser?.email ??
                "",

            phone:
                rawUser?.phone ??
                "",

            role:
                String(
                    rawUser?.role ??
                    "user",
                )
                    .trim()
                    .toLowerCase() as UserRole,
        };
    };


    // =================================================
    // LOGIN
    // =================================================

    const login = async (
        email: string,
        password: string,
    ): Promise<boolean> => {

        try {

            setLoading(true);


            // -----------------------------------------
            // LOGIN
            // -----------------------------------------

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password,
                    },
                );


            const data =
                response.data;


            console.log(
                "LOGIN RESPONSE:",
                data,
            );


            // -----------------------------------------
            // TOKEN
            // -----------------------------------------

            const userToken =
                data?.token;


            if (!userToken) {

                throw new Error(
                    "Authentication token was not received.",
                );
            }


            // -----------------------------------------
            // SAVE TOKEN
            // -----------------------------------------

            localStorage.setItem(
                "token",
                userToken,
            );

            setToken(userToken);


            // -----------------------------------------
            // GET CURRENT USER
            // -----------------------------------------

            const meResponse =
                await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${userToken}`,
                        },
                    },
                );


            console.log(
                "LOGIN /AUTH/ME RESPONSE:",
                meResponse.data,
            );


            // -----------------------------------------
            // NORMALIZE
            // -----------------------------------------

            const userData =
                normalizeUser(
                    meResponse.data,
                );


            console.log(
                "AUTHORITATIVE LOGIN USER:",
                userData,
            );

            console.log(
                "AUTHORITATIVE LOGIN ROLE:",
                userData.role,
            );


            // -----------------------------------------
            // SAVE USER
            // -----------------------------------------

            setUser(userData);

            localStorage.setItem(
                "user",
                JSON.stringify(userData),
            );


            toast.success(
                `Welcome back, ${userData.name}!`,
            );


            return true;

        } catch (error: unknown) {

            console.error(
                "LOGIN ERROR:",
                error,
            );


            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setToken(null);
            setUser(null);


            if (
                axios.isAxiosError(error)
            ) {

                toast.error(
                    error.response?.data?.message ||
                    "Login failed. Please check your credentials.",
                );

            } else if (
                error instanceof Error
            ) {

                toast.error(
                    error.message,
                );

            } else {

                toast.error(
                    "Login failed. Please try again.",
                );
            }


            return false;

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // REGISTER NORMAL USER
    // =================================================

    const register = async (
        name: string,
        email: string,
        password: string,
        phone?: string,
    ): Promise<boolean> => {

        try {

            setLoading(true);


            const response =
                await api.post(
                    "/auth/register",
                    {
                        name,
                        email,
                        password,
                        phone,
                    },
                );


            const data =
                response.data;


            console.log(
                "REGISTER RESPONSE:",
                data,
            );


            const userToken =
                data?.token;


            if (!userToken) {

                throw new Error(
                    "Authentication token was not received.",
                );
            }


            const userData =
                normalizeUser(data);


            console.log(
                "REGISTER USER:",
                userData,
            );

            console.log(
                "REGISTER ROLE:",
                userData.role,
            );


            localStorage.setItem(
                "token",
                userToken,
            );

            localStorage.setItem(
                "user",
                JSON.stringify(userData),
            );


            setToken(userToken);
            setUser(userData);


            toast.success(
                `Welcome to QuickDine, ${userData.name}!`,
            );


            return true;

        } catch (error: unknown) {

            console.error(
                "REGISTER ERROR:",
                error,
            );


            if (
                axios.isAxiosError(error)
            ) {

                toast.error(
                    error.response?.data?.message ||
                    "Registration failed. Please try again.",
                );

            } else if (
                error instanceof Error
            ) {

                toast.error(
                    error.message,
                );

            } else {

                toast.error(
                    "Registration failed. Please try again.",
                );
            }


            return false;

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // REGISTER RESTAURANT OWNER
    // =================================================

    const registerOwner = async (
        name: string,
        email: string,
        password: string,
        phone?: string,
    ): Promise<boolean> => {

        try {

            setLoading(true);


            const response =
                await api.post(
                    "/auth/register-owner",
                    {
                        name,
                        email,
                        password,
                        phone,
                    },
                );


            const data =
                response.data;


            console.log(
                "REGISTER OWNER RESPONSE:",
                data,
            );


            const userToken =
                data?.token;


            if (!userToken) {

                throw new Error(
                    "Authentication token was not received.",
                );
            }


            const userData =
                normalizeUser(data);


            console.log(
                "REGISTER OWNER USER:",
                userData,
            );

            console.log(
                "REGISTER OWNER ROLE:",
                userData.role,
            );


            localStorage.setItem(
                "token",
                userToken,
            );

            localStorage.setItem(
                "user",
                JSON.stringify(userData),
            );


            setToken(userToken);
            setUser(userData);


            toast.success(
                `Welcome to QuickDine, ${userData.name}!`,
            );


            return true;

        } catch (error: unknown) {

            console.error(
                "REGISTER OWNER ERROR:",
                error,
            );


            if (
                axios.isAxiosError(error)
            ) {

                toast.error(
                    error.response?.data?.message ||
                    "Owner registration failed. Please try again.",
                );

            } else if (
                error instanceof Error
            ) {

                toast.error(
                    error.message,
                );

            } else {

                toast.error(
                    "Owner registration failed. Please try again.",
                );
            }


            return false;

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // LOGOUT
    // =================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        setAuthModalOpen(false);

        window.location.href = "/";
    };


    // =================================================
    // LOAD CURRENT USER
    // =================================================

    useEffect(() => {

        const loadUser = async () => {

            const storedToken =
                localStorage.getItem("token");


            if (!storedToken) {

                setUser(null);
                setLoading(false);

                return;
            }


            try {

                const response =
                    await api.get(
                        "/auth/me"
                    );


                console.log(
                    "AUTH ME RESPONSE:",
                    response.data,
                );


                const userData =
                    normalizeUser(
                        response.data,
                    );


                console.log(
                    "AUTH ME USER:",
                    userData,
                );

                console.log(
                    "AUTH ME ROLE:",
                    userData.role,
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(userData),
                );


                setUser(userData);

            } catch (error: unknown) {

                console.error(
                    "AUTH ME ERROR:",
                    error,
                );


                localStorage.removeItem(
                    "token",
                );

                localStorage.removeItem(
                    "user",
                );


                setToken(null);
                setUser(null);


                if (
                    axios.isAxiosError(error)
                ) {

                    const status =
                        error.response?.status;


                    if (status !== 401) {

                        toast.error(
                            error.response?.data?.message ||
                            "Unable to load your account.",
                        );
                    }
                }

            } finally {

                setLoading(false);
            }
        };


        loadUser();

    }, [token]);


    // =================================================
    // CONTEXT VALUE
    // =================================================

    const value: AppContextType = {

        user,

        token,

        loading,

        isAuthenticated:
            Boolean(user),

        isAuthModalOpen,

        setAuthModalOpen,

        login,

        register,

        registerOwner,

        logout,
    };


    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
}


// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAppContext():
    AppContextType {

    const context =
        useContext(AppContext);


    if (!context) {

        throw new Error(
            "useAppContext must be used within AppContextProvider",
        );
    }


    return context;
}