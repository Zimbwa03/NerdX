#!/usr/bin/env python3
"""
Mathematics Service for NerdX ZIMSEC Quiz Bot
Handles all mathematics-related operations using DeepSeek AI
"""

import logging
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)


class MathematicsService:
    """Main service for mathematics functionality"""

    def __init__(self):
        # Use exact ZIMSEC topics from the backup - single subject approach
        self.mathematics_topics = [
            "Real Numbers",
            "Sets", 
            "Financial Mathematics",
            "Measures and Mensuration",
            "Graphs",
            "Variation",
            "Algebra",
            "Geometry", 
            "Statistics",
            "Trigonometry",
            "Vectors",
            "Matrices",
            "Transformation",
            "Probability"
        ]

        self.difficulties = ["easy", "medium", "difficult"]

        self.difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps", 
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }

        self.difficulty_credits = {
            "easy": 5,
            "medium": 10,
            "difficult": 15
        }

        self.difficulty_points = {
            "easy": 10,
            "medium": 20,
            "difficult": 50
        }

    def get_main_menu_buttons(self) -> List[Dict]:
        """Get mathematics topic menu buttons - using exact ZIMSEC topics"""
        buttons = []

        # Create buttons for each ZIMSEC mathematics topic
        topic_emojis = {
            "Real Numbers": "🔢",
            "Sets": "🎯", 
            "Financial Mathematics": "💰",
            "Measures and Mensuration": "📏",
            "Graphs": "📊",
            "Variation": "📈",
            "Algebra": "📐",
            "Geometry": "📐", 
            "Statistics": "📊",
            "Trigonometry": "📐",
            "Vectors": "➡️",
            "Matrices": "🔲",
            "Transformation": "🔄",
            "Probability": "🎲"
        }

        for topic in self.mathematics_topics:
            emoji = topic_emojis.get(topic, "📚")
            topic_encoded = topic.lower().replace(' ', '_')
            buttons.append({
                "text": f"{emoji} {topic}", 
                "callback_data": f"math_topic_{topic_encoded}"
            })

        buttons.append({"text": "🏠 Back to Main Menu", "callback_data": "main_menu"})
        return buttons

    def get_difficulty_menu_buttons(self, topic: str) -> List[Dict]:
        """Get difficulty menu buttons for a topic"""
        topic_encoded = topic.lower().replace(' ', '_')

        return [
            {"text": "🟢 Easy", "callback_data": f"math_question_{topic_encoded}_easy"},
            {"text": "🟡 Medium", "callback_data": f"math_question_{topic_encoded}_medium"},
            {"text": "🔴 Difficult", "callback_data": f"math_question_{topic_encoded}_difficult"},
            {"text": "🔙 Back to Topics", "callback_data": "mathematics_mcq"}
        ]


    def format_main_menu_message(self, user_name: str) -> str:
        """Format mathematics main menu message"""
        return f"""🧮 **ZIMSEC Mathematics Hub** 🧮

Welcome {user_name}! Master O-Level Mathematics with AI-powered questions.

📚 **Available Topics ({len(self.mathematics_topics)}):**
Real Numbers • Sets • Financial Mathematics • Algebra  
Geometry • Statistics • Trigonometry • Probability
Graphs • Variation • Vectors • Matrices & More!

🎯 **Difficulty Levels:**
🟢 **Easy** - Basic concepts & formulas
🟡 **Medium** - Applied problems  
🔴 **Difficult** - Complex reasoning

💡 Authentic ZIMSEC-style problems with step-by-step solutions!

Choose your topic to begin:"""

    def format_topic_difficulty_message(self, topic: str, user_name: str, credits: int) -> str:
        """Format topic difficulty selection message"""
        topic_emojis = {
            "Real Numbers": "🔢",
            "Sets": "🎯", 
            "Financial Mathematics": "💰",
            "Measures and Mensuration": "📏",
            "Graphs": "📊",
            "Variation": "📈",
            "Algebra": "📐",
            "Geometry": "📐", 
            "Statistics": "📊",
            "Trigonometry": "📐",
            "Vectors": "➡️",
            "Matrices": "🔲",
            "Transformation": "🔄",
            "Probability": "🎲"
        }

        emoji = topic_emojis.get(topic, "📚")

        message = f"{emoji} **{topic}** {emoji}\n\n"
        message += f"Ready for {topic}, {user_name}? Choose your challenge level:\n\n"
        message += f"💳 **Your Credits:** {credits}\n\n"

        message += f"🎯 Choose Your Challenge Level:\n\n"
        message += f"🟢 Easy - {self.difficulty_descriptions['easy']}\n"
        message += f"   • Foundation concepts\n"
        message += f"   • {self.difficulty_points['easy']} XP points\n\n"
        message += f"🟡 Medium - {self.difficulty_descriptions['medium']}\n"
        message += f"   • Problem-solving skills\n"
        message += f"   • {self.difficulty_points['medium']} XP points\n\n"
        message += f"🔴 Difficult - {self.difficulty_descriptions['difficult']}\n"
        message += f"   • Critical thinking\n"
        message += f"   • {self.difficulty_points['difficult']} XP points\n\n"
        message += f"💡 Authentic ZIMSEC-style problems with step-by-step solutions!\n\n"
        message += f"Select your difficulty:"
        return message


    def check_sufficient_credits(self, user_credits: int, difficulty: str) -> Tuple[bool, str]:
        """Check if user has sufficient credits for difficulty level"""
        required_credits = self.difficulty_credits[difficulty]

        if user_credits >= required_credits:
            return True, ""
        else:
            return False, f"❌ Insufficient credits! You need {required_credits} credits for {difficulty} questions but only have {user_credits}."

    def get_credit_cost(self, difficulty: str) -> int:
        """Get credit cost for difficulty level"""
        return self.difficulty_credits.get(difficulty, 5)

    def get_points_reward(self, difficulty: str) -> int:
        """Get points reward for difficulty level"""
        return self.difficulty_points.get(difficulty, 10)

    def is_valid_topic(self, topic: str) -> bool:
        """Check if topic is valid"""
        return topic in self.mathematics_topics

    def get_all_topics(self) -> List[str]:
        """Get all mathematics topics"""
        return self.mathematics_topics.copy()

    def is_valid_difficulty(self, difficulty: str) -> bool:
        """Check if difficulty is valid"""
        return difficulty in self.difficulties

    def format_topic_name(self, topic_key: str) -> str:
        """Format topic key to proper name"""
        # Convert underscore format back to proper topic name
        formatted = topic_key.replace('_', ' ').title()

        # Handle special cases for exact ZIMSEC naming
        topic_map = {
            "Real Numbers": "Real Numbers",
            "Sets": "Sets",
            "Financial Mathematics": "Financial Mathematics", 
            "Measures And Mensuration": "Measures and Mensuration",
            "Graphs": "Graphs",
            "Variation": "Variation",
            "Algebra": "Algebra",
            "Geometry": "Geometry",
            "Statistics": "Statistics", 
            "Trigonometry": "Trigonometry",
            "Vectors": "Vectors",
            "Matrices": "Matrices",
            "Transformation": "Transformation",
            "Probability": "Probability"
        }

        return topic_map.get(formatted, formatted)