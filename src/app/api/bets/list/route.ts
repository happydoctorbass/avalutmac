import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const sessionId = new URL(req.url).searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ bets: [] });
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('session_id', sessionId)
      .order('amount', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ bets: data ?? [] });
  } catch (e) {
    console.error('BETS_LIST_ERROR', e);
    return NextResponse.json({ bets: [] }, { status: 500 });
  }
}
