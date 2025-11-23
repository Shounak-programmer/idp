import { functions } from "../../../shared/firebaseConfig";
import { httpsCallable } from "firebase/functions";

const notifySignalsFn = httpsCallable(functions, 'notifySignals');

export const broadcastClearance = async (ambulanceId, signals) => {
    try {
        const result = await notifySignalsFn({ ambulanceId, signals });
        return result.data;
    } catch (error) {
        console.error("Error broadcasting clearance:", error);
        throw error;
    }
};
