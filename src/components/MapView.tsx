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

    const geocode = async () => {
      try {
        setLoading(true);
        setError(null);

        const nomRes = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const nomJson = await nomRes.json();
        if (!nomRes.ok) throw new Error(nomJson.error || 'Unable to find the searched location.');
        if (!Array.isArray(nomJson) || nomJson.length === 0) throw new Error('Location not found.');
        const { lat, lon } = nomJson[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) throw new Error('The returned location has invalid coordinates.');
        setCenter([latNum, lonNum]);

        const around = 5000; // meters
        const overRes = await fetch('/api/overpass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latNum, lon: lonNum, around }),
        });

        const overJson = await overRes.json();
        if (!overRes.ok) throw new Error(overJson.error || 'Unable to load nearby services.');
        const elements = overJson.elements || [];

        const parsed: Amenity[] = elements.map((el: any) => {
          const { id, lat: nLat, lon: nLon, tags, center } = el;
          const name = tags?.name || tags?.official_name || tags?.operator;
          const coords = nLat && nLon ? { lat: nLat, lon: nLon } : center ? { lat: center.lat, lon: center.lon } : null;
          return coords
            ? { id, lat: coords.lat, lon: coords.lon, name, category: getCategory(tags) }
            : null;
        }).filter(Boolean) as Amenity[];

        setAmenities(parsed);
      } catch (err: any) {
        setError(err.message || 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    void geocode();
  }, [userProfile]);

  if (!userProfile || !userProfile.state) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm text-center">
        <h3 className="text-lg font-semibold mb-2">Map unavailable</h3>
        <p className="text-sm text-neutral-500">Complete your profile (State required) to view a map centered on your location.</p>
        <div className="mt-4">
          <a href="/scheme-finder" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm">Complete Profile</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-4 shadow-sm">
      <h2 id="nearby-infrastructure-heading" className="text-lg font-bold mb-2">Nearby Infrastructure</h2>
      <p className="text-xs text-neutral-500 mb-3">Map centered on your provided location (state or state+city). Showing nearby key services.</p>

      {loading && (
        <div className="py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-black"></div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && center && (
        <div className="h-[420px] overflow-hidden rounded-2xl border border-neutral-200">
          <MapContainer {...({ center, zoom: 12, zoomControl: true, scrollWheelZoom: false, style: { height: '100%', width: '100%' } } as any)}>
            <TileLayer {...({ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' } as any)} />

            {/* User center marker */}
            <CircleMarker {...({ center, radius: 8, pathOptions: { color: '#111827', fillColor: '#111827' } } as any)}>
              <Popup>You (approx.): {((userProfile as any).city ? `${(userProfile as any).city}, ` : '') + userProfile.state}</Popup>
            </CircleMarker>

            {amenities.map((a) => (
              <CircleMarker {...({ key: a.id, center: [a.lat, a.lon], radius: 6, pathOptions: { color: CATEGORY_COLORS[a.category] || '#6b7280' } } as any)}>
                <Popup>
                  <div className="text-sm font-semibold">{a.name || 'Unnamed'}</div>
                  <div className="text-xs text-neutral-600">{a.category}</div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {!loading && !center && !error && (
        <div className="text-sm text-neutral-500 py-6">Location not found for your input.</div>
      )}
    </div>
  );
}
