'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon: L.Icon<L.IconOptions> = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  address: string;
  postcode: string;
}

interface GeocodeResult {
  lat: string;
  lon: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const MapComponent = ({ address, postcode }: MapProps): JSX.Element => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postcode)}`,
        );

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = (await response.json()) as GeocodeResult[];

        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates:', err);
      }
    })();
  }, [postcode]);

  if (!coordinates) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">Loading map...</div>
    );
  }

  return (
    <div className="rounded-b-2xl overflow-hidden">
      <MapContainer
        center={coordinates}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={customIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
