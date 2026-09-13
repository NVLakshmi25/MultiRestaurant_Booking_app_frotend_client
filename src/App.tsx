import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Search from "./pages/Search.tsx";
import RestaurantDetail from "./pages/RestaurantDetail.tsx";
import BookingConfirmation from "./pages/BookingConfirmation.tsx";
import Dashboard from "./pages/Dashboard.tsx";

import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";

import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

import { Toaster } from "react-hot-toast";


export default function App() {
    return (
        <>
            {/* ----------------------------------------
                Global Toast Notifications
            ----------------------------------------- */}

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1a1c1c",
                        color: "#ffffff",
                        fontFamily:
                            "Manrope, sans-serif",
                        fontSize: "12px",
                        letterSpacing:
                            "0.02em",
                        borderRadius: "4px",
                        border:
                            "1px solid rgba(255, 255, 255, 0.08)",
                    },
                }}
            />


            {/* ----------------------------------------
                Application Routes
            ----------------------------------------- */}

            <Routes>

                {/* ----------------------------------------
                    Public Routes
                ----------------------------------------- */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/search"
                    element={<Search />}
                />

                <Route
                    path="/restaurant/:slug"
                    element={
                        <RestaurantDetail />
                    }
                />


                {/* ----------------------------------------
                    Logged-in User Routes
                ----------------------------------------- */}

                <Route
                    path="/booking/:slug"
                    element={
                        <ProtectedRoute>
                            <BookingConfirmation />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ----------------------------------------
                    Owner Routes
                ----------------------------------------- */}

                <Route
                    path="/owner/dashboard"
                    element={
                        <ProtectedRoute
                           allowedRoles={["owner"]}
                        >
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ----------------------------------------
                    Admin Dashboard
                ----------------------------------------- */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ----------------------------------------
                    Admin User Management
                ----------------------------------------- */}

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                            ]}
                        >
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}