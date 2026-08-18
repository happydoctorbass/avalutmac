import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

function isAdminEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  if (!lower) return false;

  // Patterns representing admin/developer accounts
  if (
    lower.includes('admin') ||
    lower.includes('dev') ||
    lower.includes('nur') ||
    lower.includes('root') ||
    lower.includes('super') ||
    lower.includes('owner') ||
    lower.includes('master')
  ) {
    return true;
  }

  // Any non-cashier external email (not ending in @admiral.internal) is treated as developer
  if (!lower.endsWith('@admiral.internal')) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

    let bodyUserId: string | undefined;
    let bodyEmail: string | undefined;

    try {
      const body = await req.json();
      bodyUserId = body?.userId;
      bodyEmail = body?.email;
    } catch {
      // Body is optional
    }

    const authClient = supabaseAdmin ?? supabase;
    let authUser = null;

    if (token) {
      const { data: { user }, error: authErr } = await authClient.auth.getUser(token);
      if (!authErr && user) {
        authUser = user;
      }
    }

    const userId = authUser?.id || bodyUserId;
    const userEmail = authUser?.email || bodyEmail || '';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session or User ID required' },
        { status: 401 }
      );
    }

    // 1. Check if profile already exists in public.profiles
    const { data: existingProf } = await authClient
      .from('profiles')
      .select('id, role, full_name, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (existingProf && existingProf.role) {
      return NextResponse.json({ success: true, profile: existingProf });
    }

    // 2. Check fallback table ex_profiles
    const { data: fallbackProf } = await authClient
      .from('ex_profiles')
      .select('id, role, full_name, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (fallbackProf && fallbackProf.role) {
      return NextResponse.json({ success: true, profile: fallbackProf });
    }

    // 3. Auto-provision profile: assign 'developer' role if admin email or non-cashier email
    const isDev = isAdminEmail(userEmail);
    const assignedRole = isDev ? 'developer' : 'cashier';
    const fallbackName = userEmail ? userEmail.split('@')[0] : (isDev ? 'Developer' : 'Cashier');

    const { data: newProfile, error: upsertErr } = await authClient
      .from('profiles')
      .upsert({
        id: userId,
        role: assignedRole,
        full_name: fallbackName,
      })
      .select()
      .single();

    if (upsertErr) {
      console.warn('init-profile upsert warning:', upsertErr.message);
      // Construct fallback profile object if DB write had soft error
      const mockProf = {
        id: userId,
        role: assignedRole,
        full_name: fallbackName,
      };
      return NextResponse.json({ success: true, profile: mockProf, autoAssigned: true });
    }

    return NextResponse.json({ success: true, profile: newProfile, autoAssigned: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Profile initialization failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
