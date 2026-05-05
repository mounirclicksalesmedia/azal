import type { Metadata } from 'next';
import '../dashboard/dashboard.css';

export const metadata: Metadata = {
  title: 'Sign in — Azal admin',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="login-shell">{children}</div>
      </body>
    </html>
  );
}
