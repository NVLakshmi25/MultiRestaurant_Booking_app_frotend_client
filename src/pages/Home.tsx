import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

import Hero from "../components/home/Hero";
import CuisineBrowse from "../components/home/CuisineBrowse";
import TrendingRow from "../components/home/TrendingRow";
import MembershipSection from "../components/home/MembershipSection";
import NewsletterCTA from "../components/home/NewsletterCTA";

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