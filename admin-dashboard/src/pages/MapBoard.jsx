import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Polyline, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { listenToAllVehicles, listenToAllSignals, listenToActiveCases, listenToAmbulances } from '../services/firebaseAdmin';
import SignalControl from '../components/SignalControl';
import EmergencyTable from '../components/EmergencyTable';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const vehicleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const lockdownIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Signal marker component with right-click
const SignalMarker = ({ signal, onToggle }) => {
    const [ref, setRef] = useState(null);

    useEffect(() => {
        if (ref) {
            ref.on('contextmenu', () => {
                onToggle(signal);
            });
        }
    }, [ref, signal, onToggle]);

    return (
        <CircleMarker
            ref={setRef}
            center={[signal.lat, signal.lng]}
            radius={10}
            pathOptions={{
                color: 'white',
                fillColor: signal.status === 'green' ? '#10B981' : signal.status === 'red' ? '#EF4444' : '#FBBF24',
                fillOpacity: 1,
                weight: 2
            }}
        >
            <Popup>
                <div className="text-xs">
                    <strong>{signal.name || signal.id}</strong>
                    <br />
                    Status: <span className={signal.status === 'green' ? 'text-green-600' : 'text-red-600'}>{signal.status}</span>
                    <br />
                    <em>Right-click to toggle</em>
                </div>
            </Popup>
        </CircleMarker>
    );
};

// Map click handler component
const MapClickHandler = ({ onMapClick, isSelecting }) => {
    useMapEvents({
        click: (e) => {
            if (isSelecting) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
};

const MapBoard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [signals, setSignals] = useState([]);
    const [cases, setCases] = useState([]);
    const [ambulances, setAmbulances] = useState([]);

    // Lockdown state
    const [lockdownMode, setLockdownMode] = useState(null);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [lockdownDuration, setLockdownDuration] = useState(30);
    const [activeLockdowns, setActiveLockdowns] = useState([]);

    useEffect(() => {
        const unsubVehicles = listenToAllVehicles(setVehicles);
        const unsubSignals = listenToAllSignals(setSignals);
        const unsubCases = listenToActiveCases(setCases);
        const unsubAmbulances = listenToAmbulances(setAmbulances);

        return () => {
            unsubVehicles();
            unsubSignals();
            unsubCases();
            unsubAmbulances();
        };
    }, []);

    const handleMapClick = (latlng) => {
        if (selectedPoints.length < 2) {
            setSelectedPoints([...selectedPoints, latlng]);
        }

        if (selectedPoints.length === 1) {
            const newPoints = [...selectedPoints, latlng];

            if (lockdownMode === 'create') {
                createLockdown(newPoints);
            }
        }
    };

    const createLockdown = async (points) => {
        try {
            // Fetch actual road route using OSRM
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${points[0].lng},${points[0].lat};${points[1].lng},${points[1].lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.code !== "Ok") throw new Error("OSRM Failed");

            const route = data.routes[0];
            const routeCoordinates = route.geometry.coordinates;

            // Detect signals along the route
            const affectedSignals = detectSignalsAlongRoute(routeCoordinates);

            const lockdown = {
                id: `lockdown_${Date.now()}`,
                points: points,
                routeCoordinates: routeCoordinates,
                duration: lockdownDuration,
                createdAt: Date.now(),
                expiresAt: Date.now() + (lockdownDuration * 60 * 1000),
                status: 'active',
                affectedSignalIds: affectedSignals.map(s => s.id)
            };

            // Turn affected signals red
            setSignals(prevSignals =>
                prevSignals.map(s => {
                    if (affectedSignals.find(as => as.id === s.id)) {
                        return { ...s, status: 'red', lockedBy: lockdown.id };
                    }
                    return s;
                })
            );

            setActiveLockdowns([...activeLockdowns, lockdown]);

            // Auto-remove after duration
            setTimeout(() => {
                // Restore signals
                setSignals(prevSignals =>
                    prevSignals.map(s => {
                        if (s.lockedBy === lockdown.id) {
                            return { ...s, status: 'green', lockedBy: null };
                        }
                        return s;
                    })
                );
                setActiveLockdowns(prev => prev.filter(l => l.id !== lockdown.id));
            }, lockdownDuration * 60 * 1000);

            resetSelection();
            alert(`Road locked down for ${lockdownDuration} minutes!\n${affectedSignals.length} signals affected.`);

        } catch (error) {
            console.error("Failed to create lockdown:", error);
            alert("Failed to fetch road route. Check internet connection.");
            resetSelection();
        }
    };

    const detectSignalsAlongRoute = (routeCoordinates) => {
        const THRESHOLD_METERS = 50;
        const affectedSignals = [];

        signals.forEach(signal => {
            let minDistance = Infinity;

            routeCoordinates.forEach(([lng, lat]) => {
                const distance = getDistance(signal.lat, signal.lng, lat, lng);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            });

            if (minDistance < THRESHOLD_METERS) {
                affectedSignals.push(signal);
            }
        });

        return affectedSignals;
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const handleSignalToggle = (signal) => {
        setSignals(prevSignals =>
            prevSignals.map(s => {
                if (s.id === signal.id) {
                    const newStatus = s.status === 'green' ? 'red' : 'green';
                    return { ...s, status: newStatus };
                }
                return s;
            })
        );
    };

    const releaseLockdown = (lockdownId) => {
        const lockdown = activeLockdowns.find(l => l.id === lockdownId);
        if (lockdown) {
            // Restore signals
            setSignals(prevSignals =>
                prevSignals.map(s => {
                    if (s.lockedBy === lockdownId) {
                        return { ...s, status: 'green', lockedBy: null };
                    }
                    return s;
                })
            );
        }
        setActiveLockdowns(activeLockdowns.filter(l => l.id !== lockdownId));
    };

    const resetSelection = () => {
        setSelectedPoints([]);
        setLockdownMode(null);
    };

    const startLockdownMode = () => {
        setLockdownMode('create');
        setSelectedPoints([]);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 flex flex-col border-r border-gray-700 bg-gray-800 z-10 shadow-xl">
                <div className="p-4 bg-gray-900 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-red-500">Admin Control</h1>

                    {/* Lockdown Controls */}
                    <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Road Lockdown</h3>

                        {lockdownMode ? (
                            <div className="space-y-2">
                                <div className="text-xs text-yellow-400 animate-pulse">
                                    🔒 Click 2 points to LOCK road
                                </div>
                                <div className="text-xs text-gray-400">
                                    Selected: {selectedPoints.length}/2 points
                                </div>
                                <button
                                    onClick={resetSelection}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-xs py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2">
                                    <label className="text-xs text-gray-400">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={lockdownDuration}
                                        onChange={(e) => setLockdownDuration(parseInt(e.target.value))}
                                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs mt-1"
                                        min="1"
                                        max="120"
                                    />
                                </div>
                                <button
                                    onClick={startLockdownMode}
                                    className="w-full bg-red-900 hover:bg-red-800 text-xs py-2 rounded border border-red-700"
                                >
                                    🔒 CREATE LOCKDOWN
                                </button>
                            </>
                        )}
                    </div>

                    {/* Active Lockdowns */}
                    {activeLockdowns.length > 0 && (
                        <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700">
                            <h3 className="text-xs font-bold text-red-400 mb-2">Active Lockdowns ({activeLockdowns.length})</h3>
                            <div className="space-y-2">
                                {activeLockdowns.map((lockdown, idx) => {
                                    const remaining = Math.ceil((lockdown.expiresAt - Date.now()) / 60000);
                                    return (
                                        <div key={lockdown.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-white">Lockdown #{idx + 1}</span>
                                                <span className="text-xs text-yellow-400">{remaining}m left</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mb-1">
                                                {lockdown.affectedSignalIds?.length || 0} signals affected
                                            </div>
                                            <button
                                                onClick={() => releaseLockdown(lockdown.id)}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-1 rounded transition-colors"
                                            >
                                                🔓 Release This Lockdown
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mt-2">
                        <button
                            onClick={() => window.open('/cctv', '_blank')}
                            className="w-full bg-blue-900 hover:bg-blue-800 text-xs py-2 rounded border border-blue-700"
                        >
                            📹 LIVE CCTV MONITORING
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h2 className="text-sm font-bold text-gray-400 uppercase mb-2">Active Emergencies</h2>
                    <EmergencyTable cases={cases} />

                    <h2 className="text-sm font-bold text-gray-400 uppercase mt-6 mb-2">Signal Controls</h2>
                    <div className="text-xs text-gray-400 mb-2 italic">Right-click signals on map to toggle</div>
                    {signals.map(s => (
                        <SignalControl key={s.id} signal={s} />
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={[23.0225, 72.5714]}
                    zoom={13}
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapClickHandler onMapClick={handleMapClick} isSelecting={lockdownMode !== null} />

                    {/* Selected Points */}
                    {selectedPoints.map((point, idx) => (
                        <Marker
                            key={`selected-${idx}`}
                            position={[point.lat, point.lng]}
                            icon={lockdownIcon}
                        />
                    ))}

                    {/* Active Lockdowns - Road-based */}
                    {activeLockdowns.map(lockdown => (
                        <React.Fragment key={lockdown.id}>
                            <Marker position={[lockdown.points[0].lat, lockdown.points[0].lng]} icon={lockdownIcon} />
                            <Marker position={[lockdown.points[1].lat, lockdown.points[1].lng]} icon={lockdownIcon} />
                            {lockdown.routeCoordinates && (
                                <Polyline
                                    positions={lockdown.routeCoordinates.map(([lng, lat]) => [lat, lng])}
                                    color="#DC2626"
                                    weight={8}
                                    opacity={0.7}
                                    dashArray="10, 10"
                                />
                            )}
                        </React.Fragment>
                    ))}

                    {/* Vehicles */}
                    {vehicles.map(v => (
                        <Marker
                            key={v.id}
                            position={[v.lat, v.lng]}
                            icon={vehicleIcon}
                        />
                    ))}

                    {/* Ambulances */}
                    {ambulances.map(a => (
                        <Marker
                            key={a.id}
                            position={[a.lat, a.lng]}
                            icon={ambulanceIcon}
                        />
                    ))}

                    {/* Signals with right-click toggle */}
                    {signals.map(s => (
                        <SignalMarker key={s.id} signal={s} onToggle={handleSignalToggle} />
                    ))}
                </MapContainer>

                {/* Overlay Stats */}
                <div className="absolute top-4 right-4 bg-gray-800 p-3 rounded shadow-lg border border-gray-700 z-[1000]">
                    <div className="text-xs text-gray-400">Active Ambulances</div>
                    <div className="text-2xl font-bold text-white">{ambulances.filter(a => a.status === 'active' || a.status === 'clearing_path').length}</div>
                    <div className="text-xs text-red-400 mt-2">Lockdowns: {activeLockdowns.length}</div>
                    <div className="text-xs text-yellow-400">Signals: {signals.length}</div>
                </div>

                {/* Instructions Overlay */}
                {lockdownMode && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-900 text-yellow-100 px-4 py-2 rounded shadow-lg border border-yellow-700 z-[1000] animate-pulse">
                        <div className="text-sm font-bold">
                            🔒 Click 2 points on the map to create road-based lockdown
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapBoard;
