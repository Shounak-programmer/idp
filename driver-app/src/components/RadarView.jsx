import React, { useEffect, useState, useRef } from 'react';
import VehicleIcon from './VehicleIcon';
import { getRelativeBearing, getDistance } from '../../../shared/lib/mathUtils';
import { audioController } from '../services/audioService';

const RadarView = ({ vehicles, myVehicle }) => {
    const [radarVehicles, setRadarVehicles] = useState([]);

    useEffect(() => {
        if (!myVehicle) return;

        // Filter and transform vehicles relative to self
        const nearby = vehicles.map(v => {
            const dist = getDistance(myVehicle.lat, myVehicle.lng, v.lat, v.lng);
            // Calculate absolute bearing to target
            const absBearing = getBearing(myVehicle.lat, myVehicle.lng, v.lat, v.lng);
            const relBearing = getRelativeBearing(myVehicle.heading, absBearing);

            return { ...v, dist, relBearing };
        }).filter(v => v.dist < 500); // Show within 500m

        setRadarVehicles(nearby);

        // Trigger audio for new horn events
        nearby.forEach(v => {
            if (v.state === 'horn' || v.state === 'emergency') {
                if (Date.now() - (v.lastHornPlayed || 0) > 5000) {
                    audioController.playHorn(v.relBearing, v.dist);
                    v.lastHornPlayed = Date.now();
                }
            }
        });

    }, [vehicles, myVehicle]);

    // Helper to map polar (dist, angle) to canvas (x, y)
    // Radar is top-down. Up is 0 degrees relative.
    const toCanvas = (dist, relBearing) => {
        const maxDist = 500; // meters radius
        const size = 300; // px
        const center = size / 2;
        const scale = center / maxDist;

        // relBearing: 0 is up, 90 is right.
        // Math: 0 is right, -90 is up.
        // Angle in rads for math: (relBearing - 90) * PI / 180
        const angleRad = (relBearing - 90) * Math.PI / 180;

        const x = center + (dist * scale) * Math.cos(angleRad);
        const y = center + (dist * scale) * Math.sin(angleRad);

        return { x, y };
    };

    // Import getBearing locally if not imported above (it is)
    function getBearing(lat1, lon1, lat2, lon2) {
        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        const θ = Math.atan2(y, x);
        return (θ * 180 / Math.PI + 360) % 360;
    }

    return (
        <div className="relative w-[300px] h-[300px] bg-gray-900 rounded-full border-4 border-gray-700 shadow-2xl overflow-hidden">
            {/* Radar Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-0 w-full h-px bg-green-500"></div>
                <div className="absolute left-1/2 top-0 w-px h-full bg-green-500"></div>
                <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500"></div>
                <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500"></div>
            </div>

            {/* My Vehicle (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-blue-500"></div>
            </div>

            {/* Other Vehicles */}
            {radarVehicles.map(v => {
                const pos = toCanvas(v.dist, v.relBearing);
                return (
                    <div
                        key={v.id}
                        className="absolute transition-all duration-300 ease-linear"
                        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
                    >
                        <VehicleIcon type={v.type} state={v.state} heading={v.heading - myVehicle.heading} />
                    </div>
                );
            })}
        </div>
    );
};

export default RadarView;
