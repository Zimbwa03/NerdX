export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface DatabaseLabExerciseExpected {
  columns?: string[];
  rows?: (string | number | null)[][];
  rowCount?: number;
  orderMatters?: boolean;
}

export interface DatabaseLabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  setupSql: string;
  prompt: string;
  starterSql: string;
  expected: DatabaseLabExerciseExpected;
  hints: string[];
  tags: string[];
}

export const DATABASE_LAB_EXERCISES: DatabaseLabExercise[] = [
  {
    id: 'ex-students-top',
    title: 'Top Students',
    description: 'Filter and order results from a single table.',
    difficulty: 'easy',
    setupSql: `DROP TABLE IF EXISTS Students;
CREATE TABLE Students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  mark INTEGER
);

INSERT INTO Students (id, name, mark) VALUES (1, 'Ada', 78);
INSERT INTO Students (id, name, mark) VALUES (2, 'Ben', 92);
INSERT INTO Students (id, name, mark) VALUES (3, 'Cara', 84);
INSERT INTO Students (id, name, mark) VALUES (4, 'Dan', 63);`,
    prompt: 'Write a query to show student name and mark where mark >= 80, ordered by mark descending.',
    starterSql: 'SELECT name, mark FROM Students WHERE mark >= 80 ORDER BY mark DESC;',
    expected: {
      columns: ['name', 'mark'],
      rows: [
        ['Ben', 92],
        ['Cara', 84],
      ],
      orderMatters: true,
    },
    hints: [
      'Use SELECT name, mark FROM Students.',
      'Filter with WHERE mark >= 80.',
      'Sort with ORDER BY mark DESC.',
    ],
    tags: ['select', 'where', 'order-by'],
  },
  {
    id: 'ex-library-join',
    title: 'Library Join',
    description: 'Join two related tables to combine data.',
    difficulty: 'medium',
    setupSql: `DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Authors;
CREATE TABLE Authors (
  author_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE Books (
  book_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER,
  year INTEGER,
  FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

INSERT INTO Authors (author_id, name) VALUES (1, 'Moyo');
INSERT INTO Authors (author_id, name) VALUES (2, 'Ncube');

INSERT INTO Books (book_id, title, author_id, year) VALUES (1, 'SQL Basics', 2, 2021);
INSERT INTO Books (book_id, title, author_id, year) VALUES (2, 'Data Design', 1, 2018);
INSERT INTO Books (book_id, title, author_id, year) VALUES (3, 'Join Practice', 1, 2022);`,
    prompt: 'Show book title and author name for books published from 2020 onwards.',
    starterSql: 'SELECT title, name FROM Books JOIN Authors ON Books.author_id = Authors.author_id WHERE year >= 2020;',
    expected: {
      columns: ['title', 'name'],
      rows: [
        ['SQL Basics', 'Ncube'],
        ['Join Practice', 'Moyo'],
      ],
      orderMatters: false,
    },
    hints: [
      'Use an INNER JOIN on author_id.',
      'Filter using WHERE year >= 2020.',
      'Select title and author name only.',
    ],
    tags: ['join', 'where'],
  },
  {
    id: 'ex-sales-summary',
    title: 'Sales Summary',
    description: 'Group rows and calculate totals.',
    difficulty: 'medium',
    setupSql: `DROP TABLE IF EXISTS Sales;
CREATE TABLE Sales (
  id INTEGER PRIMARY KEY,
  category TEXT,
  amount REAL
);

INSERT INTO Sales (id, category, amount) VALUES (1, 'Stationery', 12.5);
INSERT INTO Sales (id, category, amount) VALUES (2, 'Stationery', 8.0);
INSERT INTO Sales (id, category, amount) VALUES (3, 'Electronics', 120.0);
INSERT INTO Sales (id, category, amount) VALUES (4, 'Electronics', 80.0);
INSERT INTO Sales (id, category, amount) VALUES (5, 'Furniture', 200.0);`,
    prompt: 'Show category and total sales amount for each category.',
    starterSql: 'SELECT category, SUM(amount) AS total_amount FROM Sales GROUP BY category;',
    expected: {
      columns: ['category', 'total_amount'],
      rows: [
        ['Stationery', 20.5],
        ['Electronics', 200],
        ['Furniture', 200],
      ],
      orderMatters: false,
    },
    hints: [
      'Use SUM(amount) and GROUP BY category.',
      'You can alias SUM(amount) as total_amount.',
      'Order is not required for this task.',
    ],
    tags: ['group-by', 'sum'],
  },
  {
    id: 'ex-attendance-count',
    title: 'Attendance Count',
    description: 'Count rows with a filter.',
    difficulty: 'easy',
    setupSql: `DROP TABLE IF EXISTS Attendance;
CREATE TABLE Attendance (
  id INTEGER PRIMARY KEY,
  student TEXT,
  status TEXT
);

INSERT INTO Attendance (id, student, status) VALUES (1, 'Rita', 'Present');
INSERT INTO Attendance (id, student, status) VALUES (2, 'Sam', 'Absent');
INSERT INTO Attendance (id, student, status) VALUES (3, 'Tari', 'Present');
INSERT INTO Attendance (id, student, status) VALUES (4, 'Yara', 'Present');`,
    prompt: 'Count how many students were Present.',
    starterSql: "SELECT COUNT(*) AS present_count FROM Attendance WHERE status = 'Present';",
    expected: {
      rowCount: 1,
      rows: [[3]],
      orderMatters: true,
    },
    hints: [
      'Use COUNT(*) to count rows.',
      "Filter using WHERE status = 'Present'.",
      'Alias the count as present_count.',
    ],
    tags: ['count', 'where'],
  },
];
