#!/usr/bin/env python3
"""
Create comprehensive notes for remaining Biology topics efficiently
Topics 5-14: Animal Nutrition through Classification
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

# Topic 5: Animal Nutrition
animal_nutrition_notes = {
    "topic": "Animal Nutrition",
    "subject": "Biology",
    "summary": "Animals are heterotrophs that obtain food by consuming other organisms. This topic covers the human digestive system, mechanical and chemical digestion, absorption, and the role of digestive enzymes.",
    "sections": [
        {
            "title": "1. Introduction to Animal Nutrition",
            "content": """## What is Animal Nutrition?

**Animal Nutrition** is the process by which animals obtain and use food for energy, growth, and repair.

### Heterotrophic Nutrition

Animals are **heterotrophs** - they cannot make their own food and must consume other organisms.

**Types of Heterotrophic Nutrition:**

**1. Herbivores**
- Eat plants only
- Examples: Cow, rabbit, sheep, elephant
- Have specialized digestive systems for cellulose

**2. Carnivores**
- Eat meat only
- Examples: Lion, tiger, eagle, snake
- Sharp teeth for tearing flesh

**3. Omnivores**
- Eat both plants and animals
- Examples: Humans, pigs, bears, rats
- Varied diet, varied teeth

**4. Detritivores**
- Feed on dead organic matter
- Examples: Earthworms, millipedes
- Break down waste

**5. Parasites**
- Feed on living host
- Examples: Tapeworm, lice, mosquito
- Harm the host

### The Seven Processes of Nutrition:

**1. INGESTION**
- Taking food into the body
- Through the mouth

**2. DIGESTION**
- Breaking down large, insoluble food molecules
- Into small, soluble molecules
- **Mechanical**: Physical breakdown (chewing)
- **Chemical**: Enzyme breakdown

**3. ABSORPTION**
- Small molecules pass through gut wall
- Into bloodstream
- Mainly in small intestine

**4. ASSIMILATION**
- Use of absorbed nutrients
- For energy, growth, repair
- In body cells

**5. EGESTION**
- Removal of undigested food
- As feces
- Through anus

**6. RESPIRATION**
- Release of energy from food
- In all cells

**7. EXCRETION**
- Removal of metabolic waste
- CO₂, urea
- Not the same as egestion!

### Why Do We Need Food?

**1. Energy**
- For movement, warmth, all life processes
- From carbohydrates and fats

**2. Growth**
- Building new cells and tissues
- From proteins

**3. Repair**
- Replacing damaged cells
- From proteins

**4. Health**
- Vitamins and minerals
- Prevent deficiency diseases
""",
            "diagrams": [],
            "subsections": []
        },
        {
            "title": "2. The Human Alimentary Canal",
            "content": """## Structure of the Digestive System

The **alimentary canal** (gut) is a long tube from mouth to anus where digestion occurs.

### Parts of the Alimentary Canal:

**1. MOUTH**
- **Function**: Ingestion, mechanical digestion, start of chemical digestion
- **Features**:
  - Teeth - chew food (mechanical digestion)
  - Tongue - mixes food with saliva, forms bolus, tastes
  - Salivary glands - produce saliva
- **Enzyme**: Salivary amylase
- **pH**: Neutral (pH 7)
- **Digestion**: Starch → Maltose

**2. OESOPHAGUS (Gullet)**
- **Function**: Transport food from mouth to stomach
- **Features**:
  - Muscular tube (~25cm long)
  - Peristalsis - wave-like muscle contractions
  - Mucus - lubricates food passage
- **No digestion occurs here**

**3. STOMACH**
- **Function**: Mechanical and chemical digestion, storage
- **Features**:
  - Muscular bag
  - Churns food (mechanical digestion)
  - Produces gastric juice
  - Stores food for 2-6 hours
- **Enzyme**: Pepsin (protease)
- **pH**: Very acidic (pH 1.5-2)
- **Digestion**: Proteins → Peptides
- **Other secretions**:
  - Hydrochloric acid (HCl) - kills bacteria, provides acidic pH
  - Mucus - protects stomach wall

**4. SMALL INTESTINE**

**Duodenum (first part):**
- Receives secretions from:
  - **Pancreas** - pancreatic juice
  - **Liver** - bile (via gall bladder)
- **Enzymes**: Amylase, trypsin, lipase
- **pH**: Alkaline (pH 8)
- **Digestion**: Completes digestion of all food types

**Ileum (second part):**
- **Function**: Absorption of digested food
- **Features**:
  - Very long (~6 meters)
  - Inner wall has villi
  - Villi have microvilli
  - Huge surface area
- **Adaptations for absorption**:
  - Thin walls (one cell thick)
  - Good blood supply
  - Large surface area (villi)
  - Moist surface

**5. LARGE INTESTINE (Colon)**
- **Function**: Absorption of water and minerals
- **Features**:
  - Wider but shorter than small intestine
  - Absorbs water from undigested food
  - Forms feces
- **No digestion occurs**

**6. RECTUM**
- **Function**: Temporary storage of feces
- **Features**:
  - Last part of large intestine
  - Stores feces until egestion

**7. ANUS**
- **Function**: Egestion (removal of feces)
- **Features**:
  - Opening at end of alimentary canal
  - Controlled by sphincter muscles
  - Voluntary control

### Associated Organs:

**LIVER**
- Largest internal organ
- **Functions**:
  - Produces bile
  - Stores glycogen
  - Breaks down toxins
  - Makes proteins
  - Stores vitamins

**GALL BLADDER**
- Stores bile
- Releases bile into duodenum

**PANCREAS**
- Produces pancreatic juice
- Contains enzymes:
  - Amylase (starch → maltose)
  - Trypsin (proteins → amino acids)
  - Lipase (fats → fatty acids + glycerol)
- Also produces insulin (hormone)
""",
            "diagrams": [],
            "subsections": []
        },
        {
            "title": "3. Teeth and Mechanical Digestion",
            "content": """## Types of Teeth

Humans have **32 teeth** (adults) of 4 different types:

### 1. Incisors (8 teeth)
- **Location**: Front of mouth
- **Shape**: Chisel-shaped, sharp edge
- **Function**: Cutting and biting food
- **Example**: Biting into an apple

### 2. Canines (4 teeth)
- **Location**: Next to incisors (corners)
- **Shape**: Pointed, sharp
- **Function**: Tearing and gripping food
- **Example**: Tearing meat
- **Note**: More developed in carnivores

### 3. Premolars (8 teeth)
- **Location**: Behind canines
- **Shape**: Flat top with ridges
- **Function**: Crushing and grinding food
- **Example**: Chewing vegetables

### 4. Molars (12 teeth)
- **Location**: Back of mouth
- **Shape**: Large, flat top with ridges
- **Function**: Grinding and crushing food
- **Example**: Chewing tough food
- **Note**: Includes wisdom teeth

### Dental Formula:

**Adult Human:**
```
I 2/2  C 1/1  PM 2/2  M 3/3  = 32 teeth
(per half of upper/lower jaw)
```

### Structure of a Tooth:

**CROWN** (visible part):
- **Enamel** - hardest substance in body, protects tooth
- **Dentine** - bone-like material, forms bulk of tooth
- **Pulp cavity** - contains blood vessels and nerves

**ROOT** (in jaw bone):
- **Cement** - holds tooth in jaw
- **Periodontal ligament** - attaches tooth to jaw bone

### Tooth Decay (Dental Caries):

**Causes:**
1. **Bacteria** in mouth feed on sugar
2. Produce **acid**
3. Acid dissolves **enamel**
4. Creates cavity
5. Reaches dentine and pulp
6. Causes pain

**Prevention:**
- Brush teeth twice daily
- Use fluoride toothpaste
- Floss regularly
- Reduce sugar intake
- Regular dental checkups
- Avoid acidic drinks

### Gum Disease:

**Causes:**
- Plaque buildup
- Bacteria infection
- Poor oral hygiene

**Symptoms:**
- Bleeding gums
- Bad breath
- Loose teeth

**Prevention:**
- Regular brushing
- Flossing
- Dental visits
""",
            "diagrams": [],
            "subsections": []
        },
        {
            "title": "4. Chemical Digestion - Enzymes",
            "content": """## Digestive Enzymes

Enzymes break down large, insoluble molecules into small, soluble molecules.

### Summary Table:

| Enzyme | Source | Location | Substrate | Products | pH |
|--------|--------|----------|-----------|----------|-----|
| **Salivary Amylase** | Salivary glands | Mouth | Starch | Maltose | 7 (neutral) |
| **Pepsin** | Stomach | Stomach | Proteins | Peptides | 2 (acidic) |
| **Pancreatic Amylase** | Pancreas | Duodenum | Starch | Maltose | 8 (alkaline) |
| **Trypsin** | Pancreas | Duodenum | Proteins/Peptides | Amino acids | 8 (alkaline) |
| **Lipase** | Pancreas | Duodenum | Lipids (fats) | Fatty acids + Glycerol | 8 (alkaline) |
| **Maltase** | Small intestine | Ileum | Maltose | Glucose | 7-8 |

### Detailed Breakdown:

**CARBOHYDRATE DIGESTION:**

**Stage 1: Mouth**
- Salivary amylase
- Starch → Maltose
- Short time (food quickly swallowed)

**Stage 2: Duodenum**
- Pancreatic amylase
- Starch → Maltose
- Alkaline conditions

**Stage 3: Ileum**
- Maltase
- Maltose → Glucose
- Final product absorbed

**PROTEIN DIGESTION:**

**Stage 1: Stomach**
- Pepsin
- Proteins → Peptides
- Acidic conditions (pH 2)
- HCl denatures proteins

**Stage 2: Duodenum**
- Trypsin
- Peptides → Amino acids
- Alkaline conditions (pH 8)

**FAT DIGESTION:**

**Stage 1: Duodenum**
- Bile emulsifies fats (breaks into droplets)
- Increases surface area
- No enzyme in bile!

**Stage 2: Duodenum/Ileum**
- Lipase
- Fats → Fatty acids + Glycerol
- Alkaline conditions

### Role of Bile:

**Produced by**: Liver  
**Stored in**: Gall bladder  
**Released into**: Duodenum  

**Functions:**
1. **Emulsifies fats**
   - Breaks large fat droplets into smaller ones
   - Increases surface area
   - Makes lipase more effective

2. **Neutralizes stomach acid**
   - Alkaline (pH 8)
   - Provides optimal pH for intestinal enzymes

3. **No enzymes in bile!**
   - Common mistake to say bile contains enzymes

### Why Different pH Values?

**Stomach (pH 2):**
- Pepsin works best in acid
- Kills bacteria in food
- Denatures proteins

**Small Intestine (pH 8):**
- Pancreatic enzymes work best in alkaline
- Bile neutralizes stomach acid
""",
            "diagrams": [],
            "subsections": []
        },
        {
            "title": "5. Absorption in the Small Intestine",
            "content": """## Structure of the Ileum

The ileum is perfectly adapted for absorption:

### Villi - Finger-like Projections

**Features:**
- Millions of tiny projections
- Increase surface area enormously
- Each villus has:
  - Thin wall (one cell thick)
  - Network of blood capillaries
  - Lacteal (lymph vessel)
  - Microvilli on surface cells

**Adaptations for Absorption:**

**1. Large Surface Area**
- Millions of villi
- Each villus has microvilli
- Total surface area = size of tennis court!

**2. Thin Walls**
- One cell thick
- Short diffusion distance
- Fast absorption

**3. Good Blood Supply**
- Network of capillaries in each villus
- Maintains concentration gradient
- Carries away absorbed nutrients

**4. Moist Surface**
- Substances dissolve
- Easier absorption

### What is Absorbed?

**Glucose:**
- Absorbed into blood capillaries
- Transported to liver
- Used for respiration or stored as glycogen

**Amino Acids:**
- Absorbed into blood capillaries
- Transported to liver
- Used to make proteins or broken down

**Fatty Acids and Glycerol:**
- Absorbed into lacteal (lymph vessel)
- Recombined to form fats
- Eventually enter bloodstream
- Stored or used for energy

**Vitamins:**
- Water-soluble vitamins (B, C) → blood
- Fat-soluble vitamins (A, D, E, K) → lacteal

**Minerals:**
- Absorbed into blood
- Examples: Iron, calcium, sodium

**Water:**
- Absorbed in small intestine
- Also absorbed in large intestine

### How Absorption Occurs:

**Diffusion:**
- Down concentration gradient
- Passive (no energy)
- For glucose, amino acids (when concentration high)

**Active Transport:**
- Against concentration gradient
- Requires energy (ATP)
- For glucose, amino acids (when concentration low)
- Ensures all nutrients absorbed

**Osmosis:**
- For water
- Follows solutes
""",
            "diagrams": [],
            "subsections": []
        },
        {
            "title": "6. Balanced Diet and Nutrition",
            "content": """## Components of a Balanced Diet

A **balanced diet** contains all nutrients in correct proportions for health.

### The Seven Nutrient Groups:

**1. CARBOHYDRATES**
- **Function**: Main source of energy
- **Sources**: Bread, rice, pasta, potatoes, sugar
- **Types**:
  - Simple sugars (glucose, fructose)
  - Complex carbohydrates (starch)
- **Deficiency**: Lack of energy, weight loss

**2. PROTEINS**
- **Function**: Growth, repair, making enzymes
- **Sources**: Meat, fish, eggs, beans, nuts
- **Made of**: Amino acids
- **Deficiency**: Kwashiorkor (stunted growth, swollen belly)

**3. LIPIDS (Fats and Oils)**
- **Function**: Energy storage, insulation, protection
- **Sources**: Butter, oil, nuts, oily fish
- **Types**:
  - Saturated fats (animal fats)
  - Unsaturated fats (plant oils)
- **Deficiency**: Lack of energy, poor insulation

**4. VITAMINS**

**Vitamin A:**
- Function: Good vision, healthy skin
- Sources: Carrots, liver, dairy
- Deficiency: Night blindness

**Vitamin C:**
- Function: Healthy gums, wound healing
- Sources: Citrus fruits, vegetables
- Deficiency: Scurvy (bleeding gums)

**Vitamin D:**
- Function: Strong bones and teeth (calcium absorption)
- Sources: Sunlight, oily fish, eggs
- Deficiency: Rickets (soft bones)

**5. MINERALS**

**Iron:**
- Function: Making hemoglobin (red blood cells)
- Sources: Red meat, spinach, beans
- Deficiency: Anemia (tiredness, pale)

**Calcium:**
- Function: Strong bones and teeth, blood clotting
- Sources: Milk, cheese, fish bones
- Deficiency: Weak bones, rickets

**Iodine:**
- Function: Making thyroxine (metabolism hormone)
- Sources: Seafood, iodized salt
- Deficiency: Goiter (swollen thyroid)

**6. WATER**
- **Function**: 
  - Solvent for reactions
  - Transport medium
  - Temperature regulation
  - 70% of body weight
- **Sources**: Drinks, fruits, vegetables
- **Deficiency**: Dehydration

**7. DIETARY FIBER (Roughage)**
- **Function**: 
  - Prevents constipation
  - Adds bulk to food
  - Stimulates peristalsis
- **Sources**: Vegetables, fruits, whole grains
- **Not digested** - passes through gut
- **Deficiency**: Constipation, bowel cancer

### Factors Affecting Dietary Needs:

**Age:**
- Children need more protein (growth)
- Elderly need less energy

**Activity:**
- Athletes need more carbohydrates
- Manual workers need more energy

**Pregnancy:**
- Need more protein, calcium, iron
- For baby's growth

**Gender:**
- Males generally need more energy
- Females need more iron (menstruation)

### Malnutrition:

**Undernutrition:**
- Not enough food
- Starvation, weight loss

**Overnutrition:**
- Too much food
- Obesity, heart disease

**Deficiency Diseases:**
- Lack of specific nutrient
- Scurvy, rickets, anemia
""",
            "diagrams": [],
            "subsections": []
        }
    ],
    "key_points": [
        "Animals are heterotrophs - they consume other organisms for food",
        "Seven processes: Ingestion, Digestion, Absorption, Assimilation, Egestion, Respiration, Excretion",
        "Mechanical digestion: physical breakdown (teeth, stomach churning)",
        "Chemical digestion: enzyme breakdown of large molecules to small molecules",
        "Amylase breaks down starch to maltose (mouth and duodenum)",
        "Pepsin breaks down proteins to peptides in stomach (pH 2)",
        "Trypsin breaks down proteins to amino acids in duodenum (pH 8)",
        "Lipase breaks down fats to fatty acids and glycerol",
        "Villi in small intestine provide large surface area for absorption",
        "Balanced diet contains carbohydrates, proteins, fats, vitamins, minerals, water, and fiber"
    ],
    "exam_tips": [
        "Don't confuse egestion (removal of undigested food) with excretion (removal of metabolic waste)",
        "Remember: Bile does NOT contain enzymes - it emulsifies fats and neutralizes acid",
        "For enzyme tables, always include: enzyme name, source, location, substrate, products, pH",
        "Villi adaptations: large surface area, thin walls, good blood supply, moist",
        "Teeth formula: I 2/2 C 1/1 PM 2/2 M 3/3 = 32 teeth (know what each letter means)",
        "Common mistake: Saying small intestine absorbs nutrients - be specific: ILEUM absorbs",
        "Peristalsis is wave-like muscle contractions, not the same as churning",
        "Vitamin deficiencies: A = night blindness, C = scurvy, D = rickets",
        "For absorption, mention BOTH diffusion and active transport",
        "Know the difference: Duodenum (digestion) vs Ileum (absorption)"
    ]
}

# Save Animal Nutrition notes
service = ScienceNotesService()
success = service.save_topic_notes("Biology", "Animal Nutrition", animal_nutrition_notes)
print(f"Animal Nutrition: {'SUCCESS' if success else 'FAILED'}")
