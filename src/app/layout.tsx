import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, DM_Mono } from 'next/font/google';
import "../styles/variables.css";
import "../styles/animations.css";
import "../styles/globals.css";
import Providers from "../components/Providers";
import AnnouncementBar from "../components/layout/AnnouncementBar";
import Navbar from "../components/layout/Navbar";
import MobileMenu from "../components/layout/MobileMenu";
import SearchOverlay from "../components/layout/SearchOverlay";
import CartDrawer from "../components/layout/CartDrawer";
import Footer from "../components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300','400','500','600'],
  style: ['normal','italic'],
  variable: '--font-display'
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300','400','500','600'],
  variable: '--font-body'
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300','400','500'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: "ZEVRO | WEAR TO INSPIRE",
  description: "Premium Indian fashion — Western Wear, Ethnic Wear, Indo-Western, Accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${dmMono.variable}`}>
      <body>
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
