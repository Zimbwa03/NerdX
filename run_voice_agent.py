#!/usr/bin/env python3
"""
Start the NerdX Live Voice Agent server.
Runs on port 8001 by default (separate from Flask on 5000).
"""

import os
import sys

# Add the project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

if __name__ == "__main__":
    import uvicorn
    from services.voice_agent import app
    
    port = int(os.getenv("VOICE_AGENT_PORT", "8001"))
    
    print(f"""
================================================================
             NerdX Live Voice Agent                      
================================================================
  * Real-time voice-to-voice AI tutoring                     
  * Powered by Gemini Multimodal Live API                    
                                                              
  WebSocket: ws://localhost:{port}/ws/nerdx-live               
  Health:    http://localhost:{port}/health                    
================================================================
    """)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
