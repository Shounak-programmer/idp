"""
Shared configuration management for the IDP project.
Handles environment variables, API keys, and system settings.
"""

import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import yaml
import json
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class Config:
    """Base configuration class for all settings."""
    
    # Database Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/idp_db')
    MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/idp')
    DATABASE_DEBUG = os.getenv('DATABASE_DEBUG', 'False').lower() == 'true'
    
    # Flask/API Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 5000))
    API_SECRET_KEY = os.getenv('API_SECRET_KEY', 'dev-secret-key-change-in-production')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5000').split(',')
    
    # MQTT Configuration
    MQTT_BROKER_URL = os.getenv('MQTT_BROKER_URL', 'localhost')
    MQTT_BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT', 1883))
    MQTT_USERNAME = os.getenv('MQTT_USERNAME', 'admin')
    MQTT_PASSWORD = os.getenv('MQTT_PASSWORD', 'password')
    MQTT_KEEPALIVE = int(os.getenv('MQTT_KEEPALIVE', 60))
    
    # Firebase Configuration
    FIREBASE_CONFIG_PATH = os.getenv('FIREBASE_CONFIG_PATH', './shared/config/firebase_config.json')
    FIREBASE_DB_URL = os.getenv('FIREBASE_DB_URL', '')
    
    # GPS Configuration
    GPS_DEVICE = os.getenv('GPS_DEVICE', '/dev/ttyUSB0')
    GPS_BAUDRATE = int(os.getenv('GPS_BAUDRATE', 9600))
    GSM_MODULE_ENABLED = os.getenv('GSM_MODULE_ENABLED', 'True').lower() == 'true'
    LOCATION_UPDATE_INTERVAL = int(os.getenv('LOCATION_UPDATE_INTERVAL', 5))
    
    # Google Maps Configuration
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')
    OPENSTREETMAP_ENABLED = os.getenv('OPENSTREETMAP_ENABLED', 'True').lower() == 'true'
    ROUTE_OPTIMIZATION_ENABLED = os.getenv('ROUTE_OPTIMIZATION_ENABLED', 'True').lower() == 'true'
    
    # YOLOv8 Configuration
    YOLO_MODEL_PATH = os.getenv('YOLO_MODEL_PATH', './module1_ambulance_traffic/vehicle_detection/models/best.pt')
    CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', 0.5))
    CAMERA_SOURCE = os.getenv('CAMERA_SOURCE', '0')
    DETECTION_FPS = int(os.getenv('DETECTION_FPS', 30))
    
    # Traffic Signal Configuration
    SIGNAL_DETECTION_RADIUS_KM = int(os.getenv('SIGNAL_DETECTION_RADIUS_KM', 10))
    SIGNAL_PRIORITY_DURATION_SECONDS = int(os.getenv('SIGNAL_PRIORITY_DURATION_SECONDS', 120))
    SIGNAL_CONTROL_PROTOCOL = os.getenv('SIGNAL_CONTROL_PROTOCOL', 'MQTT')  # MQTT or FIREBASE
    
    # V2V Communication Configuration
    V2V_COMMUNICATION_TYPE = os.getenv('V2V_COMMUNICATION_TYPE', 'BLUETOOTH')
    V2V_BROADCAST_POWER = os.getenv('V2V_BROADCAST_POWER', 'HIGH')
    V2V_RANGE_METERS = int(os.getenv('V2V_RANGE_METERS', 50))
    
    # Audio Configuration
    SPATIAL_AUDIO_ENABLED = os.getenv('SPATIAL_AUDIO_ENABLED', 'True').lower() == 'true'
    AUDIO_OUTPUT_DEVICE = os.getenv('AUDIO_OUTPUT_DEVICE', 'default')
    
    # Hardware Configuration
    ESP32_PORT = os.getenv('ESP32_PORT', '/dev/ttyUSB0')
    ESP32_BAUDRATE = int(os.getenv('ESP32_BAUDRATE', 115200))
    RASPBERRY_PI_IP = os.getenv('RASPBERRY_PI_IP', '192.168.1.100')
    
    # Testing Configuration
    SIMULATION_MODE = os.getenv('SIMULATION_MODE', 'False').lower() == 'true'
    MOCK_GPS_DATA = os.getenv('MOCK_GPS_DATA', 'False').lower() == 'true'
    MOCK_CAMERA_FEED = os.getenv('MOCK_CAMERA_FEED', 'False').lower() == 'true'
    TEST_DATABASE_URL = os.getenv('TEST_DATABASE_URL', 'sqlite:///test.db')
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', './logs/app.log')
    
    # Performance Configuration
    ENABLE_PERFORMANCE_MONITORING = os.getenv('ENABLE_PERFORMANCE_MONITORING', 'True').lower() == 'true'
    PROFILING_ENABLED = os.getenv('PROFILING_ENABLED', 'False').lower() == 'true'
    MAX_CONCURRENT_DETECTIONS = int(os.getenv('MAX_CONCURRENT_DETECTIONS', 5))
    BATCH_PROCESSING = os.getenv('BATCH_PROCESSING', 'True').lower() == 'true'
    BATCH_SIZE = int(os.getenv('BATCH_SIZE', 32))
    
    # Security Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))
    ENABLE_HTTPS = os.getenv('ENABLE_HTTPS', 'False').lower() == 'true'


class DevelopmentConfig(Config):
    """Development-specific configuration."""
    DEBUG = True
    TESTING = False
    FLASK_ENV = 'development'


class ProductionConfig(Config):
    """Production-specific configuration."""
    DEBUG = False
    TESTING = False
    FLASK_ENV = 'production'
    ENABLE_HTTPS = True


class TestingConfig(Config):
    """Testing-specific configuration."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SIMULATION_MODE = True
    MOCK_GPS_DATA = True
    MOCK_CAMERA_FEED = True


def get_config(env: Optional[str] = None) -> Config:
    """
    Get configuration object based on environment.
    
    Args:
        env: Environment name ('development', 'production', 'testing')
        
    Returns:
        Configuration object
    """
    env = env or os.getenv('FLASK_ENV', 'development')
    
    configs = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    
    config_class = configs.get(env.lower(), DevelopmentConfig)
    logger.info(f"Loaded {env} configuration")
    return config_class


# Export default config
config = get_config()
