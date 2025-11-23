import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";

export class VehicleSimulator {
    constructor(db, bounds = { minLat: 23.0200, maxLat: 23.0250, minLng: 72.5700, maxLng: 72.5750 }) {
        this.db = db;
        this.bounds = bounds;
        this.vehicles = [];
        this.isRunning = false;
        this.intervalId = null;
    }

    initializeVehicles(count = 20) {
        this.vehicles = [];
        for (let i = 0; i < count; i++) {
            this.vehicles.push({
                id: `SIM_CAR_${i + 1}`,
                type: 'car',
                lat: this.randomRange(this.bounds.minLat, this.bounds.maxLat),
                lng: this.randomRange(this.bounds.minLng, this.bounds.maxLng),
                heading: this.randomRange(0, 360),
                speed: this.randomRange(20, 60), // km/h
                lastHorn: 0
            });
        }
        console.log(`Initialized ${count} vehicles.`);
    }

    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    start(updateIntervalMs = 1000) {
        if (this.isRunning) return;
        this.isRunning = true;

        this.intervalId = setInterval(() => {
            this.updateVehicles();
        }, updateIntervalMs);

        console.log("Simulation started.");
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.intervalId);
        console.log("Simulation stopped.");
    }

    async updateVehicles() {
        const batchPromises = this.vehicles.map(async (vehicle) => {
            // Move vehicle
            const dist = (vehicle.speed * 1000 / 3600); // meters per second (assuming 1s interval)
            // Simple movement based on heading
            const R = 6378137; // Earth Radius
            const dn = dist * Math.cos(vehicle.heading * Math.PI / 180);
            const de = dist * Math.sin(vehicle.heading * Math.PI / 180);

            const dLat = dn / R;
            const dLon = de / (R * Math.cos(Math.PI * vehicle.lat / 180));

            vehicle.lat += dLat * 180 / Math.PI;
            vehicle.lng += dLon * 180 / Math.PI;

            // Randomly change heading slightly
            vehicle.heading += this.randomRange(-10, 10);
            vehicle.heading = (vehicle.heading + 360) % 360;

            // Keep in bounds (bounce)
            if (vehicle.lat < this.bounds.minLat || vehicle.lat > this.bounds.maxLat) vehicle.heading = (180 - vehicle.heading + 360) % 360;
            if (vehicle.lng < this.bounds.minLng || vehicle.lng > this.bounds.maxLng) vehicle.heading = (360 - vehicle.heading) % 360;

            // Update Firestore
            const vehicleRef = doc(this.db, "vehicles", vehicle.id);
            await setDoc(vehicleRef, {
                vehicleId: vehicle.id,
                type: vehicle.type,
                lat: vehicle.lat,
                lng: vehicle.lng,
                heading: vehicle.heading,
                speed: vehicle.speed,
                priority: "normal",
                lastSeen: Date.now()
            });

            // Random Horn Event (1% chance per tick)
            if (Math.random() < 0.01 && Date.now() - vehicle.lastHorn > 10000) {
                await this.triggerHorn(vehicle);
                vehicle.lastHorn = Date.now();
            }
        });

        await Promise.all(batchPromises);
    }

    async triggerHorn(vehicle) {
        try {
            await addDoc(collection(this.db, "events", "hornEvents", "items"), { // Note: Check collection structure in data-model
                vehicleId: vehicle.id,
                timestamp: Date.now(),
                lat: vehicle.lat,
                lng: vehicle.lng,
                heading: vehicle.heading,
                type: "horn"
            });
            console.log(`Horn triggered by ${vehicle.id}`);
        } catch (e) {
            console.error("Error triggering horn:", e);
        }
    }
}
