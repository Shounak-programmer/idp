import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when route changes
const MapUpdater = ({ center, bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        } else if (center) {
            map.setView(center, 13);
        }
    }, [center, bounds, map]);
    return null;
};

const RouteMap = ({ origin, destination, routeData, signals, isCleared }) => {
    const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]);
    const [mapBounds, setMapBounds] = useState(null);

    useEffect(() => {
        if (routeData && routeData.geometry) {
            // routeData.geometry is [lng, lat], Leaflet needs [lat, lng]
            const path = routeData.geometry.map(([lng, lat]) => [lat, lng]);
            const bounds = L.latLngBounds(path);
            setMapBounds(bounds);
        } else if (origin) {
            setMapCenter([origin.lat, origin.lng]);
        }
    }, [routeData, origin]);

    const routePath = routeData?.geometry?.map(([lng, lat]) => [lat, lng]) || [];

    return (
        <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={mapCenter} bounds={mapBounds} />

            {/* Origin Marker */}
            {origin && <Marker position={[origin.lat, origin.lng]} />}

            {/* Destination Marker */}
            {destination && <Marker position={[destination.lat, destination.lng]} />}

            {/* Route Polyline */}
            {routePath.length > 0 && (
                <Polyline
                    key={`${isCleared ? 'cleared' : 'normal'}-${routePath.length}`}
                    positions={routePath}
                    color={isCleared ? "#3B82F6" : "#EF4444"} // Blue if cleared, Red otherwise
                    weight={isCleared ? 8 : 5}
                    opacity={0.8}
                />
            )}

            {/* Signals */}
            {signals && signals.map(sig => (
                <CircleMarker
                    key={sig.id}
                    center={[sig.lat, sig.lng]}
                    radius={8}
                    pathOptions={{
                        color: 'white',
                        fillColor: isCleared ? '#10B981' : '#FBBF24', // Green if cleared, Yellow otherwise
                        fillOpacity: 1,
                        weight: 2
                    }}
                />
            ))}
        </MapContainer>
    );
};

export default RouteMap;
