# 🚑 Module 1: Ambulance Priority Traffic Management System

**Objective:** Detect ambulances in real-time and automatically grant them traffic priority to reduce emergency response time.

---

## 📋 Overview

This module implements an AI-powered system that:

1. **Detects ambulances** using YOLOv8 on live camera feeds
2. **Tracks location** via GPS/GSM modules
3. **Communicates with traffic signals** within 10 km radius
4. **Optimizes routes** to find the least congested path to hospitals
5. **Displays alerts** on traffic signal boards

---

## 📁 Folder Structure

```
module1_ambulance_traffic/
├── vehicle_detection/
│   ├── ambulance_detector.py          # Main YOLOv8 detection module
│   ├── yolo_model_trainer.py          # Training script for custom model
│   ├── models/
│   │   └── best.pt                    # Trained YOLOv8 weights
│   └── test_detection.py
│
├── gps_tracking/
│   ├── gps_handler.py                 # GPS/GSM module interface
│   ├── location_updater.py            # Real-time location updates
│   └── test_gps.py
│
├── traffic_signal_communication/
│   ├── signal_controller.py           # Control traffic signals
│   ├── mqtt_handler.py                # MQTT protocol handler
│   ├── firebase_handler.py            # Firebase real-time DB handler
│   └── test_signals.py
│
├── route_optimization/
│   ├── route_planner.py               # Route calculation & optimization
│   ├── congestion_analyzer.py         # Traffic density analysis
│   └── test_routes.py
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pip install -r ../../requirements.txt
```

### 2. Download Pre-trained YOLOv8 Model

```bash
python vehicle_detection/yolo_model_trainer.py --download-pretrained
```

### 3. Configure Environment

Edit `.env` file with your settings:

```env
YOLO_MODEL_PATH=./module1_ambulance_traffic/vehicle_detection/models/best.pt
CONFIDENCE_THRESHOLD=0.5
CAMERA_SOURCE=0
MQTT_BROKER_URL=localhost
MQTT_BROKER_PORT=1883
GPS_DEVICE=/dev/ttyUSB0
```

### 4. Run the Ambulance Detection System

```bash
python -m module1_ambulance_traffic.vehicle_detection.ambulance_detector
```

---

## 🔧 Components

### Vehicle Detection (`vehicle_detection/`)

Detects ambulances using YOLOv8 real-time object detection.

**Key Features:**
- Live camera feed processing
- Ambulance classification with confidence threshold
- Bounding box tracking
- Performance optimization for edge devices

**Usage:**

```python
from module1_ambulance_traffic.vehicle_detection.ambulance_detector import AmbulanceDetector

detector = AmbulanceDetector(model_path="models/best.pt", confidence=0.5)
ambulances = detector.detect(frame)  # Returns list of ambulance objects
```

### GPS Tracking (`gps_tracking/`)

Tracks ambulance location in real-time using GPS/GSM modules.

**Key Features:**
- Serial communication with GPS module
- Real-time location updates
- GSM backup for areas with poor signal
- Coordinate validation and smoothing

**Usage:**

```python
from module1_ambulance_traffic.gps_tracking.gps_handler import GPSHandler

gps = GPSHandler(port="/dev/ttyUSB0", baudrate=9600)
location = gps.get_location()  # Returns (latitude, longitude, altitude)
```

### Traffic Signal Communication (`traffic_signal_communication/`)

Controls traffic signals via MQTT or Firebase.

**Key Features:**
- MQTT broker communication
- Firebase real-time database updates
- Signal state management
- Priority queue for multiple ambulances

**Usage:**

```python
from module1_ambulance_traffic.traffic_signal_communication.signal_controller import SignalController

controller = SignalController(broker_url="localhost", protocol="MQTT")
controller.set_green_priority(signal_id="SIGNAL_001", duration=120)
```

### Route Optimization (`route_optimization/`)

Calculates optimal hospital route considering traffic congestion.

**Key Features:**
- Google Maps / OpenStreetMap integration
- Real-time traffic data analysis
- Congestion prediction
- Multiple route suggestions

**Usage:**

```python
from module1_ambulance_traffic.route_optimization.route_planner import RoutePlanner

planner = RoutePlanner()
best_route = planner.find_optimal_route(
    start=(latitude, longitude),
    end=hospital_coords,
    avoid_congestion=True
)
```

---

## 📊 Data Flow

```
Camera Feed
    ↓
[YOLOv8 Detection] → Ambulance Found?
    ↓                        ↓ Yes
GPS Location              [Alert System]
    ↓                        ↓
[Real-time Tracking]    [Signal Controller]
    ↓                        ↓
Traffic Analysis      [MQTT/Firebase]
    ↓                        ↓
[Route Optimizer] ← Traffic Signals
    ↓
Best Hospital Route
```

---

## 🧪 Testing

Run unit tests:

```bash
pytest vehicle_detection/test_detection.py
pytest gps_tracking/test_gps.py
pytest traffic_signal_communication/test_signals.py
pytest route_optimization/test_routes.py
```

Run all tests:

```bash
pytest ../tests/test_module1*.py -v
```

---

## 🔌 Hardware Requirements

- **Camera Module:** USB webcam or CSI camera (Raspberry Pi)
- **GPS Module:** U-Blox, Neo-6M, or similar (UART interface)
- **GSM Module:** SIM800L or SIM7600 (backup location)
- **Microcontroller:** ESP32 or Raspberry Pi for traffic signal control
- **Networking:** WiFi or Ethernet for MQTT/Firebase connectivity

---

## ⚙️ Configuration

### YOLO Detection Settings

```python
detector_config = {
    "model_path": "models/best.pt",
    "confidence_threshold": 0.5,
    "iou_threshold": 0.4,
    "device": "cuda",  # or "cpu"
    "imgsz": 640
}
```

### GPS Configuration

```python
gps_config = {
    "port": "/dev/ttyUSB0",  # COM3 on Windows
    "baudrate": 9600,
    "timeout": 1,
    "update_interval": 5  # seconds
}
```

### MQTT Configuration

```python
mqtt_config = {
    "broker": "localhost",
    "port": 1883,
    "username": "admin",
    "password": "password",
    "keepalive": 60
}
```

---

## 📈 Performance Metrics

- **Detection Speed:** ~30-50ms per frame (GPU)
- **GPS Accuracy:** ±5-10 meters
- **Signal Response Time:** <2 seconds
- **Route Calculation:** <5 seconds for 10km radius

---

## 🐛 Troubleshooting

### Camera Not Detected
```bash
# Linux: Check connected cameras
ls /dev/video*

# Windows: Use Device Manager
```

### GPS Not Connecting
```bash
# Check serial ports
python -c "import serial.tools.list_ports; print([p for p in serial.tools.list_ports.comports()])"

# Test connection
python gps_tracking/test_gps.py
```

### MQTT Connection Failed
```bash
# Start MQTT broker
mosquitto -v

# Test connection
mosquitto_sub -h localhost -t "test"
```

---

## 🔄 Integration with Other Modules

- **Module 2:** V2V communication alerts ambulance presence to nearby vehicles
- **Backend:** Real-time data logging and route history
- **Frontend:** Dashboard displays ambulance location and ETA

---

## 📝 Next Steps

1. Train custom YOLOv8 model on ambulance dataset
2. Set up physical GPS/GSM modules
3. Configure local MQTT broker or Firebase account
4. Deploy on Raspberry Pi / Edge device
5. Test with mock ambulance routes

---

## 📚 References

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [PySerial GPS](https://pyserial.readthedocs.io/)
- [Paho MQTT](https://github.com/eclipse/paho.mqtt.python)
- [Firebase Python SDK](https://firebase.google.com/docs/database/admin/start-python)

---

**Last Updated:** November 11, 2025  
**Status:** 🟡 Development
