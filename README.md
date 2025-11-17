# 🚦 Smart Traffic Management & Hornless Vehicle Communication System

> An interdisciplinary AI + IoT project to revolutionize road safety and reduce noise pollution

**Developed by:** B.Tech CSE Students, Adamas University (2nd Year)  
**Repository:** [GitHub](https://github.com/Shounak-programmer/idp)  
**Status:** Active Development (Phase 1-2)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Modules](#modules)
- [Technology Stack](#technology-stack)
- [Team & Roles](#team--roles)
- [Timeline](#timeline)
- [Contributing](#contributing)

---

## 🌍 Overview

This project addresses two critical urban transportation problems:

1. **Ambulance Response Delays** - Thousands die annually due to traffic congestion blocking emergency vehicles
2. **Noise Pollution** - Constant honking damages health and quality of life

**Our Solution:** An integrated AI/IoT system combining:
- Real-time ambulance detection and traffic prioritization
- Silent, digital vehicle-to-vehicle communication
- Smart traffic signal automation
- Spatial audio alerts for drivers

---

## 📁 Project Structure

```
idp/
├── module1_ambulance_traffic/          # Module 1: Ambulance Priority System
│   ├── vehicle_detection/              # YOLOv8 ambulance detection
│   ├── gps_tracking/                   # GPS + GSM tracking system
│   ├── traffic_signal_communication/   # MQTT/Firebase signal control
│   └── README.md
│
├── module2_hornless_communication/     # Module 2: Silent Signaling System
│   ├── v2v_signaling/                  # Bluetooth/Ultrasonic/IR signaling
│   ├── spatial_audio/                  # 3D audio simulation
│   ├── radar_ui/                       # Radar-style UI alerts
│   └── README.md
│
├── shared/                             # Shared utilities & communication
│   ├── communication/                  # MQTT broker, message handlers
│   ├── config/                         # Configuration templates
│   └── utils/                          # Helper functions, logging
│
├── backend/                            # REST API & data handling
│   ├── api/                            # Flask/FastAPI routes
│   ├── database/                       # Database models & ORM
│   └── main.py
│
├── frontend/                           # Dashboard & UI
│   ├── dashboard/                      # Web dashboard
│   └── index.html
│
├── iot_firmware/                       # ESP32/Raspberry Pi firmware
│   ├── esp32_traffic_signal/           # Traffic signal controller code
│   ├── esp32_v2v_module/               # V2V communication module
│   └── config.h
│
├── tests/                              # Unit & integration tests
│   ├── test_vehicle_detection.py
│   ├── test_communication.py
│   └── test_api.py
│
├── docs/                               # Documentation
│   ├── SETUP.md                        # Setup guide
│   ├── API.md                          # API documentation
│   ├── ARCHITECTURE.md                 # System architecture
│   └── DEPLOYMENT.md                   # Deployment guide
│
├── requirements.txt                    # Python dependencies
├── .gitignore
├── .env.example                        # Environment variables template
└── docker-compose.yml                  # Docker setup
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip or conda
- Git
- (Optional) Docker & Docker Compose
- (Optional) MQTT Broker (Mosquitto)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shounak-programmer/idp.git
   cd idp
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the backend server**
   ```bash
   cd backend
   python main.py
   ```

6. **Access the dashboard**
   Open `http://localhost:5000` in your browser

---

## 🚑 Module 1: Ambulance Priority Traffic Management

**Goal:** Detect ambulances in real-time and automatically grant them traffic priority

### Components

- **Vehicle Detection** - YOLOv8 model for ambulance identification
- **GPS Tracking** - Real-time location tracking via GPS/GSM
- **Traffic Signal Communication** - MQTT/Firebase to control nearby signals
- **Route Optimization** - Calculate least congested hospital route

### Key Files

- `module1_ambulance_traffic/vehicle_detection/ambulance_detector.py`
- `module1_ambulance_traffic/gps_tracking/gps_handler.py`
- `module1_ambulance_traffic/traffic_signal_communication/signal_controller.py`

[Detailed Module 1 Documentation](./module1_ambulance_traffic/README.md)

---

## 🚗 Module 2: Smart Hornless Communication

**Goal:** Replace car horns with silent, digital V2V communication

### Components

- **V2V Signaling** - Bluetooth/Ultrasonic/IR vehicle-to-vehicle communication
- **Spatial Audio** - 3D sound simulation for driver alerts
- **Radar UI** - Visual alert system showing nearby vehicles
- **Signal Processing** - Python/MATLAB signal handling

### Key Files

- `module2_hornless_communication/v2v_signaling/communication_module.py`
- `module2_hornless_communication/spatial_audio/audio_simulator.py`
- `module2_hornless_communication/radar_ui/ui_handler.py`

[Detailed Module 2 Documentation](./module2_hornless_communication/README.md)

---

## 🛠️ Technology Stack

### Software

| Component | Technology |
|-----------|-----------|
| **AI/ML** | Python, YOLOv8, OpenCV |
| **IoT** | ESP32, Raspberry Pi, Arduino |
| **Communication** | MQTT (Mosquitto), Firebase, Bluetooth |
| **Backend** | Flask/FastAPI, PostgreSQL |
| **Frontend** | HTML5, CSS3, JavaScript, Chart.js |
| **Audio** | PyAudio, Spatial Audio Libraries |

### Hardware

- ESP32 microcontroller
- Raspberry Pi 4B
- GPS/GSM modules
- Ultrasonic sensors
- IR transceivers
- Bluetooth modules

---

## 👥 Team & Roles

| Role | Members | Responsibilities |
|------|---------|------------------|
| **Project Leads** | 2 | Coordination, integration, documentation |
| **Research & Innovation** | 2 | Literature review, feasibility studies |
| **AI & Computer Vision** | 3 | YOLO model training, vehicle detection |
| **IoT & Embedded Systems** | 3 | Hardware prototypes, firmware development |
| **Backend & Database** | 2 | REST API, data persistence |
| **UI/Audio & Visualization** | 1 | Dashboard, spatial audio, radar UI |

---

## 📅 Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1** | Week 1-2 | Project setup, research, documentation |
| **Phase 2** | Week 3-5 | AI model training, software simulation |
| **Phase 3** | Week 6-8 | IoT hardware prototyping, firmware |
| **Phase 4** | Week 9-10 | System integration, testing |
| **Phase 5** | Week 11 | Final documentation, presentation |

**Current Status:** Phase 1 - Repository Setup ✅

---

## 🔧 Development Workflow

### Local Development

```bash
# Start MQTT broker (if using Mosquitto)
mosquitto -v

# In another terminal, start backend
cd backend && python main.py

# In another terminal, run simulations
python -m module1_ambulance_traffic.vehicle_detection.ambulance_detector
```

### Docker Setup (Coming Soon)

```bash
docker-compose up
```

---

## 📝 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation instructions
- **[API Documentation](./docs/API.md)** - REST API endpoints
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and diagrams
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Module 1 README](./module1_ambulance_traffic/README.md)**
- **[Module 2 README](./module2_hornless_communication/README.md)**

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📞 Contact & Support

- **Project Mentor:** Shiplu Sir
- **Lead Coordinator:** Shounak Chatterjee 
- **Email:**
- **GitHub Issues:** [Report bugs and request features](https://github.com/Shounak-programmer/idp/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Adamas University for support and resources
- Open-source communities (YOLOv8, OpenCV, etc.)
- All team members for their dedication

---

**Last Updated:** November 17, 2025  
**Status:** 🟢 Active Development
