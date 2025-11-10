"""
Main entry point for the IDP Backend Server.
"""

import os
import sys
import logging

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from shared.config.config import get_config
from shared.config.logging_config import setup_logging, get_logger

# Setup logging
config = get_config()
setup_logging(
    log_level=config.LOG_LEVEL,
    log_file=config.LOG_FILE
)
logger = get_logger(__name__)


def main():
    """Main entry point for the application."""
    
    logger.info("=" * 80)
    logger.info("IDP Backend Server Starting")
    logger.info("=" * 80)
    
    # Create Flask app
    app = create_app(config_name=os.getenv('FLASK_ENV', 'development'))
    
    # Log startup info
    logger.info(f"Environment: {config.FLASK_ENV}")
    logger.info(f"Debug Mode: {config.FLASK_DEBUG}")
    logger.info(f"Database: {config.DATABASE_URL}")
    logger.info(f"MQTT Broker: {config.MQTT_BROKER_URL}:{config.MQTT_BROKER_PORT}")
    
    # Run the application
    try:
        logger.info(f"Starting server on {config.API_HOST}:{config.API_PORT}")
        app.run(
            host=config.API_HOST,
            port=config.API_PORT,
            debug=config.FLASK_DEBUG,
            use_reloader=True if config.FLASK_DEBUG else False
        )
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
