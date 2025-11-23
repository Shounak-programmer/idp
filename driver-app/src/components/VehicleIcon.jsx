import React from 'react';

const VehicleIcon = ({ type, state, heading }) => {
    // State: 'normal', 'horn', 'emergency'

    let color = 'bg-green-500';
    let ring = '';

    if (state === 'horn') {
        color = 'bg-red-500 animate-pulse';
    } else if (state === 'emergency') {
        color = 'bg-red-600';
        ring = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75';
    }

    return (
        <div
            className="relative flex items-center justify-center w-6 h-6"
            style={{ transform: `rotate(${heading}deg)` }}
        >
            {ring && <span className={ring}></span>}
            <div className={`w-4 h-4 rounded-full ${color} shadow-sm z-10`} />
            {/* Direction indicator */}
            <div className="absolute -top-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white opacity-50" />
        </div>
    );
};

export default VehicleIcon;
