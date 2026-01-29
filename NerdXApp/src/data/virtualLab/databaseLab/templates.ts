// Database Lab - Sample SQL schemas for practice (ZIMSEC / Cambridge aligned)

export interface DatabaseLabTemplate {
  id: string;
  title: string;
  description: string;
  sql: string;
}

export const DATABASE_LAB_TEMPLATES: DatabaseLabTemplate[] = [
  {
    id: 'students',
    title: 'Students',
    description: 'A simple Students table with id, name, dob, and mark. Practice SELECT, INSERT, UPDATE, DELETE.',
    sql: `-- Students table (primary key, data types)
CREATE TABLE Students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  dob TEXT,
  mark INTEGER
);

INSERT INTO Students (id, name, dob, mark) VALUES (1, 'Alice', '2005-03-15', 85);
INSERT INTO Students (id, name, dob, mark) VALUES (2, 'Bob', '2005-07-22', 72);
INSERT INTO Students (id, name, dob, mark) VALUES (3, 'Carol', '2005-11-08', 90);

SELECT * FROM Students;`,
  },
  {
    id: 'library',
    title: 'Library',
    description: 'Books and Authors tables. Practice JOINs and filtering.',
    sql: `-- Library: Books and Authors
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

INSERT INTO Authors (author_id, name) VALUES (1, 'Jane Doe');
INSERT INTO Authors (author_id, name) VALUES (2, 'John Smith');

INSERT INTO Books (book_id, title, author_id, year) VALUES (1, 'Introduction to Databases', 1, 2020);
INSERT INTO Books (book_id, title, author_id, year) VALUES (2, 'SQL Basics', 2, 2021);
INSERT INTO Books (book_id, title, author_id, year) VALUES (3, 'Data Design', 1, 2019);

SELECT * FROM Books JOIN Authors ON Books.author_id = Authors.author_id;`,
  },
  {
    id: 'shop',
    title: 'Shop',
    description: 'Products table. Practice ORDER BY, aggregate functions (COUNT, SUM).',
    sql: `-- Shop: Products
CREATE TABLE Products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER
);

INSERT INTO Products (id, name, category, price, stock) VALUES (1, 'Laptop', 'Electronics', 899.99, 10);
INSERT INTO Products (id, name, category, price, stock) VALUES (2, 'Mouse', 'Electronics', 24.99, 50);
INSERT INTO Products (id, name, category, price, stock) VALUES (3, 'Desk', 'Furniture', 199.99, 5);
INSERT INTO Products (id, name, category, price, stock) VALUES (4, 'Chair', 'Furniture', 149.99, 8);

SELECT * FROM Products ORDER BY price DESC;`,
  },
  {
    id: 'blank',
    title: 'Blank',
    description: 'Start from scratch. Write your own CREATE TABLE and queries.',
    sql: `-- Write your SQL here
-- Example:
-- CREATE TABLE my_table (id INTEGER PRIMARY KEY, name TEXT);
-- INSERT INTO my_table (id, name) VALUES (1, 'First');
-- SELECT * FROM my_table;`,
  },
];
