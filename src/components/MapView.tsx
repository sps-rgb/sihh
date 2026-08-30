"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { UserProfile } from '@/types';

type Amenity = {
  id: number | string;
  lat: number;
  lon: number;
  name?: string;
  category: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Government office': '#6b7280',
  'District administration': '#7c3aed',
  Hospital: '#dc2626',
  'Police station': '#2563eb',
  'Fire station': '#ea580c',
  Bank: '#059669',
};

function getCategory(tags: Record<string, string> = {}) {
  if (tags.office === 'government') return 'Government office';
  if (tags.amenity === 'townhall') return 'District administration';
  if (tags.amenity === 'hospital') return 'Hospital';
  if (tags.amenity === 'police') return 'Police station';
  if (tags.amenity === 'fire_station') return 'Fire station';
  if (tags.amenity === 'bank') return 'Bank';
  return 'Nearby service';
}

export default function MapView({ userProfile }: { userProfile: UserProfile | null }) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile || !userProfile.state) {
      setLoading(false);
      return;
    }

    const city = (userProfile as any).city;
    const query = city ? `${city}, ${userProfile.state}` : userProfile.state;

    const fetchNearby = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the central API route (GET). This endpoint supports lat/lon OR city/state.
        const params = new URLSearchParams();
        if ((userProfile as any).lat && (userProfile as any).lon) {
          params.set('lat', String((userProfile as any).lat));
          params.set('lon', String((userProfile as any).lon));
        } else {
          if (city) params.set('city', city);
          params.set('state', userProfile.state);
        }
        params.set('radius', String(5000));

        const res = await fetch(`/api/map/nearby?${params.toString()}`);
        let json: any = null;
        const text = await res.text();
        try { json = JSON.parse(text); } catch { json = { error: 'Invalid response', raw: text }; }

        if (!res.ok) {
          setError(json?.error ?? `Map fetch failed: ${res.status}`);
          setCenter(json?.center ? [json.center.lat, json.center.lon] : null);
          setAmenities([]);
          return;
        }

        const centerObj = json.center;
        if (centerObj?.lat && centerObj?.lon) {
          setCenter([Number(centerObj.lat), Number(centerObj.lon)]);
        } else {
          setCenter(null);
        }

        const places = json.places ?? [];
        const parsed: Amenity[] = (places as any[]).map((p: any) => ({
          id: p.id,
          lat: p.lat,
          lon: p.lon,
          name: p.name ?? null,
          category: p.category ?? getCategory(p.tags ?? {}),
        }));

        setAmenities(parsed);
      } catch (err: any) {
        console.error('MapView error', err);
        setError(err?.message ?? 'Unable to find nearby services.');
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [userProfile]);

  if (loading) {
    return <div className="p-4 bg-white rounded-2xl shadow-sm">Loading map…</div>;
  }
  if (error) {
    return <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">Map error: {error}</div>;
  }
  if (!center) {
    return <div className="p-4 bg-neutral-50 rounded-2xl">No map data available</div>;
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-sm" aria-live="polite" role="region" aria-label="Nearby public services map">
      <MapContainer center={center} zoom={12} style={{ height: 420, width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={center} radius={6} pathOptions={{ color: '#111' }}>
          <Popup>Searched location</Popup>
        </CircleMarker>
        {amenities.map((a) => (
          <CircleMarker key={a.id} center={[a.lat, a.lon]} radius={5} pathOptions={{ color: CATEGORY_COLORS[a.category] ?? '#4b5563' }}>
            <Popup>
              <div style={{ fontWeight: 700 }}>{a.name ?? a.category}</div>
              <div style={{ fontSize: 12, color: '#333' }}>{a.category}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
