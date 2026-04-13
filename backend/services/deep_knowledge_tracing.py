"""
Deep Knowledge Tracing (DKT) Service
Uses LSTM neural networks to predict student knowledge state and personalize learning

Based on research:
- Piech et al. (2015): Deep Knowledge Tracing (Stanford)
- Yeung & Yeung (2018): Addressing Two Problems in Deep Knowledge Tracing
"""

import os
import logging
import json
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from database.external_db import get_db_connection
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

# Feature flags
USE_PRETRAINED_MODEL = os.environ.get('DKT_USE_PRETRAINED', 'true').lower() == 'true'
MODEL_VERSION = "v1.0-beta"


class DeepKnowledgeTracing:
    """
    Deep Knowledge Tracing using LSTM to model student learning
    
    Architecture:
    - Input: Sequence of (skill_id, correct/incorrect, time_spent, hints_used)
    - LSTM layers: Learn temporal patterns in learning
    - Output: Probability of success on next question for each skill
    
    Offline-First Design:
    - Model runs on-device (TensorFlow Lite)
    - Predictions cached locally
    - Periodic model updates when online
    """
    
    def __init__(self):
        self._db = None  # Lazy connection - created on demand
        self.model_version = MODEL_VERSION
        
        # Will hold TensorFlow Lite model (lightweight for mobile)
        self.model = None
        self.skill_encoder = {}  # Maps skill_id -> integer index
        self.skill_count = 0
        
        # For MVP: Use heuristic-based prediction until ML model is trained
        self.use_ml_model = False
        
        logger.info(f"DKT Service initialized (version: {self.model_version})")
    
    @property
    def db(self):
        """Get database connection, creating new one if needed or if stale."""
        if self._db is None:
            self._db = get_db_connection()
        else:
            # Check if connection is still valid
            try:
                with self._db.cursor() as cur:
                    cur.execute("SELECT 1")
            except Exception:
                # Connection is stale, get a new one
                logger.warning("Database connection stale, reconnecting...")
                try:
                    self._db.close()
                except Exception:
                    pass
                self._db = get_db_connection()
        return self._db
    
    def _get_fresh_connection(self):
        """Get a fresh database connection for operations that need it."""
        return get_db_connection()
    
    def log_interaction(
        self,
        user_id: str,
        subject: str,
        topic: str,
        skill_id: str,
        question_id: str,
        correct: bool,
        confidence: Optional[str] = None,
        time_spent: Optional[int] = None,
        hints_used: int = 0,
        session_id: Optional[str] = None,
        device_id: Optional[str] = None
    ) -> int:
        """
        Log a student interaction for DKT training
        
        This is called after EVERY question attempt to build learning history
        
        Args:
            user_id: Student identifier
            subject: 'mathematics', 'biology', 'chemistry', 'physics'
            topic: Topic name
            skill_id: Fine-grained skill (e.g. 'stoichiometry')
            question_id: Question identifier
            correct: Whether answer was correct
            confidence: 'low', 'medium', 'high' (for misconception detection)
            time_spent: Seconds spent on question
            hints_used: Number of hints requested
            session_id: Study session ID
            device_id: Device ID for offline sync
        
        Returns:
            interaction_id: ID of logged interaction
        """
        try:
            query = """
            INSERT INTO student_interactions (
                user_id, subject, topic, skill_id, question_id,
                response, confidence, time_spent_seconds, hints_used,
                session_id, device_id, timestamp
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id
            """
            
            with self.db.cursor() as cur:
                cur.execute(query, (
                    user_id, subject, topic, skill_id, question_id,
                    correct, confidence, time_spent, hints_used,
                    session_id, device_id
                ))
                interaction_id = cur.fetchone()[0]
                self.db.commit()
            
            # Trigger knowledge state update (async in production)
            self.update_knowledge_state(user_id, skill_id)
            
            # Trigger SRS update
            self.update_srs_state(user_id, skill_id, correct, confidence)
            
            logger.info(f"Logged interaction {interaction_id} for user {user_id}, skill {skill_id}")
            return interaction_id
            
        except Exception as e:
            logger.error(f"Error logging interaction: {str(e)}")
            self.db.rollback()
            return -1
    
    def get_interaction_history(
        self,
        user_id: str,
        skill_id: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """
        Get student's interaction history for DKT input
        
        Args:
            user_id: Student ID
            skill_id: Optional - filter by specific skill
            limit: Max interactions to retrieve
        
        Returns:
            List of interactions ordered by timestamp
        """
        try:
            if skill_id:
                query = """
                SELECT id, skill_id, response, confidence, time_spent_seconds,
                       hints_used, attempts, timestamp
                FROM student_interactions
                WHERE user_id = %s AND skill_id = %s
                ORDER BY timestamp DESC
                LIMIT %s
                """
                params = (user_id, skill_id, limit)
            else:
                query = """
                SELECT id, skill_id, response, confidence, time_spent_seconds,
                       hints_used, attempts, timestamp
                FROM student_interactions
                WHERE user_id = %s
                ORDER BY timestamp DESC
                LIMIT %s
                """
                params = (user_id, limit)
            
            with self.db.cursor() as cur:
                cur.execute(query, params)
                rows = cur.fetchall()
            
            interactions = []
            for row in rows:
                interactions.append({
                    'id': row[0],
                    'skill_id': row[1],
                    'correct': row[2],
                    'confidence': row[3],
                    'time_spent': row[4],
                    'hints_used': row[5],
                    'attempts': row[6],
                    'timestamp': row[7].isoformat() if row[7] else None
                })
            
            return interactions
            
        except Exception as e:
            logger.error(f"Error getting interaction history: {str(e)}")
            return []
    
    def predict_mastery(self, user_id: str, skill_id: str) -> float:
        """
        Predict current mastery probability for a skill
        
        This is the core DKT prediction function
        
        Args:
            user_id: Student ID
            skill_id: Skill to predict
        
        Returns:
            Probability (0.0 to 1.0) of answering next question correctly
        """
        if self.use_ml_model and self.model is not None:
            # Use trained LSTM model
            return self._ml_predict(user_id, skill_id)
        else:
            # Use heuristic-based prediction (MVP phase)
            return self._heuristic_predict(user_id, skill_id)
    
    def _heuristic_predict(self, user_id: str, skill_id: str) -> float:
        """
        Heuristic-based mastery prediction (used until ML model is trained)
        
        Algorithm:
        - Recent performance weighted more heavily (exponential decay)
        - Adjust for time spent and hints used
        - Account for difficulty level
        """
        try:
            # Get last 20 interactions for this skill
            history = self.get_interaction_history(user_id, skill_id, limit=20)
            
            if not history:
                # No history - assume beginner level
                return 0.3
            
            # Calculate weighted accuracy (recent attempts weighted more)
            total_weight = 0
            weighted_correct = 0
            
            for i, interaction in enumerate(history):
                # Exponential decay: most recent = weight 1.0, oldest = weight ~0.1
                weight = np.exp(-0.15 * i)
                total_weight += weight
                
                if interaction['correct']:
                    # Correct answer
                    base_score = 1.0
                    
                    # Reduce score if many hints used
                    if interaction['hints_used'] and interaction['hints_used'] > 0:
                        base_score *= (1.0 - 0.1 * interaction['hints_used'])
                    
                    # Reduce score if took very long (might be guessing)
                    if interaction['time_spent'] and interaction['time_spent'] > 300:  # 5 minutes
                        base_score *= 0.9
                    
                    weighted_correct += weight * base_score
                else:
                    # Incorrect answer contributes 0
                    pass
            
            # Calculate probability
            if total_weight > 0:
                probability = weighted_correct / total_weight
            else:
                probability = 0.3
            
            # Bound between 0.05 and 0.95 (never 100% certain)
            probability = max(0.05, min(0.95, probability))
            
            # Return as Python float (not numpy) for database compatibility
            return float(round(probability, 4))
            
        except Exception as e:
            logger.error(f"Error in heuristic prediction: {str(e)}")
            return 0.5  # Default to 50% uncertain
    
    def _ml_predict(self, user_id: str, skill_id: str) -> float:
        """
        ML-based mastery prediction using LSTM model
        
        This will be implemented in Phase 1 Week 2
        Requires TensorFlow Lite model deployment
        """
        # TODO: Implement LSTM inference
        # For now, fall back to heuristic
        logger.warning("ML prediction not yet implemented, using heuristic")
        return self._heuristic_predict(user_id, skill_id)
    
    def update_knowledge_state(self, user_id: str, skill_id: str) -> bool:
        """
        Update stored knowledge state after new interaction
        
        This updates the student_knowledge_state table with latest predictions
        
        Args:
            user_id: Student ID
            skill_id: Skill that was just practiced
        
        Returns:
            Success boolean
        """
        try:
            # Get current mastery prediction
            mastery_prob = self.predict_mastery(user_id, skill_id)
            
            # Calculate confidence interval (uncertainty)
            history = self.get_interaction_history(user_id, skill_id, limit=10)
            confidence_interval = self._calculate_confidence_interval(history)
            
            # Convert numpy types to Python native types for PostgreSQL compatibility
            mastery_prob = float(mastery_prob) if mastery_prob is not None else 0.5
            confidence_interval = float(confidence_interval) if confidence_interval is not None else 0.3
            
            # Update database
            query = """
            INSERT INTO student_knowledge_state (
                user_id, skill_id, mastery_probability, confidence_interval,
                last_practiced_at, updated_at, model_version
            ) VALUES (%s, %s, %s, %s, NOW(), NOW(), %s)
            ON CONFLICT (user_id, skill_id) 
            DO UPDATE SET
                mastery_probability = EXCLUDED.mastery_probability,
                confidence_interval = EXCLUDED.confidence_interval,
                last_practiced_at = NOW(),
                updated_at = NOW(),
                model_version = EXCLUDED.model_version
            """
            
            with self.db.cursor() as cur:
                cur.execute(query, (
                    user_id, skill_id, mastery_prob, confidence_interval,
                    self.model_version
                ))
                self.db.commit()
            
            logger.info(f"Updated knowledge state: user={user_id}, skill={skill_id}, mastery={mastery_prob:.2f}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating knowledge state: {str(e)}")
            try:
                self.db.rollback()
            except Exception:
                pass  # Connection may be closed
            return False
    
    def _calculate_confidence_interval(self, history: List[Dict]) -> float:
        """
        Calculate uncertainty in mastery prediction
        
        More data = lower uncertainty
        Inconsistent performance = higher uncertainty
        """
        if not history:
            return 0.4  # High uncertainty with no data
        
        if len(history) < 5:
            return 0.3  # Medium-high uncertainty with little data
        
        # Calculate variance in recent performance
        recent_10 = history[:10]
        correct_count = sum(1 for h in recent_10 if h['correct'])
        accuracy = correct_count / len(recent_10)
        
        # If accuracy is very high or very low, we're more confident
        # If around 50%, we're uncertain
        uncertainty = 4 * accuracy * (1 - accuracy)  # Max at 0.5, min at 0 or 1
        
        return round(uncertainty, 4)
    
    def get_knowledge_map(self, user_id: str, subject: Optional[str] = None) -> Dict:
        """
        Get visual knowledge map for dashboard
        
        Returns current mastery levels across all skills
        
        Args:
            user_id: Student ID
            subject: Optional filter by subject
        
        Returns:
            Dict with skills and mastery levels
        """
        try:
            if subject:
                query = """
                SELECT ks.skill_id, st.skill_name, st.subject, st.topic,
                       ks.mastery_probability, ks.confidence_interval,
                       ks.last_practiced_at
                FROM student_knowledge_state ks
                JOIN skills_taxonomy st ON ks.skill_id = st.skill_id
                WHERE ks.user_id = %s AND st.subject = %s
                ORDER BY st.subject, st.topic, ks.mastery_probability ASC
                """
                params = (user_id, subject)
            else:
                query = """
                SELECT ks.skill_id, st.skill_name, st.subject, st.topic,
                       ks.mastery_probability, ks.confidence_interval,
                       ks.last_practiced_at
                FROM student_knowledge_state ks
                JOIN skills_taxonomy st ON ks.skill_id = st.skill_id
                WHERE ks.user_id = %s
                ORDER BY st.subject, st.topic, ks.mastery_probability ASC
                """
                params = (user_id,)
            
            with self.db.cursor() as cur:
                cur.execute(query, params)
                rows = cur.fetchall()
            
            knowledge_map = {
                'user_id': user_id,
                'total_skills': len(rows),
                'mastered_skills': sum(1 for r in rows if r[4] >= 0.8),
                'learning_skills': sum(1 for r in rows if 0.5 <= r[4] < 0.8),
                'struggling_skills': sum(1 for r in rows if r[4] < 0.5),
                'skills': []
            }
            
            for row in rows:
                knowledge_map['skills'].append({
                    'skill_id': row[0],
                    'skill_name': row[1],
                    'subject': row[2],
                    'topic': row[3],
                    'mastery': float(row[4]) if row[4] else 0.0,
                    'confidence': float(row[5]) if row[5] else 0.0,
                    'last_practiced': row[6].isoformat() if row[6] else None,
                    'status': self._get_mastery_status(row[4])
                })
            
            return knowledge_map
            
        except Exception as e:
            logger.error(f"Error getting knowledge map: {str(e)}")
            return {
                'user_id': user_id,
                'total_skills': 0,
                'skills': [],
                'error': str(e)
            }
    
    def _get_mastery_status(self, mastery_prob: Optional[float]) -> str:
        """Convert mastery probability to status label"""
        if mastery_prob is None:
            return 'unknown'
        elif mastery_prob >= 0.8:
            return 'mastered'
        elif mastery_prob >= 0.6:
            return 'proficient'
        elif mastery_prob >= 0.4:
            return 'learning'
        else:
            return 'struggling'
    
    def get_next_question_recommendation(
        self,
        user_id: str,
        subject: str,
        topic: Optional[str] = None
    ) -> Dict:
        """
        Recommend next question based on DKT predictions
        
        Strategy:
        - Focus on skills with mastery in "learning zone" (0.4-0.7)
        - Avoid too easy (>0.8) or too hard (<0.3)
        - Prioritize skills not practiced recently
        
        Args:
            user_id: Student ID
            subject: Subject to practice
            topic: Optional topic filter
        
        Returns:
            Recommendation with skill_id and difficulty
        """
        try:
            knowledge_map = self.get_knowledge_map(user_id, subject)
            
            # Filter by topic if specified
            skills = knowledge_map['skills']
            if topic:
                skills = [s for s in skills if s['topic'] == topic]
            
            if not skills:
                return {
                    'recommended': False,
                    'reason': 'No skills found for this subject/topic'
                }
            
            # Score each skill for practice priority
            scored_skills = []
            for skill in skills:
                mastery = skill['mastery']
                
                # Priority score (higher = should practice)
                if 0.4 <= mastery <= 0.7:
                    # Learning zone - highest priority
                    score = 10
                elif 0.7 < mastery < 0.8:
                    # Near mastery - good for reinforcement
                    score = 7
                elif 0.3 <= mastery < 0.4:
                    # Struggling but not hopeless
                    score = 6
                elif mastery >= 0.8:
                    # Already mastered - low priority
                    score = 2
                else:
                    # Very low mastery - might need prerequisite work
                    score = 3
                
                # Boost score if not practiced recently
                if skill['last_practiced']:
                    days_since = (datetime.now() - datetime.fromisoformat(skill['last_practiced'])).days
                    if days_since > 7:
                        score += 3
                    elif days_since > 3:
                        score += 1
                
                scored_skills.append({
                    **skill,
                    'priority_score': score
                })
            
            # Sort by priority
            scored_skills.sort(key=lambda x: x['priority_score'], reverse=True)
            
            # Recommend top skill
            top_skill = scored_skills[0]
            
            return {
                'recommended': True,
                'skill_id': top_skill['skill_id'],
                'skill_name': top_skill['skill_name'],
                'topic': top_skill['topic'],
                'current_mastery': top_skill['mastery'],
                'suggested_difficulty': self._suggest_difficulty(top_skill['mastery']),
                'reason': self._generate_recommendation_reason(top_skill)
            }
            
        except Exception as e:
            logger.error(f"Error generating recommendation: {str(e)}")
            return {
                'recommended': False,
                'error': str(e)
            }
    
    def _suggest_difficulty(self, mastery: float) -> str:
        """Suggest question difficulty based on mastery level"""
        if mastery >= 0.7:
            return 'hard'  # Challenge them
        elif mastery >= 0.4:
            return 'medium'  # Appropriate level
        else:
            return 'easy'  # Build confidence
    
    def _generate_recommendation_reason(self, skill: Dict) -> str:
        """Generate human-readable reason for recommendation"""
        mastery = skill['mastery']
        
        if 0.4 <= mastery <= 0.7:
            return f"You're in the learning zone for {skill['skill_name']}. Perfect time to practice!"
        elif 0.7 < mastery < 0.8:
            return f"Almost mastered {skill['skill_name']}! A few more questions to cement it."
        elif mastery >= 0.8:
            return f"Time to review {skill['skill_name']} to maintain mastery."
        else:
            return f"Let's build your foundation in {skill['skill_name']} with some practice."


    def update_srs_state(self, user_id: str, skill_id: str, correct: bool, confidence: Optional[str] = 'medium') -> bool:
        """
        Update Spaced Repetition System (SRS) state for a skill
        
        Uses a simplified SuperMemo-2 algorithm to calculate next review date
        
        Args:
            user_id: Student ID
            skill_id: Skill ID
            correct: Whether the answer was correct
            confidence: Student's self-reported confidence
        """
        try:
            # Get current state
            query = """
            SELECT last_practiced_at, retention_strength, next_review_at
            FROM student_knowledge_state
            WHERE user_id = %s AND skill_id = %s
            """
            with self.db.cursor() as cur:
                cur.execute(query, (user_id, skill_id))
                row = cur.fetchone()
            
            if not row:
                # First time seeing this skill
                current_interval = 0
            else:
                # Use retention_strength as current interval in days
                current_interval = float(row[1]) if row[1] else 0
            
            # Calculate new interval
            new_interval = self._calculate_next_interval(current_interval, correct, confidence)
            
            # Calculate next review date
            next_review_date = datetime.now() + timedelta(days=new_interval)
            
            # Update database
            update_query = """
            UPDATE student_knowledge_state
            SET retention_strength = %s,
                next_review_at = %s,
                last_practiced_at = NOW()
            WHERE user_id = %s AND skill_id = %s
            """
            with self.db.cursor() as cur:
                cur.execute(update_query, (new_interval, next_review_date, user_id, skill_id))
                self.db.commit()
                
            logger.info(f"SRS Update: User {user_id}, Skill {skill_id}, Interval {current_interval} -> {new_interval} days")
            return True
            
        except Exception as e:
            logger.error(f"Error updating SRS state: {str(e)}")
            self.db.rollback()
            return False

    def _calculate_next_interval(self, current_interval: float, correct: bool, confidence: Optional[str]) -> float:
        """
        Calculate next review interval using modified SM-2
        
        Returns:
            New interval in days
        """
        if not correct:
            return 1.0  # Reset to 1 day if wrong
        
        # Determine Ease Factor based on confidence
        # High confidence = easier = larger multiplier
        if confidence == 'high':
            multiplier = 2.5
        elif confidence == 'low':
            multiplier = 1.5
        else: # medium or None
            multiplier = 2.0
            
        if current_interval == 0:
            return 1.0
        elif current_interval == 1.0:
            return 3.0
        else:
            return round(current_interval * multiplier, 1)

    def get_recommendations(
        self,
        user_id: str,
        subject: str,
        topic: Optional[str] = None
    ) -> Dict:
        """
        Recommend next question based on DKT predictions
        
        Strategy:
        - Focus on skills with mastery in "learning zone" (0.4-0.7)
        - Avoid too easy (>0.8) or too hard (<0.3)
        - Prioritize skills not practiced recently
        
        Args:
            user_id: Student ID
            subject: Subject to practice
            topic: Optional topic filter
        
        Returns:
            Recommendation with skill_id and difficulty
        """
        try:
            knowledge_map = self.get_knowledge_map(user_id, subject)
            
            # Filter by topic if specified
            skills = knowledge_map['skills']
            if topic:
                skills = [s for s in skills if s['topic'] == topic]
            
            if not skills:
                return {
                    'recommended': False,
                    'reason': 'No skills found for this subject/topic'
                }
            
            # Score each skill for practice priority
            scored_skills = []
            for skill in skills:
                mastery = skill['mastery']
                
                # Priority score (higher = should practice)
                if 0.4 <= mastery <= 0.7:
                    # Learning zone - highest priority
                    score = 10
                elif 0.7 < mastery < 0.8:
                    # Near mastery - good for reinforcement
                    score = 7
                elif 0.3 <= mastery < 0.4:
                    # Struggling but not hopeless
                    score = 6
                elif mastery >= 0.8:
                    # Already mastered - low priority
                    score = 2
                else:
                    # Very low mastery - might need prerequisite work
                    score = 3
                
                # Boost score if not practiced recently
                if skill['last_practiced']:
                    days_since = (datetime.now() - datetime.fromisoformat(skill['last_practiced'])).days
                    if days_since > 7:
                        score += 3
                    elif days_since > 3:
                        score += 1
                
                scored_skills.append({
                    **skill,
                    'priority_score': score
                })
            
            # Sort by priority
            scored_skills.sort(key=lambda x: x['priority_score'], reverse=True)
            
            # Recommend top skill
            top_skill = scored_skills[0]
            
            return {
                'recommended': True,
                'skill_id': top_skill['skill_id'],
                'skill_name': top_skill['skill_name'],
                'topic': top_skill['topic'],
                'current_mastery': top_skill['mastery'],
                'suggested_difficulty': self._suggest_difficulty(top_skill['mastery']),
                'reason': self._generate_recommendation_reason(top_skill)
            }
            
        except Exception as e:
            logger.error(f"Error generating recommendation: {str(e)}")
            return {
                'recommended': False,
                'error': str(e)
            }
    
    def _suggest_difficulty(self, mastery: float) -> str:
        """Suggest question difficulty based on mastery level"""
        if mastery >= 0.7:
            return 'hard'  # Challenge them
        elif mastery >= 0.4:
            return 'medium'  # Appropriate level
        else:
            return 'easy'  # Build confidence
    
    def _generate_recommendation_reason(self, skill: Dict) -> str:
        """Generate human-readable reason for recommendation"""
        mastery = skill['mastery']
        
        if 0.4 <= mastery <= 0.7:
            return f"You're in the learning zone for {skill['skill_name']}. Perfect time to practice!"
        elif 0.7 < mastery < 0.8:
            return f"Almost mastered {skill['skill_name']}! A few more questions to cement it."
        elif mastery >= 0.8:
            return f"Time to review {skill['skill_name']} to maintain mastery."
        else:
            return f"Let's build your foundation in {skill['skill_name']} with some practice."


    def update_srs_state(self, user_id: str, skill_id: str, correct: bool, confidence: Optional[str] = 'medium') -> bool:
        """
        Update Spaced Repetition System (SRS) state for a skill
        
        Uses a simplified SuperMemo-2 algorithm to calculate next review date
        
        Args:
            user_id: Student ID
            skill_id: Skill ID
            correct: Whether the answer was correct
            confidence: Student's self-reported confidence
        """
        try:
            # Get current state
            query = """
            SELECT last_practiced_at, retention_strength, next_review_at
            FROM student_knowledge_state
            WHERE user_id = %s AND skill_id = %s
            """
            with self.db.cursor() as cur:
                cur.execute(query, (user_id, skill_id))
                row = cur.fetchone()
            
            if not row:
                # First time seeing this skill
                current_interval = 0
            else:
                # Use retention_strength as current interval in days
                current_interval = float(row[1]) if row[1] else 0
            
            # Calculate new interval
            new_interval = self._calculate_next_interval(current_interval, correct, confidence)
            
            # Calculate next review date
            next_review_date = datetime.now() + timedelta(days=new_interval)
            
            # Update database
            update_query = """
            UPDATE student_knowledge_state
            SET retention_strength = %s,
                next_review_at = %s,
                last_practiced_at = NOW()
            WHERE user_id = %s AND skill_id = %s
            """
            with self.db.cursor() as cur:
                cur.execute(update_query, (new_interval, next_review_date, user_id, skill_id))
                self.db.commit()
                
            logger.info(f"SRS Update: User {user_id}, Skill {skill_id}, Interval {current_interval} -> {new_interval} days")
            return True
            
        except Exception as e:
            logger.error(f"Error updating SRS state: {str(e)}")
            self.db.rollback()
            return False

    def _calculate_next_interval(self, current_interval: float, correct: bool, confidence: Optional[str]) -> float:
        """
        Calculate next review interval using modified SM-2
        
        Returns:
            New interval in days
        """
        if not correct:
            return 1.0  # Reset to 1 day if wrong
        
        # Determine Ease Factor based on confidence
        # High confidence = easier = larger multiplier
        if confidence == 'high':
            multiplier = 2.5
        elif confidence == 'low':
            multiplier = 1.5
        else: # medium or None
            multiplier = 2.0
            
        if current_interval == 0:
            return 1.0
        elif current_interval == 1.0:
            return 3.0
        else:
            return round(current_interval * multiplier, 1)

    def generate_daily_review_queue(self, user_id: str) -> List[Dict]:
        """
        Generate daily review queue for the user.
        Populates daily_review_queue table and returns the list of items with questions.
        """
        try:
            db = get_db_connection()
            
            # 1. Identify items due for review
            with db.cursor() as cur:
                # Select top 10 items due for review
                cur.execute("""
                    SELECT ks.skill_id, st.skill_name, st.subject, st.topic, ks.next_review_at
                    FROM student_knowledge_state ks
                    JOIN skills_taxonomy st ON ks.skill_id = st.skill_id
                    WHERE ks.user_id = %s 
                    AND ks.next_review_at <= NOW()
                    ORDER BY ks.next_review_at ASC
                    LIMIT 10
                """, (user_id,))
                due_items = cur.fetchall()
                
                # Insert into queue (ignore duplicates)
                for item in due_items:
                    skill_id = item[0]
                    # Calculate priority (overdue days)
                    review_date = item[4]
                    if isinstance(review_date, str):
                        review_date = datetime.fromisoformat(review_date)
                    
                    # Ensure review_date is timezone-aware or naive as needed, assuming naive for now
                    if review_date.tzinfo:
                        review_date = review_date.replace(tzinfo=None)
                        
                    overdue_days = (datetime.now() - review_date).days
                    priority = min(max(overdue_days, 1), 10) # 1-10 scale
                    
                    cur.execute("""
                        INSERT INTO daily_review_queue (
                            user_id, skill_id, review_date, priority, created_at
                        ) VALUES (%s, %s, %s, %s, NOW())
                        ON CONFLICT (user_id, skill_id, review_date) DO NOTHING
                    """, (user_id, skill_id, datetime.now().date(), priority))
                
                db.commit()
            
            # 2. Fetch the queue items
            with db.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT q.skill_id, st.skill_name, st.subject, st.topic, q.review_date
                    FROM daily_review_queue q
                    JOIN skills_taxonomy st ON q.skill_id = st.skill_id
                    WHERE q.user_id = %s AND q.completed = FALSE AND q.review_date <= NOW()
                    ORDER BY q.priority DESC
                """, (user_id,))
                reviews = cur.fetchall()
            
            # 3. Generate questions for each review item
            from services.question_service import QuestionService
            qs = QuestionService()
            
            enhanced_reviews = []
            for review in reviews:
                try:
                    # Generate/Fetch question
                    question = qs.get_question(
                        user_id=user_id, 
                        subject=review['subject'], 
                        topic=review['topic'], 
                        difficulty='medium' # Default for review
                    )
                    
                    if question:
                        review['question_data'] = question
                        enhanced_reviews.append(review)
                    else:
                        logger.warning(f"Could not generate question for review item {review['skill_id']}")
                except Exception as e:
                    logger.error(f"Error generating question for review item {review['skill_id']}: {e}")
            
            return enhanced_reviews
            
        except Exception as e:
            logger.error(f"Error generating daily review queue: {e}")
            return []

# Global instance
dkt_service = DeepKnowledgeTracing()
