npm install lucide-react

------------------
StrictMode → development checks
BrowserRouter → routing
AppContextProvider → global application state
App → main application
--------------------------------------------

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    Utensils,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAppContext } from "../../context/AppContext";
import type { Restaurant } from "../../types";
import api from "../../lib/api";

interface RestaurantWizardProps {
    setRestaurant: (restaurant: Restaurant) => void;
}

// --------------------------------------------------
// Default Time Slots
// --------------------------------------------------

const DEFAULT_SLOTS = [
    "12:00",
    "13:00",
    "14:00",
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
];

// --------------------------------------------------
// Default Selected Slots
// --------------------------------------------------

const DEFAULT_SELECTED_SLOTS = [
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
];

export default function RestaurantWizard({
    setRestaurant,
}: RestaurantWizardProps) {
    const { user } = useAppContext();

    // ==================================================
    // FORM STATE
    // ==================================================

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [priceRange, setPriceRange] = useState("$$");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [chef, setChef] = useState("");
    const [tags, setTags] = useState("");

    // ==================================================
    // IMAGE STATE
    // ==================================================

    const [imageFile, setImageFile] = useState<File | null>(
        null
    );

    const [imagePreview, setImagePreview] = useState("");

    // ==================================================
    // RESTAURANT SETTINGS
    // ==================================================

    const [availableSlots, setAvailableSlots] = useState<
        string[]
    >(DEFAULT_SELECTED_SLOTS);

    const [totalSeats, setTotalSeats] = useState("20");

    // ==================================================
    // LOADING STATE
    // ==================================================

    const [formLoading, setFormLoading] = useState(false);

    // ==================================================
    // CLEANUP IMAGE PREVIEW
    // ==================================================

    useEffect(() => {
        return () => {
            if (imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // ==================================================
    // TOGGLE AVAILABLE SLOT
    // ==================================================

    const toggleSlot = (slot: string) => {
        setAvailableSlots((currentSlots) => {
            // If selected, remove it
            if (currentSlots.includes(slot)) {
                return currentSlots.filter(
                    (currentSlot) => currentSlot !== slot
                );
            }

            // If not selected, add it
            return [...currentSlots, slot].sort();
        });
    };

    // ==================================================
    // HANDLE IMAGE CHANGE
    // ==================================================

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // --------------------------------------------------
        // Validate file type
        // --------------------------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error(
                "Please select a JPG, PNG or WebP image."
            );

            event.target.value = "";

            return;
        }

        // --------------------------------------------------
        // Validate file size
        // --------------------------------------------------

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error(
                "Image size must be less than 5 MB."
            );

            event.target.value = "";

            return;
        }

        // --------------------------------------------------
        // Revoke previous preview URL
        // --------------------------------------------------

        if (imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        // --------------------------------------------------
        // Save file
        // --------------------------------------------------

        setImageFile(file);

        // --------------------------------------------------
        // Create preview
        // --------------------------------------------------

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // ==================================================
    // HANDLE CREATE RESTAURANT
    // ==================================================

    const handleCreateRestaurant = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        console.log(
            "========================================"
        );

        console.log(
            "REGISTER RESTAURANT BUTTON CLICKED"
        );

        console.log(
            "========================================"
        );

        // ==================================================
        // CHECK USER LOGIN
        // ==================================================

        if (!user) {
            toast.error(
                "You must be logged in to register a restaurant."
            );

            console.error(
                "Restaurant registration failed: User not logged in"
            );

            return;
        }

        console.log("Logged in user:", user);

        // ==================================================
        // VALIDATE NAME
        // ==================================================

        if (!name.trim()) {
            toast.error(
                "Restaurant name is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE DESCRIPTION
        // ==================================================

        if (!description.trim()) {
            toast.error(
                "Restaurant description is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE CUISINE
        // ==================================================

        if (!cuisine.trim()) {
            toast.error(
                "Cuisine type is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE LOCATION
        // ==================================================

        if (!location.trim()) {
            toast.error(
                "Restaurant location is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE ADDRESS
        // ==================================================

        if (!address.trim()) {
            toast.error(
                "Restaurant address is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE CHEF
        // ==================================================

        if (!chef.trim()) {
            toast.error(
                "Executive chef name is required."
            );

            return;
        }

        // ==================================================
        // VALIDATE TOTAL SEATS
        // ==================================================

        const seats = Number(totalSeats);

        if (
            !Number.isInteger(seats) ||
            seats < 1
        ) {
            toast.error(
                "Total capacity must be at least 1 seat."
            );

            return;
        }

        if (seats > 1000) {
            toast.error(
                "Total capacity cannot exceed 1000 seats."
            );

            return;
        }

        // ==================================================
        // VALIDATE AVAILABLE SLOTS
        // ==================================================

        if (availableSlots.length === 0) {
            toast.error(
                "Please select at least one available slot."
            );

            return;
        }

        // ==================================================
        // VALIDATE IMAGE
        // ==================================================

        if (!imageFile) {
            toast.error(
                "Please upload a restaurant cover image."
            );

            return;
        }

        // ==================================================
        // START LOADING
        // ==================================================

        setFormLoading(true);

        try {
            // ==================================================
            // CREATE FORMDATA
            // ==================================================

            const formData = new FormData();

            // --------------------------------------------------
            // Basic restaurant information
            // --------------------------------------------------

            formData.append(
                "name",
                name.trim()
            );

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "cuisine",
                cuisine.trim()
            );

            formData.append(
                "priceRange",
                priceRange
            );

            formData.append(
                "location",
                location.trim()
            );

            formData.append(
                "address",
                address.trim()
            );

            formData.append(
                "chef",
                chef.trim()
            );

            // --------------------------------------------------
            // Tags
            // --------------------------------------------------

            const tagArray = tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);

            formData.append(
                "tags",
                tagArray.join(",")
            );

            // --------------------------------------------------
            // Available slots
            // --------------------------------------------------

            formData.append(
                "availableSlots",
                availableSlots.join(",")
            );

            // --------------------------------------------------
            // Total seats
            // --------------------------------------------------

            formData.append(
                "totalSeats",
                String(seats)
            );

            // --------------------------------------------------
            // Image
            // --------------------------------------------------

            formData.append(
                "image",
                imageFile
            );

            // ==================================================
            // DEBUG FORMDATA
            // ==================================================

            console.log(
                "========== FORM DATA =========="
            );

            for (const [key, value] of formData.entries()) {
                console.log(
                    key,
                    value
                );
            }

            console.log(
                "================================"
            );

            // ==================================================
            // API REQUEST
            // ==================================================

            console.log(
                "Sending POST request..."
            );

            const response = await api.post(
                "/owner/restaurant",
                formData
            );

            // ==================================================
            // API RESPONSE
            // ==================================================

            console.log(
                "========== API RESPONSE =========="
            );

            console.log(
                "Status:",
                response.status
            );

            console.log(
                "Data:",
                response.data
            );

            console.log(
                "=================================="
            );

            // ==================================================
            // GET RESTAURANT FROM RESPONSE
            // ==================================================

            const restaurant =
                response.data?.restaurant ??
                response.data;

            // ==================================================
            // CHECK RESPONSE
            // ==================================================

            if (!restaurant) {
                throw new Error(
                    "Restaurant data was not returned by the server."
                );
            }

            // ==================================================
            // UPDATE PARENT STATE
            // ==================================================

            setRestaurant(
                restaurant
            );

            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            toast.success(
                "Restaurant profile submitted successfully! Awaiting Admin approval."
            );

            // ==================================================
            // RESET FORM
            // ==================================================

            setName("");
            setDescription("");
            setCuisine("");
            setPriceRange("$$");
            setLocation("");
            setAddress("");
            setChef("");
            setTags("");
            setTotalSeats("20");

            setAvailableSlots(
                DEFAULT_SELECTED_SLOTS
            );

            setImageFile(null);

            // --------------------------------------------------
            // Cleanup image preview
            // --------------------------------------------------

            if (imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }

            setImagePreview("");

        } catch (error: any) {
            // ==================================================
            // API ERROR
            // ==================================================

            console.error(
                "========================================"
            );

            console.error(
                "RESTAURANT API ERROR"
            );

            console.error(
                "========================================"
            );

            console.error(
                "Full error:",
                error
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "========================================"
            );

            // ==================================================
            // ERROR MESSAGE
            // ==================================================

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Failed to register restaurant. Please try again.";

            toast.error(
                message
            );

        } finally {
            // ==================================================
            // STOP LOADING
            // ==================================================

            setFormLoading(false);
        }
    };

    // ==================================================
    // JSX
    // ==================================================

    return (
        <div className="max-w-2xl mx-auto bg-white border border-outline-variant/20 p-8 md:p-10 shadow-sm rounded-md space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="text-center space-y-2 pb-6 border-b border-outline-variant/10">

                <Utensils
                    size={36}
                    className="mx-auto text-secondary"
                />

                <h2 className="font-display text-xl font-medium text-primary">
                    Setup Restaurant Profile
                </h2>

                <p className="text-xs text-black/55">
                    Create your restaurant details. Once
                    submitted, it will be reviewed by the Admin.
                </p>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={
                    handleCreateRestaurant
                }
                className="space-y-5 text-left"
            >

                {/* ==================================================
                    RESTAURANT NAME + CUISINE
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Restaurant Name */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-name"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Restaurant Name
                        </label>

                        <input
                            id="wizard-name"
                            type="text"
                            required
                            maxLength={100}
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. L'Artiste"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                    {/* Cuisine */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-cuisine"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Cuisine Type
                        </label>

                        <input
                            id="wizard-cuisine"
                            type="text"
                            required
                            maxLength={100}
                            value={cuisine}
                            onChange={(event) =>
                                setCuisine(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. French, Omakase"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="space-y-1">

                    <label
                        htmlFor="wizard-description"
                        className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                    >
                        Description
                    </label>

                    <textarea
                        id="wizard-description"
                        required
                        rows={4}
                        maxLength={1000}
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        placeholder="Describe the gastronomical experience, atmosphere, and dining philosophy..."
                        className="w-full bg-surface-container-low/30 border border-outline-variant/40 p-3 text-xs focus:border-secondary focus:outline-none rounded-sm resize-none"
                    />

                </div>

                {/* ==================================================
                    IMAGE UPLOAD
                ================================================== */}

                <div className="space-y-1">

                    <label className="block text-[10px] font-medium text-black/55 tracking-wider uppercase">
                        Restaurant Cover Image
                    </label>

                    <div className="flex flex-col md:flex-row gap-4 items-center bg-surface-container-low/30 border border-outline-variant/40 p-4 rounded-sm">

                        {/* Image Preview */}
                        <div className="relative w-32 h-24 bg-surface border border-outline-variant/30 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">

                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Restaurant preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon
                                    size={24}
                                    className="text-black/30"
                                />
                            )}

                        </div>

                        {/* Upload Information */}
                        <div className="grow space-y-2 text-center md:text-left w-full">

                            <p className="text-[11px] text-black/55 leading-relaxed">
                                Upload a high-resolution banner
                                photo. JPG, PNG or WebP up to
                                5 MB.
                            </p>

                            <label className="inline-flex items-center gap-1.5 px-4 py-2 border border-outline-variant/40 hover:border-primary hover:text-primary transition-colors text-[10px] font-medium tracking-wider uppercase rounded-sm cursor-pointer bg-white">

                                <Upload size={12} />

                                {imageFile
                                    ? "Change Image"
                                    : "Upload Image"}

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={
                                        handleImageChange
                                    }
                                    className="hidden"
                                />

                            </label>

                            {imageFile && (
                                <span className="block text-[10px] text-secondary font-medium">
                                    Selected:{" "}
                                    {imageFile.name}
                                </span>
                            )}

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    PRICE / LOCATION / CAPACITY
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Price Range */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-price"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Price Range
                        </label>

                        <select
                            id="wizard-price"
                            value={priceRange}
                            onChange={(event) =>
                                setPriceRange(
                                    event.target.value
                                )
                            }
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm cursor-pointer"
                        >

                            <option value="$">
                                $ (Casual)
                            </option>

                            <option value="$$">
                                $$ (Moderate)
                            </option>

                            <option value="$$$">
                                $$$ (Upscale)
                            </option>

                            <option value="$$$$">
                                $$$$ (Fine Dining)
                            </option>

                        </select>

                    </div>

                    {/* Location */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-location"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Location
                        </label>

                        <input
                            id="wizard-location"
                            type="text"
                            required
                            maxLength={100}
                            value={location}
                            onChange={(event) =>
                                setLocation(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Hyderabad"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                    {/* Total Capacity */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-capacity"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Total Capacity
                        </label>

                        <input
                            id="wizard-capacity"
                            type="number"
                            min={1}
                            max={1000}
                            required
                            value={totalSeats}
                            onChange={(event) =>
                                setTotalSeats(
                                    event.target.value
                                )
                            }
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                </div>

                {/* ==================================================
                    ADDRESS + CHEF
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Address */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-address"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Address
                        </label>

                        <input
                            id="wizard-address"
                            type="text"
                            required
                            maxLength={250}
                            value={address}
                            onChange={(event) =>
                                setAddress(
                                    event.target.value
                                )
                            }
                            placeholder="Restaurant address"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                    {/* Executive Chef */}
                    <div className="space-y-1">

                        <label
                            htmlFor="wizard-chef"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            Executive Chef
                        </label>

                        <input
                            id="wizard-chef"
                            type="text"
                            required
                            maxLength={100}
                            value={chef}
                            onChange={(event) =>
                                setChef(
                                    event.target.value
                                )
                            }
                            placeholder="Chef name"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />

                    </div>

                </div>

                {/* ==================================================
                    TAGS
                ================================================== */}

                <div className="space-y-1">

                    <label
                        htmlFor="wizard-tags"
                        className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                    >
                        Tags (comma separated)
                    </label>

                    <input
                        id="wizard-tags"
                        type="text"
                        value={tags}
                        onChange={(event) =>
                            setTags(
                                event.target.value
                            )
                        }
                        placeholder="Michelin Star, Romantic, Rooftop"
                        maxLength={300}
                        className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                    />

                </div>

                {/* ==================================================
                    AVAILABLE SLOTS
                ================================================== */}

                <div className="space-y-2">

                    <span className="block text-[10px] font-medium text-black/55 tracking-wider uppercase">
                        Available Slots
                    </span>

                    <div className="flex flex-wrap gap-2">

                        {DEFAULT_SLOTS.map(
                            (slot) => {
                                const isSelected =
                                    availableSlots.includes(
                                        slot
                                    );

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() =>
                                            toggleSlot(
                                                slot
                                            )
                                        }
                                        className={`py-1.5 px-3 text-[10px] border transition-colors cursor-pointer rounded-sm ${
                                            isSelected
                                                ? "bg-primary border-primary text-white"
                                                : "border-outline-variant/40 text-black/55 hover:border-primary hover:text-primary"
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>

                {/* ==================================================
                    SUBMIT BUTTON
                ================================================== */}

                <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-primary hover:bg-secondary text-white text-xs font-medium tracking-widest uppercase py-3.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >

                    {formLoading
                        ? "SUBMITTING..."
                        : "REGISTER RESTAURANT"}

                </button>

            </form>

        </div>
    );
}

--------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Utensils, Upload, Image } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.ts";
interface RestaurantWizardProps {
setRestaurant: (restaurant: any) => void;
}
interface RestaurantWizardProps {
setRestaurant: (restaurant: any) => void;
}
export default function RestaurantWizard({ setRestaurant): RestaurantWizardProps) {
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [cuisine, setCuisine] = useState("");
const [priceRange, setPriceRange] = useState("$$");
const [location, setLocation] = useState("");
const [address, setAddress] = useState("");
const [chef, setChef] = useState("");
const [tags, setTags] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>("");
const [availableSlots, setAvailableSlots] = useState<string[]>([

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

]);
const [totalSeats, setTotalSeats] = useState("20");
const [formLoading, setFormLoading] = useState(false);
const defaultSlots = [
"12:00",
"13:00",
"14:00",
"17:00",
"17:30",
"18:00",
"18:30",
"19:00",
"19:30",
"20:30",
"21:00",
"21:30",
];

const toggleSlot = (slot: string) => {
if (availableSlots.includes (slot)) {
setAvailableSlots (availableSlots.filter((s) => s !== slot));
} else {
setAvailableSlots ([...availableSlots, slot].sort());
}
};
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
setImageFile(file);
setImagePreview (URL.createObjectURL(file));
}
};

I
const handleCreateRestaurant = async (e: React.FormEvent) => {
e.preventDefault();
setFormLoading(true);
try {
const formData = new FormData();
formData.append("name", name);
formData.append("description", description);
formData.append("cuisine", cuisine);
formData.append("priceRange", priceRange);
formData.append("location", location);
formData.append("address", address);
formData.append("chef", chef);
formData.append("tags", tags);
formData.append("availableSlots", availableSlots.join(","));
formData.append("totalSeats", totalSeats);
if (imageFile) {
}
formData.append("image", imageFile);

const res = await api.post("/owner/restaurant", formData, {
headers: {
"Content-Type": "multipart/form-data",
}
})
setRestaurant(res.data)
toast.success ("Restaurant profile submitted successfully! Awaiting Admin
approval.");
} catch (error: any) {
toast.error(error?.response?.data?.message || "Failed to register restaurant");
} finally {
setFormLoading(false);
}
};
