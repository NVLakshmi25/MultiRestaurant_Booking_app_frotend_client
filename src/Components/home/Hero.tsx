import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    Calendar,
    Users,
} from "lucide-react";

import { assets } from "../../assets/assets";

function getLocalDateString(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function Hero() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearchSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const params = new URLSearchParams();

        const trimmedSearch = searchQuery.trim();
        const trimmedLocation = location.trim();

        if (trimmedSearch) {
            params.set("search", trimmedSearch);
        }

        if (trimmedLocation) {
            params.set("location", trimmedLocation);
        }

        if (date) {
            params.set("date", date);
        }

        if (guests) {
            params.set("guests", guests);
        }

        const queryString = params.toString();

        navigate(
            queryString
                ? `/search?${queryString}`
                : "/search"
        );
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={assets.hero_bg_img}
                    alt="Elegant dining room"
                    className="w-full h-full object-cover brightness-70"
                />

                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 text-center">
                <span className="text-sm text-secondary-container tracking-[0.25em] uppercase block mb-4">
                    EXQUISITE DINING EXPERIENCES
                </span>

                <h1 className="font-display text-4xl md:text-6xl text-white mb-12 max-w-3xl mx-auto leading-[1.15] font-medium tracking-tight drop-shadow-md">
                    Curation for the Discerning Palette
                </h1>

                {/* Search Form */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white p-3 md:p-2.5 ambient-shadow max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
                >
                    {/* Search */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Search
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            type="text"
                            name="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search cuisines, restaurants..."
                            autoComplete="off"
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-black/70"
                        />
                    </div>

                    {/* Location */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <MapPin
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            type="text"
                            name="location"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                            placeholder="Location (e.g. Manhattan)"
                            autoComplete="off"
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-black/70"
                        />
                    </div>

                    {/* Date */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Calendar
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            type="date"
                            name="date"
                            value={date}
                            min={getLocalDateString()}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface cursor-pointer"
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Users
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <select
                            name="guests"
                            value={guests}
                            onChange={(event) =>
                                setGuests(event.target.value)
                            }
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface cursor-pointer"
                        >
                            <option value="1">
                                1 Guest
                            </option>

                            <option value="2">
                                2 Guests
                            </option>

                            <option value="4">
                                4 Guests
                            </option>

                            <option value="6">
                                6 Guests
                            </option>

                            <option value="8">
                                8 Guests
                            </option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-primary text-on-primary text-xs tracking-widest uppercase px-8 py-4 md:py-3 hover:bg-secondary hover:text-white transition-soft cursor-pointer"
                    >
                        FIND A TABLE
                    </button>
                </form>
            </div>
        </section>
    );
}