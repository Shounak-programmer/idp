# 🎯 Quick Start Guide

## Project Overview

You now have a fully structured **Smart Traffic Management & Hornless Vehicle Communication System** repository with:

✅ **Complete folder hierarchy** organized by modules  
✅ **Core configuration management** system  
✅ **MQTT communication handler** for IoT integration  
✅ **Flask backend boilerplate** ready for API development  
✅ **Comprehensive documentation** for all components  
✅ **Test framework** with pytest setup  
✅ **Environment configuration** templates  

---

## 🚀 Getting Started (5 Minutes)

### 1. Install Dependencies
```bash
# Install Python packages
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (MQTT broker, APIs, etc.)
# On Windows: notepad .env
# On Linux/Mac: nano .env
```

### 3. Start Backend Server
```bash
cd backend
python main.py
```

The server will start at `http://localhost:5000`

### 4. Verify Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "development"
}
```

---

## 📁 What's Included

### Module 1: Ambulance Traffic Management 🚑
- YOLOv8 vehicle detection framework
- GPS/GSM location tracking interface
- MQTT traffic signal control system
- Route optimization utilities
- Ready for integration with traffic databases

### Module 2: Hornless Communication 🚗
- V2V signaling framework (Bluetooth/Ultrasonic/IR)
- Spatial audio 3D simulation engine
- Radar-style UI visualization
- Signal processing utilities

### Shared Infrastructure 🔗
- **Configuration Management** - Centralized settings for all modules
- **MQTT Handler** - Pub/Sub communication with MQTT broker
- **Logging System** - Structured logging with file rotation
- **Base Flask App** - Pre-configured Flask application factory

### Backend & Database 🖥️
- REST API boilerplate
- Database models framework (SQLAlchemy)
- API route structure
- Health check endpoint

### Testing Framework 🧪
- Pytest configuration
- MQTT handler unit tests
- Test utilities and fixtures

### Documentation 📚
- Complete README with project overview
- API documentation template
- Setup and installation guide
- Architecture design guide
- Module-specific READMEs

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `/README.md` | Main project overview |
| `/docs/SETUP.md` | Detailed installation instructions |
| `/docs/API.md` | REST API endpoints (template) |
| `/docs/ARCHITECTURE.md` | System design and diagrams |
| `/docs/PROJECT_STRUCTURE.md` | Complete folder structure guide |
| `/module1_ambulance_traffic/README.md` | Module 1 details |
| `/module2_hornless_communication/README.md` | Module 2 details |

---

## 🔧 Key Configuration Files

### `.env` - Environment Variables
Copy from `.env.example` and customize:
- MQTT broker settings
- Database URLs
- API keys (Google Maps, Firebase)
- Hardware ports
- Logging configuration

### `requirements.txt` - Python Dependencies
Pre-configured with essential packages:
- **AI/ML:** YOLOv8, OpenCV, scikit-learn
- **IoT:** MQTT (paho), Firebase
- **Audio:** librosa, PyAudio
- **Web:** Flask, FastAPI, SQLAlchemy
- **Testing:** pytest, unittest.mock

---

## 🏗️ Project Architecture

```
                    ┌─────────────────┐
                    │   Dashboard     │
                    │   (Frontend)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐      ┌─────▼─────┐
   │ Module 1 │      │   Backend   │      │ Module 2  │
   │ Ambulance│      │   REST API  │      │Hornless   │
   │ Traffic  │      │             │      │Comm       │
   └────┬─────┘      └──────┬──────┘      └─────┬─────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   MQTT Broker   │
                    │   Firebase      │
                    └─────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐      ┌─────▼─────┐
   │  Traffic │      │  Vehicles   │      │ Ambulances│
   │  Signals │      │  Receivers  │      │(GPS/GSM)  │
   └──────────┘      └─────────────┘      └───────────┘
```

---

## 🧪 Running Tests

### Install pytest (if not already installed)
```bash
pip install pytest pytest-cov
```

### Run all tests
```bash
pytest tests/
```

### Run specific test file
```bash
pytest tests/test_mqtt.py -v
```

### Generate coverage report
```bash
pytest tests/ --cov=. --cov-report=html
```

---

## 🔌 MQTT Communication Ready

The project includes a fully-featured MQTT handler:

```python
from shared.communication.mqtt_handler import get_mqtt_handler

# Get or create MQTT handler
mqtt = get_mqtt_handler(
    broker_url="localhost",
    broker_port=1883,
    client_id="ambulance_tracker"
)

# Connect
mqtt.connect()

# Subscribe to ambulance alerts
mqtt.subscribe("ambulance/+/location", my_handler_function)

# Publish traffic signal command
mqtt.publish("traffic/signal/001", {
    "action": "set_green",
    "duration": 120
})
```

---

## 🐛 Troubleshooting

### Module Import Errors
Make sure you're in the correct directory:
```bash
cd d:\Programs\Projects\idp\idp
```

### Flask Server Won't Start
Check that port 5000 is available:
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### MQTT Connection Failed
Ensure MQTT broker is running:
```bash
# Using Mosquitto (Windows)
mosquitto

# Using Mosquitto (Linux)
sudo systemctl start mosquitto
```

---

## 📋 Next Steps

1. **Configure Services**
   - Set up MQTT broker (Mosquitto)
   - Configure Firebase (optional)
   - Set up PostgreSQL database

2. **Develop Module 1**
   - Train YOLOv8 model on ambulance dataset
   - Implement GPS location tracking
   - Create traffic signal communication

3. **Develop Module 2**
   - Choose V2V protocol (Bluetooth/Ultrasonic/IR)
   - Implement spatial audio engine
   - Create radar UI visualization

4. **Backend Development**
   - Create REST API endpoints
   - Implement database models
   - Add authentication (JWT tokens)

5. **Testing & Deployment**
   - Write comprehensive tests
   - Deploy on Raspberry Pi / Edge device
   - Create Docker containerization

---

## 📞 Support & Resources

- **GitHub Repository:** https://github.com/Shounak-programmer/idp
- **Issues & Discussions:** Use GitHub Issues for bug reports
- **Documentation:** See `/docs/` folder
- **Hardware Setup:** See `/docs/guides/hardware_setup.md`

---

## 🎓 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Project Setup | ✅ Complete | Full directory structure created |
| Config Management | ✅ Complete | Centralized configuration system |
| MQTT Handler | ✅ Complete | Fully tested pub/sub system |
| Flask Backend | ✅ Boilerplate | Ready for API route development |
| Module 1 | 🟡 Framework | Ready for implementation |
| Module 2 | 🟡 Framework | Ready for implementation |
| Frontend | 🟡 Template | HTML/CSS structure ready |
| Tests | ✅ Framework | Pytest configured with examples |
| Documentation | ✅ Complete | All guides provided |

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0 - Initial Setup Complete
