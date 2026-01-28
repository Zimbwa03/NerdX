import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';

export interface ProgrammingTemplate {
    id: string;
    title: string;
    description: string;
    language: ProgrammingLanguage;
    code: string;
}

export const PROGRAMMING_TEMPLATES: ProgrammingTemplate[] = [
    {
        id: 'add-two-numbers-python',
        title: 'Add Two Numbers',
        description: 'Reads two numbers from the user and prints their sum.',
        language: 'python',
        code: `# Add two numbers entered by the user

first = float(input("Enter first number: "))
second = float(input("Enter second number: "))

total = first + second
print("The sum is:", total)
`,
    },
    {
        id: 'max-of-three-python',
        title: 'Largest of Three Numbers',
        description: 'Finds the largest of three numbers using if/elif.',
        language: 'python',
        code: `# Find the largest of three numbers

a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
c = float(input("Enter third number: "))

largest = a
if b > largest:
    largest = b
if c > largest:
    largest = c

print("The largest number is:", largest)
`,
    },
    {
        id: 'even-odd-python',
        title: 'Even or Odd',
        description: 'Checks if a number is even or odd.',
        language: 'python',
        code: `# Check if a number is even or odd

n = int(input("Enter an integer: "))

if n % 2 == 0:
    print(n, "is even")
else:
    print(n, "is odd")
`,
    },
    {
        id: 'simple-calculator-python',
        title: 'Simple Calculator',
        description: 'Performs +, -, * or / on two numbers.',
        language: 'python',
        code: `# Very simple calculator

print("Simple calculator")
print("Choose operation: +  -  *  /")
op = input("Enter operation: ")

a = float(input("Enter first number: "))
b = float(input("Enter second number: "))

if op == "+":
    print("Result:", a + b)
elif op == "-":
    print("Result:", a - b)
elif op == "*":
    print("Result:", a * b)
elif op == "/":
    if b != 0:
        print("Result:", a / b)
    else:
        print("Cannot divide by zero")
else:
    print("Unknown operation")
`,
    },
];

