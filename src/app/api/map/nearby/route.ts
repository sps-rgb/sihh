import { NextResponse } from 'next/server';

function haversineDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (v:number) => (v * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    const city = params.get('city');
    const state = params.get('state');
    const latParam = params.get('lat');
    const lonParam = params.get('lon');
    const radius = Number(params.get('radius') ?? '5000');

    let centerLat: number | null = null;
    let centerLon: number | null = null;
    let display_name: string | undefined;

    if (latParam && lonParam) {
      centerLat = Number(latParam);
      centerLon = Number(lonParam);
    } else if (city || state) {
      const qParts: string[] = [];
      if (city) qParts.push(city);
      if (state) qParts.push(state);
      const q = encodeURIComponent(qParts.join(', '));
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`;
      const r = await fetch(nomUrl, {
        headers: { 'User-Agent': 'sihh-map/1.0 (+https://your-site.example)' }
      });
      if (!r.ok) return NextResponse.json({ error: 'Geocoding failed' }, { status: 502 });
      const data = await r.json();
      if (!data || data.length === 0) return NextResponse.json({ error: 'No geocoding results' }, { status: 404 });
      centerLat = Number(data[0].lat);
      centerLon = Number(data[0].lon);
      display_name = data[0].display_name;
    } else {
      return NextResponse.json({ error: 'Provide lat/lon or city/state' }, { status: 400 });
    }

    const tags = [
      'amenity=hospital',
      'amenity=police',
      'amenity=fire_station',
      'amenity=bank',
      'amenity=school',
      'amenity=townhall',
      'office=government',
      'public_building=yes'
    ];

    const around = radius;
    const clauses = tags.map(t => `node(around:${around},${centerLat},${centerLon})[${t}];way(around:${around},${centerLat},${centerLon})[${t}];relation(around:${around},${centerLat},${centerLon})[${t}];`).join('\n');
    const query = `[out:json][timeout:25];\n(\n${clauses}\n);\nout center tags;`;

    const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    if (!overpassRes.ok) return NextResponse.json({ error: 'Overpass query failed' }, { status: 502 });
    const overpassJson = await overpassRes.json();
    const elements = overpassJson.elements || [];

    const places = elements.map((el: any) => {
      const elLat = el.lat ?? el.center?.lat ?? null;
      const elLon = el.lon ?? el.center?.lon ?? null;
      const name = el.tags?.name ?? el.tags?.official_name ?? null;
      const category = el.tags?.amenity ?? (el.tags?.office === 'government' ? 'government' : 'other');
      const addressParts = [el.tags?.addr_street, el.tags?.addr_housenumber, el.tags?.addr_city, el.tags?.addr_state].filter(Boolean);
      const address = addressParts.join(', ');
      const distanceMeters = (elLat && elLon) ? Math.round(haversineDistance(centerLat!, centerLon!, elLat, elLon)) : undefined;
      return { id: `${el.type}/${el.id}`, lat: elLat, lon: elLon, name, category, address, distanceMeters, tags: el.tags };
    }).filter((p: any) => p.lat && p.lon);

    const result = { center: { lat: centerLat, lon: centerLon, display_name }, places };
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
