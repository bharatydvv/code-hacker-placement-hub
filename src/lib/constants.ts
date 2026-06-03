export const SITE = {
  name: 'Code Hacker Placement Hub',
  tagline: 'Crack Your Dream Placement With Smart Preparation',
  description:
    'Prepare for placements with Company Wise Questions, PYQs, Quick Notes, Interview Questions, Aptitude Resources and Subject Wise Study Material.',
};

export const SITE_KEYWORDS = [
  'placement preparation', 'campus placement', 'interview questions', 'PYQs',
  'aptitude', 'DBMS', 'operating system', 'computer networks', 'data structures',
  'algorithms', 'TCS', 'Infosys', 'Amazon', 'Google', 'technical interview', 'HR interview',
];

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Subjects', href: '/subjects' },
  { label: 'Companies', href: '/companies' },
  { label: 'Interview Questions', href: '/resources?type=Interview+Questions' },
  { label: 'Quick Notes', href: '/resources?type=Quick+Notes' },
  { label: 'PYQs', href: '/resources?type=PYQs' },
  { label: 'Aptitude', href: '/aptitude' },
  { label: 'Dashboard', href: '/dashboard' },
];

export const RESOURCE_TYPES = [
  'Quick Notes',
  'Detailed Notes',
  'MCQs',
  'PYQs',
  'Interview Questions',
  'Technical Questions',
  'HR Questions',
  'Interview Experience',
  'Cheat Sheets',
  'Assignments',
  'Aptitude Resources',
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export function typeToSlug(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '-');
}

export function slugToType(slug: string): string | undefined {
  return RESOURCE_TYPES.find((t) => typeToSlug(t) === slug);
}
