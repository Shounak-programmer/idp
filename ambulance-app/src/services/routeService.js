import { functions } from "../../../shared/firebaseConfig";
import { httpsCallable } from "firebase/functions";

const computeRouteFn = httpsCallable(functions, 'computeRoute');

export const calculateRoute = async (origin, destination) => {
    try {
        const result = await computeRouteFn({ origin, destination });
        return result.data; // { route: { geometry, duration, distance }, signals: [] }
    } catch (error) {
        console.error("Error calculating route:", error);
        throw error;
    }
};
