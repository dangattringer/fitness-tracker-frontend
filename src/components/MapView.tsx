import React, { useEffect, useRef } from 'react';
import './MapView.css';


interface MapViewProps {
  coordinates: [number, number][];
  mapId?: string; // Optional ID for the map container
}

const MapView: React.FC<MapViewProps> = ({ coordinates, mapId = "leaflet-map" }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof L === 'undefined' || typeof L.map === 'undefined' || !mapContainerRef.current) {
      return;
    }

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const currentMap = mapRef.current;

    if (currentMap && coordinates && coordinates.length > 0) {
      currentMap.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          currentMap.removeLayer(layer);
        }
      });

      const polylineInstance = L.polyline(coordinates, { color: 'blue' }).addTo(currentMap);

      try {
        const bounds = polylineInstance.getBounds();
        if (bounds && bounds.isValid()) {
          currentMap.fitBounds(bounds);
        } else {
          if (coordinates.length === 1) {
            currentMap.setView(coordinates[0] as L.LatLngExpression, 15);
          } else {
            currentMap.setView([51.505, -0.09], 13); // Default view
          }
        }
      } catch (e) {
        if (coordinates.length === 1) {
          currentMap.setView(coordinates[0] as L.LatLngExpression, 15);
        } else {
          console.error("Error fitting map bounds:", e);
          currentMap.setView([51.505, -0.09], 13);
        }
      }
    } else if (currentMap) {
      currentMap.setView([51.505, -0.09], 13);
    }

    return () => {
    };
  }, [coordinates]);

  return <div id={mapId} ref={mapContainerRef} className="activity-detail-map-container" style={{ height: '400px', width: '100%' }} />;
};

export default MapView;