const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure admin is initialized (it might be in index.js, but good practice to check or pass db)
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Notifies signals along a route about an incoming ambulance.
 * Triggered by HTTP request from Ambulance App.
 * 
 * Payload:
 * {
 *   ambulanceId: string,
 *   route: {
 *     steps: Array,
 *     polyline: string
 *   },
 *   signals: Array<{ id: string, eta: number, direction: string }>
 * }
 */
exports.notifySignals = functions.https.onCall(async (data, context) => {
    // Security check: Ensure user is authenticated (and ideally is an ambulance)
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { ambulanceId, signals } = data;

    if (!ambulanceId || !signals || !Array.isArray(signals)) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with ambulanceId and a list of signals."
        );
    }

    const batch = db.batch();
    const timestamp = admin.firestore.Timestamp.now();

    try {
        // 1. Update each signal with incoming ambulance info
        for (const signal of signals) {
            const signalRef = db.collection("signals").doc(signal.id);

            // We update the 'incoming' field. 
            // In a real system, we might handle multiple incoming ambulances.
            // Here we overwrite for the prototype or check priority.
            batch.set(signalRef, {
                incoming: {
                    ambulanceId: ambulanceId,
                    eta: signal.eta,
                    direction: signal.direction,
                    timestamp: timestamp
                },
                status: "preempted" // Visual indicator that it's being controlled
            }, { merge: true });

            // 2. Log the event
            const logRef = db.collection("events/signalLogs/items").doc();
            batch.set(logRef, {
                signalId: signal.id,
                action: "clearance_request",
                actor: ambulanceId,
                timestamp: timestamp,
                details: {
                    eta: signal.eta,
                    direction: signal.direction
                }
            });
        }

        // 3. Update Ambulance Status
        const ambRef = db.collection("ambulances").doc(ambulanceId);
        batch.update(ambRef, {
            status: "clearing_path",
            lastBroadcast: timestamp
        });

        await batch.commit();

        return { success: true, message: `Notified ${signals.length} signals.` };

    } catch (error) {
        console.error("Error notifying signals:", error);
        throw new functions.https.HttpsError("internal", "Failed to notify signals.");
    }
});
