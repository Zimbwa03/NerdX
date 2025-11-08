# Overview

NerdX ZIMSEC Quiz Bot is a WhatsApp-based educational platform for ZIMSEC students, offering interactive quizzes across various subjects. It features AI-powered question generation, a credit-based usage system with EcoCash payments, image-based problem-solving, and mathematical graph generation. The bot supports user registration, progress tracking, and analytics through web dashboards. The project aims to provide comprehensive, AI-driven educational support aligned with ZIMSEC curriculum.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The system uses Flask with a modular, service-oriented architecture, separating concerns into modules for WhatsApp API handling, AI question generation, payment processing, user management, and session handling. Blueprint-based routing manages API endpoints.

## Database Design
A dual-database approach employs PostgreSQL for persistent data (users, questions, transactions) and SQLite for session management and temporary data. Core models include User, UserSession, and UserQuestionHistory.

## Authentication & Session Management
Session-based state management is handled by SQLite. The system employs rate limiting and multi-step registration flows, relying on WhatsApp's secure messaging rather than traditional authentication.

## AI Integration
**English Modules**: All English modules (Grammar, Vocabulary, Comprehension) use Gemini 2.0 Flash Exp (`gemini-2.0-flash-exp`) as PRIMARY with DeepSeek as fallback. Comprehension generates 400-600 word ZIMSEC-aligned passages with 10 questions, delivered as professional PDF documents.

**Mathematics**: DeepSeek API is the primary AI for mathematics question generation and image analysis.

**Advanced Features**: Gemini 2.0 Flash Exp powers the Combined Science Teacher (personalized teaching, topic management, interactive lessons, PDF note generation) and the Project Assistant (research and writing assistance).

The system handles structured JSON responses with error fallbacks and retry mechanisms, supporting question difficulty scaling and educational content validation. Error handling returns None on AI failures to prevent false success messages.

## Credit System
A usage-based credit system charges differently per subject and difficulty. EcoCash integration facilitates credit purchases, and a referral system awards bonus credits. AI-powered features like Teacher Mode and Project Assistant have a hybrid credit model with initial and follow-up costs, and a charge for PDF note generation.

## UI/UX Decisions
The web dashboard uses Bootstrap 5 with a dark theme, Font Awesome for icons, and custom CSS. Comprehension passages are converted to professional, ZIMSEC-branded PDF documents, and LaTeX expressions are converted to readable Unicode.

## System Design Choices
All text solutions are sent, even with image solutions available. LaTeX conversion is applied universally. Session management ensures message delivery before clearing state. Comprehension passages are handled regardless of length. A robust throttling system limits non-critical messages but allows legitimate user interactions. The Project Assistant utilizes a modular service architecture. Exit commands are available for AI sessions like Teacher Mode.

# External Dependencies

## WhatsApp Business API
Used for messaging, interactive elements, and media handling (Facebook Graph API v17.0).

## AI Services
- Google Gemini API (gemini-2.0-flash-exp): Primary for English modules (Grammar, Vocabulary, Comprehension), Combined Science Teacher, and Project Assistant.
- DeepSeek API: Primary for mathematics question generation and image analysis; fallback for English modules.
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