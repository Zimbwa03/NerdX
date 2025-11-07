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