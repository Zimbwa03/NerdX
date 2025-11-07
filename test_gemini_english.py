#!/usr/bin/env python3
"""
Test script to verify Gemini AI is working for English Grammar and Vocabulary
"""
import os
import sys
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_grammar_question():
    """Test Gemini grammar question generation"""
    from services.english_service import EnglishService
    
    logger.info("=" * 60)
    logger.info("TESTING GRAMMAR QUESTION GENERATION")
    logger.info("=" * 60)
    
    service = EnglishService()
    
    logger.info("\n🔍 Generating grammar question...")
    result = service.generate_grammar_question()
    
    if result and result.get('success'):
        question_data = result.get('question_data', {})
        logger.info("\n✅ Grammar question generated successfully!")
        logger.info(f"📝 Question Type: {question_data.get('question_type')}")
        logger.info(f"📚 Topic Area: {question_data.get('topic_area')}")
        logger.info(f"🔁 Source: {question_data.get('source')}")
        logger.info(f"❓ Question: {question_data.get('question')[:100]}...")
        logger.info(f"✓ Answer: {question_data.get('answer')}")
        return True
    else:
        logger.error("\n❌ Failed to generate grammar question")
        return False

def test_vocabulary_question():
    """Test Gemini vocabulary question generation"""
    from services.english_service import EnglishService
    
    logger.info("\n" + "=" * 60)
    logger.info("TESTING VOCABULARY QUESTION GENERATION")
    logger.info("=" * 60)
    
    service = EnglishService()
    
    logger.info("\n🔍 Generating vocabulary question...")
    result = service.generate_ai_vocabulary_question()
    
    if result and result.get('success'):
        question_data = result.get('question_data', {})
        logger.info("\n✅ Vocabulary question generated successfully!")
        logger.info(f"📝 Question Type: {question_data.get('question_type')}")
        logger.info(f"📚 Category: {question_data.get('vocabulary_category')}")
        logger.info(f"🎯 Focus Area: {question_data.get('focus_area')}")
        logger.info(f"🔁 Source: {question_data.get('source')}")
        logger.info(f"❓ Question: {question_data.get('question')[:100]}...")
        logger.info(f"✓ Answer: {question_data.get('answer')}")
        return True
    else:
        logger.error("\n❌ Failed to generate vocabulary question")
        return False

if __name__ == "__main__":
    # Initialize Flask app context
    from app import app
    
    with app.app_context():
        logger.info("\n🚀 Starting Gemini English Service Tests\n")
        
        # Test Grammar
        grammar_success = test_grammar_question()
        
        # Test Vocabulary
        vocab_success = test_vocabulary_question()
        
        # Summary
        logger.info("\n" + "=" * 60)
        logger.info("TEST SUMMARY")
        logger.info("=" * 60)
        logger.info(f"Grammar Question: {'✅ PASS' if grammar_success else '❌ FAIL'}")
        logger.info(f"Vocabulary Question: {'✅ PASS' if vocab_success else '❌ FAIL'}")
        
        if grammar_success and vocab_success:
            logger.info("\n🎉 All tests passed! Gemini 2.0 Flash Exp is working smoothly!")
            sys.exit(0)
        else:
            logger.error("\n⚠️  Some tests failed. Check the logs above for details.")
            sys.exit(1)
