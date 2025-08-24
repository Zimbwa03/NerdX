# Replit AI Prompt: WhatsBot Monitoring Dashboard

## Project Overview

**Goal**: Generate a comprehensive, professional, and well-organized dashboard for the WhatsBot, a WhatsApp-based educational quiz bot. The dashboard should provide critical insights into user activity, financial performance, and operational efficiency, with a specific focus on managing Ecocash payments.

**Target Audience**: Bot administrators and business owners who need to monitor the bot's performance, track revenue, and manage user credits.

## Dashboard Pages and Required Features

The dashboard should consist of the following main pages, each with specific functionalities and data visualizations:

### 1. Overview/Summary Dashboard

This page should provide a high-level summary of the bot's key performance indicators (KPIs).

**Key Metrics to Display (prominently)**:
- **Total Registered Users**: Current count of all registered users.
- **Active Users (Daily/Weekly/Monthly)**: Number of unique users interacting within specified periods.
- **Total Interactions**: Cumulative count of all messages/queries processed by the bot.
- **Total Revenue Generated**: Sum of all money received from credit purchases.
- **Average Revenue Per User (ARPU)**: Total revenue divided by total active users.
- **New Registrations (Daily/Weekly)**: Trend of new users joining.

**Visualizations**:
- **Daily Interactions Graph**: A professional, well-designed line graph showing daily interaction volume over the last 7, 30, and 90 days. It should be interactive, allowing for hover-over details and potentially drill-down to hourly data.
- **User Growth Trend**: A line graph illustrating the growth of total registered users over time.
- **Revenue Trend**: A line graph showing daily/weekly/monthly revenue generated.

**Design Considerations**:
- Clean, modern, and professional aesthetic.
- Responsive design for various screen sizes (desktop, tablet).
- Use of clear, readable fonts and a consistent color palette.
- Key metrics should be easily digestible at a glance.

### 2. User Analytics Page

This page should provide detailed insights into user behavior and demographics.

**Key Metrics and Data Tables**:
- **User Demographics**: Breakdown of users by registration date, last active date.
- **Top Users by Activity**: List of users with the highest number of interactions or quiz attempts.
- **User Credit Balances**: A table showing each user's current credit balance.
- **User Progress**: Display average scores, XP gained, and streak information (if available from `user_stats`).

**Visualizations**:
- **User Activity Heatmap**: (Optional but highly desirable) A visual representation of user activity patterns throughout the day/week.
- **Credit Distribution Chart**: A bar or pie chart showing the distribution of credit balances among users.

### 3. Revenue & Credit Management Page

This page is crucial for tracking financial performance and managing the credit system.

**Key Metrics and Data Tables**:
- **Total Credits Purchased**: Cumulative sum of all credits bought by users.
- **Total Credits Consumed**: Cumulative sum of all credits used by users.
- **Credit Purchase History**: A detailed table listing all credit purchase transactions, including:
    - User ID/Name
    - Date and Time of Purchase
    - Amount Paid
    - Credits Received
    - Payment Method (Ecocash, etc.)
- **Credit Consumption History**: A table showing when and how credits were used.

**Visualizations**:
- **Revenue Breakdown by Payment Method**: A pie chart showing the proportion of revenue from different payment methods.
- **Credits Purchased vs. Consumed**: A dual-axis line graph comparing the rate of credit purchase and consumption over time.

### 4. Ecocash Payment Review Page (Critical Functionality)

This dedicated page is for reviewing and processing Ecocash payments manually. It must be highly functional and secure.

**Core Functionality**:
- **Pending Payments List**: A clear, sortable, and filterable table displaying all Ecocash payments that require review and approval.
- **Each entry in the table MUST include the following details**: 
    - **Time of Transaction**: Timestamp of when the payment message was received.
    - **Student's Name**: First Name and Surname of the student (derived from user registration data).
    - **Money Paid**: The amount of money the student paid.
    - **Credits Purchased**: The number of credits the student is supposed to receive for this payment.
    - **Confirmation Message from Ecocash**: The raw message received from Ecocash, which needs to be reviewed for payment confirmation.
- **Action Buttons**: For each pending payment, there MUST be two prominent buttons:
    - **Approve**: Clicking this button will trigger the credit top-up for the student and mark the payment as complete. A confirmation dialog should appear before final approval.
    - **Reject**: Clicking this button will mark the payment as rejected (e.g., if the payment was not received or details are incorrect). A reason for rejection should be prompted.

**Workflow for Approval/Rejection**:
1. Admin reviews the `Confirmation Message from Ecocash` to verify payment receipt.
2. If confirmed, the admin clicks "Approve". This action should call the `complete_payment` function (or similar logic) in the backend to add credits to the user's account and update the payment status.
3. If not confirmed, the admin clicks "Reject". This action should update the payment status to rejected and optionally allow the admin to send a predefined message to the user.

**Design Considerations**:
- Clear visual separation between pending payments.
- Easy access to all relevant payment details.
- Secure and auditable approval/rejection process.
- Real-time updates (or easy refresh) of the pending payments list.

## Data Sources and Backend Integration

The dashboard should integrate with the existing Flask backend and SQLite database (`nerdx_quiz.db`). Replit AI should leverage the following data points and functions:

- **User Data**: `user_stats`, `user_registration` tables (for user count, names, activity, XP, streaks).
- **Credit Data**: `user_credits` table (for current balances, credit consumption).
- **Payment Data**: `pending_payment` table (for Ecocash transaction details, status), `process_ecocash_payment` function (for understanding payment flow), `complete_payment` function (for credit top-up on approval).
- **Interaction Data**: `user_question_history` table (for daily interactions, quiz attempts).

Replit AI should assume that the necessary API endpoints for fetching this data and performing actions (like approving payments) will be exposed by the Flask application (as indicated by `setup_dashboard(app)` in `whatsapp_main_backup.py`). The dashboard frontend should make API calls to these backend endpoints.

## Technical Requirements & Design Principles for Replit AI

- **Framework**: Use a modern web framework suitable for dashboards (e.g., React, Vue, or a robust templating engine if Flask-based rendering is preferred).
- **Styling**: Implement a clean, professional, and responsive UI. Use a CSS framework (e.g., Tailwind CSS, Bootstrap) or a component library (e.g., Material-UI, Ant Design) for consistency and speed.
- **Charting Library**: Integrate a powerful charting library (e.g., Chart.js, Recharts, Plotly.js) for interactive and visually appealing graphs.
- **Data Fetching**: Implement efficient data fetching mechanisms (e.g., asynchronous API calls) to ensure the dashboard remains responsive.
- **Modularity**: Structure the code in a modular way, separating concerns (e.g., components for different dashboard sections, API service layer).
- **Error Handling**: Implement basic error handling and display user-friendly messages for data loading failures or API errors.
- **Security**: Consider basic security practices for a dashboard (e.g., preventing XSS, CSRF, though full authentication/authorization might be beyond the scope of this initial prompt).

## Example Data Structures (based on `whatsapp_main_backup.py` and assumed database schema)

**User Data (example)**:
```json
[
  {
    "user_id": "whatsapp_1234567890",
    "name": "John",
    "surname": "Doe",
    "total_interactions": 150,
    "credits": 500,
    "xp": 1200,
    "streak": 5,
    "registration_date": "2025-01-10"
  },
  // ... more users
]
```

**Pending Payment Data (example)**:
```json
[
  {
    "payment_id": "ecocash_txn_001",
    "user_id": "whatsapp_9876543210",
    "time_of_transaction": "2025-07-01 10:30:00",
    "money_paid": 5.00,
    "credits_purchased": 100,
    "ecocash_confirmation_message": "Payment received from +263771234567 for $5.00. Ref: ABCDEF. Your new balance is...",
    "status": "pending"
  },
  // ... more pending payments
]
```

**Daily Interactions Data (example)**:
```json
[
  {"date": "2025-07-01", "interactions": 250},
  {"date": "2025-07-02", "interactions": 310},
  // ... last 30/90 days
]
```

## Instructions for Replit AI

Generate the necessary frontend code (HTML, CSS, JavaScript/React/Vue) and any required Flask backend modifications (if new API endpoints are needed beyond what `setup_dashboard` might provide) to implement the described dashboard. Focus on creating a functional and visually appealing prototype. Provide clear instructions on how to run and integrate the generated code with the existing `whatsapp_main_backup.py` application.

