import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    // Unrestricted delete is blocked by PostgREST — filter on always-true number range
    const { error } = await supabaseAdmin
      .from('roulette_bets')
      .delete()
      .gte('number', 0);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('ROULETTE_CLEAR_ERROR', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
