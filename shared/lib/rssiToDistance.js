/**
 * Estimates distance from RSSI using Log-Distance Path Loss Model.
 * @param {number} rssi Received Signal Strength Indicator (dBm)
 * @param {number} txPower Transmission Power at 1 meter (dBm) - default -59
 * @param {number} n Path Loss Exponent - default 2 (Free space) to 4 (Urban)
 * @returns {number} Estimated distance in meters
 */
export function calculateDistance(rssi, txPower = -59, n = 2.5) {
    if (rssi === 0) {
        return -1.0;
    }

    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio, 10);
    } else {
        const distance = Math.pow(10, (txPower - rssi) / (10 * n));
        return distance;
    }
}
