"""
Logging configuration for the IDP project.
Sets up structured logging with file and console handlers.
"""

import logging
import logging.handlers
import os
from pathlib import Path
from datetime import datetime


def setup_logging(
    log_level: str = 'INFO',
    log_file: str = './logs/app.log',
    log_max_bytes: int = 10485760,  # 10MB
    log_backup_count: int = 5
) -> None:
    """
    Configure logging for the application.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Path to log file
        log_max_bytes: Maximum log file size before rotation
        log_backup_count: Number of backup log files to keep
    """
    
    # Create logs directory if it doesn't exist
    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Set up root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Remove existing handlers to prevent duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Logging format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(getattr(logging, log_level.upper()))
    root_logger.addHandler(console_handler)
    
    # File Handler with Rotation
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=log_max_bytes,
        backupCount=log_backup_count
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(getattr(logging, log_level.upper()))
    root_logger.addHandler(file_handler)
    
    root_logger.info(f"Logging initialized - Level: {log_level}, File: {log_file}")


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the specified name.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Logger instance
    """
    return logging.getLogger(name)
