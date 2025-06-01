import React, { useEffect, useRef } from 'react';
import type { Activity } from '../types/types';
import { decodePolyline, formatDate } from '../utils/formatters';
import './MapsPage.css';


interface MapsPageProps {
  activities: Activity[];
}

const MapsPage: React.FC<MapsPageProps> = ({ activities }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const polylinesGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (typeof L === 'undefined' || !mapContainerRef.current) {
      return;
    }

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const currentMap = mapRef.current;
    if (!currentMap) return;

    if (polylinesGroupRef.current) {
      currentMap.removeLayer(polylinesGroupRef.current);
    }
    polylinesGroupRef.current = L.featureGroup();

    const activitiesWithPolylines = activities.filter(act => act.map?.summary_polyline);

    if (activitiesWithPolylines.length === 0) {
      currentMap.setView([51.505, -0.09], 2);
      return;
    }

    activitiesWithPolylines.forEach(activity => {
      const coords = decodePolyline(activity.map && activity.map.summary_polyline);
      if (coords.length > 0) {
        const pLineInstance = L.polyline(coords, { color: 'red' });
        const popupContent = `<b>${activity.name}</b><br>${formatDate(activity.start_date_local || activity.date, { month: 'short', day: 'numeric', year: 'numeric' })}`;
        pLineInstance.bindPopup(popupContent);
        if (polylinesGroupRef.current) {
          polylinesGroupRef.current.addLayer(pLineInstance);
        }
      }
    });

    if (polylinesGroupRef.current && polylinesGroupRef.current.getLayers().length > 0) {
      polylinesGroupRef.current.addTo(currentMap);
      try {
        const bounds = polylinesGroupRef.current.getBounds();
        if (bounds && bounds.isValid()) {
          currentMap.fitBounds(bounds.pad(0.1));
        } else if (activitiesWithPolylines.length > 0 && activitiesWithPolylines[0].map?.summary_polyline && decodePolyline(activitiesWithPolylines[0].map.summary_polyline).length > 0) {
          const firstCoords = decodePolyline(activitiesWithPolylines[0].map!.summary_polyline!);
          if (firstCoords.length > 0) currentMap.setView(firstCoords[0] as L.LatLngExpression, 13);
          else currentMap.setView([51.505, -0.09], 2);
        } else {
          currentMap.setView([51.505, -0.09], 2);
        }
      } catch (e) {
        console.error("Error fitting map bounds:", e);
        currentMap.setView([51.505, -0.09], 2);
      }
    } else {
      currentMap.setView([51.505, -0.09], 2);
    }

  }, [activities]);

  const activitiesWithMapData = activities.some(act => act.map?.summary_polyline && decodePolyline(act.map.summary_polyline).length > 0);


  return (
    <div className="maps-view" role="application" aria-label="Activities Map View">
      <h2 id="maps-view-heading" className="maps-view-title section-title">Activities Map</h2>
      <div
        id="maps-view-leaflet-map"
        ref={mapContainerRef}
        aria-labelledby="maps-view-heading"
      >
        {!activitiesWithMapData && (
          <div className="maps-view-no-data-message" role="status">
            <p>No activities with map data to display.</p>
            <p>Ensure your activities have GPS data (summary_polyline) to see them on the map.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsPage;