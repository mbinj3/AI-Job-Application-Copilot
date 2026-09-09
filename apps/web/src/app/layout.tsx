import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AI Job Application Copilot',
    template: '%s | AI Job Application Copilot',
  },
  description:
    'Your AI-powered assistant for crafting tailored job applications, analyzing job descriptions, and tracking your career progress.',
  keywords: ['job application', 'AI assistant', 'resume', 'career', 'job search'],
  authors: [{ name: 'AI Job Application Copilot' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Job Application Copilot',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
