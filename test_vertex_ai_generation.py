"""
Test script to verify Vertex AI credentials and test question generation
"""
import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_credentials():
    """Check if required credentials are present"""
    logger.info("=" * 60)
    logger.info("CHECKING CREDENTIALS")
    logger.info("=" * 60)
    
    # Check DeepSeek (fallback)
    deepseek_key = os.getenv('DEEPSEEK_API_KEY')
    logger.info(f"DeepSeek API Key: {'✅ Present' if deepseek_key else '❌ Missing'}")
    
    # Check Vertex AI credentials
    vertex_required = {
        'GOOGLE_CLOUD_PROJECT': os.getenv('GOOGLE_CLOUD_PROJECT'),
        'GOOGLE_CLOUD_LOCATION': os.getenv('GOOGLE_CLOUD_LOCATION'),
        'GOOGLE_SERVICE_ACCOUNT_JSON': os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON'),
        'GOOGLE_APPLICATION_CREDENTIALS': os.getenv('GOOGLE_APPLICATION_CREDENTIALS'),
    }
    
    logger.info("\nVertex AI Credentials:")
    for key, value in vertex_required.items():
        if value:
            if key == 'GOOGLE_SERVICE_ACCOUNT_JSON':
                # Don't print full JSON, just check if it exists
                logger.info(f"  {key}: ✅ Present (length: {len(value)} chars)")
            elif key == 'GOOGLE_APPLICATION_CREDENTIALS':
                exists = os.path.exists(value) if value else False
                logger.info(f"  {key}: {'✅ Present' if exists else '❌ File not found'} ({value})")
            else:
                logger.info(f"  {key}: ✅ Present ({value})")
        else:
            logger.info(f"  {key}: ❌ Missing")
    
    # Check if at least one credential method is available
    has_credentials = (
        (vertex_required['GOOGLE_SERVICE_ACCOUNT_JSON'] and len(vertex_required['GOOGLE_SERVICE_ACCOUNT_JSON']) > 10) or
        (vertex_required['GOOGLE_APPLICATION_CREDENTIALS'] and os.path.exists(vertex_required['GOOGLE_APPLICATION_CREDENTIALS']))
    )
    
    logger.info(f"\nVertex AI Credentials Status: {'✅ Configured' if has_credentials else '❌ Not Configured'}")
    
    return has_credentials, deepseek_key is not None

def test_vertex_service():
    """Test Vertex AI service initialization"""
    logger.info("\n" + "=" * 60)
    logger.info("TESTING VERTEX AI SERVICE")
    logger.info("=" * 60)
    
    try:
        from services.vertex_service import vertex_service
        
        if vertex_service.is_available():
            logger.info("✅ Vertex AI service is available")
            
            # Test text generation
            logger.info("\nTesting text generation...")
            test_prompt = "Generate a simple math question for O-Level students about algebra. Return JSON with 'question' and 'answer' fields."
            
            result = vertex_service.generate_text(prompt=test_prompt, model="gemini-2.5-flash")
            
            if result and result.get('success'):
                logger.info("✅ Text generation successful!")
                logger.info(f"Response preview: {result.get('text', '')[:200]}...")
                return True
            else:
                logger.error(f"❌ Text generation failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            logger.error("❌ Vertex AI service is not available")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing Vertex AI service: {e}", exc_info=True)
        return False

def test_ai_service_generation():
    """Test AI service with platform parameter"""
    logger.info("\n" + "=" * 60)
    logger.info("TESTING AI SERVICE GENERATION (WhatsApp Platform)")
    logger.info("=" * 60)
    
    try:
        from services.ai_service import AIService
        
        ai_service = AIService()
        
        # Test science question generation with WhatsApp platform
        logger.info("Testing science question generation (platform='whatsapp')...")
        result = ai_service.generate_science_question(
            subject="Biology",
            topic="Cell Structure and Organisation",
            difficulty="easy",
            platform='whatsapp'
        )
        
        if result:
            logger.info("✅ Science question generated successfully!")
            logger.info(f"Question: {result.get('question', 'N/A')[:100]}...")
            logger.info(f"Has options: {'Yes' if result.get('options') else 'No'}")
            return True
        else:
            logger.error("❌ Failed to generate science question")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing AI service: {e}", exc_info=True)
        return False

def test_math_generator():
    """Test math question generator with platform parameter"""
    logger.info("\n" + "=" * 60)
    logger.info("TESTING MATH QUESTION GENERATOR (WhatsApp Platform)")
    logger.info("=" * 60)
    
    try:
        from services.math_question_generator import MathQuestionGenerator
        
        generator = MathQuestionGenerator()
        
        logger.info("Testing math question generation (platform='whatsapp')...")
        result = generator.generate_question(
            subject="Mathematics",
            topic="Algebra",
            difficulty="easy",
            platform='whatsapp'
        )
        
        if result:
            logger.info("✅ Math question generated successfully!")
            logger.info(f"Question: {result.get('question', 'N/A')[:100]}...")
            logger.info(f"Source: {result.get('source', 'N/A')}")
            return True
        else:
            logger.error("❌ Failed to generate math question")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing math generator: {e}", exc_info=True)
        return False

if __name__ == "__main__":
    logger.info("Starting Vertex AI Generation Test")
    logger.info("=" * 60)
    
    # Check credentials
    has_vertex_creds, has_deepseek = check_credentials()
    
    if not has_vertex_creds:
        logger.warning("\n⚠️  Vertex AI credentials not found!")
        logger.warning("Vertex AI requires one of:")
        logger.warning("  1. GOOGLE_SERVICE_ACCOUNT_JSON (full JSON as env var)")
        logger.warning("  2. GOOGLE_APPLICATION_CREDENTIALS (path to credentials file)")
        logger.warning("  3. Application Default Credentials (ADC)")
        logger.warning("\nThe system will fallback to DeepSeek if Vertex AI is unavailable.")
    
    # Test Vertex AI service
    vertex_works = test_vertex_service() if has_vertex_creds else False
    
    # Test AI service generation
    if vertex_works:
        ai_service_works = test_ai_service_generation()
        math_gen_works = test_math_generator()
        
        logger.info("\n" + "=" * 60)
        logger.info("TEST SUMMARY")
        logger.info("=" * 60)
        logger.info(f"Vertex AI Service: {'✅ Working' if vertex_works else '❌ Failed'}")
        logger.info(f"AI Service (WhatsApp): {'✅ Working' if ai_service_works else '❌ Failed'}")
        logger.info(f"Math Generator (WhatsApp): {'✅ Working' if math_gen_works else '❌ Failed'}")
        logger.info(f"DeepSeek Fallback: {'✅ Available' if has_deepseek else '❌ Not Available'}")
    else:
        logger.warning("\n⚠️  Skipping generation tests - Vertex AI not configured")
        logger.info("The WhatsApp bot will use DeepSeek as fallback if Vertex AI is unavailable.")
    
    logger.info("\n" + "=" * 60)
    logger.info("Test Complete")
    logger.info("=" * 60)
