const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Creates or updates an emergency case.
 * Used by Admin Dashboard.
 */
exports.caseManager = functions.https.onCall(async (data, context) => {
    // Only Admin should be able to manage cases
    // In a real app, check custom claims. Here we check if auth exists.
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }

    const { action, caseId, caseData } = data;

    try {
        if (action === "create") {
            const newCaseRef = db.collection("cases").doc();
            await newCaseRef.set({
                ...caseData,
                status: "pending",
                timestamp: admin.firestore.Timestamp.now(),
                createdBy: context.auth.uid
            });
            return { success: true, caseId: newCaseRef.id };
        }

        else if (action === "update") {
            if (!caseId) throw new Error("Case ID required for update");
            await db.collection("cases").doc(caseId).update({
                ...caseData,
                updatedAt: admin.firestore.Timestamp.now()
            });
            return { success: true };
        }

        else if (action === "assign") {
            const { ambulanceId } = data;
            if (!caseId || !ambulanceId) throw new Error("Missing ID");

            const batch = db.batch();

            // Update Case
            const caseRef = db.collection("cases").doc(caseId);
            batch.update(caseRef, {
                status: "assigned",
                assignedAmbulanceId: ambulanceId,
                assignedAt: admin.firestore.Timestamp.now()
            });

            // Update Ambulance
            const ambRef = db.collection("ambulances").doc(ambulanceId);
            batch.update(ambRef, {
                status: "active",
                currentCaseId: caseId
            });

            await batch.commit();
            return { success: true };
        }

        else {
            throw new Error("Invalid action");
        }

    } catch (error) {
        console.error("Case Manager Error:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
