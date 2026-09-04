import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Udhyog-Setu/1.0 (contact@example.com)'
        }
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Geocode failed' }, { status: 500 });
  }
}
