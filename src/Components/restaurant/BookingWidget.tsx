import { Calendar, Users } from "lucide-react";

import type {
    AvailabilitySlot,
    Restaurant,
} from "../../types";

interface BookingWidgetProps {
    restaurant: Restaurant | null;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    selectedGuests: string;
    setSelectedGuests: (guests: string) => void;
    selectedSlot: string;
    setSelectedSlot: (slot: string) => void;
    slotsAvailability: AvailabilitySlot[];
    loadingSlots: boolean;
    isAuthenticated: boolean;
    handleReserveClick: () => void;
}

/**
 * Returns today's date in the user's local timezone.
 *
 * We avoid:
 * new Date().toISOString().split("T")[0]
 *
 * because toISOString() converts the date to UTC.
 */
function getLocalDateString(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Converts 24-hour time into 12-hour display format.
 *
 * Example:
 * 18:00 -> 6:00 PM
 * 12:00 -> 12:00 PM
 * 00:30 -> 12:30 AM
 */
function formatTime(time: string): string {
    const [hourString, minute = "00"] = time.split(":");
    const hour = Number(hourString);

    if (!Number.isFinite(hour)) {
        return time;
    }

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
}

export default function BookingWidget({
    restaurant,
    selectedDate,
    setSelectedDate,
    selectedGuests,
    setSelectedGuests,
    selectedSlot,
    setSelectedSlot,
    slotsAvailability,
    loadingSlots,
    isAuthenticated,
    handleReserveClick,
}: BookingWidgetProps) {
    if (!restaurant) {
        return null;
    }

    const today = getLocalDateString();
    const isToday = selectedDate === today;
    const guests = Number(selectedGuests);

    /*
     * If the backend has returned availability,
     * use it.
     *
     * Otherwise use the restaurant's dummy available slots.
     */
    const allSlots: AvailabilitySlot[] =
        slotsAvailability.length > 0
            ? slotsAvailability
            : restaurant.availableSlots.map((time) => ({
                  time,
                  availableSeats: restaurant.totalSeats,
                  isAvailable: true,
              }));

    /*
     * On today's date, hide time slots that have already passed.
     */
    const visibleSlots = allSlots.filter((slot) => {
        if (!isToday) {
            return true;
        }

        const [hour, minute] = slot.time
            .split(":")
            .map(Number);

        if (
            !Number.isFinite(hour) ||
            !Number.isFinite(minute)
        ) {
            return false;
        }

        const slotDate = new Date();

        slotDate.setHours(hour, minute, 0, 0);

        return slotDate > new Date();
    });

    /*
     * If the user changes the party size,
     * make sure the currently selected slot
     * still has enough seats.
     */
    const handleGuestChange = (value: string) => {
        const newGuestCount = Number(value);

        setSelectedGuests(value);

        const selectedAvailability = allSlots.find(
            (slot) => slot.time === selectedSlot
        );

        if (
            selectedAvailability &&
            (
                !selectedAvailability.isAvailable ||
                selectedAvailability.availableSeats <
                    newGuestCount
            )
        ) {
            setSelectedSlot("");
        }
    };

    /*
     * When the date changes, the previously selected
     * time may not exist on the new date.
     */
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot("");
    };

    return (
        <div className="bg-white border border-outline-variant/20 p-6 rounded-md shadow-sm text-left">
            <h3 className="font-display text-lg font-medium text-primary mb-4 pb-3 border-b border-outline-variant/10">
                Book a Table
            </h3>

            <div className="space-y-4">

                {/* =========================
                    PARTY SIZE
                ========================== */}
                <div className="space-y-1">
                    <label
                        htmlFor="party-size"
                        className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                    >
                        PARTY SIZE
                    </label>

                    <div className="relative">
                        <Users
                            className="absolute left-3 top-3 text-black/55"
                            size={16}
                        />

                        <select
                            id="party-size"
                            name="partySize"
                            value={selectedGuests}
                            onChange={(event) =>
                                handleGuestChange(
                                    event.target.value
                                )
                            }
                            className="w-full bg-surface-container-low/30 pl-9 pr-3 py-2.5 text-xs border border-outline-variant/40 focus:border-secondary focus:outline-none rounded-md cursor-pointer"
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
                </div>

                {/* =========================
                    DATE
                ========================== */}
                <div className="space-y-1">
                    <label
                        htmlFor="booking-date"
                        className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                    >
                        DATE
                    </label>

                    <div className="relative">
                        <Calendar
                            className="absolute left-3 top-3 text-black/55"
                            size={16}
                        />

                        <input
                            id="booking-date"
                            name="bookingDate"
                            type="date"
                            value={selectedDate}
                            min={today}
                            onChange={(event) =>
                                handleDateChange(
                                    event.target.value
                                )
                            }
                            className="w-full bg-surface-container-low/30 pl-9 pr-3 py-2.5 text-xs border border-outline-variant/40 focus:border-secondary focus:outline-none rounded-md cursor-pointer"
                        />
                    </div>
                </div>

                {/* =========================
                    AVAILABLE TIMES
                ========================== */}
                <div className="space-y-2 pt-2">
                    <span className="block text-[10px] font-medium text-black/55 tracking-wider uppercase">
                        AVAILABLE TIMES
                    </span>

                    <div className="grid grid-cols-3 gap-2">

                        {/* Loading */}
                        {loadingSlots && (
                            <div className="col-span-3 py-4 flex justify-center">
                                <div className="w-5 h-5 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin" />
                            </div>
                        )}

                        {/* No slots */}
                        {!loadingSlots &&
                            visibleSlots.length === 0 && (
                                <p className="col-span-3 py-4 text-center text-xs text-black/45">
                                    No available times for
                                    this date.
                                </p>
                            )}

                        {/* Slots */}
                        {!loadingSlots &&
                            visibleSlots.length > 0 &&
                            visibleSlots.map(
                                (slotInfo) => {
                                    const isSelected =
                                        selectedSlot ===
                                        slotInfo.time;

                                    const isFull =
                                        !slotInfo.isAvailable ||
                                        slotInfo.availableSeats <
                                            guests;

                                    return (
                                        <button
                                            key={
                                                slotInfo.time
                                            }
                                            type="button"
                                            disabled={isFull}
                                            onClick={() =>
                                                setSelectedSlot(
                                                    slotInfo.time
                                                )
                                            }
                                            className={`py-2 px-1 text-center text-[10px] font-medium tracking-wider border transition-all rounded-sm ${
                                                isSelected
                                                    ? "bg-secondary border-secondary text-white shadow-sm cursor-pointer"
                                                    : isFull
                                                      ? "bg-black/5 border-outline-variant/10 text-black/25 cursor-not-allowed opacity-50"
                                                      : "border-outline-variant/40 text-black/55 hover:border-primary hover:text-primary cursor-pointer"
                                            }`}
                                        >
                                            {formatTime(
                                                slotInfo.time
                                            )}

                                            {isFull && (
                                                <span className="block text-[8px] text-error uppercase mt-0.5">
                                                    Full
                                                </span>
                                            )}
                                        </button>
                                    );
                                }
                            )}
                    </div>
                </div>

                {/* =========================
                    RESERVE BUTTON
                ========================== */}
                <button
                    type="button"
                    onClick={handleReserveClick}
                    className="w-full bg-primary hover:bg-secondary text-on-primary py-4 mt-6 text-xs font-medium tracking-widest uppercase transition-colors cursor-pointer"
                >
                    {isAuthenticated
                        ? "RESERVE NOW"
                        : "LOGIN TO RESERVE"}
                </button>

                <p className="text-center text-[10px] text-black/55 mt-3 leading-relaxed">
                    No reservation fee. Cancel for free
                    up to 24 hours prior.
                </p>
            </div>
        </div>
    );
}