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
            
            # Insert default credit costs (units)
            default_costs = [
                # Combined Science (O-Level)
                {
                    'action_key': 'combined_science_topical',
                    'cost': 10,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (MCQ default)',
                    'description': '1 credit per MCQ (whole-credit pricing)'
                },
                {
                    'action_key': 'combined_science_topical_mcq',
                    'cost': 10,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (MCQ)',
                    'description': '1 credit per MCQ (whole-credit pricing)'
                },
                {
                    'action_key': 'combined_science_topical_structured',
                    'cost': 10,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (Structured)',
                    'description': '1 credit per structured question (whole-credit pricing)'
                },
                {
                    'action_key': 'combined_science_exam',
                    'cost': 10,
                    'category': 'Combined Science',
                    'component': 'Exam Questions',
                    'description': '1 credit per exam question (whole-credit pricing)'
                },

                # Mathematics (O-Level)
                {
                    'action_key': 'math_topical',
                    'cost': 10,
                    'category': 'Mathematics',
                    'component': 'Topical Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'math_exam',
                    'cost': 10,
                    'category': 'Mathematics',
                    'component': 'Exam Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'math_quiz',
                    'cost': 10,
                    'category': 'Mathematics',
                    'component': 'Quiz Questions (Streaming)',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'math_graph_practice',
                    'cost': 10,
                    'category': 'Mathematics',
                    'component': 'Graph Practice',
                    'description': '1 credit per graph/question/video'
                },

                # English (units)
                {
                    'action_key': 'english_topical',
                    'cost': 10,
                    'category': 'English',
                    'component': 'Topical Questions',
                    'description': '1 credit per question'
                },
                {
                    'action_key': 'english_comprehension',
                    'cost': 30,
                    'category': 'English',
                    'component': 'Comprehension',
                    'description': '3 credits per comprehension'
                },
                {
                    'action_key': 'english_essay_writing',
                    'cost': 30,
                    'category': 'English',
                    'component': 'Essay Writing',
                    'description': '3 credits per essay'
                },
                {
                    'action_key': 'english_essay_marking',
                    'cost': 30,
                    'category': 'English',
                    'component': 'Essay Marking',
                    'description': '3 credits per marking'
                },
                {
                    'action_key': 'english_comprehension_grading',
                    'cost': 30,
                    'category': 'English',
                    'component': 'Comprehension Grading',
                    'description': '3 credits per grading'
                },
                {
                    'action_key': 'english_summary_grading',
                    'cost': 30,
                    'category': 'English',
                    'component': 'Summary Grading',
                    'description': '3 credits per grading'
                },

                # Flashcards
                {
                    'action_key': 'flashcard_single',
                    'cost': 10,
                    'category': 'Study Tools',
                    'component': 'Flashcard Generation',
                    'description': '1 credit per flashcard (whole-credit pricing)'
                },

                # Audio / Live
                {
                    'action_key': 'audio_feature',
                    'cost': 10,
                    'category': 'Audio',
                    'component': 'Audio Feature',
                    'description': '1 credit per audio response'
                },
                {
                    'action_key': 'voice_chat',
                    'cost': 10,
                    'category': 'Audio',
                    'component': 'Live Voice (per 5s)',
                    'description': '1 credit per 5 seconds (whole-credit pricing)'
                },

                # AI Teacher (per response)
                {
                    'action_key': 'teacher_mode_start',
                    'cost': 10,
                    'category': 'AI Teacher',
                    'component': 'AI Response',
                    'description': '1 credit per AI response (whole-credit pricing)'
                },
                {
                    'action_key': 'teacher_mode_followup',
                    'cost': 10,
                    'category': 'AI Teacher',
                    'component': 'AI Response',
                    'description': '1 credit per AI response (whole-credit pricing)'
                },
                {
                    'action_key': 'teacher_mode_pdf',
                    'cost': 10,
                    'category': 'AI Teacher',
                    'component': 'PDF Notes',
                    'description': '1 credit per PDF'
                },

                # Project Assistant (per response)
                {
                    'action_key': 'project_assistant_start',
                    'cost': 10,
                    'category': 'Project Assistant',
                    'component': 'AI Response',
                    'description': '1 credit per AI response (whole-credit pricing)'
                },
                {
                    'action_key': 'project_assistant_followup',
                    'cost': 10,
                    'category': 'Project Assistant',
                    'component': 'AI Response',
                    'description': '1 credit per AI response (whole-credit pricing)'
                },
                {
                    'action_key': 'project_image_generation',
                    'cost': 20,
                    'category': 'Project Assistant',
                    'component': 'Image Generation',
                    'description': '2 credits per image'
                },
                {
                    'action_key': 'project_web_search',
                    'cost': 20,
                    'category': 'Project Assistant',
                    'component': 'Web Search',
                    'description': '2 credits per search'
                },
                {
                    'action_key': 'project_deep_research',
                    'cost': 50,
                    'category': 'Project Assistant',
                    'component': 'Deep Research',
                    'description': '5 credits per deep research'
                },
                {
                    'action_key': 'project_transcribe',
                    'cost': 20,
                    'category': 'Project Assistant',
                    'component': 'Audio Transcription',
                    'description': '2 credits per transcription'
                },

                # Virtual Lab
                {
                    'action_key': 'virtual_lab_knowledge_check',
                    'cost': 10,
                    'category': 'Virtual Lab',
                    'component': 'Knowledge Check',
                    'description': '1 credit per question (whole-credit pricing)'
                },

                # A-Level Mathematics
                {
                    'action_key': 'a_level_pure_math_topical',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Pure Math Topical Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_pure_math_exam',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Pure Math Exam Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },

                # A-Level Chemistry
                {
                    'action_key': 'a_level_chemistry_topical',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Chemistry Topical Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_chemistry_exam',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Chemistry Exam Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },

                # A-Level Physics
                {
                    'action_key': 'a_level_physics_topical',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Physics Topical Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_physics_exam',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Physics Exam Questions',
                    'description': '1 credit per question (whole-credit pricing)'
                },

                # A-Level Biology (MCQ vs structured/essay)
                {
                    'action_key': 'a_level_biology_topical_mcq',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Topical MCQ',
                    'description': '1 credit per MCQ (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_biology_topical_structured',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Topical Structured',
                    'description': '1 credit per structured question (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_biology_topical_essay',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Topical Essay',
                    'description': '1 credit per essay (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_biology_exam_mcq',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Exam MCQ',
                    'description': '1 credit per MCQ (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_biology_exam_structured',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Exam Structured',
                    'description': '1 credit per structured question (whole-credit pricing)'
                },
                {
                    'action_key': 'a_level_biology_exam_essay',
                    'cost': 10,
                    'category': 'A-Level',
                    'component': 'Biology Exam Essay',
                    'description': '1 credit per essay (whole-credit pricing)'
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
            # Combined Science (O-Level)
            'combined_science_topical': 10,
            'combined_science_topical_mcq': 10,
            'combined_science_topical_structured': 10,
            'combined_science_exam': 10,

            # Mathematics (O-Level)
            'math_topical': 10,
            'math_exam': 10,
            'math_quiz': 10,
            'math_graph_practice': 10,

            # English
            'english_topical': 10,
            'english_comprehension': 30,
            'english_essay_writing': 30,
            'english_essay_marking': 30,
            'english_comprehension_grading': 30,
            'english_summary_grading': 30,

            # Flashcards
            'flashcard_single': 10,

            # Audio & Vision
            'audio_feature': 10,
            'voice_chat': 10,
            'flashcard_audio': 30,
            'image_solve': 30,
            'graph_generation': 10,
            'ocr_solve': 30,

            # Virtual Lab
            'virtual_lab_knowledge_check': 10,

            # A-Level Subjects
            'a_level_pure_math_topical': 10,
            'a_level_pure_math_exam': 10,
            'a_level_chemistry_topical': 10,
            'a_level_chemistry_exam': 10,
            'a_level_physics_topical': 10,
            'a_level_physics_exam': 10,
            'a_level_biology_topical_mcq': 10,
            'a_level_biology_topical_structured': 10,
            'a_level_biology_topical_essay': 10,
            'a_level_biology_exam_mcq': 10,
            'a_level_biology_exam_structured': 10,
            'a_level_biology_exam_essay': 10,

            # AI Teacher
            'teacher_mode_start': 1,
            'teacher_mode_followup': 1,
            'teacher_mode_pdf': 10,
            'project_assistant_start': 2,
            'project_assistant_followup': 2,
            'project_assistant_batch': 2,

            # Project Assistant extras
            'project_web_search': 20,
            'project_deep_research': 50,
            'project_transcribe': 20,
            'project_image_generation': 20
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
