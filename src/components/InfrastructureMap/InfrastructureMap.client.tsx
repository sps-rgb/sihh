'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './InfrastructureMap.module.css';
import 'leaflet/dist/leaflet.css';

// Fix icons path for bundlers
const customIcon = L.icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Recenter({ lat, lon }: { lat:number; lon:number }) {
  const map = useMap();
  useEffect(() => {
    if (map && lat && lon) map.setView([lat, lon], map.getZoom());
  }, [map, lat, lon]);
  return null;
}

export default function InfrastructureMapClient({ city, state, lat, lon, radius = 5000 }: {
  city?: string;
  state?: string;
  lat?: number;
  lon?: number;
  radius?: number;
}) {
  const [center, setCenter] = useState<{ lat: number; lon:number; display_name?: string } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (lat && lon) {
          params.set('lat', String(lat));
          params.set('lon', String(lon));
        } else {
          if (city) params.set('city', city);
          if (state) params.set('state', state);
        }
        params.set('radius', String(radius));

        // Robust fetch: read text, try parse JSON, handle non-OK or non-JSON responses
        const res = await fetch(`/api/map/nearby?${params.toString()}`);
        let json: any = null;
        try {
          const text = await res.text();
          try { json = JSON.parse(text); } catch { json = { error: 'Invalid response from map backend', raw: text }; }
        } catch (err) {
          console.error('Failed to read map response text', err);
          throw err;
        }

        if (!active) return;

        if (!res.ok) {
          console.warn('Map backend returned non-OK', res.status, json);
          setError(json?.error ?? `Map fetch failed: ${res.status}`);
          setCenter(json?.center ?? null);
          setPlaces(json?.places ?? []);
          return;
        }

        setCenter(json.center ?? null);
        setPlaces(json.places ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Unknown map error');
        setPlaces([]);
        setCenter(null);
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [city, state, lat, lon, radius]);

  if (loading) return <div className="p-4 bg-white rounded-2xl shadow-sm">Loading map…</div>;
  if (error) return <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">Map error: {error}</div>;
  if (!center) return <div className="p-4 bg-neutral-50 rounded-2xl">No map data available</div>;

  return (
    <div className={styles.mapRoot} aria-live="polite" role="region" aria-label="Map of searched location and nearby infrastructure">
      <MapContainer center={[center.lat, center.lon]} zoom={13} style={{ height: 420, width: '100%' }} zoomControl={false}>
        <Recenter lat={center.lat} lon={center.lon} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <Marker
  position={[center.lat, center.lon]}
  icon={customIcon}
>
          <Popup><strong>Searched location</strong><div>{center.display_name}</div></Popup>
        </Marker>
        {places.map(p => (
          <Marker
  key={p.id}
  position={[p.lat, p.lon]}
  icon={customIcon}
>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700 }}>{p.name ?? p.category}</div>
                <div style={{ fontSize: 12, color: '#333' }}>{p.category}</div>
                {p.address ? <div style={{ fontSize: 12 }}>{p.address}</div> : null}
                {typeof p.distanceMeters === 'number' ? <div style={{ fontSize: 12 }}>{p.distanceMeters} m</div> : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
