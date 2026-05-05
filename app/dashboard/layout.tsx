import type { Metadata } from 'next';
import { verifyStaffSession } from '@/lib/dashboard/dal';
import Sidebar from './components/Sidebar';
import './dashboard.css';

export const metadata: Metadata = {
  title: 'Dashboard — Azal',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await verifyStaffSession();

  return (
    <html lang="en">
      <body>
        <div className="dash-shell">
          <Sidebar profile={profile} />
          <main className="dash-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
