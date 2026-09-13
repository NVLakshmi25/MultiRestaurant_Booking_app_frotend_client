import hero_bg_img from "./hero_bg_img.png";
import default_restaurant_img from "./default_restaurant_Img.jpeg";
import membership_section_img from "./membership_section_img.png";

import {
    BeefIcon,
    Building2Icon,
    CroissantIcon,
    FishIcon,
    GlobeIcon,
    LeafIcon,
    MailIcon,
    Share2Icon,
    UtensilsCrossedIcon,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

/* =========================================================
   ASSET FILES
========================================================= */

export const assets = {
    hero_bg_img,
    default_restaurant_img,
    membership_section_img,
};

/* =========================================================
   TYPES
========================================================= */

export type UserRole = "user" | "admin" | "owner";

export type RestaurantStatus =
    | "approved"
    | "pending"
    | "rejected";

export type BookingStatus =
    | "confirmed"
    | "cancelled"
    | "completed";

/* =========================================================
   USER
========================================================= */

export interface DummyUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    token: string;
    createdAt: string;
    updatedAt: string;
}

/* =========================================================
   REVIEW
========================================================= */

export interface DummyReview {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    visitedDate: string;
    createdAt: string;
}

/* =========================================================
   RESTAURANT
========================================================= */

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

/* =========================================================
   AVAILABILITY
========================================================= */

export interface DummyAvailability {
    time: string;
    availableSeats: number;
    isAvailable: boolean;
}

/* =========================================================
   BOOKING RESTAURANT
========================================================= */

export interface BookingRestaurant {
    _id: string;
    name: string;
    slug?: string;
    location: string;
    address: string;
    image: string;
}

/* =========================================================
   BOOKING
========================================================= */

export interface Booking {
    _id: string;
    user: string;
    restaurant: BookingRestaurant;
    date: string;
    time: string;
    guests: number;
    occasion: string;
    specialRequests: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    bookingId: string;
}

/* =========================================================
   ADMIN
========================================================= */

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
}

export interface AdminRestaurant {
    _id: string;
    name: string;
}

export interface AdminLatestBooking {
    _id: string;
    user: AdminUser;
    restaurant: AdminRestaurant;
    date: string;
    time: string;
    guests: number;
    occasion: string;
    specialRequests: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    bookingId: string;
}

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

/* =========================================================
   REVIEWS
========================================================= */

export const dummyReviews: DummyReview[] = [
    {
        _id: "dummy-rev-1",
        userName: "Emily Watson",
        rating: 5,
        comment:
            "Absolutely phenomenal experience! The ambiance was perfect, and the food was cooked to perfection. A must-visit!",
        visitedDate: "2026-06-10T12:00:00.000Z",
        createdAt: "2026-06-10T12:00:00.000Z",
    },

    {
        _id: "dummy-rev-2",
        userName: "Marcus Vance",
        rating: 4,
        comment:
            "The signature dishes were incredible and the staff was extremely attentive. Will definitely come back for another dinner.",
        visitedDate: "2026-06-08T18:30:00.000Z",
        createdAt: "2026-06-08T18:30:00.000Z",
    },

    {
        _id: "dummy-rev-3",
        userName: "Sophia Loren",
        rating: 5,
        comment:
            "Every course of the tasting menu was a delightful surprise. The pairings were exquisite. High-end dining at its finest.",
        visitedDate: "2026-06-05T20:15:00.000Z",
        createdAt: "2026-06-05T20:15:00.000Z",
    },
];

/* =========================================================
   DEFAULT RATING
========================================================= */

export const dummyRating = 4.8;

export const dummyReviewCount = 124;

/* =========================================================
   FOOTER
========================================================= */

export interface FooterLink {
    label: string;
    path: string;
}

export interface FooterSection {
    title: string;
    links: FooterLink[];
}

export const footerSections: FooterSection[] = [
    {
        title: "COMPANY",
        links: [
            {
                label: "About Us",
                path: "#",
            },
            {
                label: "Partner with Us",
                path: "#",
            },
            {
                label: "Careers",
                path: "#",
            },
        ],
    },

    {
        title: "LEGAL",
        links: [
            {
                label: "Terms of Service",
                path: "#",
            },
            {
                label: "Privacy Policy",
                path: "#",
            },
            {
                label: "Cookies",
                path: "#",
            },
        ],
    },
];

/* =========================================================
   SOCIAL LINKS
========================================================= */

export interface SocialLink {
    icon: LucideIcon;
    href: string;
}

export const socialLinks: SocialLink[] = [
    {
        icon: GlobeIcon,
        href: "#",
    },

    {
        icon: Share2Icon,
        href: "#",
    },

    {
        icon: MailIcon,
        href: "#",
    },
];

/* =========================================================
   BOTTOM LINKS
========================================================= */

export const bottomLinks: FooterLink[] = [
    {
        label: "Terms",
        path: "#",
    },

    {
        label: "Privacy",
        path: "#",
    },
];

/* =========================================================
   CUISINES
========================================================= */

export interface Cuisine {
    name: string;
    icon: LucideIcon;
    label: string;
}

export const cuisines: Cuisine[] = [
    {
        name: "Italian",
        icon: UtensilsCrossedIcon,
        label: "ITALIAN",
    },

    {
        name: "Japanese",
        icon: FishIcon,
        label: "SUSHI",
    },

    {
        name: "French",
        icon: CroissantIcon,
        label: "FRENCH",
    },

    {
        name: "Rooftop",
        icon: Building2Icon,
        label: "ROOFTOP",
    },

    {
        name: "Steakhouse",
        icon: BeefIcon,
        label: "STEAKHOUSE",
    },

    {
        name: "Vegetarian",
        icon: LeafIcon,
        label: "VEGETARIAN",
    },
];

/* =========================================================
   DUMMY USER
========================================================= */

/*
   IMPORTANT:

   The restaurant owner ID below is:
   6a32a3c50e88c825d8873f75

   Therefore the dummy user's _id is also the same.

   This allows OwnerDashboard to find the restaurants
   belonging to the logged-in owner.
*/

export const dummyUser: DummyUser = {
    _id: "6a32a3c50e88c825d8873f75",
    name: "Alex Mercer",
    email: "alex@example.com",
    phone: "+01234567788",
    role: "owner",
    token: "dummy-jwt-token",
    createdAt: "2026-06-17T13:40:21.669Z",
    updatedAt: "2026-06-17T13:40:21.669Z",
};

/* =========================================================
   DUMMY RESTAURANTS
========================================================= */

export const dummyRestaurant: Restaurant[] = [
    {
        _id: "6a32a3c50e88c825d8873f7d",
        name: "L'Essence",
        slug: "l-essence",
        description:
            "An intimate, Parisian-inspired fine dining chamber wrapped in dark velvet and soft golden candle glow. L'Essence specializes in meticulous plating of haute gastronomy, creating a rich sensory dialogue between modern culinary innovation and classic romance.",
        cuisine: "French",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "Manhattan, NY",
        address: "115 Greenwich St, New York, NY 10006",
        image: "/restaurant_5.png",
        chef: "Jean-Luc Picard",
        tags: [
            "Romantic",
            "Velvet Booths",
            "Candlelit",
            "Haute Cuisine",
        ],
        availableSlots: [
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
        ],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 45,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f7a",
        name: "Terraza Cielo",
        slug: "terraza-cielo",
        description:
            "A sun-drenched rooftop oasis celebrating Italian and Mediterranean lifestyles. Featuring floor-to-ceiling foliage, white marble bistro tables, and panoramic skyline views, Terraza Cielo serves hand-crafted pastas and coastal seafood paired with bright botanical cocktails.",
        cuisine: "Italian",
        priceRange: "$$$",
        rating: 4.7,
        reviewCount: 205,
        location: "Manhattan, NY",
        address: "244 Fifth Ave Rooftop, New York, NY 10001",
        image: "/restaurant_3.jpg",
        chef: "Elena Rossi",
        tags: [
            "Rooftop",
            "Skyline Views",
            "Handmade Pasta",
            "Craft Cocktails",
        ],
        availableSlots: [
            "12:00",
            "13:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
        ],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 30,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f79",
        name: "Kuro Omakase",
        slug: "kuro-omakase",
        description:
            "An atmospheric, moody sanctuary of premium Japanese gastronomy. Seated at a dark, polished basalt-stone counter, guests experience a deeply focused sushi omakase. Chef Kenji Sato translates the freshest seasonal ingredients directly from Tokyo's fish markets into elegant, edible poetry.",
        cuisine: "Japanese",
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 92,
        location: "Manhattan, NY",
        address: "18 Orchard St, New York, NY 10002",
        image: "/restaurant_2.jpg",
        chef: "Kenji Sato",
        tags: [
            "Omakase",
            "Basalt Counter",
            "Japanese",
            "Zen Atmosphere",
        ],
        availableSlots: [
            "18:00",
            "20:30",
        ],
        featured: true,
        exclusive: true,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 25,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f7c",
        name: "Flora Garden",
        slug: "flora-garden",
        description:
            "A bright, airy conservatory celebrating organic, plant-forward gastronomy. Nestled under glass ceilings with floor-to-ceiling botanicals, Flora Garden transforms fresh seasonal crops into delicate, high-end editorial culinary works of art.",
        cuisine: "Vegetarian",
        priceRange: "$$$",
        rating: 4.8,
        reviewCount: 110,
        location: "Manhattan, NY",
        address: "90 Grand St, New York, NY 10013",
        image: "/restaurant_6.png",
        chef: "Chloe Mercer",
        tags: [
            "Plant-Based",
            "Glasshouse",
            "Organic",
            "Bright & Airy",
        ],
        availableSlots: [
            "11:30",
            "13:00",
            "14:30",
            "17:30",
            "19:00",
            "20:30",
        ],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 40,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f7b",
        name: "Ember Grille",
        slug: "ember-grille",
        description:
            "An upscale modern steakhouse with exposed brick walls, leather booths, and warm, industrial-chic pendant lighting. Offering Prime dry-aged cuts grilled over live hickory and cherrywood embers. Gourmet dining elevated into a sophisticated nocturnal experience.",
        cuisine: "Steakhouse",
        priceRange: "$$$$",
        rating: 4.6,
        reviewCount: 142,
        location: "Manhattan, NY",
        address: "320 Bowery, New York, NY 10012",
        image: "/restaurant_1.png",
        chef: "Marcus Vance",
        tags: [
            "Dry-Aged Beef",
            "Wood Fire",
            "Moody Lighting",
            "Wine Room",
        ],
        availableSlots: [
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
        ],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 35,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f78",
        name: "L'Artiste",
        slug: "l-artiste",
        description:
            "An avant-garde journey through modern French gastronomy. L'Artiste blends classic French culinary foundations with contemporary visual artistry, resulting in a sensory dining experience that is both theatrical and deeply satisfying. Set in a gorgeous high-ceilinged room with minimal charcoal and gold design language.",
        cuisine: "French",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 124,
        location: "Manhattan, NY",
        address: "420 Mercer St, New York, NY 10003",
        image: "/restaurant_4.png",
        chef: "Jean-Pierre Dubois",
        tags: [
            "Michelin Star",
            "Fine Dining",
            "Tasting Menu",
            "Romantic",
        ],
        availableSlots: [
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
        ],
        featured: true,
        exclusive: true,
        owner: "6a32a3c50e88c825d8873f75",
        status: "approved",
        totalSeats: 20,
        createdAt: "2026-06-17T13:40:21.827Z",
        updatedAt: "2026-06-17T13:40:21.827Z",
    },

    /*
     * Pending restaurants
     */

    {
        _id: "6a32a3c50e88c825d8873f80",
        name: "L'Essence - New Branch",
        slug: "l-essence-new-branch",
        description:
            "A new branch of L'Essence awaiting administrator approval.",
        cuisine: "French",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 0,
        location: "Manhattan, NY",
        address: "115 Greenwich St, New York, NY 10006",
        image: "/restaurant_5.png",
        chef: "Jean-Luc Picard",
        tags: [
            "Romantic",
            "Fine Dining",
        ],
        availableSlots: [
            "18:00",
            "19:00",
            "20:00",
            "21:00",
        ],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "pending",
        totalSeats: 45,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },

    {
        _id: "6a32a3c50e88c825d8873f81",
        name: "Terraza Cielo - New Branch",
        slug: "terraza-cielo-new-branch",
        description:
            "A new rooftop restaurant awaiting administrator approval.",
        cuisine: "Italian",
        priceRange: "$$$",
        rating: 4.7,
        reviewCount: 0,
        location: "Manhattan, NY",
        address: "244 Fifth Ave Rooftop, New York, NY 10001",
        image: "/restaurant_3.jpg",
        chef: "Elena Rossi",
        tags: [
            "Rooftop",
            "Italian",
            "Skyline Views",
        ],
        availableSlots: [
            "17:00",
            "18:00",
            "19:00",
            "20:00",
        ],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f75",
        status: "pending",
        totalSeats: 30,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
];

/* =========================================================
   AVAILABILITY
========================================================= */

export const dummyAvailability: DummyAvailability[] = [
    {
        time: "18:00",
        availableSeats: 45,
        isAvailable: true,
    },

    {
        time: "19:00",
        availableSeats: 45,
        isAvailable: true,
    },

    {
        time: "20:00",
        availableSeats: 45,
        isAvailable: true,
    },

    {
        time: "21:00",
        availableSeats: 45,
        isAvailable: true,
    },

    {
        time: "22:00",
        availableSeats: 45,
        isAvailable: true,
    },
];

/* =========================================================
   DUMMY BOOKING
========================================================= */

export const dummyBookingData: Booking = {
    user: "6a32a3c50e88c825d8873f75",

    restaurant: {
        _id: "6a32a3c50e88c825d8873f7d",
        name: "L'Essence",
        slug: "l-essence",
        location: "Manhattan, NY",
        address: "115 Greenwich St, New York, NY 10006",
        image: "/restaurant_5.png",
    },

    date: "2026-06-25T00:00:00.000Z",
    time: "22:00",
    guests: 2,
    occasion: "",
    specialRequests: "",
    status: "confirmed",

    _id: "6a34e4caf866d0ae1e98e487",

    createdAt: "2026-06-19T06:42:18.305Z",
    updatedAt: "2026-06-19T06:42:18.305Z",

    bookingId: "GR-71B448A7",
};

/* =========================================================
   MY BOOKINGS
========================================================= */

export const dummyMyBookingsData: Booking[] = [
    {
        _id: "6a34e4caf866d0ae1e98e487",

        user: "6a32a3c50e88c825d8873f75",

        restaurant: {
            _id: "6a32a3c50e88c825d8873f7d",
            name: "L'Essence",
            slug: "l-essence",
            location: "Manhattan, NY",
            address: "115 Greenwich St, New York, NY 10006",
            image: "/restaurant_5.png",
        },

        date: "2026-06-25T00:00:00.000Z",
        time: "22:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",

        createdAt: "2026-06-19T06:42:18.305Z",
        updatedAt: "2026-06-19T06:42:18.305Z",

        bookingId: "GR-71B448A7",
    },

    {
        _id: "6a34e55af866d0ae1e98e489",

        user: "6a32a3c50e88c825d8873f75",

        restaurant: {
            _id: "6a32a3c50e88c825d8873f7a",
            name: "Terraza Cielo",
            slug: "terraza-cielo",
            location: "Manhattan, NY",
            address: "244 Fifth Ave Rooftop, New York, NY 10001",
            image: "/restaurant_3.jpg",
        },

        date: "2026-06-19T00:00:00.000Z",
        time: "20:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",

        createdAt: "2026-06-19T06:44:42.294Z",
        updatedAt: "2026-06-19T06:44:42.294Z",

        bookingId: "GR-17743C76",
    },

    {
        _id: "6a34e54ff866d0ae1e98e488",

        user: "6a32a3c50e88c825d8873f75",

        restaurant: {
            _id: "6a32a3c50e88c825d8873f78",
            name: "L'Artiste",
            slug: "l-artiste",
            location: "Manhattan, NY",
            address: "420 Mercer St, New York, NY 10003",
            image: "/restaurant_4.png",
        },

        date: "2026-06-19T00:00:00.000Z",
        time: "19:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",

        createdAt: "2026-06-19T06:44:31.052Z",
        updatedAt: "2026-06-19T06:44:31.052Z",

        bookingId: "GR-F82DDD63",
    },
];

/* =========================================================
   ADMIN STATS
========================================================= */

export const dummyAdminStats: AdminStats = {
    users: {
        totalUsers: 1,
        totalOwners: 1,
        total: 2,
    },

    restaurants: {
        total: 6,
    },

    bookings: {
        total: 1,
    },

    latestBookings: [
        {
            _id: "6a34f88580587be1dada87ba",

            user: {
                _id: "6a34ef24a4d96fc34d9c906b",
                name: "Marc Dubois",
                email: "owner@example.com",
            },

            restaurant: {
                _id: "6a34ef24a4d96fc34d9c906d",
                name: "Kuro Omakase",
            },

            date: "2026-06-19T00:00:00.000Z",
            time: "20:30",
            guests: 2,
            occasion: "",
            specialRequests: "",
            status: "confirmed",

            createdAt: "2026-06-19T08:06:29.155Z",
            updatedAt: "2026-06-19T08:06:29.155Z",

            bookingId: "GR-EB39904C",
        },
    ],
};

/* =========================================================
   FEATURED RESTAURANTS
========================================================= */

export const dummyFeaturedRestaurants: Restaurant[] =
    dummyRestaurant.filter(
        (restaurant) =>
            restaurant.featured &&
            restaurant.status === "approved"
    );