"""
Base Flask application factory for the IDP project.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path
import logging

from shared.config.config import get_config
from shared.config.logging_config import setup_logging


def create_app(config_name: str = 'development') -> Flask:
    """
    Application factory for Flask app.
    
    Args:
        config_name: Configuration environment name
        
    Returns:
        Flask application instance
    """
    
    # Initialize Flask app
    app = Flask(__name__, instance_relative_config=True)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Setup logging
    setup_logging(
        log_level=config.LOG_LEVEL,
        log_file=config.LOG_FILE
    )
    
    logger = logging.getLogger(__name__)
    logger.info(f"Creating Flask app with {config_name} configuration")
    
    # Enable CORS
    CORS(app, origins=config.CORS_ORIGINS)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({
            'status': 'healthy',
            'environment': config.FLASK_ENV
        }), 200
    
    # Register API blueprints (will be imported in backend/main.py)
    
    logger.info("Flask app created successfully")
    return app


def register_error_handlers(app: Flask) -> None:
    """
    Register error handlers for common HTTP errors.
    
    Args:
        app: Flask application instance
    """
    logger = logging.getLogger(__name__)
    
    @app.errorhandler(400)
    def bad_request(error):
        logger.warning(f"Bad request error: {error}")
        return jsonify({
            'error': 'Bad Request',
            'message': str(error)
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        logger.warning(f"Resource not found: {error}")
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500


if __name__ == '__main__':
    app = create_app('development')
    app.run(host='0.0.0.0', port=5000, debug=True)
