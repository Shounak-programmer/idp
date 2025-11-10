"""
Project initialization script.
Run this after cloning to set up the development environment.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a shell command and report status."""
    print(f"\n{'='*60}")
    print(f"  {description}")
    print(f"{'='*60}")
    
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✓ {description} - SUCCESS")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} - FAILED")
        print(f"  Error: {e}")
        return False


def main():
    """Main initialization function."""
    
    print("\n" + "="*60)
    print("  IDP Project Initialization")
    print("="*60)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("✗ Python 3.8+ is required")
        sys.exit(1)
    
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    
    # Create virtual environment if it doesn't exist
    if not Path("venv").exists():
        run_command("python -m venv venv", "Create Python virtual environment")
    
    # Activate virtual environment command (different for Windows/Unix)
    if sys.platform == "win32":
        activate_cmd = "venv\\Scripts\\activate &&"
    else:
        activate_cmd = "source venv/bin/activate &&"
    
    # Install dependencies
    run_command(
        f"{activate_cmd} pip install --upgrade pip",
        "Upgrade pip"
    )
    
    run_command(
        f"{activate_cmd} pip install -r requirements.txt",
        "Install project dependencies"
    )
    
    # Copy environment template if .env doesn't exist
    if not Path(".env").exists():
        import shutil
        shutil.copy(".env.example", ".env")
        print("✓ Created .env file from template (please update with your settings)")
    
    # Create logs directory
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    print("✓ Created logs directory")
    
    # Summary
    print("\n" + "="*60)
    print("  Initialization Complete!")
    print("="*60)
    print("\nNext steps:")
    print("1. Update .env file with your configuration")
    print("2. Set up MQTT broker (e.g., Mosquitto)")
    print("3. Configure Firebase (optional)")
    print("4. Run: python backend/main.py")
    print("\nFor more information, see docs/SETUP.md")
    print()


if __name__ == "__main__":
    main()
