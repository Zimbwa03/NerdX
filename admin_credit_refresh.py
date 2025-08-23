
#!/usr/bin/env python3
"""
Standalone credit refresh script for NerdX Quiz Bot
Run this script to manage user credits
"""

import sys
import os

# Add the current directory to Python path to import local modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.credit_manager import main

if __name__ == "__main__":
    main()
