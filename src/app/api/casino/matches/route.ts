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

    // Реальные команды не содержат цифр и слэшей (в отличие от заглушек "1A", "W99", "3E/H/I/J/K")
    const isRealTeam = (name: string) => typeof name === 'string' && !/[\d/]/.test(name);

    // Окно: от сегодня до +10 дней вперёд (для предстоящих матчей)
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 10);

    const filtered = data.matches.filter((match: any) => {
      if (!isRealTeam(match.team1) || !isRealTeam(match.team2)) return false;

      const hasScore = Boolean(match.score && match.score.ft);

      const [year, month, day] = String(match.date).split('-').map(Number);
      const matchDate = new Date(year, month - 1, day);
      const inWindow = matchDate >= windowStart && matchDate <= windowEnd;

      // Только предстоящие матчи в окне 10 дней (прошедшие не отдаём)
      return !hasScore && inWindow;
    });

    const matches: Match[] = filtered.map((match: any) => {
      const bishkek = convertToBishkek(match.date, match.time);
      
      let scoreStr;
      let winnerStr;
      let guestBetMessage;
      const finished = Boolean(match.score && match.score.ft);

      if (finished) {
        const [score1, score2] = match.score.ft;
        scoreStr = `${score1}:${score2}`;
        if (score1 > score2) {
          winnerStr = match.team1;
        } else if (score2 > score1) {
          winnerStr = match.team2;
        } else {
          winnerStr = 'Ничья';
        }
        
        // Generate a random guest ID for completed matches
        const randomGuestId = Math.floor(1000 + Math.random() * 9000);
        guestBetMessage = `Гость с ID #${randomGuestId} победил, сделав ставку`;
      }

      // Стабильный id, чтобы можно было определять, какой матч уже на табло
      const slug = (s: string) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = `wc2026-${match.date}-${slug(match.team1)}-vs-${slug(match.team2)}`;
      
      return {
        id,
        sportType: 'football' as SportType,
        team1: match.team1,
        team2: match.team2,
        time: match.time, // preserve original time if needed elsewhere
        score: scoreStr,
        winner: winnerStr,
        guestBetMessage,
        finished,
        bishkek
      };
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Failed to read matches from local JSON:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
