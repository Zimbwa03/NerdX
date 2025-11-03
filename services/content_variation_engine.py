"""
Content Variation Engine - Prevents repetitive message patterns
Ensures unique content for each user to avoid spam detection
"""
import logging
import random
import time
from typing import Dict, List, Optional, Any
from collections import defaultdict
import hashlib

logger = logging.getLogger(__name__)

class ContentVariationEngine:
    """Engine to generate varied content and prevent repetitive patterns"""
    
    def __init__(self):
        # Track content sent to each user to avoid repetition
        self.user_content_history = defaultdict(list)
        
        # Content variation templates
        self.question_intros = [
            "📚 Let's test your knowledge:",
            "🎯 Time for a challenge:",
            "💡 Here's a question for you:",
            "🧠 Ready to think?",
            "📖 Let's practice:",
            "🔍 Can you solve this?",
            "⚡ Quick quiz time:",
            "🎓 Study question:",
            "🌟 Your turn to shine:",
            "📝 Let's see what you know:"
        ]
        
        self.correct_feedback = [
            "Excellent work! 🌟",
            "Perfect! You're on fire! 🔥",
            "Outstanding! Keep it up! 💪",
            "Brilliant! You're learning fast! ⚡",
            "Fantastic! You're getting stronger! 💎",
            "Amazing! You're mastering this! 🏆",
            "Superb! You're doing great! 🎯",
            "Wonderful! You're improving! 📈",
            "Terrific! You're on the right track! 🚀",
            "Outstanding! You're becoming an expert! 🎓"
        ]
        
        self.incorrect_encouragement = [
            "Don't worry, every expert was once a beginner! 💪",
            "Mistakes are proof that you're trying! Keep going! 🌟",
            "Learning happens when we make mistakes! You're growing! 📈",
            "Every wrong answer brings you closer to the right one! 🎯",
            "The best learners learn from their mistakes! You've got this! ⚡",
            "Don't give up! Every champion faces challenges! 🏆",
            "Mistakes are stepping stones to success! Keep learning! 🚀",
            "You're building knowledge with every attempt! Stay strong! 💎",
            "Every expert was once a beginner! You're on your way! 🌟",
            "Learning is a journey, not a destination! Keep going! 🎓"
        ]
        
        self.achievement_messages = [
            "You're becoming a {subject} master! 🌟",
            "Your {subject} skills are skyrocketing! 🚀",
            "You're turning into a {subject} expert! 💎",
            "Your {subject} knowledge is growing strong! 💪",
            "You're mastering {subject} like a pro! 🏆",
            "Your {subject} abilities are impressive! ⚡",
            "You're developing into a {subject} champion! 🎯",
            "Your {subject} progress is remarkable! 📈",
            "You're evolving into a {subject} genius! 🧠",
            "Your {subject} journey is inspiring! 🌟"
        ]
        
        self.session_endings = [
            "Great session! You're making real progress! 🌟",
            "Excellent work today! Your dedication shows! 💪",
            "Outstanding session! You're building strong foundations! 🏗️",
            "Fantastic effort! You're developing valuable skills! 💎",
            "Amazing progress! You're becoming more confident! 🚀",
            "Superb work! You're mastering new concepts! 🎯",
            "Wonderful session! You're growing stronger! 📈",
            "Terrific effort! You're building expertise! 🏆",
            "Brilliant work! You're developing mastery! ⚡",
            "Outstanding session! You're on the path to success! 🎓"
        ]
        
        # Subject-specific encouragement
        self.subject_encouragement = {
            'Biology': [
                "You're understanding life's mysteries! 🌱",
                "Your biology knowledge is growing! 🧬",
                "You're becoming a life science expert! 🔬",
                "Your understanding of living things is expanding! 🌿"
            ],
            'Chemistry': [
                "You're mastering the building blocks of matter! ⚗️",
                "Your chemistry skills are developing! 🧪",
                "You're becoming a molecular expert! ⚛️",
                "Your understanding of reactions is growing! 🔥"
            ],
            'Physics': [
                "You're grasping the laws of the universe! 🌌",
                "Your physics knowledge is accelerating! ⚡",
                "You're becoming a force and motion expert! 🌟",
                "Your understanding of energy is expanding! 💫"
            ],
            'Mathematics': [
                "You're solving the language of the universe! 🔢",
                "Your math skills are multiplying! ✖️",
                "You're becoming a problem-solving expert! 🧮",
                "Your numerical reasoning is growing! 📊"
            ],
            'English': [
                "You're mastering the power of words! 📝",
                "Your language skills are flourishing! 📚",
                "You're becoming a communication expert! 💬",
                "Your understanding of expression is growing! ✍️"
            ]
        }
    
    def generate_question_intro(self, user_id: str, subject: str = None) -> str:
        """Generate varied question introduction"""
        try:
            # Avoid repeating recent intros for this user
            recent_intros = self._get_recent_content(user_id, 'question_intro', 5)
            available_intros = [intro for intro in self.question_intros if intro not in recent_intros]
            
            if not available_intros:
                available_intros = self.question_intros
            
            selected_intro = random.choice(available_intros)
            self._record_content(user_id, 'question_intro', selected_intro)
            
            return selected_intro
            
        except Exception as e:
            logger.error(f"Error generating question intro: {e}")
            return random.choice(self.question_intros)
    
    def generate_correct_feedback(self, user_id: str, subject: str = None) -> str:
        """Generate varied correct answer feedback"""
        try:
            # Avoid repeating recent feedback
            recent_feedback = self._get_recent_content(user_id, 'correct_feedback', 3)
            available_feedback = [fb for fb in self.correct_feedback if fb not in recent_feedback]
            
            if not available_feedback:
                available_feedback = self.correct_feedback
            
            selected_feedback = random.choice(available_feedback)
            self._record_content(user_id, 'correct_feedback', selected_feedback)
            
            # Add subject-specific encouragement if available
            if subject and subject in self.subject_encouragement:
                subject_encouragement = random.choice(self.subject_encouragement[subject])
                return f"{selected_feedback}\n\n{subject_encouragement}"
            
            return selected_feedback
            
        except Exception as e:
            logger.error(f"Error generating correct feedback: {e}")
            return random.choice(self.correct_feedback)
    
    def generate_incorrect_encouragement(self, user_id: str, subject: str = None) -> str:
        """Generate varied incorrect answer encouragement"""
        try:
            # Avoid repeating recent encouragement
            recent_encouragement = self._get_recent_content(user_id, 'incorrect_encouragement', 3)
            available_encouragement = [enc for enc in self.incorrect_encouragement if enc not in recent_encouragement]
            
            if not available_encouragement:
                available_encouragement = self.incorrect_encouragement
            
            selected_encouragement = random.choice(available_encouragement)
            self._record_content(user_id, 'incorrect_encouragement', selected_encouragement)
            
            return selected_encouragement
            
        except Exception as e:
            logger.error(f"Error generating incorrect encouragement: {e}")
            return random.choice(self.incorrect_encouragement)
    
    def generate_achievement_message(self, user_id: str, subject: str, achievement_name: str) -> str:
        """Generate varied achievement message"""
        try:
            # Avoid repeating recent achievement messages
            recent_achievements = self._get_recent_content(user_id, 'achievement', 2)
            available_achievements = [msg for msg in self.achievement_messages if msg not in recent_achievements]
            
            if not available_achievements:
                available_achievements = self.achievement_messages
            
            selected_template = random.choice(available_achievements)
            achievement_message = selected_template.format(subject=subject)
            
            self._record_content(user_id, 'achievement', achievement_message)
            
            return achievement_message
            
        except Exception as e:
            logger.error(f"Error generating achievement message: {e}")
            return f"Congratulations! You've unlocked: {achievement_name}"
    
    def generate_session_ending(self, user_id: str, subject: str = None) -> str:
        """Generate varied session ending message"""
        try:
            # Avoid repeating recent session endings
            recent_endings = self._get_recent_content(user_id, 'session_ending', 3)
            available_endings = [ending for ending in self.session_endings if ending not in recent_endings]
            
            if not available_endings:
                available_endings = self.session_endings
            
            selected_ending = random.choice(available_endings)
            self._record_content(user_id, 'session_ending', selected_ending)
            
            return selected_ending
            
        except Exception as e:
            logger.error(f"Error generating session ending: {e}")
            return random.choice(self.session_endings)
    
    def generate_explanation_variation(self, user_id: str, base_explanation: str, subject: str = None) -> str:
        """Generate varied explanations for the same concept"""
        try:
            # Create a hash of the base explanation to detect similar content
            explanation_hash = hashlib.md5(base_explanation.lower().encode()).hexdigest()[:8]
            
            # Check if we've sent a similar explanation recently
            recent_explanations = self._get_recent_content(user_id, 'explanation', 5)
            if explanation_hash in recent_explanations:
                # Vary the explanation
                return self._vary_explanation(base_explanation, subject)
            
            self._record_content(user_id, 'explanation', explanation_hash)
            return base_explanation
            
        except Exception as e:
            logger.error(f"Error generating explanation variation: {e}")
            return base_explanation
    
    def _vary_explanation(self, explanation: str, subject: str = None) -> str:
        """Add variation to explanations"""
        try:
            # Simple variation techniques
            variations = [
                f"Here's another way to think about it: {explanation}",
                f"Let me explain this differently: {explanation}",
                f"Another perspective: {explanation}",
                f"Think of it this way: {explanation}",
                f"Consider this approach: {explanation}"
            ]
            
            return random.choice(variations)
            
        except Exception as e:
            logger.error(f"Error varying explanation: {e}")
            return explanation
    
    def _get_recent_content(self, user_id: str, content_type: str, limit: int = 5) -> List[str]:
        """Get recent content of a specific type for a user"""
        try:
            user_history = self.user_content_history.get(user_id, [])
            recent_content = []
            
            for entry in reversed(user_history[-20:]):  # Check last 20 entries
                if entry.get('type') == content_type:
                    recent_content.append(entry.get('content', ''))
                    if len(recent_content) >= limit:
                        break
            
            return recent_content
            
        except Exception as e:
            logger.error(f"Error getting recent content: {e}")
            return []
    
    def _record_content(self, user_id: str, content_type: str, content: str):
        """Record content sent to user for variation tracking"""
        try:
            current_time = time.time()
            
            if user_id not in self.user_content_history:
                self.user_content_history[user_id] = []
            
            # Add new entry
            self.user_content_history[user_id].append({
                'type': content_type,
                'content': content,
                'timestamp': current_time
            })
            
            # Keep only last 50 entries per user to prevent memory bloat
            if len(self.user_content_history[user_id]) > 50:
                self.user_content_history[user_id] = self.user_content_history[user_id][-50:]
                
        except Exception as e:
            logger.error(f"Error recording content: {e}")
    
    def clear_user_history(self, user_id: str):
        """Clear content history for a specific user"""
        try:
            if user_id in self.user_content_history:
                del self.user_content_history[user_id]
                logger.info(f"Cleared content history for user {user_id}")
        except Exception as e:
            logger.error(f"Error clearing user history: {e}")
    
    def get_user_content_stats(self, user_id: str) -> Dict[str, int]:
        """Get content variation statistics for a user"""
        try:
            user_history = self.user_content_history.get(user_id, [])
            stats = defaultdict(int)
            
            for entry in user_history:
                content_type = entry.get('type', 'unknown')
                stats[content_type] += 1
            
            return dict(stats)
            
        except Exception as e:
            logger.error(f"Error getting user content stats: {e}")
            return {}
    
    def is_content_repetitive(self, user_id: str, content: str, content_type: str) -> bool:
        """Check if content would be repetitive for a user"""
        try:
            recent_content = self._get_recent_content(user_id, content_type, 3)
            content_lower = content.lower().strip()
            
            for recent in recent_content:
                if content_lower == recent.lower().strip():
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking content repetitiveness: {e}")
            return False

# Global instance
content_variation_engine = ContentVariationEngine()




