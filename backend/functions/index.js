const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Export individual modules
exports.notifySignals = require("./notifySignals").notifySignals;
exports.computeRoute = require("./computeRoute").computeRoute;
exports.caseManager = require("./caseManager").caseManager;

// Simple health check
exports.ping = functions.https.onRequest((req, res) => {
    res.send("Pong! Backend is running.");
});
