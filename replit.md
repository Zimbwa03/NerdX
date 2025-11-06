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

## Security Improvements
Removed API key printing from console logs in `database/external_db.py` to prevent credential exposure.

## Architecture Decisions
- Text solutions are always sent, even when image solutions are available
- LaTeX conversion applied to all question text, answers, solutions, and explanations
- Session management ensures all messages (images + text) are delivered before clearing state