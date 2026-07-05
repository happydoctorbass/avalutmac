import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'add') {
      const { data, error } = await supabase
        .from('roulette_bets')
        .insert([{
          player_id: payload.playerId,
          number: payload.number,
          color: payload.color
        }])
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('roulette_bets')
        .delete()
        .eq('number', payload.number);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('ROULETTE_BET_ERROR', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
