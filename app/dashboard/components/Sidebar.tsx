'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  PROJECTS,
  isProject,
  type Profile,
  type Project,
} from '@/lib/supabase/types';

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
  {
    href: '/dashboard/utm',
    label: 'UTM links',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="dash-nav-icon" aria-hidden>
        <path
          d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Sidebar({ profile }: { profile: Profile }) {
  const path = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const currentProject: Project =
    isProject(sp.get('project') ?? '') ? (sp.get('project') as Project) : 'azal';

  const switchProject = (project: Project) => {
    const params = new URLSearchParams(sp.toString());
    params.set('project', project);
    router.replace(`${path}?${params.toString()}`);
  };

  const withProject = (href: string) => `${href}?project=${currentProject}`;

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <div className="dash-brand-mark">R</div>
        <div>
          <div className="dash-brand-name">Rawajeh</div>
          <div className="dash-brand-sub">Portal</div>
        </div>
      </div>

      <label className="dash-project-switch">
        <span className="dash-project-label">Project</span>
        <select
          value={currentProject}
          onChange={(e) => switchProject(e.target.value as Project)}
          className="dash-select"
        >
          {PROJECTS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <nav className="dash-nav" aria-label="Dashboard">
        {items.map((it) => {
          const active =
            it.href === '/dashboard' ? path === '/dashboard' : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={withProject(it.href)}
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
