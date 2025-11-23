import { db, functions } from "../../../shared/firebaseConfig";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const caseManagerFn = httpsCallable(functions, 'caseManager');

export const forceClearSignal = async (signalId, action = "force_green") => {
    try {
        const batch = db.batch(); // Not strictly needed for single update but good for logs

        // Update Signal
        await updateDoc(doc(db, "signals", signalId), {
            status: action === "force_green" ? "green" : "red",
            override: true,
            lastOverride: serverTimestamp()
        });

        // Log Event
        await addDoc(collection(db, "events", "signalLogs", "items"), {
            signalId,
            action,
            actor: "ADMIN",
            timestamp: serverTimestamp()
        });

        console.log(`Signal ${signalId} forced to ${action}`);
    } catch (error) {
        console.error("Error forcing signal:", error);
    }
};

export const lockdownRoad = async (roadId) => {
    // In a real app, we'd query all signals on this road.
    // For prototype, we'll just log it or mock it.
    console.log(`Lockdown initiated for road ${roadId}`);
    // Mock implementation: Force specific signals red
    // await forceClearSignal("SIG_01", "force_red");
};

export const createEmergencyCase = async (caseData) => {
    try {
        await caseManagerFn({ action: "create", caseData });
    } catch (error) {
        console.error("Error creating case:", error);
    }
};
