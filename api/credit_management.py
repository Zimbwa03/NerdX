"""
Credit Management API Routes
Dashboard interface for managing dynamic credit costs
"""

import logging
from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from database.credit_costs_db import credit_cost_service, create_credit_costs_table
from api.auth import login_required  # Import existing authentication decorator

logger = logging.getLogger(__name__)

# Create blueprint
credit_management_bp = Blueprint('credit_management', __name__)

@credit_management_bp.route('/admin/credit-costs')
@login_required
def credit_costs_dashboard():
    """Display credit costs management dashboard"""
    try:
        # Get costs grouped by category
        costs_by_category = credit_cost_service.get_costs_by_category()
        
        return render_template('admin/credit_costs.html', 
                             costs_by_category=costs_by_category,
                             admin_user=getattr(request, 'admin_user', None))
    except Exception as e:
        logger.error(f"Error loading credit costs dashboard: {e}")
        return render_template('admin/error.html', 
                             error="Failed to load credit costs dashboard",
                             admin_user=getattr(request, 'admin_user', None)), 500

@credit_management_bp.route('/api/credit-costs')
@login_required  
def get_credit_costs():
    """API endpoint to get all credit costs"""
    try:
        costs_by_category = credit_cost_service.get_costs_by_category()
        return jsonify({
            'success': True,
            'data': costs_by_category
        })
    except Exception as e:
        logger.error(f"Error getting credit costs: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@credit_management_bp.route('/api/credit-costs/<action_key>', methods=['PUT'])
@login_required
def update_credit_cost(action_key):
    """API endpoint to update a specific credit cost"""
    try:
        data = request.get_json()
        new_cost = data.get('cost')
        
        if not isinstance(new_cost, int) or new_cost < 0:
            return jsonify({
                'success': False,
                'error': 'Invalid cost value. Must be a non-negative integer.'
            }), 400
        
        # Update the credit cost
        success = credit_cost_service.update_credit_cost(action_key, new_cost)
        
        if success:
            admin_email = getattr(request, 'admin_user', {}).get('email', 'Unknown')
            logger.info(f"Admin {admin_email} updated credit cost for '{action_key}' to {new_cost}")
            return jsonify({
                'success': True,
                'message': f'Successfully updated credit cost for {action_key} to {new_cost}'
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Failed to update credit cost for {action_key}'
            }), 500
            
    except Exception as e:
        logger.error(f"Error updating credit cost for {action_key}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@credit_management_bp.route('/api/credit-costs/batch-update', methods=['POST'])
@login_required
def batch_update_credit_costs():
    """API endpoint to update multiple credit costs at once"""
    try:
        data = request.get_json()
        updates = data.get('updates', [])
        
        if not isinstance(updates, list):
            return jsonify({
                'success': False,
                'error': 'Updates must be a list of {action_key, cost} objects'
            }), 400
        
        results = []
        errors = []
        
        for update in updates:
            action_key = update.get('action_key')
            new_cost = update.get('cost')
            
            if not action_key or not isinstance(new_cost, int) or new_cost < 0:
                errors.append(f"Invalid update for {action_key}: cost must be non-negative integer")
                continue
            
            success = credit_cost_service.update_credit_cost(action_key, new_cost)
            if success:
                results.append(f"Updated {action_key} to {new_cost}")
                admin_email = getattr(request, 'admin_user', {}).get('email', 'Unknown')
                logger.info(f"Admin {admin_email} updated {action_key} to {new_cost}")
            else:
                errors.append(f"Failed to update {action_key}")
        
        return jsonify({
            'success': len(errors) == 0,
            'results': results,
            'errors': errors,
            'message': f'Successfully updated {len(results)} credit costs'
        })
        
    except Exception as e:
        logger.error(f"Error in batch update: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@credit_management_bp.route('/api/credit-costs/initialize', methods=['POST'])
@login_required
def initialize_credit_costs_table():
    """API endpoint to initialize the credit costs table"""
    try:
        success = create_credit_costs_table()
        
        if success:
            admin_email = getattr(request, 'admin_user', {}).get('email', 'Unknown')
            logger.info(f"Admin {admin_email} initialized credit costs table")
            return jsonify({
                'success': True,
                'message': 'Credit costs table initialized successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to initialize credit costs table'
            }), 500
            
    except Exception as e:
        logger.error(f"Error initializing credit costs table: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@credit_management_bp.route('/api/credit-costs/test')
@login_required
def test_credit_system():
    """API endpoint to test the credit system with current costs"""
    try:
        from services.advanced_credit_service import advanced_credit_service
        
        # Test common actions
        test_actions = [
            'combined_science_topical',
            'combined_science_exam',
            'math_topical',
            'math_exam',
            'math_graph_practice',
            'english_topical',
            'english_comprehension',
            'english_essay_writing',
            'audio_feature',
            'voice_chat',
            'image_solve'
        ]
        
        results = {}
        for action in test_actions:
            try:
                cost = advanced_credit_service.get_credit_cost(action)
                results[action] = {
                    'cost': cost,
                    'status': 'OK'
                }
            except Exception as e:
                results[action] = {
                    'cost': None,
                    'status': f'Error: {str(e)}'
                }
        
        return jsonify({
            'success': True,
            'test_results': results,
            'message': 'Credit system test completed'
        })
        
    except Exception as e:
        logger.error(f"Error testing credit system: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
