"""API package for NerdX Quiz Bot"""

from .webhook import webhook_bp
from .dashboard import dashboard_bp
from .admin import admin_bp

__all__ = ['webhook_bp', 'dashboard_bp', 'admin_bp']
