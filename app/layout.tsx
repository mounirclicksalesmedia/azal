import type { Metadata } from 'next';
import './globals.css';

const FAVICON = '/brand/logo/black_logo.svg';

export const metadata: Metadata = {
  metadataBase: new URL('https://azal.sa'),
  title: 'Azal — Rawajeh Holding',
  description: 'Azal — A complete business experience by Rawajeh Holding.',
  icons: {
    icon: [{ url: FAVICON, type: 'image/svg+xml' }],
    shortcut: [{ url: FAVICON }],
    apple: [{ url: FAVICON, type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
