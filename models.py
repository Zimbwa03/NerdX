from datetime import datetime
from app import db
from sqlalchemy import UniqueConstraint

class User(db.Model):
    """User model for storing user information"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    whatsapp_id = db.Column(db.String(50), unique=True, nullable=False)
    nerdx_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    credits = db.Column(db.Integer, default=0)
    total_points = db.Column(db.Integer, default=0)
    streak_count = db.Column(db.Integer, default=0)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    referred_by = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSession(db.Model):
    """Model for managing user sessions and current questions"""
    __tablename__ = 'user_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    question_data = db.Column(db.Text, nullable=True)
    subject = db.Column(db.String(50), nullable=True)
    topic = db.Column(db.String(100), nullable=True)
    question_id = db.Column(db.String(100), nullable=True)
    question_source = db.Column(db.String(50), nullable=True)
    session_type = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserQuestionHistory(db.Model):
    """Model to track previously asked questions to prevent duplicates"""
    __tablename__ = 'user_question_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    question_hash = db.Column(db.String(256), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    asked_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (UniqueConstraint('user_id', 'question_hash'),)

class RegistrationSession(db.Model):
    """Model for managing user registration flow"""
    __tablename__ = 'registration_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), unique=True, nullable=False)
    step = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    surname = db.Column(db.String(100), nullable=True)
    date_of_birth = db.Column(db.String(20), nullable=True)
    referred_by_nerdx_id = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Payment(db.Model):
    """Model for tracking payments and credit purchases"""
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    reference = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(20), default='pending')
    external_reference = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

class Question(db.Model):
    """Model for storing generated questions"""
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(50), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    question_type = db.Column(db.String(20), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text, nullable=True)  # JSON string for MCQ options
    correct_answer = db.Column(db.Text, nullable=True)
    solution = db.Column(db.Text, nullable=True)
    points = db.Column(db.Integer, default=10)
    source = db.Column(db.String(50), default='ai_generated')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserStats(db.Model):
    """Model for tracking detailed user statistics"""
    __tablename__ = 'user_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(50), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    total_questions = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    total_points = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (UniqueConstraint('user_id', 'subject', 'topic', 'difficulty'),)

class ActivityLog(db.Model):
    """Model for logging user activities"""
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    additional_data = db.Column(db.Text, nullable=True)  # JSON string for additional data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
