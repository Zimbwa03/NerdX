#!/usr/bin/env python3
"""
Populate Enzymes notes - Third Biology topic for ZIMSEC Combined Science
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_enzymes_notes():
    """Create comprehensive notes for Enzymes"""
    
    diagrams_base = "/static/notes/biology/enzymes/"
    
    notes_data = {
        "topic": "Enzymes",
        "subject": "Biology",
        "summary": "Enzymes are biological catalysts that speed up chemical reactions in living organisms. They are proteins with specific shapes that allow them to catalyze particular reactions without being used up.",
        "sections": [
            {
                "title": "1. What are Enzymes?",
                "content": """## Definition

**Enzymes** are biological catalysts made of protein that speed up chemical reactions in living organisms without being changed or used up themselves.

### Key Features:

- **Biological** - Found in living things
- **Catalysts** - Speed up reactions
- **Proteins** - Made of amino acids
- **Specific** - Each enzyme catalyzes one type of reaction
- **Reusable** - Not used up in reactions
- **Efficient** - Small amounts needed

### Why are Enzymes Important?

Without enzymes:
- Reactions would be too SLOW for life
- Body temperature would need to be much HIGHER
- Digestion would take days instead of hours
- Respiration couldn't provide energy fast enough

### Naming Enzymes:

Most enzymes end in **-ase**:
- **Amylase** - breaks down starch (amylum)
- **Protease** - breaks down proteins
- **Lipase** - breaks down lipids (fats)
- **Maltase** - breaks down maltose
- **Catalase** - breaks down hydrogen peroxide
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. How Enzymes Work - Lock and Key Model",
                "content": """## The Lock and Key Hypothesis

This model explains how enzymes are SPECIFIC to their substrates.

### Key Terms:

**Substrate** - The substance the enzyme acts on  
**Active Site** - The specific region on the enzyme where the substrate binds  
**Enzyme-Substrate Complex** - Temporary structure formed when substrate binds to enzyme  
**Product** - The substance formed after the reaction  

### The Process:

**Step 1: Substrate Approaches**
- Substrate molecule approaches the enzyme
- Has a complementary shape to the active site

**Step 2: Binding**
- Substrate fits into the active site
- Like a key fitting into a lock
- Forms enzyme-substrate complex

**Step 3: Reaction**
- Chemical bonds are broken or formed
- Substrate is converted to product(s)

**Step 4: Product Release**
- Product(s) leave the active site
- Enzyme is unchanged
- Ready to bind another substrate

### Why "Lock and Key"?

- **Enzyme** = Lock (has specific shape)
- **Substrate** = Key (must fit exactly)
- **Active Site** = Keyhole (specific shape)
- Only the correct substrate fits
- This explains enzyme SPECIFICITY

### Example: Amylase

- **Enzyme**: Amylase
- **Substrate**: Starch
- **Active Site**: Shaped to fit starch molecules
- **Product**: Maltose (sugar)
- Amylase will NOT work on proteins or fats!
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "3. Factors Affecting Enzyme Activity",
                "content": """## 1. Temperature

### Effect:

**Low Temperature (0-30°C):**
- Slow molecular movement
- Few collisions between enzyme and substrate
- Slow reaction rate

**Optimum Temperature (37°C for human enzymes):**
- Maximum enzyme activity
- Fastest reaction rate
- Most collisions

**High Temperature (above 45°C):**
- Enzyme DENATURES
- Active site changes shape
- Substrate no longer fits
- Enzyme stops working
- **IRREVERSIBLE** damage

### Key Points:

- Each enzyme has an **optimum temperature**
- Human enzymes: ~37°C (body temperature)
- Plant enzymes: ~25°C
- Bacterial enzymes: varies (some like 80°C!)
- Denaturation is PERMANENT

## 2. pH (Acidity/Alkalinity)

### Effect:

Each enzyme has an **optimum pH**:

**Pepsin** (stomach enzyme):
- Optimum pH: 2 (very acidic)
- Works in stomach acid

**Amylase** (mouth/pancreas):
- Optimum pH: 7 (neutral)
- Works in saliva and small intestine

**Trypsin** (small intestine):
- Optimum pH: 8 (slightly alkaline)

### What Happens at Wrong pH:

- **Too acidic or too alkaline**
- Active site shape changes
- Enzyme DENATURES
- Stops working
- Can be IRREVERSIBLE

## 3. Enzyme Concentration

### Effect:

**More Enzyme:**
- More active sites available
- More substrate can be processed
- Faster reaction rate
- (Until substrate runs out)

**Graph Pattern:**
- Rate increases with enzyme concentration
- Straight line relationship
- (If substrate is unlimited)

## 4. Substrate Concentration

### Effect:

**Low Substrate:**
- Many enzymes waiting
- Slow reaction rate

**Increasing Substrate:**
- More collisions
- Faster reaction rate

**High Substrate:**
- All enzymes working
- Maximum rate reached
- Adding more substrate has NO effect
- Enzymes are SATURATED

### Graph Pattern:

- Rate increases initially
- Levels off (plateau)
- Maximum rate when all enzymes busy
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "4. Denaturation",
                "content": """## What is Denaturation?

**Denaturation** is the permanent change in the shape of an enzyme's active site, causing it to lose its function.

### Causes of Denaturation:

**1. High Temperature**
- Above optimum (usually >45°C)
- Breaks bonds holding enzyme shape
- Active site changes shape
- Substrate no longer fits

**2. Extreme pH**
- Too acidic or too alkaline
- Disrupts chemical bonds
- Changes active site shape

**3. Heavy Metals**
- Lead, mercury
- Bind to enzyme
- Change shape

### Key Features:

✓ **Irreversible** - Cannot be undone  
✓ **Permanent** - Enzyme is destroyed  
✓ **Shape Change** - Active site altered  
✓ **Loss of Function** - Enzyme stops working  

### Why is it Important?

- Explains why fever is dangerous (enzymes denature)
- Why cooking changes food (enzymes destroyed)
- Why stomach acid kills bacteria (denatures their enzymes)
- Why we need to maintain body temperature

### Denaturation vs Inactivation:

| Feature | Denaturation | Inactivation |
|---------|--------------|--------------|
| **Reversible?** | NO | Sometimes YES |
| **Cause** | Extreme conditions | Wrong conditions |
| **Shape Change** | Permanent | Temporary |
| **Example** | Boiled egg white | Cold enzyme |
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "5. Digestive Enzymes",
                "content": """## Important Digestive Enzymes

### 1. Amylase

**Source**: Salivary glands, Pancreas  
**Location**: Mouth, Small intestine  
**Substrate**: Starch  
**Product**: Maltose (sugar)  
**Optimum pH**: 7 (neutral)  

**Function**: Breaks down starch into simpler sugars

### 2. Protease (Pepsin, Trypsin)

**Pepsin:**
- Source: Stomach
- Location: Stomach
- Substrate: Proteins
- Product: Peptides
- Optimum pH: 2 (acidic)

**Trypsin:**
- Source: Pancreas
- Location: Small intestine
- Substrate: Proteins/Peptides
- Product: Amino acids
- Optimum pH: 8 (alkaline)

**Function**: Breaks down proteins into amino acids

### 3. Lipase

**Source**: Pancreas  
**Location**: Small intestine  
**Substrate**: Lipids (fats and oils)  
**Product**: Fatty acids and glycerol  
**Optimum pH**: 8 (alkaline)  

**Function**: Breaks down fats into fatty acids and glycerol

### 4. Maltase

**Source**: Small intestine  
**Location**: Small intestine  
**Substrate**: Maltose  
**Product**: Glucose  
**Optimum pH**: 7-8  

**Function**: Breaks down maltose into glucose

### Summary Table:

| Enzyme | Substrate | Products | Location |
|--------|-----------|----------|----------|
| **Amylase** | Starch | Maltose | Mouth, Small intestine |
| **Pepsin** | Protein | Peptides | Stomach |
| **Trypsin** | Protein | Amino acids | Small intestine |
| **Lipase** | Fats | Fatty acids + Glycerol | Small intestine |
| **Maltase** | Maltose | Glucose | Small intestine |
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "6. Practical Applications",
                "content": """## Uses of Enzymes

### 1. Food Industry

**Cheese Making:**
- Rennin enzyme clots milk
- Separates curds from whey

**Bread Making:**
- Amylase breaks down starch
- Provides sugar for yeast

**Fruit Juice:**
- Pectinase breaks down pectin
- Makes juice clearer

**Meat Tenderizer:**
- Protease breaks down tough proteins
- Makes meat softer

### 2. Biological Washing Powders

**How They Work:**
- Contain proteases and lipases
- Break down protein and fat stains
- Work at low temperatures (saves energy)
- More effective than normal detergents

**Advantages:**
- Remove biological stains (blood, sweat, food)
- Work in cold water
- Environmentally friendly

### 3. Medicine

**Lactose Intolerance:**
- Lactase enzyme added to milk
- Breaks down lactose
- Makes milk digestible

**Digestive Problems:**
- Enzyme supplements help digestion
- Replace missing enzymes

### 4. Industry

**Brewing:**
- Amylase converts starch to sugar
- Yeast ferments sugar to alcohol

**Paper Making:**
- Enzymes break down wood pulp
- Makes paper production easier

### Advantages of Using Enzymes:

✓ Work at low temperatures (save energy)  
✓ Specific (only target certain substances)  
✓ Biodegradable (environmentally friendly)  
✓ Efficient (small amounts needed)  
✓ Reusable (can be used multiple times)  
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Enzymes are biological catalysts made of protein that speed up reactions",
            "Enzymes are specific - each enzyme catalyzes only one type of reaction",
            "The lock and key model explains enzyme specificity (substrate fits active site)",
            "Enzymes have an optimum temperature (usually 37°C for humans)",
            "Enzymes have an optimum pH (varies: pepsin pH 2, amylase pH 7, trypsin pH 8)",
            "Denaturation is the permanent change in enzyme shape caused by extreme conditions",
            "High temperature and extreme pH cause irreversible denaturation",
            "Amylase breaks down starch to maltose, protease breaks down proteins, lipase breaks down fats",
            "Enzymes are not used up in reactions and can be reused",
            "Increasing substrate concentration increases reaction rate until enzymes are saturated"
        ],
        "exam_tips": [
            "Always mention 'biological catalyst' and 'protein' when defining enzymes",
            "For lock and key model, draw a diagram showing substrate fitting into active site",
            "Remember: Denaturation is IRREVERSIBLE - this is a key exam point!",
            "Know the optimum pH for each enzyme: Pepsin (pH 2), Amylase (pH 7), Trypsin (pH 8)",
            "Temperature graph: increases to optimum, then drops sharply (denaturation)",
            "Substrate concentration graph: increases then plateaus (saturation)",
            "Don't say 'enzymes die' - say 'enzymes denature' or 'become inactive'",
            "Common mistake: Saying enzymes are used up - they are NOT, they are reusable!",
            "For digestive enzymes, know: substrate, product, location, and optimum pH",
            "Practical applications are popular exam questions - know biological washing powders!"
        ]
    }
    
    return notes_data

if __name__ == "__main__":
    service = ScienceNotesService()
    notes = create_enzymes_notes()
    success = service.save_topic_notes("Biology", "Enzymes", notes)
    
    if success:
        print("SUCCESS: Created notes for Enzymes")
        print(f"   - {len(notes['sections'])} sections")
        print(f"   - {len(notes['key_points'])} key points")
        print(f"   - {len(notes['exam_tips'])} exam tips")
    else:
        print("FAILED to create notes")
