/**
 * Manages spatial audio for horn alerts.
 */
export class AudioController {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.isSetup = false;
    }

    async setup() {
        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
        }
        this.isSetup = true;
    }

    /**
     * Plays a spatialized horn sound.
     * @param {number} azimuth - Angle in degrees relative to the listener (-180 to 180). 
     *                           Negative is left, Positive is right.
     * @param {number} distance - Distance in meters.
     */
    playHorn(azimuth, distance) {
        if (!this.isSetup) return;

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        const panner = this.audioCtx.createStereoPanner();

        // Sound design: "Whoosh" pulse
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.5);

        // Spatialization: Pan
        // Map azimuth -90 (left) to -1, 90 (right) to 1
        // Azimuth is usually 0 for front.
        // Simple mapping: sin(azimuth) gives -1 to 1 for -90 to 90
        const panValue = Math.sin(azimuth * Math.PI / 180);
        panner.pan.value = Math.max(-1, Math.min(1, panValue));

        // Attenuation: Volume drops with distance
        // Max volume at 0m, 0 volume at 100m
        const maxDist = 100;
        const volume = Math.max(0, 1 - (distance / maxDist));
        gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);

        // Connect graph
        oscillator.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.5);
    }
}

export const audioController = new AudioController();
