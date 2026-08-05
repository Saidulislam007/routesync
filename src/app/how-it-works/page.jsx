import HowItWorksPage from "@/components/HowItWorksPage";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "How It Works | RouteSync",
  description:
    "Learn how RouteSync matches eligible company trips, assigns shared vehicles, and keeps employees informed.",
};

export default function HowItWorksRoute() {
  return (
    <main className="min-h-screen bg-background pt-16 text-foreground transition-colors lg:pt-[72px]">
      <Navbar />
      <HowItWorksPage />
    </main>
  );
}
