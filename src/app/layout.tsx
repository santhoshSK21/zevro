import type { Metadata } from "next";
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
import ThemeSync from "../components/layout/ThemeSync";
import InAppNavigationGuard from "../components/layout/InAppNavigationGuard";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import ToastProvider from "../components/ui/ToastProvider";

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
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Providers>
          <InAppNavigationGuard />
          <ThemeSync />
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
          <MobileBottomNav />
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
