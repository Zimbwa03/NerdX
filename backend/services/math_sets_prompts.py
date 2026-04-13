#!/usr/bin/env python3
"""
Mathematics Sets Question Prompts
180 Unique Prompts for ZIMSEC O-Level Mathematics
Organized by Subtopic and Difficulty Level
"""

# ============================================================================
# TOPIC: SETS - SUBTOPIC 1: SET NOTATION AND SYMBOLS (15 Prompts)
# ============================================================================

SET_NOTATION = {
    "subtopic": "Set Notation and Symbols",
    "description": "Understanding set notation and symbols",
    "prompts": {
        "easy": [
            {"id": "ST_SN_E01", "subtopic": "Listing Elements",
             "prompt": """Generate a ZIMSEC question about listing set elements.

Example: "List the elements of set A = {factors of 12}"

Return JSON format.""",
             "learning_objective": "List elements of a set"},
            
            {"id": "ST_SN_E02", "subtopic": "Set Membership Symbol",
             "prompt": """Generate a question about the membership symbol ∈.

Example: "State whether 5 ∈ {2, 4, 6, 8} is true or false"

Return JSON format.""",
             "learning_objective": "Use the membership symbol correctly"},
            
            {"id": "ST_SN_E03", "subtopic": "Basic Set Notation",
             "prompt": """Generate a question about reading set notation.

Example: "Write in words: A = {1, 2, 3, 4, 5}"

Return JSON format.""",
             "learning_objective": "Read and interpret set notation"},
            
            {"id": "ST_SN_E04", "subtopic": "Number of Elements",
             "prompt": """Generate a question about counting elements n(A).

Example: "If A = {a, b, c, d, e}, find n(A)"

Return JSON format.""",
             "learning_objective": "Count elements in a set"},
            
            {"id": "ST_SN_E05", "subtopic": "Set Description",
             "prompt": """Generate a question describing sets in words or symbols.

Example: "Describe the set {2, 4, 6, 8, 10} in words"

Return JSON format.""",
             "learning_objective": "Describe sets in different forms"}
        ],
        "medium": [
            {"id": "ST_SN_M01", "subtopic": "Set Builder Notation",
             "prompt": """Generate a question about set builder notation.

Example: "Write {x : x is an even number less than 10} as a list"

Return JSON format.""",
             "learning_objective": "Use set builder notation"},
            
            {"id": "ST_SN_M02", "subtopic": "Equal Sets",
             "prompt": """Generate a question about equal sets.

Example: "Are A = {1, 2, 3} and B = {3, 1, 2} equal? Explain."

Return JSON format.""",
             "learning_objective": "Determine if sets are equal"},
            
            {"id": "ST_SN_M03", "subtopic": "Universal Set Symbol",
             "prompt": """Generate a question about the universal set ε.

Example: "If ε = {1, 2, 3, ..., 10} and A = {odd numbers}, list A"

Return JSON format.""",
             "learning_objective": "Work with universal sets"},
            
            {"id": "ST_SN_M04", "subtopic": "Complement Notation",
             "prompt": """Generate a question about complement notation A'.

Example: "If ε = {1,2,3,4,5,6} and A = {1,3,5}, find A'"

Return JSON format.""",
             "learning_objective": "Find complements of sets"},
            
            {"id": "ST_SN_M05", "subtopic": "Converting Between Forms",
             "prompt": """Generate a question converting set descriptions.

Example: "Write {x : x ∈ Z, -2 ≤ x ≤ 3} as a list"

Return JSON format.""",
             "learning_objective": "Convert between set descriptions"}
        ],
        "difficult": [
            {"id": "ST_SN_D01", "subtopic": "Complex Set Builder",
             "prompt": """Generate a question with complex set builder notation.

Example: "Describe {x : x = 2n, n ∈ N, n ≤ 5} in list form"

Return JSON format.""",
             "learning_objective": "Interpret complex set builder notation"},
            
            {"id": "ST_SN_D02", "subtopic": "Power Sets",
             "prompt": """Generate a question about power sets.

Example: "List all subsets of {a, b}. How many are there?"

Return JSON format.""",
             "learning_objective": "Understand and list power sets"},
            
            {"id": "ST_SN_D03", "subtopic": "Interval Notation",
             "prompt": """Generate a question using interval notation with sets.

Example: "If A = {x : 0 < x ≤ 5, x ∈ R}, represent on number line"

Return JSON format.""",
             "learning_objective": "Use interval notation for sets"},
            
            {"id": "ST_SN_D04", "subtopic": "Multiple Conditions",
             "prompt": """Generate a question with multiple conditions in set builder.

Example: "List: {x : x is prime, x < 20, x > 10}"

Return JSON format.""",
             "learning_objective": "Apply multiple conditions in set definitions"},
            
            {"id": "ST_SN_D05", "subtopic": "Set Problems",
             "prompt": """Generate a set notation word problem.

Example: "Express in set notation: The set of all students who study both Math and Physics"

Return JSON format.""",
             "learning_objective": "Express real situations using set notation"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 2: TYPES OF SETS (15 Prompts)
# ============================================================================

TYPES_OF_SETS = {
    "subtopic": "Types of Sets",
    "description": "Finite, infinite, empty, universal, and equivalent sets",
    "prompts": {
        "easy": [
            {"id": "ST_TS_E01", "subtopic": "Empty Set",
             "prompt": """Generate a question about the empty set.

Example: "What is the empty set? Give an example."

Return JSON format.""",
             "learning_objective": "Understand the empty set concept"},
            
            {"id": "ST_TS_E02", "subtopic": "Finite Sets",
             "prompt": """Generate a question about finite sets.

Example: "Is the set of days in a week finite or infinite? Why?"

Return JSON format.""",
             "learning_objective": "Identify finite sets"},
            
            {"id": "ST_TS_E03", "subtopic": "Infinite Sets",
             "prompt": """Generate a question about infinite sets.

Example: "Is the set of natural numbers finite or infinite?"

Return JSON format.""",
             "learning_objective": "Identify infinite sets"},
            
            {"id": "ST_TS_E04", "subtopic": "Universal Set",
             "prompt": """Generate a question about the universal set.

Example: "Define universal set and give an example"

Return JSON format.""",
             "learning_objective": "Understand universal sets"},
            
            {"id": "ST_TS_E05", "subtopic": "Singleton Set",
             "prompt": """Generate a question about singleton sets.

Example: "What is a singleton set? Give an example."

Return JSON format.""",
             "learning_objective": "Identify singleton sets"}
        ],
        "medium": [
            {"id": "ST_TS_M01", "subtopic": "Equivalent Sets",
             "prompt": """Generate a question about equivalent sets.

Example: "Are A = {1, 2, 3} and B = {a, b, c} equivalent? Explain."

Return JSON format.""",
             "learning_objective": "Identify equivalent sets"},
            
            {"id": "ST_TS_M02", "subtopic": "Disjoint Sets",
             "prompt": """Generate a question about disjoint sets.

Example: "Are {even numbers} and {odd numbers} disjoint?"

Return JSON format.""",
             "learning_objective": "Identify disjoint sets"},
            
            {"id": "ST_TS_M03", "subtopic": "Overlapping Sets",
             "prompt": """Generate a question about overlapping sets.

Example: "Give an example of two overlapping sets"

Return JSON format.""",
             "learning_objective": "Distinguish overlapping from disjoint sets"},
            
            {"id": "ST_TS_M04", "subtopic": "Comparing Set Types",
             "prompt": """Generate a question comparing set types.

Example: "Classify each: {}, {1,2,3}, {multiples of 2}"

Return JSON format.""",
             "learning_objective": "Classify different types of sets"},
            
            {"id": "ST_TS_M05", "subtopic": "Properties of Empty Set",
             "prompt": """Generate a question about empty set properties.

Example: "Is {} a subset of every set? Explain."

Return JSON format.""",
             "learning_objective": "Understand properties of the empty set"}
        ],
        "difficult": [
            {"id": "ST_TS_D01", "subtopic": "Cardinality Comparison",
             "prompt": """Generate a question comparing cardinalities.

Example: "If n(A) = 5 and A and B are equivalent, what is n(B)?"

Return JSON format.""",
             "learning_objective": "Compare cardinalities of sets"},
            
            {"id": "ST_TS_D02", "subtopic": "Set Relationships",
             "prompt": """Generate a question about relationships between set types.

Example: "Can two disjoint sets be equivalent? Give an example."

Return JSON format.""",
             "learning_objective": "Analyze relationships between set types"},
            
            {"id": "ST_TS_D03", "subtopic": "Complex Classification",
             "prompt": """Generate a question requiring detailed set classification.

Example: "For A = {x : x² = 4}, classify A (empty, finite, infinite)"

Return JSON format.""",
             "learning_objective": "Classify sets from complex descriptions"},
            
            {"id": "ST_TS_D04", "subtopic": "Countably Infinite",
             "prompt": """Generate a question about countable infinity.

Example: "Is the set of integers countable? Explain briefly."

Return JSON format.""",
             "learning_objective": "Understand countable vs uncountable infinity"},
            
            {"id": "ST_TS_D05", "subtopic": "Set Type Proofs",
             "prompt": """Generate a question proving set properties.

Example: "Prove that if A ∩ B = A, then A ⊆ B"

Return JSON format.""",
             "learning_objective": "Prove statements about set types"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 3: SET OPERATIONS - UNION (15 Prompts)
# ============================================================================

SET_OPERATIONS_UNION = {
    "subtopic": "Set Operations - Union and Intersection",
    "description": "Union (∪) and Intersection (∩) of sets",
    "prompts": {
        "easy": [
            {"id": "ST_OP_E01", "subtopic": "Simple Union",
             "prompt": """Generate a question about union of two small sets.

Example: "Find A ∪ B if A = {1, 2, 3} and B = {3, 4, 5}"

Return JSON format.""",
             "learning_objective": "Find union of two sets"},
            
            {"id": "ST_OP_E02", "subtopic": "Simple Intersection",
             "prompt": """Generate a question about intersection of two sets.

Example: "Find A ∩ B if A = {1, 2, 3, 4} and B = {3, 4, 5, 6}"

Return JSON format.""",
             "learning_objective": "Find intersection of two sets"},
            
            {"id": "ST_OP_E03", "subtopic": "Union Symbol",
             "prompt": """Generate a question about the union symbol ∪.

Example: "What does A ∪ B mean?"

Return JSON format.""",
             "learning_objective": "Understand union symbol meaning"},
            
            {"id": "ST_OP_E04", "subtopic": "Intersection Symbol",
             "prompt": """Generate a question about intersection symbol ∩.

Example: "What does A ∩ B represent?"

Return JSON format.""",
             "learning_objective": "Understand intersection symbol meaning"},
            
            {"id": "ST_OP_E05", "subtopic": "Counting After Operations",
             "prompt": """Generate a question counting after set operations.

Example: "If A = {a,b,c} and B = {c,d}, find n(A ∪ B)"

Return JSON format.""",
             "learning_objective": "Count elements after set operations"}
        ],
        "medium": [
            {"id": "ST_OP_M01", "subtopic": "Three Set Union",
             "prompt": """Generate a question with union of three sets.

Example: "Find A ∪ B ∪ C if A={1,2}, B={2,3}, C={3,4}"

Return JSON format.""",
             "learning_objective": "Find union of three sets"},
            
            {"id": "ST_OP_M02", "subtopic": "Three Set Intersection",
             "prompt": """Generate a question with intersection of three sets.

Example: "Find A ∩ B ∩ C if A={1,2,3}, B={2,3,4}, C={3,4,5}"

Return JSON format.""",
             "learning_objective": "Find intersection of three sets"},
            
            {"id": "ST_OP_M03", "subtopic": "Combined Operations",
             "prompt": """Generate a question combining union and intersection.

Example: "Find (A ∪ B) ∩ C given A={1,2}, B={2,3}, C={2,4}"

Return JSON format.""",
             "learning_objective": "Combine union and intersection operations"},
            
            {"id": "ST_OP_M04", "subtopic": "Complement and Operations",
             "prompt": """Generate a question with complement and union/intersection.

Example: "Find A' ∩ B if ε={1,2,3,4,5}, A={1,2}, B={2,3,4}"

Return JSON format.""",
             "learning_objective": "Combine complement with other operations"},
            
            {"id": "ST_OP_M05", "subtopic": "Operation Properties",
             "prompt": """Generate a question about union/intersection properties.

Example: "Show that A ∩ B = B ∩ A using A={1,2,3} and B={2,3,4}"

Return JSON format.""",
             "learning_objective": "Verify properties of set operations"}
        ],
        "difficult": [
            {"id": "ST_OP_D01", "subtopic": "Set Difference",
             "prompt": """Generate a question about set difference.

Example: "Find A - B (A minus B) if A={1,2,3,4} and B={3,4,5}"

Return JSON format.""",
             "learning_objective": "Calculate set difference"},
            
            {"id": "ST_OP_D02", "subtopic": "Symmetric Difference",
             "prompt": """Generate a question about symmetric difference.

Example: "Find A △ B = (A-B) ∪ (B-A) for A={1,2,3}, B={2,3,4}"

Return JSON format.""",
             "learning_objective": "Calculate symmetric difference"},
            
            {"id": "ST_OP_D03", "subtopic": "Complex Operations",
             "prompt": """Generate a complex set operation question.

Example: "Find (A ∪ B)' ∩ C given ε, A, B, C"

Return JSON format.""",
             "learning_objective": "Evaluate complex set expressions"},
            
            {"id": "ST_OP_D04", "subtopic": "Unknown Set Elements",
             "prompt": """Generate a question finding unknown elements.

Example: "If A ∪ B = {1,2,3,4} and A ∩ B = {2}, A = {1,2,3}, find B"

Return JSON format.""",
             "learning_objective": "Deduce set elements from operations"},
            
            {"id": "ST_OP_D05", "subtopic": "Operation Proofs",
             "prompt": """Generate a question proving set operation properties.

Example: "Prove A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) using example"

Return JSON format.""",
             "learning_objective": "Verify distributive laws for sets"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 4: VENN DIAGRAMS - TWO SETS (15 Prompts)
# ============================================================================

VENN_TWO_SETS = {
    "subtopic": "Venn Diagrams - Two Sets",
    "description": "Representing and interpreting two-set Venn diagrams",
    "prompts": {
        "easy": [
            {"id": "ST_V2_E01", "subtopic": "Drawing Basic Venn",
             "prompt": """Generate a question about drawing a two-set Venn diagram.

Example: "Draw a Venn diagram for A = {1,2,3} and B = {2,3,4}"

Return JSON describing the diagram.""",
             "learning_objective": "Draw two-set Venn diagrams"},
            
            {"id": "ST_V2_E02", "subtopic": "Reading Venn Diagrams",
             "prompt": """Generate a question reading information from Venn.

Example: "From a Venn diagram where A∩B has 3 elements, what does this mean?"

Return JSON format.""",
             "learning_objective": "Interpret Venn diagram regions"},
            
            {"id": "ST_V2_E03", "subtopic": "Placing Elements",
             "prompt": """Generate a question placing elements in Venn diagram.

Example: "Place 1,2,3,4,5 in Venn for A={odd} B={<4}"

Return JSON format.""",
             "learning_objective": "Place elements correctly in Venn diagrams"},
            
            {"id": "ST_V2_E04", "subtopic": "Identifying Regions",
             "prompt": """Generate a question identifying Venn diagram regions.

Example: "In a two-set Venn, shade the region A ∩ B"

Return JSON describing the region.""",
             "learning_objective": "Identify and shade specific regions"},
            
            {"id": "ST_V2_E05", "subtopic": "Counting from Venn",
             "prompt": """Generate a question counting elements from Venn.

Example: "From the Venn, find n(A ∪ B)"

Return JSON format.""",
             "learning_objective": "Count elements using Venn diagrams"}
        ],
        "medium": [
            {"id": "ST_V2_M01", "subtopic": "Word Problems - Two Sets",
             "prompt": """Generate a Venn diagram word problem with two sets.

Example: "30 students: 18 play soccer, 15 play cricket, 8 play both. How many play neither?"

Return JSON with Venn diagram approach.""",
             "learning_objective": "Solve two-set Venn word problems"},
            
            {"id": "ST_V2_M02", "subtopic": "Finding Unknown Regions",
             "prompt": """Generate a question finding unknown values in Venn.

Example: "n(A)=20, n(B)=15, n(A∩B)=8, n(ε)=40. Find n(A∪B)' "

Return JSON format.""",
             "learning_objective": "Calculate unknown regions in Venn diagrams"},
            
            {"id": "ST_V2_M03", "subtopic": "Only A / Only B",
             "prompt": """Generate a question about 'only A' and 'only B' regions.

Example: "From Venn, find n(A only) if n(A)=12, n(A∩B)=5"

Return JSON format.""",
             "learning_objective": "Calculate exclusive regions"},
            
            {"id": "ST_V2_M04", "subtopic": "Shading Complex Regions",
             "prompt": """Generate a question shading complex regions.

Example: "Shade the region representing A' ∩ B"

Return JSON describing the shading.""",
             "learning_objective": "Shade complex set expressions"},
            
            {"id": "ST_V2_M05", "subtopic": "Using n(A∪B) Formula",
             "prompt": """Generate a question using the union formula.

Example: "Use n(A∪B) = n(A) + n(B) - n(A∩B) to solve problem"

Return JSON format.""",
             "learning_objective": "Apply the union counting formula"}
        ],
        "difficult": [
            {"id": "ST_V2_D01", "subtopic": "Complex Word Problems",
             "prompt": """Generate a complex two-set Venn word problem.

Example: "In a survey, 60% like tea, 40% like coffee, 25% like both. What % like neither?"

Return JSON with algebraic approach.""",
             "learning_objective": "Solve percentage-based Venn problems"},
            
            {"id": "ST_V2_D02", "subtopic": "Minimum/Maximum Problems",
             "prompt": """Generate a min/max Venn diagram problem.

Example: "n(ε)=50, n(A)=30, n(B)=35. Find minimum possible n(A∩B)"

Return JSON format.""",
             "learning_objective": "Find minimum/maximum intersection values"},
            
            {"id": "ST_V2_D03", "subtopic": "Algebraic Venn Problems",
             "prompt": """Generate a Venn problem with algebraic expressions.

Example: "n(A only)=x, n(B only)=x+5, n(A∩B)=10, n(ε)=45. Find x."

Return JSON format.""",
             "learning_objective": "Solve Venn problems with algebra"},
            
            {"id": "ST_V2_D04", "subtopic": "Ratio Problems",
             "prompt": """Generate a Venn problem involving ratios.

Example: "Ratio of A only to B only is 2:3. If n(A∩B)=12 and n(A)=20, find n(B)"

Return JSON format.""",
             "learning_objective": "Solve ratio-based Venn problems"},
            
            {"id": "ST_V2_D05", "subtopic": "Real Context Applications",
             "prompt": """Generate a real-world Venn application.

Example: "Market research: Find optimal advertising strategy using Venn data"

Return JSON format.""",
             "learning_objective": "Apply Venn diagrams to real contexts"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 5: VENN DIAGRAMS - THREE SETS (15 Prompts)
# ============================================================================

VENN_THREE_SETS = {
    "subtopic": "Venn Diagrams - Three Sets",
    "description": "Representing and interpreting three-set Venn diagrams",
    "prompts": {
        "easy": [
            {"id": "ST_V3_E01", "subtopic": "Drawing Three-Set Venn",
             "prompt": """Generate a question about drawing three-set Venn.

Example: "Draw a Venn diagram showing sets A, B, and C"

Return JSON describing the structure.""",
             "learning_objective": "Draw three-set Venn diagrams"},
            
            {"id": "ST_V3_E02", "subtopic": "Identifying 8 Regions",
             "prompt": """Generate a question about the 8 regions.

Example: "How many distinct regions are in a three-set Venn diagram?"

Return JSON format.""",
             "learning_objective": "Understand three-set Venn structure"},
            
            {"id": "ST_V3_E03", "subtopic": "Central Region",
             "prompt": """Generate a question about A ∩ B ∩ C.

Example: "What region represents elements in all three sets?"

Return JSON format.""",
             "learning_objective": "Identify the central intersection"},
            
            {"id": "ST_V3_E04", "subtopic": "Placing Elements",
             "prompt": """Generate a question placing elements in three-set Venn.

Example: "Place 1-9 in Venn for A={odd}, B={<5}, C={prime}"

Return JSON format.""",
             "learning_objective": "Correctly place elements in three-set Venn"},
            
            {"id": "ST_V3_E05", "subtopic": "Basic Reading",
             "prompt": """Generate a question reading three-set Venn.

Example: "From the Venn, list elements in A ∩ B but not in C"

Return JSON format.""",
             "learning_objective": "Read three-set Venn diagrams"}
        ],
        "medium": [
            {"id": "ST_V3_M01", "subtopic": "Three-Set Word Problem",
             "prompt": """Generate a three-set Venn word problem.

Example: "100 students: 50 take Math, 45 Science, 40 English. 20 take all three. ..."

Return JSON with systematic approach.""",
             "learning_objective": "Solve three-set Venn word problems"},
            
            {"id": "ST_V3_M02", "subtopic": "Finding Central Value",
             "prompt": """Generate a question finding n(A ∩ B ∩ C).

Example: "Given region values, find how many are in all three sets"

Return JSON format.""",
             "learning_objective": "Calculate the central intersection"},
            
            {"id": "ST_V3_M03", "subtopic": "Filling Venn Systematically",
             "prompt": """Generate a question requiring systematic Venn filling.

Example: "Start from center outward to complete this Venn..."

Return JSON with step-by-step approach.""",
             "learning_objective": "Fill Venn diagrams systematically"},
            
            {"id": "ST_V3_M04", "subtopic": "At Least Two Sets",
             "prompt": """Generate a question about 'at least two' sets.

Example: "Find how many elements are in at least two of the sets"

Return JSON format.""",
             "learning_objective": "Calculate 'at least' regions"},
            
            {"id": "ST_V3_M05", "subtopic": "Exactly One Set",
             "prompt": """Generate a question about 'exactly one' set.

Example: "Find n(exactly one of A, B, C)"

Return JSON format.""",
             "learning_objective": "Calculate 'exactly one' regions"}
        ],
        "difficult": [
            {"id": "ST_V3_D01", "subtopic": "Complex Three-Set Problem",
             "prompt": """Generate a complex three-set word problem.

Example: "Survey with multiple conditions and percentages for three categories"

Return JSON with full working.""",
             "learning_objective": "Solve complex three-set problems"},
            
            {"id": "ST_V3_D02", "subtopic": "Algebraic Three-Set",
             "prompt": """Generate an algebraic three-set problem.

Example: "Given expressions for regions, find unknown values"

Return JSON format.""",
             "learning_objective": "Solve three-set problems algebraically"},
            
            {"id": "ST_V3_D03", "subtopic": "Three-Set Formula",
             "prompt": """Generate a question using the three-set union formula.

Example: "Use n(A∪B∪C) = n(A)+n(B)+n(C)-n(A∩B)-n(A∩C)-n(B∩C)+n(A∩B∩C)"

Return JSON format.""",
             "learning_objective": "Apply three-set counting formula"},
            
            {"id": "ST_V3_D04", "subtopic": "None of Three",
             "prompt": """Generate a question finding 'none of the three'.

Example: "In survey of 150, given data for three choices, find those choosing none"

Return JSON format.""",
             "learning_objective": "Calculate complement of three-set union"},
            
            {"id": "ST_V3_D05", "subtopic": "Real World Three-Set",
             "prompt": """Generate a real-world three-set application.

Example: "Market analysis with three product categories"

Return JSON format.""",
             "learning_objective": "Apply three-set Venn to real situations"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 6: SUBSETS (15 Prompts)
# ============================================================================

SUBSETS = {
    "subtopic": "Subsets and Proper Subsets",
    "description": "Understanding ⊂ and ⊆ relationships",
    "prompts": {
        "easy": [
            {"id": "ST_SS_E01", "subtopic": "Subset Definition",
             "prompt": """Generate a question defining subsets.

Example: "What does A ⊆ B mean?"

Return JSON format.""",
             "learning_objective": "Define subset relationship"},
            
            {"id": "ST_SS_E02", "subtopic": "Identifying Subsets",
             "prompt": """Generate a question identifying if one set is subset of another.

Example: "Is {1, 2} ⊆ {1, 2, 3, 4}? Explain."

Return JSON format.""",
             "learning_objective": "Identify subset relationships"},
            
            {"id": "ST_SS_E03", "subtopic": "Listing Subsets",
             "prompt": """Generate a question listing all subsets.

Example: "List all subsets of {a, b}"

Return JSON format.""",
             "learning_objective": "List all subsets of a set"},
            
            {"id": "ST_SS_E04", "subtopic": "Proper Subsets",
             "prompt": """Generate a question about proper subsets.

Example: "What is a proper subset? Is {1,2} a proper subset of {1,2}?"

Return JSON format.""",
             "learning_objective": "Distinguish subsets from proper subsets"},
            
            {"id": "ST_SS_E05", "subtopic": "Subset Symbols",
             "prompt": """Generate a question about ⊂ vs ⊆ symbols.

Example: "What is the difference between ⊂ and ⊆?"

Return JSON format.""",
             "learning_objective": "Use subset symbols correctly"}
        ],
        "medium": [
            {"id": "ST_SS_M01", "subtopic": "Counting Subsets",
             "prompt": """Generate a question about number of subsets.

Example: "How many subsets does {1, 2, 3, 4} have?"

Return JSON with formula 2^n.""",
             "learning_objective": "Calculate number of subsets"},
            
            {"id": "ST_SS_M02", "subtopic": "Counting Proper Subsets",
             "prompt": """Generate a question counting proper subsets.

Example: "How many proper subsets does {a, b, c} have?"

Return JSON with formula 2^n - 1.""",
             "learning_objective": "Calculate number of proper subsets"},
            
            {"id": "ST_SS_M03", "subtopic": "Subset Relations Between Number Sets",
             "prompt": """Generate a question about subset relations in number sets.

Example: "Is ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ true? Explain."

Return JSON format.""",
             "learning_objective": "Understand number set hierarchy"},
            
            {"id": "ST_SS_M04", "subtopic": "Subsets of Given Size",
             "prompt": """Generate a question about subsets of specific size.

Example: "How many 2-element subsets does {1, 2, 3, 4} have?"

Return JSON using combinations.""",
             "learning_objective": "Count subsets of specific size"},
            
            {"id": "ST_SS_M05", "subtopic": "Subset Problems",
             "prompt": """Generate a subset word problem.

Example: "List all even subsets (subsets with even number of elements)"

Return JSON format.""",
             "learning_objective": "Solve subset-related problems"}
        ],
        "difficult": [
            {"id": "ST_SS_D01", "subtopic": "Power Set Cardinality",
             "prompt": """Generate a question about power set size.

Example: "If |P(A)| = 32, find |A|"

Return JSON with logarithm approach.""",
             "learning_objective": "Work with power set cardinality"},
            
            {"id": "ST_SS_D02", "subtopic": "Subset Proofs",
             "prompt": """Generate a question proving subset relationships.

Example: "Prove that if A ⊆ B and B ⊆ C then A ⊆ C"

Return JSON format.""",
             "learning_objective": "Prove subset properties"},
            
            {"id": "ST_SS_D03", "subtopic": "Element vs Subset",
             "prompt": """Generate a question distinguishing ∈ from ⊆.

Example: "Is {1} ∈ {1, 2, 3} or {1} ⊆ {1, 2, 3}? Explain both."

Return JSON format.""",
             "learning_objective": "Distinguish membership from subset relations"},
            
            {"id": "ST_SS_D04", "subtopic": "Complex Subset Relations",
             "prompt": """Generate a complex subset problem.

Example: "If A ⊂ B, B ⊂ C, n(A)=3, n(C)=10, find possible values of n(B)"

Return JSON format.""",
             "learning_objective": "Analyze complex subset relationships"},
            
            {"id": "ST_SS_D05", "subtopic": "Set Equality Proof",
             "prompt": """Generate a question proving set equality using subsets.

Example: "Prove A = B by showing A ⊆ B and B ⊆ A"

Return JSON format.""",
             "learning_objective": "Prove set equality using subset method"}
        ]
    }
}

# ============================================================================
# SUBTOPICS 7-12: Additional Set Topics (Structure mirrors above)
# ============================================================================

SHADING_VENN = {
    "subtopic": "Shading Venn Diagrams",
    "description": "Shading regions for set expressions",
    "prompts": {
        "easy": [
            {"id": "ST_SV_E01", "subtopic": "Shading Union", "prompt": "Generate question shading A ∪ B", "learning_objective": "Shade union regions"},
            {"id": "ST_SV_E02", "subtopic": "Shading Intersection", "prompt": "Generate question shading A ∩ B", "learning_objective": "Shade intersection regions"},
            {"id": "ST_SV_E03", "subtopic": "Shading Complement", "prompt": "Generate question shading A'", "learning_objective": "Shade complement regions"},
            {"id": "ST_SV_E04", "subtopic": "Identifying Shaded Region", "prompt": "Generate question identifying what is shaded", "learning_objective": "Identify shaded regions"},
            {"id": "ST_SV_E05", "subtopic": "Simple Expressions", "prompt": "Generate question shading simple expression", "learning_objective": "Shade basic expressions"}
        ],
        "medium": [
            {"id": "ST_SV_M01", "subtopic": "A' ∩ B", "prompt": "Generate question shading A' ∩ B", "learning_objective": "Shade combined expressions"},
            {"id": "ST_SV_M02", "subtopic": "(A ∪ B)'", "prompt": "Generate question shading (A ∪ B)'", "learning_objective": "Shade complement of union"},
            {"id": "ST_SV_M03", "subtopic": "Three Set Shading", "prompt": "Generate three-set shading question", "learning_objective": "Shade three-set regions"},
            {"id": "ST_SV_M04", "subtopic": "A ∩ B'", "prompt": "Generate question shading A ∩ B'", "learning_objective": "Shade A only"},
            {"id": "ST_SV_M05", "subtopic": "Matching Expression", "prompt": "Generate question matching shading to expression", "learning_objective": "Match shading to notation"}
        ],
        "difficult": [
            {"id": "ST_SV_D01", "subtopic": "Complex Three-Set", "prompt": "Generate complex three-set shading", "learning_objective": "Shade complex three-set expressions"},
            {"id": "ST_SV_D02", "subtopic": "(A' ∩ B) ∪ C", "prompt": "Generate question with nested operations", "learning_objective": "Shade nested expressions"},
            {"id": "ST_SV_D03", "subtopic": "Multiple Shading", "prompt": "Generate question with multiple shadings", "learning_objective": "Compare multiple expressions"},
            {"id": "ST_SV_D04", "subtopic": "Expression from Shading", "prompt": "Generate question finding expression from shading", "learning_objective": "Write expression for shaded region"},
            {"id": "ST_SV_D05", "subtopic": "Equivalent Expressions", "prompt": "Generate question showing equivalent shadings", "learning_objective": "Identify equivalent set expressions"}
        ]
    }
}

SET_WORD_PROBLEMS = {
    "subtopic": "Set Word Problems",
    "description": "Applying sets to real-world problems",
    "prompts": {
        "easy": [
            {"id": "ST_WP_E01", "subtopic": "Survey Simple", "prompt": "Generate simple survey problem", "learning_objective": "Solve basic survey problems"},
            {"id": "ST_WP_E02", "subtopic": "Class Groups", "prompt": "Generate classroom groups problem", "learning_objective": "Apply sets to classroom data"},
            {"id": "ST_WP_E03", "subtopic": "Sports Teams", "prompt": "Generate sports participation problem", "learning_objective": "Apply sets to sports data"},
            {"id": "ST_WP_E04", "subtopic": "Food Preferences", "prompt": "Generate food survey problem", "learning_objective": "Apply sets to preference data"},
            {"id": "ST_WP_E05", "subtopic": "Club Membership", "prompt": "Generate club membership problem", "learning_objective": "Apply sets to membership data"}
        ],
        "medium": [
            {"id": "ST_WP_M01", "subtopic": "Two-Set Survey", "prompt": "Generate detailed two-set survey", "learning_objective": "Solve two-category surveys"},
            {"id": "ST_WP_M02", "subtopic": "Finding Neither", "prompt": "Generate problem finding 'neither' category", "learning_objective": "Calculate complement cases"},
            {"id": "ST_WP_M03", "subtopic": "Percentage Based", "prompt": "Generate percentage-based set problem", "learning_objective": "Apply percentages in set problems"},
            {"id": "ST_WP_M04", "subtopic": "Three Category", "prompt": "Generate three-category survey", "learning_objective": "Solve three-set word problems"},
            {"id": "ST_WP_M05", "subtopic": "Working Backwards", "prompt": "Generate problem working from totals", "learning_objective": "Deduce regions from totals"}
        ],
        "difficult": [
            {"id": "ST_WP_D01", "subtopic": "Complex Survey", "prompt": "Generate complex survey with many conditions", "learning_objective": "Handle complex multi-condition problems"},
            {"id": "ST_WP_D02", "subtopic": "Algebraic Survey", "prompt": "Generate survey requiring algebra", "learning_objective": "Use algebra in set problems"},
            {"id": "ST_WP_D03", "subtopic": "Optimization", "prompt": "Generate optimization set problem", "learning_objective": "Optimize using set analysis"},
            {"id": "ST_WP_D04", "subtopic": "Ratio Based", "prompt": "Generate ratio-based set problem", "learning_objective": "Apply ratios in set problems"},
            {"id": "ST_WP_D05", "subtopic": "Real Research", "prompt": "Generate realistic research scenario", "learning_objective": "Apply sets to research contexts"}
        ]
    }
}

DE_MOGANS_LAWS = {
    "subtopic": "De Morgan's Laws",
    "description": "Understanding and applying De Morgan's laws",
    "prompts": {
        "easy": [
            {"id": "ST_DM_E01", "subtopic": "First Law Statement", "prompt": "Generate question stating first De Morgan's law", "learning_objective": "State De Morgan's first law"},
            {"id": "ST_DM_E02", "subtopic": "Second Law Statement", "prompt": "Generate question stating second law", "learning_objective": "State De Morgan's second law"},
            {"id": "ST_DM_E03", "subtopic": "Simple Verification", "prompt": "Generate simple verification question", "learning_objective": "Verify laws with examples"},
            {"id": "ST_DM_E04", "subtopic": "Identifying Applications", "prompt": "Generate question identifying law use", "learning_objective": "Recognize De Morgan's laws"},
            {"id": "ST_DM_E05", "subtopic": "Basic Application", "prompt": "Generate basic application question", "learning_objective": "Apply laws to simple sets"}
        ],
        "medium": [
            {"id": "ST_DM_M01", "subtopic": "Simplifying Expressions", "prompt": "Generate simplification using laws", "learning_objective": "Simplify using De Morgan's laws"},
            {"id": "ST_DM_M02", "subtopic": "Venn Verification", "prompt": "Generate Venn diagram verification", "learning_objective": "Verify laws using Venn diagrams"},
            {"id": "ST_DM_M03", "subtopic": "Three Sets", "prompt": "Generate three-set De Morgan question", "learning_objective": "Extend laws to three sets"},
            {"id": "ST_DM_M04", "subtopic": "Equivalent Expressions", "prompt": "Generate equivalent expression question", "learning_objective": "Find equivalent expressions"},
            {"id": "ST_DM_M05", "subtopic": "Combined Laws", "prompt": "Generate question using both laws", "learning_objective": "Apply both laws together"}
        ],
        "difficult": [
            {"id": "ST_DM_D01", "subtopic": "Complex Simplification", "prompt": "Generate complex simplification", "learning_objective": "Simplify complex expressions"},
            {"id": "ST_DM_D02", "subtopic": "Proof Questions", "prompt": "Generate proof using laws", "learning_objective": "Prove statements using De Morgan's"},
            {"id": "ST_DM_D03", "subtopic": "Nested Complements", "prompt": "Generate nested complement question", "learning_objective": "Handle nested complements"},
            {"id": "ST_DM_D04", "subtopic": "General n Sets", "prompt": "Generate general n-set question", "learning_objective": "Understand generalized laws"},
            {"id": "ST_DM_D05", "subtopic": "Logic Connection", "prompt": "Generate logic notation connection", "learning_objective": "Connect to logical notation"}
        ]
    }
}

CARTESIAN_PRODUCT = {
    "subtopic": "Cartesian Product",
    "description": "Understanding A × B and ordered pairs",
    "prompts": {
        "easy": [
            {"id": "ST_CP_E01", "subtopic": "Definition", "prompt": "Generate question defining Cartesian product", "learning_objective": "Define Cartesian product"},
            {"id": "ST_CP_E02", "subtopic": "Listing Pairs", "prompt": "Generate question listing A × B", "learning_objective": "List ordered pairs"},
            {"id": "ST_CP_E03", "subtopic": "Counting Pairs", "prompt": "Generate question counting n(A × B)", "learning_objective": "Count elements in product"},
            {"id": "ST_CP_E04", "subtopic": "Order Matters", "prompt": "Generate question showing order matters", "learning_objective": "Understand ordered pair concept"},
            {"id": "ST_CP_E05", "subtopic": "Simple Examples", "prompt": "Generate simple Cartesian product", "learning_objective": "Calculate simple products"}
        ],
        "medium": [
            {"id": "ST_CP_M01", "subtopic": "A × B vs B × A", "prompt": "Generate comparison question", "learning_objective": "Compare A×B with B×A"},
            {"id": "ST_CP_M02", "subtopic": "Subsets of Product", "prompt": "Generate subset of product question", "learning_objective": "Identify subsets of products"},
            {"id": "ST_CP_M03", "subtopic": "Product with Self", "prompt": "Generate A × A question", "learning_objective": "Calculate self-products"},
            {"id": "ST_CP_M04", "subtopic": "Coordinate Plane", "prompt": "Generate coordinate plane connection", "learning_objective": "Connect to coordinate geometry"},
            {"id": "ST_CP_M05", "subtopic": "Finding Sets", "prompt": "Generate finding A from A × B", "learning_objective": "Deduce sets from products"}
        ],
        "difficult": [
            {"id": "ST_CP_D01", "subtopic": "Three Set Product", "prompt": "Generate A × B × C question", "learning_objective": "Calculate three-set products"},
            {"id": "ST_CP_D02", "subtopic": "Relations", "prompt": "Generate relations question", "learning_objective": "Introduce relations on sets"},
            {"id": "ST_CP_D03", "subtopic": "Properties", "prompt": "Generate product properties question", "learning_objective": "Explore product properties"},
            {"id": "ST_CP_D04", "subtopic": "Functions Preview", "prompt": "Generate functions connection", "learning_objective": "Connect products to functions"},
            {"id": "ST_CP_D05", "subtopic": "Cardinality", "prompt": "Generate cardinality problem", "learning_objective": "Solve cardinality problems"}
        ]
    }
}

NUMBER_OF_ELEMENTS = {
    "subtopic": "Number of Elements n(A)",
    "description": "Counting elements and set formulas",
    "prompts": {
        "easy": [
            {"id": "ST_NE_E01", "subtopic": "Simple Counting", "prompt": "Generate simple n(A) question", "learning_objective": "Count set elements"},
            {"id": "ST_NE_E02", "subtopic": "Listing Then Counting", "prompt": "Generate list and count question", "learning_objective": "List and count elements"},
            {"id": "ST_NE_E03", "subtopic": "Empty Set", "prompt": "Generate n({}) question", "learning_objective": "Understand n({}) = 0"},
            {"id": "ST_NE_E04", "subtopic": "From Description", "prompt": "Generate counting from description", "learning_objective": "Count from set descriptions"},
            {"id": "ST_NE_E05", "subtopic": "Universal Set", "prompt": "Generate n(ε) question", "learning_objective": "Count universal set elements"}
        ],
        "medium": [
            {"id": "ST_NE_M01", "subtopic": "Union Formula", "prompt": "Generate union formula question", "learning_objective": "Apply n(A∪B) formula"},
            {"id": "ST_NE_M02", "subtopic": "Finding Intersection", "prompt": "Generate finding n(A∩B)", "learning_objective": "Calculate intersection size"},
            {"id": "ST_NE_M03", "subtopic": "Complement Counting", "prompt": "Generate n(A') question", "learning_objective": "Calculate complement size"},
            {"id": "ST_NE_M04", "subtopic": "Multi-step", "prompt": "Generate multi-step counting", "learning_objective": "Solve multi-step counting"},
            {"id": "ST_NE_M05", "subtopic": "From Venn", "prompt": "Generate Venn-based counting", "learning_objective": "Count from Venn diagrams"}
        ],
        "difficult": [
            {"id": "ST_NE_D01", "subtopic": "Three Set Formula", "prompt": "Generate three-set formula question", "learning_objective": "Apply three-set counting formula"},
            {"id": "ST_NE_D02", "subtopic": "Maximum/Minimum", "prompt": "Generate max/min n(A∩B) question", "learning_objective": "Find extremum values"},
            {"id": "ST_NE_D03", "subtopic": "Algebraic", "prompt": "Generate algebraic counting", "learning_objective": "Use algebra in counting"},
            {"id": "ST_NE_D04", "subtopic": "Proof", "prompt": "Generate counting proof", "learning_objective": "Prove counting formulas"},
            {"id": "ST_NE_D05", "subtopic": "Complex Application", "prompt": "Generate complex counting application", "learning_objective": "Solve complex counting problems"}
        ]
    }
}

SET_BUILDER_ADV = {
    "subtopic": "Set Builder Notation - Advanced",
    "description": "Complex set builder notation and interval notation",
    "prompts": {
        "easy": [
            {"id": "ST_SB_E01", "subtopic": "Reading Notation", "prompt": "Generate reading set builder question", "learning_objective": "Read set builder notation"},
            {"id": "ST_SB_E02", "subtopic": "Writing Notation", "prompt": "Generate writing set builder question", "learning_objective": "Write set builder notation"},
            {"id": "ST_SB_E03", "subtopic": "Simple Conditions", "prompt": "Generate simple condition question", "learning_objective": "Apply simple conditions"},
            {"id": "ST_SB_E04", "subtopic": "Integer Sets", "prompt": "Generate integer set question", "learning_objective": "Define integer sets"},
            {"id": "ST_SB_E05", "subtopic": "List to Builder", "prompt": "Generate conversion question", "learning_objective": "Convert list to set builder"}
        ],
        "medium": [
            {"id": "ST_SB_M01", "subtopic": "Multiple Conditions", "prompt": "Generate multiple conditions question", "learning_objective": "Apply multiple conditions"},
            {"id": "ST_SB_M02", "subtopic": "Domain Restriction", "prompt": "Generate domain restriction question", "learning_objective": "Restrict domains appropriately"},
            {"id": "ST_SB_M03", "subtopic": "Interval Notation", "prompt": "Generate interval notation question", "learning_objective": "Use interval notation"},
            {"id": "ST_SB_M04", "subtopic": "Algebraic Conditions", "prompt": "Generate algebraic condition question", "learning_objective": "Apply algebraic conditions"},
            {"id": "ST_SB_M05", "subtopic": "Equivalent Forms", "prompt": "Generate equivalent forms question", "learning_objective": "Identify equivalent notations"}
        ],
        "difficult": [
            {"id": "ST_SB_D01", "subtopic": "Complex Algebraic", "prompt": "Generate complex algebraic question", "learning_objective": "Handle complex conditions"},
            {"id": "ST_SB_D02", "subtopic": "Function Notation", "prompt": "Generate function notation question", "learning_objective": "Connect to function notation"},
            {"id": "ST_SB_D03", "subtopic": "Parametric Sets", "prompt": "Generate parametric set question", "learning_objective": "Define parametric sets"},
            {"id": "ST_SB_D04", "subtopic": "Solution Sets", "prompt": "Generate solution set question", "learning_objective": "Express solution sets"},
            {"id": "ST_SB_D05", "subtopic": "Real Analysis Intro", "prompt": "Generate real analysis preview", "learning_objective": "Preview advanced set concepts"}
        ]
    }
}

# ============================================================================
# EXPORT ALL SUBTOPICS
# ============================================================================

SETS_PROMPTS = [
    SET_NOTATION,
    TYPES_OF_SETS,
    SET_OPERATIONS_UNION,
    VENN_TWO_SETS,
    VENN_THREE_SETS,
    SUBSETS,
    SHADING_VENN,
    SET_WORD_PROBLEMS,
    DE_MOGANS_LAWS,
    CARTESIAN_PRODUCT,
    NUMBER_OF_ELEMENTS,
    SET_BUILDER_ADV
]

def get_prompt_count():
    """Count total prompts in this module."""
    total = 0
    for subtopic in SETS_PROMPTS:
        for difficulty in ["easy", "medium", "difficult"]:
            total += len(subtopic["prompts"].get(difficulty, []))
    return total

def get_all_prompts():
    """Get all prompts organized by subtopic and difficulty."""
    return SETS_PROMPTS
