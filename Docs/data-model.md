# Data Model

## Collections

### `/vehicles/{vehicleId}`
Stores real-time state of all active vehicles.
```json
{
  "vehicleId": "CAR_103",
  "type": "car", // "car", "ambulance", "truck"
  "lat": 23.0,
  "lng": 72.0,
  "heading": 120, // 0-360
  "speed": 30, // km/h
  "priority": "normal", // "normal", "emergency"
  "lastSeen": 1678900000000 // timestamp
}
```

### `/ambulances/{ambulanceId}`
Stores specific state for ambulances, including route info.
```json
{
  "ambulanceId": "AMB_01",
  "status": "active", // "idle", "active"
  "currentRoute": {
    "destination": { "lat": 23.1, "lng": 72.1 },
    "steps": [], // Navigation steps
    "polyline": "..." // Encoded polyline
  },
  "lastSeen": 1678900000000
}
```

### `/signals/{signalId}`
Stores state of traffic signals.
```json
{
  "signalId": "SIG_01",
  "lat": 23.05,
  "lng": 72.05,
  "status": "green", // "red", "yellow", "green", "preempted"
  "incoming": {
    "ambulanceId": "AMB_01",
    "eta": 120, // seconds
    "direction": "northbound"
  }
}
```

### `/cases/{caseId}`
Stores emergency cases managed by Admin.
```json
{
  "caseId": "CASE_101",
  "priority": "high",
  "location": { "lat": 23.1, "lng": 72.1 },
  "status": "assigned", // "pending", "assigned", "resolved"
  "assignedAmbulanceId": "AMB_01",
  "timestamp": 1678900000000
}
```

### `/events/hornEvents/{eventId}`
Log of all horn presses for radar visualization.
```json
{
  "eventId": "EVT_001",
  "vehicleId": "CAR_038",
  "timestamp": 1678900000000,
  "lat": 23.0,
  "lng": 72.0,
  "heading": 120,
  "type": "horn"
}
```

### `/events/signalLogs/{logId}`
Audit log of signal overrides.
```json
{
  "logId": "LOG_001",
  "signalId": "SIG_01",
  "action": "force_green",
  "actor": "AMB_01", // or "ADMIN"
  "timestamp": 1678900000000
}
```
