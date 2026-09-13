import type { FormEvent } from "react";

interface BookingFormProps {
    name: string;
    setName: (value: string) => void;

    email: string;
    setEmail: (value: string) => void;

    phone: string;
    setPhone: (value: string) => void;

    occasion: string;
    setOccasion: (value: string) => void;

    specialRequests: string;
    setSpecialRequests: (value: string) => void;

    confirming: boolean;

    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function BookingForm({
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    occasion,
    setOccasion,
    specialRequests,
    setSpecialRequests,
    confirming,
    onSubmit,
}: BookingFormProps) {
    return (
        <div className="bg-white border border-outline-variant/20 p-8 rounded-md shadow-sm text-left">
            <h3 className="font-display text-lg font-semibold text-primary mb-6 pb-3 border-b border-outline-variant/10">
                Guest Details
            </h3>

            <form
                onSubmit={onSubmit}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label
                            htmlFor="guest-name"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            FULL NAME
                        </label>

                        <input
                            id="guest-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            autoComplete="name"
                            className="w-full pb-2 pt-1 text-sm bg-transparent border-b border-outline-variant/60 focus:border-secondary focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label
                            htmlFor="guest-email"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="guest-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            autoComplete="email"
                            className="w-full pb-2 pt-1 text-sm bg-transparent border-b border-outline-variant/60 focus:border-secondary focus:outline-none transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Phone */}
                    <div className="space-y-1">
                        <label
                            htmlFor="guest-phone"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            PHONE NUMBER
                        </label>

                        <input
                            id="guest-phone"
                            type="tel"
                            value={phone}
                            onChange={(event) =>
                                setPhone(event.target.value)
                            }
                            autoComplete="tel"
                            className="w-full pb-2 pt-1 text-sm bg-transparent border-b border-outline-variant/60 focus:border-secondary focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {/* Occasion */}
                    <div className="space-y-1">
                        <label
                            htmlFor="occasion"
                            className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                        >
                            SPECIAL OCCASION
                        </label>

                        <select
                            id="occasion"
                            value={occasion}
                            onChange={(event) =>
                                setOccasion(event.target.value)
                            }
                            className="w-full pb-2 pt-1 text-sm bg-transparent border-b border-outline-variant/60 focus:border-secondary focus:outline-none cursor-pointer"
                        >
                            <option value="">
                                None
                            </option>

                            <option value="Birthday">
                                Birthday
                            </option>

                            <option value="Anniversary">
                                Anniversary
                            </option>

                            <option value="Date Night">
                                Date Night
                            </option>

                            <option value="Business Dining">
                                Business Dining
                            </option>
                        </select>
                    </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1">
                    <label
                        htmlFor="special-requests"
                        className="block text-[10px] font-medium text-black/55 tracking-wider uppercase"
                    >
                        SPECIAL REQUESTS (OPTIONAL)
                    </label>

                    <textarea
                        id="special-requests"
                        value={specialRequests}
                        onChange={(event) =>
                            setSpecialRequests(
                                event.target.value
                            )
                        }
                        rows={3}
                        placeholder="Allergies, dietary restrictions, table preference..."
                        className="w-full bg-surface-container-low/20 border border-outline-variant/40 rounded-md p-3 text-xs focus:border-secondary focus:outline-none"
                    />
                </div>

                {/* Newsletter */}
                <div className="flex items-start gap-3 py-2">
                    <input
                        type="checkbox"
                        id="newsletterOpt"
                        className="mt-1 cursor-pointer"
                        defaultChecked
                    />

                    <label
                        htmlFor="newsletterOpt"
                        className="text-xs text-black/55 leading-relaxed cursor-pointer select-none"
                    >
                        Send me seasonal tasting menu invitations
                        and private chef event notifications from
                        QuickDine.
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={confirming}
                    className="w-full bg-primary hover:bg-secondary text-white py-4 text-xs font-medium tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {confirming
                        ? "CONFIRMING TABLE..."
                        : "BOOK TABLE"}
                </button>
            </form>
        </div>
    );
}