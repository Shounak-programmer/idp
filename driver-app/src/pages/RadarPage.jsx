import React, { useEffect, useState } from 'react';
import RadarView from '../components/RadarView';
import HornButton from '../components/HornButton';
import { triggerHorn } from '../services/hornService';
import { listenForHornEvents } from '../services/radarService';
import { audioController } from '../services/audioService';
import { VehicleSimulator } from '../../../shared/simulator/vehicleSimulator';
import { db } from '../../../shared/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const RadarPage = () => {
    const [myVehicle, setMyVehicle] = useState({
        id: 'MY_CAR', lat: 23.0225, lng: 72.5714, heading: 0, speed: 0
    });
    const [otherVehicles, setOtherVehicles] = useState([]);
    const [simulator, setSimulator] = useState(null);
    const [simMode, setSimMode] = useState(false);

    useEffect(() => {
        // Setup Audio
        const startAudio = () => audioController.setup();
        window.addEventListener('click', startAudio, { once: true });

        // Listen for horns
        const unsubscribeHorns = listenForHornEvents((event) => {
            setOtherVehicles(prev => {
                const exists = prev.find(v => v.id === event.vehicleId);
                if (exists) {
                    return prev.map(v => v.id === event.vehicleId ? { ...v, state: 'horn', lastHorn: Date.now() } : v);
                } else {
                    return [...prev, {
                        id: event.vehicleId,
                        lat: event.lat,
                        lng: event.lng,
                        heading: event.heading,
                        state: 'horn',
                        lastHorn: Date.now()
                    }];
                }
            });
        });

        // Listen for all vehicles
        const unsubscribeVehicles = onSnapshot(collection(db, "vehicles"), (snapshot) => {
            const vehicles = [];
            snapshot.forEach(doc => {
                if (doc.id !== myVehicle.id) {
                    vehicles.push({ id: doc.id, ...doc.data() });
                }
            });

            // Merge with existing state to preserve horn state if possible
            setOtherVehicles(prev => {
                return vehicles.map(v => {
                    const existing = prev.find(p => p.id === v.id);
                    if (existing && existing.state === 'horn' && Date.now() - existing.lastHorn < 5000) {
                        return { ...v, state: 'horn', lastHorn: existing.lastHorn };
                    }
                    return { ...v, state: 'normal' };
                });
            });
        });

        return () => {
            unsubscribeHorns();
            unsubscribeVehicles();
            window.removeEventListener('click', startAudio);
        };
    }, [myVehicle.id]);

    // Decay horn state
    useEffect(() => {
        const interval = setInterval(() => {
            setOtherVehicles(prev => prev.map(v => {
                if (v.state === 'horn' && Date.now() - v.lastHorn > 5000) {
                    return { ...v, state: 'normal' };
                }
                return v;
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Simulation Logic
    const toggleSimulation = () => {
        if (simMode) {
            simulator.stop();
            setSimMode(false);
        } else {
            const sim = new VehicleSimulator(db);
            sim.initializeVehicles(20);
            sim.start();
            setSimulator(sim);
            setSimMode(true);
        }
    };

    // Mock update loop for "My Vehicle" (driving forward slowly)
    useEffect(() => {
        const interval = setInterval(() => {
            setMyVehicle(prev => ({
                ...prev,
                lat: prev.lat + 0.00001, // Moving North slowly
                heading: 0
            }));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleHorn = () => {
        triggerHorn(myVehicle.id, myVehicle);
        audioController.playHorn(0, 0); // Play local sound
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-6">
            <header className="w-full flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Radar System</h1>
                <button
                    onClick={toggleSimulation}
                    className={`px-4 py-2 rounded ${simMode ? 'bg-red-600' : 'bg-blue-600'}`}
                >
                    {simMode ? 'Stop Sim' : 'Start Sim'}
                </button>
            </header>

            <div className="flex-1 flex items-center justify-center">
                <RadarView vehicles={otherVehicles} myVehicle={myVehicle} />
            </div>

            <div className="mt-8 mb-8">
                <HornButton onHorn={handleHorn} />
                <p className="text-center mt-2 text-gray-400">Tap to Horn</p>
            </div>
        </div>
    );
};

export default RadarPage;
