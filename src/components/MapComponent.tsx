'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/* eslint-disable @typescript-eslint/naming-convention */
const customIcon: L.Icon<L.IconOptions> = new L.Icon<L.IconOptions>({
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

// Define API response type
interface GeocodeResult {
  lat: string;
  lon: string;
}

const MapComponent: React.FC<MapProps> = ({ address, postcode }) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCoordinates = async (): Promise<void> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postcode)}`,
        );

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: GeocodeResult[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0]?.lat ?? '0'); // Ensure valid number
          const lon = parseFloat(data[0]?.lon ?? '0');
          setCoordinates([lat, lon]);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    void fetchCoordinates();
  }, [postcode]);

  if (!coordinates) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: '400px', width: '100%', zIndex: -1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={coordinates} icon={customIcon}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
