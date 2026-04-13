#!/usr/bin/env python3
"""
Mathematics Algebra Question Prompts
180 Unique Prompts for ZIMSEC O-Level Mathematics
Organized by Topic and Difficulty Level

Each prompt includes:
- Topic and subtopic classification
- Difficulty level (easy, medium, difficult)
- Detailed prompt for AI question generation
- Learning objectives and expected outcomes
"""

# ============================================================================
# TOPIC 1: BASIC ALGEBRAIC EXPRESSIONS (15 Prompts)
# ============================================================================

BASIC_ALGEBRAIC_EXPRESSIONS = {
    "topic": "Basic Algebraic Expressions",
    "description": "Simplifying, expanding, and manipulating algebraic expressions",
    "learning_objectives": [
        "Identify and use algebraic terms (variable, constant, coefficient, term)",
        "Simplify expressions by collecting like terms",
        "Expand single brackets: a(b + c)",
        "Expand double brackets: (a + b)(c + d)",
        "Apply BODMAS/BIDMAS to algebraic expressions"
    ],
    "prompts": {
        "easy": [
            # EASY 1: Identifying Terms
            {
                "id": "BAE_E01",
                "subtopic": "Identifying Algebraic Terms",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about identifying parts of an algebraic expression.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep language simple and clear.

QUESTION TYPE: Direct Knowledge

Requirements:
- Give an algebraic expression like 3x² + 5y - 7
- Ask students to identify: number of terms, coefficients, constants, or variables
- Use whole number coefficients only (1-10)
- Variables can be x, y, a, or b

Example question styles:
- "In the expression 4x + 7y - 3, what is the coefficient of x?"
- "How many terms are in the expression 2a + 3b - 5 + a?"
- "What is the constant term in 5x - 2y + 8?"

Return ONLY valid JSON:
{
    "question": "Clear question about identifying parts of an expression",
    "solution": "Step 1: Identify each part of the expression\\nStep 2: Locate the specific requested term/coefficient/constant\\nStep 3: State the answer",
    "answer": "The specific value or count requested",
    "points": 10,
    "explanation": "Define what coefficient/constant/term means in this context",
    "teaching_explanation": "Relate to everyday example - coefficients are like 'how many' of something you have"
}""",
                "learning_objective": "Identify coefficients, constants, and variables in algebraic expressions"
            },
            
            # EASY 2: Collecting Like Terms (Simple)
            {
                "id": "BAE_E02",
                "subtopic": "Collecting Like Terms - Simple",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about collecting like terms.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep language simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Expression with 4-5 terms involving ONE variable only
- All positive coefficients (no negatives)
- Maximum 2 different variables
- Coefficients from 1-9

Example question styles:
- "Simplify: 3x + 2x + 5x"
- "Simplify: 4y + 2y + y"
- "Collect like terms: 2a + 3a + a"

Return ONLY valid JSON:
{
    "question": "Simplify: [expression with like terms to collect]",
    "solution": "Step 1: Identify like terms (terms with the same variable)\\nStep 2: Add the coefficients of like terms\\nStep 3: Write the simplified expression",
    "answer": "The simplified expression",
    "points": 10,
    "explanation": "Like terms have the same variable and power, so we can add their coefficients",
    "teaching_explanation": "Think of it like counting: 3 apples + 2 apples = 5 apples, so 3x + 2x = 5x"
}""",
                "learning_objective": "Combine like terms in simple algebraic expressions"
            },
            
            # EASY 3: Collecting Like Terms (Two Variables)
            {
                "id": "BAE_E03",
                "subtopic": "Collecting Like Terms - Two Variables",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about collecting like terms with two variables.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep language simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Expression with 5-6 terms involving TWO different variables
- All positive coefficients
- Use variables x and y (or a and b)
- Coefficients from 1-9
- Terms should be mixed (not grouped by variable)

Example question styles:
- "Simplify: 3x + 2y + 5x + y"
- "Collect like terms: 4a + 2b + 3a + 5b"

Return ONLY valid JSON:
{
    "question": "Simplify: [expression with two variables]",
    "solution": "Step 1: Identify x-terms and y-terms separately\\nStep 2: Group and add x-terms: [show working]\\nStep 3: Group and add y-terms: [show working]\\nStep 4: Write final simplified expression",
    "answer": "The simplified expression with both variables",
    "points": 10,
    "explanation": "We can only combine terms with the same variable - x terms with x terms, y terms with y terms",
    "teaching_explanation": "You can add apples to apples and oranges to oranges, but not apples to oranges. Same with x and y!"
}""",
                "learning_objective": "Combine like terms when expressions contain multiple variables"
            },
            
            # EASY 4: Expanding Single Brackets (Simple)
            {
                "id": "BAE_E04",
                "subtopic": "Expanding Single Brackets - Simple",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding a single bracket.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep language simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Format: a(bx + c) where a, b, c are small positive integers (1-5)
- Only positive terms inside the bracket
- One variable only (x or y)
- Coefficient outside bracket is a simple number (2-5)

Example question styles:
- "Expand: 2(x + 3)"
- "Expand: 3(2y + 4)"
- "Remove the brackets: 5(a + 2)"

Return ONLY valid JSON:
{
    "question": "Expand: [number](variable + number)",
    "solution": "Step 1: Multiply the number outside by each term inside\\nStep 2: [show first multiplication]\\nStep 3: [show second multiplication]\\nStep 4: Write the expanded expression",
    "answer": "The expanded expression without brackets",
    "points": 10,
    "explanation": "When expanding, multiply the term outside the bracket by every term inside",
    "teaching_explanation": "Imagine giving 3 bags to each person at a party. If 2 bags have sweets and 1 has crisps, everyone gets 6 sweet bags and 3 crisp bags total!"
}""",
                "learning_objective": "Expand expressions with a single bracket using the distributive law"
            },
            
            # EASY 5: Substitution into Expressions
            {
                "id": "BAE_E05",
                "subtopic": "Substitution",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about substituting values into algebraic expressions.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep language simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Simple expression with 2-3 terms
- One variable only
- Given value is a small positive integer (1-5)
- Expression should give a nice whole number answer
- No powers higher than 1

Example question styles:
- "If x = 3, find the value of 2x + 5"
- "Find the value of 4y - 2 when y = 4"
- "Evaluate 3a + 7 when a = 2"

Return ONLY valid JSON:
{
    "question": "If [variable] = [value], find the value of [expression]",
    "solution": "Step 1: Write the expression: [expression]\\nStep 2: Replace [variable] with [value]\\nStep 3: Calculate: [show arithmetic]\\nStep 4: State the answer",
    "answer": "The numerical value",
    "points": 10,
    "explanation": "Substitution means replacing a variable with its given value, then calculating",
    "teaching_explanation": "Think of the variable as a mystery box. Once you know what's inside (the value), swap it in and calculate!"
}""",
                "learning_objective": "Substitute numerical values into algebraic expressions"
            }
        ],
        
        "medium": [
            # MEDIUM 1: Collecting Like Terms with Negatives
            {
                "id": "BAE_M01",
                "subtopic": "Collecting Like Terms - With Negatives",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about collecting like terms with negative coefficients.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear with some challenge.

QUESTION TYPE: Application

Requirements:
- Expression with 5-6 terms involving two variables
- Include BOTH positive AND negative coefficients
- Use variables x and y (or a and b)
- Mix of addition and subtraction
- Coefficients from -9 to 9

Example question styles:
- "Simplify: 5x - 3y + 2x + 4y - x"
- "Collect like terms: 4a - 2b - 3a + 5b - a"

Return ONLY valid JSON:
{
    "question": "Simplify: [expression with positive and negative terms]",
    "solution": "Step 1: Identify all x-terms (with their signs): [list them]\\nStep 2: Identify all y-terms (with their signs): [list them]\\nStep 3: Add x-terms: [show working with signs]\\nStep 4: Add y-terms: [show working with signs]\\nStep 5: Write final answer",
    "answer": "The simplified expression",
    "points": 20,
    "explanation": "When collecting like terms with negatives, keep track of the sign in front of each term",
    "teaching_explanation": "Think of positives as money you have and negatives as money you owe. 5x - 3x means you have 5 x's but owe 3, so you're left with 2x."
}""",
                "learning_objective": "Combine like terms involving negative coefficients"
            },
            
            # MEDIUM 2: Expanding Single Brackets with Negatives
            {
                "id": "BAE_M02",
                "subtopic": "Expanding Single Brackets - With Negatives",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding brackets with negative terms.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear with some challenge.

QUESTION TYPE: Application

Requirements:
- Format: a(bx - c) or -a(bx + c) 
- Include at least one negative sign
- Coefficients from 2-6
- Single variable (x, y, or a)

Example question styles:
- "Expand: 3(2x - 5)"
- "Expand: -2(4y + 3)"
- "Remove the brackets: 4(3a - 2)"

Return ONLY valid JSON:
{
    "question": "Expand: [expression with negative inside or outside bracket]",
    "solution": "Step 1: Multiply the term outside by the first term inside\\nStep 2: [show working with signs]\\nStep 3: Multiply the term outside by the second term inside\\nStep 4: [show working with signs]\\nStep 5: Write the expanded expression",
    "answer": "The fully expanded expression",
    "points": 20,
    "explanation": "Remember: positive × negative = negative, negative × negative = positive",
    "teaching_explanation": "The sign rules are like friends and enemies: friend × friend = friend, enemy × enemy = friend, but friend × enemy = enemy!"
}""",
                "learning_objective": "Expand brackets involving negative terms correctly"
            },
            
            # MEDIUM 3: Expand and Simplify
            {
                "id": "BAE_M03",
                "subtopic": "Expand and Simplify",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding then simplifying.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear with some challenge.

QUESTION TYPE: Multi-step Application

Requirements:
- Two separate bracket expressions to expand and then combine
- Format: a(bx + c) + d(ex + f)
- After expanding, there should be like terms to collect
- Use simple coefficients (2-5)

Example question styles:
- "Expand and simplify: 2(x + 3) + 3(x + 2)"
- "Expand and simplify: 4(2y - 1) + 2(y + 5)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: [first bracket expression] + [second bracket expression]",
    "solution": "Step 1: Expand the first bracket: [show working]\\nStep 2: Expand the second bracket: [show working]\\nStep 3: Write all terms together\\nStep 4: Collect like terms\\nStep 5: Write simplified answer",
    "answer": "The final simplified expression",
    "points": 20,
    "explanation": "First expand each bracket separately, then collect like terms in the result",
    "teaching_explanation": "It's like unpacking two suitcases and then sorting everything together by type - all shirts together, all socks together!"
}""",
                "learning_objective": "Expand multiple brackets and simplify by collecting like terms"
            },
            
            # MEDIUM 4: Factorising with Common Factor
            {
                "id": "BAE_M04",
                "subtopic": "Factorising - Common Factor",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about factorising using a common factor.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear with some challenge.

QUESTION TYPE: Application

Requirements:
- Expression where all terms share a common factor
- Format: ax + ay or ax + bx or abx + acx
- Common factor should be obvious (2, 3, 4, 5, or x)
- 2-3 terms in the expression

Example question styles:
- "Factorise: 6x + 9"
- "Factorise completely: 4x + 8"
- "Write in factorised form: 3x + 3y"

Return ONLY valid JSON:
{
    "question": "Factorise: [expression with common factor]",
    "solution": "Step 1: Find the highest common factor (HCF) of all terms\\nStep 2: Divide each term by the HCF\\nStep 3: Write as HCF(remaining terms)\\nStep 4: Check by expanding",
    "answer": "The factorised form: HCF(remaining expression)",
    "points": 20,
    "explanation": "Factorising is the reverse of expanding - we find what's common and take it outside a bracket",
    "teaching_explanation": "Think of it as finding what's the same in everyone's lunchbox and putting it outside: if everyone has 2 sandwiches, that's the common factor!"
}""",
                "learning_objective": "Identify and extract common factors from algebraic expressions"
            },
            
            # MEDIUM 5: Algebraic Fractions - Simplifying
            {
                "id": "BAE_M05",
                "subtopic": "Simplifying Algebraic Expressions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about simplifying more complex expressions.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear with some challenge.

QUESTION TYPE: Application

Requirements:
- Expression with multiple operations
- Include a mix of expanding and collecting
- May include subtraction of bracket expressions
- Format: a(bx + c) - d(ex + f)

Example question styles:
- "Simplify: 3(2x + 4) - 2(x - 1)"
- "Expand and simplify: 5(y - 2) - 3(y + 4)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: [expression with subtraction of brackets]",
    "solution": "Step 1: Expand first bracket: [show working]\\nStep 2: Expand second bracket (careful with the minus sign!)\\nStep 3: The minus affects ALL terms in the second bracket\\nStep 4: Collect like terms\\nStep 5: Write simplified answer",
    "answer": "The final simplified expression",
    "points": 20,
    "explanation": "When subtracting a bracket, the minus sign changes the sign of every term inside",
    "teaching_explanation": "Subtracting a bracket is like taking away a whole package - if the package has +3 and -2, taking it away gives you -3 and +2!"
}""",
                "learning_objective": "Correctly handle subtraction of bracket expressions"
            }
        ],
        
        "difficult": [
            # DIFFICULT 1: Expanding Double Brackets
            {
                "id": "BAE_D01",
                "subtopic": "Expanding Double Brackets",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding double brackets (FOIL method).

STUDENT LEVEL: Form 4 students preparing for exams. Challenging but clear.

QUESTION TYPE: Complex Application

Requirements:
- Format: (x + a)(x + b) where a, b are integers from -5 to 5
- Include at least one negative value
- Should give a trinomial answer
- Variable is x

Example question styles:
- "Expand: (x + 3)(x - 2)"
- "Expand and simplify: (x - 4)(x + 5)"
- "Write as a quadratic expression: (x - 2)(x - 3)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: (x + a)(x + b)",
    "solution": "Step 1: Use FOIL - First: x × x = x²\\nStep 2: Outer: x × [second constant]\\nStep 3: Inner: [first constant] × x\\nStep 4: Last: [first constant] × [second constant]\\nStep 5: Collect like terms (the x terms)\\nStep 6: Write final trinomial",
    "answer": "x² + [coefficient]x + [constant]",
    "points": 30,
    "explanation": "FOIL means First, Outer, Inner, Last - multiply each pair and add the results",
    "teaching_explanation": "Think of it as making sure everyone at two tables shakes hands with everyone at the other table - every term meets every term!"
}""",
                "learning_objective": "Expand double brackets using FOIL method to get quadratic expressions"
            },
            
            # DIFFICULT 2: Expanding Double Brackets (Coefficient of x)
            {
                "id": "BAE_D02",
                "subtopic": "Double Brackets with Coefficients",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding double brackets where x has a coefficient.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging but clear.

QUESTION TYPE: Complex Application

Requirements:
- Format: (ax + b)(cx + d) where a or c is NOT 1
- Use small coefficients (2 or 3) for x terms
- Include mix of positive and negative constants
- Should give a quadratic ending in ax² + bx + c form

Example question styles:
- "Expand: (2x + 3)(x - 4)"
- "Expand and simplify: (3x - 2)(2x + 1)"
- "Write as a quadratic: (2x + 5)(3x - 2)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: (ax + b)(cx + d)",
    "solution": "Step 1: First terms: [ax] × [cx] = [ac]x²\\nStep 2: Outer terms: [ax] × [d] = [ad]x\\nStep 3: Inner terms: [b] × [cx] = [bc]x\\nStep 4: Last terms: [b] × [d] = [bd]\\nStep 5: Collect x terms: [ad]x + [bc]x = [ad+bc]x\\nStep 6: Final answer in form ax² + bx + c",
    "answer": "Final quadratic expression",
    "points": 30,
    "explanation": "Same FOIL method, but pay careful attention to multiplying coefficients correctly",
    "teaching_explanation": "When both x's have coefficients, multiply them together for x² term. The coefficient of x comes from the outer and inner products added together."
}""",
                "learning_objective": "Expand double brackets with coefficients using FOIL method"
            },
            
            # DIFFICULT 3: Expanding Three or More Brackets
            {
                "id": "BAE_D03",
                "subtopic": "Multiple Bracket Expansion",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about expanding expressions with three brackets.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Complex Multi-step

Requirements:
- Format: (x + a)(x + b)(x + c) OR a(x + b)(x + c)
- Work with two brackets first, then multiply by third
- Use small integer values
- Variable is x

Example question styles:
- "Expand: (x + 1)(x + 2)(x + 3)"
- "Expand completely: 2(x - 1)(x + 3)"
- "Expand and simplify: (x + 2)²(x - 1)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: [three bracket expression]",
    "solution": "Step 1: First expand two of the brackets: [show FOIL]\\nStep 2: Result from step 1: [intermediate quadratic]\\nStep 3: Now multiply this by the third bracket\\nStep 4: Multiply each term systematically\\nStep 5: Collect all like terms\\nStep 6: Write final cubic expression",
    "answer": "Final expression (usually a cubic)",
    "points": 30,
    "explanation": "With three brackets, expand two first to get a quadratic, then multiply the result by the third bracket",
    "teaching_explanation": "It's like a two-step cooking recipe: first combine two ingredients, then mix the result with the third!"
}""",
                "learning_objective": "Expand expressions involving three brackets systematically"
            },
            
            # DIFFICULT 4: Difference of Two Squares
            {
                "id": "BAE_D04",
                "subtopic": "Difference of Two Squares",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about difference of two squares.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Pattern Recognition and Application

Requirements:
- EITHER expanding (a + b)(a - b) = a² - b²
- OR factorising expressions in form a² - b²
- Use perfect squares (4, 9, 16, 25, 36)
- Can include x² - number or (ax)² - number

Example question styles (choose ONE type):
- Expand: "(3x + 5)(3x - 5)"
- Factorise: "49 - x²"
- Factorise: "4x² - 25"

Return ONLY valid JSON:
{
    "question": "Either factorise or expand a difference of squares expression",
    "solution": "For factorising: Step 1: Recognise as difference of two squares (a² - b²)\\nStep 2: Identify a (square root of first term)\\nStep 3: Identify b (square root of second term)\\nStep 4: Write as (a + b)(a - b)\\nOR for expanding: show that middle terms cancel",
    "answer": "Factorised or expanded form",
    "points": 30,
    "explanation": "The difference of two squares (a² - b²) always factorises to (a + b)(a - b) because the middle terms cancel",
    "teaching_explanation": "When you have a sum and difference of the same things, the middle bits always cancel out - like (+5 - 5 = 0)!"
}""",
                "learning_objective": "Recognise and use the difference of two squares identity"
            },
            
            # DIFFICULT 5: Perfect Square Expansion
            {
                "id": "BAE_D05",
                "subtopic": "Perfect Square Expressions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about perfect square expressions.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Pattern Recognition and Application

Requirements:
- EITHER expanding (a + b)² or (a - b)²
- OR recognising/factorising perfect square trinomials
- Format: (ax + b)² or x² ± 2ab + b²
- Use small integers for cleaner arithmetic

Example question styles (choose ONE type):
- Expand: "(x + 4)²"
- Expand: "(2x - 3)²"  
- Factorise: "x² + 6x + 9"
- "Show that x² - 10x + 25 is a perfect square"

Return ONLY valid JSON:
{
    "question": "Perfect square expansion or recognition question",
    "solution": "For expanding (a + b)²:\\nStep 1: Use identity (a + b)² = a² + 2ab + b²\\nStep 2: Identify a and b\\nStep 3: Calculate a², 2ab, and b²\\nStep 4: Write final trinomial\\nOR for factorising: check if middle term = 2 × √(first) × √(last)",
    "answer": "Expanded trinomial or factorised perfect square",
    "points": 30,
    "explanation": "(a + b)² = a² + 2ab + b² and (a - b)² = a² - 2ab + b². The middle term is always twice the product.",
    "teaching_explanation": "When you square a bracket, you get three terms: the first squared, twice the product, and the last squared. Remember: (a+b)² is NOT a² + b²!"
}""",
                "learning_objective": "Use perfect square identities for expansion and factorisation"
            }
        ]
    }
}

# ============================================================================
# TOPIC 2: LINEAR EQUATIONS (15 Prompts)
# ============================================================================

LINEAR_EQUATIONS = {
    "topic": "Linear Equations",
    "description": "Solving equations with one unknown variable",
    "learning_objectives": [
        "Solve one-step equations (x + a = b, ax = b)",
        "Solve two-step equations (ax + b = c)",
        "Solve equations with variables on both sides",
        "Solve equations with brackets",
        "Form and solve equations from word problems"
    ],
    "prompts": {
        "easy": [
            # EASY 1: One-step Addition/Subtraction
            {
                "id": "LE_E01",
                "subtopic": "One-step Equations - Addition/Subtraction",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving one-step equations using addition or subtraction.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Format: x + a = b OR x - a = b
- Use positive integers only (a, b between 1-20)
- Variable is x or y
- Solution should be a positive integer

Example question styles:
- "Solve: x + 7 = 15"
- "Find the value of y if y - 4 = 12"
- "Solve for x: x + 9 = 20"

Return ONLY valid JSON:
{
    "question": "Solve: x + a = b (or x - a = b)",
    "solution": "Step 1: Write the equation\\nStep 2: To isolate x, [add/subtract] [value] from both sides\\nStep 3: x = [answer]\\nStep 4: Check by substituting back",
    "answer": "x = [value]",
    "points": 10,
    "explanation": "To solve for x, we perform the inverse operation on both sides to isolate x",
    "teaching_explanation": "Think of the equation as a balance scale. Whatever you do to one side, you must do to the other to keep it balanced!"
}""",
                "learning_objective": "Solve one-step equations using addition or subtraction"
            },
            
            # EASY 2: One-step Multiplication/Division
            {
                "id": "LE_E02",
                "subtopic": "One-step Equations - Multiplication/Division",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving one-step equations using multiplication or division.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep simple and clear.

QUESTION TYPE: Direct Application

Requirements:
- Format: ax = b OR x/a = b
- Coefficient a should be 2, 3, 4, 5, or 6
- Answer should be a whole number
- Variable is x

Example question styles:
- "Solve: 3x = 12"
- "Find x if 5x = 25"
- "Solve: x/4 = 7"

Return ONLY valid JSON:
{
    "question": "Solve: ax = b (or x/a = b)",
    "solution": "Step 1: Write the equation\\nStep 2: To isolate x, [divide/multiply] both sides by [value]\\nStep 3: x = [answer]\\nStep 4: Check: [coefficient] × [answer] = [result]",
    "answer": "x = [value]",
    "points": 10,
    "explanation": "When x is multiplied by a number, divide both sides by that number. When x is divided, multiply both sides.",
    "teaching_explanation": "If 3 baskets hold 12 apples total, each basket has 12÷3 = 4 apples. Same idea with 3x = 12!"
}""",
                "learning_objective": "Solve one-step equations using multiplication or division"
            },
            
            # EASY 3: Two-step Equations (Simple)
            {
                "id": "LE_E03",
                "subtopic": "Two-step Equations - Simple",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving simple two-step equations.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep clear.

QUESTION TYPE: Application

Requirements:
- Format: ax + b = c (all positive)
- Coefficient a should be 2, 3, or 4
- Constant b should be 1-10
- Answer should be a positive whole number
- Variable is x

Example question styles:
- "Solve: 2x + 5 = 13"
- "Find x: 3x + 4 = 19"
- "Solve for x: 4x + 3 = 23"

Return ONLY valid JSON:
{
    "question": "Solve: ax + b = c",
    "solution": "Step 1: Write the equation: ax + b = c\\nStep 2: Subtract b from both sides: ax = c - b\\nStep 3: Divide both sides by a: x = (c - b)/a\\nStep 4: Calculate: x = [answer]\\nStep 5: Check by substituting back",
    "answer": "x = [value]",
    "points": 10,
    "explanation": "For two-step equations, first deal with addition/subtraction, then multiplication/division",
    "teaching_explanation": "Think: 'undo' what was done to x in reverse order. Last thing done was adding b, so first we subtract b. Then we divide."
}""",
                "learning_objective": "Solve two-step linear equations systematically"
            },
            
            # EASY 4: Two-step Equations (With Subtraction)
            {
                "id": "LE_E04",
                "subtopic": "Two-step Equations - With Subtraction",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about two-step equations with subtraction.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Keep clear.

QUESTION TYPE: Application

Requirements:
- Format: ax - b = c 
- Coefficient a should be 2, 3, or 4
- All values positive, answer positive integer
- Variable is x

Example question styles:
- "Solve: 2x - 3 = 11"
- "Find x: 5x - 8 = 17"
- "Solve for x: 3x - 5 = 10"

Return ONLY valid JSON:
{
    "question": "Solve: ax - b = c",
    "solution": "Step 1: Write the equation: ax - b = c\\nStep 2: Add b to both sides: ax = c + b\\nStep 3: Divide both sides by a: x = (c + b)/a\\nStep 4: Calculate: x = [answer]\\nStep 5: Check: a × [answer] - b = c ✓",
    "answer": "x = [value]",
    "points": 10,
    "explanation": "To undo subtraction, we add the same value to both sides",
    "teaching_explanation": "If you took 3 away from something and got 11, the original must have been 11 + 3 = 14!"
}""",
                "learning_objective": "Solve two-step equations involving subtraction"
            },
            
            # EASY 5: Simple Variable Both Sides
            {
                "id": "LE_E05",
                "subtopic": "Variables on Both Sides - Simple",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with variables on both sides (simple version).

STUDENT LEVEL: Form 3-4 students (ages 15-17). Clear introduction to concept.

QUESTION TYPE: Application

Requirements:
- Format: ax = bx + c where a > b (both positive)
- Coefficients 2-6, constant 2-20
- No negative terms
- Answer is positive integer

Example question styles:
- "Solve: 5x = 2x + 9"
- "Find x: 4x = x + 12"
- "Solve for x: 6x = 3x + 15"

Return ONLY valid JSON:
{
    "question": "Solve: ax = bx + c",
    "solution": "Step 1: Write the equation\\nStep 2: Collect x terms on one side: subtract [smaller coefficient]x from both sides\\nStep 3: [larger-smaller]x = c\\nStep 4: Divide both sides by [coefficient]\\nStep 5: x = [answer]",
    "answer": "x = [value]",
    "points": 10,
    "explanation": "When x appears on both sides, collect all x terms on one side and constants on the other",
    "teaching_explanation": "Imagine 5 boxes on the left and 2 boxes + 9 items on the right. Take 2 boxes from each side - now 3 boxes = 9 items!"
}""",
                "learning_objective": "Solve equations with the variable appearing on both sides"
            }
        ],
        
        "medium": [
            # MEDIUM 1: Variables Both Sides (With Negatives)
            {
                "id": "LE_M01",
                "subtopic": "Variables on Both Sides - With Negatives",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with variables on both sides involving negative values.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Some challenge.

QUESTION TYPE: Application

Requirements:
- Format: ax + b = cx + d with some negative values
- Must have answer as integer (can be negative)
- Include at least one negative coefficient or constant
- Different coefficients of x on each side

Example question styles:
- "Solve: 3x + 5 = 7x - 11"
- "Find x: 2x - 8 = 5x + 4"
- "Solve for x: 4x + 3 = x - 9"

Return ONLY valid JSON:
{
    "question": "Solve: ax + b = cx + d (with some negatives)",
    "solution": "Step 1: Collect x terms on one side (subtract smaller x coefficient from both)\\nStep 2: Collect constants on the other side\\nStep 3: Show careful work with signs\\nStep 4: Divide to find x\\nStep 5: Check by substituting back into original",
    "answer": "x = [value]",
    "points": 20,
    "explanation": "Move all x terms to one side and all constants to the other, being careful with negative signs",
    "teaching_explanation": "Moving a term to the other side is like walking through a mirror - positive becomes negative and vice versa!"
}""",
                "learning_objective": "Solve equations with variables on both sides including negative terms"
            },
            
            # MEDIUM 2: Equations with Brackets
            {
                "id": "LE_M02",
                "subtopic": "Equations with Brackets",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving equations containing brackets.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Some challenge.

QUESTION TYPE: Multi-step Application

Requirements:
- Format: a(x + b) = c OR a(bx + c) = d
- Expand bracket first, then solve
- Answer should be a whole number
- Use small coefficients (2-5)

Example question styles:
- "Solve: 3(x + 2) = 15"
- "Find x: 2(3x - 4) = 16"
- "Solve for x: 5(x + 1) = 20"

Return ONLY valid JSON:
{
    "question": "Solve: a(x + b) = c",
    "solution": "Step 1: Expand the bracket: [show expansion]\\nStep 2: Result: ax + ab = c\\nStep 3: Subtract ab from both sides\\nStep 4: Divide by coefficient of x\\nStep 5: x = [answer]\\nStep 6: Check in original equation",
    "answer": "x = [value]",
    "points": 20,
    "explanation": "First expand the bracket, then solve the resulting two-step equation",
    "teaching_explanation": "Opening the bracket is like unpacking - once everything is visible, solving becomes straightforward!"
}""",
                "learning_objective": "Solve equations by first expanding brackets"
            },
            
            # MEDIUM 3: Equations with Brackets Both Sides
            {
                "id": "LE_M03",
                "subtopic": "Brackets on Both Sides",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with brackets on both sides.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Challenging.

QUESTION TYPE: Multi-step Application

Requirements:
- Format: a(x + b) = c(x + d)
- Different coefficients outside brackets
- Expand both, then solve
- Answer should be an integer

Example question styles:
- "Solve: 2(x + 3) = 3(x - 1)"
- "Find x: 4(x - 2) = 2(x + 5)"
- "Solve for x: 5(x + 1) = 2(x + 8)"

Return ONLY valid JSON:
{
    "question": "Solve: a(x + b) = c(x + d)",
    "solution": "Step 1: Expand left bracket: [result]\\nStep 2: Expand right bracket: [result]\\nStep 3: Collect x terms on one side\\nStep 4: Collect constants on other side\\nStep 5: Divide to find x\\nStep 6: Check in original",
    "answer": "x = [value]",
    "points": 20,
    "explanation": "Expand both brackets first, then collect like terms and solve",
    "teaching_explanation": "Like unpacking two parcels before you can compare what's inside - expand first, then sort!"
}""",
                "learning_objective": "Solve equations with brackets on both sides"
            },
            
            # MEDIUM 4: Equations with Fractions (Simple)
            {
                "id": "LE_M04",
                "subtopic": "Equations with Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about equations with simple fractions.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Some challenge.

QUESTION TYPE: Application

Requirements:
- Format: x/a + b = c OR (x + a)/b = c
- Single fraction only
- Denominators 2, 3, 4, or 5
- Answer should be an integer

Example question styles:
- "Solve: x/3 + 2 = 5"
- "Find x: (x + 4)/2 = 7"
- "Solve for x: x/5 - 3 = 2"

Return ONLY valid JSON:
{
    "question": "Solve: equation with one fraction",
    "solution": "Step 1: Identify the fraction\\nStep 2: Isolate the fraction term if needed\\nStep 3: Multiply both sides by the denominator\\nStep 4: Solve the resulting equation\\nStep 5: x = [answer]",
    "answer": "x = [value]",
    "points": 20,
    "explanation": "To clear a fraction, multiply both sides by the denominator",
    "teaching_explanation": "The denominator is like a dividing barrier. Multiply to break through it and free the x!"
}""",
                "learning_objective": "Solve equations containing single fractions"
            },
            
            # MEDIUM 5: Word Problems - Basic
            {
                "id": "LE_M05",
                "subtopic": "Word Problems - Forming Equations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics word problem requiring forming and solving an equation.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Real-world context.

QUESTION TYPE: Problem Solving

Requirements:
- Realistic Zimbabwean context (shopping, ages, distances)
- Single unknown
- Results in ax + b = c or similar two-step equation
- Use local currency (USD or ZWL) or familiar contexts
- Answer should make practical sense

Example question styles:
- "Tendai bought x books at $3 each and paid $2 for a bag. Total spent was $17. Find x."
- "A rectangle has length (x + 3) cm and width 4 cm. If perimeter is 30 cm, find x."

Return ONLY valid JSON:
{
    "question": "Word problem requiring forming an equation",
    "solution": "Step 1: Let x = [identify the unknown]\\nStep 2: Form the equation based on the problem: [equation]\\nStep 3: Solve the equation [show working]\\nStep 4: State the answer in context\\nStep 5: Check it makes sense",
    "answer": "x = [value] (with units/context)",
    "points": 20,
    "explanation": "Translate the words into mathematical expressions, form an equation, solve it",
    "teaching_explanation": "Word problems are like puzzles - find the unknown piece, build an equation, and solve to reveal the answer!"
}""",
                "learning_objective": "Translate word problems into linear equations and solve them"
            }
        ],
        
        "difficult": [
            # DIFFICULT 1: Complex Multi-step Equations
            {
                "id": "LE_D01",
                "subtopic": "Complex Multi-step Equations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question requiring multiple steps with various operations.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Complex Application

Requirements:
- Combine brackets, fractions, and variables on both sides
- At least 3-4 steps to solve
- Answer should be a rational number (can be fraction)
- Format: a(x + b) + cx = d(x - e) + f

Example question styles:
- "Solve: 2(3x - 1) - 5 = 4(x + 2) - 3"
- "Find x: 3(x + 4) + x = 2(2x + 7)"

Return ONLY valid JSON:
{
    "question": "Complex equation requiring multiple steps",
    "solution": "Step 1: Expand all brackets\\nStep 2: Simplify each side by collecting like terms\\nStep 3: Collect x terms on left, constants on right\\nStep 4: Solve for x\\nStep 5: Simplify answer\\nStep 6: Verify by substitution",
    "answer": "x = [value]",
    "points": 30,
    "explanation": "Break complex equations into manageable steps: expand, simplify, collect, solve",
    "teaching_explanation": "Complex equations are like layered puzzles - peel away each layer (expand, collect) until x stands alone!"
}""",
                "learning_objective": "Solve complex multi-step linear equations systematically"
            },
            
            # DIFFICULT 2: Equations with Multiple Fractions
            {
                "id": "LE_D02",
                "subtopic": "Multiple Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with multiple fractions.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Complex Application

Requirements:
- Two or more fractions with different denominators
- Format: x/a + x/b = c OR (x+a)/b = (x+c)/d
- Denominators should have a simple LCM (2,3,4,6)
- Answer should be an integer or simple fraction

Example question styles:
- "Solve: x/2 + x/3 = 5"
- "Find x: (x + 1)/2 = (x - 3)/4"
- "Solve for x: x/3 + x/4 = 7"

Return ONLY valid JSON:
{
    "question": "Equation with multiple fractions",
    "solution": "Step 1: Find the LCM of denominators\\nStep 2: Multiply every term by the LCM\\nStep 3: This clears all fractions\\nStep 4: Solve the resulting equation\\nStep 5: x = [answer]\\nStep 6: Check in original",
    "answer": "x = [value]",
    "points": 30,
    "explanation": "Multiply throughout by the LCM of all denominators to eliminate fractions",
    "teaching_explanation": "The LCM is like a master key that opens all the fraction locks at once!"
}""",
                "learning_objective": "Solve equations with multiple fractions using LCM"
            },
            
            # DIFFICULT 3: Word Problems - Advanced
            {
                "id": "LE_D03",
                "subtopic": "Word Problems - Complex",
                "prompt": """Generate a challenging ZIMSEC O-Level Mathematics word problem.

STUDENT LEVEL: Form 4 students preparing for exams. Exam-style.

QUESTION TYPE: Problem Solving

Requirements:
- Multi-step problem requiring careful equation formation
- Could involve ages, consecutive numbers, or proportions
- Requires checking answer makes sense in context
- Zimbabwean context where appropriate

Example question types:
- "Tapiwa is 4 years older than Tinashe. In 5 years, Tapiwa will be twice Tinashe's current age. Find their ages."
- "Three consecutive even numbers sum to 42. Find the numbers."
- "A father is 3 times as old as his son. In 12 years, he will be twice as old. Find their ages."

Return ONLY valid JSON:
{
    "question": "Complex word problem",
    "solution": "Step 1: Define variable(s): Let x = ...\\nStep 2: Express other quantities in terms of x\\nStep 3: Form equation from the relationship given\\nStep 4: Solve the equation\\nStep 5: Find all required values\\nStep 6: Check answer makes sense in context",
    "answer": "All required values with context",
    "points": 30,
    "explanation": "Identify the unknown, express relationships mathematically, form and solve the equation",
    "teaching_explanation": "Read carefully, underline key information, let x be the unknown, and translate relationships word by word!"
}""",
                "learning_objective": "Solve complex word problems by forming and solving linear equations"
            },
            
            # DIFFICULT 4: Literal Equations
            {
                "id": "LE_D04",
                "subtopic": "Literal Equations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving literal equations (making one variable the subject).

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Complex Application

Requirements:
- Given equation with multiple letters, solve for one
- Include cases with the target letter appearing once
- Common physics/maths formulae style
- Letters like a, b, c, x, y, p, q, r

Example question styles:
- "Make x the subject of ax + b = cx + d"
- "Solve for y: py + q = r"
- "Make a the subject of 2(a + b) = 3c"

Return ONLY valid JSON:
{
    "question": "Make [variable] the subject of [formula]",
    "solution": "Step 1: Collect terms with the subject on one side\\nStep 2: Collect other terms on the other side\\nStep 3: Factor out the subject if needed\\nStep 4: Divide to isolate the subject\\nStep 5: Write final answer",
    "answer": "[variable] = [expression in terms of other letters]",
    "points": 30,
    "explanation": "Treat other letters as if they were numbers, and solve for the required letter",
    "teaching_explanation": "Pretend all other letters are just numbers (like a=2, b=3). Solve the same way, keeping the letters!"
}""",
                "learning_objective": "Solve literal equations by making a specified variable the subject"
            },
            
            # DIFFICULT 5: Equations with Parameters
            {
                "id": "LE_D05",
                "subtopic": "Equations with Parameters",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question involving equations with parameters.

STUDENT LEVEL: Form 4 students preparing for exams. Challenging.

QUESTION TYPE: Complex Application

Requirements:
- Equation contains a parameter (like k or m) and variable x
- Solve for x in terms of the parameter OR find parameter given condition
- May involve checking for special cases (no solution, infinite solutions)

Example question styles:
- "Solve for x: 2x + k = 5x - 2k"
- "Find the value of k if 3(x - k) = 9 has solution x = 5"
- "For what value of m does mx - 4 = 2x + m have no solution?"

Return ONLY valid JSON:
{
    "question": "Equation involving a parameter",
    "solution": "Step 1: Identify what you're solving for\\nStep 2: Collect terms appropriately\\nStep 3: Isolate the required variable/parameter\\nStep 4: Consider any special cases\\nStep 5: State the answer clearly",
    "answer": "x = [expression] or k/m = [value]",
    "points": 30,
    "explanation": "Parameters are constants that are not specified numerically. Treat them like numbers while solving.",
    "teaching_explanation": "A parameter is like a mystery number that stays the same throughout. Find x in terms of it, or find what the parameter must be!"
}""",
                "learning_objective": "Solve equations involving parameters and understand special cases"
            }
        ]
    }
}

# ============================================================================
# TOPIC 3: FRACTIONS (15 Prompts)
# ============================================================================

FRACTIONS = {
    "topic": "Fractions",
    "description": "Operations with numerical and algebraic fractions",
    "learning_objectives": [
        "Add and subtract fractions with different denominators",
        "Multiply and divide fractions",
        "Convert between mixed numbers and improper fractions",
        "Simplify fractions to lowest terms",
        "Apply fractions in real-world calculations"
    ],
    "prompts": {
        "easy": [
            {
                "id": "FR_E01",
                "subtopic": "Simplifying Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about simplifying fractions to lowest terms.

STUDENT LEVEL: Form 3-4 students (ages 15-17). Basic skill.

Requirements:
- Fraction where numerator and denominator share a common factor
- Use numbers under 100
- Answer should be a proper fraction in lowest terms

Example: "Simplify 24/36 to its lowest terms"

Return ONLY valid JSON:
{
    "question": "Simplify [fraction] to its lowest terms",
    "solution": "Step 1: Find the HCF of numerator and denominator\\nStep 2: Divide both by HCF\\nStep 3: Write simplified fraction",
    "answer": "[simplified fraction]",
    "points": 10,
    "explanation": "To simplify, divide both parts by their highest common factor",
    "teaching_explanation": "Think of it as sharing equally - if you can divide both numbers by the same thing, do it!"
}""",
                "learning_objective": "Simplify fractions to lowest terms"
            },
            {
                "id": "FR_E02",
                "subtopic": "Converting Mixed Numbers",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about converting between mixed numbers and improper fractions.

STUDENT LEVEL: Form 3-4 students. Basic conversion skill.

Requirements:
- Convert mixed number to improper fraction OR improper fraction to mixed number
- Use small numbers (whole parts 1-5, denominators 2-8)

Example: "Convert 3 2/5 to an improper fraction" OR "Convert 17/4 to a mixed number"

Return ONLY valid JSON:
{
    "question": "Convert [mixed/improper] to [improper/mixed]",
    "solution": "For mixed to improper: multiply whole by denominator, add numerator\\nOR for improper to mixed: divide, quotient is whole part, remainder is numerator",
    "answer": "[converted form]",
    "points": 10,
    "explanation": "Mixed numbers and improper fractions are just different ways of writing the same value",
    "teaching_explanation": "Think of pizzas: 3 2/5 means 3 whole pizzas and 2 slices out of 5. Convert to count all slices!"
}""",
                "learning_objective": "Convert between mixed numbers and improper fractions"
            },
            {
                "id": "FR_E03",
                "subtopic": "Adding Fractions - Same Denominator",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about adding fractions with the same denominator.

STUDENT LEVEL: Form 3-4 students. Basic fraction addition.

Requirements:
- Two fractions with the SAME denominator
- Denominator between 3-10
- May need simplifying at the end

Example: "Calculate 3/8 + 2/8"

Return ONLY valid JSON:
{
    "question": "Calculate [fraction] + [fraction] (same denominator)",
    "solution": "Step 1: Keep the denominator the same\\nStep 2: Add the numerators\\nStep 3: Simplify if possible",
    "answer": "[result fraction]",
    "points": 10,
    "explanation": "When denominators are the same, just add the numerators",
    "teaching_explanation": "If both fractions are the same 'type' (same denominator), just count how many pieces total!"
}""",
                "learning_objective": "Add fractions with common denominators"
            },
            {
                "id": "FR_E04",
                "subtopic": "Multiplying Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about multiplying fractions.

STUDENT LEVEL: Form 3-4 students. Direct application.

Requirements:
- Two proper fractions to multiply
- Small numerators and denominators (1-9)
- Result should simplify to a nice fraction

Example: "Calculate 2/3 × 4/5"

Return ONLY valid JSON:
{
    "question": "Calculate [fraction] × [fraction]",
    "solution": "Step 1: Multiply numerators together\\nStep 2: Multiply denominators together\\nStep 3: Simplify if possible",
    "answer": "[result fraction]",
    "points": 10,
    "explanation": "To multiply fractions, multiply tops together and bottoms together",
    "teaching_explanation": "Multiplying fractions is like finding a part of a part - half of a quarter is one eighth!"
}""",
                "learning_objective": "Multiply fractions correctly"
            },
            {
                "id": "FR_E05",
                "subtopic": "Fraction of a Quantity",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about finding a fraction of a quantity.

STUDENT LEVEL: Form 3-4 students. Practical application.

Requirements:
- Find a simple fraction of a whole number
- Use fractions like 1/2, 1/3, 2/3, 1/4, 3/4, 1/5
- Quantity should divide evenly

Example: "Find 3/4 of 48"

Return ONLY valid JSON:
{
    "question": "Find [fraction] of [quantity]",
    "solution": "Step 1: Divide the quantity by the denominator\\nStep 2: Multiply by the numerator\\nStep 3: State the answer",
    "answer": "[numerical result]",
    "points": 10,
    "explanation": "To find a fraction of something, divide by the bottom, multiply by the top",
    "teaching_explanation": "Finding 3/4 means sharing into 4 equal parts and taking 3 of them!"
}""",
                "learning_objective": "Calculate a fraction of a given quantity"
            }
        ],
        "medium": [
            {
                "id": "FR_M01",
                "subtopic": "Adding Fractions - Different Denominators",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about adding fractions with different denominators.

STUDENT LEVEL: Form 3-4 students. Requires finding common denominator.

Requirements:
- Two fractions with DIFFERENT denominators
- Denominators should have simple LCM (6, 12, 15, 20)
- May result in mixed number

Example: "Calculate 2/3 + 3/4"

Return ONLY valid JSON:
{
    "question": "Calculate [fraction] + [fraction] (different denominators)",
    "solution": "Step 1: Find the LCM of denominators\\nStep 2: Convert each fraction to equivalent with LCM denominator\\nStep 3: Add the numerators\\nStep 4: Simplify or convert to mixed number",
    "answer": "[result]",
    "points": 20,
    "explanation": "Find a common denominator first, then add",
    "teaching_explanation": "You can only add fractions when they're the 'same type' - find a common denominator first!"
}""",
                "learning_objective": "Add fractions with different denominators using LCM"
            },
            {
                "id": "FR_M02",
                "subtopic": "Subtracting Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about subtracting fractions.

STUDENT LEVEL: Form 3-4 students. Finding common denominator then subtracting.

Requirements:
- Two fractions with different denominators
- First fraction larger than second (positive result)
- May involve mixed numbers

Example: "Calculate 5/6 - 1/4"

Return ONLY valid JSON:
{
    "question": "Calculate [fraction] - [fraction]",
    "solution": "Step 1: Find LCM of denominators\\nStep 2: Convert both fractions\\nStep 3: Subtract numerators\\nStep 4: Simplify if needed",
    "answer": "[result fraction]",
    "points": 20,
    "explanation": "Same process as addition - common denominator first, then subtract",
    "teaching_explanation": "Get both fractions speaking the same 'language' (same denominator) before subtracting!"
}""",
                "learning_objective": "Subtract fractions with different denominators"
            },
            {
                "id": "FR_M03",
                "subtopic": "Dividing Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about dividing fractions.

STUDENT LEVEL: Form 3-4 students. Using reciprocals.

Requirements:
- Divide one fraction by another
- Use proper fractions or mixed numbers
- Answer should simplify nicely

Example: "Calculate 3/4 ÷ 2/5"

Return ONLY valid JSON:
{
    "question": "Calculate [fraction] ÷ [fraction]",
    "solution": "Step 1: Keep the first fraction\\nStep 2: Change ÷ to ×\\nStep 3: Flip the second fraction (reciprocal)\\nStep 4: Multiply and simplify",
    "answer": "[result]",
    "points": 20,
    "explanation": "To divide by a fraction, multiply by its reciprocal (flip it)",
    "teaching_explanation": "Dividing by 1/2 is like asking 'how many halves fit in this?' - that's why we flip and multiply!"
}""",
                "learning_objective": "Divide fractions using reciprocals"
            },
            {
                "id": "FR_M04",
                "subtopic": "Mixed Operations with Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question involving multiple operations with fractions.

STUDENT LEVEL: Form 3-4 students. Applying BODMAS.

Requirements:
- Expression with 2-3 fractions and different operations
- Must use correct order of operations
- Keep numbers manageable

Example: "Calculate 1/2 + 2/3 × 3/4"

Return ONLY valid JSON:
{
    "question": "Calculate [mixed fraction expression]",
    "solution": "Step 1: Identify order of operations (BODMAS)\\nStep 2: Perform multiplication/division first\\nStep 3: Then perform addition/subtraction\\nStep 4: Simplify final answer",
    "answer": "[result]",
    "points": 20,
    "explanation": "Follow BODMAS - multiplication before addition even with fractions",
    "teaching_explanation": "BODMAS rules apply to fractions too - multiply and divide before you add and subtract!"
}""",
                "learning_objective": "Apply order of operations to fraction calculations"
            },
            {
                "id": "FR_M05",
                "subtopic": "Fraction Word Problems",
                "prompt": """Generate a ZIMSEC O-Level Mathematics word problem involving fractions.

STUDENT LEVEL: Form 3-4 students. Real-world application.

Requirements:
- Practical context (cooking, sharing, measuring)
- Requires fraction operation to solve
- Zimbabwean context where appropriate

Example: "Rudo has 3/4 kg of sugar. She uses 2/3 of it to bake a cake. How much sugar did she use?"

Return ONLY valid JSON:
{
    "question": "Real-world fraction problem",
    "solution": "Step 1: Identify what operation is needed\\nStep 2: Set up the calculation\\nStep 3: Perform the operation\\nStep 4: Give answer with units",
    "answer": "[answer with units]",
    "points": 20,
    "explanation": "Translate the word problem into a fraction operation",
    "teaching_explanation": "Look for key words: 'of' usually means multiply, 'shared equally' means divide!"
}""",
                "learning_objective": "Apply fraction operations to solve word problems"
            }
        ],
        "difficult": [
            {
                "id": "FR_D01",
                "subtopic": "Complex Mixed Number Operations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with complex mixed number calculations.

STUDENT LEVEL: Form 4 exam preparation. Challenging.

Requirements:
- Operations involving mixed numbers (addition, subtraction, multiplication, or division)
- May require converting to improper fractions
- Multiple steps

Example: "Calculate 2 1/3 × 1 3/4 - 5/6"

Return ONLY valid JSON:
{
    "question": "Complex mixed number calculation",
    "solution": "Step 1: Convert mixed numbers to improper fractions\\nStep 2: Apply BODMAS for order of operations\\nStep 3: Perform each operation\\nStep 4: Convert back and simplify",
    "answer": "[result as mixed number or fraction]",
    "points": 30,
    "explanation": "Convert mixed numbers to improper fractions for easier calculation",
    "teaching_explanation": "Mixed numbers are easier to work with as improper fractions - convert first, calculate, then convert back!"
}""",
                "learning_objective": "Perform complex calculations with mixed numbers"
            },
            {
                "id": "FR_D02",
                "subtopic": "Fractions with Brackets",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question involving fractions with brackets.

STUDENT LEVEL: Form 4 exam preparation. Multi-step.

Requirements:
- Expression with brackets containing fractions
- Requires correct order of operations
- May have nested operations

Example: "Calculate (1/2 + 1/3) × (2/3 - 1/4)"

Return ONLY valid JSON:
{
    "question": "Fraction expression with brackets",
    "solution": "Step 1: Work out the first bracket\\nStep 2: Work out the second bracket\\nStep 3: Perform the operation between results\\nStep 4: Simplify fully",
    "answer": "[result]",
    "points": 30,
    "explanation": "Brackets first, then multiply/divide, then add/subtract",
    "teaching_explanation": "Brackets are like 'do me first!' instructions - solve inside each bracket before combining!"
}""",
                "learning_objective": "Evaluate complex fraction expressions with brackets"
            },
            {
                "id": "FR_D03",
                "subtopic": "Problem Solving with Fractions",
                "prompt": """Generate a challenging ZIMSEC O-Level problem requiring fraction skills.

STUDENT LEVEL: Form 4 exam preparation. Exam-style.

Requirements:
- Multi-step word problem
- Requires multiple fraction operations
- Practical or algebraic context

Example: "A tank is 2/3 full. After adding 15 litres, it becomes 5/6 full. Find the capacity of the tank."

Return ONLY valid JSON:
{
    "question": "Multi-step fraction word problem",
    "solution": "Step 1: Set up relationship using fractions\\nStep 2: Form equation\\nStep 3: Solve for unknown\\nStep 4: Verify answer makes sense",
    "answer": "[answer with context]",
    "points": 30,
    "explanation": "Translate relationships into fraction equations, then solve",
    "teaching_explanation": "Draw a diagram if it helps! Picture the fractions as parts of something to see the relationship."
}""",
                "learning_objective": "Solve complex problems using fraction relationships"
            },
            {
                "id": "FR_D04",
                "subtopic": "Recurring Decimals to Fractions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about converting recurring decimals to fractions.

STUDENT LEVEL: Form 4 exam preparation. Algebraic method.

Requirements:
- Simple recurring decimal (one or two recurring digits)
- Show algebraic method for conversion
- Answer should be a simplified fraction

Example: "Convert 0.333... to a fraction" or "Express 0.272727... as a fraction"

Return ONLY valid JSON:
{
    "question": "Convert [recurring decimal] to a fraction",
    "solution": "Step 1: Let x = the recurring decimal\\nStep 2: Multiply by 10 or 100 to shift decimal\\nStep 3: Subtract original to eliminate recurring part\\nStep 4: Solve for x and simplify",
    "answer": "[fraction in lowest terms]",
    "points": 30,
    "explanation": "Use algebra: let x = decimal, manipulate to remove the recurring part",
    "teaching_explanation": "The trick is to multiply by a power of 10 so when you subtract, the recurring bits cancel out!"
}""",
                "learning_objective": "Convert recurring decimals to fractions using algebra"
            },
            {
                "id": "FR_D05",
                "subtopic": "Fractions in Equations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics equation involving fractions to solve.

STUDENT LEVEL: Form 4 exam preparation. Equation solving.

Requirements:
- Equation with the unknown in a fraction
- May have x in numerator, denominator, or both
- Clear steps to solve

Example: "(x + 2)/3 = (2x - 1)/5"

Return ONLY valid JSON:
{
    "question": "Solve the equation: [fraction equation with x]",
    "solution": "Step 1: Cross multiply (if applicable) or find common denominator\\nStep 2: Expand and simplify\\nStep 3: Collect like terms\\nStep 4: Solve for x\\nStep 5: Check answer",
    "answer": "x = [value]",
    "points": 30,
    "explanation": "Clear fractions by multiplying by LCM or cross-multiplying, then solve normally",
    "teaching_explanation": "Fractions in equations look scary but cross-multiplying removes them quickly!"
}""",
                "learning_objective": "Solve equations containing fractions"
            }
        ]
    }
}

# ============================================================================
# TOPIC 4: INDICES AND POWERS (15 Prompts)
# ============================================================================

INDICES_AND_POWERS = {
    "topic": "Indices and Powers",
    "description": "Laws of indices and operations with powers",
    "learning_objectives": [
        "Apply the multiplication law: a^m × a^n = a^(m+n)",
        "Apply the division law: a^m ÷ a^n = a^(m-n)",
        "Apply the power law: (a^m)^n = a^(mn)",
        "Understand zero and negative indices",
        "Evaluate fractional indices"
    ],
    "prompts": {
        "easy": [
            {
                "id": "IP_E01",
                "subtopic": "Multiplication Law of Indices",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about the multiplication law of indices.

STUDENT LEVEL: Form 3-4 students. Basic law application.

Requirements:
- Format: a^m × a^n (same base)
- Use single letter variables or small numbers as base
- Positive integer indices only

Example: "Simplify: x³ × x⁴" or "Simplify: 2³ × 2⁵"

Return ONLY valid JSON:
{
    "question": "Simplify: [base]^m × [same base]^n",
    "solution": "Step 1: Identify that bases are the same\\nStep 2: Apply the rule a^m × a^n = a^(m+n)\\nStep 3: Add the indices\\nStep 4: Write final answer",
    "answer": "[base]^(m+n)",
    "points": 10,
    "explanation": "When multiplying powers with the same base, add the indices",
    "teaching_explanation": "x³ × x⁴ means (x × x × x) × (x × x × x × x) = x⁷ - just count all the x's!"
}""",
                "learning_objective": "Apply multiplication law of indices"
            },
            {
                "id": "IP_E02",
                "subtopic": "Division Law of Indices",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about the division law of indices.

STUDENT LEVEL: Form 3-4 students. Basic law application.

Requirements:
- Format: a^m ÷ a^n where m > n (positive result)
- Same base in both terms
- Positive integer indices

Example: "Simplify: y⁷ ÷ y³" or "Simplify: 5⁶ ÷ 5²"

Return ONLY valid JSON:
{
    "question": "Simplify: [base]^m ÷ [same base]^n",
    "solution": "Step 1: Identify same base\\nStep 2: Apply rule a^m ÷ a^n = a^(m-n)\\nStep 3: Subtract the indices\\nStep 4: Write answer",
    "answer": "[base]^(m-n)",
    "points": 10,
    "explanation": "When dividing powers with the same base, subtract the indices",
    "teaching_explanation": "Think of it as cancelling: y⁷ ÷ y³ - three y's cancel, leaving four y's = y⁴"
}""",
                "learning_objective": "Apply division law of indices"
            },
            {
                "id": "IP_E03",
                "subtopic": "Power of a Power",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about the power of a power law.

STUDENT LEVEL: Form 3-4 students. Basic law application.

Requirements:
- Format: (a^m)^n
- Small indices (2, 3, or 4)
- Single variable or small number base

Example: "Simplify: (x³)⁴" or "Simplify: (2²)³"

Return ONLY valid JSON:
{
    "question": "Simplify: ([base]^m)^n",
    "solution": "Step 1: Apply rule (a^m)^n = a^(m×n)\\nStep 2: Multiply the indices\\nStep 3: Write final answer",
    "answer": "[base]^(m×n)",
    "points": 10,
    "explanation": "When raising a power to a power, multiply the indices",
    "teaching_explanation": "(x³)⁴ means x³ × x³ × x³ × x³ = x¹² - you're adding 3, four times, so 3 × 4 = 12!"
}""",
                "learning_objective": "Apply the power of a power rule"
            },
            {
                "id": "IP_E04",
                "subtopic": "Zero Index",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about the zero index.

STUDENT LEVEL: Form 3-4 students. Understanding the concept.

Requirements:
- Expression that simplifies to a⁰
- Show why a⁰ = 1
- Use numbers or variables

Example: "Evaluate 5⁰" or "Simplify x³ ÷ x³"

Return ONLY valid JSON:
{
    "question": "Evaluate or simplify expression resulting in zero power",
    "solution": "Step 1: Apply index rules if simplifying\\nStep 2: Recognise a⁰ form\\nStep 3: Apply rule: any non-zero number to power 0 equals 1\\nStep 4: Answer = 1",
    "answer": "1",
    "points": 10,
    "explanation": "Any non-zero number raised to the power 0 equals 1",
    "teaching_explanation": "Think of it this way: x³ ÷ x³ = 1 (anything divided by itself). But also x³⁻³ = x⁰. So x⁰ must equal 1!"
}""",
                "learning_objective": "Understand and apply the zero index rule"
            },
            {
                "id": "IP_E05",
                "subtopic": "Evaluating Simple Powers",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about evaluating numerical powers.

STUDENT LEVEL: Form 3-4 students. Direct calculation.

Requirements:
- Evaluate a numerical power
- Base 2-5, index 2-4
- Should give a manageable answer

Example: "Evaluate 3⁴" or "Calculate 2⁵"

Return ONLY valid JSON:
{
    "question": "Evaluate [number]^[power]",
    "solution": "Step 1: Write as repeated multiplication\\nStep 2: Calculate step by step\\nStep 3: [base] × [base] × ... = [answer]",
    "answer": "[numerical result]",
    "points": 10,
    "explanation": "An index tells us how many times to multiply the base by itself",
    "teaching_explanation": "3⁴ means 3 × 3 × 3 × 3. Work through: 3 × 3 = 9, 9 × 3 = 27, 27 × 3 = 81"
}""",
                "learning_objective": "Evaluate numerical expressions with indices"
            }
        ],
        "medium": [
            {
                "id": "IP_M01",
                "subtopic": "Negative Indices",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about negative indices.

STUDENT LEVEL: Form 3-4 students. Understanding reciprocals.

Requirements:
- Expression with negative index
- Convert to positive index (reciprocal)
- May need to evaluate

Example: "Express 3⁻² as a fraction" or "Simplify x⁻³"

Return ONLY valid JSON:
{
    "question": "Express/Simplify [expression with negative index]",
    "solution": "Step 1: Apply rule a⁻ⁿ = 1/aⁿ\\nStep 2: Write as fraction\\nStep 3: Evaluate if numerical",
    "answer": "[fraction or expression with positive index]",
    "points": 20,
    "explanation": "A negative index means 'one over' - take the reciprocal",
    "teaching_explanation": "x⁻² means 1/x². The negative is like saying 'flip it' - put it under 1!"
}""",
                "learning_objective": "Convert negative indices to positive using reciprocals"
            },
            {
                "id": "IP_M02",
                "subtopic": "Combined Laws of Indices",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question combining multiple index laws.

STUDENT LEVEL: Form 3-4 students. Applying multiple rules.

Requirements:
- Expression requiring 2-3 different index laws
- May include multiplication, division, and powers
- Same or different bases

Example: "Simplify: (x³ × x²)/x⁴" or "Simplify: (2³)² × 2⁴"

Return ONLY valid JSON:
{
    "question": "Simplify: [expression with multiple index operations]",
    "solution": "Step 1: Apply laws in correct order\\nStep 2: Simplify numerator/powers first\\nStep 3: Then divide or combine\\nStep 4: Write simplest form",
    "answer": "[simplified expression]",
    "points": 20,
    "explanation": "Apply index laws systematically: powers first, then multiply/divide",
    "teaching_explanation": "Work step by step - simplify brackets first, then multiply, then divide. Don't try to do it all at once!"
}""",
                "learning_objective": "Apply multiple index laws to simplify expressions"
            },
            {
                "id": "IP_M03",
                "subtopic": "Power of a Product",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about the power of a product.

STUDENT LEVEL: Form 3-4 students. Distributing powers.

Requirements:
- Format: (ab)^n or (a/b)^n
- Apply power to each factor
- May include coefficients

Example: "Simplify: (2x)³" or "Simplify: (3y²)²"

Return ONLY valid JSON:
{
    "question": "Simplify: [product or quotient raised to a power]",
    "solution": "Step 1: Apply power to each factor inside bracket\\nStep 2: (ab)^n = a^n × b^n\\nStep 3: For (a^m)^n, multiply indices\\nStep 4: Simplify coefficients",
    "answer": "[simplified expression]",
    "points": 20,
    "explanation": "When raising a product to a power, raise each factor to that power",
    "teaching_explanation": "(2x)³ = 2³ × x³ - the power distributes to everything inside the bracket!"
}""",
                "learning_objective": "Apply powers to products and quotients"
            },
            {
                "id": "IP_M04",
                "subtopic": "Fractional Indices - Basic",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about basic fractional indices.

STUDENT LEVEL: Form 3-4 students. Understanding roots.

Requirements:
- Format: a^(1/n) or a^(1/2), a^(1/3)
- Connect to roots (square root, cube root)
- Use perfect squares/cubes for nice answers

Example: "Evaluate 64^(1/2)" or "Simplify 27^(1/3)"

Return ONLY valid JSON:
{
    "question": "Evaluate/Simplify [number or variable]^(1/n)",
    "solution": "Step 1: a^(1/n) means the nth root of a\\nStep 2: a^(1/2) = √a, a^(1/3) = ³√a\\nStep 3: Find the root\\nStep 4: State answer",
    "answer": "[root value]",
    "points": 20,
    "explanation": "A fractional index of 1/n means the nth root",
    "teaching_explanation": "The bottom of the fraction tells you which root: 1/2 = square root, 1/3 = cube root!"
}""",
                "learning_objective": "Evaluate expressions with simple fractional indices"
            },
            {
                "id": "IP_M05",
                "subtopic": "Solving Index Equations",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about solving simple index equations.

STUDENT LEVEL: Form 3-4 students. Equation solving with indices.

Requirements:
- Equation where unknown is in the index
- Express both sides with same base
- Compare indices to solve

Example: "Solve: 2^x = 16" or "Find x if 3^x = 81"

Return ONLY valid JSON:
{
    "question": "Solve: [base]^x = [number]",
    "solution": "Step 1: Express RHS as a power of the same base\\nStep 2: [number] = [base]^[power]\\nStep 3: Since bases are equal, indices must be equal\\nStep 4: x = [power]",
    "answer": "x = [value]",
    "points": 20,
    "explanation": "Express both sides with the same base, then equate the indices",
    "teaching_explanation": "If 2^x = 16 and 16 = 2⁴, then 2^x = 2⁴, so x must be 4!"
}""",
                "learning_objective": "Solve equations with the unknown in the index"
            }
        ],
        "difficult": [
            {
                "id": "IP_D01",
                "subtopic": "Fractional Indices - Complex",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question about complex fractional indices.

STUDENT LEVEL: Form 4 exam preparation. Challenging.

Requirements:
- Format: a^(m/n) where m ≠ 1
- Understand m/n means nth root raised to power m
- May include negative fractional indices

Example: "Evaluate 8^(2/3)" or "Simplify 27^(-2/3)"

Return ONLY valid JSON:
{
    "question": "Evaluate/Simplify [expression]^(m/n)",
    "solution": "Step 1: a^(m/n) = (ⁿ√a)^m or ⁿ√(a^m)\\nStep 2: Find the nth root first\\nStep 3: Raise to power m\\nStep 4: Apply negative if needed",
    "answer": "[numerical or simplified result]",
    "points": 30,
    "explanation": "For m/n index: root first (denominator), then power (numerator)",
    "teaching_explanation": "8^(2/3): cube root of 8 is 2, then square it to get 4. Denominator = root, numerator = power!"
}""",
                "learning_objective": "Evaluate complex fractional indices including negatives"
            },
            {
                "id": "IP_D02",
                "subtopic": "Complex Index Expressions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question with complex index simplification.

STUDENT LEVEL: Form 4 exam preparation. Multi-step.

Requirements:
- Multiple variables and operations
- May include brackets, fractions, negatives
- Requires systematic application of laws

Example: "Simplify: (x³y⁻²)⁴ × x⁻² ÷ y³"

Return ONLY valid JSON:
{
    "question": "Simplify: [complex index expression]",
    "solution": "Step 1: Deal with brackets first\\nStep 2: Apply power of a power\\nStep 3: Combine like bases using multiplication/division laws\\nStep 4: Express with positive indices if required",
    "answer": "[simplified expression]",
    "points": 30,
    "explanation": "Work systematically: brackets, then powers, then combine like bases",
    "teaching_explanation": "Like peeling an onion - handle one layer at a time. Brackets first, then powers, then multiply/divide!"
}""",
                "learning_objective": "Simplify complex expressions using all index laws"
            },
            {
                "id": "IP_D03",
                "subtopic": "Index Equations - Advanced",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question solving advanced index equations.

STUDENT LEVEL: Form 4 exam preparation. Complex equations.

Requirements:
- Unknown in multiple positions
- May need to use substitution
- Or compare indices after manipulation

Example: "Solve: 2^(x+1) = 8^(x-1)" or "Find x if 9^x = 3^(2x+4)"

Return ONLY valid JSON:
{
    "question": "Solve: [complex index equation]",
    "solution": "Step 1: Express all terms with the same base\\nStep 2: Use index laws to simplify\\nStep 3: Equate indices\\nStep 4: Solve the resulting linear equation\\nStep 5: Check answer",
    "answer": "x = [value]",
    "points": 30,
    "explanation": "Convert to same base, use laws to simplify, then equate indices",
    "teaching_explanation": "The key is getting the same base on each side - then the indices must be equal!"
}""",
                "learning_objective": "Solve complex equations involving indices"
            },
            {
                "id": "IP_D04",
                "subtopic": "Indices in Algebraic Expressions",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question simplifying algebraic expressions with indices.

STUDENT LEVEL: Form 4 exam preparation. Algebra with indices.

Requirements:
- Expression with algebraic terms and indices
- May include addition/subtraction after simplification
- Requires factorisation or expansion

Example: "Simplify: (x^(1/2))² + x" or "Factorise: x² - x^(1/2)"

Return ONLY valid JSON:
{
    "question": "Simplify or factorise: [algebraic index expression]",
    "solution": "Step 1: Apply index laws to simplify powers\\nStep 2: Combine or factorise like terms\\nStep 3: Express in simplest form",
    "answer": "[simplified/factorised expression]",
    "points": 30,
    "explanation": "Combine index laws with algebraic manipulation",
    "teaching_explanation": "Treat fractional indices like any other indices - the laws still apply. Then do normal algebra!"
}""",
                "learning_objective": "Combine index laws with algebraic manipulation"
            },
            {
                "id": "IP_D05",
                "subtopic": "Scientific Notation and Indices",
                "prompt": """Generate a ZIMSEC O-Level Mathematics question combining standard form with indices.

STUDENT LEVEL: Form 4 exam preparation. Practical application.

Requirements:
- Calculations involving standard form
- Apply index laws to powers of 10
- Give answer in standard form

Example: "Calculate (3 × 10⁴) × (2.5 × 10⁻²)" or "Simplify (6 × 10⁵) ÷ (3 × 10²)"

Return ONLY valid JSON:
{
    "question": "Calculate/Simplify [standard form expression]",
    "solution": "Step 1: Multiply/divide the number parts\\nStep 2: Apply index laws to powers of 10\\nStep 3: Combine results\\nStep 4: Adjust to standard form if needed (1 ≤ a < 10)",
    "answer": "[answer in standard form]",
    "points": 30,
    "explanation": "Handle numbers and powers of 10 separately, then combine",
    "teaching_explanation": "Scientific notation follows index laws - add powers when multiplying, subtract when dividing!"
}""",
                "learning_objective": "Apply index laws to calculations in standard form"
            }
        ]
    }
}

# ============================================================================
# TOPIC 5: QUADRATIC EXPRESSIONS (15 Prompts)
# ============================================================================

QUADRATIC_EXPRESSIONS = {
    "topic": "Quadratic Expressions",
    "description": "Factorizing and solving quadratic expressions and equations",
    "learning_objectives": [
        "Factorize expressions with common factors: ax² + bx",
        "Factorize trinomials: x² + bx + c",
        "Factorize difference of squares: a² - b²",
        "Solve quadratic equations by factorization",
        "Apply the quadratic formula: x = (-b ± √(b²-4ac))/2a"
    ],
    "prompts": {
        "easy": [
            {"id": "QE_E01", "subtopic": "Common Factor Extraction",
             "prompt": """Generate a ZIMSEC O-Level question about factorizing by extracting common factors.

Requirements: Format ax² + bx, extract common factor x. Use coefficients 2-6.

Example: "Factorize: 3x² + 6x"

Return ONLY valid JSON:
{
    "question": "Factorize: [expression]",
    "solution": "Step 1: Identify HCF of terms\\nStep 2: Factor out HCF\\nStep 3: Write in factored form",
    "answer": "[factored form]",
    "points": 10,
    "explanation": "Find what's common to all terms and take it outside a bracket",
    "teaching_explanation": "Look for what ALL terms share - that's what goes outside!"
}""", "learning_objective": "Extract common factors from expressions"},
            
            {"id": "QE_E02", "subtopic": "Simple Trinomial Factorization",
             "prompt": """Generate a ZIMSEC O-Level question about factorizing simple trinomials.

Requirements: Format x² + bx + c where b,c are positive and small. Product of factors should be obvious.

Example: "Factorize: x² + 5x + 6"

Return ONLY valid JSON:
{
    "question": "Factorize: x² + bx + c",
    "solution": "Step 1: Find two numbers that multiply to c and add to b\\nStep 2: Write as (x + m)(x + n)\\nStep 3: Check by expanding",
    "answer": "(x + m)(x + n)",
    "points": 10,
    "explanation": "Find two numbers that multiply to the constant and add to the x coefficient",
    "teaching_explanation": "Think: what two numbers multiply to give __  AND add to give __?"
}""", "learning_objective": "Factorize simple quadratic trinomials"},
            
            {"id": "QE_E03", "subtopic": "Difference of Two Squares",
             "prompt": """Generate a ZIMSEC O-Level question about difference of two squares.

Requirements: Format a² - b² using perfect squares. Answer is (a+b)(a-b).

Example: "Factorize: x² - 16" or "Factorize: 25 - y²"

Return ONLY valid JSON:
{
    "question": "Factorize: [difference of squares]",
    "solution": "Step 1: Recognize as a² - b²\\nStep 2: Identify a and b (square roots)\\nStep 3: Write as (a+b)(a-b)",
    "answer": "(a+b)(a-b)",
    "points": 10,
    "explanation": "a² - b² always factorizes to (a+b)(a-b)",
    "teaching_explanation": "When you see SUBTRACTION of two PERFECT SQUARES, split them into sum and difference!"
}""", "learning_objective": "Recognize and factorize difference of two squares"},
            
            {"id": "QE_E04", "subtopic": "Solving by Null Factor Law",
             "prompt": """Generate a ZIMSEC O-Level question about solving simple factored quadratics.

Requirements: Equation already factored: (x + a)(x + b) = 0. Find both solutions.

Example: "Solve: (x + 3)(x - 2) = 0"

Return ONLY valid JSON:
{
    "question": "Solve: (x + a)(x + b) = 0",
    "solution": "Step 1: If product = 0, at least one factor = 0\\nStep 2: x + a = 0 gives x = -a\\nStep 3: x + b = 0 gives x = -b",
    "answer": "x = -a or x = -b",
    "points": 10,
    "explanation": "If two things multiply to zero, one of them must be zero",
    "teaching_explanation": "Zero is special - if A × B = 0, either A = 0 or B = 0 (or both)!"
}""", "learning_objective": "Solve factored quadratics using null factor law"},
            
            {"id": "QE_E05", "subtopic": "Expanding Double Brackets",
             "prompt": """Generate a ZIMSEC O-Level question about expanding to get quadratics.

Requirements: Expand (x + a)(x + b) to get trinomial. Use small positive integers.

Example: "Expand: (x + 2)(x + 5)"

Return ONLY valid JSON:
{
    "question": "Expand and simplify: (x + a)(x + b)",
    "solution": "Step 1: FOIL - First: x × x\\nStep 2: Outer: x × b\\nStep 3: Inner: a × x\\nStep 4: Last: a × b\\nStep 5: Collect like terms",
    "answer": "x² + (a+b)x + ab",
    "points": 10,
    "explanation": "Use FOIL to multiply each term by every term in the other bracket",
    "teaching_explanation": "Every term in the first bracket meets every term in the second - like shaking hands!"
}""", "learning_objective": "Expand double brackets to form quadratic expressions"}
        ],
        "medium": [
            {"id": "QE_M01", "subtopic": "Trinomials with Negative Terms",
             "prompt": """Generate a ZIMSEC question factorizing trinomials with negative constants.

Requirements: x² + bx + c where c is negative. Need factors with different signs.

Example: "Factorize: x² + 2x - 15"

Return ONLY valid JSON:
{
    "question": "Factorize: x² + bx + c (c negative)",
    "solution": "Step 1: Find factors of c that differ to give b\\nStep 2: One positive, one negative\\nStep 3: Write as (x + m)(x - n)",
    "answer": "Factored form",
    "points": 20,
    "explanation": "When constant is negative, one bracket has + and other has -",
    "teaching_explanation": "If the numbers multiply to a NEGATIVE, they have opposite signs!"
}""", "learning_objective": "Factorize trinomials with negative constants"},
            
            {"id": "QE_M02", "subtopic": "Solving by Factoring",
             "prompt": """Generate a ZIMSEC question solving quadratics by factoring.

Requirements: x² + bx + c = 0. Factor then solve. Nice integer solutions.

Example: "Solve: x² - 5x + 6 = 0"

Return ONLY valid JSON:
{
    "question": "Solve: x² + bx + c = 0",
    "solution": "Step 1: Factorize the quadratic\\nStep 2: Set each factor equal to zero\\nStep 3: Solve for x in each case",
    "answer": "x = value1 or x = value2",
    "points": 20,
    "explanation": "First factorize, then apply the null factor law",
    "teaching_explanation": "Factorizing is the key that unlocks the solutions!"
}""", "learning_objective": "Solve quadratic equations by factorization"},
            
            {"id": "QE_M03", "subtopic": "Quadratics with Leading Coefficient",
             "prompt": """Generate a ZIMSEC question factorizing ax² + bx + c where a ≠ 1.

Requirements: Coefficient of x² is 2 or 3. Should factorize nicely.

Example: "Factorize: 2x² + 7x + 3"

Return ONLY valid JSON:
{
    "question": "Factorize: ax² + bx + c",
    "solution": "Step 1: Multiply a × c\\nStep 2: Find factors of (ac) that add to b\\nStep 3: Split middle term\\nStep 4: Factor by grouping",
    "answer": "Fully factored form",
    "points": 20,
    "explanation": "When a ≠ 1, use the grouping method or trial",
    "teaching_explanation": "Multiply end numbers, find factors adding to middle, then split and group!"
}""", "learning_objective": "Factorize quadratics where the leading coefficient is not 1"},
            
            {"id": "QE_M04", "subtopic": "Completing the Square - Simple",
             "prompt": """Generate a ZIMSEC question about completing the square.

Requirements: x² + bx + c form. Express as (x + p)² + q. Use even coefficient of x.

Example: "Write x² + 6x + 5 in the form (x + a)² + b"

Return ONLY valid JSON:
{
    "question": "Express x² + bx + c in the form (x + p)² + q",
    "solution": "Step 1: Halve coefficient of x: p = b/2\\nStep 2: Square it: p²\\nStep 3: Write (x + p)² - p² + c\\nStep 4: Simplify constant part",
    "answer": "(x + p)² + q",
    "points": 20,
    "explanation": "Complete the square by halving the x coefficient and adjusting the constant",
    "teaching_explanation": "Take half of the x number, square it, add it and take it away to make a perfect square!"
}""", "learning_objective": "Express quadratics in completed square form"},
            
            {"id": "QE_M05", "subtopic": "Quadratic Word Problems",
             "prompt": """Generate a ZIMSEC word problem leading to a quadratic.

Requirements: Area, consecutive numbers, or product relationships. Form and solve.

Example: "A rectangle's length is 3 more than its width. Area is 40 cm². Find dimensions."

Return ONLY valid JSON:
{
    "question": "Word problem requiring quadratic equation",
    "solution": "Step 1: Define variable\\nStep 2: Form quadratic equation\\nStep 3: Solve by factoring or formula\\nStep 4: Check answer makes sense in context",
    "answer": "Answer in context",
    "points": 20,
    "explanation": "Translate word problem into quadratic, solve, interpret",
    "teaching_explanation": "Read carefully, let x be the unknown, form an equation, then solve!"
}""", "learning_objective": "Form and solve quadratic equations from word problems"}
        ],
        "difficult": [
            {"id": "QE_D01", "subtopic": "Quadratic Formula",
             "prompt": """Generate a ZIMSEC question requiring the quadratic formula.

Requirements: ax² + bx + c = 0 that doesn't factorize nicely. Give answers to 2 d.p.

Example: "Solve 2x² + 5x - 4 = 0, giving answers to 2 decimal places"

Return ONLY valid JSON:
{
    "question": "Solve ax² + bx + c = 0 using the quadratic formula",
    "solution": "Step 1: Identify a, b, c\\nStep 2: Calculate discriminant b² - 4ac\\nStep 3: Apply x = (-b ± √(b²-4ac))/2a\\nStep 4: Calculate both solutions",
    "answer": "x = value1 or x = value2 (to 2 d.p.)",
    "points": 30,
    "explanation": "The quadratic formula gives solutions when factorization is difficult",
    "teaching_explanation": "When you can't factor, the formula is your friend: negative b, plus or minus root, all over 2a!"
}""", "learning_objective": "Apply the quadratic formula to solve equations"},
            
            {"id": "QE_D02", "subtopic": "Discriminant Analysis",
             "prompt": """Generate a ZIMSEC question about the discriminant.

Requirements: Determine nature of roots using b² - 4ac. May have parameter.

Example: "Find the values of k for which x² + kx + 4 = 0 has equal roots"

Return ONLY valid JSON:
{
    "question": "Analyze discriminant to determine nature of roots",
    "solution": "Step 1: Calculate b² - 4ac\\nStep 2: If > 0: two distinct real roots\\nStep 3: If = 0: equal roots\\nStep 4: If < 0: no real roots",
    "answer": "Nature of roots or value of parameter",
    "points": 30,
    "explanation": "The discriminant determines how many real solutions exist",
    "teaching_explanation": "b² - 4ac is like a traffic light: positive = green (2 routes), zero = yellow (1 route), negative = red (no real route)!"
}""", "learning_objective": "Use the discriminant to analyze the nature of roots"},
            
            {"id": "QE_D03", "subtopic": "Forming Quadratics from Roots",
             "prompt": """Generate a ZIMSEC question about forming quadratics from roots.

Requirements: Given roots α and β, form equation. Use sum and product of roots.

Example: "Form a quadratic equation with roots 3 and -2"

Return ONLY valid JSON:
{
    "question": "Form quadratic with given roots",
    "solution": "Step 1: Sum of roots = -b/a\\nStep 2: Product of roots = c/a\\nStep 3: Equation is x² - (sum)x + (product) = 0",
    "answer": "Quadratic equation",
    "points": 30,
    "explanation": "If α, β are roots, the equation is x² - (α+β)x + αβ = 0",
    "teaching_explanation": "Sum of roots goes in middle with opposite sign, product goes at end!"
}""", "learning_objective": "Form quadratic equations given the roots"},
            
            {"id": "QE_D04", "subtopic": "Completing Square - Complex",
             "prompt": """Generate a ZIMSEC question completing the square with leading coefficient ≠ 1.

Requirements: ax² + bx + c where a = 2 or 3. Factor out a first.

Example: "Express 2x² + 8x + 3 in the form a(x + p)² + q"

Return ONLY valid JSON:
{
    "question": "Express ax² + bx + c in form a(x + p)² + q",
    "solution": "Step 1: Factor out a: a(x² + (b/a)x) + c\\nStep 2: Complete square inside bracket\\nStep 3: Simplify and find q",
    "answer": "a(x + p)² + q",
    "points": 30,
    "explanation": "Factor out the leading coefficient first, then complete the square",
    "teaching_explanation": "Take out the leading number first, then complete the square on what's left!"
}""", "learning_objective": "Complete the square when leading coefficient is not 1"},
            
            {"id": "QE_D05", "subtopic": "Quadratic Simultaneous Equations",
             "prompt": """Generate a ZIMSEC question with one linear and one quadratic equation.

Requirements: System like y = 2x + 1 and y = x². Substitute and solve.

Example: "Solve simultaneously: y = x² and y = 2x + 3"

Return ONLY valid JSON:
{
    "question": "Solve the simultaneous equations",
    "solution": "Step 1: Substitute linear into quadratic\\nStep 2: Rearrange to standard form\\nStep 3: Solve quadratic\\nStep 4: Find corresponding y values",
    "answer": "Pairs of (x, y) solutions",
    "points": 30,
    "explanation": "Substitute one equation into the other to get a quadratic",
    "teaching_explanation": "Replace y in one equation with the expression from the other - you'll get a quadratic to solve!"
}""", "learning_objective": "Solve systems with one linear and one quadratic equation"}
        ]
    }
}

# ============================================================================
# TOPIC 6: ALGEBRAIC FRACTIONS (15 Prompts)
# ============================================================================

ALGEBRAIC_FRACTIONS = {
    "topic": "Algebraic Fractions",
    "description": "Operations with fractions containing algebraic expressions",
    "learning_objectives": [
        "Simplify algebraic fractions by canceling common factors",
        "Find HCF and LCM of algebraic expressions",
        "Add and subtract algebraic fractions",
        "Multiply and divide algebraic fractions",
        "Solve equations involving algebraic fractions"
    ],
    "prompts": {
        "easy": [
            {"id": "AF_E01", "subtopic": "Simplifying Algebraic Fractions",
             "prompt": """Generate a ZIMSEC question about simplifying algebraic fractions.

Requirements: Single variable, obvious common factor to cancel.

Example: "Simplify: 6x/9x²"

Return JSON with question, step-by-step solution, answer, points:10, explanation, teaching_explanation.""",
             "learning_objective": "Simplify algebraic fractions by canceling"},
            
            {"id": "AF_E02", "subtopic": "Multiplying Algebraic Fractions",
             "prompt": """Generate a ZIMSEC question multiplying two algebraic fractions.

Requirements: Simple monomials, should simplify nicely.

Example: "Simplify: (2x/3) × (9/4x)"

Return JSON format.""",
             "learning_objective": "Multiply algebraic fractions"},
            
            {"id": "AF_E03", "subtopic": "Dividing Algebraic Fractions",
             "prompt": """Generate a ZIMSEC question dividing algebraic fractions.

Requirements: Flip and multiply. Simple expressions.

Example: "Simplify: (4x/5) ÷ (2x/15)"

Return JSON format.""",
             "learning_objective": "Divide algebraic fractions using reciprocals"},
            
            {"id": "AF_E04", "subtopic": "Substitution in Algebraic Fractions",
             "prompt": """Generate a question evaluating an algebraic fraction for given value.

Requirements: Simple fraction, substitute x = positive integer, nice answer.

Example: "If x = 3, find the value of (2x + 1)/(x - 1)"

Return JSON format.""",
             "learning_objective": "Evaluate algebraic fractions by substitution"},
            
            {"id": "AF_E05", "subtopic": "Expressing as Single Fraction",
             "prompt": """Generate a question writing a sum as a single fraction.

Requirements: Same denominator, just add numerators.

Example: "Write as a single fraction: (x + 2)/5 + (x - 3)/5"

Return JSON format.""",
             "learning_objective": "Combine fractions with common denominators"}
        ],
        "medium": [
            {"id": "AF_M01", "subtopic": "Adding Different Denominators",
             "prompt": """Generate a ZIMSEC question adding algebraic fractions with different denominators.

Requirements: Different denominators requiring LCM. Monomial denominators.

Example: "Express as single fraction: 2/x + 3/2x"

Return JSON format with detailed solution showing LCM method.""",
             "learning_objective": "Add algebraic fractions with different denominators"},
            
            {"id": "AF_M02", "subtopic": "Subtracting Algebraic Fractions",
             "prompt": """Generate a question subtracting algebraic fractions.

Requirements: Different denominators, careful sign handling in numerator.

Example: "Simplify: (3x + 1)/2 - (x - 2)/3"

Return JSON format.""",
             "learning_objective": "Subtract algebraic fractions correctly"},
            
            {"id": "AF_M03", "subtopic": "Factorizing Before Simplifying",
             "prompt": """Generate a question where numerator/denominator need factorizing first.

Requirements: Factorable expressions that cancel after factoring.

Example: "Simplify: (x² - 4)/(x + 2)"

Return JSON format showing factorization step.""",
             "learning_objective": "Simplify by factorizing first"},
            
            {"id": "AF_M04", "subtopic": "Complex Multiplication",
             "prompt": """Generate a question multiplying/dividing algebraic fractions with binomials.

Requirements: Expressions that factor and cancel.

Example: "Simplify: [(x + 3)/(x - 2)] × [(x - 2)/(x + 1)]"

Return JSON format.""",
             "learning_objective": "Multiply complex algebraic fractions"},
            
            {"id": "AF_M05", "subtopic": "Mixed Operations",
             "prompt": """Generate a question with mixed operations on algebraic fractions.

Requirements: Combination of +, -, ×, ÷. Follow order of operations.

Example: "Simplify: (2/x) + (3/x) × (x/6)"

Return JSON format.""",
             "learning_objective": "Apply order of operations to algebraic fractions"}
        ],
        "difficult": [
            {"id": "AF_D01", "subtopic": "Complex Combined Fractions",
             "prompt": """Generate a difficult ZIMSEC question combining multiple algebraic fractions.

Requirements: Multiple terms, different denominators, factorization required.

Example: "Express as single fraction: 2/(x-1) - 3/(x+1) + 1/(x²-1)"

Return JSON with full working.""",
             "learning_objective": "Combine multiple algebraic fractions with related denominators"},
            
            {"id": "AF_D02", "subtopic": "Simplifying Complex Fractions",
             "prompt": """Generate a question simplifying a fraction containing fractions.

Requirements: Fraction with fractions in numerator and/or denominator.

Example: "Simplify: (1 + 1/x)/(1 - 1/x)"

Return JSON format.""",
             "learning_objective": "Simplify complex fractions (fractions within fractions)"},
            
            {"id": "AF_D03", "subtopic": "Solving Equations with Fractions",
             "prompt": """Generate an equation involving algebraic fractions to solve.

Requirements: Variable in denominator, multiply through by LCM.

Example: "Solve: 2/(x+1) + 3/(x-1) = 1"

Return JSON with full solution and check.""",
             "learning_objective": "Solve equations containing algebraic fractions"},
            
            {"id": "AF_D04", "subtopic": "Partial Fractions - Simple",
             "prompt": """Generate a basic partial fractions question.

Requirements: Split single fraction into sum of simpler fractions. Linear factors.

Example: "Express 5/(x+2)(x-3) as partial fractions"

Return JSON format.""",
             "learning_objective": "Decompose into partial fractions"},
            
            {"id": "AF_D05", "subtopic": "Algebraic Fraction Proofs",
             "prompt": """Generate a question proving an algebraic fraction identity.

Requirements: LHS and RHS given, show they're equal.

Example: "Prove that (x+1)/(x-1) - (x-1)/(x+1) = 4x/(x²-1)"

Return JSON showing both sides equal.""",
             "learning_objective": "Prove algebraic fraction identities"}
        ]
    }
}

# ============================================================================
# TOPIC 7: INEQUALITIES (15 Prompts)
# ============================================================================

INEQUALITIES = {
    "topic": "Inequalities",
    "description": "Solving and representing linear inequalities",
    "learning_objectives": [
        "Represent inequalities on a number line",
        "Solve linear inequalities: ax + b < c",
        "Understand sign reversal when multiplying/dividing by negatives",
        "Solve compound inequalities",
        "Represent solutions graphically"
    ],
    "prompts": {
        "easy": [
            {"id": "IQ_E01", "subtopic": "Number Line Representation",
             "prompt": """Generate a ZIMSEC question about showing inequalities on number lines.

Requirements: Simple inequality like x > 3 or x ≤ -2. Draw or describe number line.

Example: "Represent x > 4 on a number line"

Return JSON describing the representation (open/closed circle, direction).""",
             "learning_objective": "Represent inequalities on number lines"},
            
            {"id": "IQ_E02", "subtopic": "One-step Inequalities",
             "prompt": """Generate a question solving one-step inequalities.

Requirements: Format x + a < b or ax > b. Positive coefficients only.

Example: "Solve: x + 3 > 7"

Return JSON format.""",
             "learning_objective": "Solve one-step linear inequalities"},
            
            {"id": "IQ_E03", "subtopic": "Two-step Inequalities",
             "prompt": """Generate a question solving two-step inequalities.

Requirements: Format ax + b ≤ c. Positive coefficient of x.

Example: "Solve: 2x + 5 ≤ 13"

Return JSON format.""",
             "learning_objective": "Solve two-step linear inequalities"},
            
            {"id": "IQ_E04", "subtopic": "Writing Inequalities from Words",
             "prompt": """Generate a question translating words to inequalities.

Requirements: Phrases like "at least", "no more than", "less than".

Example: "Write an inequality: x is at least 5"

Return JSON format.""",
             "learning_objective": "Translate verbal statements into inequalities"},
            
            {"id": "IQ_E05", "subtopic": "Integer Solutions",
             "prompt": """Generate a question finding integer solutions to inequalities.

Requirements: Inequality with small solution set. List all integers.

Example: "List the integers that satisfy -2 ≤ x < 4"

Return JSON format.""",
             "learning_objective": "Find integer solutions of inequalities"}
        ],
        "medium": [
            {"id": "IQ_M01", "subtopic": "Negative Coefficient",
             "prompt": """Generate a question with inequality requiring sign reversal.

Requirements: Divide/multiply by negative, must reverse inequality sign.

Example: "Solve: -3x < 12"

Return JSON emphasizing the sign reversal step.""",
             "learning_objective": "Solve inequalities involving negative coefficients"},
            
            {"id": "IQ_M02", "subtopic": "Variables Both Sides",
             "prompt": """Generate a question with variables on both sides.

Requirements: ax + b > cx + d form.

Example: "Solve: 5x - 3 > 2x + 9"

Return JSON format.""",
             "learning_objective": "Solve inequalities with variables on both sides"},
            
            {"id": "IQ_M03", "subtopic": "Compound Inequalities - And",
             "prompt": """Generate a compound inequality question (intersection).

Requirements: Format a < x < b or two inequalities with "and".

Example: "Solve: -2 < x + 3 < 5"

Return JSON with solution set.""",
             "learning_objective": "Solve compound inequalities (AND type)"},
            
            {"id": "IQ_M04", "subtopic": "Inequalities with Brackets",
             "prompt": """Generate an inequality with brackets to expand.

Requirements: a(x + b) ≤ c format. Expand then solve.

Example: "Solve: 2(x - 3) ≤ 10"

Return JSON format.""",
             "learning_objective": "Solve inequalities with brackets"},
            
            {"id": "IQ_M05", "subtopic": "Inequality Word Problems",
             "prompt": """Generate a word problem requiring an inequality.

Requirements: Real-world context (budget, capacity, requirements).

Example: "A taxi charges $5 plus $2 per km. How far can you go with at most $25?"

Return JSON with inequality formation and solution.""",
             "learning_objective": "Solve word problems using inequalities"}
        ],
        "difficult": [
            {"id": "IQ_D01", "subtopic": "Compound Inequalities - Or",
             "prompt": """Generate a compound inequality with "or" (union).

Requirements: Two separate inequalities joined by OR.

Example: "Solve: 2x - 1 < 5 or 3x + 2 > 14"

Return JSON with full solution set.""",
             "learning_objective": "Solve compound inequalities (OR type)"},
            
            {"id": "IQ_D02", "subtopic": "Double Inequalities - Complex",
             "prompt": """Generate a complex double inequality.

Requirements: a < bx + c < d where solving requires careful steps.

Example: "Solve: 1 < 3 - 2x ≤ 9"

Return JSON showing careful handling of operations on all parts.""",
             "learning_objective": "Solve complex double inequalities"},
            
            {"id": "IQ_D03", "subtopic": "Quadratic Inequalities",
             "prompt": """Generate a quadratic inequality question.

Requirements: x² + bx + c > 0 or < 0. Factorize, find critical values, test regions.

Example: "Solve: x² - 5x + 6 > 0"

Return JSON with full method.""",
             "learning_objective": "Solve quadratic inequalities"},
            
            {"id": "IQ_D04", "subtopic": "Graphical Solutions",
             "prompt": """Generate a question about graphing linear inequalities in 2D.

Requirements: Inequality like 2x + 3y < 12. Identify region.

Example: "Show the region satisfying 2x + y ≤ 8, x ≥ 0, y ≥ 0"

Return JSON describing the graphical approach.""",
             "learning_objective": "Represent linear inequalities graphically"},
            
            {"id": "IQ_D05", "subtopic": "Modulus Inequalities",
             "prompt": """Generate a question with modulus/absolute value inequalities.

Requirements: |ax + b| < c or |ax + b| > c.

Example: "Solve: |2x - 3| < 7"

Return JSON showing split into two inequalities.""",
             "learning_objective": "Solve modulus inequalities"}
        ]
    }
}

# ============================================================================
# TOPIC 8: SIMULTANEOUS EQUATIONS (15 Prompts)
# ============================================================================

SIMULTANEOUS_EQUATIONS = {
    "topic": "Simultaneous Equations",
    "description": "Solving systems of linear equations in two variables",
    "learning_objectives": [
        "Solve by elimination method",
        "Solve by substitution method",
        "Solve graphically (intersection of lines)",
        "Form simultaneous equations from word problems",
        "Solve one linear, one quadratic equation"
    ],
    "prompts": {
        "easy": [
            {"id": "SE_E01", "subtopic": "Elimination - Direct",
             "prompt": """Generate a ZIMSEC question solved by direct elimination.

Requirements: Coefficients already match (e.g., 2x + y = 7, 3x + y = 9).

Example: "Solve: x + y = 10, x - y = 4"

Return JSON with elimination method solution.""",
             "learning_objective": "Solve by elimination when coefficients already match"},
            
            {"id": "SE_E02", "subtopic": "Substitution - Simple",
             "prompt": """Generate a question where one variable is already isolated.

Requirements: One equation in form y = ax + b or x = ...

Example: "Solve: y = 2x + 1, 3x + y = 11"

Return JSON showing substitution method.""",
             "learning_objective": "Solve by substitution when variable is isolated"},
            
            {"id": "SE_E03", "subtopic": "Both Methods Possible",
             "prompt": """Generate a question solvable by either method.

Requirements: Simple coefficients, nice integer solutions.

Example: "Solve: 2x + y = 7, x + 3y = 11"

Return JSON (student can choose method).""",
             "learning_objective": "Choose appropriate method for solving"},
            
            {"id": "SE_E04", "subtopic": "Verification",
             "prompt": """Generate a question checking if a point satisfies both equations.

Requirements: Given point, check in two equations.

Example: "Does the point (2, 5) satisfy both equations: x + y = 7 and 2x - y = -1?"

Return JSON format.""",
             "learning_objective": "Verify solutions to simultaneous equations"},
            
            {"id": "SE_E05", "subtopic": "Setting Up from Words",
             "prompt": """Generate a simple word problem requiring simultaneous equations.

Requirements: Two unknowns, two conditions given. Form equations only.

Example: "Sum of two numbers is 15, difference is 3. Write two equations."

Return JSON with equation formation.""",
             "learning_objective": "Form simultaneous equations from word problems"}
        ],
        "medium": [
            {"id": "SE_M01", "subtopic": "Elimination - Scaling Needed",
             "prompt": """Generate a question requiring multiplication before elimination.

Requirements: Need to multiply one or both equations to match coefficients.

Example: "Solve: 2x + 3y = 12, 3x + 2y = 13"

Return JSON showing scaling step before elimination.""",
             "learning_objective": "Solve by elimination with coefficient scaling"},
            
            {"id": "SE_M02", "subtopic": "Substitution - Rearrangement Needed",
             "prompt": """Generate a question requiring rearrangement for substitution.

Requirements: Neither variable initially isolated. Rearrange first.

Example: "Solve: 3x - y = 7, 2x + 3y = 1"

Return JSON format.""",
             "learning_objective": "Solve by substitution with rearrangement"},
            
            {"id": "SE_M03", "subtopic": "Word Problems - Full Solution",
             "prompt": """Generate a word problem requiring full solve.

Requirements: Practical context (costs, ages, dimensions). Form AND solve.

Example: "Pens cost $2, pencils cost $1. 5 pens and 3 pencils cost $13. 2 pens and 7 pencils cost $11. Find prices."

Return JSON with complete solution.""",
             "learning_objective": "Form and solve simultaneous equations from problems"},
            
            {"id": "SE_M04", "subtopic": "Fractional Coefficients",
             "prompt": """Generate a question with fractions in equations.

Requirements: Clear fractions before solving.

Example: "Solve: x/2 + y/3 = 4, x/4 + y/2 = 3"

Return JSON showing clearing fractions first.""",
             "learning_objective": "Solve simultaneous equations with fractions"},
            
            {"id": "SE_M05", "subtopic": "Graphical Solution",
             "prompt": """Generate a question requiring graphical solution.

Requirements: Draw both lines, find intersection. Give equations for line drawing.

Example: "Solve graphically: y = 2x - 1, y = -x + 5"

Return JSON describing graphical method.""",
             "learning_objective": "Solve simultaneous equations graphically"}
        ],
        "difficult": [
            {"id": "SE_D01", "subtopic": "Three Variables - Basic",
             "prompt": """Generate a system with three unknowns requiring elimination.

Requirements: Three equations, three unknowns. Reduce to two equations.

Example: "Solve: x + y + z = 6, 2x + y - z = 1, x - y + 2z = 5"

Return JSON with systematic elimination.""",
             "learning_objective": "Extend elimination to three variables"},
            
            {"id": "SE_D02", "subtopic": "Linear-Quadratic System",
             "prompt": """Generate a system with one linear and one quadratic.

Requirements: Line and curve (parabola or circle). Find intersection points.

Example: "Solve: y = x + 1, y = x²"

Return JSON with substitution method for quadratic.""",
             "learning_objective": "Solve linear-quadratic simultaneous equations"},
            
            {"id": "SE_D03", "subtopic": "Complex Word Problems",
             "prompt": """Generate a challenging application problem.

Requirements: Multi-step, requires careful interpretation. Ages or money.

Example: "A is 3 times as old as B. In 10 years, A will be twice as old as B. Find ages."

Return JSON with full working.""",
             "learning_objective": "Solve complex simultaneous equation word problems"},
            
            {"id": "SE_D04", "subtopic": "Special Cases",
             "prompt": """Generate a system with no solution or infinite solutions.

Requirements: Parallel lines (no solution) or same line (infinite solutions).

Example: "Determine the nature of solutions for: 2x + 4y = 8, x + 2y = 5"

Return JSON explaining the special case.""",
             "learning_objective": "Identify inconsistent and dependent systems"},
            
            {"id": "SE_D05", "subtopic": "Parameter Problems",
             "prompt": """Generate a problem finding a parameter for specific solution.

Requirements: Find value of k for which system has particular solution.

Example: "Find k if 2x + ky = 10, 3x + 2y = 8 has solution x = 2"

Return JSON format.""",
             "learning_objective": "Solve for parameters in simultaneous equations"}
        ]
    }
}

# ============================================================================
# TOPIC 9: FORMULAE AND SUBJECT OF FORMULA (15 Prompts)
# ============================================================================

FORMULAE = {
    "topic": "Formulae and Subject of Formula",
    "description": "Working with formulae and changing the subject",
    "learning_objectives": [
        "Substitute values into formulae",
        "Rearrange formulae to change the subject",
        "Handle formulae with squares, roots, and fractions",
        "Derive formulae from word problems",
        "Apply formulae to real-world situations"
    ],
    "prompts": {
        "easy": [
            {"id": "FM_E01", "subtopic": "Substitution into Formulae",
             "prompt": """Generate a ZIMSEC question about substituting into formulae.

Requirements: Given formula and values, calculate result. Use familiar formulae.

Example: "If A = πr², find A when r = 7 (use π = 22/7)"

Return JSON format.""",
             "learning_objective": "Substitute values into formulae correctly"},
            
            {"id": "FM_E02", "subtopic": "Simple Subject Change",
             "prompt": """Generate a question making a variable the subject - one step.

Requirements: Linear formula, simple rearrangement.

Example: "Make x the subject of y = mx + c"

Return JSON format.""",
             "learning_objective": "Rearrange simple formulae"},
            
            {"id": "FM_E03", "subtopic": "Subject with Multiplication",
             "prompt": """Generate a question where subject is multiplied.

Requirements: Format like A = bh or C = 2πr.

Example: "Make r the subject of C = 2πr"

Return JSON format.""",
             "learning_objective": "Make subject when variable is multiplied"},
            
            {"id": "FM_E04", "subtopic": "Subject with Division",
             "prompt": """Generate a question where subject is in denominator.

Requirements: Variable appears in fraction.

Example: "Make t the subject of s = d/t"

Return JSON format.""",
             "learning_objective": "Make subject when variable is in denominator"},
            
            {"id": "FM_E05", "subtopic": "Creating Formulae",
             "prompt": """Generate a question writing a formula from words.

Requirements: Simple relationship described in words.

Example: "Write a formula: The cost C is $5 plus $2 for each hour h"

Return JSON format.""",
             "learning_objective": "Create formulae from word descriptions"}
        ],
        "medium": [
            {"id": "FM_M01", "subtopic": "Subject with Square",
             "prompt": """Generate a question making the subject of a formula with squares.

Requirements: Variable appears squared. Take square root.

Example: "Make r the subject of A = πr²"

Return JSON format including ± where appropriate.""",
             "learning_objective": "Handle squared terms when changing subject"},
            
            {"id": "FM_M02", "subtopic": "Subject with Square Root",
             "prompt": """Generate a question where subject is under a root.

Requirements: Formula with square root. Need to square both sides.

Example: "Make h the subject of T = 2π√(h/g)"

Return JSON format.""",
             "learning_objective": "Handle square root terms when changing subject"},
            
            {"id": "FM_M03", "subtopic": "Subject in Multiple Terms",
             "prompt": """Generate a question where subject appears in more than one term.

Requirements: Collect terms with subject, factor out.

Example: "Make x the subject of ax + b = cx + d"

Return JSON showing factorization step.""",
             "learning_objective": "Collect and factor when subject appears twice"},
            
            {"id": "FM_M04", "subtopic": "Complex Fractions",
             "prompt": """Generate a question with formula involving fractions.

Requirements: Subject in numerator or denominator of fraction.

Example: "Make v the subject of f = uv/(u + v)"

Return JSON format.""",
             "learning_objective": "Rearrange formulae with complex fractions"},
            
            {"id": "FM_M05", "subtopic": "Physics Formulae",
             "prompt": """Generate a question using a physics formula.

Requirements: Use common ZIMSEC physics formula. Substitute or rearrange.

Example: "The formula for kinetic energy is E = ½mv². Find m if E = 100 and v = 5"

Return JSON format.""",
             "learning_objective": "Apply formula manipulation to physics contexts"}
        ],
        "difficult": [
            {"id": "FM_D01", "subtopic": "Complex Subject Change",
             "prompt": """Generate a challenging subject of formula question.

Requirements: Multiple steps, subject appears in complex expression.

Example: "Make x the subject of y = √((ax + b)/(cx - d))"

Return JSON with detailed steps.""",
             "learning_objective": "Handle complex multi-step formula rearrangement"},
            
            {"id": "FM_D02", "subtopic": "Subject Appears Multiple Times - Complex",
             "prompt": """Generate a question where subject appears in many places.

Requirements: Need to collect, factor, and simplify significantly.

Example: "Make p the subject of q = (p + r)/(p - r)"

Return JSON format.""",
             "learning_objective": "Rearrange when subject appears in multiple complex positions"},
            
            {"id": "FM_D03", "subtopic": "Deriving Formulae",
             "prompt": """Generate a question requiring derivation of a formula.

Requirements: Word problem leading to formula creation.

Example: "A pool charges $50 membership plus $3 per visit. Derive a formula for total cost."

Return JSON with formula derivation.""",
             "learning_objective": "Derive formulae from complex word problems"},
            
            {"id": "FM_D04", "subtopic": "Simultaneous Formula Problems",
             "prompt": """Generate a question combining two formulae.

Requirements: Need to combine/eliminate using two given formulae.

Example: "Given s = ut + ½at² and v = u + at, find s in terms of v, t, and a only"

Return JSON format.""",
             "learning_objective": "Combine and manipulate multiple formulae"},
            
            {"id": "FM_D05", "subtopic": "Applied Formula Problems",
             "prompt": """Generate a real-world problem requiring formula work.

Requirements: Practical context, form formula, use it to solve.

Example: "Mobile plan: $20 base + $0.05 per minute. When is it cheaper than $0.15 per minute plan?"

Return JSON with complete solution.""",
             "learning_objective": "Apply formulae to practical problems"}
        ]
    }
}

# ============================================================================
# TOPIC 10: FUNCTIONS (15 Prompts)
# ============================================================================

FUNCTIONS = {
    "topic": "Functions",
    "description": "Function notation, evaluation, and operations",
    "learning_objectives": [
        "Understand function notation: f(x)",
        "Evaluate functions for given inputs",
        "Find domain and range of functions",
        "Determine inverse functions",
        "Work with composite functions"
    ],
    "prompts": {
        "easy": [
            {"id": "FN_E01", "subtopic": "Function Notation",
             "prompt": """Generate a ZIMSEC question about basic function notation.

Requirements: Given f(x) = expression, find f(a) for specific value a.

Example: "If f(x) = 2x + 3, find f(4)"

Return JSON format.""",
             "learning_objective": "Evaluate functions using function notation"},
            
            {"id": "FN_E02", "subtopic": "Evaluating at Values",
             "prompt": """Generate a question evaluating a function at multiple values.

Requirements: Find f(-2), f(0), f(3) etc. for given function.

Example: "If f(x) = x² - 4, find f(-3)"

Return JSON format.""",
             "learning_objective": "Evaluate functions at positive and negative values"},
            
            {"id": "FN_E03", "subtopic": "Finding Input from Output",
             "prompt": """Generate a question finding x when f(x) is known.

Requirements: Given f(x) = value, solve for x.

Example: "If f(x) = 3x - 1, find x when f(x) = 11"

Return JSON format.""",
             "learning_objective": "Solve for input given function output"},
            
            {"id": "FN_E04", "subtopic": "Function from Table",
             "prompt": """Generate a question about functions from tables.

Requirements: Table of x and f(x) values, find pattern or specific value.

Example: "From the table, find f(3): x: 1,2,3,4 | f(x): 5,8,__,14"

Return JSON format.""",
             "learning_objective": "Identify function values from tables"},
            
            {"id": "FN_E05", "subtopic": "Interpreting Function Notation",
             "prompt": """Generate a question interpreting what f(a) means.

Requirements: Contextual interpretation of function.

Example: "If P(t) represents population after t years, what does P(5) represent?"

Return JSON format.""",
             "learning_objective": "Interpret function notation in context"}
        ],
        "medium": [
            {"id": "FN_M01", "subtopic": "Composite Functions - Simple",
             "prompt": """Generate a question about composite functions.

Requirements: Find f(g(x)) or g(f(x)) for simple functions.

Example: "If f(x) = 2x and g(x) = x + 3, find f(g(x))"

Return JSON showing composition step.""",
             "learning_objective": "Evaluate composite functions"},
            
            {"id": "FN_M02", "subtopic": "Inverse Functions - Linear",
             "prompt": """Generate a question finding inverse of a linear function.

Requirements: f(x) = ax + b, find f⁻¹(x).

Example: "Find the inverse of f(x) = 3x - 2"

Return JSON with method for finding inverse.""",
             "learning_objective": "Find inverses of linear functions"},
            
            {"id": "FN_M03", "subtopic": "Domain and Range",
             "prompt": """Generate a question about domain and range.

Requirements: Identify valid inputs and possible outputs.

Example: "State the domain and range of f(x) = √(x - 2)"

Return JSON explaining domain/range.""",
             "learning_objective": "Determine domain and range of functions"},
            
            {"id": "FN_M04", "subtopic": "Composite at Specific Values",
             "prompt": """Generate a question evaluating composites at values.

Requirements: Find fg(2) or gf(-1) with given f and g.

Example: "If f(x) = x² and g(x) = 2x + 1, find fg(2)"

Return JSON showing step-by-step evaluation.""",
             "learning_objective": "Evaluate composite functions at specific values"},
            
            {"id": "FN_M05", "subtopic": "Graphing Functions",
             "prompt": """Generate a question about function graphs.

Requirements: Match function to graph or describe graph features.

Example: "Sketch y = x² - 4, marking where it crosses the axes"

Return JSON describing key features.""",
             "learning_objective": "Relate functions to their graphs"}
        ],
        "difficult": [
            {"id": "FN_D01", "subtopic": "Complex Composites",
             "prompt": """Generate a challenging composite function question.

Requirements: Triple composition or finding unknown in composite.

Example: "If f(x) = x + 2 and g(f(x)) = 3x + 8, find g(x)"

Return JSON with full working.""",
             "learning_objective": "Solve complex composite function problems"},
            
            {"id": "FN_D02", "subtopic": "Inverse Functions - Non-linear",
             "prompt": """Generate a question finding inverse of non-linear function.

Requirements: Quadratic or other non-linear function. Consider restrictions.

Example: "Find the inverse of f(x) = x² + 1 for x ≥ 0"

Return JSON with domain restriction discussion.""",
             "learning_objective": "Find inverses of non-linear functions"},
            
            {"id": "FN_D03", "subtopic": "Self-inverse Functions",
             "prompt": """Generate a question about self-inverse functions.

Requirements: Function where f(f(x)) = x. Prove or find parameters.

Example: "Show that f(x) = (x-1)/(x+1) is self-inverse"

Return JSON with proof.""",
             "learning_objective": "Identify and verify self-inverse functions"},
            
            {"id": "FN_D04", "subtopic": "Composite Function Equations",
             "prompt": """Generate a question solving composite function equations.

Requirements: Solve equations like fg(x) = value.

Example: "If f(x) = 2x + 1 and g(x) = x², solve fg(x) = 9"

Return JSON with solution.""",
             "learning_objective": "Solve equations involving composite functions"},
            
            {"id": "FN_D05", "subtopic": "Piecewise Functions",
             "prompt": """Generate a question about piecewise functions.

Requirements: Function defined differently for different x values.

Example: "If f(x) = {2x if x < 0, x² if x ≥ 0}, find f(-3) and f(2)"

Return JSON format.""",
             "learning_objective": "Evaluate piecewise functions"}
        ]
    }
}

# ============================================================================
# TOPIC 11: SEQUENCES AND SERIES (15 Prompts)
# ============================================================================

SEQUENCES_AND_SERIES = {
    "topic": "Sequences and Series",
    "description": "Arithmetic and geometric progressions",
    "learning_objectives": [
        "Identify arithmetic sequences and find nth term",
        "Identify geometric sequences and find nth term",
        "Find sum of arithmetic series",
        "Find sum of geometric series",
        "Apply sequences to real-world problems"
    ],
    "prompts": {
        "easy": [
            {"id": "SS_E01", "subtopic": "Identifying Sequences",
             "prompt": """Generate a ZIMSEC question identifying sequence type.

Requirements: Given sequence, determine if arithmetic or geometric.

Example: "What type of sequence is 3, 6, 12, 24, ...?"

Return JSON format.""",
             "learning_objective": "Distinguish arithmetic from geometric sequences"},
            
            {"id": "SS_E02", "subtopic": "Finding Common Difference",
             "prompt": """Generate a question finding common difference.

Requirements: Arithmetic sequence, find d.

Example: "Find the common difference of 5, 9, 13, 17, ..."

Return JSON format.""",
             "learning_objective": "Find common difference in arithmetic sequences"},
            
            {"id": "SS_E03", "subtopic": "Finding Common Ratio",
             "prompt": """Generate a question finding common ratio.

Requirements: Geometric sequence, find r.

Example: "Find the common ratio of 2, 6, 18, 54, ..."

Return JSON format.""",
             "learning_objective": "Find common ratio in geometric sequences"},
            
            {"id": "SS_E04", "subtopic": "Next Terms",
             "prompt": """Generate a question finding next terms in sequence.

Requirements: Given first few terms, find next 2-3 terms.

Example: "Find the next two terms: 7, 11, 15, 19, ..."

Return JSON format.""",
             "learning_objective": "Continue arithmetic and geometric sequences"},
            
            {"id": "SS_E05", "subtopic": "Missing Terms",
             "prompt": """Generate a question finding missing terms.

Requirements: Sequence with gap, fill in missing term.

Example: "Find the missing term: 4, __, 16, 22"

Return JSON format.""",
             "learning_objective": "Find missing terms in sequences"}
        ],
        "medium": [
            {"id": "SS_M01", "subtopic": "Nth Term - Arithmetic",
             "prompt": """Generate a question finding nth term of AP.

Requirements: Use formula Un = a + (n-1)d.

Example: "Find the 20th term of 3, 7, 11, 15, ..."

Return JSON with formula application.""",
             "learning_objective": "Apply nth term formula for arithmetic sequences"},
            
            {"id": "SS_M02", "subtopic": "Nth Term - Geometric",
             "prompt": """Generate a question finding nth term of GP.

Requirements: Use formula Un = ar^(n-1).

Example: "Find the 8th term of 2, 6, 18, ..."

Return JSON format.""",
             "learning_objective": "Apply nth term formula for geometric sequences"},
            
            {"id": "SS_M03", "subtopic": "Finding n",
             "prompt": """Generate a question finding which term has certain value.

Requirements: Given term value, find n.

Example: "Which term of 5, 8, 11, ... equals 47?"

Return JSON with equation solving.""",
             "learning_objective": "Find term number given the value"},
            
            {"id": "SS_M04", "subtopic": "Sum of Arithmetic Series",
             "prompt": """Generate a question finding sum of AP.

Requirements: Use Sn = n/2[2a + (n-1)d] or n/2(first + last).

Example: "Find sum of first 20 terms of 2, 5, 8, 11, ..."

Return JSON showing formula choice.""",
             "learning_objective": "Calculate sum of arithmetic series"},
            
            {"id": "SS_M05", "subtopic": "Sum of Geometric Series",
             "prompt": """Generate a question finding sum of GP.

Requirements: Use Sn = a(r^n - 1)/(r - 1).

Example: "Find sum of first 6 terms of 3, 6, 12, ..."

Return JSON format.""",
             "learning_objective": "Calculate sum of geometric series"}
        ],
        "difficult": [
            {"id": "SS_D01", "subtopic": "Term from Different Information",
             "prompt": """Generate a question finding terms from given conditions.

Requirements: Given two terms (not first), find first term and common difference/ratio.

Example: "If the 3rd term is 12 and 7th term is 24, find the first term."

Return JSON with simultaneous equation approach.""",
             "learning_objective": "Find sequence parameters from given terms"},
            
            {"id": "SS_D02", "subtopic": "Sum to Infinity",
             "prompt": """Generate a question about sum to infinity of GP.

Requirements: Convergent GP (|r| < 1), use S∞ = a/(1-r).

Example: "Find sum to infinity of 8 + 4 + 2 + 1 + ..."

Return JSON with convergence check.""",
             "learning_objective": "Find sum to infinity of convergent geometric series"},
            
            {"id": "SS_D03", "subtopic": "Application Problems",
             "prompt": """Generate a real-world sequence/series problem.

Requirements: Context like savings, depreciation, population growth.

Example: "A car depreciates by 15% each year. If it costs $20,000 now, find its value after 5 years."

Return JSON with sequence application.""",
             "learning_objective": "Apply sequences to practical problems"},
            
            {"id": "SS_D04", "subtopic": "Finding Sum of Specific Terms",
             "prompt": """Generate a question finding sum of terms between positions.

Requirements: Sum of terms from term m to term n, not from beginning.

Example: "Find the sum of terms from the 10th to the 20th term of 2, 5, 8, ..."

Return JSON with working.""",
             "learning_objective": "Calculate sums between specific term positions"},
            
            {"id": "SS_D05", "subtopic": "Number of Terms for Given Sum",
             "prompt": """Generate a question finding n for given sum.

Requirements: Given Sn = value, find how many terms.

Example: "How many terms of 5, 8, 11, ... are needed for sum to exceed 200?"

Return JSON solving for n.""",
             "learning_objective": "Find number of terms for target sum"}
        ]
    }
}

# ============================================================================
# TOPIC 12: LOGARITHMS (15 Prompts)
# ============================================================================

LOGARITHMS = {
    "topic": "Logarithms",
    "description": "Laws of logarithms and solving logarithmic equations",
    "learning_objectives": [
        "Convert between exponential and logarithmic form",
        "Apply laws: log(ab), log(a/b), log(a^n)",
        "Evaluate logarithms without calculator",
        "Solve logarithmic equations",
        "Apply logarithms to problems"
    ],
    "prompts": {
        "easy": [
            {"id": "LG_E01", "subtopic": "Converting Forms",
             "prompt": """Generate a ZIMSEC question about converting exponential to log form.

Requirements: Convert 2³ = 8 to log₂8 = 3 style.

Example: "Write 5² = 25 in logarithmic form"

Return JSON format.""",
             "learning_objective": "Convert between exponential and logarithmic form"},
            
            {"id": "LG_E02", "subtopic": "Evaluating Simple Logs",
             "prompt": """Generate a question evaluating simple logarithms.

Requirements: Log base 10 or simple bases. Nice integer answer.

Example: "Find the value of log₂ 32"

Return JSON with thinking process.""",
             "learning_objective": "Evaluate logarithms mentally"},
            
            {"id": "LG_E03", "subtopic": "Log of Powers of Base",
             "prompt": """Generate a question about logs of powers of the base.

Requirements: log_a(a^n) = n concept.

Example: "Find log₃ 81"

Return JSON showing the power recognition.""",
             "learning_objective": "Recognize logs of powers of the base"},
            
            {"id": "LG_E04", "subtopic": "Log of 1 and Base",
             "prompt": """Generate a question about special log values.

Requirements: log_a(1) = 0 and log_a(a) = 1.

Example: "Find log₇ 1" or "Find log₅ 5"

Return JSON format.""",
             "learning_objective": "Know special logarithm values"},
            
            {"id": "LG_E05", "subtopic": "Converting Log to Exponential",
             "prompt": """Generate a question converting log to exponential form.

Requirements: Given log form, write as exponential.

Example: "Write log₃ 27 = 3 in exponential form"

Return JSON format.""",
             "learning_objective": "Convert logarithms to exponential form"}
        ],
        "medium": [
            {"id": "LG_M01", "subtopic": "Product Rule",
             "prompt": """Generate a question using the product rule.

Requirements: log(ab) = log a + log b.

Example: "Simplify: log₂ 8 + log₂ 4"

Return JSON showing rule application.""",
             "learning_objective": "Apply the product rule of logarithms"},
            
            {"id": "LG_M02", "subtopic": "Quotient Rule",
             "prompt": """Generate a question using the quotient rule.

Requirements: log(a/b) = log a - log b.

Example: "Simplify: log₃ 81 - log₃ 3"

Return JSON format.""",
             "learning_objective": "Apply the quotient rule of logarithms"},
            
            {"id": "LG_M03", "subtopic": "Power Rule",
             "prompt": """Generate a question using the power rule.

Requirements: log(a^n) = n log a.

Example: "Express log 32 in terms of log 2"

Return JSON format.""",
             "learning_objective": "Apply the power rule of logarithms"},
            
            {"id": "LG_M04", "subtopic": "Combined Laws",
             "prompt": """Generate a question combining log laws.

Requirements: Use 2-3 laws together.

Example: "Simplify: 2 log 3 + log 4 - log 6"

Return JSON showing each law.""",
             "learning_objective": "Apply multiple logarithm laws together"},
            
            {"id": "LG_M05", "subtopic": "Simple Log Equations",
             "prompt": """Generate a question solving simple log equations.

Requirements: Equation like log_a x = b, find x.

Example: "Solve: log₃ x = 4"

Return JSON with conversion to exponential.""",
             "learning_objective": "Solve basic logarithmic equations"}
        ],
        "difficult": [
            {"id": "LG_D01", "subtopic": "Complex Log Equations",
             "prompt": """Generate a challenging logarithmic equation.

Requirements: Logs on both sides or log of expression with variable.

Example: "Solve: log₂(x + 3) = log₂ x + 1"

Return JSON with full working and check.""",
             "learning_objective": "Solve complex logarithmic equations"},
            
            {"id": "LG_D02", "subtopic": "Equations Using Laws",
             "prompt": """Generate an equation requiring law application first.

Requirements: Combine logs before solving.

Example: "Solve: log(x + 1) + log(x - 1) = log 8"

Return JSON with law application and solving.""",
             "learning_objective": "Solve equations by combining logarithms"},
            
            {"id": "LG_D03", "subtopic": "Change of Base",
             "prompt": """Generate a question about change of base formula.

Requirements: Convert log_a b to different base.

Example: "Express log₃ 7 in terms of log₁₀"

Return JSON with formula.""",
             "learning_objective": "Apply change of base formula"},
            
            {"id": "LG_D04", "subtopic": "Exponential Equations Using Logs",
             "prompt": """Generate an exponential equation solved using logs.

Requirements: Equation like 3^x = 20, use logs to solve.

Example: "Solve 5^x = 100, giving answer to 3 s.f."

Return JSON with log method.""",
             "learning_objective": "Use logarithms to solve exponential equations"},
            
            {"id": "LG_D05", "subtopic": "Applied Log Problems",
             "prompt": """Generate an application of logarithms.

Requirements: Real context (decibels, pH, compound interest, etc).

Example: "If $1000 grows to $1500 at 5% p.a. compound interest, find the time using logs"

Return JSON with practical application.""",
             "learning_objective": "Apply logarithms to real-world problems"}
        ]
    }
}

# Export for use in question generator - ALL 12 TOPICS (180 PROMPTS)
ALGEBRA_PROMPTS = [
    BASIC_ALGEBRAIC_EXPRESSIONS, 
    LINEAR_EQUATIONS, 
    FRACTIONS, 
    INDICES_AND_POWERS,
    QUADRATIC_EXPRESSIONS,
    ALGEBRAIC_FRACTIONS,
    INEQUALITIES,
    SIMULTANEOUS_EQUATIONS,
    FORMULAE,
    FUNCTIONS,
    SEQUENCES_AND_SERIES,
    LOGARITHMS
]

def get_prompt(topic: str, subtopic: str = None, difficulty: str = "medium") -> dict:
    """
    Retrieve a specific prompt by topic and difficulty.
    
    Args:
        topic: The main topic area
        subtopic: Optional specific subtopic
        difficulty: 'easy', 'medium', or 'difficult'
    
    Returns:
        A prompt dictionary or None if not found
    """
    for topic_data in ALGEBRA_PROMPTS:
        if topic_data["topic"].lower() == topic.lower():
            prompts = topic_data["prompts"].get(difficulty, [])
            if subtopic:
                for prompt in prompts:
                    if subtopic.lower() in prompt.get("subtopic", "").lower():
                        return prompt
            elif prompts:
                import random
                return random.choice(prompts)
    return None

def get_all_prompts_for_topic(topic: str) -> dict:
    """
    Get all prompts for a specific topic, organized by difficulty.
    
    Args:
        topic: The main topic area
    
    Returns:
        Dictionary with 'easy', 'medium', 'difficult' keys containing prompt lists
    """
    for topic_data in ALGEBRA_PROMPTS:
        if topic_data["topic"].lower() == topic.lower():
            return topic_data["prompts"]
    return {"easy": [], "medium": [], "difficult": []}

def get_learning_objectives(topic: str) -> list:
    """
    Get learning objectives for a specific topic.
    
    Args:
        topic: The main topic area
    
    Returns:
        List of learning objective strings
    """
    for topic_data in ALGEBRA_PROMPTS:
        if topic_data["topic"].lower() == topic.lower():
            return topic_data.get("learning_objectives", [])
    return []
