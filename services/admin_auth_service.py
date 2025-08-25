"""
Admin Authentication Service for NerdX Dashboard
Handles login, session management, and security features
"""
import psycopg2
import hashlib
import secrets
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
from flask import session, request
import json

logger = logging.getLogger(__name__)

class AdminAuthService:
    def __init__(self):
        self.conn_string = 'postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres'
        self.session_duration = timedelta(hours=8)  # 8 hours session
        self.max_failed_attempts = 5
        self.lockout_duration = timedelta(minutes=30)  # 30 minutes lockout
    
    def _get_connection(self):
        """Get database connection"""
        try:
            return psycopg2.connect(self.conn_string)
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
        """Get client IP address"""
        if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
            return request.environ['REMOTE_ADDR']
        else:
            return request.environ['HTTP_X_FORWARDED_FOR']
    
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
            
            cursor.execute("""
                INSERT INTO admin_activity_logs 
                (admin_user_id, action, details, ip_address, user_agent, success)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                admin_user_id,
                action,
                json.dumps(details) if details else None,
                self._get_client_ip(),
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
                return {'success': False, 'message': 'Database connection error'}
            
            cursor = conn.cursor()
            
            # Get admin user details
            cursor.execute("""
                SELECT id, email, password_hash, password_salt, first_name, last_name,
                       role, is_active, failed_login_attempts, account_locked_until
                FROM admin_users 
                WHERE email = %s
            """, (email.lower(),))
            
            user_data = cursor.fetchone()
            
            if not user_data:
                self._log_activity(None, 'LOGIN_FAILED', {'email': email, 'reason': 'User not found'}, False)
                return {'success': False, 'message': 'Invalid email or password'}
            
            user_id, user_email, password_hash, salt, first_name, last_name, role, is_active, failed_attempts, locked_until = user_data
            
            # Check if account is locked
            if locked_until and locked_until > datetime.now():
                self._log_activity(user_id, 'LOGIN_FAILED', {'reason': 'Account locked'}, False)
                return {'success': False, 'message': f'Account locked until {locked_until.strftime("%Y-%m-%d %H:%M:%S")}'}
            
            # Check if account is active
            if not is_active:
                self._log_activity(user_id, 'LOGIN_FAILED', {'reason': 'Account inactive'}, False)
                return {'success': False, 'message': 'Account is inactive'}
            
            # Verify password
            if not self._verify_password(password, password_hash, salt):
                # Increment failed attempts
                new_failed_attempts = failed_attempts + 1
                
                # Lock account if too many failed attempts
                if new_failed_attempts >= self.max_failed_attempts:
                    lockout_until = datetime.now() + self.lockout_duration
                    cursor.execute("""
                        UPDATE admin_users 
                        SET failed_login_attempts = %s, account_locked_until = %s
                        WHERE id = %s
                    """, (new_failed_attempts, lockout_until, user_id))
                    
                    self._log_activity(user_id, 'ACCOUNT_LOCKED', {'failed_attempts': new_failed_attempts}, False)
                    conn.commit()
                    cursor.close()
                    conn.close()
                    return {'success': False, 'message': f'Too many failed attempts. Account locked until {lockout_until.strftime("%Y-%m-%d %H:%M:%S")}'}
                else:
                    cursor.execute("""
                        UPDATE admin_users 
                        SET failed_login_attempts = %s
                        WHERE id = %s
                    """, (new_failed_attempts, user_id))
                
                self._log_activity(user_id, 'LOGIN_FAILED', {'reason': 'Invalid password', 'failed_attempts': new_failed_attempts}, False)
                conn.commit()
                cursor.close()
                conn.close()
                return {'success': False, 'message': 'Invalid email or password'}
            
            # Successful login - reset failed attempts
            cursor.execute("""
                UPDATE admin_users 
                SET failed_login_attempts = 0, account_locked_until = NULL, last_login = %s, last_login_ip = %s
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
                return {'success': False, 'message': 'Database connection error'}
            
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
            
            # Check if session expired
            if expires_at < datetime.now():
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
            
            # Update last activity
            cursor.execute("""
                UPDATE admin_sessions 
                SET last_activity = %s
                WHERE session_token = %s
            """, (datetime.now(), session_token))
            
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
                return {'success': False, 'message': 'Database connection error'}
            
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
                return {'success': False, 'message': 'Database connection error'}
            
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
                return {'success': False, 'message': 'Database connection error'}
            
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
