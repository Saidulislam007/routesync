import Navbar from "@/components/Navbar";
import TripsPage from "@/components/TripsPage";

export const metadata = {
  title: "Trips | RouteSync",
  description: "Request and match smarter shared company trips with RouteSync.",
};

export default function TripsRoute() {
  return (
    <main className="min-h-screen bg-background pt-16 text-foreground transition-colors lg:pt-[72px]">
      <Navbar />
      <TripsPage />
    </main>
  );
}
