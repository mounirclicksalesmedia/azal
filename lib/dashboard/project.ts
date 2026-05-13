import { DEFAULT_PROJECT, isProject, type Project } from '@/lib/supabase/types';

/** Read ?project=… from the page's resolved searchParams. */
export function resolveProject(sp: { project?: string | string[] }): Project {
  const raw = Array.isArray(sp.project) ? sp.project[0] : sp.project;
  return isProject(raw) ? raw : DEFAULT_PROJECT;
}
