import type { Metadata } from "next";
import { Inter, Poppins, Hind } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ["700", "800"], subsets: ["latin"], variable: "--font-poppins" });
const hind = Hind({ weight: ["400", "500", "600"], subsets: ["devanagari", "latin"], variable: "--font-hind" });

export const metadata: Metadata = {
  title: "Blessed Computers | Kanpur",
  description: "Genuine Computer Hardware. Real Prices. Real Shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${hind.variable}`}>
      <body className="font-body bg-brand-cream text-brand-charcoal antialiased flex flex-col min-h-screen">
        <Header />
        
        {/* pb-20 prevents the bottom nav from hiding content on mobile phones */}
        <main className="flex-grow pb-20 md:pb-0">
          {children}
        </main>
        
        <BottomNav />
      </body>
    </html>
  );
}
