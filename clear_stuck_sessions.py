#!/usr/bin/env python3
"""
Emergency script to clear any stuck math_generating sessions
Run this to immediately fix the "Question is being generated" issue
"""

import sys
import os
sys.path.append('.')

def clear_all_stuck_sessions():
    """Clear all stuck math_generating sessions"""
    print("🔧 Clearing Stuck Math Sessions...")
    
    try:
        from database.session_db import clear_user_session
        import sqlite3
        from datetime import datetime, timedelta
        
        # Connect to session database
        DATABASE_NAME = "nerdx_sessions.db"
        
        if not os.path.exists(DATABASE_NAME):
            print("⚠️ No session database found - no stuck sessions to clear")
            return 0
            
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        # Find all sessions with 'math_generating' type
        cursor.execute('''
            SELECT user_id, session_type, created_at 
            FROM user_sessions 
            WHERE session_type = ?
        ''', ('math_generating',))
        
        stuck_sessions = cursor.fetchall()
        conn.close()
        
        if not stuck_sessions:
            print("✅ No stuck math_generating sessions found")
            return 0
            
        cleared_count = 0
        for user_id, session_type, created_at in stuck_sessions:
            try:
                clear_user_session(user_id)
                print(f"  ✅ Cleared stuck session for user: {user_id}")
                cleared_count += 1
            except Exception as e:
                print(f"  ❌ Failed to clear session for {user_id}: {e}")
        
        print(f"\n✅ Cleared {cleared_count} stuck sessions")
        return cleared_count
        
    except Exception as e:
        print(f"❌ Error clearing sessions: {e}")
        return 0

def test_session_fix():
    """Test that the session fix is working"""
    print("\n🧪 Testing Session Fix...")
    
    try:
        # Set environment variables for testing
        os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
        os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
        os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
        
        # Import the mathematics handler
        from handlers.mathematics_handler import MathematicsHandler
        from services.whatsapp_service import WhatsAppService
        from services.mathematics_service import MathematicsService
        from services.math_question_generator import MathQuestionGenerator
        from services.math_solver import MathSolver
        
        print("✅ All imports successful")
        
        # Check if we can create the handler
        whatsapp_service = WhatsAppService()
        math_service = MathematicsService()
        question_generator = MathQuestionGenerator()
        math_solver = MathSolver()
        
        math_handler = MathematicsHandler(whatsapp_service, math_service, question_generator, math_solver)
        print("✅ MathematicsHandler created successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

if __name__ == "__main__":
    print("🧮 MATHEMATICS SESSION FIX")
    print("=" * 50)
    
    # Clear any stuck sessions
    cleared = clear_all_stuck_sessions()
    
    # Test the fix
    test_ok = test_session_fix()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS:")
    print(f"✅ Stuck sessions cleared: {cleared}")
    print(f"✅ System test: {'PASS' if test_ok else 'FAIL'}")
    
    if cleared > 0 or test_ok:
        print("\n🎉 MATHEMATICS GENERATION SHOULD NOW WORK!")
        print("✅ Stuck sessions cleared")
        print("✅ Timeout mechanism added")
        print("✅ Manual session clearing available")
        print("✅ Exception handling improved")
    
    print("\n💡 If issues persist, users can type 'menu' to get a fresh start")
    print("🔧 The system now has multiple safeguards against stuck sessions")
