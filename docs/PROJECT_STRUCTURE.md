# 📁 Project Structure Guide

## Complete Directory Tree

```
idp/
│
├── 📄 README.md                                    # Main project documentation
├── 📄 requirements.txt                             # Python dependencies
├── 📄 setup.py                                     # Project initialization script
├── 📄 .env.example                                 # Environment variables template
├── 📄 .gitignore                                   # Git ignore rules
├── 📄 docker-compose.yml                           # Docker orchestration (optional)
├── 📄 LICENSE                                      # MIT License
│
├── 📂 module1_ambulance_traffic/                   # 🚑 AMBULANCE PRIORITY SYSTEM
│   ├── 📄 README.md
│   ├── 📂 vehicle_detection/                       # YOLOv8 Detection
│   │   ├── 📄 __init__.py
│   │   ├── 📄 ambulance_detector.py               # Core detection module
│   │   ├── 📄 yolo_model_trainer.py               # YOLO training script
│   │   ├── 📄 test_detection.py                   # Unit tests
│   │   └── 📂 models/
│   │       └── 📄 best.pt                         # Trained YOLOv8 weights
│   │
│   ├── 📂 gps_tracking/                           # GPS/GSM Location
│   │   ├── 📄 __init__.py
│   │   ├── 📄 gps_handler.py                      # GPS module interface
│   │   ├── 📄 location_updater.py                 # Real-time updates
│   │   └── 📄 test_gps.py                         # Unit tests
│   │
│   ├── 📂 traffic_signal_communication/           # Signal Control
│   │   ├── 📄 __init__.py
│   │   ├── 📄 signal_controller.py                # Signal control logic
│   │   ├── 📄 mqtt_handler.py                     # MQTT communication
│   │   ├── 📄 firebase_handler.py                 # Firebase communication
│   │   └── 📄 test_signals.py                     # Unit tests
│   │
│   └── 📂 route_optimization/                     # Route Planning
│       ├── 📄 route_planner.py                    # Route calculation
│       ├── 📄 congestion_analyzer.py              # Traffic analysis
│       └── 📄 test_routes.py                      # Unit tests
│
├── 📂 module2_hornless_communication/              # 🚗 HORNLESS SIGNALING SYSTEM
│   ├── 📄 README.md
│   ├── 📂 v2v_signaling/                          # Vehicle-to-Vehicle Communication
│   │   ├── 📄 __init__.py
│   │   ├── 📄 communication_module.py             # Core V2V logic
│   │   ├── 📄 bluetooth_handler.py                # Bluetooth transceiver
│   │   ├── 📄 ultrasonic_handler.py               # Ultrasonic sensors
│   │   ├── 📄 ir_handler.py                       # Infrared signals
│   │   ├── 📄 signal_processor.py                 # Signal processing
│   │   └── 📄 test_v2v.py                         # Unit tests
│   │
│   ├── 📂 spatial_audio/                          # 3D Audio Simulation
│   │   ├── 📄 __init__.py
│   │   ├── 📄 audio_simulator.py                  # Main audio engine
│   │   ├── 📄 audio_synthesis.py                  # Audio generation
│   │   ├── 📄 hrtf_processor.py                   # Head-Related Transfer Function
│   │   └── 📄 test_audio.py                       # Unit tests
│   │
│   ├── 📂 radar_ui/                               # Radar Display
│   │   ├── 📄 __init__.py
│   │   ├── 📄 ui_handler.py                       # UI handler logic
│   │   ├── 📄 vehicle_mapper.py                   # Position mapping
│   │   ├── 📄 alert_visualizer.py                 # Alert visualization
│   │   ├── 📄 dashboard.html                      # Web-based radar
│   │   └── 📄 test_ui.py                          # Unit tests
│   │
│   └── 📄 __init__.py
│
├── 📂 shared/                                      # 🔗 SHARED UTILITIES
│   ├── 📄 __init__.py
│   │
│   ├── 📂 config/                                 # Configuration Management
│   │   ├── 📄 __init__.py
│   │   ├── 📄 config.py                           # Configuration classes
│   │   └── 📄 logging_config.py                   # Logging setup
│   │
│   ├── 📂 communication/                          # Communication Protocols
│   │   ├── 📄 __init__.py
│   │   ├── 📄 mqtt_handler.py                     # MQTT client handler
│   │   └── 📄 firebase_handler.py                 # Firebase client (optional)
│   │
│   └── 📂 utils/                                  # Utility Functions
│       ├── 📄 __init__.py
│       ├── 📄 logger.py                           # Logging utilities
│       ├── 📄 validators.py                       # Data validation
│       └── 📄 helpers.py                          # Helper functions
│
├── 📂 backend/                                     # 🖥️ REST API & DATA HANDLING
│   ├── 📄 __init__.py
│   ├── 📄 app.py                                  # Flask app factory
│   ├── 📄 main.py                                 # Server entry point
│   │
│   ├── 📂 api/                                    # API Routes
│   │   ├── 📄 __init__.py
│   │   ├── 📄 ambulance_routes.py                 # Ambulance endpoints
│   │   ├── 📄 signal_routes.py                    # Traffic signal endpoints
│   │   ├── 📄 vehicle_routes.py                   # Vehicle endpoints
│   │   └── 📄 dashboard_routes.py                 # Dashboard data endpoints
│   │
│   └── 📂 database/                               # Database Models & ORM
│       ├── 📄 __init__.py
│       ├── 📄 models.py                           # SQLAlchemy models
│       ├── 📄 db.py                               # Database initialization
│       └── 📄 migrations.py                       # Database migrations
│
├── 📂 frontend/                                    # 🎨 WEB DASHBOARD
│   ├── 📄 __init__.py
│   ├── 📄 index.html                              # Main dashboard
│   ├── 📂 dashboard/
│   │   ├── 📄 style.css                           # Dashboard styles
│   │   ├── 📄 script.js                           # Dashboard JavaScript
│   │   └── 📄 charts.js                           # Chart visualization
│   │
│   └── 📂 assets/
│       ├── 📂 images/
│       ├── 📂 icons/
│       └── 📂 fonts/
│
├── 📂 iot_firmware/                                # ⚙️ EMBEDDED SYSTEMS CODE
│   ├── 📄 __init__.py
│   ├── 📂 esp32_traffic_signal/
│   │   ├── 📄 traffic_signal_controller.ino       # ESP32 traffic controller
│   │   ├── 📄 config.h                            # Hardware config
│   │   └── 📄 mqtt_config.h                       # MQTT config
│   │
│   ├── 📂 esp32_v2v_module/
│   │   ├── 📄 v2v_transceiver.ino                 # V2V communication
│   │   ├── 📄 bluetooth_handler.h                 # Bluetooth config
│   │   └── 📄 signal_processor.h                  # Signal processing
│   │
│   └── 📂 raspberry_pi/
│       ├── 📄 main.py                             # RPi main script
│       └── 📄 setup.sh                            # RPi setup script
│
├── 📂 tests/                                       # 🧪 UNIT & INTEGRATION TESTS
│   ├── 📄 __init__.py
│   ├── 📄 test_mqtt.py                            # MQTT handler tests
│   ├── 📄 test_module1.py                         # Module 1 integration tests
│   ├── 📄 test_module2.py                         # Module 2 integration tests
│   ├── 📄 test_api.py                             # API endpoint tests
│   └── 📄 conftest.py                             # Pytest configuration
│
├── 📂 docs/                                        # 📚 DOCUMENTATION
│   ├── 📄 SETUP.md                                # Installation & setup guide
│   ├── 📄 API.md                                  # REST API documentation
│   ├── 📄 ARCHITECTURE.md                         # System architecture
│   ├── 📄 DEPLOYMENT.md                           # Production deployment
│   ├── 📄 CONTRIBUTING.md                         # Contribution guidelines
│   │
│   ├── 📂 guides/
│   │   ├── 📄 yolo_training.md                    # YOLOv8 training guide
│   │   ├── 📄 mqtt_setup.md                       # MQTT broker setup
│   │   ├── 📄 hardware_setup.md                   # Hardware integration
│   │   └── 📄 troubleshooting.md                  # Troubleshooting guide
│   │
│   └── 📂 diagrams/
│       ├── 📄 system_architecture.png
│       ├── 📄 data_flow.png
│       └── 📄 module_interaction.png
│
└── 📂 logs/                                        # 📝 APPLICATION LOGS (gitignored)
    ├── 📄 app.log
    └── 📄 app.log.1, .2, ...
```

---

## 📊 Module Organization

### Module 1: Ambulance Traffic Management
```
Responsibilities:
├── Real-time ambulance detection (YOLOv8)
├── GPS location tracking
├── Traffic signal prioritization
├── Route optimization
└── Hospital coordination
```

### Module 2: Hornless Communication
```
Responsibilities:
├── V2V digital signaling (Bluetooth/Ultrasonic/IR)
├── Spatial 3D audio generation
├── Radar-style UI visualization
└── Signal processing & decoding
```

### Shared Resources
```
Responsibilities:
├── Configuration management
├── MQTT communication
├── Firebase integration
├── Logging & monitoring
└── Utility functions
```

---

## 🔄 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Core modules | `<noun>.py` | `gps_handler.py`, `signal_controller.py` |
| Test files | `test_<module>.py` | `test_detection.py`, `test_mqtt.py` |
| Configuration | `<name>_config.py` | `logging_config.py`, `mqtt_config.h` |
| Handlers | `<protocol>_handler.py` | `mqtt_handler.py`, `bluetooth_handler.py` |
| Arduino/ESP32 | `<function>.ino` | `traffic_signal_controller.ino` |
| HTML/CSS/JS | Standard | `index.html`, `style.css`, `script.js` |

---

## 📦 Dependencies by Module

| Module | Key Dependencies |
|--------|------------------|
| **Module 1** | ultralytics, opencv-python, pyserial, paho-mqtt |
| **Module 2** | librosa, soundfile, pyaudio, paho-mqtt |
| **Backend** | flask, sqlalchemy, psycopg2, firebase-admin |
| **Tests** | pytest, unittest.mock, coverage |
| **Hardware** | CircuitPython, Arduino IDE (for IoT firmware) |

---

## 🚀 Quick Navigation

- **Start Here:** `/README.md`
- **Setup Guide:** `/docs/SETUP.md`
- **API Docs:** `/docs/API.md`
- **Run Backend:** `python backend/main.py`
- **Run Tests:** `pytest tests/`
- **Configuration:** `.env` file (copy from `.env.example`)

---

**Last Updated:** November 11, 2025
