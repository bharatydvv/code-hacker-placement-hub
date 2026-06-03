import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { resourceId } = await request.json();
    if (!resourceId) return NextResponse.json({ error: 'resourceId required' }, { status: 400 });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('resource_views').insert({ resource_id: resourceId, user_id: user?.id ?? null });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
