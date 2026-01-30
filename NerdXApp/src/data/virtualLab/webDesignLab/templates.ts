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
        description: 'Single-page profile layout - common exam-style mini website.',
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
    {
        id: 'css-card-grid',
        title: 'CSS Card Grid',
        description: 'A responsive grid of cards using CSS Grid.',
        language: 'html',
        tags: ['css-layout', 'grid', 'cards', 'cambridge', 'zimsec'],
        board: 'both',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Card Grid</title>
</head>
<body>
  <header class="hero">
    <h1>Campus Spotlight</h1>
    <p>Showcase departments, clubs, or projects in a clean card layout.</p>
  </header>
  <main class="grid">
    <article class="card">
      <h2>Computer Club</h2>
      <p>Weekly coding challenges and robotics practice.</p>
      <button>Explore</button>
    </article>
    <article class="card">
      <h2>Science Lab</h2>
      <p>Experiments, exhibitions, and research projects.</p>
      <button>Explore</button>
    </article>
    <article class="card">
      <h2>Sports House</h2>
      <p>Team schedules, training plans, and competitions.</p>
      <button>Explore</button>
    </article>
  </main>
</body>
</html>
`,
        css: `:root {
  --bg: #0f172a;
  --card: #111827;
  --accent: #22c55e;
  --text: #f8fafc;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  padding: 32px;
}

.hero {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: var(--card);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
}

.card button {
  margin-top: 12px;
  border: none;
  background: var(--accent);
  color: #04110a;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
}
`,
    },
    {
        id: 'css-split-layout',
        title: 'Split Layout',
        description: 'A modern split layout using Flexbox.',
        language: 'html',
        tags: ['css-layout', 'flexbox', 'cambridge'],
        board: 'cambridge',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Split Layout</title>
</head>
<body>
  <section class="split">
    <div class="panel left">
      <h1>Design Your Project</h1>
      <p>Use this split layout for onboarding or a landing page.</p>
      <button>Start Planning</button>
    </div>
    <div class="panel right">
      <h2>Checklist</h2>
      <ul>
        <li>Define the problem</li>
        <li>Sketch the layout</li>
        <li>Choose a color system</li>
      </ul>
    </div>
  </section>
</body>
</html>
`,
        css: `.split {
  display: flex;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.panel {
  flex: 1;
  padding: 48px;
}

.left {
  background: #111827;
  color: #f9fafb;
}

.right {
  background: #f8fafc;
  color: #1f2937;
}

button {
  margin-top: 20px;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 700;
}
`,
    },
    {
        id: 'css-portfolio',
        title: 'Portfolio Showcase',
        description: 'A hero section plus feature list for a portfolio.',
        language: 'html',
        tags: ['css-layout', 'portfolio', 'zimsec'],
        board: 'zimsec',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Portfolio Showcase</title>
</head>
<body>
  <header class="hero">
    <div>
      <h1>Student Portfolio</h1>
      <p>Highlight your best projects and achievements.</p>
      <div class="pill-row">
        <span class="pill">HTML</span>
        <span class="pill">CSS</span>
        <span class="pill">Projects</span>
      </div>
    </div>
    <div class="hero-card">
      <h2>Latest Project</h2>
      <p>Interactive study planner with reminders.</p>
    </div>
  </header>
  <section class="features">
    <article>
      <h3>Responsive Layouts</h3>
      <p>Designs that adapt across devices.</p>
    </article>
    <article>
      <h3>Clean Typography</h3>
      <p>Readable text with consistent spacing.</p>
    </article>
    <article>
      <h3>Visual Branding</h3>
      <p>Colors and icons that match your theme.</p>
    </article>
  </section>
</body>
</html>
`,
        css: `body {
  margin: 0;
  font-family: 'Trebuchet MS', Arial, sans-serif;
  background: #0b1020;
  color: #f8fafc;
  padding: 32px;
}

.hero {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 28px;
}

.hero-card {
  background: #111827;
  padding: 20px;
  border-radius: 16px;
  min-width: 220px;
}

.pill-row {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.pill {
  background: #2563eb;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.features {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.features article {
  background: #111827;
  padding: 16px;
  border-radius: 12px;
}
`,
    },
    {
        id: 'css-timetable',
        title: 'Timetable Layout',
        description: 'A clean timetable layout for exam practice.',
        language: 'html',
        tags: ['css-layout', 'table', 'zimsec', 'cambridge'],
        board: 'both',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Study Timetable</title>
</head>
<body>
  <h1>Study Timetable</h1>
  <table class="timetable">
    <thead>
      <tr>
        <th>Time</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>08:00</td>
        <td>Maths</td>
        <td>Biology</td>
        <td>English</td>
      </tr>
      <tr>
        <td>10:00</td>
        <td>Physics</td>
        <td>Chemistry</td>
        <td>Computer Science</td>
      </tr>
      <tr>
        <td>12:00</td>
        <td>Revision</td>
        <td>Projects</td>
        <td>Past Papers</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`,
        css: `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f8fafc;
  color: #111827;
  padding: 32px;
}

.timetable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
}

.timetable th,
.timetable td {
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
  text-align: left;
}

.timetable thead {
  background: #2563eb;
  color: white;
}
`,
    },
];

