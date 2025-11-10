#!/bin/bash
# Project Setup Verification Script
# Run this to verify all files are in place

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          IDP Project - Setup Verification Script                  ║"
echo "║    Smart Traffic Management & Hornless Communication System      ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $1"
        ((failed++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $1/"
        ((failed++))
    fi
}

echo "📁 Checking Directory Structure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_dir "module1_ambulance_traffic"
check_dir "module1_ambulance_traffic/vehicle_detection"
check_dir "module1_ambulance_traffic/gps_tracking"
check_dir "module1_ambulance_traffic/traffic_signal_communication"
check_dir "module2_hornless_communication"
check_dir "module2_hornless_communication/v2v_signaling"
check_dir "module2_hornless_communication/spatial_audio"
check_dir "module2_hornless_communication/radar_ui"
check_dir "shared"
check_dir "shared/config"
check_dir "shared/communication"
check_dir "shared/utils"
check_dir "backend"
check_dir "backend/api"
check_dir "backend/database"
check_dir "frontend"
check_dir "tests"
check_dir "docs"
check_dir "iot_firmware"

echo ""
echo "📄 Checking Core Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "README.md"
check_file "QUICKSTART.md"
check_file "SETUP_COMPLETE.md"
check_file "DELIVERABLES.md"
check_file "requirements.txt"
check_file ".env.example"
check_file ".gitignore"
check_file "setup.py"

echo ""
echo "🐍 Checking Python Modules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "shared/config/config.py"
check_file "shared/config/logging_config.py"
check_file "shared/communication/mqtt_handler.py"
check_file "backend/app.py"
check_file "backend/main.py"

echo ""
echo "📚 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "module1_ambulance_traffic/README.md"
check_file "module2_hornless_communication/README.md"
check_file "docs/PROJECT_STRUCTURE.md"

echo ""
echo "🧪 Checking Test Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "tests/test_mqtt.py"

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                        Verification Summary                        ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Files checked: $((passed + failed))"
echo -e "${GREEN}✓ Passed: $passed${NC}"
echo -e "${RED}✗ Failed: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✓ All files present and accounted for!                    ║${NC}"
    echo -e "${GREEN}║                                                                    ║${NC}"
    echo -e "${GREEN}║  Next steps:                                                       ║${NC}"
    echo -e "${GREEN}║  1. pip install -r requirements.txt                                ║${NC}"
    echo -e "${GREEN}║  2. cp .env.example .env (and edit with your settings)             ║${NC}"
    echo -e "${GREEN}║  3. cd backend && python main.py                                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📖 For more information, see:"
    echo "   - QUICKSTART.md (5-minute setup)"
    echo "   - README.md (project overview)"
    echo "   - docs/PROJECT_STRUCTURE.md (complete guide)"
    exit 0
else
    echo -e "${RED}⚠ Some files are missing. Please run the setup script:${NC}"
    echo "   python setup.py"
    exit 1
fi
