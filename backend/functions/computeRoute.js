const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios"); // Need to install axios in backend

// Mock Signal Database (In reality, this would be queried from Firestore or a geospatial index)
const KNOWN_SIGNALS = [
    { id: "SIG_01", lat: 23.0225, lng: 72.5714, name: "Crossroad A" },
    { id: "SIG_02", lat: 23.0235, lng: 72.5724, name: "Crossroad B" },
    { id: "SIG_03", lat: 23.0245, lng: 72.5734, name: "Crossroad C" },
    // Add more mock signals around the simulation area
];

/**
 * Computes a route and identifies signals along the path.
 * Uses OSRM (Open Source Routing Machine) public API for demo purposes.
 * 
 * Payload:
 * {
 *   origin: { lat: number, lng: number },
 *   destination: { lat: number, lng: number }
 * }
 */
exports.computeRoute = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }

    const { origin, destination } = data;

    try {
        // 1. Get Route from OSRM
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;

        const response = await axios.get(osrmUrl);

        if (response.data.code !== "Ok") {
            throw new Error("OSRM Routing failed");
        }

        const route = response.data.routes[0];
        const geometry = route.geometry.coordinates; // [lng, lat] array
        const duration = route.duration; // seconds

        // 2. Detect Signals along the route
        // Simple implementation: Check if any known signal is within X meters of any point on the route
        const detectedSignals = [];
        const THRESHOLD_METERS = 30;

        // Helper to calculate distance (Haversine)
        const getDist = (lat1, lon1, lat2, lon2) => {
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

        // Naive check: iterate all signals against all route points (Optimization needed for prod)
        // For prototype with few signals, this is fine.
        for (const signal of KNOWN_SIGNALS) {
            let minDistance = Infinity;
            let estimatedTimeOffset = 0; // Rough ETA to this signal

            for (let i = 0; i < geometry.length; i++) {
                const [lng, lat] = geometry[i];
                const d = getDist(signal.lat, signal.lng, lat, lng);
                if (d < minDistance) {
                    minDistance = d;
                    // Rough ETA: fraction of total duration based on path progress
                    estimatedTimeOffset = (i / geometry.length) * duration;
                }
            }

            if (minDistance < THRESHOLD_METERS) {
                detectedSignals.push({
                    id: signal.id,
                    name: signal.name,
                    lat: signal.lat,
                    lng: signal.lng,
                    eta: Math.round(estimatedTimeOffset),
                    direction: "approaching" // Simplified
                });
            }
        }

        // Sort signals by ETA
        detectedSignals.sort((a, b) => a.eta - b.eta);

        return {
            route: {
                geometry: geometry,
                duration: duration,
                distance: route.distance
            },
            signals: detectedSignals
        };

    } catch (error) {
        console.error("Route computation error:", error);

        // Fallback for demo if OSRM fails (e.g. network issues in emulator)
        console.warn("Using fallback mock route.");
        const mockGeometry = [
            [origin.lng, origin.lat],
            [origin.lng, origin.lat + 0.005],
            [destination.lng, destination.lat]
        ];

        return {
            route: {
                geometry: mockGeometry,
                duration: 600,
                distance: 2000
            },
            signals: KNOWN_SIGNALS.slice(0, 2).map((s, i) => ({
                ...s,
                eta: (i + 1) * 60,
                direction: "approaching"
            }))
        };
    }
});
