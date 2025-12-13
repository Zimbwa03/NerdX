#!/usr/bin/env python3
"""
Standalone Voice Agent Starter for Render deployment.
This avoids importing the entire services module which has extra dependencies.
"""

import os
import sys

if __name__ == "__main__":
    import uvicorn
    
    # Import the app object directly from the file, not through services package
    # This avoids services/__init__.py which imports all other services
    import importlib.util
    spec = importlib.util.spec_from_file_location("voice_agent", "services/voice_agent.py")
    voice_agent = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(voice_agent)
    
    app = voice_agent.app
    
    port = int(os.getenv("PORT", os.getenv("VOICE_AGENT_PORT", "8001")))
    
    print(f"""
================================================================
             NerdX Live Voice Agent                      
================================================================
  * Real-time voice-to-voice AI tutoring                     
  * Powered by Gemini Multimodal Live API                    
                                                              
  WebSocket: ws://0.0.0.0:{port}/ws/nerdx-live               
  Health:    http://0.0.0.0:{port}/health                    
================================================================
    """)
    
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
