import { NextResponse } from 'next/server';
import { Match, SportType } from '@/types/match';
import fs from 'fs/promises';
import path from 'path';

function convertToBishkek(dateStr: string, timeStr: string) {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*UTC([+-]?\d+)/);
  if (!match) {
    return { date_bishkek: dateStr, time_bishkek: timeStr };
  }

  const [, hours, minutes, offsetStr] = match;
  const offset = parseInt(offsetStr, 10);
  
  const [year, month, day] = dateStr.split('-').map(Number);
  
  const dateObj = new Date(Date.UTC(year, month - 1, day, parseInt(hours, 10), parseInt(minutes, 10), 0));
  
  dateObj.setUTCHours(dateObj.getUTCHours() - offset);
  dateObj.setUTCHours(dateObj.getUTCHours() + 6);
  
  const bishkekYear = dateObj.getUTCFullYear();
  const bishkekMonth = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const bishkekDay = String(dateObj.getUTCDate()).padStart(2, '0');
  
  const bishkekHours = String(dateObj.getUTCHours()).padStart(2, '0');
  const bishkekMins = String(dateObj.getUTCMinutes()).padStart(2, '0');
  
  return {
    date_bishkek: `${bishkekYear}-${bishkekMonth}-${bishkekDay}`,
    time_bishkek: `${bishkekHours}:${bishkekMins}`
  };
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'worldcup2026.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    if (!data || !data.matches) {
      return NextResponse.json({ matches: [] });
    }

    const matches: Match[] = data.matches.map((match: any, index: number) => {
      const bishkek = convertToBishkek(match.date, match.time);
      
      return {
        id: `wc2026-${match.date}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        sportType: 'football' as SportType,
        team1: match.team1,
        team2: match.team2,
        time: match.time, // preserve original time if needed elsewhere
        bishkek
      };
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Failed to read matches from local JSON:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
