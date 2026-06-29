import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteProvider } from "@/context/QuoteContext";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanghi Pipes & Tubes | Premium Industrial Solutions",
  description: "Sanghi Pipes & Tubes — Manufacturer of DI Double Flange Pipes and OPVC Pipes. BIS Licensed. 15+ years of industry expertise. Serving India's infrastructure from Kanpur, Uttar Pradesh.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  // The middleware sets x-pathname so we can detect admin routes server-side.
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin  = pathname.startsWith("/admin");

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QuoteProvider>
            {!isAdmin && <ScrollProgress />}
            {!isAdmin && <Navbar />}
            <main className="flex-grow">
              {children}
            </main>
            {!isAdmin && <Footer />}
          </QuoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
