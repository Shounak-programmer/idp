import { db } from "../../../shared/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp } from "firebase/firestore";
import { calculateDistance } from "../../../shared/lib/rssiToDistance"; // We can use this or direct Haversine

/**
 * Listens for horn events within a certain time window.
 * Note: Geospatial filtering is ideally done server-side or with GeoFire, 
 * but for this prototype we'll listen to recent events and filter client-side.
 * @param {function} onEvent - Callback when a relevant horn event occurs.
 * @returns {function} Unsubscribe function.
 */
export const listenForHornEvents = (onEvent) => {
    // Listen for events in the last 10 seconds to catch active ones
    // Simulator stores timestamp as number (Date.now())
    const tenSecondsAgo = Date.now() - 10000;

    const q = query(
        collection(db, "events", "hornEvents", "items"),
        where("timestamp", ">", tenSecondsAgo),
        orderBy("timestamp", "desc"),
        limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                // Client-side filtering for distance will happen in the component or here
                // For now, pass all recent events
                onEvent({ id: change.doc.id, ...data });
            }
        });
    });

    return unsubscribe;
};
