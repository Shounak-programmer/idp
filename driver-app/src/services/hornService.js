import { db } from "../../../shared/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Triggers a horn event.
 * @param {string} vehicleId - The ID of the vehicle pressing the horn.
 * @param {object} location - { lat, lng, heading }
 */
export const triggerHorn = async (vehicleId, location) => {
    try {
        await addDoc(collection(db, "events", "hornEvents", "items"), {
            vehicleId,
            timestamp: serverTimestamp(), // Use server timestamp for consistency
            lat: location.lat,
            lng: location.lng,
            heading: location.heading,
            type: "horn"
        });
        console.log("Horn event triggered");
    } catch (error) {
        console.error("Error triggering horn:", error);
    }
};
