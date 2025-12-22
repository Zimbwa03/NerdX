import { MathTopicNotes } from './types';

export const setsNotes: Record<string, MathTopicNotes> = {
    'Sets': {
        topic: 'Sets',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Set theory deals with collections of objects. Understanding set notation and Venn diagrams is crucial for solving logic and probability problems.',
        sections: [
            {
                title: 'Set Notation',
                content: `**Set**: A well-defined collection of objects (elements).
- Defined by listing: $A = \\{1, 2, 3\\}$.
- Defined by description: $A = \\{x : x \\text{ is an integer}\\}$.

**Symbols**:
- $\\in$: Is an element of (e.g., $3 \\in A$).
- $\\notin$: Is not an element of.
- $\\xi$ or $\\mathscr{E}$: Universal set (contains all elements under consideration).
- $\\emptyset$ or $\\{\\}$: Empty set.
- $n(A)$: Number of elements in set $A$.
- $A \\subset B$: $A$ is a subset of $B$ (all elements of $A$ are in $B$).
- $A'$: Complement of $A$ (elements in $\\xi$ but NOT in $A$).`,
                worked_examples: [
                    {
                        question: 'Given $\\xi = \\{1, 2, 3, 4, 5, 6\\}$, $A = \\{2, 4, 6\\}$, $B = \\{1, 2, 3\\}$. Find $A\'$ and $n(B)$.',
                        steps: [
                            '$A\'$ contains elements in $\\xi$ not in $A$.',
                            '$A\' = \\{1, 3, 5\\}$.',
                            '$n(B)$ is the count of elements in $B$.',
                            '$n(B) = 3$.'
                        ],
                        final_answer: '$A\' = \\{1, 3, 5\\}, n(B) = 3$'
                    }
                ]
            },
            {
                title: 'Operations on Sets',
                content: `**Intersection** ($A \\cap B$): Elements in BOTH $A$ and $B$.
**Union** ($A \\cup B$): Elements in $A$ OR $B$ (or both).

**Properties**:
- $A \\cap A' = \\emptyset$
- $A \\cup A' = \\xi$
- $(A \\cup B)' = A' \\cap B'$ (De Morgan's Law)`,
                worked_examples: [
                    {
                        question: 'Use sets $A=\\{1,2,3,4\\}$ and $B=\\{3,4,5,6\\}$. Find $A \\cap B$ and $A \\cup B$.',
                        steps: [
                            'Intersection: Elements common to both.',
                            '$A \\cap B = \\{3, 4\\}$.',
                            'Union: Combine all unique elements.',
                            '$A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$.'
                        ],
                        final_answer: '$A \\cap B = \\{3, 4\\}, A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$'
                    }
                ]
            },
            {
                title: 'Venn Diagrams',
                content: `Used to visualize set relationships.
- Overlapping circles represent sets.
- The rectangle represents the Universal Set $\\xi$.
- Shade regions to represent set operations (e.g., $A \\cap B$ is the overlap).`,
                worked_examples: [
                    {
                        question: 'In a class of 30 students, 20 study History (H), 15 study Geography (G), and 8 study both. How many study neither?',
                        steps: [
                            'Use the formula: $n(H \\cup G) = n(H) + n(G) - n(H \\cap G)$.',
                            '$n(H \\cup G) = 20 + 15 - 8 = 27$.',
                            'This is the number of students studying at least one subject.',
                            'Number studying neither = Total - $n(H \\cup G)$.',
                            '$30 - 27 = 3$.'
                        ],
                        final_answer: '$3$ students'
                    }
                ]
            }
        ],
        key_points: [
            '$\\cap$ means AND (overlap).',
            '$\\cup$ means OR (combine).',
            '$n(A)$ is the count.',
            '$A \\cup B = n(A) + n(B) - n(A \\cap B)$.'
        ],
        exam_tips: [
            'For word problems, fill in the "both" (intersection) section of the Venn diagram first.',
            'Remember to label the box as $\\xi$ and write the count of "neither" outside the circles.'
        ],
        visual_descriptions: [
            'Venn diagram shading $A \\cap B$.',
            'Venn diagram shading $A \\cup B$.',
            'Venn diagram shading $A\'$.'
        ]
    }
};

export const setsTopics = Object.keys(setsNotes);
