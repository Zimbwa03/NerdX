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
                    'cost': 3,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (MCQ default)',
                    'description': '0.25 credit per MCQ'
                },
                {
                    'action_key': 'combined_science_topical_mcq',
                    'cost': 3,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (MCQ)',
                    'description': '0.25 credit per MCQ'
                },
                {
                    'action_key': 'combined_science_topical_structured',
                    'cost': 5,
                    'category': 'Combined Science',
                    'component': 'Topical Questions (Structured)',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'combined_science_exam',
                    'cost': 5,
                    'category': 'Combined Science',
                    'component': 'Exam Questions',
                    'description': '0.5 credit per exam question'
                },

                # Computer Science (O-Level) – MCQ 0.3, Structured 0.5, Essay 1
                {
                    'action_key': 'computer_science_topical_mcq',
                    'cost': 3,
                    'category': 'Computer Science',
                    'component': 'Topical MCQ',
                    'description': '0.3 credit per MCQ (1 credit = 3 MCQs)'
                },
                {
                    'action_key': 'computer_science_topical_structured',
                    'cost': 5,
                    'category': 'Computer Science',
                    'component': 'Topical Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'computer_science_topical_essay',
                    'cost': 10,
                    'category': 'Computer Science',
                    'component': 'Topical Essay',
                    'description': '1 credit per essay question'
                },
                {
                    'action_key': 'computer_science_exam_mcq',
                    'cost': 5,
                    'category': 'Computer Science',
                    'component': 'Exam MCQ',
                    'description': '0.3 credit per exam MCQ'
                },
                {
                    'action_key': 'computer_science_exam_structured',
                    'cost': 5,
                    'category': 'Computer Science',
                    'component': 'Exam Structured',
                    'description': '0.5 credit per exam structured'
                },
                {
                    'action_key': 'computer_science_exam_essay',
                    'cost': 5,
                    'category': 'Computer Science',
                    'component': 'Exam Essay',
                    'description': '1 credit per exam essay'
                },

                # Mathematics (O-Level)
                {
                    'action_key': 'math_topical',
                    'cost': 5,
                    'category': 'Mathematics',
                    'component': 'Topical Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'math_exam',
                    'cost': 5,
                    'category': 'Mathematics',
                    'component': 'Exam Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'math_quiz',
                    'cost': 5,
                    'category': 'Mathematics',
                    'component': 'Quiz Questions (Streaming)',
                    'description': '0.5 credit per question'
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
                    'cost': 5,
                    'category': 'English',
                    'component': 'Topical Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'english_comprehension',
                    'cost': 20,
                    'category': 'English',
                    'component': 'Comprehension',
                    'description': '2 credits per comprehension'
                },
                {
                    'action_key': 'english_essay_writing',
                    'cost': 20,
                    'category': 'English',
                    'component': 'Essay Writing',
                    'description': '2 credits per essay'
                },
                {
                    'action_key': 'english_essay_marking',
                    'cost': 20,
                    'category': 'English',
                    'component': 'Essay Marking',
                    'description': '2 credits per marking'
                },
                {
                    'action_key': 'english_comprehension_grading',
                    'cost': 10,
                    'category': 'English',
                    'component': 'Comprehension Grading',
                    'description': '1 credit per grading'
                },
                {
                    'action_key': 'english_summary_grading',
                    'cost': 10,
                    'category': 'English',
                    'component': 'Summary Grading',
                    'description': '1 credit per grading'
                },

                # Flashcards
                {
                    'action_key': 'flashcard_single',
                    'cost': 3,
                    'category': 'Study Tools',
                    'component': 'Flashcard Generation',
                    'description': '0.25 credit per flashcard'
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
                    'cost': 1,
                    'category': 'AI Teacher',
                    'component': 'AI Response',
                    'description': '0.1 credit per AI response'
                },
                {
                    'action_key': 'teacher_mode_followup',
                    'cost': 1,
                    'category': 'AI Teacher',
                    'component': 'AI Response',
                    'description': '0.1 credit per AI response'
                },
                {
                    'action_key': 'teacher_mode_pdf',
                    'cost': 20,
                    'category': 'AI Teacher',
                    'component': 'PDF Notes',
                    'description': '2 credits per PDF'
                },

                # Project Assistant (per response)
                {
                    'action_key': 'project_assistant_start',
                    'cost': 1,
                    'category': 'Project Assistant',
                    'component': 'AI Response',
                    'description': '0.1 credit per AI response'
                },
                {
                    'action_key': 'project_assistant_followup',
                    'cost': 1,
                    'category': 'Project Assistant',
                    'component': 'AI Response',
                    'description': '0.1 credit per AI response'
                },
                {
                    'action_key': 'project_image_generation',
                    'cost': 30,
                    'category': 'Project Assistant',
                    'component': 'Image Generation',
                    'description': '3 credits per image'
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
                    'cost': 20,
                    'category': 'Project Assistant',
                    'component': 'Deep Research',
                    'description': '2 credits per deep research'
                },
                {
                    'action_key': 'project_transcribe',
                    'cost': 1,
                    'category': 'Project Assistant',
                    'component': 'Audio Transcription',
                    'description': '0.1 credit per transcription'
                },

                # Virtual Lab
                {
                    'action_key': 'virtual_lab_knowledge_check',
                    'cost': 3,
                    'category': 'Virtual Lab',
                    'component': 'Knowledge Check',
                    'description': '0.25 credit per question'
                },

                # A-Level Mathematics
                {
                    'action_key': 'a_level_pure_math_topical',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Pure Math Topical Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'a_level_pure_math_topical_mcq',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Pure Math Topical MCQ',
                    'description': '0.5 credit per MCQ'
                },
                {
                    'action_key': 'a_level_pure_math_topical_structured',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Pure Math Topical Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'a_level_pure_math_exam',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Pure Math Exam Questions',
                    'description': '0.5 credit per question'
                },

                # A-Level Chemistry
                {
                    'action_key': 'a_level_chemistry_topical',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Chemistry Topical Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'a_level_chemistry_topical_mcq',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Chemistry Topical MCQ',
                    'description': '0.5 credit per MCQ'
                },
                {
                    'action_key': 'a_level_chemistry_topical_structured',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Chemistry Topical Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'a_level_chemistry_exam',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Chemistry Exam Questions',
                    'description': '0.5 credit per question'
                },

                # A-Level Physics
                {
                    'action_key': 'a_level_physics_topical',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Physics Topical Questions',
                    'description': '0.5 credit per question'
                },
                {
                    'action_key': 'a_level_physics_topical_mcq',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Physics Topical MCQ',
                    'description': '0.5 credit per MCQ'
                },
                {
                    'action_key': 'a_level_physics_topical_structured',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Physics Topical Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'a_level_physics_exam',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Physics Exam Questions',
                    'description': '0.5 credit per question'
                },

                # A-Level Biology (MCQ vs structured/essay)
                {
                    'action_key': 'a_level_biology_topical_mcq',
                    'cost': 3,
                    'category': 'A-Level',
                    'component': 'Biology Topical MCQ',
                    'description': '0.25 credit per MCQ'
                },
                {
                    'action_key': 'a_level_biology_topical_structured',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Biology Topical Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'a_level_biology_topical_essay',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Biology Topical Essay',
                    'description': '0.5 credit per essay'
                },
                {
                    'action_key': 'a_level_biology_exam_mcq',
                    'cost': 3,
                    'category': 'A-Level',
                    'component': 'Biology Exam MCQ',
                    'description': '0.25 credit per MCQ'
                },
                {
                    'action_key': 'a_level_biology_exam_structured',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Biology Exam Structured',
                    'description': '0.5 credit per structured question'
                },
                {
                    'action_key': 'a_level_biology_exam_essay',
                    'cost': 5,
                    'category': 'A-Level',
                    'component': 'Biology Exam Essay',
                    'description': '0.5 credit per essay'
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
        # Option B Fallback Costs: Commands (bundled), AI (1 credit), Complex (2 credits)
        self.fallback_costs = {
            # ============================================
            # COMMANDS: 1 Credit = 2 Commands (Bundled)
            # ============================================
            # Note: Bundling handled in command_credit_tracker service
            'menu_navigation': 10,         # 1 credit (bundled: 2 commands = 1 credit)
            'help_command': 10,            # 1 credit (bundled)
            'check_balance': 10,           # 1 credit (bundled)
            'settings_access': 10,          # 1 credit (bundled)
            'registration_step': 10,        # 1 credit (bundled)

            # ============================================
            # AI-GENERATED CONTENT: Mobile App Pricing
            # ============================================
            # Combined Science (O-Level) – 0.5 credit each
            'combined_science_topical': 5,
            'combined_science_topical_mcq': 5,
            'combined_science_topical_structured': 5,
            'combined_science_exam': 5,

            # Computer Science (O-Level) – MCQ 0.3, Structured 0.5, Essay 1 (10 units = 1 credit)
            'computer_science_topical_mcq': 3,   # 0.3 credit (3 units) – 1 credit = 3 MCQs
            'computer_science_topical_structured': 5,  # 0.5 credit (5 units)
            'computer_science_topical_essay': 10,  # 1 credit (10 units)
            'computer_science_exam_mcq': 3,   # 0.3 credit per exam MCQ (3 units) - 1 credit = 3 MCQs
            'computer_science_exam_structured': 5,  # 0.5 credit per exam structured (5 units)
            'computer_science_exam_essay': 10,  # 1 credit per exam essay (10 units)

            # Mathematics (O-Level) – 0.5 credit each
            'math_topical': 5,
            'math_exam': 5,
            'math_quiz': 5,
            'math_graph_practice': 5,
            'graph_generation': 5,

            # English (Topical)
            'english_topical': 5,  # 0.5 credit

            # AI Teacher Mode
            'teacher_mode_start': 1,  # 0.1 credit
            'teacher_mode_followup': 1,  # 0.1 credit

            # Project Assistant (Basic) – 0.2 credit each
            'project_assistant_start': 2,
            'project_assistant_followup': 2,

            # Study Tools & Virtual Lab – 0.3 / 0.1 credit
            'flashcard_single': 3,  # 0.3 credit
            'virtual_lab_knowledge_check': 3,  # 0.3 credit
            'geo_maps_feedback': 1,  # 0.1 credit
            'programming_lab_ai': 1,  # 0.1 credit

            # ============================================
            # COMPLEX FEATURES: Mobile App Pricing
            # ============================================
            # English (Complex) – 2 credits each
            'english_comprehension': 20,
            'english_essay_writing': 20,
            'english_essay_marking': 20,
            'english_comprehension_grading': 20,
            'english_summary_grading': 20,

            # A-Level Subjects (All)
            'a_level_pure_math_topical': 5,  # 0.5 credit
            'a_level_pure_math_topical_mcq': 5,  # 0.5 credit
            'a_level_pure_math_topical_structured': 5,  # 0.5 credit
            'a_level_pure_math_exam': 5,  # 0.5 credit
            'a_level_chemistry_topical': 5,  # 0.5 credit
            'a_level_chemistry_topical_mcq': 5,  # 0.5 credit
            'a_level_chemistry_topical_structured': 5,  # 0.5 credit
            'a_level_chemistry_exam': 5,  # 0.5 credit
            'a_level_physics_topical': 5,  # 0.5 credit
            'a_level_physics_topical_mcq': 5,  # 0.5 credit
            'a_level_physics_topical_structured': 5,  # 0.5 credit
            'a_level_physics_exam': 5,  # 0.5 credit
            'a_level_biology_topical_mcq': 5,  # 0.5 credit
            'a_level_biology_topical_structured': 5,
            'a_level_biology_topical_essay': 10,  # 1 credit
            'a_level_biology_exam_mcq': 5,
            'a_level_biology_exam_structured': 5,
            'a_level_biology_exam_essay': 10,
            'a_level_geography_topical_essay': 5,  # 0.5 credit
            'a_level_geography_exam_essay': 10,  # 1 credit

            # Audio & Vision – 2 credits / 1 credit
            'audio_feature': 20,
            'voice_chat': 20,
            'flashcard_audio': 20,
            'image_solve': 10,  # 1 credit
            'ocr_solve': 10,  # 1 credit
            'image_generation': 10,  # 1 credit

            # AI Teacher PDF
            'teacher_mode_pdf': 20,  # 2 credits

            # Project Assistant (Advanced) – transcribe 1 credit, rest 2 credits
            'project_assistant_batch': 20,
            'project_web_search': 20,
            'project_deep_research': 20,
            'project_transcribe': 10,  # 1 credit
            'project_image_generation': 20  # 2 credits
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
