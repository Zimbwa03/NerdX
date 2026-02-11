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
        description: 'Adds two numbers and shows the result. Change the values to test.',
        language: 'python',
        code: `# Add two numbers (no input required)
# Change the values of first and second, then press Run.

first = 5.0
second = 7.5

print("First number:", first)
print("Second number:", second)
total = first + second
print("The sum is:", total)
`,
    },
    {
        id: 'max-of-three-python',
        title: 'Largest of Three Numbers',
        description: 'Finds the largest of three numbers. Change a, b, c to test.',
        language: 'python',
        code: `# Find the largest of three numbers (no input required)
# Change the values of a, b and c, then press Run.

a = 4
b = 12
c = 9

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
        description: 'Checks if a number is even or odd. Change n to test.',
        language: 'python',
        code: `# Check if a number is even or odd (no input required)
# Change the value of n, then press Run.

n = 10

if n % 2 == 0:
    print(n, "is even")
else:
    print(n, "is odd")
`,
    },
    {
        id: 'simple-calculator-python',
        title: 'Simple Calculator (Python)',
        description: 'Performs +, -, * or / on two numbers. Change a, b, op to test.',
        language: 'python',
        code: `# Very simple calculator (no input required)
# Change the values of a, b and op, then press Run.

print("Simple calculator")

op = "+"  # Try "+", "-", "*", or "/"
a = 8
b = 3

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
    {
        id: 'hello-world-vbnet',
        title: 'Hello World (VB.NET)',
        description: 'Basic console output in VB.NET',
        language: 'vbnet',
        code: `Module Module1
    Sub Main()
        Console.WriteLine("Hello, World!")
        Console.WriteLine("This is VB.NET running in the browser!")
    End Sub
End Module
`,
    },
    {
        id: 'vars-vbnet',
        title: 'Variables (VB.NET)',
        description: 'Working with variables and math in VB.NET',
        language: 'vbnet',
        code: `Module Module1
    Sub Main()
        Dim a As Integer = 10
        Dim b As Integer = 20
        Dim sum As Integer = a + b
        
        Console.WriteLine("A = " & a)
        Console.WriteLine("B = " & b)
        Console.WriteLine("Sum = " & sum)
    End Sub
End Module
`,
    },
    {
        id: 'hello-world-java',
        title: 'Hello World (Java)',
        description: 'Basic class structure in Java',
        language: 'java',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java is ready to run.");
    }
}
`,
    },
    {
        id: 'loops-java',
        title: 'Loops (Java)',
        description: 'For loop example in Java',
        language: 'java',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Counting to 5:");
        for(int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
`,
    },
];

