export type UserRole =
    | "user"
    | "admin"
    | "owner";

export type RestaurantStatus =
    | "approved"
    | "pending"
    | "rejected";

export type BookingStatus =
    | "confirmed"
    | "completed"
    | "cancelled"
    | "pending";

/* =========================================
   USER
========================================= */

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
}

/* =========================================
   RESTAURANT
========================================= */

export interface Restaurant {
    _id: string;
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: string;

    rating: number;
    reviewCount: number;

    location: string;
    address: string;
    image: string;

    chef: string;
    tags: string[];

    availableSlots: string[];

    featured: boolean;
    exclusive: boolean;

    owner: string;

    status: RestaurantStatus;

    totalSeats: number;

    createdAt: string;
    updatedAt: string;
}

/* =========================================
   BOOKING RESTAURANT
========================================= */

export interface BookingRestaurant {
    _id: string;
    name: string;
    slug?: string;
    location: string;
    address: string;
    image: string;
}

/* =========================================
   BOOKING
========================================= */

export interface Booking {
    _id: string;

    user: string;

    restaurant: BookingRestaurant;

    date: string;
    time: string;

    guests: number;

    occasion?: string;
    specialRequests?: string;

    status: BookingStatus;

    bookingId: string;

    createdAt: string;
    updatedAt: string;
}

/* =========================================
   AVAILABILITY
========================================= */

export interface AvailabilitySlot {
    time: string;
    availableSeats: number;
    isAvailable: boolean;
}

/* =========================================
   REVIEW
========================================= */

export interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    visitedDate: string;
    createdAt: string;
}

/* =========================================
   ADMIN USER
========================================= */

export interface AdminBookingUser {
    _id: string;
    name: string;
    email: string;
}

/* =========================================
   ADMIN RESTAURANT
========================================= */

export interface AdminBookingRestaurant {
    _id: string;
    name: string;
}

/* =========================================
   ADMIN LATEST BOOKING
========================================= */

export interface AdminLatestBooking {
    _id: string;

    user: AdminBookingUser;

    restaurant: AdminBookingRestaurant;

    date: string;
    time: string;

    guests: number;

    occasion?: string;
    specialRequests?: string;

    status: BookingStatus;

    bookingId: string;

    createdAt: string;
    updatedAt: string;
}

/* =========================================
   ADMIN STATS
========================================= */

export interface AdminStats {
    users: {
        totalUsers: number;
        totalOwners: number;
        total: number;
    };

    restaurants: {
        total: number;
    };

    bookings: {
        total: number;
    };

    latestBookings: AdminLatestBooking[];
}