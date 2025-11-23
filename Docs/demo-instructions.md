# Smart Traffic System - Demo Instructions

This document provides step-by-step instructions to set up, run, and demonstrate the Smart Traffic System.

## Prerequisites

1.  **Node.js**: Ensure Node.js (v16 or higher) is installed.
2.  **Java**: Required for Firebase Emulators.
3.  **Firebase CLI**: Install globally via `npm install -g firebase-tools`.
4.  **Google Maps API Key**: You need a valid API key with Maps JavaScript API and Directions API enabled.

## 1. Environment Setup

1.  **Clone/Open Repository**: Open the `smart-traffic-system` folder in VS Code.
2.  **Install Dependencies**:
    ```bash
    npm run install:all
    ```
    This command installs dependencies for the root, shared lib, backend, and all three frontend apps.

3.  **Configure Environment Variables**:
    *   Copy `.env.example` to `.env` in `driver-app`, `ambulance-app`, and `admin-dashboard`.
    *   Fill in your Firebase config and Google Maps API Key in each `.env` file.
    *   *Note: For local emulation, the Firebase config keys can be placeholders, but the Google Maps Key must be real.*

## 2. Running the System (Local Emulation)

We will run the Firebase Emulators and the three frontend apps concurrently.

1.  **Start Backend (Emulators)**:
    Open a terminal and run:
    ```bash
    npm run dev:backend
    ```
    This starts Firestore, Functions, and Auth emulators.

2.  **Start Frontend Apps**:
    Open three separate terminal tabs/windows:

    *   **Driver App**:
        ```bash
        npm run dev:driver
        ```
        Access at: `http://localhost:5173`

    *   **Ambulance App**:
        ```bash
        npm run dev:ambulance
        ```
        Access at: `http://localhost:5174`

    *   **Admin Dashboard**:
        ```bash
        npm run dev:admin
        ```
        Access at: `http://localhost:5175`

## 3. Demo Scenarios

### Scenario A: The "Hornless" Horn (Driver App)
1.  Open the **Driver App** (`http://localhost:5173`).
2.  Click "Start Sim" in the header. You will see vehicle icons appear on the radar.
3.  Observe "Ghost" vehicles appearing when the simulator triggers a horn event.
4.  Click the **Horn Button** at the bottom.
    *   *Expected*: Visual ripple effect, sound plays, and the event is logged to Firestore (visible in Admin Dashboard).

### Scenario B: Emergency Clearance (Ambulance App)
1.  Open the **Ambulance App** (`http://localhost:5174`).
2.  Click **Calculate Route**.
    *   *Expected*: A route from Start to End is drawn on the map. Traffic signals along the path appear as yellow dots.
3.  Click **BROADCAST CLEARANCE**.
    *   *Expected*: The button pulses red. Signals on the map turn Blue (Preempted).
    *   *Backend*: The `notifySignals` cloud function is triggered.

### Scenario C: Traffic Control (Admin Dashboard)
1.  Open the **Admin Dashboard** (`http://localhost:5175`).
2.  Observe the map. You should see:
    *   **Grey Dots**: Regular vehicles (from the simulator).
    *   **Red Dot**: The Ambulance (if active).
    *   **Signals**: Changing colors based on status.
3.  **Lockdown**: Click "LOCKDOWN ROAD". Check console logs for action.
4.  **Signal Override**: Find a signal in the sidebar list. Click "Force Red".
    *   *Expected*: The signal icon on the map turns Red.

## 4. Troubleshooting

*   **Map not loading?** Check your `VITE_GOOGLE_MAPS_KEY` in the `.env` files.
*   **Firebase errors?** Ensure the emulators are running (`npm run dev:backend`) and ports (9099, 5001, 8080) are not blocked.
*   **No vehicles?** Make sure to click "Start Sim" in the Driver App to populate Firestore with dummy data.
