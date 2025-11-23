# 🚀 Smart Traffic System - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Internet connection (for OSRM routing API)

---

## 📦 First Time Setup

### 1. Install Dependencies
Open a terminal in the project root (`d:/Programs/Projects/idp`) and run:

```bash
npm install
```

This will install dependencies for all three applications.

---

## ▶️ Running the Applications

### Option 1: Run All Apps at Once (Recommended)

Open **3 separate terminal windows** in the project root:

#### Terminal 1 - Driver App
```bash
npm run dev:driver
```
- Opens at: http://localhost:5173 (or next available port)
- Wait for "ready in X ms" message

#### Terminal 2 - Ambulance App
```bash
npm run dev:ambulance
```
- Opens at: http://localhost:5174 (or next available port)
- Wait for "ready in X ms" message

#### Terminal 3 - Admin Dashboard
```bash
npm run dev:admin
```
- Opens at: http://localhost:5175 (or next available port)
- Wait for "ready in X ms" message

### Option 2: Run Individual Apps

Navigate to the specific app folder and run:

```bash
# Driver App
cd driver-app
npm run dev

# Ambulance App
cd ambulance-app
npm run dev

# Admin Dashboard
cd admin-dashboard
npm run dev
```

---

## 🌐 Accessing the Applications

After starting, check the terminal output for the exact ports. Typically:

- **Driver App**: http://localhost:5173
- **Ambulance App**: http://localhost:5174
- **Admin Dashboard**: http://localhost:5175

> **Note**: If ports are already in use, Vite will automatically use the next available port (5176, 5177, etc.)

---

## 🛑 Stopping the Applications

In each terminal window, press:
```
Ctrl + C
```

Then confirm with `Y` if prompted.

---

## 🔧 Troubleshooting

### Port Already in Use
If you see "Port XXXX is in use", either:
1. Close the application using that port
2. Let Vite use the next available port (shown in terminal)

### Dependencies Not Found
Run in project root:
```bash
npm install
```

### Module Not Found Errors
Try clearing cache and reinstalling:
```bash
# In project root
rm -rf node_modules
rm -rf driver-app/node_modules
rm -rf ambulance-app/node_modules
rm -rf admin-dashboard/node_modules
npm install
```

### Map Not Loading
- Check internet connection (required for OpenStreetMap tiles and OSRM routing)
- Try refreshing the browser

---

## 📱 Using the Applications

### Driver App
1. Click "Start Sim" to spawn vehicles
2. Watch radar for green/red dots
3. Click horn button to alert nearby vehicles

### Ambulance App
1. Select destination from dropdown
2. Click "Calculate Route"
3. Click "Broadcast Clearance" to turn route blue

### Admin Dashboard
1. Set lockdown duration
2. Click "CREATE LOCKDOWN"
3. Click 2 points on map to lock road
4. Right-click signals to toggle red/green
5. Use blue "Release" buttons to remove lockdowns

---

## 📝 Quick Commands Reference

```bash
# Install all dependencies
npm install

# Run Driver App
npm run dev:driver

# Run Ambulance App
npm run dev:ambulance

# Run Admin Dashboard
npm run dev:admin

# Install dependencies for specific app
cd driver-app && npm install
cd ambulance-app && npm install
cd admin-dashboard && npm install
```

---

## 🎯 Demo Workflow

1. **Start all three apps** in separate terminals
2. **Driver App**: Click "Start Sim" to populate vehicles
3. **Ambulance App**: Select destination → Calculate Route → Broadcast Clearance
4. **Admin Dashboard**: Create lockdowns, toggle signals, view live traffic

---

## 💡 Tips

- Keep all three terminals open while using the system
- The apps communicate through Firebase Firestore (local emulator not required for basic demo)
- Vehicle simulation runs client-side in the Driver App
- OSRM routing requires internet connection

---

## 📞 Need Help?

If you encounter issues:
1. Check terminal output for error messages
2. Ensure all dependencies are installed (`npm install`)
3. Verify Node.js version: `node --version` (should be v16+)
4. Try restarting the application

---

**Happy Testing! 🚦🚑🚗**
