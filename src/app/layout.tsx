import type { Metadata } from "next";
import { Playfair_Display, Inter } from 'next/font/google';
import "../styles/variables.css";
import "../styles/animations.css";
import "../styles/globals.css";
import Providers from "../components/Providers";
import AnnouncementBar from "../components/layout/AnnouncementBar";
import Navbar from "../components/layout/Navbar";
import MobileMenu from "../components/layout/MobileMenu";
import SearchOverlay from "../components/layout/SearchOverlay";
import CartDrawer from "../components/layout/CartDrawer";
import CartSync from "../components/layout/CartSync";
import Footer from "../components/layout/Footer";
import ToastProvider from "../components/ui/ToastProvider";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400','500','600'],
  style: ['normal','italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZEVRO | WEAR TO INSPIRE",
  description: "Premium Indian fashion — Western Wear, Ethnic Wear, Indo-Western, Accessories",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <CartSync />
          <AnnouncementBar />
          <Navbar />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>
            {children}
          </main>
          <Footer />
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
