import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import toast from "react-hot-toast";

import {
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import api from "../../lib/api";
import type { Restaurant } from "../../types";

interface OwnerProfileDetailsProps {
  restaurant: Restaurant;
  setRestaurant: (restaurant: Restaurant) => void;
}

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

export default function OwnerProfileDetails({
  restaurant,
  setRestaurant,
}: OwnerProfileDetailsProps) {
  // ==========================================
  // Form State
  // ==========================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [priceRange, setPriceRange] = useState("$$");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [chef, setChef] = useState("");
  const [tags, setTags] = useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [availableSlots, setAvailableSlots] =
    useState<string[]>([]);

  const [totalSeats, setTotalSeats] =
    useState("20");

  const [formLoading, setFormLoading] =
    useState(false);

  // ==========================================
  // Load Restaurant Data
  // ==========================================

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    setName(restaurant.name || "");

    setDescription(
      restaurant.description || ""
    );

    setCuisine(
      restaurant.cuisine || ""
    );

    setPriceRange(
      restaurant.priceRange || "$$"
    );

    setLocation(
      restaurant.location || ""
    );

    setAddress(
      restaurant.address || ""
    );

    setChef(
      restaurant.chef || ""
    );

    setTags(
      Array.isArray(restaurant.tags)
        ? restaurant.tags.join(", ")
        : ""
    );

    setTotalSeats(
      restaurant.totalSeats
        ? String(restaurant.totalSeats)
        : "20"
    );

    setAvailableSlots(
      Array.isArray(
        restaurant.availableSlots
      )
        ? restaurant.availableSlots
        : []
    );

    setImagePreview(
      restaurant.image || ""
    );

    setImageFile(null);
  }, [restaurant]);

  // ==========================================
  // Cleanup Blob Image URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  // ==========================================
  // Toggle Available Slot
  // ==========================================

  const toggleSlot = (slot: string) => {
    setAvailableSlots(
      (currentSlots) => {
        if (
          currentSlots.includes(slot)
        ) {
          return currentSlots.filter(
            (currentSlot) =>
              currentSlot !== slot
          );
        }

        return [
          ...currentSlots,
          slot,
        ].sort();
      }
    );
  };

  // ==========================================
  // Handle Image Selection
  // ==========================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image type
    if (
      !file.type.startsWith("image/")
    ) {
      toast.error(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    // Validate image size
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    // Revoke old preview URL
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );
  };

  // ==========================================
  // Update Restaurant
  // PUT /api/owner/restaurant
  // ==========================================

  const handleUpdateRestaurant =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      // ==========================================
      // Validate Required Fields
      // ==========================================

      if (!name.trim()) {
        toast.error(
          "Restaurant name is required."
        );
        return;
      }

      if (!description.trim()) {
        toast.error(
          "Restaurant description is required."
        );
        return;
      }

      if (!cuisine.trim()) {
        toast.error(
          "Cuisine type is required."
        );
        return;
      }

      if (!location.trim()) {
        toast.error(
          "Location is required."
        );
        return;
      }

      if (!address.trim()) {
        toast.error(
          "Address is required."
        );
        return;
      }

      if (!chef.trim()) {
        toast.error(
          "Chef name is required."
        );
        return;
      }

      // ==========================================
      // Validate Seats
      // ==========================================

      const seats =
        Number(totalSeats);

      if (
        !Number.isInteger(seats) ||
        seats < 1
      ) {
        toast.error(
          "Total capacity must be at least 1 seat."
        );

        return;
      }

      // ==========================================
      // Validate Slots
      // ==========================================

      if (
        availableSlots.length === 0
      ) {
        toast.error(
          "Please select at least one available slot."
        );

        return;
      }

      setFormLoading(true);

      try {
        // ==========================================
        // Create FormData
        // ==========================================

        const formData =
          new FormData();

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

        formData.append(
          "tags",
          tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean)
            .join(",")
        );

        formData.append(
          "availableSlots",
          availableSlots.join(",")
        );

        formData.append(
          "totalSeats",
          String(seats)
        );

        // Add image only when user selected
        // a new image.
        if (imageFile) {
          formData.append(
            "image",
            imageFile
          );
        }

        // ==========================================
        // API Request
        // PUT /api/owner/restaurant
        // ==========================================

        const response =
          await api.put(
            "/owner/restaurant",
            formData
          );

        // ==========================================
        // Extract Updated Restaurant
        // ==========================================

        const updatedRestaurant =
          response.data?.restaurant ??
          response.data?.data ??
          response.data;

        if (
          !updatedRestaurant ||
          typeof updatedRestaurant !==
            "object"
        ) {
          throw new Error(
            "Updated restaurant data was not returned by the server."
          );
        }

        // ==========================================
        // Update Parent State
        // ==========================================

        setRestaurant(
          updatedRestaurant as Restaurant
        );

        // ==========================================
        // Reset Selected Image
        // ==========================================

        setImageFile(null);

        toast.success(
          "Profile details updated successfully!"
        );
      } catch (error: any) {
        console.error(
          "Failed to update restaurant:",
          error
        );

        const status =
          error?.response?.status;

        if (status === 401) {
          toast.error(
            "Your session has expired. Please login again."
          );
        } else if (status === 403) {
          toast.error(
            "You are not authorized to update this restaurant."
          );
        } else if (status === 404) {
          toast.error(
            "Restaurant profile not found."
          );
        } else {
          toast.error(
            error?.response?.data
              ?.message ||
              error?.message ||
              "Update failed. Please try again."
          );
        }
      } finally {
        setFormLoading(false);
      }
    };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="bg-white border border-outline-variant/20 p-6 md:p-8 rounded-md shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-outline-variant/10 pb-4">
        <h3 className="font-display text-lg font-medium text-primary">
          Update Profile & Capacity
        </h3>

        <p className="text-xs text-black/45 mt-1">
          Update your restaurant information,
          image, capacity and available
          reservation slots.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={
          handleUpdateRestaurant
        }
        className="space-y-5"
      >
        {/* ======================================
            Name + Cuisine
        ======================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Restaurant Name */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-name"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Restaurant Name
            </label>

            <input
              id="restaurant-name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
            />
          </div>

          {/* Cuisine */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-cuisine"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Cuisine Type
            </label>

            <input
              id="restaurant-cuisine"
              type="text"
              required
              maxLength={100}
              value={cuisine}
              onChange={(event) =>
                setCuisine(
                  event.target.value
                )
              }
              className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* ======================================
            Description
        ======================================= */}

        <div className="space-y-1">
          <label
            htmlFor="restaurant-description"
            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
          >
            Description
          </label>

          <textarea
            id="restaurant-description"
            required
            rows={4}
            maxLength={1000}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            className="w-full bg-surface-container-low/30 border border-outline-variant/40 p-3 text-xs focus:border-secondary focus:outline-none rounded-sm resize-none"
          />
        </div>

        {/* ======================================
            Image
        ======================================= */}

        <div className="space-y-1">
          <label className="block text-[10px] font-medium text-black/55 tracking-wider uppercase">
            Restaurant Cover Image
          </label>

          <div className="flex flex-col md:flex-row gap-4 items-center bg-surface-container-low/30 border border-outline-variant/40 p-4 rounded-sm">
            {/* Preview */}
            <div className="relative w-32 h-24 bg-surface border border-outline-variant/30 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={`${name || "Restaurant"} preview`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon
                  size={24}
                  className="text-black/30"
                />
              )}
            </div>

            {/* Upload */}
            <div className="grow space-y-2 text-center md:text-left w-full">
              <p className="text-[11px] text-black/55 leading-relaxed">
                Upload a high-resolution
                banner photo. JPG, PNG and
                WebP up to 5 MB.
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

        {/* ======================================
            Price / Location / Capacity
        ======================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-price"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Price Range
            </label>

            <select
              id="restaurant-price"
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
              htmlFor="restaurant-location"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Location
            </label>

            <input
              id="restaurant-location"
              type="text"
              required
              maxLength={100}
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
            />
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-capacity"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Total Capacity
            </label>

            <input
              id="restaurant-capacity"
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

        {/* ======================================
            Address + Chef
        ======================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-address"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Address
            </label>

            <input
              id="restaurant-address"
              type="text"
              required
              maxLength={250}
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }
              className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
            />
          </div>

          {/* Chef */}
          <div className="space-y-1">
            <label
              htmlFor="restaurant-chef"
              className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
            >
              Executive Chef
            </label>

            <input
              id="restaurant-chef"
              type="text"
              required
              maxLength={100}
              value={chef}
              onChange={(event) =>
                setChef(
                  event.target.value
                )
              }
              className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* ======================================
            Tags
        ======================================= */}

        <div className="space-y-1">
          <label
            htmlFor="restaurant-tags"
            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
          >
            Tags (comma separated)
          </label>

          <input
            id="restaurant-tags"
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

        {/* ======================================
            Available Slots
        ======================================= */}

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
                      toggleSlot(slot)
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

          <p className="text-[10px] text-black/40">
            Selected slots:{" "}
            {availableSlots.length}
          </p>
        </div>

        {/* ======================================
            Save Button
        ======================================= */}

        <button
          type="submit"
          disabled={formLoading}
          className="w-full bg-primary hover:bg-secondary text-white text-xs font-medium tracking-widest uppercase py-3.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {formLoading
            ? "SAVING CHANGES..."
            : "SAVE PROFILE DETAILS"}
        </button>
      </form>
    </div>
  );
}