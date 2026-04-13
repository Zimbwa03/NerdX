"""
ADMIN CREDIT CONFIGURATION API
==============================
Allows easy dashboard configuration of credit costs for all subjects.
Security: Only accessible by admin users with proper authentication.
"""

import logging
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from database.external_db import get_user_registration
from services.secure_credit_system import secure_credit_system

logger = logging.getLogger(__name__)

admin_credit_config_bp = Blueprint('admin_credit_config', __name__)

def admin_required(f):
    """Decorator to require admin authentication"""
    def decorated_function(*args, **kwargs):
        # Simple admin check - can be enhanced with proper auth
        if not session.get('admin_authenticated'):
            flash('Admin authentication required', 'error')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_credit_config_bp.route('/admin/credit-config')
@admin_required
def credit_config():
    """Display credit configuration dashboard"""
    try:
        # Get current credit costs from secure system
        current_costs = secure_credit_system.SECURE_CREDIT_COSTS
        
        # Group by subject for better display
        subjects = {
            'Combined Science': {
                'combined_science_topical': current_costs.get('combined_science_topical', 1),
                'combined_science_exam': current_costs.get('combined_science_exam', 2)
            },
            'Mathematics': {
                'math_topical': current_costs.get('math_topical', 1),
                'math_exam': current_costs.get('math_exam', 2),
                'math_graph_practice': current_costs.get('math_graph_practice', 3)
            },
            'English': {
                'english_topical': current_costs.get('english_topical', 1),
                'english_comprehension': current_costs.get('english_comprehension', 3),
                'english_essay_writing': current_costs.get('english_essay_writing', 3)
            },
            'Audio Features': {
                'audio_feature': current_costs.get('audio_feature', 10),
                'voice_chat': current_costs.get('voice_chat', 10)
            }
        }
        
        return render_template('admin/credit_config.html', subjects=subjects)
        
    except Exception as e:
        logger.error(f"Error loading credit config: {e}")
        flash('Error loading credit configuration', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_credit_config_bp.route('/admin/credit-config/update', methods=['POST'])
@admin_required
def update_credit_config():
    """Update credit configuration"""
    try:
        # Get form data
        new_costs = {}
        
        # Combined Science
        new_costs['combined_science_topical'] = int(request.form.get('combined_science_topical', 1))
        new_costs['combined_science_exam'] = int(request.form.get('combined_science_exam', 2))
        
        # Mathematics
        new_costs['math_topical'] = int(request.form.get('math_topical', 1))
        new_costs['math_exam'] = int(request.form.get('math_exam', 2))
        new_costs['math_graph_practice'] = int(request.form.get('math_graph_practice', 3))
        
        # English
        new_costs['english_topical'] = int(request.form.get('english_topical', 1))
        new_costs['english_comprehension'] = int(request.form.get('english_comprehension', 3))
        new_costs['english_essay_writing'] = int(request.form.get('english_essay_writing', 3))
        
        # Audio Features
        new_costs['audio_feature'] = int(request.form.get('audio_feature', 10))
        new_costs['voice_chat'] = int(request.form.get('voice_chat', 10))
        
        # Validate costs (must be positive)
        for action, cost in new_costs.items():
            if cost < 1:
                flash(f'Credit cost for {action} must be at least 1', 'error')
                return redirect(url_for('admin_credit_config.credit_config'))
        
        # Update the secure credit system
        secure_credit_system.SECURE_CREDIT_COSTS.update(new_costs)
        
        # Log the changes for audit trail
        admin_user = session.get('admin_user', 'Unknown Admin')
        logger.info(f"Admin {admin_user} updated credit costs: {new_costs}")
        
        # Update configuration file for persistence
        update_config_file(new_costs)
        
        flash('Credit configuration updated successfully!', 'success')
        return redirect(url_for('admin_credit_config.credit_config'))
        
    except ValueError as e:
        flash('Invalid credit values. Please enter valid numbers.', 'error')
        return redirect(url_for('admin_credit_config.credit_config'))
    except Exception as e:
        logger.error(f"Error updating credit config: {e}")
        flash('Error updating credit configuration', 'error')
        return redirect(url_for('admin_credit_config.credit_config'))

def update_config_file(new_costs):
    """Update the config.py file with new credit costs for persistence"""
    try:
        import os
        
        # Read current config file
        config_path = 'config.py'
        with open(config_path, 'r') as f:
            config_content = f.read()
        
        # Generate new CREDIT_COSTS section
        new_credit_section = """    CREDIT_COSTS = {
        # Combined Science - EXACT REQUIREMENTS
        'combined_science_topical': """ + str(new_costs['combined_science_topical']) + """,      # Topical Questions
        'combined_science_exam': """ + str(new_costs['combined_science_exam']) + """,         # Exam Questions
        
        # Mathematics - EXACT REQUIREMENTS  
        'math_topical': """ + str(new_costs['math_topical']) + """,                  # Topical Questions
        'math_exam': """ + str(new_costs['math_exam']) + """,                     # Exam Questions
        'math_graph_practice': """ + str(new_costs['math_graph_practice']) + """,           # Graph Practice
        
        # English - EXACT REQUIREMENTS
        'english_topical': """ + str(new_costs['english_topical']) + """,               # Topical Questions  
        'english_comprehension': """ + str(new_costs['english_comprehension']) + """,         # Comprehension
        'english_essay_writing': """ + str(new_costs['english_essay_writing']) + """,         # Essay Writing
        
        # Audio Features
        'audio_feature': """ + str(new_costs['audio_feature']) + """,                # Audio Feature
        'voice_chat': """ + str(new_costs['voice_chat']) + """,                   # Voice Chat
        
        # Legacy compatibility (keep lower costs for existing handlers)
        'math': 1,
        'science': 1,
        'english': 1,
        'image_solve': 3,
        'graph_generation': 3
    }"""
        
        # Replace the CREDIT_COSTS section
        import re
        pattern = r'CREDIT_COSTS = \{[^}]+\}'
        new_config_content = re.sub(pattern, new_credit_section, config_content, flags=re.DOTALL)
        
        # Write updated config
        with open(config_path, 'w') as f:
            f.write(new_config_content)
            
        logger.info("Config file updated successfully with new credit costs")
        
    except Exception as e:
        logger.error(f"Error updating config file: {e}")
        # Don't fail the main operation if file update fails
        pass

@admin_credit_config_bp.route('/admin/credit-config/reset', methods=['POST'])
@admin_required
def reset_credit_config():
    """Reset credit configuration to default values"""
    try:
        # Default credit costs matching user requirements
        default_costs = {
            'combined_science_topical': 1,
            'combined_science_exam': 2,
            'math_topical': 1,
            'math_exam': 2,
            'math_graph_practice': 3,
            'english_topical': 1,
            'english_comprehension': 3,
            'english_essay_writing': 3,
            'audio_feature': 10,
            'voice_chat': 10
        }
        
        # Update the secure credit system
        secure_credit_system.SECURE_CREDIT_COSTS.update(default_costs)
        
        # Update config file
        update_config_file(default_costs)
        
        # Log the reset
        admin_user = session.get('admin_user', 'Unknown Admin')
        logger.info(f"Admin {admin_user} reset credit costs to defaults")
        
        flash('Credit configuration reset to default values!', 'success')
        return redirect(url_for('admin_credit_config.credit_config'))
        
    except Exception as e:
        logger.error(f"Error resetting credit config: {e}")
        flash('Error resetting credit configuration', 'error')
        return redirect(url_for('admin_credit_config.credit_config'))

@admin_credit_config_bp.route('/admin/credit-config/preview')
@admin_required
def preview_changes():
    """Preview how credit changes will affect users"""
    try:
        # Get sample user data to show impact
        sample_users = []
        # This would typically query recent users from database
        
        return render_template('admin/credit_preview.html', users=sample_users)
        
    except Exception as e:
        logger.error(f"Error generating credit preview: {e}")
        flash('Error generating preview', 'error')
        return redirect(url_for('admin_credit_config.credit_config'))