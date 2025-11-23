import { db } from "../../../shared/firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

export const updateAmbulanceStatus = async (ambulanceId, status, location) => {
    const ref = doc(db, "ambulances", ambulanceId);
    await updateDoc(ref, {
        status,
        location, // { lat, lng }
        lastSeen: Date.now()
    });
};

export const listenToAmbulance = (ambulanceId, callback) => {
    return onSnapshot(doc(db, "ambulances", ambulanceId), (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        }
    });
};
