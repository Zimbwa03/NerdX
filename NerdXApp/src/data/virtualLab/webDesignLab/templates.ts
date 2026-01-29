import type { WebTemplate } from '../../../types/webDesignLabTypes';

// Starter HTML/CSS templates for the Web Design Lab.
// These are intentionally simple and syllabus-aligned so students
// can see a full working page and then customise it.

export const WEB_DESIGN_TEMPLATES: WebTemplate[] = [
    {
        id: 'basic-html-page',
        title: 'Basic HTML Page',
        description: 'A minimal HTML5 page with heading and paragraph – perfect first example.',
        language: 'html',
        tags: ['zimsec', 'cambridge', 'basics', 'structure'],
        board: 'both',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Web Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #0b1020;
      color: #f5f5f5;
      margin: 0;
      padding: 40px;
    }
    h1 {
      color: #4CAF50;
    }
    p {
      max-width: 600px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>Welcome to NerdX Web Design Lab</h1>
  <p>This is your first HTML page. Edit this text, change the colours, and see the results instantly in the preview.</p>
</body>
</html>
`,
    },
    {
        id: 'two-column-layout',
        title: 'Two Column Layout',
        description: 'Simple two-column layout using CSS – common in syllabus website questions.',
        language: 'html',
        tags: ['layout', 'zimsec', 'cambridge', 'css'],
        board: 'both',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Two Column Layout</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background-color: #050816;
      color: #f3f4f6;
    }
    header {
      background-color: #0f766e;
      padding: 16px 24px;
      color: white;
    }
    .container {
      display: flex;
      padding: 24px;
      gap: 24px;
    }
    .left-column {
      flex: 2;
      background-color: #020617;
      padding: 16px;
      border-radius: 8px;
    }
    .right-column {
      flex: 1;
      background-color: #020617;
      padding: 16px;
      border-radius: 8px;
    }
    h2 {
      color: #22c55e;
    }
  </style>
</head>
<body>
  <header>
    <h1>School News</h1>
  </header>
  <div class="container">
    <section class="left-column">
      <h2>Main Articles</h2>
      <p>Write your latest school news articles here. This column is wider and used for main content.</p>
    </section>
    <aside class="right-column">
      <h2>Announcements</h2>
      <ul>
        <li>Exam timetable released</li>
        <li>Computer Science practical week</li>
        <li>Sports day on Friday</li>
      </ul>
    </aside>
  </div>
</body>
</html>
`,
    },
    {
        id: 'navigation-and-hero',
        title: 'Navigation Bar + Hero Section',
        description: 'A small website header with navigation and a hero banner section.',
        language: 'html',
        tags: ['navigation', 'layout', 'cambridge'],
        board: 'cambridge',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>College Landing Page</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: radial-gradient(circle at top, #1d4ed8 0, #020617 55%);
      color: #e5e7eb;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      background-color: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 16px;
      margin: 0;
      padding: 0;
    }
    nav a {
      color: #e5e7eb;
      text-decoration: none;
      font-size: 14px;
    }
    .hero {
      padding: 80px 32px;
      text-align: center;
    }
    .hero h1 {
      font-size: 36px;
      margin-bottom: 12px;
    }
    .hero p {
      max-width: 560px;
      margin: 0 auto 24px;
    }
    .hero button {
      padding: 10px 20px;
      border-radius: 999px;
      border: none;
      background-color: #22c55e;
      color: #020617;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo"><strong>NerdX College</strong></div>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Admissions</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <section class="hero">
    <h1>Learn Web Design &amp; Programming</h1>
    <p>Build modern, responsive websites as you prepare for ZIMSEC or Cambridge practical exams.</p>
    <button>Start Learning</button>
  </section>
</body>
</html>
`,
    },
    {
        id: 'student-profile-card',
        title: 'Student Profile Card',
        description: 'Single-page profile layout – common exam-style mini website.',
        language: 'html',
        tags: ['profile', 'cards', 'zimsec'],
        board: 'zimsec',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Profile</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      font-family: Arial, sans-serif;
    }
    .card {
      width: 320px;
      background-color: #020617;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.8);
      text-align: center;
      color: #e5e7eb;
    }
    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #a855f7, #1d4ed8);
      margin: 0 auto 16px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 22px;
    }
    h2 {
      margin: 0 0 16px;
      font-size: 14px;
      color: #9ca3af;
      font-weight: normal;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 16px;
    }
    li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar"></div>
    <h1>Student Name</h1>
    <h2>O Level Computer Science</h2>
    <ul>
      <li>School: Example High School</li>
      <li>Favourite topic: Web Design</li>
      <li>Goal: Distinction in exams</li>
    </ul>
    <p>Edit the text in this card to describe yourself. Try changing colours and fonts too.</p>
  </div>
</body>
</html>
`,
    },
];

