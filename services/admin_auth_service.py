"""
Admin Authentication Service for NerdX Dashboard
Handles login, session management, and security features
"""
import os
import psycopg2
import hashlib
import secrets
import logging
import re
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
from flask import session, request
import json

logger = logging.getLogger(__name__)

class AdminAuthService:
    def __init__(self):
        # Use Supabase connection string (without pgbouncer parameter for psycopg2 compatibility)
        raw_conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
        self.conn_string = self._clean_connection_string(raw_conn_string)
        self.session_duration = timedelta(hours=8)  # 8 hours session
    
    def _clean_connection_string(self, database_url: str) -> str:
        """Clean database URL by removing pgbouncer and other problematic parameters"""
        if not database_url:
            return database_url
        
        # Remove pgbouncer parameter if present (incompatible with psycopg2)
        if "pgbouncer=true" in database_url:
            database_url = database_url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
        if "pgbouncer=1" in database_url:
            database_url = database_url.replace("?pgbouncer=1", "").replace("&pgbouncer=1", "")
        if "pgbouncer" in database_url:
            # Remove any remaining pgbouncer parameters
            database_url = re.sub(r'[?&]pgbouncer=[^&]*', '', database_url)
        
        return database_url
    
    def _get_connection(self):
        """Get database connection with retry logic"""
        try:
            return psycopg2.connect(self.conn_string, connect_timeout=10)
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            return None
    
    def _hash_password(self, password: str, salt: str = None) -> Tuple[str, str]:
        """Hash password with salt using PBKDF2"""
        if not salt:
            salt = secrets.token_hex(32)
        
        password_hash = hashlib.pbkdf2_hmac('sha256', 
                                           password.encode('utf-8'), 
                                           salt.encode('utf-8'), 
                                           100000)  # 100,000 iterations
        
        return password_hash.hex(), salt
    
    def _verify_password(self, password: str, password_hash: str, salt: str) -> bool:
        """Verify password against hash"""
        test_hash, _ = self._hash_password(password, salt)
        return test_hash == password_hash
    
    def _generate_session_token(self) -> str:
        """Generate secure session token"""
        return secrets.token_urlsafe(64)
    
    def _get_client_ip(self) -> str:
        """Get client IP address - handle proxy forwarding properly"""
        # Check for X-Forwarded-For header (proxy)
        forwarded_for = request.environ.get('HTTP_X_FORWARDED_FOR')
        if forwarded_for:
            # Take the first IP address (original client IP)
            # Split by comma and take the first one, then strip whitespace
            first_ip = forwarded_for.split(',')[0].strip()
            return first_ip
        
        # Fallback to direct connection
        return request.environ.get('REMOTE_ADDR', '127.0.0.1')

    def _get_user_agent(self) -> str:
        """Get client user agent"""
        return request.headers.get('User-Agent', 'Unknown')

    def _log_activity(self, admin_user_id: Optional[int], action: str, 
                     details: Dict = None, success: bool = True):
        """Log admin activity"""
        try:
            conn = self._get_connection()
            if not conn:
                return
            
            cursor = conn.cursor()
            
            # Get clean IP address
            client_ip = self._get_client_ip()
            
            cursor.execute("""
                INSERT INTO admin_activity_logs 
                (admin_user_id, action, details, ip_address, user_agent, success)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                admin_user_id,
                action,
                json.dumps(details) if details else None,
                client_ip,
                self._get_user_agent(),
                success
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error logging activity: {e}")

    def login(self, email: str, password: str) -> Dict:
        """Authenticate admin user and create session"""
        try:
            conn = self._get_connection()
            if not conn:
                logger.warning("Supabase database unavailable - operation temporarily disabled")
                return {'success': False, 'message': 'Service temporarily unavailable. Please check your network connection and try again.'}
            
            cursor = conn.cursor()
            
            # Get admin user details
            cursor.execute("""
                SELECT id, email, password_hash, password_salt, first_name, last_name,
                       role, is_active
                FROM admin_users 
                WHERE email = %s
            """, (email.lower(),))
            
            user_data = cursor.fetchone()
            
            if not user_data:
                self._log_activity(None, 'LOGIN_FAILED', {'email': email, 'reason': 'User not found'}, False)
                return {'success': False, 'message': 'Invalid email or password'}
            
            user_id, user_email, password_hash, salt, first_name, last_name, role, is_active = user_data
            
            # Check if account is active
            if not is_active:
                self._log_activity(user_id, 'LOGIN_FAILED', {'reason': 'Account inactive'}, False)
                return {'success': False, 'message': 'Account is inactive'}
            
            # Verify password
            if not self._verify_password(password, password_hash, salt):
                self._log_activity(user_id, 'LOGIN_FAILED', {'reason': 'Invalid password'}, False)
                conn.commit()
                cursor.close()
                conn.close()
                return {'success': False, 'message': 'Invalid email or password'}
            
            # Successful login - update last login info
            cursor.execute("""
                UPDATE admin_users 
                SET last_login = %s, last_login_ip = %s
                WHERE id = %s
            """, (datetime.now(), self._get_client_ip(), user_id))
            
            # Create session
            session_token = self._generate_session_token()
            expires_at = datetime.now() + self.session_duration
            
            # Deactivate old sessions
            cursor.execute("""
                UPDATE admin_sessions 
                SET is_active = false
                WHERE admin_user_id = %s AND is_active = true
            """, (user_id,))
            
            # Create new session
            cursor.execute("""
                INSERT INTO admin_sessions 
                (session_token, admin_user_id, ip_address, user_agent, expires_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (session_token, user_id, self._get_client_ip(), self._get_user_agent(), expires_at))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            # Set Flask session
            session['admin_session_token'] = session_token
            session['admin_user_id'] = user_id
            session['admin_role'] = role
            session['admin_name'] = f"{first_name} {last_name}"
            
            self._log_activity(user_id, 'LOGIN_SUCCESS', {'session_token': session_token[:10] + '...'})
            
            return {
                'success': True,
                'user': {
                    'id': user_id,
                    'email': user_email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': role
                },
                'session_token': session_token
            }
            
        except Exception as e:
            logger.error(f"Login error: {e}")
            return {'success': False, 'message': 'Login failed due to server error'}
    
    def logout(self, session_token: str = None) -> Dict:
        """Logout admin user and deactivate session"""
        try:
            if not session_token:
                session_token = session.get('admin_session_token')
            
            if not session_token:
                return {'success': False, 'message': 'No active session'}
            
            conn = self._get_connection()
            if not conn:
                logger.warning("Supabase database unavailable - operation temporarily disabled")
                return {'success': False, 'message': 'Service temporarily unavailable. Please check your network connection and try again.'}
            
            cursor = conn.cursor()
            
            # Get session info for logging
            cursor.execute("""
                SELECT admin_user_id FROM admin_sessions 
                WHERE session_token = %s AND is_active = true
            """, (session_token,))
            
            session_data = cursor.fetchone()
            admin_user_id = session_data[0] if session_data else None
            
            # Deactivate session
            cursor.execute("""
                UPDATE admin_sessions 
                SET is_active = false, last_activity = %s
                WHERE session_token = %s
            """, (datetime.now(), session_token))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            # Clear Flask session
            session.clear()
            
            self._log_activity(admin_user_id, 'LOGOUT', {'session_token': session_token[:10] + '...'})
            
            return {'success': True, 'message': 'Logged out successfully'}
            
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return {'success': False, 'message': 'Logout failed'}
    
    def verify_session(self, session_token: str = None) -> Optional[Dict]:
        """Verify and refresh admin session"""
        try:
            if not session_token:
                session_token = session.get('admin_session_token')
            
            if not session_token:
                return None
            
            conn = self._get_connection()
            if not conn:
                return None
            
            cursor = conn.cursor()
            
            # Get session and user info
            cursor.execute("""
                SELECT s.admin_user_id, s.expires_at, u.first_name, u.last_name, 
                       u.email, u.role, u.is_active
                FROM admin_sessions s
                JOIN admin_users u ON s.admin_user_id = u.id
                WHERE s.session_token = %s AND s.is_active = true
            """, (session_token,))
            
            session_data = cursor.fetchone()
            
            if not session_data:
                cursor.close()
                conn.close()
                return None
            
            user_id, expires_at, first_name, last_name, email, role, is_active = session_data
            
            # Check if session expired (handle timezone awareness)
            from datetime import timezone
            current_time = datetime.now()
            if expires_at.tzinfo is not None:
                # expires_at is timezone-aware, make current_time timezone-aware too
                current_time = datetime.now(timezone.utc)
            elif current_time.tzinfo is not None:
                # current_time is timezone-aware, make it naive
                current_time = current_time.replace(tzinfo=None)
            
            if expires_at < current_time:
                cursor.execute("""
                    UPDATE admin_sessions 
                    SET is_active = false
                    WHERE session_token = %s
                """, (session_token,))
                conn.commit()
                cursor.close()
                conn.close()
                return None
            
            # Check if user is still active
            if not is_active:
                cursor.execute("""
                    UPDATE admin_sessions 
                    SET is_active = false
                    WHERE session_token = %s
                """, (session_token,))
                conn.commit()
                cursor.close()
                conn.close()
                return None
            
            # Update last activity (handle timezone consistency)
            last_activity_time = datetime.now()
            if expires_at.tzinfo is not None:
                # If database stores timezone-aware datetimes, make this timezone-aware too
                last_activity_time = datetime.now(timezone.utc)
            
            cursor.execute("""
                UPDATE admin_sessions 
                SET last_activity = %s
                WHERE session_token = %s
            """, (last_activity_time, session_token))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'id': user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'full_name': f"{first_name} {last_name}",
                'role': role
            }
            
        except Exception as e:
            logger.error(f"Session verification error: {e}")
            return None
    
    def register_admin(self, email: str, password: str, first_name: str, 
                      last_name: str, phone_number: str = None, 
                      created_by_id: int = None) -> Dict:
        """Register new admin user (only by super admin)"""
        try:
            conn = self._get_connection()
            if not conn:
                logger.warning("Supabase database unavailable - operation temporarily disabled")
                return {'success': False, 'message': 'Service temporarily unavailable. Please check your network connection and try again.'}
            
            cursor = conn.cursor()
            
            # Check if creator is super admin
            if created_by_id:
                cursor.execute("""
                    SELECT role FROM admin_users WHERE id = %s
                """, (created_by_id,))
                creator_data = cursor.fetchone()
                
                if not creator_data or creator_data[0] != 'super_admin':
                    self._log_activity(created_by_id, 'ADMIN_REGISTER_FAILED', {'email': email, 'reason': 'Not super admin'}, False)
                    return {'success': False, 'message': 'Only super admin can create new admin accounts'}
            
            # Check if email already exists
            cursor.execute("""
                SELECT id FROM admin_users WHERE email = %s
            """, (email.lower(),))
            
            if cursor.fetchone():
                self._log_activity(created_by_id, 'ADMIN_REGISTER_FAILED', {'email': email, 'reason': 'Email exists'}, False)
                return {'success': False, 'message': 'Email already registered'}
            
            # Hash password
            password_hash, salt = self._hash_password(password)
            
            # Create admin user
            cursor.execute("""
                INSERT INTO admin_users 
                (email, password_hash, password_salt, first_name, last_name, 
                 phone_number, role, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                email.lower(),
                password_hash,
                salt,
                first_name,
                last_name,
                phone_number,
                'admin',  # Regular admin role
                created_by_id
            ))
            
            new_admin_id = cursor.fetchone()[0]
            
            conn.commit()
            cursor.close()
            conn.close()
            
            self._log_activity(created_by_id, 'ADMIN_REGISTERED', {
                'new_admin_id': new_admin_id,
                'email': email,
                'name': f"{first_name} {last_name}"
            })
            
            return {
                'success': True,
                'message': 'Admin registered successfully',
                'admin_id': new_admin_id
            }
            
        except Exception as e:
            logger.error(f"Admin registration error: {e}")
            return {'success': False, 'message': 'Registration failed due to server error'}
    
    def get_admin_users(self, requestor_id: int) -> Dict:
        """Get all admin users (super admin only)"""
        try:
            conn = self._get_connection()
            if not conn:
                logger.warning("Supabase database unavailable - operation temporarily disabled")
                return {'success': False, 'message': 'Service temporarily unavailable. Please check your network connection and try again.'}
            
            cursor = conn.cursor()
            
            # Verify requestor is super admin
            cursor.execute("""
                SELECT role FROM admin_users WHERE id = %s
            """, (requestor_id,))
            
            requestor_data = cursor.fetchone()
            if not requestor_data or requestor_data[0] != 'super_admin':
                return {'success': False, 'message': 'Access denied'}
            
            # Get all admin users
            cursor.execute("""
                SELECT id, email, first_name, last_name, phone_number, role, 
                       is_active, last_login, created_at,
                       (SELECT CONCAT(first_name, ' ', last_name) FROM admin_users creator 
                        WHERE creator.id = admin_users.created_by) as created_by_name
                FROM admin_users 
                ORDER BY created_at DESC
            """)
            
            users = []
            for row in cursor.fetchall():
                users.append({
                    'id': row[0],
                    'email': row[1],
                    'first_name': row[2],
                    'last_name': row[3],
                    'full_name': f"{row[2]} {row[3]}",
                    'phone_number': row[4],
                    'role': row[5],
                    'is_active': row[6],
                    'last_login': row[7].isoformat() if row[7] else None,
                    'created_at': row[8].isoformat() if row[8] else None,
                    'created_by': row[9]
                })
            
            cursor.close()
            conn.close()
            
            return {'success': True, 'users': users}
            
        except Exception as e:
            logger.error(f"Get admin users error: {e}")
            return {'success': False, 'message': 'Failed to fetch admin users'}
    
    def deactivate_admin(self, admin_id: int, requestor_id: int) -> Dict:
        """Deactivate admin user (super admin only)"""
        try:
            conn = self._get_connection()
            if not conn:
                logger.warning("Supabase database unavailable - operation temporarily disabled")
                return {'success': False, 'message': 'Service temporarily unavailable. Please check your network connection and try again.'}
            
            cursor = conn.cursor()
            
            # Verify requestor is super admin
            cursor.execute("""
                SELECT role FROM admin_users WHERE id = %s
            """, (requestor_id,))
            
            requestor_data = cursor.fetchone()
            if not requestor_data or requestor_data[0] != 'super_admin':
                return {'success': False, 'message': 'Access denied'}
            
            # Cannot deactivate super admin
            cursor.execute("""
                SELECT role, email FROM admin_users WHERE id = %s
            """, (admin_id,))
            
            target_data = cursor.fetchone()
            if not target_data:
                return {'success': False, 'message': 'Admin not found'}
            
            if target_data[0] == 'super_admin':
                return {'success': False, 'message': 'Cannot deactivate super admin'}
            
            # Deactivate admin
            cursor.execute("""
                UPDATE admin_users 
                SET is_active = false, updated_at = %s
                WHERE id = %s
            """, (datetime.now(), admin_id))
            
            # Deactivate all sessions
            cursor.execute("""
                UPDATE admin_sessions 
                SET is_active = false
                WHERE admin_user_id = %s
            """, (admin_id,))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            self._log_activity(requestor_id, 'ADMIN_DEACTIVATED', {
                'target_admin_id': admin_id,
                'target_email': target_data[1]
            })
            
            return {'success': True, 'message': 'Admin deactivated successfully'}
            
        except Exception as e:
            logger.error(f"Deactivate admin error: {e}")
            return {'success': False, 'message': 'Failed to deactivate admin'}

# Global instance
admin_auth_service = AdminAuthService()
