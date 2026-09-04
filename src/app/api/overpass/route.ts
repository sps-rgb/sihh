import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lat = Number(body.lat);
    const lon = Number(body.lon);
    const around = Number(body.around) || 5000;

    if (!lat || !lon) return NextResponse.json({ error: 'Missing lat/lon' }, { status: 400 });

    const amenitiesToQuery = [
      'amenity=hospital',
      'amenity=police',
      'amenity=fire_station',
      'amenity=bank',
      'office=government',
      'amenity=townhall'
    ];

    const clauses = amenitiesToQuery
      .map((tag) => `node(around:${around},${lat},${lon})[${tag}];way(around:${around},${lat},${lon})[${tag}];relation(around:${around},${lat},${lon})[${tag}];`)
      .join('');

    const overpassQuery = `[out:json][timeout:25];(${clauses});out center;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'User-Agent': 'Udhyog-Setu/1.0 (contact@example.com)' },
      body: overpassQuery,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Overpass failed' }, { status: 500 });
  }
}
