import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import CookieBanner from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'SunuActu — Toute l\'information du Sénégal au même endroit',
  description: 'Portail d\'agrégation média du Sénégal : actualités, articles de presse, vidéos et diffusions en direct des plus grands journaux et chaînes télé du Sénégal.',
  keywords: ['Sénégal', 'Actualité', 'Presse Sénégal', 'Seneweb', 'DakarActu', 'RTS', 'TFM', 'Direct TV', 'Information'],
  openGraph: {
    title: 'SunuActu — Le Hub Média du Sénégal',
    description: 'Actualités, Vidéos et Directs de la presse sénégalaise centralisés.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SunuActu'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <CookieBanner />
      </body>
    </html>
  );
}
