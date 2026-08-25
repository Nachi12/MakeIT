import type { Metadata } from 'next';
import './globals.css';
import { AppStateProvider } from '@/lib/services/store';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'MakeIT — IT Services & Technology Expert Network',
  description: 'Tell us what you want to build. We connect businesses with verified software engineers, UI/UX designers, and technology specialists.',
  openGraph: {
    title: 'MakeIT — IT Services & Technology Expert Network',
    description: 'Tell us what you want to build. We find the right technology expert for your project.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#F7F3E8] text-[#111111] antialiased selection:bg-[#F97316] selection:text-white">
        <AppStateProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
