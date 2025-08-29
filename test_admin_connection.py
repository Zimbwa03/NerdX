#!/usr/bin/env python3
"""
Test admin auth service database connection
"""

import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_admin_connection():
    """Test admin auth service database connection"""
    try:
        # Import the service
        from services.admin_auth_service import AdminAuthService
        
        logger.info("✅ Successfully imported AdminAuthService")
        
        # Create instance
        auth_service = AdminAuthService()
        logger.info("✅ Successfully created AdminAuthService instance")
        
        # Test connection string cleaning
        logger.info(f"📝 Original DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')}")
        logger.info(f"🧹 Cleaned connection string: {auth_service.conn_string}")
        
        # Test database connection
        conn = auth_service._get_connection()
        if conn:
            logger.info("✅ Database connection successful!")
            conn.close()
            return True
        else:
            logger.error("❌ Database connection failed!")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing admin connection: {e}")
        return False

if __name__ == "__main__":
    logger.info("🧪 Testing Admin Auth Service Database Connection...")
    
    if test_admin_connection():
        logger.info("🎉 All tests passed!")
    else:
        logger.error("💥 Tests failed!")
        sys.exit(1)
