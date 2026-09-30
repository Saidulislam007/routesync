import Navbar from "@/components/Navbar";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "RouteSync",
  description: "Smarter shared company travel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <Navbar />

        {children}
      </body>
    </html>
  );
}