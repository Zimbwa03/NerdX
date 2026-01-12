"""
Credit Costs Database Management
Handles dynamic credit cost configuration with database storage
"""

import logging
import os
from typing import Dict, Optional, List
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.environ.get('DATABASE_URL')

def clean_database_url(url):
    """Remove problematic parameters from database URL"""
    if url and "postgresql://" in url:
        cleaned_url = url.split('?')[0]
        return cleaned_url
    return url

Base = declarative_base()

if DATABASE_URL:
    cleaned_db_url = clean_database_url(DATABASE_URL)
    engine = create_engine(cleaned_db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    DATABASE_AVAILABLE = True
else:
    engine = None
    SessionLocal = None
    DATABASE_AVAILABLE = False
    logger.warning("DATABASE_URL not found - credit costs will use config defaults")

class CreditCost(Base):
    """Model for storing dynamic credit costs"""
    __tablename__ = 'credit_costs'
    
    id = Column(Integer, primary_key=True, index=True)
    action_key = Column(String(100), unique=True, index=True, nullable=False)  # e.g., 'combined_science_topical'
    cost = Column(Integer, nullable=False)  # Credit cost for this action
    category = Column(String(50), nullable=False)  # e.g., 'Combined Science', 'Mathematics', 'English'
    component = Column(String(100), nullable=False)  # e.g., 'Topical Questions', 'Exam', 'Comprehension'
    description = Column(Text)  # Human-readable description
    is_active = Column(Boolean, default=True)  # Whether this cost is active
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def create_credit_costs_table():
    """Create the credit costs table with initial data"""
    try:
        if not DATABASE_AVAILABLE:
            logger.error("No database available - cannot create credit costs table")
            return False
            
        # Create table
        Base.metadata.create_all(bind=engine)
        
        # Insert default credit costs
        session = SessionLocal()
        try:
            # Check if we already have data
            existing_count = session.query(CreditCost).count()
            if existing_count > 0:
                logger.info(f"Credit costs table already has {existing_count} entries")
                return True
            
            # Insert default credit costs from config
            default_costs = [
                # Combined Science
                {
                    'action_key': 'combined_science_topical',
                    'cost': 1,
                    'category': 'Combined Science',
                    'component': 'Topical Questions',
                    'description': 'Credit cost for Combined Science topical questions'
                },
                {
                    'action_key': 'combined_science_exam',
                    'cost': 3,
                    'category': 'Combined Science',
                    'component': 'Exam Practice',
                    'description': 'Credit cost for Combined Science exam practice'
                },
                
                # Mathematics
                {
                    'action_key': 'math_topical',
                    'cost': 1,
                    'category': 'Mathematics',
                    'component': 'Topical Questions',
                    'description': 'Credit cost for Mathematics topical questions'
                },
                {
                    'action_key': 'math_exam',
                    'cost': 3,
                    'category': 'Mathematics',
                    'component': 'Exam Practice',
                    'description': 'Credit cost for Mathematics exam practice'
                },
                {
                    'action_key': 'math_graph_practice',
                    'cost': 3,
                    'category': 'Mathematics',
                    'component': 'Graph Practice',
                    'description': 'Credit cost for Mathematics graph generation'
                },
                
                # English
                {
                    'action_key': 'english_topical',
                    'cost': 1,
                    'category': 'English',
                    'component': 'Topical Questions',
                    'description': 'Credit cost for English topical questions'
                },
                {
                    'action_key': 'english_comprehension',
                    'cost': 3,
                    'category': 'English',
                    'component': 'Comprehension',
                    'description': 'Credit cost for English comprehension exercises'
                },
                {
                    'action_key': 'english_essay_writing',
                    'cost': 4,
                    'category': 'English',
                    'component': 'Essay Writing',
                    'description': 'Credit cost for English essay writing'
                },
                
                # Premium Features
                {
                    'action_key': 'audio_feature',
                    'cost': 2,
                    'category': 'Premium Features',
                    'component': 'Audio Chat/TTS',
                    'description': 'Credit cost for basic audio features'
                },
                {
                    'action_key': 'voice_chat',
                    'cost': 3,
                    'category': 'Premium Features',
                    'component': 'Voice Chat',
                    'description': 'Credit cost for full voice chat interactions (per minute)'
                },
                {
                    'action_key': 'flashcard_audio',
                    'cost': 3,
                    'category': 'Premium Features',
                    'component': 'Audio Flashcards',
                    'description': 'Credit cost for generating audio flashcards'
                },
                
                # AI Teacher & Assistant
                {
                    'action_key': 'teacher_mode_start',
                    'cost': 3,
                    'category': 'AI Teacher',
                    'component': 'Start Session',
                    'description': 'Initial setup for AI Teacher session'
                },
                {
                    'action_key': 'teacher_mode_followup',
                    'cost': 0,
                    'category': 'AI Teacher',
                    'component': 'Follow-up Chat',
                    'description': 'Free follow-up chat with AI Teacher'
                },
                {
                    'action_key': 'teacher_mode_pdf',
                    'cost': 2,
                    'category': 'AI Teacher',
                    'component': 'PDF Notes',
                    'description': 'Generate PDF notes from session'
                },
                {
                    'action_key': 'project_assistant_start',
                    'cost': 3,
                    'category': 'Project Assistant',
                    'component': 'Start Session',
                    'description': 'Initial setup for Project Assistant'
                },
                {
                    'action_key': 'project_assistant_followup',
                    'cost': 0,
                    'category': 'Project Assistant',
                    'component': 'Follow-up Chat',
                    'description': 'Free follow-up chat with Project Assistant'
                },

                # A-Level Subjects
                {
                    'action_key': 'a_level_biology',
                    'cost': 2,
                    'category': 'A-Level',
                    'component': 'Biology Questions',
                    'description': 'Credit cost for A-Level Biology'
                },
                {
                    'action_key': 'a_level_chemistry',
                    'cost': 2,
                    'category': 'A-Level',
                    'component': 'Chemistry Questions',
                    'description': 'Credit cost for A-Level Chemistry'
                },
                {
                    'action_key': 'a_level_physics',
                    'cost': 2,
                    'category': 'A-Level',
                    'component': 'Physics Questions',
                    'description': 'Credit cost for A-Level Physics'
                },
                {
                    'action_key': 'a_level_math',
                    'cost': 2,
                    'category': 'A-Level',
                    'component': 'Pure Math Questions',
                    'description': 'Credit cost for A-Level Mathematics'
                }
            ]
            
            for cost_data in default_costs:
                credit_cost = CreditCost(**cost_data)
                session.add(credit_cost)
            
            session.commit()
            logger.info(f"Successfully created credit costs table with {len(default_costs)} default entries")
            return True
            
        except Exception as e:
            logger.error(f"Error inserting default credit costs: {e}")
            session.rollback()
            return False
        finally:
            session.close()
            
    except Exception as e:
        logger.error(f"Error creating credit costs table: {e}")
        return False

class CreditCostService:
    """Service for managing dynamic credit costs"""
    
    def __init__(self):
        self.fallback_costs = {
            # Default costs from config - used when database is unavailable
            'combined_science_topical': 1,
            'combined_science_exam': 3,
            'math_topical': 1,
            'math_exam': 3,
            'math_graph_practice': 3,
            'english_topical': 1,
            'english_comprehension': 3,
            'english_essay_writing': 4,
            
            # Premium & Audio
            'audio_feature': 0,
            'voice_chat': 3,
            'flashcard_audio': 3,
            'image_solve': 3,
            'graph_generation': 3,
            'ocr_solve': 3,
            
            # A-Level Subjects
            'a_level_biology': 2,
            'a_level_chemistry': 2,
            'a_level_physics': 2,
            'a_level_math': 2,
            
            # AI Teacher
            'teacher_mode_start': 3,
            'teacher_mode_followup': 0,
            'teacher_mode_pdf': 2,
            'project_assistant_start': 3,
            'project_assistant_followup': 0
        }
    
    def get_credit_cost(self, action_key: str) -> int:
        """Get credit cost for an action from database or fallback to config"""
        try:
            if not DATABASE_AVAILABLE or not SessionLocal:
                logger.warning("No database session available, using fallback costs")
                return self.fallback_costs.get(action_key, 5)
            
            session = SessionLocal()
            try:
                credit_cost = session.query(CreditCost).filter_by(
                    action_key=action_key, 
                    is_active=True
                ).first()
                
                if credit_cost:
                    return credit_cost.cost
                else:
                    # Not found in database, use fallback
                    fallback_cost = self.fallback_costs.get(action_key, 5)
                    logger.warning(f"Credit cost for '{action_key}' not found in database, using fallback: {fallback_cost}")
                    return fallback_cost
                    
            finally:
                session.close()
                
        except Exception as e:
            logger.error(f"Error getting credit cost for '{action_key}': {e}")
            return self.fallback_costs.get(action_key, 5)
    
    def update_credit_cost(self, action_key: str, new_cost: int) -> bool:
        """Update credit cost for an action"""
        try:
            if not DATABASE_AVAILABLE or not SessionLocal:
                logger.error("No database session available for updating credit costs")
                return False
            
            session = SessionLocal()
            try:
                credit_cost = session.query(CreditCost).filter_by(action_key=action_key).first()
                
                if credit_cost:
                    credit_cost.cost = new_cost
                    credit_cost.updated_at = datetime.utcnow()
                    session.commit()
                    logger.info(f"Updated credit cost for '{action_key}' to {new_cost}")
                    return True
                else:
                    logger.error(f"Credit cost entry for '{action_key}' not found")
                    return False
                    
            except Exception as e:
                logger.error(f"Error updating credit cost: {e}")
                session.rollback()
                return False
            finally:
                session.close()
                
        except Exception as e:
            logger.error(f"Error in update_credit_cost: {e}")
            return False
    
    def get_all_credit_costs(self) -> List[Dict]:
        """Get all credit costs for dashboard display"""
        try:
            if not DATABASE_AVAILABLE or not SessionLocal:
                logger.warning("No database session available, returning fallback costs")
                result = []
                for action_key, cost in self.fallback_costs.items():
                    result.append({
                        'action_key': action_key,
                        'cost': cost,
                        'category': 'Unknown',
                        'component': action_key.replace('_', ' ').title(),
                        'description': f'Default cost for {action_key}',
                        'is_active': True
                    })
                return result
            
            session = SessionLocal()
            try:
                credit_costs = session.query(CreditCost).filter_by(is_active=True).all()
                
                result = []
                for cc in credit_costs:
                    result.append({
                        'id': cc.id,
                        'action_key': cc.action_key,
                        'cost': cc.cost,
                        'category': cc.category,
                        'component': cc.component,
                        'description': cc.description,
                        'is_active': cc.is_active,
                        'updated_at': cc.updated_at.isoformat() if cc.updated_at else None
                    })
                
                return result
                
            finally:
                session.close()
                
        except Exception as e:
            logger.error(f"Error getting all credit costs: {e}")
            return []
    
    def get_costs_by_category(self) -> Dict[str, List[Dict]]:
        """Get credit costs grouped by category for dashboard"""
        try:
            all_costs = self.get_all_credit_costs()
            
            categories = {}
            for cost in all_costs:
                category = cost.get('category', 'Other')
                if category not in categories:
                    categories[category] = []
                categories[category].append(cost)
            
            return categories
            
        except Exception as e:
            logger.error(f"Error getting costs by category: {e}")
            return {}
    
    def add_credit_cost(self, action_key: str, cost: int, category: str, component: str, description: str = None) -> bool:
        """Add a new credit cost or update existing one"""
        try:
            if not DATABASE_AVAILABLE or not SessionLocal:
                logger.error("No database session available for adding credit costs")
                return False
            
            session = SessionLocal()
            try:
                # Check if it already exists
                existing = session.query(CreditCost).filter_by(action_key=action_key).first()
                
                if existing:
                    # Update existing
                    existing.cost = cost
                    existing.category = category
                    existing.component = component
                    existing.description = description or existing.description
                    existing.is_active = True
                    existing.updated_at = datetime.utcnow()
                    logger.info(f"Updated credit cost for '{action_key}' to {cost}")
                else:
                    # Add new
                    credit_cost = CreditCost(
                        action_key=action_key,
                        cost=cost,
                        category=category,
                        component=component,
                        description=description or f'Credit cost for {action_key}',
                        is_active=True
                    )
                    session.add(credit_cost)
                    logger.info(f"Added credit cost for '{action_key}': {cost}")
                
                session.commit()
                return True
                
            except Exception as e:
                logger.error(f"Error adding/updating credit cost: {e}")
                session.rollback()
                return False
            finally:
                session.close()
                
        except Exception as e:
            logger.error(f"Error in add_credit_cost: {e}")
            return False

# Create service instance
credit_cost_service = CreditCostService()
