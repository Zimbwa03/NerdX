# Overview

NerdX ZIMSEC Quiz Bot is a WhatsApp-based educational platform for ZIMSEC students, offering interactive quizzes across various subjects like Mathematics, Biology, Chemistry, Physics, and English. Key features include AI-powered question generation, a credit-based usage system, EcoCash payment processing, image-based problem-solving, and mathematical graph generation. The bot supports user registration, progress tracking, referral systems, and analytics through web dashboards. The project aims to provide comprehensive, AI-driven educational support to ZIMSEC students.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The system utilizes Flask with a modular, service-oriented architecture, separating concerns into modules for WhatsApp API handling, AI question generation (DeepSeek, Gemini), payment processing, user management, and session handling. Blueprint-based routing manages API endpoints.

## Database Design
A dual-database approach uses PostgreSQL for primary persistent data (users, questions, transactions) and SQLite for session management and temporary data. Core models include User, UserSession, and UserQuestionHistory. Database connection pooling and health monitoring ensure reliability.

## Authentication & Session Management
Session-based state management is handled by SQLite. The system employs rate limiting and multi-step registration flows. Traditional authentication is not used, relying on WhatsApp's secure messaging.

## AI Integration
DeepSeek API is the primary AI for mathematics question generation and image analysis, with Gemini API as a secondary option. The system handles structured JSON responses with error fallbacks, retry mechanisms, and supports question difficulty scaling and educational content validation. A dedicated Combined Science Teacher feature offers AI-powered instruction, personalized teaching, topic management, interactive lessons, and PDF note generation using Gemini. A Project Assistant feature provides comprehensive research and writing assistance using Gemini AI.

## Credit System
A usage-based credit system charges differently per subject and difficulty. EcoCash integration facilitates credit purchases, and a referral system awards bonus credits.

## UI/UX Decisions
The web dashboard uses Bootstrap 5 with a dark theme, Font Awesome for icons, and custom CSS for branding. Comprehension passages are converted to professional, ZIMSEC-branded PDF documents for better readability and offline access. LaTeX expressions are converted to readable Unicode.

## System Design Choices
- All text solutions are sent, even when image solutions are available.
- LaTeX conversion is applied universally to question text, answers, solutions, and explanations.
- Session management ensures message delivery before clearing state.
- Comprehension passages are handled regardless of length.
- The Project Assistant utilizes a modular service architecture.
- A robust throttling system limits non-critical messages but never blocks legitimate user interactions, aligning with WhatsApp Business API rate limits and quality monitoring.

# External Dependencies

## WhatsApp Business API
Used for messaging, interactive elements, and media handling (Facebook Graph API v17.0).

## AI Services
- DeepSeek API: Mathematics question generation and image analysis.
- Google Gemini API: Backup AI service, Combined Science Teacher, and Project Assistant.
- Desmos API: Mathematical graph generation.

## Payment Processing
- EcoCash API: Mobile payments in Zimbabwe.

## Database Services
- PostgreSQL: Production data storage.
- SQLite: Local session management and caching.

## Visualization Libraries
- Matplotlib: Mathematical graph generation (non-interactive backend).
- Chart.js: Web dashboard analytics.
- NumPy: Mathematical computations.

## Frontend Dependencies
- Bootstrap 5: Responsive web interface.
- Font Awesome: Icons.

# Recent Changes (November 2025)

## English Grammar AI Model Switch & Welcome Message Fix (November 7, 2025)
Fixed English Grammar module to use Gemini AI as primary model and corrected welcome message bug:
- **AI Model Priority Change**: Updated `generate_grammar_question()` in `services/english_service.py`
  - PRIMARY: Gemini AI via `generate_ai_grammar_question()` (was DeepSeek)
  - SECONDARY: DeepSeek AI via `generate_deepseek_grammar_question()` (now fallback)
  - TERTIARY: Database questions (unchanged)
  - FINAL: Hardcoded fallback (unchanged)
  - Students now get Gemini-generated grammar questions by default with automatic DeepSeek fallback
- **Welcome Message Bug Fixed**: Corrected session type check in `handlers/english_handler.py` line 1927
  - Changed from `if session_type == 'english_grammar_meta':` to `if session_type == 'english_grammar':`
  - Session type check now matches the saved session type
  - `intro_sent` flag properly persists between questions
  - Welcome message now appears only on first question, not every question
- **User Benefits**: 
  - More accurate grammar questions from Gemini AI
  - Better question variety and ZIMSEC alignment
  - Cleaner user experience without repeated welcome messages
- **Architect Reviewed**: All changes verified - session type fix resolves welcome message regression, AI model priority correct, no runtime errors

## Combined Science Teacher Notes Improvements (November 7, 2025)
Enhanced PDF note generation and WhatsApp message formatting for Teacher Mode:
- **No JSON Preview to Students**: Removed raw JSON dump from error fallback - now sends friendly message "I've prepared basic notes on this topic, but I'm having trouble sending the PDF..."
- **NerdX AI Watermark**: Added professional "NerdX AI" watermark to all PDF pages
  - Displays diagonally (45° rotation) with 30% transparency across all pages
  - Uses ReportLab's `setFillAlpha()` and `setFillColorRGB()` for proper rendering
  - Applied via `onFirstPage` and `onLaterPages` callbacks
- **WhatsApp Bold Formatting Fixed**: Converted Markdown `**bold**` to WhatsApp `*bold*` format
  - Created `_clean_whatsapp_formatting()` method with regex conversion (`r'\*\*([^\*]+?)\*\*'` → `r'*\1*'`)
  - Applied to all Gemini AI responses before sending to students
  - Ensures proper bold text display in WhatsApp messages
- **More Detailed Notes**: Updated AI system prompt to generate comprehensive study materials
  - Requires 500-800 words minimum in detailed explanations
  - Mandates multiple paragraphs: introduction, component breakdown, examples, misconceptions, related topics
  - Expanded learning objectives (4+), key concepts (5+), real-world applications (4+), comprehensive references
  - Students receive thorough, study-ready PDF notes covering everything about each topic
- **Architect Reviewed**: All improvements verified to work without runtime errors or regressions

## Graph Service Trigonometric Function Fix (November 7, 2025)
Fixed graph generation error when displaying trigonometric functions:
- **Issue**: Clicking "Show Graph" for trig functions crashed with "Error evaluating expression 'sin': 'property' object is not iterable"
- **Root Cause**: AI-generated questions returned bare trig function names (e.g., "sin") without variable "(x)", which sympy couldn't evaluate
- **Fix**: Added smart detection in `_clean_expression` method to automatically convert bare trig functions:
  - Detects if entire expression is just a trig function name (sin, cos, tan, csc, sec, cot, sinh, cosh, tanh, arcsin, arccos, arctan, asin, acos, atan)
  - Automatically appends "(x)" to make it evaluable: "sin" → "sin(x)"
  - Uses exact string matching (not regex) to avoid breaking complex expressions like "sin^2(x)", "2*sin(x)"
- **Architect Reviewed**: Confirmed targeted fix is safe and won't break valid expressions

## Combined Science Teacher Bug Fixes (November 7, 2025)
Fixed critical SessionManager error preventing Teacher Mode from working:
- **Issue**: Clicking "Teacher Mode" button generated POST 499 error
- **Root Cause**: `session_manager.set_data()` method didn't exist - service called 3-parameter version but only 2-parameter `set_session_data()` existed
- **Fix**: Added compatibility methods to SessionManager:
  - `set_data(user_id, session_type, data)` - 3-parameter version
  - `get_data(user_id, session_type=None)` - Retrieves with optional filtering
- **Architect Reviewed**: Methods correctly mirror service contract without corrupting session data

## Teacher Mode Exit Convenience (November 7, 2025)
Added simple text commands to exit Teacher Mode instead of requiring button clicks:
- **User Request**: Make it easier and more convenient to leave Teacher Mode
- **Solution**: Students can now type any of these commands to exit:
  - Simple commands: 'exit', 'leave', 'stop', 'quit', 'back'
  - Full phrases: 'main menu', 'go back', 'return', 'exit teacher mode', 'leave teacher mode', 'go to main menu', 'back to menu'
- **Implementation**: Uses exact phrase matching to prevent false positives
  - Only triggers if entire message (lowercased & trimmed) matches an exit command
  - Won't accidentally exit on normal conversation like "come back tomorrow" or "stopping power"
- **User Experience**: Added reminder text to teaching sessions: "📤 Type 'exit' to leave Teacher Mode"
- **Architect Reviewed**: Confirmed exact phrase matching prevents conversation disruptions while providing convenient exit options
- **Bug Fix**: Fixed crash when exiting - corrected `session_manager.clear_session()` method signature from 2 parameters to 1 parameter (removed unused `'science_teacher'` argument)

## Project Assistant Enhancements (November 7, 2025)
Comprehensive improvements to make Project Assistant more helpful, interactive, and user-friendly:
- **Automatic Name Retrieval**: No longer asks for student name - retrieves it directly from database using `get_user_registration(user_id)`
  - Skips manual name collection step entirely
  - Goes directly to subject selection
  - Gracefully defaults to "Student" if database lookup fails
- **WhatsApp Formatting Fix**: Converted Gemini AI's Markdown `**bold**` to WhatsApp `*bold*` format
  - Added `_clean_whatsapp_formatting()` method (same approach as Combined Science Teacher)
  - Applied to all AI responses before sending to students
  - Eliminates formatting issues with double asterisks appearing in messages
- **Enhanced AI System Prompt**: Made AI much more comprehensive and interactive
  - AI now DO THE WORK for students: writes complete content, does research, provides ready-to-use materials
  - Added capabilities: generate study notes, suggest visual aids (diagrams, charts, images)
  - Emphasizes being conversational, asking follow-up questions, probing deeper
  - Commands documented: "generate notes on [topic]", "suggest images for [topic]", "write [section]", "research [topic]"
- **Improved Interactivity**: Updated AI response instructions
  - Provide complete, detailed, ready-to-use content
  - Suggest visual aids when appropriate
  - Be highly interactive with follow-up questions
  - Focus on ZIMSEC standards and scoring criteria
- **User Benefits**: Students now get comprehensive research assistance with notes and image suggestions they can include in their projects
- **Architect Reviewed**: All improvements verified - name retrieval works correctly, formatting cleanup eliminates `**` symbols, enhanced prompt aligns with user goals

## Hybrid Credit Model Implementation (November 7, 2025)
Implemented balanced credit deduction strategy for AI-powered features (Teacher Mode and Project Assistant):
- **Credit Costs Added to config.py**:
  - `teacher_mode_start`: 3 credits (Combined Science Teacher - Initial session)
  - `teacher_mode_followup`: 1 credit (Combined Science Teacher - Follow-up questions)
  - `teacher_mode_pdf`: 1 credit (Combined Science Teacher - PDF note generation)
  - `project_assistant_start`: 3 credits (Project Assistant - Initial session)
  - `project_assistant_followup`: 1 credit (Project Assistant - Follow-up questions)
- **Combined Science Teacher Credit Logic**:
  - Starting new topic costs 3 credits (covers initial AI teaching)
  - Follow-up questions cost 1 credit each (cheaper for continued learning)
  - PDF note generation costs 1 credit (premium feature)
  - Total example: Starting topic (3) + 5 follow-ups (5) + PDF notes (1) = 9 credits
- **Project Assistant Credit Logic**:
  - Starting new project session costs 3 credits (covers comprehensive research/writing)
  - Follow-up questions cost 1 credit each (ongoing assistance)
  - No separate PDF charge (content delivered via chat)
  - Total example: New project (3) + 10 questions (10) = 13 credits
- **Credit Status Display**:
  - All responses show remaining credits and credits used
  - Format: "💳 Credits: 42 (Used: 1)"
  - Insufficient credit messages explain costs and benefits
- **Business Model Rationale**:
  - Higher initial cost (3 credits) covers heavy AI usage for comprehensive responses
  - Lower follow-up cost (1 credit) encourages deeper engagement
  - PDF generation as premium add-on (1 credit) for study materials
  - Balances revenue with student affordability
- **User Experience**:
  - Students see transparent credit costs before and after each interaction
  - Insufficient credit messages offer clear upgrade paths
  - Credit tracking helps students budget their usage
- **Architect Reviewed**: All credit deduction logic verified - works correctly without errors, properly detects new vs continuing sessions, integrates with existing credit system