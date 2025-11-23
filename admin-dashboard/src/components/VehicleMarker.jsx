import React from 'react';

const VehicleMarker = ({ type, heading }) => {
    const color = type === 'ambulance' ? '#EF4444' : '#9CA3AF'; // Red or Gray
    const scale = type === 'ambulance' ? 1.5 : 1;
    const zIndex = type === 'ambulance' ? 50 : 10;

    // Simple SVG arrow
    const svgPath = "M12 2L2 22L12 18L22 22L12 2Z";

    return (
        <div style={{ transform: `rotate(${heading}deg) scale(${scale})`, zIndex }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
                <path d={svgPath} />
            </svg>
        </div>
    );
};

export default VehicleMarker;
