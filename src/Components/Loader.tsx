interface LoaderProps {
    text?: string;
}

export default function Loader({
    text = "Loading...",
}: LoaderProps) {
    return (
        <div className="min-h-screen bg-surface flex flex-col justify-center items-center">
            <div
                className="w-12 h-12 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin"
                aria-label="Loading"
            />

            <p className="font-display text-sm tracking-widest text-black/55 mt-4 animate-pulse uppercase">
                {text}
            </p>
        </div>
    );
}