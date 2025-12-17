#!/usr/bin/env python3
"""
NerdX Mobile Auth Diagnostic Tool
Verifies Supabase connectivity, environment variables, and essential tables.
"""

import os
import requests
import sys
from datetime import datetime

# Configure logging
def log(message, level="INFO"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {level}: {message}")

def check_env():
    log("Checking environment variables...")
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "JWT_SECRET"
    ]
    
    missing = []
    for var in required_vars:
        val = os.getenv(var)
        if not val or val == "your_supabase_url_here" or "your_" in val:
            missing.append(var)
            log(f"❌ {var} is missing or has default value", "ERROR")
        else:
            # Mask sensitive values
            masked = val[:10] + "..." + val[-5:] if len(val) > 15 else "***"
            log(f"✅ {var} is set: {masked}")
            
    return len(missing) == 0

def check_supabase_connectivity():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    
    if not url or not key:
        return False
        
    log(f"Testing connectivity to {url}...")
    try:
        # Try to access the health endpoint or a simple rest query
        health_url = f"{url}/rest/v1/"
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}"
        }
        response = requests.get(health_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            log("✅ Supabase REST API is reachable")
            return True
        else:
            log(f"❌ Supabase REST API returned status {response.status_code}: {response.text}", "ERROR")
            return False
    except Exception as e:
        log(f"❌ Supabase connectivity test failed: {e}", "ERROR")
        return False

def check_tables():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        return False
        
    tables = ["users_registration", "user_stats", "credit_transactions"]
    log("Checking essential tables...")
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    missing_tables = []
    for table in tables:
        table_url = f"{url}/rest/v1/{table}?limit=1"
        try:
            response = requests.get(table_url, headers=headers)
            if response.status_code == 200:
                log(f"✅ Table '{table}' exists and is accessible")
            elif response.status_code == 404:
                log(f"❌ Table '{table}' NOT FOUND (404)", "ERROR")
                missing_tables.append(table)
            else:
                log(f"⚠️ Table '{table}' returned status {response.status_code}: {response.text}", "WARNING")
        except Exception as e:
            log(f"❌ Error checking table '{table}': {e}", "ERROR")
            
    return len(missing_tables) == 0

def main():
    print("\n--- NerdX Mobile Auth Diagnostic ---")
    
    env_ok = check_env()
    print("")
    
    conn_ok = check_supabase_connectivity()
    print("")
    
    tables_ok = check_tables()
    print("")
    
    if env_ok and conn_ok and tables_ok:
        log("🚀 ALL SYSTEMS GO! Registration should work.", "SUCCESS")
    else:
        log("❌ Issues detected. Please fix the errors above.", "ERROR")
        
    print("------------------------------------\n")

if __name__ == "__main__":
    main()
