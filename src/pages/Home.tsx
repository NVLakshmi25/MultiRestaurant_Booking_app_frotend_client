import { useEffect, useState } from "react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import AuthModal from "../Components/AuthModal";

import Hero from "../Components/home/Hero";
import CuisineBrowse from "../Components/home/CuisineBrowse";
import TrendingRow from "../Components/home/TrendingRow";
import MembershipSection from "../Components/home/MembershipSection";
import NewsletterCTA from "../Components/home/NewsletterCTA";

import type { Restaurant } from "../types";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function Home() {
    const [trending, setTrending] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.get("/restaurants/featured");

                setTrending(res.data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to load featured restaurants");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            <AuthModal />

            <main className="flex-1">
                <Hero />

                <CuisineBrowse />

                <TrendingRow
                    trending={trending}
                    loading={loading}
                />

                <MembershipSection />

                <NewsletterCTA />
            </main>

            <Footer />
        </div>
    );
}