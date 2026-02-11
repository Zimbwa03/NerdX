import { MathTopicNotes } from './types';

export const setsNotes: Record<string, MathTopicNotes> = {
    'Sets': {
        topic: 'Sets',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Set theory deals with well-defined collections of objects (elements). This topic covers: set notation (listing and set-builder form), symbols ($\\in$, $\\subset$, $\\cup$, $\\cap$, complement), the universal set and empty set; operations on sets (union, intersection, complement) and their properties including De Morgan\'s laws; Venn diagrams for two and three sets, and the inclusion–exclusion formula $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$; solving word problems by filling the diagram or using formulas. Sets are used in probability and logic.',
        sections: [
            {
                title: '1. Set Notation and Symbols',
                content: `**Set**: A well-defined collection of distinct objects (elements). The order does not matter, and we do not repeat elements.

**Listing (roster) method**: $A = \\{1, 2, 3\\}$, $B = \\{2, 4, 6, 8\\}$.

**Set-builder notation**: $A = \\{x : x \\text{ is an even number between 1 and 10}\\}$ or $A = \\{x \\in \\mathbb{N} : x \\text{ is even}, \\, 1 \\leq x \\leq 10\\}$. Read as "the set of $x$ such that ...".

**Important symbols**:
- $\\in$ (element of): $3 \\in A$ means 3 is in set $A$.
- $\\notin$ (not in): $5 \\notin A$.
- $\\xi$ or $\\mathscr{E}$: **Universal set** — contains all elements under consideration.
- $\\emptyset$ or $\\{\\}$: **Empty set** — has no elements; $n(\\emptyset) = 0$.
- $n(A)$: **Number of elements** in set $A$ (cardinality).
- $A \\subseteq B$: $A$ is a **subset** of $B$ (every element of $A$ is in $B$). $A \\subset B$ sometimes means "proper subset" (subset but not equal).
- $A'$ or $A^c$: **Complement** of $A$ — elements in $\\xi$ that are **not** in $A$. So $A \\cup A' = \\xi$ and $A \\cap A' = \\emptyset$.`,
                worked_examples: [
                    {
                        question: 'Given $\\xi = \\{1, 2, 3, 4, 5, 6\\}$, $A = \\{2, 4, 6\\}$, $B = \\{1, 2, 3\\}$. Find $A\'$ and $n(B)$.',
                        steps: [
                            '$A\'$ = elements in $\\xi$ that are not in $A$.',
                            'So $A\' = \\{1, 3, 5\\}$.',
                            '$n(B)$ = number of elements in $B$ = 3.'
                        ],
                        final_answer: '$A\' = \\{1, 3, 5\\}$, $n(B) = 3$'
                    },
                    {
                        question: 'List the elements of $P = \\{x : x \\in \\mathbb{Z}, \\, -2 \\leq x < 2\\}$.',
                        steps: [
                            'Integers $x$ such that $x \\geq -2$ and $x < 2$.',
                            'So $x = -2, -1, 0, 1$.',
                            'Hence $P = \\{-2, -1, 0, 1\\}$.'
                        ],
                        final_answer: '$P = \\{-2, -1, 0, 1\\}$'
                    },
                    {
                        question: 'If $\\xi = \\{1,2,3,4,5\\}$ and $A = \\{1,3,5\\}$, find $n(A\')$.',
                        steps: [
                            '$A\' = \\{2, 4\\}$ (elements of $\\xi$ not in $A$).',
                            '$n(A\') = 2$.'
                        ],
                        final_answer: '$n(A\') = 2$'
                    }
                ]
            },
            {
                title: '2. Operations on Sets',
                content: `**Union** $A \\cup B$: elements that are in $A$ **or** in $B$ (or both). "OR" in the inclusive sense.

**Intersection** $A \\cap B$: elements that are in **both** $A$ and $B$. "AND".

**Complement** $A'$: (with respect to $\\xi$) elements not in $A$.

**Key formulas**:
- $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$ (inclusion–exclusion). We subtract $n(A \\cap B)$ because those elements are counted twice if we add $n(A) + n(B)$.
- $A \\cap A' = \\emptyset$, $A \\cup A' = \\xi$.
- **De Morgan\'s laws**: $(A \\cup B)' = A' \\cap B'$ and $(A \\cap B)' = A' \\cup B'$.`,
                worked_examples: [
                    {
                        question: 'Given $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5, 6\\}$, find $A \\cap B$ and $A \\cup B$.',
                        steps: [
                            'Intersection: elements in both $A$ and $B$: $3$ and $4$.',
                            '$A \\cap B = \\{3, 4\\}$.',
                            'Union: all elements from both sets, no repeats: $\\{1, 2, 3, 4, 5, 6\\}$.'
                        ],
                        final_answer: '$A \\cap B = \\{3, 4\\}$, $A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$'
                    },
                    {
                        question: 'Verify $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$ for $A = \\{1,2,3\\}$, $B = \\{2,3,4\\}$ with $\\xi = \\{1,2,3,4,5\\}$.',
                        steps: [
                            '$A \\cup B = \\{1,2,3,4\\}$, so $n(A \\cup B) = 4$.',
                            '$n(A) = 3$, $n(B) = 3$, $A \\cap B = \\{2,3\\}$ so $n(A \\cap B) = 2$.',
                            'RHS: $3 + 3 - 2 = 4$ $\\checkmark$.'
                        ],
                        final_answer: 'Formula holds: $4 = 3 + 3 - 2$'
                    },
                    {
                        question: 'If $n(A) = 12$, $n(B) = 9$ and $n(A \\cap B) = 4$, find $n(A \\cup B)$.',
                        steps: [
                            'Use $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
                            '$n(A \\cup B) = 12 + 9 - 4 = 17$.'
                        ],
                        final_answer: '$n(A \\cup B) = 17$'
                    }
                ]
            },
            {
                title: '3. Venn Diagrams',
                content: `**Venn diagrams**: Rectangles represent the universal set $\\xi$; circles (or loops) represent sets. Overlapping regions show intersection.

**Strategy for word problems**:
1. Identify the universal set and the sets involved.
2. Fill in the **intersection** ("both") first if known.
3. Work out the "only A" and "only B" parts using the given totals.
4. "Neither" = outside all circles but inside $\\xi$.

**Formula**: For two sets, $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$. So "at least one" = union; "neither" = total $ - n(A \\cup B)$.`,
                worked_examples: [
                    {
                        question: 'In a class of 30, 20 study History (H), 15 study Geography (G), and 8 study both. How many study neither?',
                        steps: [
                            'Number studying at least one: $n(H \\cup G) = n(H) + n(G) - n(H \\cap G) = 20 + 15 - 8 = 27$.',
                            'Number studying neither = total $ - n(H \\cup G) = 30 - 27 = 3$.'
                        ],
                        final_answer: '$3$ students study neither'
                    },
                    {
                        question: 'In a group of 50 people, 30 like tea (T), 25 like coffee (C), and 10 like both. How many like only tea?',
                        steps: [
                            'People who like both: $n(T \\cap C) = 10$.',
                            'People who like tea (including both) = 30, so "tea only" = $30 - 10 = 20$.'
                        ],
                        final_answer: '$20$ like only tea'
                    },
                    {
                        question: '$\\xi = \\{1,2,\\ldots,10\\}$, $A = \\{2,4,6,8\\}$, $B = \\{3,6,9\\}$. Find $n(A \\cap B)$ and $n(A \\cup B)$.',
                        steps: [
                            '$A \\cap B$ = elements in both: only $6$. So $n(A \\cap B) = 1$.',
                            '$n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 4 + 3 - 1 = 6$.'
                        ],
                        final_answer: '$n(A \\cap B) = 1$, $n(A \\cup B) = 6$'
                    }
                ]
            }
        ],
        key_points: [
            '$\\cap$ = intersection (AND, elements in both). $\\cup$ = union (OR, elements in either or both).',
            '$A\'$ = complement (elements in $\\xi$ not in $A$). $n(\\emptyset) = 0$.',
            'Inclusion–exclusion: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
            'De Morgan: $(A \\cup B)\' = A\' \\cap B\'$ and $(A \\cap B)\' = A\' \\cup B\'$.',
            'In Venn word problems, fill the "both" region first, then work out "only A" and "only B".'
        ],
        exam_tips: [
            'Always state the universal set $\\xi$ when using complement.',
            'For "neither", use: neither = total $ - n(A \\cup B)$.',
            'Draw a Venn diagram and label each region with a number or expression before answering.',
            'Check: sum of all regions in the diagram should equal $n(\\xi)$.',
            'Use the app\'s 1000+ practice questions to reinforce set problems and Venn diagrams.'
        ],
        visual_descriptions: [
            'Venn diagram: rectangle (universal set) with two overlapping circles (A and B); region where they overlap is $A \\cap B$.',
            'Venn diagram with region for $A\'$ shaded (everything outside circle A but inside the rectangle).',
            'Venn diagram with three overlapping circles for sets A, B, C and the eight regions.'
        ]
    }
};

export const setsTopics = Object.keys(setsNotes);
