"""
MQTT Communication Handler
Manages pub/sub communication with MQTT broker for traffic signals and vehicle communication.
"""

import paho.mqtt.client as mqtt
import json
import logging
from typing import Callable, Optional, Dict, Any
from threading import Thread, Lock
import time
from enum import Enum

logger = logging.getLogger(__name__)


class MessageType(Enum):
    """MQTT message types."""
    TRAFFIC_SIGNAL_COMMAND = "traffic/signal/command"
    TRAFFIC_SIGNAL_STATUS = "traffic/signal/status"
    AMBULANCE_ALERT = "ambulance/alert"
    AMBULANCE_LOCATION = "ambulance/location"
    V2V_ALERT = "v2v/alert"
    VEHICLE_STATUS = "vehicle/status"
    SYSTEM_HEALTH = "system/health"


class MQTTHandler:
    """
    MQTT client handler for IDP project communication.
    """
    
    def __init__(
        self,
        broker_url: str = "localhost",
        broker_port: int = 1883,
        username: str = "admin",
        password: str = "password",
        keepalive: int = 60,
        client_id: str = "idp_client"
    ):
        """
        Initialize MQTT handler.
        
        Args:
            broker_url: MQTT broker address
            broker_port: MQTT broker port
            username: MQTT username
            password: MQTT password
            keepalive: MQTT keepalive interval in seconds
            client_id: Client ID for MQTT connection
        """
        self.broker_url = broker_url
        self.broker_port = broker_port
        self.username = username
        self.password = password
        self.keepalive = keepalive
        self.client_id = client_id
        
        # Initialize MQTT client
        self.client = mqtt.Client(client_id=client_id)
        self.client.username_pw_set(username, password)
        
        # Set callbacks
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        
        # Message handlers
        self.message_handlers: Dict[str, list] = {}
        self.connected = False
        self.lock = Lock()
        
        logger.info(f"MQTT Handler initialized: {broker_url}:{broker_port}")
    
    def connect(self) -> bool:
        """
        Connect to MQTT broker.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            self.client.connect(self.broker_url, self.broker_port, self.keepalive)
            self.client.loop_start()
            
            # Wait for connection
            timeout = 5
            while not self.connected and timeout > 0:
                time.sleep(0.1)
                timeout -= 0.1
            
            if self.connected:
                logger.info(f"Connected to MQTT broker: {self.broker_url}:{self.broker_port}")
                return True
            else:
                logger.error("Failed to connect to MQTT broker (timeout)")
                return False
                
        except Exception as e:
            logger.error(f"Error connecting to MQTT broker: {e}")
            return False
    
    def disconnect(self) -> None:
        """Disconnect from MQTT broker."""
        try:
            self.client.loop_stop()
            self.client.disconnect()
            self.connected = False
            logger.info("Disconnected from MQTT broker")
        except Exception as e:
            logger.error(f"Error disconnecting from MQTT broker: {e}")
    
    def subscribe(self, topic: str, handler: Optional[Callable] = None) -> None:
        """
        Subscribe to MQTT topic.
        
        Args:
            topic: Topic to subscribe to
            handler: Optional callback function for messages on this topic
        """
        if handler:
            if topic not in self.message_handlers:
                self.message_handlers[topic] = []
            self.message_handlers[topic].append(handler)
        
        try:
            self.client.subscribe(topic)
            logger.info(f"Subscribed to topic: {topic}")
        except Exception as e:
            logger.error(f"Error subscribing to topic {topic}: {e}")
    
    def unsubscribe(self, topic: str) -> None:
        """
        Unsubscribe from MQTT topic.
        
        Args:
            topic: Topic to unsubscribe from
        """
        try:
            self.client.unsubscribe(topic)
            if topic in self.message_handlers:
                del self.message_handlers[topic]
            logger.info(f"Unsubscribed from topic: {topic}")
        except Exception as e:
            logger.error(f"Error unsubscribing from topic {topic}: {e}")
    
    def publish(self, topic: str, payload: Dict[str, Any], qos: int = 1, retain: bool = False) -> bool:
        """
        Publish message to MQTT topic.
        
        Args:
            topic: Topic to publish to
            payload: Message payload (will be JSON serialized)
            qos: Quality of Service (0, 1, or 2)
            retain: Whether to retain the message
            
        Returns:
            True if publish successful, False otherwise
        """
        try:
            message = json.dumps(payload)
            result = self.client.publish(topic, message, qos=qos, retain=retain)
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.debug(f"Published to {topic}: {payload}")
                return True
            else:
                logger.error(f"Failed to publish to {topic}: {mqtt.error_string(result.rc)}")
                return False
                
        except Exception as e:
            logger.error(f"Error publishing to topic {topic}: {e}")
            return False
    
    def _on_connect(self, client, userdata, flags, rc):
        """Callback for when MQTT client connects."""
        if rc == 0:
            logger.info("MQTT client connected")
            self.connected = True
        else:
            logger.error(f"MQTT connection failed with code {rc}")
            self.connected = False
    
    def _on_disconnect(self, client, userdata, rc):
        """Callback for when MQTT client disconnects."""
        self.connected = False
        if rc != 0:
            logger.warning(f"Unexpected disconnection from MQTT broker: {rc}")
        else:
            logger.info("Disconnected from MQTT broker")
    
    def _on_message(self, client, userdata, msg):
        """Callback for when a message is received."""
        try:
            payload = json.loads(msg.payload.decode())
            logger.debug(f"Received message on {msg.topic}: {payload}")
            
            # Call registered handlers for this topic
            if msg.topic in self.message_handlers:
                for handler in self.message_handlers[msg.topic]:
                    try:
                        handler(msg.topic, payload)
                    except Exception as e:
                        logger.error(f"Error in message handler: {e}")
            
            # Also try wildcard handlers
            for topic_filter, handlers in self.message_handlers.items():
                if self._topic_matches(msg.topic, topic_filter):
                    for handler in handlers:
                        try:
                            handler(msg.topic, payload)
                        except Exception as e:
                            logger.error(f"Error in wildcard message handler: {e}")
                            
        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON received on {msg.topic}: {msg.payload}")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")
    
    @staticmethod
    def _topic_matches(topic: str, filter_str: str) -> bool:
        """
        Check if topic matches filter (supports + and # wildcards).
        
        Args:
            topic: Actual topic
            filter_str: Filter string with wildcards
            
        Returns:
            True if topic matches filter
        """
        import re
        
        # Escape special regex characters and replace MQTT wildcards
        pattern = filter_str.replace('+', '[^/]+').replace('#', '.*')
        pattern = f"^{pattern}$"
        
        return bool(re.match(pattern, topic))
    
    def is_connected(self) -> bool:
        """Check if connected to MQTT broker."""
        return self.connected


# Global MQTT instance
_mqtt_instance: Optional[MQTTHandler] = None


def get_mqtt_handler(
    broker_url: str = "localhost",
    broker_port: int = 1883,
    username: str = "admin",
    password: str = "password",
    client_id: str = "idp_client"
) -> MQTTHandler:
    """
    Get or create global MQTT handler instance.
    
    Returns:
        MQTT handler instance
    """
    global _mqtt_instance
    
    if _mqtt_instance is None:
        _mqtt_instance = MQTTHandler(
            broker_url=broker_url,
            broker_port=broker_port,
            username=username,
            password=password,
            client_id=client_id
        )
    
    return _mqtt_instance
