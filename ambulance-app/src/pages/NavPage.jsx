import React, { useState } from 'react';
import RouteMap from '../components/RouteMap';
import StepList from '../components/StepList';
import SignalList from '../components/SignalList';
import { calculateRoute } from '../services/routeService';
import { broadcastClearance } from '../services/clearanceService';

const NavPage = () => {
    const [origin] = useState({ lat: 23.0225, lng: 72.5714 }); // Fixed Start (e.g. Hospital A)
    const [destination, setDestination] = useState({ lat: 23.0325, lng: 72.5814 }); // Default End
    const [destName, setDestName] = useState("City Hospital");
    const [routeData, setRouteData] = useState(null);
    const [signals, setSignals] = useState([]);
    const [isClearing, setIsClearing] = useState(false);
    const [isCleared, setIsCleared] = useState(false);

    const destinations = [
        { name: "City Hospital", lat: 23.0325, lng: 72.5814 },
        { name: "Central Plaza", lat: 23.0250, lng: 72.5600 },
        { name: "North Station", lat: 23.0400, lng: 72.5700 },
        { name: "East Market", lat: 23.0200, lng: 72.5900 }
    ];

    const handleDestChange = (e) => {
        const dest = destinations.find(d => d.name === e.target.value);
        if (dest) {
            setDestName(dest.name);
            setDestination({ lat: dest.lat, lng: dest.lng });
            // Reset route when destination changes
            setRouteData(null);
            setSignals([]);
            setIsCleared(false);
        }
    };

    const handleStartRoute = async () => {
        setIsCleared(false);
        setRouteData(null);
        setSignals([]);

        try {
            // Direct client-side OSRM call for better reliability in demo
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.code !== "Ok") throw new Error("OSRM Failed");

            const route = data.routes[0];

            // Mock signals along the path (simple interpolation)
            const path = route.geometry.coordinates;
            const mockSignals = [];
            if (path.length > 10) {
                // Add a signal at 1/3 and 2/3 of the path
                const idx1 = Math.floor(path.length / 3);
                const idx2 = Math.floor(2 * path.length / 3);
                mockSignals.push({
                    id: "SIG_01",
                    lat: path[idx1][1],
                    lng: path[idx1][0],
                    name: "Crossroad A",
                    status: "red"
                });
                mockSignals.push({
                    id: "SIG_02",
                    lat: path[idx2][1],
                    lng: path[idx2][0],
                    name: "Crossroad B",
                    status: "red"
                });
            }

            setRouteData({
                geometry: route.geometry.coordinates,
                distance: route.distance,
                duration: route.duration
            });
            setSignals(mockSignals);

        } catch (error) {
            console.error("Routing failed", error);
            alert("Could not fetch road route. Check internet connection.");

            // Fallback to straight line if API fails
            setRouteData({
                geometry: [[origin.lng, origin.lat], [destination.lng, destination.lat]],
                distance: 1000,
                duration: 300
            });
        }
    };

    const handleBroadcast = async () => {
        if (!routeData) return;
        setIsClearing(true);
        try {
            // Try backend
            await broadcastClearance("AMB_01", signals);
            setIsCleared(true);
            alert("Clearance Broadcasted! Signals preempted.");
        } catch (error) {
            console.warn("Backend broadcast failed, simulating success");
            setIsCleared(true);
            alert("Clearance Broadcasted (Simulation Mode)");
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">Ambulance Nav</h1>
                    <select
                        value={destName}
                        onChange={handleDestChange}
                        className="text-black px-2 py-1 rounded"
                    >
                        {destinations.map(d => (
                            <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={handleStartRoute}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded font-semibold border border-blue-400"
                    >
                        Calculate Route
                    </button>
                    <button
                        onClick={handleBroadcast}
                        disabled={!routeData || isClearing}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${!routeData ? 'bg-gray-400 cursor-not-allowed' :
                            isCleared ? 'bg-green-500 hover:bg-green-400' :
                                isClearing ? 'bg-yellow-500' :
                                    'bg-red-500 hover:bg-red-400 animate-pulse'
                            }`}
                    >
                        {isClearing ? 'Broadcasting...' : isCleared ? 'PATH CLEARED' : 'BROADCAST CLEARANCE'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Map Area */}
                <div className="flex-1 relative">
                    <RouteMap
                        origin={origin}
                        destination={destination}
                        routeData={routeData}
                        signals={signals}
                        isCleared={isCleared}
                    />
                </div>

                {/* Sidebar Info */}
                <div className="w-80 bg-white shadow-xl z-10 overflow-y-auto p-4 border-l border-gray-200">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">Status</h2>
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${isCleared ? 'bg-blue-500' : routeData ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-sm text-gray-600">
                                {isCleared ? 'Blue Channel Active' : routeData ? 'En Route' : 'Idle'}
                            </span>
                        </div>
                        {routeData && (
                            <div className="mt-2 text-sm">
                                <p><strong>Distance:</strong> {(routeData.distance / 1000).toFixed(1)} km</p>
                                <p><strong>ETA:</strong> {(routeData.duration / 60).toFixed(0)} mins</p>
                            </div>
                        )}
                    </div>

                    <SignalList signals={signals} />
                </div>
            </div>
        </div>
    );
};

export default NavPage;
