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

  const authClient = supabaseAdmin ?? supabase;
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) {
    return {
      authorized: false,
      status: 401,
      error: `Unauthorized: Недействительный или истекший токен доступа (${authError?.message || 'Пользователь не найден'})`,
    };
  }

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
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('exchange_history')
      .select('*, currency:currencies(*)')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch logs';
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
    const idParam = url.searchParams.get('id');
    const allParam = url.searchParams.get('all');

    let isAll = allParam === 'true' || allParam === '1';
    let logId = idParam;

    // Check request body as alternative
    try {
      const body = await req.json();
      if (body?.all === true) isAll = true;
      if (body?.id) logId = body.id;
    } catch {
      // Body is optional when query params are provided
    }

    const client = supabaseAdmin ?? supabase;

    if (isAll) {
      // Clear entire exchange history
      const { error } = await client
        .from('exchange_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: 'Вся история аудита успешно очищена',
      });
    }

    if (!logId) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать id записи или параметр all=true' },
        { status: 400 }
      );
    }

    // Delete single log entry
    const { error } = await client
      .from('exchange_history')
      .delete()
      .eq('id', logId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Запись аудита успешно удалена',
      id: logId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка при удалении логов';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
