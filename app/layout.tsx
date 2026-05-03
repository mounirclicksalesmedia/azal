import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azal — Rawajeh Holding',
  description: 'Azal — A complete business experience by Rawajeh Holding.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
