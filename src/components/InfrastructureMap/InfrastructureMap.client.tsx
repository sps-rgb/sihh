'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './InfrastructureMap.module.css';
import 'leaflet/dist/leaflet.css';

// Custom cyber beacon SVG icon
const createCyberIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:28px;height:28px;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${color};
          opacity:0.2;
          animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;
        "></div>
        <div style="
          position:absolute;inset:4px;border-radius:50%;
          background:${color};
          border:2px solid rgba(255,255,255,0.6);
          box-shadow:0 0 10px ${color};
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

const centerIcon = createCyberIcon('#22d3ee');
const placeIcon = createCyberIcon('#34d399');

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { if (map && lat && lon) map.setView([lat, lon], map.getZoom()); }, [map, lat, lon]);
  return null;
}

export default function InfrastructureMapClient({
  city, state, lat, lon, radius = 5000,
}: {
  city?: string; state?: string; lat?: number; lon?: number; radius?: number;
}) {
  const [center, setCenter] = useState<{ lat: number; lon: number; display_name?: string } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const params = new URLSearchParams();
        if (lat && lon) { params.set('lat', String(lat)); params.set('lon', String(lon)); }
        else { if (city) params.set('city', city); if (state) params.set('state', state); }
        params.set('radius', String(radius));

        const res = await fetch(`/api/map/nearby?${params.toString()}`);
        let json: any = null;
        try {
          const text = await res.text();
          try { json = JSON.parse(text); } catch { json = { error: 'Invalid response', raw: text }; }
        } catch (err) { console.error('Failed to read map response', err); throw err; }

        if (!active) return;
        if (!res.ok) { setError(json?.error ?? `Map fetch failed: ${res.status}`); setCenter(json?.center ?? null); setPlaces(json?.places ?? []); return; }
        setCenter(json.center ?? null); setPlaces(json.places ?? []);
      } catch (err: any) { console.error(err); setError(err?.message ?? 'Unknown map error'); setPlaces([]); setCenter(null); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [city, state, lat, lon, radius]);

  if (loading) return (
    <div className="glass-panel rounded-2xl p-8 flex items-center justify-center gap-3 border border-white/8">
      <div className="w-6 h-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      <span className="text-sm text-neutral-400 font-mono">Scanning infrastructure radar...</span>
    </div>
  );

  if (error) return (
    <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm">
      ⚠ Map radar offline: {error}
    </div>
  );

  if (!center) return (
    <div className="glass-panel rounded-2xl p-5 border border-white/8 text-neutral-500 text-sm">
      No infrastructure data available for this location.
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Infrastructure Radar — {radius / 1000}km Scan
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Your Location</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Nearby ({places.length})</span>
        </div>
      </div>

      <div className={styles.mapRoot} aria-live="polite" role="region" aria-label="Map of searched location and nearby infrastructure">
        <MapContainer center={[center.lat, center.lon]} zoom={13} style={{ height: 420, width: '100%' }} zoomControl={false}>
          <Recenter lat={center.lat} lon={center.lon} />
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          <Marker position={[center.lat, center.lon]} icon={centerIcon}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, color: '#22d3ee', fontSize: 13 }}>📍 Your Location</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{center.display_name}</div>
              </div>
            </Popup>
          </Marker>
          {places.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lon]} icon={placeIcon}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: 13 }}>{p.name ?? p.category}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.category}</div>
                  {p.address && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{p.address}</div>}
                  {typeof p.distanceMeters === 'number' && (
                    <div style={{ fontSize: 11, color: '#06b6d4', marginTop: 4, fontWeight: 600 }}>
                      📏 {p.distanceMeters}m away
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
