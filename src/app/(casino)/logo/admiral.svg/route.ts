import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET() {
  try {
    const p = join(process.cwd(), 'src', 'app', '(casino)', 'logo', 'casino admiral.svg');
    const svg = await readFile(p, 'utf8');
    return new NextResponse(svg, {
      headers: {
        'content-type': 'image/svg+xml; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('<svg xmlns="http://www.w3.org/2000/svg" />', {
      headers: { 'content-type': 'image/svg+xml; charset=utf-8' },
    });
  }
}

