import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

interface AuthCheckResult {
  authorized: boolean;
  status: number;
  error?: string;
  userId?: string;
}

/**
 * Verifies that the incoming request contains a valid Supabase bearer token
 * and that the corresponding user has the 'developer' role in public.profiles.
 */
async function verifyDeveloper(req: Request): Promise<AuthCheckResult> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Требуется Bearer токен авторизации (Authorization header missing or empty)',
    };
  }

  // 1. Verify user identity via token
  const authClient = supabaseAdmin ?? supabase;
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) {
    return {
      authorized: false,
      status: 401,
      error: `Unauthorized: Недействительный или истекший токен доступа (${authError?.message || 'Пользователь не найден'})`,
    };
  }

  // 2. Check user's role in profiles table
  const { data: profile, error: profileError } = await authClient
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'developer') {
    return {
      authorized: false,
      status: 403,
      error: 'Forbidden: Операция доступна только пользователям с ролью разработчика (developer)',
    };
  }

  return { authorized: true, status: 200, userId: user.id };
}

export async function GET(req: Request) {
  const auth = await verifyDeveloper(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role, full_name, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await verifyDeveloper(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { email, password, fullName, role = 'cashier' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || email.split('@')[0], role },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        role: role as 'cashier' | 'developer',
        full_name: fullName || email.split('@')[0],
      });

    if (profileError) console.warn('Profile upsert warning:', profileError.message);

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'User creation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await verifyDeveloper(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update password';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await verifyDeveloper(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(req.url);
    const userIdQuery = url.searchParams.get('userId');
    let userId = userIdQuery;

    if (!userId) {
      try {
        const body = await req.json();
        userId = body.userId;
      } catch {
        // no body provided
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete or deactivate from profiles
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.warn('Profile delete warning:', profileDeleteError.message);
    }

    // Delete from auth.users
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      console.warn('Auth user delete warning:', authDeleteError.message);
    }

    return NextResponse.json({ success: true, message: 'User deactivated / deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete user';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
