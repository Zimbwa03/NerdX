import logging
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import numpy as np
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

class AdvancedAnalyticsService:
    """Advanced analytics service for revenue, profit, and predictive analytics"""
    
    def __init__(self):
        # Operational costs configuration
        self.OPERATIONAL_COST_PER_CREDIT = 0.009  # $0.009 per credit
        self.SELLING_PRICE_PER_CREDIT = 0.02      # $0.02 per credit
        self.PROFIT_MARGIN_PER_CREDIT = self.SELLING_PRICE_PER_CREDIT - self.OPERATIONAL_COST_PER_CREDIT
        
        # AI API costs (estimated)
        self.AI_COSTS = {
            'gpt4_per_1k_tokens': 0.03,     # GPT-4 cost per 1k tokens
            'gpt35_per_1k_tokens': 0.002,   # GPT-3.5 cost per 1k tokens
            'whisper_per_minute': 0.006,    # Whisper audio cost per minute
            'image_analysis': 0.01,          # Image analysis cost per image
        }
        
        # Average token usage per feature
        self.TOKEN_USAGE = {
            'math_question': 500,       # Average tokens for math Q&A
            'science_question': 600,    # Average tokens for science Q&A
            'english_essay': 2000,      # Average tokens for essay marking
            'comprehension': 1500,      # Average tokens for comprehension
            'audio_response': 800,      # Average tokens for audio chat
            'graph_practice': 400,      # Average tokens for graph practice
        }
    
    def calculate_real_time_analytics(self) -> Dict:
        """Calculate comprehensive real-time analytics"""
        try:
            # Get all completed payments (using your actual payments table)
            payments = make_supabase_request(
                "GET", 
                "payment_transactions",
                select="*",
                filters={"status": "eq.approved"}
            )
            
            # Get all credit transactions (using your actual table structure)
            transactions = make_supabase_request(
                "GET",
                "credit_transactions",
                select="*"
            )
            
            # Get user registrations (using your actual table structure)
            user_registrations = make_supabase_request(
                "GET",
                "users_registration", 
                select="*"
            )
            
            # Get user stats (using your actual table structure)
            user_stats = make_supabase_request(
                "GET",
                "user_stats",
                select="*"
            )
            
            # Calculate revenue metrics
            total_revenue = sum(p.get('amount', 0) for p in (payments or []))
            total_credits_sold = sum(p.get('credits', 0) for p in (payments or []))
            
            # Calculate operational costs (using credit_transactions table)
            total_credits_used = sum(
                t.get('credits_change', 0) 
                for t in (transactions or []) 
                if t.get('credits_change', 0) > 0  # Positive values are usage
            )
            total_operational_cost = total_credits_used * self.OPERATIONAL_COST_PER_CREDIT
            
            # Calculate profit
            gross_profit = total_revenue - total_operational_cost
            profit_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0
            
            # User metrics
            total_users = len(user_registrations or [])
            active_users_30d = self._count_active_users_period(transactions, 30)
            active_users_7d = self._count_active_users_period(transactions, 7)
            active_users_1d = self._count_active_users_period(transactions, 1)
            
            # ARPU (Average Revenue Per User)
            arpu = total_revenue / total_users if total_users > 0 else 0
            
            # Feature usage breakdown
            feature_usage = self._analyze_feature_usage(transactions)
            
            # Package popularity
            package_breakdown = self._analyze_package_popularity(payments)
            
            # Time-based analytics
            revenue_by_day = self._calculate_revenue_by_period(payments, 'day', 30)
            revenue_by_month = self._calculate_revenue_by_period(payments, 'month', 12)
            
            # Credit utilization rate
            credit_utilization = (total_credits_used / total_credits_sold * 100) if total_credits_sold > 0 else 0
            
            # Average transaction value
            avg_transaction_value = total_revenue / len(payments) if payments else 0
            
            # Churn indicators
            churn_risk = self._calculate_churn_indicators(user_registrations, transactions)
            
            # Cost breakdown by feature
            cost_breakdown = self._calculate_cost_breakdown(transactions)
            
            return {
                'financial_metrics': {
                    'total_revenue': round(total_revenue, 2),
                    'total_operational_cost': round(total_operational_cost, 2),
                    'gross_profit': round(gross_profit, 2),
                    'profit_margin': round(profit_margin, 2),
                    'avg_transaction_value': round(avg_transaction_value, 2),
                    'total_transactions': len(payments or []),
                },
                'credit_metrics': {
                    'total_credits_sold': total_credits_sold,
                    'total_credits_used': total_credits_used,
                    'credit_utilization_rate': round(credit_utilization, 2),
                    'credits_remaining': total_credits_sold - total_credits_used,
                    'avg_cost_per_credit_sold': round(total_revenue / total_credits_sold, 4) if total_credits_sold > 0 else 0,
                },
                'user_metrics': {
                    'total_users': total_users,
                    'active_users_30d': active_users_30d,
                    'active_users_7d': active_users_7d,
                    'active_users_1d': active_users_1d,
                    'arpu': round(arpu, 2),
                    'user_retention_rate': self._calculate_retention_rate(user_registrations, transactions),
                },
                'feature_usage': feature_usage,
                'package_breakdown': package_breakdown,
                'revenue_trends': {
                    'daily': revenue_by_day,
                    'monthly': revenue_by_month,
                },
                'cost_breakdown': cost_breakdown,
                'churn_indicators': churn_risk,
                'timestamp': datetime.now().isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Error calculating real-time analytics: {e}")
            return {}
    
    def predict_future_revenue(self, days: int = 30) -> Dict:
        """Predict future revenue based on current trends"""
        try:
            # Get historical data
            payments = make_supabase_request(
                "GET", 
                "payments",
                select="*",
                filters={"status": "eq.completed"}
            )
            
            if not payments:
                return {'error': 'No payment data available for prediction'}
            
            # Sort payments by date
            payments.sort(key=lambda x: x.get('created_at', ''))
            
            # Calculate daily revenue for the last 30 days
            daily_revenues = self._calculate_revenue_by_period(payments, 'day', 30)
            
            if len(daily_revenues) < 7:
                return {'error': 'Insufficient data for prediction (need at least 7 days)'}
            
            # Simple linear regression for trend
            revenues = [r['revenue'] for r in daily_revenues]
            x = np.arange(len(revenues))
            y = np.array(revenues)
            
            # Calculate trend line
            coefficients = np.polyfit(x, y, 1)
            slope = coefficients[0]
            intercept = coefficients[1]
            
            # Predict future values
            predictions = []
            for i in range(days):
                future_day = len(revenues) + i
                predicted_revenue = slope * future_day + intercept
                predictions.append({
                    'day': i + 1,
                    'predicted_revenue': max(0, round(predicted_revenue, 2)),
                    'predicted_profit': max(0, round(predicted_revenue * (self.PROFIT_MARGIN_PER_CREDIT / self.SELLING_PRICE_PER_CREDIT), 2))
                })
            
            # Calculate growth metrics
            avg_daily_revenue = np.mean(revenues)
            revenue_growth_rate = (slope / avg_daily_revenue * 100) if avg_daily_revenue > 0 else 0
            
            # User activity prediction
            transactions = make_supabase_request("GET", "credit_transactions", select="*")
            daily_active_users = self._calculate_daily_active_users(transactions, 30)
            
            # Predict user growth
            if len(daily_active_users) >= 7:
                user_counts = [u['count'] for u in daily_active_users]
                user_coefficients = np.polyfit(np.arange(len(user_counts)), user_counts, 1)
                user_growth_rate = user_coefficients[0]
            else:
                user_growth_rate = 0
            
            return {
                'revenue_predictions': predictions,
                'total_predicted_revenue': sum(p['predicted_revenue'] for p in predictions),
                'total_predicted_profit': sum(p['predicted_profit'] for p in predictions),
                'revenue_growth_rate': round(revenue_growth_rate, 2),
                'user_growth_rate': round(user_growth_rate, 2),
                'confidence_level': self._calculate_prediction_confidence(revenues),
                'prediction_period_days': days,
                'based_on_days': len(revenues),
            }
            
        except Exception as e:
            logger.error(f"Error predicting future revenue: {e}")
            return {'error': str(e)}
    
    def generate_ai_recommendations(self) -> List[Dict]:
        """Generate AI-powered recommendations based on system analytics"""
        try:
            analytics = self.calculate_real_time_analytics()
            recommendations = []
            
            # Revenue optimization recommendations
            if analytics.get('financial_metrics', {}).get('profit_margin', 0) < 40:
                recommendations.append({
                    'category': 'Revenue Optimization',
                    'priority': 'HIGH',
                    'recommendation': 'Consider optimizing operational costs',
                    'details': f"Current profit margin is {analytics['financial_metrics']['profit_margin']}%. Target 50%+ by reducing AI token usage through caching frequent questions.",
                    'potential_impact': '+10% profit margin',
                    'implementation': 'Implement question/answer caching for common queries'
                })
            
            # User retention recommendations
            retention_rate = analytics.get('user_metrics', {}).get('user_retention_rate', 0)
            if retention_rate < 60:
                recommendations.append({
                    'category': 'User Retention',
                    'priority': 'HIGH',
                    'recommendation': 'Improve user engagement and retention',
                    'details': f"Current retention rate is {retention_rate}%. Implement gamification features and daily streaks.",
                    'potential_impact': '+20% user retention',
                    'implementation': 'Add daily login bonuses and achievement system'
                })
            
            # Credit utilization recommendations
            utilization = analytics.get('credit_metrics', {}).get('credit_utilization_rate', 0)
            if utilization < 70:
                recommendations.append({
                    'category': 'Credit Utilization',
                    'priority': 'MEDIUM',
                    'recommendation': 'Encourage higher credit usage',
                    'details': f"Only {utilization}% of purchased credits are being used. Send reminder notifications and suggest study plans.",
                    'potential_impact': '+15% revenue from repeat purchases',
                    'implementation': 'Automated study reminders and personalized recommendations'
                })
            
            # Feature usage recommendations
            feature_usage = analytics.get('feature_usage', {})
            underused_features = [f for f, usage in feature_usage.items() if usage.get('percentage', 0) < 10]
            if underused_features:
                recommendations.append({
                    'category': 'Feature Adoption',
                    'priority': 'MEDIUM',
                    'recommendation': 'Promote underutilized features',
                    'details': f"Features like {', '.join(underused_features[:3])} have low adoption. Create tutorials and incentives.",
                    'potential_impact': '+25% feature diversity',
                    'implementation': 'In-app feature tours and first-use bonuses'
                })
            
            # Pricing optimization
            avg_transaction = analytics.get('financial_metrics', {}).get('avg_transaction_value', 0)
            if avg_transaction < 5:
                recommendations.append({
                    'category': 'Pricing Strategy',
                    'priority': 'MEDIUM',
                    'recommendation': 'Introduce bundle packages',
                    'details': f"Average transaction is only ${avg_transaction}. Create value bundles to increase order value.",
                    'potential_impact': '+40% average order value',
                    'implementation': 'Add "Study Bundle" packages with bonus credits'
                })
            
            # Operational efficiency
            cost_breakdown = analytics.get('cost_breakdown', {})
            highest_cost_feature = max(cost_breakdown.items(), key=lambda x: x[1].get('total_cost', 0)) if cost_breakdown else None
            if highest_cost_feature:
                recommendations.append({
                    'category': 'Cost Optimization',
                    'priority': 'LOW',
                    'recommendation': f'Optimize {highest_cost_feature[0]} costs',
                    'details': f"{highest_cost_feature[0]} accounts for ${highest_cost_feature[1]['total_cost']:.2f} in costs. Consider using GPT-3.5 for simpler queries.",
                    'potential_impact': '-20% operational costs',
                    'implementation': 'Implement intelligent model selection based on query complexity'
                })
            
            # Growth recommendations
            predictions = self.predict_future_revenue(30)
            if predictions.get('revenue_growth_rate', 0) < 5:
                recommendations.append({
                    'category': 'Growth Strategy',
                    'priority': 'HIGH',
                    'recommendation': 'Accelerate user acquisition',
                    'details': "Revenue growth is below 5%. Implement referral program with credit bonuses.",
                    'potential_impact': '+50% new user acquisition',
                    'implementation': 'Launch "Refer a Friend" program with mutual benefits'
                })
            
            # Sort by priority
            priority_order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}
            recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating AI recommendations: {e}")
            return []
    
    def _count_active_users_period(self, transactions: List[Dict], days: int) -> int:
        """Count active users in the last N days"""
        if not transactions:
            return 0
        
        cutoff_date = datetime.now() - timedelta(days=days)
        active_users = set()
        
        for transaction in transactions:
            created_at = transaction.get('created_at')
            if created_at:
                tx_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                if tx_date >= cutoff_date:
                    active_users.add(transaction.get('user_id'))
        
        return len(active_users)
    
    def _analyze_feature_usage(self, transactions: List[Dict]) -> Dict:
        """Analyze usage by feature type"""
        feature_counts = {}
        total_transactions = 0
        
        if not transactions:
            return {}
        
        for transaction in transactions:
            # Use transaction_type from your actual schema
            feature = transaction.get('transaction_type', 'unknown')
            if transaction.get('credits_change', 0) > 0:  # Positive values are usage
                feature_counts[feature] = feature_counts.get(feature, 0) + 1
                total_transactions += 1
        
        # Calculate percentages
        feature_usage = {}
        for feature, count in feature_counts.items():
            feature_usage[feature] = {
                'count': count,
                'percentage': round(count / total_transactions * 100, 2) if total_transactions > 0 else 0
            }
        
        return feature_usage
    
    def _analyze_package_popularity(self, payments: List[Dict]) -> Dict:
        """Analyze package sales breakdown"""
        package_counts = {}
        package_revenue = {}
        
        if not payments:
            return {}
        
        for payment in payments:
            # Extract package type from transaction_reference or use credits as proxy
            credits = payment.get('credits', 0)
            # Map credits to package types based on your pricing structure
            if credits == 50:
                package = 'pocket'
            elif credits == 120:
                package = 'mini'
            elif credits == 350:
                package = 'quick'
            elif credits == 750:
                package = 'boost'
            else:
                package = f'custom_{credits}'
                
            amount = payment.get('amount', 0)
            
            package_counts[package] = package_counts.get(package, 0) + 1
            package_revenue[package] = package_revenue.get(package, 0) + amount
        
        # Create breakdown
        breakdown = {}
        total_count = sum(package_counts.values())
        total_revenue = sum(package_revenue.values())
        
        for package in package_counts:
            breakdown[package] = {
                'count': package_counts[package],
                'revenue': round(package_revenue[package], 2),
                'percentage_count': round(package_counts[package] / total_count * 100, 2) if total_count > 0 else 0,
                'percentage_revenue': round(package_revenue[package] / total_revenue * 100, 2) if total_revenue > 0 else 0
            }
        
        return breakdown
    
    def _calculate_revenue_by_period(self, payments: List[Dict], period: str, count: int) -> List[Dict]:
        """Calculate revenue by time period"""
        if not payments:
            return []
        
        revenue_by_period = {}
        now = datetime.now()
        
        for payment in payments:
            created_at = payment.get('created_at')
            if created_at:
                payment_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                
                # Determine period key
                if period == 'day':
                    period_key = payment_date.strftime('%Y-%m-%d')
                elif period == 'month':
                    period_key = payment_date.strftime('%Y-%m')
                else:
                    continue
                
                amount = payment.get('amount', 0)
                revenue_by_period[period_key] = revenue_by_period.get(period_key, 0) + amount
        
        # Convert to list and sort
        result = []
        for period_key, revenue in revenue_by_period.items():
            result.append({
                'period': period_key,
                'revenue': round(revenue, 2)
            })
        
        # Sort by period and take latest N
        result.sort(key=lambda x: x['period'], reverse=True)
        return result[:count]
    
    def _calculate_retention_rate(self, users: List[Dict], transactions: List[Dict]) -> float:
        """Calculate user retention rate"""
        if not users or not transactions:
            return 0
        
        # Users who registered more than 30 days ago
        cutoff_date = datetime.now() - timedelta(days=30)
        eligible_users = set()
        
        for user in users:
            created_at = user.get('created_at')
            if created_at:
                reg_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                if reg_date <= cutoff_date:
                    eligible_users.add(user.get('user_id'))
        
        if not eligible_users:
            return 100  # All users are new
        
        # Check who was active in the last 30 days
        active_users = set()
        activity_cutoff = datetime.now() - timedelta(days=30)
        
        for transaction in transactions:
            created_at = transaction.get('created_at')
            user_id = transaction.get('user_id')
            if created_at and user_id in eligible_users:
                tx_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                if tx_date >= activity_cutoff:
                    active_users.add(user_id)
        
        retention_rate = len(active_users) / len(eligible_users) * 100 if eligible_users else 0
        return round(retention_rate, 2)
    
    def _calculate_churn_indicators(self, users: List[Dict], transactions: List[Dict]) -> Dict:
        """Calculate churn risk indicators"""
        if not users or not transactions:
            return {}
        
        # Group transactions by user
        user_activity = {}
        for transaction in transactions:
            user_id = transaction.get('user_id')
            created_at = transaction.get('created_at')
            if user_id and created_at:
                if user_id not in user_activity:
                    user_activity[user_id] = []
                user_activity[user_id].append(created_at)
        
        # Analyze churn risk
        high_risk = 0
        medium_risk = 0
        low_risk = 0
        
        now = datetime.now()
        for user_id, activities in user_activity.items():
            # Sort activities by date
            activities.sort()
            last_activity = datetime.fromisoformat(activities[-1].replace('Z', '+00:00'))
            days_inactive = (now - last_activity).days
            
            if days_inactive > 21:
                high_risk += 1
            elif days_inactive > 14:
                medium_risk += 1
            else:
                low_risk += 1
        
        total_users = len(user_activity)
        return {
            'high_risk_count': high_risk,
            'high_risk_percentage': round(high_risk / total_users * 100, 2) if total_users > 0 else 0,
            'medium_risk_count': medium_risk,
            'medium_risk_percentage': round(medium_risk / total_users * 100, 2) if total_users > 0 else 0,
            'low_risk_count': low_risk,
            'low_risk_percentage': round(low_risk / total_users * 100, 2) if total_users > 0 else 0,
        }
    
    def _calculate_cost_breakdown(self, transactions: List[Dict]) -> Dict:
        """Calculate operational cost breakdown by feature"""
        feature_costs = {}
        
        if not transactions:
            return {}
        
        for transaction in transactions:
            if transaction.get('credits_change', 0) > 0:  # Positive values are usage
                feature = transaction.get('transaction_type', 'unknown')
                credits_used = transaction.get('credits_used', 0)
                cost = credits_used * self.OPERATIONAL_COST_PER_CREDIT
                
                if feature not in feature_costs:
                    feature_costs[feature] = {
                        'total_credits': 0,
                        'total_cost': 0,
                        'transaction_count': 0
                    }
                
                feature_costs[feature]['total_credits'] += credits_used
                feature_costs[feature]['total_cost'] += cost
                feature_costs[feature]['transaction_count'] += 1
        
        # Calculate averages
        for feature in feature_costs:
            count = feature_costs[feature]['transaction_count']
            feature_costs[feature]['avg_credits_per_use'] = round(
                feature_costs[feature]['total_credits'] / count, 2
            )
            feature_costs[feature]['avg_cost_per_use'] = round(
                feature_costs[feature]['total_cost'] / count, 4
            )
            feature_costs[feature]['total_cost'] = round(feature_costs[feature]['total_cost'], 2)
        
        return feature_costs
    
    def _calculate_daily_active_users(self, transactions: List[Dict], days: int) -> List[Dict]:
        """Calculate daily active users for the last N days"""
        daily_users = {}
        
        if not transactions:
            return []
        
        for transaction in transactions:
            created_at = transaction.get('created_at')
            user_id = transaction.get('user_id')
            if created_at and user_id:
                date = datetime.fromisoformat(created_at.replace('Z', '+00:00')).strftime('%Y-%m-%d')
                if date not in daily_users:
                    daily_users[date] = set()
                daily_users[date].add(user_id)
        
        # Convert to list
        result = []
        for date, users in daily_users.items():
            result.append({
                'date': date,
                'count': len(users)
            })
        
        # Sort and take latest N days
        result.sort(key=lambda x: x['date'], reverse=True)
        return result[:days]
    
    def _calculate_prediction_confidence(self, data_points: List[float]) -> str:
        """Calculate confidence level for predictions"""
        if len(data_points) < 7:
            return 'LOW'
        elif len(data_points) < 14:
            return 'MEDIUM'
        else:
            # Check variance for stability
            variance = np.var(data_points)
            mean = np.mean(data_points)
            cv = (np.sqrt(variance) / mean * 100) if mean > 0 else 100
            
            if cv < 20:
                return 'HIGH'
            elif cv < 40:
                return 'MEDIUM'
            else:
                return 'LOW'

# Global instance
advanced_analytics_service = AdvancedAnalyticsService()
