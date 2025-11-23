/**
 * Simple 1D Kalman Filter
 */
export class KalmanFilter {
    constructor({ R = 1, Q = 1, A = 1, B = 0, C = 1 } = {}) {
        this.R = R; // Noise covariance
        this.Q = Q; // Process covariance
        this.A = A; // State vector
        this.B = B; // Control vector
        this.C = C; // Measurement vector

        this.cov = NaN;
        this.x = NaN; // Estimated signal
    }

    /**
     * Filter a new value
     * @param {number} z Measurement
     * @param {number} u Control
     * @returns {number} Filtered value
     */
    filter(z, u = 0) {
        if (isNaN(this.x)) {
            this.x = (1 / this.C) * z;
            this.cov = (1 / this.C) * this.R * (1 / this.C);
        } else {
            // Prediction
            const predX = (this.A * this.x) + (this.B * u);
            const predCov = ((this.A * this.cov) * this.A) + this.Q;

            // Kalman Gain
            const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.R));

            // Correction
            this.x = predX + K * (z - (this.C * predX));
            this.cov = predCov - (K * this.C * predCov);
        }
        return this.x;
    }
}
