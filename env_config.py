#!/usr/bin/env python3
"""
Environment Configuration for NerdX Bot
Sets up environment variables for testing
"""

import os

# Set Supabase environment variables
os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'

# Set other required environment variables
os.environ['FLASK_SECRET_KEY'] = 'test-secret-key-12345'
os.environ['FLASK_ENV'] = 'development'

print("✅ Environment variables set successfully!")
print(f"SUPABASE_URL: {os.environ.get('SUPABASE_URL')}")
print(f"SUPABASE_ANON_KEY: {os.environ.get('SUPABASE_ANON_KEY')[:20]}...")

