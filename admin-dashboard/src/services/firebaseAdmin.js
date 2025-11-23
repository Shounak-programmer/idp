import { db } from "../../../shared/firebaseConfig";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";

export const listenToAllVehicles = (callback) => {
    return onSnapshot(collection(db, "vehicles"), (snapshot) => {
        const vehicles = [];
        snapshot.forEach(doc => vehicles.push({ id: doc.id, ...doc.data() }));
        callback(vehicles);
    });
};

export const listenToAllSignals = (callback) => {
    return onSnapshot(collection(db, "signals"), (snapshot) => {
        const signals = [];
        snapshot.forEach(doc => signals.push({ id: doc.id, ...doc.data() }));
        callback(signals);
    });
};

export const listenToActiveCases = (callback) => {
    const q = query(collection(db, "cases"), where("status", "!=", "resolved"));
    return onSnapshot(q, (snapshot) => {
        const cases = [];
        snapshot.forEach(doc => cases.push({ id: doc.id, ...doc.data() }));
        callback(cases);
    });
};

export const listenToAmbulances = (callback) => {
    return onSnapshot(collection(db, "ambulances"), (snapshot) => {
        const ambulances = [];
        snapshot.forEach(doc => ambulances.push({ id: doc.id, ...doc.data() }));
        callback(ambulances);
    });
};
