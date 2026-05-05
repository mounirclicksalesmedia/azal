'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Profile } from '@/lib/supabase/types';

const items = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="dash-nav-icon" aria-hidden>
        <path d="M3 12l9-8 9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/leads',
    label: 'Leads',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="dash-nav-icon" aria-hidden>
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="dash-nav-icon" aria-hidden>
        <path d="M5 21V9M12 21V3M19 21v-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar({ profile }: { profile: Profile }) {
  const path = usePathname();

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <div className="dash-brand-mark">A</div>
        <div>
          <div className="dash-brand-name">Azal</div>
          <div className="dash-brand-sub">Rawajeh</div>
        </div>
      </div>

      <nav className="dash-nav" aria-label="Dashboard">
        {items.map((it) => {
          const active =
            it.href === '/dashboard' ? path === '/dashboard' : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className="dash-nav-item"
              data-active={active}
            >
              {it.icon}
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="dash-user">
        <div>
          <div className="dash-user-name">{profile.full_name || profile.email}</div>
          <div className="dash-user-role">{profile.role}</div>
        </div>
        <form action="/auth/sign-out" method="post">
          <button type="submit" className="dash-signout">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
