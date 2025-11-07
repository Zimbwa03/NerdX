# Overview

NerdX ZIMSEC Quiz Bot is a WhatsApp-based educational platform designed for ZIMSEC (Zimbabwe School Examinations Council) students. The system provides interactive quiz functionality across multiple subjects including Mathematics, Biology, Chemistry, Physics, and English. It features AI-powered question generation, credit-based usage system, payment processing via EcoCash, image-based problem solving, and mathematical graph generation. The bot supports user registration, progress tracking, referral systems, and comprehensive analytics through web dashboards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The system uses Flask as the web framework with a modular service-oriented architecture. Core services are separated into distinct modules: WhatsApp API handling, AI question generation using DeepSeek and Gemini APIs, payment processing, user management, and session handling. The application implements Blueprint-based routing for different API endpoints (webhook, dashboard, admin).

## Database Design
Dual database approach with PostgreSQL as the primary database for persistent user data, questions, and transactions, complemented by SQLite for session management and temporary data. Key models include User, UserSession, and UserQuestionHistory with proper relationships and constraints. Database connection pooling and health monitoring are implemented for reliability.

## Authentication & Session Management
Session-based state management using SQLite for temporary data storage, rate limiting to prevent abuse and infinite loops, and registration flow management through multi-step processes. No traditional authentication is used as the system operates through WhatsApp's secure messaging platform.

## AI Integration
Primary AI service using DeepSeek API for mathematics question generation and image problem solving, with Gemini API as secondary option. Structured JSON response handling with error fallbacks and retry mechanisms. Question difficulty scaling and educational content validation.

## Credit System
Usage-based credit system with different costs per subject and difficulty level. Integration with EcoCash payment gateway for credit purchases. Referral system providing bonus credits for user acquisition.

# External Dependencies

## WhatsApp Business API
Core messaging platform using Facebook Graph API v17.0 for sending/receiving messages, interactive buttons, and media handling. Requires WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_VERIFY_TOKEN.

## AI Services
- DeepSeek API for mathematics question generation and image analysis (DEEPSEEK_API_KEY required)
- Google Gemini API as backup AI service (GEMINI_API_KEY)
- Desmos API for mathematical graph generation (DESMOS_API_KEY)

## Payment Processing
EcoCash API integration for mobile payments in Zimbabwe market. Requires ECOCASH_API_KEY and ECOCASH_MERCHANT_CODE for transaction processing.

## Database Services
PostgreSQL for production data storage with connection via DATABASE_URL environment variable. SQLite for local session management and caching.

## Visualization Libraries
- Matplotlib for mathematical graph generation with non-interactive backend
- Chart.js for web dashboard analytics and data visualization
- NumPy for mathematical computations and function plotting

## Frontend Dependencies
- Bootstrap 5 with dark theme for responsive web interface
- Font Awesome for icons and UI elements
- Custom CSS for branding and enhanced user experience

# Recent Changes (November 2025)

## LaTeX Conversion System
Added comprehensive LaTeX to readable Unicode converter (`utils/latex_converter.py`) that transforms mathematical expressions into user-friendly text:
- Converts fractions: `\frac{a}{b}` → `(a)/(b)`
- Converts square roots: `\sqrt{x}` → `√(x)`
- Converts superscripts intelligently:
  - Simple exponents: `x^2` → `x²`
  - Complex exponents: `x^{y+2}` → `x^(y+2)`
  - Only uses Unicode superscripts when ALL characters can be mapped
- Converts Greek letters and mathematical operators to Unicode symbols

## Math Exam Image Solutions
Fixed "Show Answer" functionality in Math Exam mode to retrieve and display solution images from database:
- Checks `answer_image_url_1` through `answer_image_url_5` columns in `olevel_math_questions` table
- Sends all available solution images with appropriate captions
- Always sends text solution alongside images (mandatory requirement)
- Session clearing moved to end of flow to prevent race conditions

## Comprehension Feature Bug Fixes
Fixed critical bugs in English Comprehension module (`handlers/english_handler.py`):
- **Critical Bug**: Fixed NameError crash in `_send_professional_comprehension_flow` where `ready_message` was undefined for short passages (under 4000 chars)
- **Code Cleanup**: Removed unused duplicate method `_send_enhanced_comprehension_passage` (83 lines of dead code)
- **Data Standardization**: Standardized answer field naming to use `correct_answer` consistently throughout comprehension feature
- **Enhanced Fallbacks**: Improved fallback question generation with proper formatting, educational explanations, and ZIMSEC-appropriate structure

## ZIMSEC Project Assistant Feature - Comprehensive AI Research Assistant (November 7, 2025)
Redesigned Project Assistant as a ChatGPT-style AI that provides complete research and writing assistance:
- **Conversational Interface**: Students chat naturally with Gemini AI (gemini-2.0-flash-exp) acting as a comprehensive research assistant
- **Full-Service Approach**: AI provides complete answers, does research, writes content, and gives detailed guidance instead of just asking questions
- **Research Capabilities**: AI provides thorough research findings, case studies, existing solutions, facts, statistics, and real-world examples
- **Writing Assistance**: Writes project titles, problem statements, literature reviews, and helps with all project content when asked
- **Conversation History**: Maintains context across multiple messages (last 50 messages) for intelligent assistance
- **Database Persistence**: Dual storage system (SQLite sessions + Supabase PostgreSQL) with auto-save every 10 messages
- **Simple Navigation**: Only 4 buttons needed (New Project, Continue Project, Save & Exit, Main Menu)
- **Comprehensive Fallbacks**: Detailed fallback responses with complete frameworks, examples, and guidance when Gemini API unavailable
- **Natural UX**: Students ask for what they need and get complete, detailed responses
- **Project Tracking**: Automatically saves student name, subject, project title, and full conversation history
- **Session Resume**: Projects can be continued across multiple days with full conversation context restored

## Project Assistant Bug Fixes (November 7, 2025)
Fixed critical SessionManager error and added Gemini AI integration for intelligent tutoring:
- **Critical Fix**: Added missing `clear_session()` method to SessionManager class (`utils/session_manager.py`) that was causing AttributeError when users tried to start new projects
- **Type Safety**: Added comprehensive None-checking throughout `project_assistant_service.py` by using `or {}` fallbacks when calling `_get_project_data()` to prevent crashes from missing session state
- **Gemini AI Integration**: Integrated Gemini AI (gemini-2.0-flash-exp) for Socratic tutoring in `_handle_general_conversation()` method with intelligent, context-aware responses
- **Fallback System**: Proper error handling ensures basic Socratic questions are used if Gemini API is unavailable or fails
- **Verified**: Application logs confirm "Project Assistant initialized with Gemini AI for Socratic tutoring"

## English Comprehension PDF System (November 7, 2025)
Converted comprehension passages from WhatsApp text messages to professional PDF documents:
- **PDF Generator**: Created `ComprehensionPDFGenerator` utility using ReportLab for professional exam-style PDF generation
- **ZIMSEC Branding**: Professional header, formatted passages, questions with mark allocations
- **WhatsApp Integration**: Sends PDFs as documents via WhatsApp Business API (already supported)
- **Answer Bot Intact**: Students still receive answers via WhatsApp messages using "Show Answers" button
- **Automatic Cleanup**: PDFs cleaned up immediately after sending (2s delay) and old files removed (>24 hours)
- **Benefits**: Solves WhatsApp message length limits, better reading experience, offline access
- **Scalability**: Local PDF generation handles high volume efficiently

## Project Assistant Conversational AI Redesign (November 7, 2025)
Pivoted from button-based structured workflow to natural conversational AI after button routing issues:
- **Complete Rewrite**: Removed entire 6-stage button-based system (1000+ lines) and replaced with simple conversational flow
- **Gemini Integration**: Uses gemini-2.0-flash-exp model with professional teacher system prompt for intelligent tutoring
- **Simplified Handlers**: Reduced handler complexity by 80% - only handles chat messages and simple menu actions
- **Webhook Cleanup**: Removed 15+ complex button handlers (project_stage_X, project_review_stage_X, etc.)
- **Database Schema Maintained**: Still uses Supabase `user_projects` table with JSONB for conversation storage
- **Auto-Save Logic**: Saves to database on project creation and every 10 messages (prevents data loss)
- **Load/Resume**: Automatically restores full conversation history when continuing projects
- **Fallback System**: Keyword-based responses when Gemini API unavailable
- **Production Ready**: Architect-approved implementation with comprehensive error handling

## Security Improvements
Removed API key printing from console logs in `database/external_db.py` to prevent credential exposure.

## WhatsApp Throttling & Ban Prevention
Implemented intelligent throttling system aligned with WhatsApp Business API 2025 rate limits:
- **Rate Limits**: 3-second minimum delay, 10 messages/minute (matches WhatsApp's 6-second pair rate)
- **Critical Message Bypass**: ALL legitimate user interactions (quiz answers, menu selections, payments, registration) bypass throttling
- **Quality Monitoring**: Real-time tracking of complaint rates, response rates, engagement scores
- **Smart Detection**: Centralized `_is_critical_user_response()` method identifies 100+ message patterns that should never be blocked
- **Lock Mechanism**: Prevents concurrent message sends with automatic cleanup
- **Emergency Override**: `DISABLE_WHATSAPP_THROTTLE` environment variable for development testing
- **Comprehensive Documentation**: See `docs/WHATSAPP_THROTTLING_GUIDE.md` for complete guide

## Architecture Decisions
- Text solutions are always sent, even when image solutions are available
- LaTeX conversion applied to all question text, answers, solutions, and explanations
- Session management ensures all messages (images + text) are delivered before clearing state
- Comprehension passages handle both short (<4000 chars) and long passages correctly
- Project Assistant uses modular service architecture with clear separation of concerns
- Web research is FREE during beta (0 credits) as it provides guidance only, not actual API search results
- Throttling aggressively limits non-critical messages but NEVER blocks legitimate user interactions