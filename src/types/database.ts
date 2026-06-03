export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  study_streak: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export type ResourceTypeValue =
  | 'Quick Notes'
  | 'Detailed Notes'
  | 'MCQs'
  | 'PYQs'
  | 'Interview Questions'
  | 'Technical Questions'
  | 'HR Questions'
  | 'Interview Experience'
  | 'Cheat Sheets'
  | 'Assignments'
  | 'Aptitude Resources';

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  resource_type: ResourceTypeValue;
  subject_id: string | null;
  company_id: string | null;
  drive_link: string;
  thumbnail_url: string | null;
  published: boolean;
  view_count: number;
  download_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceWithRelations extends Resource {
  subject?: Pick<Subject, 'id' | 'slug' | 'name'> | null;
  company?: Pick<Company, 'id' | 'slug' | 'name'> | null;
}

export interface Bookmark {
  user_id: string;
  resource_id: string;
  created_at: string;
}
