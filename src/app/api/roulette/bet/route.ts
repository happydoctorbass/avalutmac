import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
