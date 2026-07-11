import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ACTION_NUMBERS } from '@/types/roulette';

const MAX_BETS_PER_PLAYER = 4;

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'add') {
      const playerId = String(payload?.playerId ?? '').trim();
      const number = payload?.number;
      const color = payload?.color;

      if (!playerId || number === undefined || number === null || !color) {
        return NextResponse.json(
          { success: false, error: 'Missing playerId, number, or color' },
          { status: 400 }
        );
      }

      const { count, error: countError } = await supabaseAdmin
        .from('roulette_bets')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId);

      if (countError) throw countError;

      if ((count ?? 0) >= MAX_BETS_PER_PLAYER) {
        return NextResponse.json(
          {
            success: false,
            error: `Player ${playerId} already has the maximum of ${MAX_BETS_PER_PLAYER} bets`,
          },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from('roulette_bets')
        .insert([{
          player_id: playerId,
          number,
          player_color: color,
          is_promo: ACTION_NUMBERS.includes(Number(number)),
        }])
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('roulette_bets')
        .delete()
        .eq('number', payload.number);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('ROULETTE_BET_ERROR', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
