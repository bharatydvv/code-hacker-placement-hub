import { getSessionUser } from '@/lib/supabase/server';
import { NavbarClient } from './navbar-client';

export async function Navbar() {
  const user = await getSessionUser();

  return <NavbarClient loggedIn={!!user} />;
}