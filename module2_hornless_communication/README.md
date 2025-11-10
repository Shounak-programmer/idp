# 🚗 Module 2: Smart Hornless Communication System

**Objective:** Replace traditional car horns with a silent, digital vehicle-to-vehicle (V2V) signaling system that reduces noise pollution while enhancing driver awareness.

---

## 📋 Overview

This module implements a **silent, non-audible signaling system** with:

1. **V2V Communication** - Digital alerts via Bluetooth/Ultrasonic/IR
2. **Radar-style UI** - Visual representation of nearby vehicles
3. **Spatial Audio** - 3D directional sound cues (optional)
4. **Signal Processing** - Real-time signal detection and analysis

---

## 📁 Folder Structure

```
module2_hornless_communication/
├── v2v_signaling/
│   ├── communication_module.py        # Core V2V communication
│   ├── bluetooth_handler.py           # Bluetooth transceiver
│   ├── ultrasonic_handler.py          # Ultrasonic sensor interface
│   ├── ir_handler.py                  # Infrared signal handler
│   ├── signal_processor.py            # Signal processing & decoding
│   └── test_v2v.py
│
├── spatial_audio/
│   ├── audio_simulator.py             # 3D spatial audio engine
│   ├── audio_synthesis.py             # Audio waveform generation
│   ├── hrtf_processor.py              # Head-Related Transfer Function
│   └── test_audio.py
│
├── radar_ui/
│   ├── ui_handler.py                  # Radar display handler
│   ├── vehicle_mapper.py              # Vehicle position mapping
│   ├── alert_visualizer.py            # Alert visualization
│   ├── dashboard.html                 # Web-based radar UI
│   └── test_ui.py
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pip install -r ../../requirements.txt
```

### 2. Configure Environment

Edit `.env` file:

```env
V2V_COMMUNICATION_TYPE=BLUETOOTH
V2V_RANGE_METERS=50
SPATIAL_AUDIO_ENABLED=True
AUDIO_OUTPUT_DEVICE=default
```

### 3. Run V2V Communication System

```bash
python -m module2_hornless_communication.v2v_signaling.communication_module
```

### 4. View Radar Dashboard

```bash
python -m module2_hornless_communication.radar_ui.ui_handler
# Open http://localhost:5001 in browser
```

---

## 🔧 Components

### V2V Signaling (`v2v_signaling/`)

Handles vehicle-to-vehicle digital communication.

**Supported Protocols:**

1. **Bluetooth Low Energy (BLE)**
   - Range: 10-100 meters
   - Power efficient
   - Best for urban areas

2. **Ultrasonic**
   - Range: 5-10 meters
   - Works through obstacles
   - Directional sensing

3. **Infrared (IR)**
   - Range: 5-20 meters
   - Line-of-sight only
   - Fast response

**Usage:**

```python
from module2_hornless_communication.v2v_signaling.communication_module import V2VCommunication

# Initialize with Bluetooth
v2v = V2VCommunication(protocol="BLUETOOTH")

# Send horn alert
v2v.send_alert(
    alert_type="HORN",
    direction="FRONT_LEFT",
    urgency="HIGH",
    vehicle_id="VEH_001"
)

# Receive nearby vehicle alerts
nearby_vehicles = v2v.get_nearby_vehicles()
```

**Signal Structure:**

```
Signal Frame:
[HEADER(1B)] [VEHICLE_ID(4B)] [ALERT_TYPE(1B)] [DIRECTION(1B)] [URGENCY(1B)] [CRC(2B)]
```

### Spatial Audio (`spatial_audio/`)

Generates 3D directional audio cues for driver alerts.

**Features:**
- Head-Related Transfer Function (HRTF) processing
- Real-time binaural audio synthesis
- Customizable audio profiles
- Optional feature (can be disabled for silent mode)

**Usage:**

```python
from module2_hornless_communication.spatial_audio.audio_simulator import SpatialAudioSimulator

audio = SpatialAudioSimulator(sample_rate=44100)

# Generate 3D honk from front-left
audio_signal = audio.generate_honk(
    direction=(45, 0),  # azimuth, elevation in degrees
    duration=0.5,       # seconds
    frequency=800       # Hz
)

# Play the audio
audio.play(audio_signal)
```

### Radar UI (`radar_ui/`)

Displays nearby vehicles in a radar-style interface.

**Features:**
- Real-time vehicle position tracking
- Direction and distance visualization
- Alert color coding
- Interactive dashboard

**HTML-based Radar:**

```html
<!-- Located at radar_ui/dashboard.html -->
<!-- Displays vehicle positions in real-time using Canvas/SVG -->
```

**Python Interface:**

```python
from module2_hornless_communication.radar_ui.ui_handler import RadarUIHandler

ui = RadarUIHandler(port=5001)
ui.update_vehicle(
    vehicle_id="VEH_002",
    direction=45,      # degrees from north
    distance=25,       # meters
    alert_type="HORN"
)
ui.run()  # Start web server
```

---

## 📊 System Architecture

```
Driver Presses Horn Button
    ↓
[V2V Signaling Module]
    ├─→ Bluetooth/Ultrasonic/IR Transmission
    ├─→ Signal Processing & Encoding
    └─→ Send to Nearby Vehicles
        ↓
    [Receiving Vehicles]
        ├─→ Signal Decoding
        ├─→ Direction Calculation
        ├─→ Spatial Audio Generation (if enabled)
        └─→ Radar UI Update
            ├─→ Display vehicle direction
            ├─→ Flash alert indicator
            └─→ Sound alert (optional)
```

---

## 📡 Signal Communication Protocol

### Alert Types

```python
ALERT_TYPES = {
    "HORN": 0x01,         # General horn
    "BRAKE": 0x02,        # Emergency braking
    "LANE_CHANGE": 0x03,  # Lane change warning
    "EMERGENCY": 0x04,    # Emergency vehicle
    "PARKING": 0x05,      # Parking alert
}

DIRECTIONS = {
    "FRONT": 0x00,
    "FRONT_LEFT": 0x01,
    "LEFT": 0x02,
    "REAR_LEFT": 0x03,
    "REAR": 0x04,
    "REAR_RIGHT": 0x05,
    "RIGHT": 0x06,
    "FRONT_RIGHT": 0x07,
}

URGENCY_LEVELS = {
    "LOW": 0x00,
    "MEDIUM": 0x01,
    "HIGH": 0x02,
    "CRITICAL": 0x03,
}
```

---

## 🔧 Configuration

### Bluetooth Configuration

```python
bluetooth_config = {
    "service_uuid": "12345678-1234-5678-1234-567812345678",
    "characteristic_uuid": "12345678-1234-5678-1234-567812345679",
    "tx_power": "HIGH",  # or "MEDIUM", "LOW"
    "range_meters": 50
}
```

### Ultrasonic Configuration

```python
ultrasonic_config = {
    "frequency": 40000,  # Hz (above human hearing)
    "gpio_trigger": 23,
    "gpio_echo": 24,
    "speed_of_sound": 343  # m/s at 20°C
}
```

### Spatial Audio Configuration

```python
audio_config = {
    "sample_rate": 44100,      # Hz
    "channels": 2,              # Stereo
    "bit_depth": 16,            # bits
    "hrtf_profile": "default",  # or custom HRTF file
    "output_device": "default"
}
```

---

## 🧪 Testing

Run unit tests:

```bash
pytest v2v_signaling/test_v2v.py
pytest spatial_audio/test_audio.py
pytest radar_ui/test_ui.py
```

Run all tests:

```bash
pytest ../tests/test_module2*.py -v
```

---

## 🔌 Hardware Requirements

### For Bluetooth V2V
- ESP32 or Arduino with Bluetooth module
- BLE chip (e.g., nRF51822)

### For Ultrasonic V2V
- 40 kHz ultrasonic transducers (emitter & receiver)
- GPIO-capable microcontroller (ESP32, Arduino)

### For Spatial Audio
- Stereo speakers or headphones
- Audio output interface
- Quality DAC (optional for high-fidelity)

---

## 📈 Performance Metrics

- **Communication Latency:** <100ms
- **Detection Range (Bluetooth):** 10-100m
- **Detection Range (Ultrasonic):** 5-10m
- **Audio Latency:** <50ms (with spatial processing)
- **UI Refresh Rate:** 30 FPS

---

## 🐛 Troubleshooting

### Bluetooth Module Not Found
```python
# Scan for available Bluetooth devices
python -c "from bluetooth import discover_devices; print(discover_devices())"
```

### Ultrasonic Not Detecting
```bash
# Test GPIO pins
python -m module2_hornless_communication.v2v_signaling.ultrasonic_handler --test
```

### Audio Playback Issues
```bash
# List available audio devices
python -c "import pyaudio; p = pyaudio.PyAudio(); [print(p.get_device_info_by_index(i)) for i in range(p.get_device_count())]"
```

---

## 🔄 Integration with Other Modules

- **Module 1:** Ambulances transmit emergency alerts via V2V to warn nearby vehicles
- **Backend:** Logs all V2V communication events
- **Frontend:** Displays V2V statistics and communication heatmap

---

## 📝 Next Steps

1. Choose primary V2V protocol (Bluetooth/Ultrasonic/IR)
2. Test signal range and reliability
3. Implement spatial audio with HRTF
4. Deploy on vehicle hardware
5. User testing with real drivers

---

## 📚 References

- [Bluetooth LE Specification](https://www.bluetooth.com/specifications/specs/)
- [PyAudio Documentation](https://people.csail.mit.edu/hubert/pyaudio/)
- [HRTF Processing](https://en.wikipedia.org/wiki/Head-related_transfer_function)
- [Ultrasonic Communication](https://en.wikipedia.org/wiki/Ultrasound)

---

**Last Updated:** November 11, 2025  
**Status:** 🟡 Development
