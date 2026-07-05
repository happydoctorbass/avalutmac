import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // Delete all records
    const { error } = await supabase
      .from('roulette_bets')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all if no clear TRUNCATE

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('ROULETTE_CLEAR_ERROR', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
