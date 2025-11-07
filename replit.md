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