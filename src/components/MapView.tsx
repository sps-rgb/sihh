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
  type: string;
};

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

        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          { headers: { 'User-Agent': 'Udhyog-Setu/1.0 (example@example.com)' } }
        );
        const nomJson = await nomRes.json();
        if (!nomJson || nomJson.length === 0) {
          setError('Location not found');
          setLoading(false);
          return;
        }
        const { lat, lon } = nomJson[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setCenter([latNum, lonNum]);

        // Build Overpass query for nearby amenities (5km radius)
        const amenitiesToQuery = [
          'amenity=hospital',
          'amenity=police',
          'amenity=fire_station',
          'amenity=school',
          'amenity=bank',
          'office=government',
          'amenity=townhall'
        ];

        const around = 5000; // meters
        const clauses = amenitiesToQuery
          .map((tag) => `node(around:${around},${latNum},${lonNum})[${tag}];way(around:${around},${latNum},${lonNum})[${tag}];relation(around:${around},${latNum},${lonNum})[${tag}];`)
          .join('');

        const overpassQuery = `[out:json][timeout:25];(${clauses});out center;`;

        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery,
          headers: { 'Content-Type': 'text/plain' },
        });

        const overJson = await overpassRes.json();
        const elements = overJson.elements || [];

        const parsed: Amenity[] = elements.map((el: any) => {
          const { id, lat: nLat, lon: nLon, tags, type, center } = el;
          const name = tags?.name || tags?.official_name || tags?.operator;
          const coords = nLat && nLon ? { lat: nLat, lon: nLon } : center ? { lat: center.lat, lon: center.lon } : null;
          return coords
            ? { id, lat: coords.lat, lon: coords.lon, name, type: Object.values(tags || {}).join(',') || type }
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
      <h3 className="text-lg font-bold mb-2">Nearby Infrastructure</h3>
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
        <div style={{ height: 420 }}>
          <MapContainer {...({ center, zoom: 12, scrollWheelZoom: false, style: { height: '100%', width: '100%' } } as any)}>
            <TileLayer {...({ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' } as any)} />

            {/* User center marker */}
            <CircleMarker {...({ center, radius: 8, pathOptions: { color: '#111827', fillColor: '#111827' } } as any)}>
              <Popup>You (approx.): {((userProfile as any).city ? `${(userProfile as any).city}, ` : '') + userProfile.state}</Popup>
            </CircleMarker>

            {amenities.map((a) => (
              <CircleMarker {...({ key: a.id, center: [a.lat, a.lon], radius: 6, pathOptions: { color: a.type.includes('hospital') ? '#dc2626' : a.type.includes('police') ? '#2563eb' : a.type.includes('school') ? '#f59e0b' : a.type.includes('bank') ? '#10b981' : '#6b7280' } } as any)}>
                <Popup>
                  <div className="text-sm font-semibold">{a.name || 'Unnamed'}</div>
                  <div className="text-xs text-neutral-600">{a.type}</div>
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
