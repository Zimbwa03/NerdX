#!/usr/bin/env python3
"""
Science Notes Service for ZIMSEC Combined Science
Provides detailed notes for Biology, Chemistry, and Physics topics
"""

import json
import logging
from typing import Optional, Dict, List

logger = logging.getLogger(__name__)

class ScienceNotesService:
    def __init__(self):
        """Initialize Science Notes Service"""
        self.notes_data = {}
        logger.info("Science Notes Service initialized")
    
    def get_all_topics(self, subject: str) -> List[str]:
        """Get all available topics for a subject"""
        from constants import TOPICS
        
        if subject in TOPICS:
            return TOPICS[subject]
        return []
    
    def get_topic_notes(self, subject: str, topic: str) -> Optional[Dict]:
        """
        Retrieve notes for a specific topic
        
        Args:
            subject: Biology, Chemistry, or Physics
            topic: Topic name from TOPICS constant
            
        Returns:
            Dictionary containing notes structure or None
        """
        # For now, return structure - will be populated with actual content
        # In production, this would query database
        
        notes_key = f"{subject}_{topic}"
        
        # Check if notes exist in memory/database
        if notes_key in self.notes_data:
            return self.notes_data[notes_key]
        
        # Return None if notes not yet created
        return None
    
    def save_topic_notes(self, subject: str, topic: str, notes_data: Dict) -> bool:
        """
        Save notes for a topic
        
        Args:
            subject: Biology, Chemistry, or Physics
            topic: Topic name
            notes_data: Complete notes structure
            
        Returns:
            True if successful, False otherwise
        """
        try:
            notes_key = f"{subject}_{topic}"
            self.notes_data[notes_key] = notes_data
            
            # In production, save to database
            logger.info(f"Saved notes for {subject} - {topic}")
            return True
        except Exception as e:
            logger.error(f"Error saving notes: {e}")
            return False
    
    def get_notes_structure(self) -> Dict:
        """Return the expected structure for notes"""
        return {
            "topic": "",
            "subject": "",
            "sections": [
                {
                    "title": "",
                    "content": "",  # Markdown formatted
                    "diagrams": [],  # List of image URLs/paths
                    "subsections": []  # Optional nested sections
                }
            ],
            "key_points": [],
            "exam_tips": [],
            "summary": ""
        }
