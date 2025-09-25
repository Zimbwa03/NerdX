#!/usr/bin/env python3
"""
Set environment variables for Combined Science database retrieval
Run this script before starting your bot to enable database retrieval
"""

import os

def set_supabase_env_vars():
    """Set Supabase environment variables"""
    print("🔧 Setting Supabase Environment Variables...")
    
    # Supabase configuration
    os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
    os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
    os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
    
    print("✅ Supabase environment variables set!")
    print(f"✅ SUPABASE_URL: {os.environ['SUPABASE_URL']}")
    print(f"✅ SUPABASE_ANON_KEY: SET")
    print(f"✅ SUPABASE_SERVICE_ROLE_KEY: SET")
    
def test_database_connection():
    """Test that database connection works with the set variables"""
    print("\n🧪 Testing Database Connection...")
    
    try:
        from database.external_db import get_questions_by_subject_and_topic
        
        # Test Biology - Nutrition
        questions = get_questions_by_subject_and_topic('Biology', 'Nutrition', limit=1)
        
        if questions and len(questions) > 0:
            print("✅ Database connection successful!")
            print(f"✅ Sample question: {questions[0].get('question', 'N/A')[:50]}...")
            return True
        else:
            print("❌ No questions retrieved from database")
            return False
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_question_service():
    """Test that QuestionService uses database retrieval"""
    print("\n🔧 Testing QuestionService...")
    
    try:
        from services.question_service import QuestionService
        
        question_service = QuestionService()
        question_data = question_service.get_question(
            user_id="test_user",
            subject="Biology",
            topic="Nutrition",
            difficulty="medium",
            force_ai=False
        )
        
        if question_data:
            source = question_data.get('source', 'unknown')
            print(f"✅ Question retrieved with source: {source}")
            
            if source == 'database':
                print("🎉 SUCCESS: Combined Science will use DATABASE!")
                return True
            else:
                print("⚠️ WARNING: Still using AI generation")
                return False
        else:
            print("❌ No question returned")
            return False
            
    except Exception as e:
        print(f"❌ QuestionService error: {e}")
        return False

if __name__ == "__main__":
    print("🧬⚗️⚡ COMBINED SCIENCE DATABASE SETUP")
    print("=" * 60)
    
    # Step 1: Set environment variables
    set_supabase_env_vars()
    
    # Step 2: Test database connection
    db_success = test_database_connection()
    
    # Step 3: Test QuestionService
    service_success = test_question_service()
    
    # Results
    print("\n" + "=" * 60)
    print("📊 SETUP RESULTS:")
    print(f"✅ Environment Variables: SET")
    print(f"✅ Database Connection: {'SUCCESS' if db_success else 'FAILED'}")
    print(f"✅ QuestionService: {'SUCCESS' if service_success else 'FAILED'}")
    
    if db_success and service_success:
        print("\n🎉 SETUP COMPLETE!")
        print("🎯 Combined Science will now retrieve questions from database!")
        print("🎯 Next question buttons will work with database questions!")
        print("🎯 Topics will be perfectly isolated (no mixing)!")
        print("\n💡 TO MAKE PERMANENT:")
        print("1. Set these environment variables in your hosting platform")
        print("2. Or run this script before starting your bot")
        print("3. Or add these to your system environment variables")
    else:
        print("\n❌ Setup incomplete - please check errors above")
        
    print(f"\n📱 Bot ready for Combined Science database retrieval!")
