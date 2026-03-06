import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400'],
    style: ['normal', 'italic'],
    variable: '--font-instrument-serif',
    display: 'optional',
    preload: true,
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'optional',
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ash1999.vercel.app'),
    title: 'ash1999 - Portfolio',
    description: 'Portfolio of ash1999 — branding, typography, print, web design, motion design, illustration and mixed media projects.',
    openGraph: {
        title: 'ash1999 - Portfolio',
        description: 'Branding, typography, print, web design, motion design, illustration and mixed media projects.',
        images: ['/img/logo-ash1999.webp'],
        type: 'website',
        locale: 'fr_FR',
    },
    twitter: {
        card: 'summary',
        title: 'ash1999 - Portfolio',
        description: 'Branding, typography, print, web design, motion design, illustration and mixed media projects.',
        images: ['/img/logo-ash1999.webp'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={`${instrumentSerif.variable} ${inter.variable}`}>
            <body>{children}</body>
        </html>
    );
}
