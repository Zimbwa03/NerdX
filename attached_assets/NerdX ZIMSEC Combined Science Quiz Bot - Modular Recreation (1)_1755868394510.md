# NerdX ZIMSEC Combined Science Quiz Bot - Modular Recreation

This document provides the complete original source code of the NerdX ZIMSEC Combined Science Quiz Bot, followed by a detailed analysis of its monolithic structure, a proposed modular architecture, and a comprehensive prompt for an AI to recreate it as a modular system.

## 1. Original Monolithic Code (`whatsapp_main_backup.py`)

Below is the complete Python code for the original bot. This code serves as the reference for all functionalities that need to be replicated in the modular system.

```python



#!/usr/bin/env python3
"""
NerdX ZIMSEC Combined Science Quiz Bot - WhatsApp Version
"""

import os
import json
import logging
import sqlite3
import random
import time
import re
import requests
import traceback
from datetime import datetime
from typing import Dict, List, Optional
from flask import Flask, request, jsonify

from whatsapp_handler import WhatsAppHandler
from database_direct import (
    test_connection, get_or_create_user_stats, get_random_mcq_question, 
    update_user_stats, deduct_credits, get_user_credits, add_credits, 
    create_pending_payment, get_pending_payment, complete_payment,
    get_question_by_id, process_ecocash_payment, count_questions_by_category_and_topic,
    get_questions_by_category_and_topic, save_ai_question_to_database,
    is_user_registered, get_user_registration, create_user_registration,
    add_referral_credits, get_user_by_nerdx_id, get_user_stats, add_xp, update_streak
)

# Session rate limiting to prevent loops
session_rate_limits = {}
active_generations = {}  # Track active generation processes
active_sessions = {}  # Track active generation sessions
SESSION_COOLDOWN = 30  # 30 seconds between same actions

def check_session_rate_limit(chat_id, action):
    """Check if user is rate limited for specific action"""
    import time
    session_key = f"{chat_id}_{action}"
    current_time = time.time()
    
    if session_key in session_rate_limits:
        last_request = session_rate_limits[session_key]
        if current_time - last_request < SESSION_COOLDOWN:
            return True  # Rate limited
    
    session_rate_limits[session_key] = current_time
    return False  # Not rate limited

def check_active_generation(chat_id, generation_type):
    """Check if user already has an active generation process"""
    generation_key = f"{chat_id}_{generation_type}"
    current_time = time.time()
    
    # Clean up old entries (older than 2 minutes)
    to_remove = []
    for key, timestamp in active_generations.items():
        if current_time - timestamp > 120:  # 2 minutes timeout
            to_remove.append(key)
    
    for key in to_remove:
        del active_generations[key]
    
    # Check if generation is already in progress
    if generation_key in active_generations:
        return True  # Generation already active
    
    # Mark as active
    active_generations[generation_key] = current_time
    return False  # Not active, now marked as active

def clear_active_generation(chat_id, generation_type):
    """Clear active generation status"""
    generation_key = f"{chat_id}_{generation_type}"
    if generation_key in active_generations:
        del active_generations[generation_key]
from desmos_graph_generator import generate_function_graph, generate_multi_function_graph
from dashboard_api import setup_dashboard
from image_math_solver import ImageMathSolver
from credit_system_config import CreditSystemConfig, check_credit_requirements, format_credit_cost_message

# Configure logging
logging.basicConfig(
    format=\'%(asctime)s - %(name)s - %(levelname)s - %(message)s\',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Initialize Flask app with performance optimizations
app = Flask(__name__)

# Performance optimizations for high concurrency
app.config.update(
    SEND_FILE_MAX_AGE_DEFAULT=300,  # Cache static files
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max upload
    JSON_SORT_KEYS=False,  # Faster JSON serialization
    JSONIFY_PRETTYPRINT_REGULAR=False  # Faster JSON responses
)

# Import high-performance components
try:
    from scaling_architecture import performance_bot, setup_high_performance_scaling
    from performance_monitoring import performance_monitor, initialize_monitoring
    
    # Initialize performance monitoring
    initialize_monitoring()
    logger.info("✅ High-performance scaling components loaded")
except ImportError as e:
    logger.warning(f"High-performance components not available: {e}")
    performance_bot = None

# Environment variables
DEEPSEEK_API_KEY = os.getenv(\'DEEPSEEK_API_KEY\')
GEMINI_API_KEY = os.getenv(\'GEMINI_API_KEY\')
DESMOS_API_KEY = os.getenv(\'DESMOS_API_KEY\')

if not DEEPSEEK_API_KEY:
    logger.error("DEEPSEEK_API_KEY not found in environment variables")

if GEMINI_API_KEY:
    logger.info("Gemini API key configured - English Subject will use Gemini AI")
else:
    logger.warning("Gemini API key not found - English Subject will use fallback systems")

# Initialize Image Math Solver
try:
    image_solver = ImageMathSolver()
    logger.info("ImageMathSolver initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize ImageMathSolver: {e}")
    image_solver = None
    raise ValueError("DEEPSEEK_API_KEY must be set")

if DESMOS_API_KEY:
    logger.info("Desmos API key configured - Advanced graphing features enabled")
else:
    logger.warning("Desmos API key not found - Graphing features will be limited")

# Initialize WhatsApp handler
try:
    whatsapp_handler = WhatsAppHandler()
    logger.info("WhatsApp handler initialized successfully")

    # Validate environment variables
    logger.info(f"Using Phone Number ID: {os.getenv(\'WHATSAPP_PHONE_NUMBER_ID\')}")
    logger.info(f"Using Verify Token: {os.getenv(\'WHATSAPP_VERIFY_TOKEN\')}")
    if not os.getenv(\'WHATSAPP_ACCESS_TOKEN\'):
        logger.error("WHATSAPP_ACCESS_TOKEN is missing!")
    else:
        logger.info("WHATSAPP_ACCESS_TOKEN is configured")
except Exception as e:
    logger.error(f"Failed to initialize WhatsApp handler: {e}")
    raise

# Setup dashboard API routes at module level
setup_dashboard(app)
logger.info("Dashboard API routes configured")

# ZIMSEC Combined Science and English Topics
TOPICS = {
    "Biology": [
        "Laboratory rules and safety",
        "Cells and levels of organization",
        "Nutrition",
        "Respiratory system",
        "Transport systems",
        "Reproduction in plants and animals",
        "Health and diseases"
    ],
    "Chemistry": [
        "Matter",
        "Acids, Bases and Salts",
        "Oxidation and Reduction",
        "Industrial Processes",
        "Organic Chemistry"
    ],
    "Physics": [
        "Measurements",
        "Force",
        "Energy",
        "Magnetism",
        "Electricity"
    ],
    "Mathematics": [
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
    ],
    "English": [
        "Formal Letter Writing",
        "Informal Letter Writing", 
        "Article Writing",
        "Report Writing",
        "Speech Writing",
        "Narrative Essays",
        "Descriptive Essays",
        "Argumentative Essays",
        "Comprehension Skills",
        "Vocabulary Building",
        "Grammar and Language",
        "Literary Devices",
        "Reading Skills",
        "Writing Skills"
    ]
}

# Database setup for local SQLite (for session management)
DATABASE_NAME = \'nerdx_quiz.db\'

def init_local_database():
    """Initialize local SQLite database for session management"""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    # Create user sessions table for managing current questions
    cursor.execute(\'\'\'
        CREATE TABLE IF NOT EXISTS user_sessions (
            user_id TEXT PRIMARY KEY,
            question_data TEXT,
            subject TEXT,
            topic TEXT,
            question_id TEXT,
            question_source TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    \'\'\')
    
    # Create table to track previously asked questions to prevent duplicates
    cursor.execute(\'\'\'
        CREATE TABLE IF NOT EXISTS user_question_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            question_hash TEXT,
            topic TEXT,
            difficulty TEXT,
            asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, question_hash)
        )
    \'\'\')

    # Create registration sessions table for managing registration flow
    cursor.execute(\'\'\'
        CREATE TABLE IF NOT EXISTS registration_sessions (
            user_id TEXT PRIMARY KEY,
            step TEXT,
            name TEXT,
            surname TEXT,
            date_of_birth TEXT,
            referred_by_nerdx_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    \'\'\')

    conn.commit()
    conn.close()
    logger.info("Local database initialized successfully")

def generate_math_questions(topic: str, difficulty: str, count: int = 1) -> Optional[List[Dict]]:
    """Generate mathematics questions using Deepseek AI with LaTeX formatting for image conversion"""
    try:
        import requests
        import time

        difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }

        prompt = f"""
You are MathMentor, an expert O-Level Mathematics tutor for ZIMSEC curriculum. 

CRITICAL INSTRUCTION: Generate EXACTLY ONE single question - never return arrays or multiple questions.

Topic: {topic}
Difficulty: {difficulty} - {difficulty_descriptions[difficulty]}

STRICT REQUIREMENTS:
1. NEVER use arrays or lists - generate ONE single question only
2. Questions must be ZIMSEC O-Level Mathematics standard (Forms 1-4, 2015-2022)
3. Use simple mathematical notation (x², not complex LaTeX)
4. Provide clear, step-by-step solutions with explanations
5. Make the question educational and unique

MANDATORY JSON FORMAT (single object, not array):
{{
    "question": "A clear mathematics problem statement",
    "solution": "Step 1: Clear explanation\\nStep 2: Next step\\nStep 3: Final answer",
    "points": {10 if difficulty == \'easy\' else 20 if difficulty == \'medium\' else 50}
}}

EXAMPLE for {topic}:
- Question should be concise and clear
- Solution should show ALL working steps
- Points are: Easy=10, Medium=20, Difficult=50

Generate ONE question now (not multiple, not an array):
"""

        headers = {
            \'Authorization\': f\'Bearer {DEEPSEEK_API_KEY}\',
            \'Content-Type\': \'application/json\'
        }

        data = {
            \'model\': \'deepseek-chat\',
            \'messages\': [
                {
                    \'role\': \'user\',
                    \'content\': prompt
                }
            ],
            \'max_tokens\': 3000,
            \'temperature\': 0.7
        }

        # Try with multiple timeout values and retry attempts
        timeouts = [30, 45, 60]
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                timeout = timeouts[min(attempt, len(timeouts) - 1)]
                logger.info(f"DeepSeek API attempt {attempt + 1}/{max_retries} with {timeout}s timeout")
                
                response = requests.post(
                    \'https://api.deepseek.com/chat/completions\',
                    headers=headers,
                    json=data,
                    timeout=timeout
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result[\'choices\'][0][\'message\'][\'content\']

                    # Extract JSON from response
                    try:
                        json_start = content.find(\'{\')
                        json_end = content.rfind(\'}\') + 1
                        json_str = content[json_start:json_end]

                        question_data = json.loads(json_str)
                        
                        # STRICT validation - ONLY accept single question format
                        if (isinstance(question_data, dict) and 
                            \'question\' in question_data and 
                            \'solution\' in question_data and 
                            \'points\' in question_data and
                            not isinstance(question_data.get(\'question\'), list)):
                            
                            # Ensure we have a single question (not array)
                            logger.info(f"✅ Successfully generated SINGLE question on attempt {attempt + 1}")
                            logger.info(f"Question preview: {question_data[\'question\'][:100]}...")
                            return [question_data]  # Return as array for consistency
                        else:
                            logger.error(f"❌ REJECTED: Invalid format or array detected: {type(question_data)}")
                            logger.error(f"Required: single dict with question, solution, points")
                            if isinstance(question_data, list):
                                logger.error("ARRAYS NOT ALLOWED - must be single question object")
                            
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse JSON from AI response: {e}")
                        
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek API timeout on attempt {attempt + 1}/{max_retries}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
            except Exception as e:
                logger.error(f"DeepSeek API error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)

        # If all API attempts fail, generate fallback questions - only 1 question
        logger.warning("All DeepSeek API attempts failed. Generating fallback questions.")
        return generate_fallback_math_questions(topic, difficulty, 1)

    except Exception as e:
        logger.error(f"Error in generate_math_questions: {e}")
        return generate_fallback_math_questions(topic, difficulty, 1)

def generate_fallback_math_questions(topic: str, difficulty: str, count: int = 1) -> List[Dict]:
    """Generate fallback mathematics questions when API fails"""
    try:
        logger.info(f"Generating fallback questions for {topic} ({difficulty})")
        
        # Topic-specific question templates
        question_templates = {
            "Real Numbers": {
                "easy": [
                    {
                        "question": "Calculate: $\\sqrt{64} + \\sqrt{36}$",
                        "solution": "Step 1: Find the square roots\\n$\\sqrt{64} = 8$ and $\\sqrt{36} = 6$\\n\\nStep 2: Add the results\\n$8 + 6 = 14$\\n\\nTherefore, $\\sqrt{64} + \\sqrt{36} = 14$",
                        "points": 10
                    },
                    {
                        "question": "Simplify: $2^3 \\times 2^4$",
                        "solution": "Using the rule $a^m \\times a^n = a^{m+n}$\\n\\n$2^3 \\times 2^4 = 2^{3+4} = 2^7$\\n\\nCalculating: $2^7 = 128$\\n\\nTherefore, $2^3 \\times 2^4 = 128$",
                        "points": 10
                    },
                    {
                        "question": "Find the value of $x$ if $3x + 7 = 22$",
                        "solution": "Step 1: Subtract 7 from both sides\\n$3x + 7 - 7 = 22 - 7$\\n$3x = 15$\\n\\nStep 2: Divide both sides by 3\\n$x = \\frac{15}{3} = 5$\\n\\nTherefore, $x = 5$",
                        "points": 10
                    },
                    {
                        "question": "Calculate: $(-5) + (+8) - (-3)$",
                        "solution": "Step 1: Simplify the signs\\n$(-5) + (+8) - (-3) = -5 + 8 + 3$\\n\\nStep 2: Calculate from left to right\\n$-5 + 8 = 3$\\n$3 + 3 = 6$\\n\\nTherefore, $(-5) + (+8) - (-3) = 6$",
                        "points": 10
                    },
                    {
                        "question": "Express $\\frac{3}{4}$ as a decimal",
                        "solution": "To convert a fraction to decimal, divide the numerator by denominator\\n\\
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)


```




## 2. Modular Architecture Analysis




### 1. Core Functionalities and Dependencies

The monolithic `whatsapp_main_backup.py` script encompasses several distinct functionalities that can be decoupled into independent modules. Here is a breakdown of the core components and their interdependencies:

- **WhatsApp Interfacing:** Handles incoming and outgoing messages with the WhatsApp Business API. This is the primary entry and exit point for all user interactions.
- **Database Management:** Manages all database operations, including user data, quiz questions, session management, and credit tracking. It acts as a central data store for the entire application.
- **User Management:** Handles user registration, authentication, and profile management. It relies on the database module to store and retrieve user information.
- **Quiz and Question Logic:** Manages the core quiz functionality, including question generation, answer evaluation, and progress tracking. It interacts with the database to fetch questions and store user progress.
- **AI Integrations:** Connects to external AI services like DeepSeek and Gemini for question generation, essay marking, and other AI-powered features. It is called by the quiz and English modules.
- **Credit System:** Manages the user credit system, including credit deduction for features and credit rewards. It is tightly integrated with the database and is used by various feature modules.
- **Mathematics Module:** Contains all functionality related to mathematics, including topical questions, difficulty selection, and the Desmos graphing calculator integration.
- **English Language Module:** Manages all English language features, such as comprehension passages, essay writing, and grammar exercises. It relies heavily on AI integrations.
- **Combined Science Module:** Handles the Biology, Chemistry, and Physics subjects, including topic selection and AI-powered question generation.
- **Referral System:** Manages the user referral program, including tracking referrals and awarding credits.
- **Payment Processing:** Handles EcoCash payments for credit purchases.

### 2. Proposed Modular Architecture

Based on the analysis, the following modular architecture is proposed to enhance maintainability, scalability, and code organization:

- **`main.py`:** The main entry point of the application. It will initialize the Flask app, configure logging, and register the webhooks for the WhatsApp API. It will delegate all message handling to the `whatsapp_interface` module.

- **`whatsapp_interface/`:** This module will be responsible for all communication with the WhatsApp API. It will receive incoming webhooks, parse the message data, and route the requests to the appropriate handler in other modules. It will also contain a `WhatsAppHandler` class to send messages, buttons, and media to users.

- **`database/`:** This module will encapsulate all database interactions. It will provide a clean API for other modules to access and manipulate data without needing to know the underlying database schema. It will include functions for user management, question retrieval, session storage, and credit operations.

- **`user_management/`:** This module will handle all user-related logic, including registration, profile updates, and authentication. It will use the `database` module to persist user data.

- **`quiz_engine/`:** This module will contain the core logic for all quizzes and questions. It will be responsible for fetching questions from the database, managing user sessions, evaluating answers, and tracking progress. It will be designed to be subject-agnostic, allowing it to be used for Combined Science, Mathematics, and English.

- **`ai_integrations/`:** This module will house all the code for interacting with external AI APIs like DeepSeek and Gemini. It will provide a unified interface for generating questions, marking essays, and performing other AI tasks.

- **`credit_system/`:** This module will manage the entire credit system. It will define the cost of various features, handle credit deductions, and award credits for referrals and other activities.

- **`subjects/`:** This directory will contain sub-modules for each subject:
    - **`subjects/mathematics/`:** Will contain all the logic for the mathematics subject, including topical questions, the graphing calculator, and the image-based math problem solver.
    - **`subjects/english/`:** Will manage all English language features, including comprehension, essay writing, and grammar.
    - **`subjects/combined_science/`:** Will handle the Biology, Chemistry, and Physics subjects.

- **`payments/`:** This module will be responsible for processing payments, specifically for the EcoCash integration.

- **`utils/`:** A utility module for shared functions, such as logging configuration, rate limiting, and other helper functions.

### 3. Inter-Module Communication

The modules will communicate with each other through well-defined APIs. For example:

- The `whatsapp_interface` will receive a message and call the appropriate function in the `quiz_engine` or a subject-specific module.
- The `quiz_engine` will use the `database` module to get questions and the `credit_system` to deduct credits.
- The subject-specific modules will use the `ai_integrations` module to generate content.

This modular design will make the codebase much easier to understand, maintain, and extend in the future.





## 3. Prompt for Recreating the NerdX ZIMSEC Combined Science Quiz Bot as a Modular System




# Prompt for Recreating the NerdX ZIMSEC Combined Science Quiz Bot as a Modular System

This document outlines a comprehensive prompt for an AI to recreate the "NerdX ZIMSEC Combined Science Quiz Bot" as a modular, scalable, and maintainable system. The original monolithic codebase (`whatsapp_main_backup.py`) has been analyzed, and its functionalities are to be deconstructed into distinct, interconnected modules. The AI should generate the complete Python code for each module, adhering to the specified architecture, communication protocols, and functional requirements.

## 1. Overall Goal

Recreate the full functionality of the NerdX ZIMSEC Combined Science Quiz Bot, currently implemented as a monolithic Python script, into a well-structured, modular system. The new architecture should improve maintainability, scalability, and allow for easier feature expansion. The recreated bot must retain all existing features, including WhatsApp integration, quiz functionalities, AI-powered content generation, credit system, user management, and subject-specific modules (Combined Science, Mathematics, English).

## 2. Architectural Principles

- **Modularity:** Each distinct functionality should reside in its own module or package.
- **Clear Separation of Concerns:** Each module should have a single, well-defined responsibility.
- **API-driven Communication:** Modules should interact primarily through well-defined public interfaces (functions/classes) rather than direct access to internal variables.
- **Scalability:** The design should allow for independent scaling of components if needed.
- **Maintainability:** Code should be clean, well-commented, and follow Python best practices (PEP 8).
- **Environment Variables:** All sensitive information (API keys, tokens, database paths) must be loaded from environment variables.
- **Logging:** Comprehensive logging should be implemented across all modules for debugging and monitoring.

## 3. Proposed Modular Structure and Responsibilities

The following modular structure is to be implemented. Each module should be a separate Python file or a package containing related files.

### 3.1. `main.py`

- **Responsibility:** The primary entry point of the application.
- **Key Functions:**
    - Initialize the Flask application.
    - Configure global logging.
    - Load environment variables.
    - Initialize the `WhatsAppInterface` (from `whatsapp_interface` module) and other top-level managers.
    - Define the main `/webhook` endpoint for WhatsApp incoming messages.
    - Route incoming WhatsApp messages to the `WhatsAppInterface` for processing.
    - Handle basic health checks or root endpoint (`/`).
- **Dependencies:** `whatsapp_interface`, `utils.logger_config`, `config.settings`.

### 3.2. `config/` Package

- **Responsibility:** Centralized management of application configurations, constants, and environment variables.
- **Files:**
    - `config/settings.py`: Loads and provides access to all environment variables (e.g., `WHATSAPP_ACCESS_TOKEN`, `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `DESMOS_API_KEY`, `ELEVENLABS_API_KEY`, `ECOCASH_API_KEY`, `DATABASE_PATH`).
    - `config/constants.py`: Defines application-wide constants such as `SESSION_COOLDOWN`, `MAX_MESSAGE_LENGTH`, `TOPICS` dictionary (for subjects and their topics), etc.
    - `config/credit_system_config.py`: Contains the `CreditSystemConfig` class to manage feature costs and credit-related constants.
- **Dependencies:** None (other modules depend on this).

### 3.3. `utils/` Package

- **Responsibility:** Provides common utility functions used across multiple modules.
- **Files:**
    - `utils/logger_config.py`: Configures the application's logging system.
    - `utils/rate_limiter.py`: Implements `check_session_rate_limit`, `check_active_generation`, `set_active_generation`, and `clear_active_generation` functions to prevent abuse and manage concurrent operations.
    - `utils/message_chunker.py`: Contains `send_long_text_in_chunks` to handle sending messages longer than WhatsApp's character limit by splitting them.
    - `utils/file_manager.py`: Utility functions for handling temporary files (e.g., for audio, images, PDFs).
- **Dependencies:** `config.settings` (for logging levels, etc.).

### 3.4. `whatsapp_interface/` Package

- **Responsibility:** Manages all interactions with the WhatsApp Business API.
- **Files:**
    - `whatsapp_interface/handler.py`: Contains the `WhatsAppHandler` class, responsible for sending various types of messages (text, interactive, image, audio, PDF) and handling media uploads/downloads. It should encapsulate the `requests` calls to the WhatsApp API.
    - `whatsapp_interface/router.py`: Contains the main message routing logic. It will receive parsed message data from `main.py`'s webhook and dispatch it to the appropriate handler functions in `user_management`, `quiz_engine`, `subjects`, or `payments` modules based on message type (text, button, image, audio) and user session state.
- **Dependencies:** `config.settings`, `utils.logger_config`, `database.session_manager`, `user_management.manager`, `subjects.*`, `payments.manager`.

### 3.5. `database/` Package

- **Responsibility:** Provides a clean, abstract interface for all database operations. All direct `sqlite3` calls should be confined to this package.
- **Files:**
    - `database/connection.py`: Manages the SQLite database connection (`nerdx_quiz.db`). Includes `init_db` function to create all necessary tables (`users`, `user_stats`, `user_sessions`, `questions`, `referrals`, `payments`, `essay_submission_states`, `extracted_essay_texts`, `comprehension_sessions`, `user_question_history`, `active_generations_db`).
    - `database/user_manager.py`: Functions for user registration (`create_user_registration`, `is_user_registered`, `get_user_registration`, `get_user_by_nerdx_id`).
    - `database/stats_manager.py`: Functions for user statistics (`get_or_create_user_stats`, `update_user_stats`, `get_user_stats`, `add_xp`, `update_streak`).
    - `database/credit_manager.py`: Functions for credit operations (`get_user_credits`, `add_credits`, `deduct_credits`, `add_referral_credits`).
    - `database/question_store.py`: Functions for question retrieval and storage (`get_random_mcq_question`, `get_question_by_id`, `count_questions_by_category_and_topic`, `get_questions_by_category_and_topic`, `save_ai_question_to_database`, `track_asked_question`, `has_question_been_asked`).
    - `database/session_manager.py`: Functions for managing various user sessions (`store_user_session`, `get_user_session`, `clear_user_session`, `store_registration_session`, `get_registration_session`, `clear_registration_session`, `store_essay_papers_session`, `get_essay_papers_session`, `clear_essay_papers_session`, `set_user_essay_submission_state`, `check_user_essay_submission_state`, `store_extracted_essay_text`, `get_extracted_essay_text`, `store_comprehension_session`, `get_comprehension_session`, `clear_comprehension_session`, `set_active_generation_db`, `check_active_generation_db`, `clear_active_generation_db`).
    - `database/payment_manager.py`: Functions for payment tracking (`create_pending_payment`, `get_pending_payment`, `complete_payment`).
    - `database/referral_manager.py`: Functions for referral tracking (`get_referral_stats`).
- **Dependencies:** `config.settings`, `utils.logger_config`.

### 3.6. `ai_integrations/` Package

- **Responsibility:** Provides a unified interface for interacting with various AI models (DeepSeek, Gemini, ElevenLabs, Desmos).
- **Files:**
    - `ai_integrations/deepseek_client.py`: Encapsulates calls to the DeepSeek API for general text generation, essay prompt generation, and grammar exercise generation.
    - `ai_integrations/gemini_client.py`: Encapsulates calls to the Gemini API for English comprehension generation, essay marking, and English question generation.
    - `ai_integrations/elevenlabs_client.py`: Handles text-to-speech generation using ElevenLabs.
    - `ai_integrations/desmos_client.py`: Integrates with the Desmos API for graph generation.
    - `ai_integrations/image_math_solver.py`: Contains the `ImageMathSolver` class for processing image-based math problems (OCR and solution generation).
- **Dependencies:** `config.settings`, `utils.logger_config`, `requests`.

### 3.7. `subjects/` Package

- **Responsibility:** Contains sub-modules for each academic subject, encapsulating their specific logic and content generation.
- **Files:**
    - `subjects/combined_science/`:
        - `subjects/combined_science/handlers.py`: Contains handler functions for Biology, Chemistry, and Physics (e.g., `handle_topic_selection`, `handle_ai_combined_science_question`, `handle_ai_combined_science_next_question`, `handle_show_answer`).
        - `subjects/combined_science/question_generator.py`: Logic for AI-powered question generation for Combined Science topics.
        - `subjects/combined_science/notes_generator.py`: Logic for generating notes (e.g., `generate_laboratory_rules_pdf`).
    - `subjects/mathematics/`:
        - `subjects/mathematics/handlers.py`: Contains handler functions for math menus (`handle_math_practice`, `handle_math_progress`, `handle_math_achievements`, `handle_math_graphing_menu`), topic/difficulty selection, and solution display.
        - `subjects/mathematics/question_generator.py`: Logic for generating math questions (`generate_math_questions`, `generate_fallback_math_questions`).
        - `subjects/mathematics/graph_manager.py`: Manages Desmos graph generation (`generate_desmos_graph`, `generate_multi_function_graph`).
    - `subjects/english/`:
        - `subjects/english/handlers.py`: Contains handler functions for English menus (`handle_english_topical_menu`, `handle_english_comprehension_menu`, `handle_english_essay_menu`, `handle_english_grammar_menu`), form/topic selection, and answer handling.
        - `subjects/english/comprehension_manager.py`: Logic for generating and handling English comprehension passages (`generate_english_comprehension`, `generate_fallback_comprehension_passage`).
        - `subjects/english/essay_manager.py`: Logic for generating essay prompts and marking essays (`generate_english_essay_prompts`, `analyze_essay_with_deepseek`, `analyze_essay_with_gemini`, `create_fallback_essay_marking`, `generate_marked_essay_pdf`, `send_marked_essay_pdf`).
        - `subjects/english/grammar_manager.py`: Logic for generating grammar exercises (`generate_english_grammar_exercises`, `generate_fallback_grammar_exercises`).
        - `subjects/english/question_generator.py`: Logic for generating general English questions (`generate_english_questions`).
- **Dependencies:** `whatsapp_interface.handler`, `database.*`, `ai_integrations.*`, `config.credit_system_config`, `utils.*`.

### 3.8. `payments/` Package

- **Responsibility:** Handles all payment-related logic, specifically EcoCash integration.
- **Files:**
    - `payments/ecocash_processor.py`: Contains `process_ecocash_payment` and related functions for initiating and confirming EcoCash transactions.
    - `payments/handlers.py`: Contains handler functions for payment menus (`handle_buy_credits_menu`) and processing payment callbacks.
- **Dependencies:** `database.payment_manager`, `whatsapp_interface.handler`, `config.settings`, `utils.logger_config`.

### 3.9. `dashboard/` Package

- **Responsibility:** Provides an administrative dashboard for monitoring and managing the bot.
- **Files:**
    - `dashboard/api.py`: Defines Flask routes for the dashboard API (e.g., `/dashboard`, `/metrics`).
    - `dashboard/performance_monitoring.py`: Integrates performance monitoring tools and metrics collection.
    - `dashboard/scaling_architecture.py`: Placeholder for high-performance scaling components (if applicable).
- **Dependencies:** `utils.logger_config`, `database.*`.

## 4. Detailed Implementation Requirements for Each Module

### 4.1. `main.py`

- **Webhook Endpoint:** Implement a `/webhook` POST endpoint to receive WhatsApp messages and a GET endpoint for verification.
- **Message Parsing:** Parse the incoming JSON payload to extract `chat_id`, `message_type` (text, interactive, image, audio), and `message_content`.
- **Routing:** Use `whatsapp_interface.router.route_message` to dispatch the parsed message to the correct handler.

### 4.2. `config/`

- **`settings.py`:** Use `os.getenv()` for all environment variables. Provide default values where appropriate or raise errors if critical variables are missing.
- **`constants.py`:** Define all hardcoded values as constants (e.g., `WHATSAPP_NUMBER_ID`, `VERIFY_TOKEN`, `MAX_TEXT_LENGTH`).
- **`credit_system_config.py`:** The `CreditSystemConfig` class should have methods like `get_feature_cost(feature_name)` and potentially `get_xp_reward(feature_name)`.

### 4.3. `utils/`

- **`logger_config.py`:** Set up `logging.basicConfig` with appropriate format and level. Ensure log messages are informative.
- **`rate_limiter.py`:** Implement `session_rate_limits` and `active_generations` dictionaries (or use database for persistence) to track user activity and prevent rapid, repetitive requests. Implement cleanup for old entries.
- **`message_chunker.py`:** The `send_long_text_in_chunks` function should split text into WhatsApp-compatible segments (e.g., < 4096 characters) and send them sequentially with small delays.
- **`file_manager.py`:** Functions for creating temporary directories, saving files, and cleaning up (e.g., `save_temp_file`, `cleanup_temp_file`).

### 4.4. `whatsapp_interface/`

- **`handler.py`:**
    - `WhatsAppHandler` class: Initialize with `access_token`, `phone_number_id`.
    - Methods: `send_message`, `send_interactive_message` (with buttons), `send_image_file`, `send_audio_file`, `send_pdf_file`. These methods should handle the `requests` to the WhatsApp Graph API.
- **`router.py`:**
    - `route_message(chat_id, message_type, message_content)`: This function will be the central dispatcher. It should check user session state (e.g., `database.session_manager.get_user_session`) to determine context (e.g., waiting for essay, in a quiz).
    - Handle different message types: text messages, interactive button clicks, image uploads, audio uploads.
    - For button clicks, parse `callback_data` and route to the corresponding subject/feature handler.
    - For text messages, check session state (e.g., if `check_user_essay_submission_state` is True, route to essay marking).

### 4.5. `database/`

- **`connection.py`:** The `init_db()` function should create all tables if they don't exist. Use `sqlite3.connect` and `cursor.execute`.
- **Managers (`user_manager.py`, `stats_manager.py`, `credit_manager.py`, `question_store.py`, `session_manager.py`, `payment_manager.py`, `referral_manager.py`):**
    - Each manager should contain functions that perform specific database operations (e.g., `get_user_credits(user_id)`, `deduct_credits(user_id, amount, reason)`).
    - All functions should handle `sqlite3.Error` exceptions and log them.
    - Ensure proper use of `conn.commit()` and `conn.close()`.
    - For `session_manager.py`, ensure that session data is stored as JSON strings if complex objects are involved.
    - `active_generations_db` table should track ongoing AI generation processes to prevent duplicate requests and manage timeouts.

### 4.6. `ai_integrations/`

- **Clients (`deepseek_client.py`, `gemini_client.py`, `elevenlabs_client.py`, `desmos_client.py`):**
    - Each client should have functions that abstract the API calls (e.g., `deepseek_client.generate_text(prompt)`, `gemini_client.generate_comprehension(form_level)`).
    - Handle API keys from `config.settings`.
    - Implement retry logic and error handling for API calls (e.g., `requests.exceptions.Timeout`, `response.status_code != 200`).
    - Ensure JSON parsing is robust, handling cases where the AI might return malformed JSON or extra text.
- **`image_math_solver.py`:**
    - `ImageMathSolver` class: Initialize with necessary AI clients.
    - `process_math_image(image_path, user_name)`: Should take an image path, use an OCR/vision model (e.g., DeepSeek Vision, if available, or a placeholder) to extract text, then use a math AI model to solve the problem and generate a step-by-step solution. The solution should be formatted into a PDF.

### 4.7. `subjects/`

- **General:** Each subject module should have its own `handlers.py` to manage user interactions specific to that subject and `question_generator.py` (or similar) for content generation.
- **Combined Science (`combined_science/`):**
    - `handle_topic_selection`, `handle_ai_combined_science_question`, `handle_ai_combined_science_next_question`, `handle_show_answer` should manage the flow of combined science quizzes.
    - `question_generator.py` should use `ai_integrations.deepseek_client` or `ai_integrations.gemini_client` to generate questions based on subject and topic.
    - `notes_generator.py` should contain `generate_laboratory_rules_pdf` using `reportlab` (as in the original code) and other note generation functions.
- **Mathematics (`mathematics/`):**
    - `handlers.py`: Implement menus for practice, progress, achievements, and graphing. Handle `math_topic_selection`, `math_difficulty_selection`, `math_show_solution`, `math_next_question`, `math_graphing_menu`, `graph_function_request`, `sample_graphs`, `graph_examples`.
    - `question_generator.py`: `generate_math_questions` should use `ai_integrations.deepseek_client` and include robust JSON parsing and fallback mechanisms (`generate_fallback_math_questions`).
    - `graph_manager.py`: `generate_desmos_graph` and `generate_multi_function_graph` should interact with `ai_integrations.desmos_client`.
- **English (`english/`):**
    - `handlers.py`: Implement menus for topical, comprehension, essay, and grammar. Handle `english_form_selection`, `english_topic_questions`, `english_answer`, `english_comprehension_generation`, `generate_essay_paper`, `english_grammar_generation`, `handle_essay_image_submission`, `handle_confirm_essay_marking`, `handle_retry_essay_text`.
    - `comprehension_manager.py`: `generate_english_comprehension` should use `ai_integrations.gemini_client` and include fallback (`generate_fallback_comprehension_passage`). `send_english_comprehension` and `handle_show_comprehension_answers` should manage the display and session.
    - `essay_manager.py`: `generate_english_essay_prompts` should use `ai_integrations.deepseek_client`. `analyze_essay_with_deepseek` and `analyze_essay_with_gemini` should handle essay marking. `create_fallback_essay_marking` for when AI is unavailable. `generate_marked_essay_pdf` and `send_marked_essay_pdf` for PDF generation and sending.
    - `grammar_manager.py`: `generate_english_grammar_exercises` should use `ai_integrations.deepseek_client` and include fallback (`generate_fallback_grammar_exercises`). `send_english_grammar_content` should display the exercises.
    - `question_generator.py`: `generate_english_questions` should use `ai_integrations.gemini_client`.

### 4.8. `payments/`

- **`ecocash_processor.py`:** Implement the logic for `process_ecocash_payment`, including API calls to the EcoCash gateway and status checks.
- **`handlers.py`:** `handle_buy_credits_menu` should display options. Implement `handle_ecocash_payment` to initiate payment and `handle_ecocash_callback` to process payment confirmations.

### 4.9. `dashboard/`

- **`api.py`:** Implement Flask routes for the dashboard. This could be a simple endpoint to display bot status, user counts, or recent activity.
- **`performance_monitoring.py`:** Integrate any performance monitoring tools or metrics collection (e.g., Prometheus, custom logging of response times).
- **`scaling_architecture.py`:** (Optional) Placeholder for any advanced scaling logic if the bot is to be deployed in a high-traffic environment.

## 5. Data Flow and Interaction Examples

### Example 1: User requests a Math Question

1. **`main.py`**: Receives WhatsApp webhook, parses message, calls `whatsapp_interface.router.route_message`.
2. **`whatsapp_interface.router`**: Identifies button click for Mathematics, calls `subjects.mathematics.handlers.handle_math_topic_selection`.
3. **`subjects.mathematics.handlers.handle_math_topic_selection`**: Checks credits via `database.credit_manager.get_user_credits` and `config.credit_system_config.get_feature_cost`. If sufficient, calls `subjects.mathematics.question_generator.generate_math_questions`.
4. **`subjects.mathematics.question_generator.generate_math_questions`**: Calls `ai_integrations.deepseek_client.generate_math_question`. Handles JSON parsing and potential fallbacks.
5. **`database.question_store.save_ai_question_to_database`**: Stores the generated question.
6. **`database.credit_manager.deduct_credits`**: Deducts credits for the question.
7. **`database.stats_manager.add_xp` and `database.stats_manager.update_streak`**: Awards XP and updates streak.
8. **`database.session_manager.store_user_session`**: Stores the question data in the user's session.
9. **`whatsapp_interface.handler.send_message`**: Sends the question to the user.

### Example 2: User submits an Essay for Marking (Text)

1. **`main.py`**: Receives WhatsApp webhook, parses message, calls `whatsapp_interface.router.route_message`.
2. **`whatsapp_interface.router`**: Checks `database.session_manager.check_user_essay_submission_state`. If True, routes to `subjects.english.handlers.handle_essay_submission`.
3. **`subjects.english.handlers.handle_essay_submission`**: Retrieves essay text, calls `subjects.english.essay_manager.analyze_essay_with_gemini` (or `analyze_essay_with_deepseek` or `create_fallback_essay_marking`).
4. **`subjects.english.essay_manager.analyze_essay_with_gemini`**: Calls `ai_integrations.gemini_client.analyze_essay`.
5. **`subjects.english.essay_manager.generate_marked_essay_pdf`**: Generates a PDF report using `reportlab`.
6. **`subjects.english.essay_manager.send_marked_essay_pdf`**: Calls `whatsapp_interface.handler.send_pdf_file`.
7. **`database.stats_manager.add_xp` and `database.stats_manager.update_streak`**: Awards XP and updates streak.
8. **`database.session_manager.set_user_essay_submission_state(False)`**: Clears the essay submission state.

### Example 3: User requests a Graph

1. **`main.py`**: Receives WhatsApp webhook, parses message, calls `whatsapp_interface.router.route_message`.
2. **`whatsapp_interface.router`**: Identifies button click for graph function, calls `subjects.mathematics.handlers.handle_graph_function_request`.
3. **`subjects.mathematics.handlers.handle_graph_function_request`**: Checks credits. If sufficient, prompts user for function, stores session state via `database.session_manager.store_graph_session`.
4. **`whatsapp_interface.router`**: When user sends text (the function), identifies it as graph input based on session state, routes to `subjects.mathematics.handlers.process_graph_input`.
5. **`subjects.mathematics.handlers.process_graph_input`**: Calls `subjects.mathematics.graph_manager.generate_desmos_graph`.
6. **`subjects.mathematics.graph_manager.generate_desmos_graph`**: Calls `ai_integrations.desmos_client.generate_graph`.
7. **`database.credit_manager.deduct_credits`**: Deducts credits.
8. **`database.stats_manager.add_xp` and `database.stats_manager.update_streak`**: Awards XP and updates streak.
9. **`whatsapp_interface.handler.send_image_file`**: Sends the generated graph image.
10. **`database.session_manager.clear_graph_session`**: Clears the graph session.

## 6. Technology Stack and Environment Setup

- **Language:** Python 3.9+
- **Web Framework:** Flask
- **Database:** SQLite3 (for local persistence and session management)
- **External APIs:**
    - WhatsApp Business API (for messaging)
    - DeepSeek API (for general AI text generation, essay prompts, grammar, math questions)
    - Google Gemini API (for English comprehension, essay marking, English questions)
    - Desmos API (for interactive graphing)
    - ElevenLabs API (for text-to-speech audio generation)
    - EcoCash API (for mobile money payments - *Note: This will require a mock or sandbox implementation if actual API access is not provided*)
- **Libraries:**
    - `flask`
    - `requests`
    - `sqlite3` (built-in)
    - `google-generativeai`
    - `reportlab` (for PDF generation)
    - `pydub` (for audio processing, if needed for transcription)
    - `speech_recognition` (for audio transcription, if needed)
    - `Pillow` (for image manipulation, if needed)
    - `python-dotenv` (recommended for local environment variable management)
- **Environment Variables (MUST be set):**
    - `WHATSAPP_ACCESS_TOKEN`
    - `WHATSAPP_PHONE_NUMBER_ID`
    - `WHATSAPP_VERIFY_TOKEN`
    - `DEEPSEEK_API_KEY`
    - `GEMINI_API_KEY`
    - `DESMOS_API_KEY`
    - `ELEVENLABS_API_KEY`
    - `ECOCASH_API_KEY` (or a placeholder if not fully implemented)
    - `DATABASE_PATH` (e.g., `nerdx_quiz.db`)

## 7. Conclusion

This detailed prompt provides a clear roadmap for transforming the monolithic NerdX ZIMSEC Combined Science Quiz Bot into a robust, modular system. By adhering to the specified architecture, module responsibilities, and communication protocols, the AI should be able to generate a high-quality, maintainable, and extensible codebase that fully replicates the original bot's functionality while significantly improving its underlying structure. The focus on clear APIs, separation of concerns, and comprehensive logging will ensure the new system is easier to debug, test, and evolve.

