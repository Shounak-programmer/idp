"""
Unit tests for MQTT communication handler.
"""

import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.communication.mqtt_handler import MQTTHandler, MessageType


class TestMQTTHandler(unittest.TestCase):
    """Test cases for MQTT handler."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.handler = MQTTHandler(
            broker_url="localhost",
            broker_port=1883,
            client_id="test_client"
        )
    
    @patch('paho.mqtt.client.Client')
    def test_initialization(self, mock_client):
        """Test MQTT handler initialization."""
        handler = MQTTHandler()
        self.assertEqual(handler.broker_url, "localhost")
        self.assertEqual(handler.broker_port, 1883)
        self.assertFalse(handler.connected)
    
    def test_message_type_enum(self):
        """Test message type enum."""
        self.assertEqual(MessageType.AMBULANCE_ALERT.value, "ambulance/alert")
        self.assertEqual(MessageType.V2V_ALERT.value, "v2v/alert")
        self.assertEqual(MessageType.TRAFFIC_SIGNAL_COMMAND.value, "traffic/signal/command")
    
    def test_topic_matching(self):
        """Test MQTT topic matching with wildcards."""
        # Test exact match
        self.assertTrue(MQTTHandler._topic_matches("traffic/signal/001", "traffic/signal/001"))
        
        # Test single level wildcard
        self.assertTrue(MQTTHandler._topic_matches("traffic/signal/001", "traffic/signal/+"))
        self.assertTrue(MQTTHandler._topic_matches("traffic/signal/002", "traffic/signal/+"))
        self.assertFalse(MQTTHandler._topic_matches("traffic/light/001", "traffic/signal/+"))
        
        # Test multi-level wildcard
        self.assertTrue(MQTTHandler._topic_matches("ambulance/vehicle/001/location", "ambulance/#"))
        self.assertTrue(MQTTHandler._topic_matches("ambulance/status", "ambulance/#"))
    
    def test_publish_payload_structure(self):
        """Test that publish creates proper JSON structure."""
        handler = MQTTHandler()
        handler.connected = True  # Mock connection
        handler.client = MagicMock()
        
        payload = {
            'vehicle_id': 'AMB_001',
            'status': 'active',
            'latitude': 28.5355,
            'longitude': 77.3910
        }
        
        handler.publish("ambulance/location", payload)
        
        # Verify client.publish was called
        handler.client.publish.assert_called_once()
        call_args = handler.client.publish.call_args
        
        # Check topic
        self.assertEqual(call_args[0][0], "ambulance/location")
        
        # Check payload JSON
        published_message = json.loads(call_args[0][1])
        self.assertEqual(published_message['vehicle_id'], 'AMB_001')


class TestMQTTMessageHandlers(unittest.TestCase):
    """Test cases for MQTT message handlers."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.handler = MQTTHandler()
        self.received_messages = []
    
    def message_callback(self, topic, payload):
        """Test message callback."""
        self.received_messages.append((topic, payload))
    
    def test_handler_registration(self):
        """Test registering message handlers."""
        self.handler.subscribe("ambulance/+/location", self.message_callback)
        
        self.assertIn("ambulance/+/location", self.handler.message_handlers)
        self.assertIn(self.message_callback, self.handler.message_handlers["ambulance/+/location"])
    
    def test_multiple_handlers(self):
        """Test multiple handlers on same topic."""
        def handler1(topic, payload):
            pass
        
        def handler2(topic, payload):
            pass
        
        self.handler.subscribe("traffic/signal/+", handler1)
        self.handler.subscribe("traffic/signal/+", handler2)
        
        handlers = self.handler.message_handlers["traffic/signal/+"]
        self.assertEqual(len(handlers), 2)
        self.assertIn(handler1, handlers)
        self.assertIn(handler2, handlers)


if __name__ == '__main__':
    unittest.main()
