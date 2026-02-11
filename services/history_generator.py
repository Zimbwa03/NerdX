"""
ZIMSEC O-Level History - 3-part Essay Question Generator.
Paper 1: Essays only (ZIMSEC 3-stage format: Part [a] 5 marks, Part [b] 12 marks, Part [c] 15 marks).

Uses Vertex AI (Gemini) as primary, with template fallback.
"""

import logging
import uuid
from typing import Dict, Optional, Any, List

from utils.vertex_ai_helper import try_vertex_json
from constants import TOPICS

logger = logging.getLogger(__name__)

HISTORY_TOPICS = TOPICS.get("History", [
    "Conceptualisation of History",
    "Origins of Humankind",
    "Ancient Civilisations Egypt",
    "Development of Zimbabwean Societies",
    "Slavery and the Slave Trade",
    "Early European Contacts",
    "Colonisation",
    "Colonial Administration",
    "Nationalism",
    "Armed Struggle",
    "Post-Independence",
    "Regional Cooperation",
    "Sources of History",
    "Zimbabwean Societies",
    "European Contacts",
    "World Wars",
    "International Cooperation",
    "Socialism and Communism",
    "Constitution Democracy and Human Rights",
])

FORM_1_TOPICS = [
    "Introduction to History",
    "Sources of History",
    "Types of History",
    "Ancient Civilisation in Egypt",
    "Spread of Egyptian Civilisation",
    "Late Stone Age Societies and transition to Early Iron Age",
    "States Formation in Zimbabwe",
    "Causes of Slave trade",
    "Triangular Slave trade",
    "Impact of slave trade",
    "Abolition of slave trade",
]

FORM_2_TOPICS = [
    "The Portuguese Prazo System in the Zambezi Valley",
    "Early Missionary Activities (1850-1900)",
    "Background to the Colonisation of Zimbabwe",
    "Process of Colonisation of Zimbabwe",
    "The Anglo-Ndebele War (1893-1894)",
    "The First Chimurenga/Umvukela (1896-1897)",
    "Colonial policies (1923-1979)",
    "Federation of Rhodesia and Nyasaland (1953-1963)",
    "Unilateral Declaration of Independence (U.D.I.)",
    "Rise of Nationalism",
]

FORM_3_TOPICS = [
    "Causes of the Second Chimurenga / Armed Struggle in Zimbabwe",
    "Early Phase of the Armed Struggle",
    "Second Phase of the Armed Struggle (Mobilisation Phase)",
    "Decisive Phase of the Armed Struggle (1972-1979)",
    "Peace Settlements during the Armed Struggle",
    "Social Policies in Zimbabwe since 1990",
    "Political Policies in Zimbabwe since 1990",
    "Economic Policies in Zimbabwe since 1990",
    "Zimbabwe and the Southern African Development Community (SADC)",
    "Zimbabwe and the African Union (AU)",
    "Zimbabwe and the United Nations (UN)",
    "Provisions of the Constitution of Zimbabwe",
    "Child Rights and Responsibilities",
    "Principles of Good Governance",
]

FORM_4_TOPICS = [
    "Causes of the Struggle for Independence in Southern Africa",
    "The Struggle for Independence in Mozambique",
    "The Struggle for Independence in Angola",
    "The Struggle for Independence in Namibia",
    "The Struggle for Independence in South Africa",
    "Role of Liberation Movements in Southern Africa",
    "Role of the International Community in Southern African Liberation",
    "Effects of the Struggles for Independence in Southern Africa",
    "Causes of the First World War",
    "Course of the First World War",
    "Effects of the First World War",
    "The Treaty of Versailles",
    "Other Post-War Treaties",
    "Political Developments during the Inter-War Period",
    "Economic Developments during the Inter-War Period",
    "Social Developments during the Inter-War Period",
    "Rise of Dictatorships in Europe",
    "Causes of the Second World War",
    "Causes of the Second World War",
    "Course of the Second World War",
    "Effects of the Second World War",
    "Formation of the United Nations",
    "The Cold War - Causes",
    "The Cold War - Effects",
    "Decolonisation after the Second World War",
]

FORM_TOPIC_MAP = {
    "Form 1": FORM_1_TOPICS,
    "Form 2": FORM_2_TOPICS,
    "Form 3": FORM_3_TOPICS,
    "Form 4": FORM_4_TOPICS,
}

SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC History teacher, syllabus examiner, and curriculum developer for Zimbabwe. "
    "Generate ONE 3-part essay question in the exact ZIMSEC format and keep it strictly inside the selected form syllabus. "
    "Part [a]: List/Identify question worth 5 marks (simple recall, bullet points). "
    "Part [b]: Describe/Explain question worth 12 marks (two paragraphs, NO conclusion). "
    "Part [c]: Analytical/Evaluation question worth 15 marks (introduction + body + conclusion, 8-10 lines). "
    "For Form 1, only use these topics: Introduction to History, Sources of History, Types of History, "
    "Ancient Civilisation in Egypt, Spread of Egyptian Civilisation, "
    "Late Stone Age Societies and transition to Early Iron Age, States Formation in Zimbabwe, "
    "Causes of Slave trade, Triangular Slave trade, Impact of slave trade, "
    "Abolition of slave trade. "
    "Follow ZIMSEC Paper 1 question template order strictly: "
    "Question 1 recall/list (5 marks), Question 2 describe/explain (12 marks), "
    "Question 3 analysis/evaluation (15 marks). "
    "Question 2 should be answerable in two clear paragraphs without a conclusion. "
    "Question 3 should require introduction, evidence-based argument, and conclusion. "
    "Return ONLY valid JSON."
)

FORM_2_COVERAGE_HINTS = {
    "The Portuguese Prazo System in the Zambezi Valley": [
        "meaning of prazo/prazeiro",
        "organisation and Chikunda",
        "effects on African communities",
        "decline and significance",
    ],
    "Early Missionary Activities (1850-1900)": [
        "missionary activities",
        "challenges",
        "positive and negative effects",
        "historical evaluation",
    ],
    "Background to the Colonisation of Zimbabwe": [
        "meaning of colonisation",
        "scramble for Africa context",
        "causes of colonisation",
        "Zimbabwe-specific background factors",
    ],
    "Process of Colonisation of Zimbabwe": [
        "process of occupation",
        "treaties and concessions",
        "BSAC and Pioneer Column role",
        "Pioneer Column role",
        "administrative consolidation",
        "immediate effects",
    ],
    "The Anglo-Ndebele War (1893-1894)": [
        "causes",
        "course of war",
        "effects",
        "historical significance",
    ],
    "The First Chimurenga/Umvukela (1896-1897)": [
        "causes and leadership",
        "course of uprising",
        "effects",
        "legacy",
    ],
    "Colonial policies (1923-1979)": [
        "major colonial laws and governance structures",
        "land, labour, and taxation policies",
        "social/economic effects on African communities",
        "links to resistance and conflict",
    ],
    "Federation of Rhodesia and Nyasaland (1953-1963)": [
        "formation and structure of federation",
        "objectives and supporters/opponents",
        "political/economic effects",
        "reasons for collapse",
    ],
    "Unilateral Declaration of Independence (U.D.I.)": [
        "meaning and background of UDI",
        "Ian Smith government motives",
        "international response and sanctions",
        "impact on conflict and transition",
    ],
    "Rise of Nationalism": [
        "causes of nationalism growth",
        "major nationalist leaders and parties",
        "strategies of mobilisation and protest",
        "historical significance in liberation struggle",
    ],
}

FORM_1_COVERAGE_HINTS = {
    "Introduction to History": [
        "meaning/definition of History",
        "why History is studied (importance)",
        "evidence-based inquiry and source awareness",
        "historical skills (chronology, cause/effect, continuity/change)",
    ],
    "Sources of History": [
        "definition of historical sources",
        "archaeology, oral tradition, written records, rock art",
        "advantages and limitations of each source type",
        "reliability, bias, and source comparison/corroboration",
    ],
    "Types of History": [
        "social, political, and economic history definitions",
        "how each type studies different aspects of the past",
        "comparative differences and overlaps",
        "why combining types improves interpretation",
    ],
    "Ancient Civilisation in Egypt": [
        "meaning of civilisation and Egyptian context",
        "Nile geography and agricultural foundation",
        "governance, religion, writing, science, architecture",
        "historical significance of Ancient Egypt in Africa",
    ],
    "Spread of Egyptian Civilisation": [
        "channels of spread (trade, migration, contact, diplomacy)",
        "technology transfer (shaduf, canals, dam walls)",
        "administrative and cultural influence",
        "adaptation by receiving societies and resulting effects",
    ],
    "Late Stone Age Societies and transition to Early Iron Age": [
        "characteristics of Late Stone Age life",
        "causes of transition to Early Iron Age",
        "impact of iron technology on production and settlement",
        "continuity and change in social and political organisation",
    ],
    "States Formation in Zimbabwe": [
        "state formation and organisation features",
        "Great Zimbabwe, Mutapa, Rozvi, and Ndebele case coverage",
        "economic base (agriculture, cattle, trade, tribute)",
        "decline factors and multi-causal evaluation",
    ],
    "Causes of Slave trade": [
        "economic causes (labour demand, profit)",
        "political and military causes (conflict, raiding, power)",
        "social/structural causes (vulnerability, inequality, bondage systems)",
        "interaction between local and global drivers",
    ],
    "Triangular Slave trade": [
        "three-leg Atlantic route structure",
        "commodity flows and commercial logic",
        "Middle Passage conditions and human cost",
        "effects on Africa, Europe, and the Americas",
    ],
    "Impact of slave trade": [
        "demographic impacts",
        "social and cultural disruption",
        "economic and political consequences",
        "short-term effects vs long-term historical legacy",
    ],
    "Abolition of slave trade": [
        "causes and drivers of abolition",
        "role of abolitionists, campaigns, and resistance",
        "legal/political measures and enforcement",
        "limits of abolition and continuing coercive systems",
    ],
}

FORM_1_TEMPLATE_HINTS = {
    "Introduction to History": {
        "part_a_style": "Name/Identify any five key points (definitions or reasons).",
        "part_b_style": "Describe/Explain two major aspects in two clear paragraphs (no conclusion).",
        "part_c_style": "How far do you agree / evaluate importance with intro-body-conclusion.",
    },
    "Sources of History": {
        "part_a_style": "Name/Identify five sources or source characteristics.",
        "part_b_style": "Describe/Explain two source types with strengths/limitations in 2 paragraphs.",
        "part_c_style": "Evaluate reliability of sources and need for corroboration.",
    },
    "Types of History": {
        "part_a_style": "List/identify key features of social/political/economic history.",
        "part_b_style": "Describe differences between two history types in 2 clear paragraphs.",
        "part_c_style": "Evaluate how far combined historical types improve understanding.",
    },
    "Ancient Civilisation in Egypt": {
        "part_a_style": "Name/identify five features or contributions of Ancient Egypt.",
        "part_b_style": "Describe two major pillars of Egyptian civilisation (e.g., Nile + governance).",
        "part_c_style": "Evaluate relative importance of key development factors in Egypt.",
    },
    "Spread of Egyptian Civilisation": {
        "part_a_style": "Name five channels/models of Egyptian influence spread.",
        "part_b_style": "Describe spread mechanisms and effects in two paragraphs.",
        "part_c_style": "Evaluate how far Egyptian influence depended on local adaptation.",
    },
    "Late Stone Age Societies and transition to Early Iron Age": {
        "part_a_style": "Identify five key features of Late Stone Age and transition process.",
        "part_b_style": "Describe transition drivers and technology changes in two paragraphs.",
        "part_c_style": "Evaluate significance of transition to Early Iron Age.",
    },
    "States Formation in Zimbabwe": {
        "part_a_style": "Name five features/factors of state formation in Zimbabwe.",
        "part_b_style": "Describe organisation of selected Zimbabwean states in two paragraphs.",
        "part_c_style": "Evaluate causes of rise/decline across states in Zimbabwe.",
    },
    "Causes of Slave trade": {
        "part_a_style": "Name five causes of slave trade.",
        "part_b_style": "Describe economic and political causes in two paragraphs.",
        "part_c_style": "Evaluate relative importance of causes (economic vs other factors).",
    },
    "Triangular Slave trade": {
        "part_a_style": "Identify five features/legs/commodities of triangular trade.",
        "part_b_style": "Describe the three-leg route and trade logic in two paragraphs.",
        "part_c_style": "Evaluate how far triangular trade transformed Atlantic societies.",
    },
    "Impact of slave trade": {
        "part_a_style": "Name five impacts of slave trade.",
        "part_b_style": "Describe social and economic effects in two paragraphs.",
        "part_c_style": "Evaluate long-term consequences versus short-term effects.",
    },
    "Abolition of slave trade": {
        "part_a_style": "Identify five abolition causes/actors/measures.",
        "part_b_style": "Describe abolition process and enforcement in two paragraphs.",
        "part_c_style": "Evaluate how far abolition ended exploitation in practice.",
    },
}

FORM_2_TEMPLATE_HINTS = {
    "The Portuguese Prazo System in the Zambezi Valley": {
        "part_a_style": "Name/identify five key prazo concepts, actors, or features.",
        "part_b_style": "Describe organisation and operation of prazo system in two paragraphs.",
        "part_c_style": "Evaluate significance/effects/decline of prazo system with balanced judgment.",
    },
    "Early Missionary Activities (1850-1900)": {
        "part_a_style": "Name five missionary groups, activities, or stations.",
        "part_b_style": "Describe missionary activities/challenges in two clear paragraphs.",
        "part_c_style": "Evaluate positive versus negative missionary impact.",
    },
    "Background to the Colonisation of Zimbabwe": {
        "part_a_style": "Identify five background factors to colonisation.",
        "part_b_style": "Describe scramble context and local conditions in two paragraphs.",
        "part_c_style": "Evaluate which background factor was most decisive.",
    },
    "Process of Colonisation of Zimbabwe": {
        "part_a_style": "Identify five steps/events in occupation process.",
        "part_b_style": "Describe occupation and administrative consolidation in two paragraphs.",
        "part_c_style": "Evaluate immediate and structural consequences of occupation.",
    },
    "The Anglo-Ndebele War (1893-1894)": {
        "part_a_style": "Name five causes/events related to Anglo-Ndebele War.",
        "part_b_style": "Describe course of the war in two paragraphs.",
        "part_c_style": "Evaluate significance of war in colonial consolidation.",
    },
    "The First Chimurenga/Umvukela (1896-1897)": {
        "part_a_style": "Identify five leaders/causes/features of First Chimurenga.",
        "part_b_style": "Describe course and suppression in two paragraphs.",
        "part_c_style": "Evaluate legacy of First Chimurenga in Zimbabwean nationalism.",
    },
    "Colonial policies (1923-1979)": {
        "part_a_style": "Name five colonial policies/laws between 1923 and 1979.",
        "part_b_style": "Describe major policy effects in two paragraphs.",
        "part_c_style": "Evaluate how far colonial policies caused long-term instability.",
    },
    "Federation of Rhodesia and Nyasaland (1953-1963)": {
        "part_a_style": "Identify five facts/features of the Federation.",
        "part_b_style": "Describe formation and operation of the Federation in two paragraphs.",
        "part_c_style": "Evaluate reasons for failure of the Federation.",
    },
    "Unilateral Declaration of Independence (U.D.I.)": {
        "part_a_style": "Name five key facts/events about UDI.",
        "part_b_style": "Describe background and immediate effects of UDI in two paragraphs.",
        "part_c_style": "Evaluate significance of UDI in Zimbabwe's liberation history.",
    },
    "Rise of Nationalism": {
        "part_a_style": "Identify five causes/features of nationalist rise.",
        "part_b_style": "Describe nationalist mobilisation and leadership in two paragraphs.",
        "part_c_style": "Evaluate contribution of nationalism to liberation outcomes.",
    },
}

FORM_3_COVERAGE_HINTS = {
    "Causes of the Second Chimurenga / Armed Struggle in Zimbabwe": ["political repression and UDI context", "land/labour grievances", "regional/international influences", "multi-causal analysis"],
    "Early Phase of the Armed Struggle": ["initial operations and strategy", "early battles/campaigns", "challenges and setbacks", "significance of early phase"],
    "Second Phase of the Armed Struggle (Mobilisation Phase)": ["mass mobilisation methods", "rural political education", "organisational growth", "impact on war trajectory"],
    "Decisive Phase of the Armed Struggle (1972-1979)": ["escalation and spread", "major operations and fronts", "state response and pressure", "path to negotiation"],
    "Peace Settlements during the Armed Struggle": ["major talks/settlements", "actors and positions", "why negotiations succeeded/failed", "transition significance"],
    "Social Policies in Zimbabwe since 1990": ["education/health/welfare policies", "policy goals versus outcomes", "implementation challenges", "social impact evaluation"],
    "Political Policies in Zimbabwe since 1990": ["governance reforms and institutions", "participation and rights", "state-party dynamics", "policy impact assessment"],
    "Economic Policies in Zimbabwe since 1990": ["major policy frameworks", "stability/growth/employment outcomes", "constraints and shocks", "comparative effectiveness"],
    "Zimbabwe and the Southern African Development Community (SADC)": ["membership aims and obligations", "cooperation areas", "benefits and challenges", "regional significance"],
    "Zimbabwe and the African Union (AU)": ["AU principles/mandate", "Zimbabwe participation", "policy/security cooperation", "impact and constraints"],
    "Zimbabwe and the United Nations (UN)": ["UN organs/relevance", "Zimbabwe engagement", "development/peace roles", "benefits and tensions"],
    "Provisions of the Constitution of Zimbabwe": ["key constitutional provisions", "rights and state structure", "checks/accountability", "practical application"],
    "Child Rights and Responsibilities": ["core child rights", "related responsibilities", "legal/constitutional basis", "implementation issues"],
    "Principles of Good Governance": ["accountability/transparency", "rule of law/participation", "equity/responsiveness", "application in Zimbabwe context"],
}

FORM_3_TEMPLATE_HINTS = {
    "Causes of the Second Chimurenga / Armed Struggle in Zimbabwe": {"part_a_style": "Name five causes of the armed struggle.", "part_b_style": "Describe key causes in two paragraphs.", "part_c_style": "Evaluate which causes were most decisive."},
    "Early Phase of the Armed Struggle": {"part_a_style": "Identify five features/events of early phase.", "part_b_style": "Describe early phase developments in two paragraphs.", "part_c_style": "Evaluate significance and limitations of early phase."},
    "Second Phase of the Armed Struggle (Mobilisation Phase)": {"part_a_style": "Name five mobilisation strategies/features.", "part_b_style": "Describe mobilisation phase in two paragraphs.", "part_c_style": "Evaluate impact of mobilisation on liberation outcome."},
    "Decisive Phase of the Armed Struggle (1972-1979)": {"part_a_style": "List five key events/features of decisive phase.", "part_b_style": "Describe decisive phase dynamics in two paragraphs.", "part_c_style": "Evaluate how decisive phase shaped final settlement."},
    "Peace Settlements during the Armed Struggle": {"part_a_style": "Identify five peace talks/settlement elements.", "part_b_style": "Describe settlement process in two paragraphs.", "part_c_style": "Evaluate effectiveness of peace settlements."},
    "Social Policies in Zimbabwe since 1990": {"part_a_style": "Name five social policies/measures since 1990.", "part_b_style": "Describe social policy developments in two paragraphs.", "part_c_style": "Evaluate social policy successes and limitations."},
    "Political Policies in Zimbabwe since 1990": {"part_a_style": "Identify five political policy developments since 1990.", "part_b_style": "Describe major political policy shifts in two paragraphs.", "part_c_style": "Evaluate political policy impact on governance."},
    "Economic Policies in Zimbabwe since 1990": {"part_a_style": "Name five economic policy measures since 1990.", "part_b_style": "Describe key economic policy phases in two paragraphs.", "part_c_style": "Evaluate effectiveness of economic policies."},
    "Zimbabwe and the Southern African Development Community (SADC)": {"part_a_style": "List five aspects of Zimbabwe's SADC role.", "part_b_style": "Describe Zimbabwe-SADC cooperation in two paragraphs.", "part_c_style": "Evaluate gains and challenges of SADC membership."},
    "Zimbabwe and the African Union (AU)": {"part_a_style": "Identify five AU-related roles/obligations.", "part_b_style": "Describe Zimbabwe's AU engagement in two paragraphs.", "part_c_style": "Evaluate significance of AU cooperation for Zimbabwe."},
    "Zimbabwe and the United Nations (UN)": {"part_a_style": "Name five UN links relevant to Zimbabwe.", "part_b_style": "Describe Zimbabwe-UN engagement in two paragraphs.", "part_c_style": "Evaluate UN relationship opportunities and constraints."},
    "Provisions of the Constitution of Zimbabwe": {"part_a_style": "List five constitutional provisions.", "part_b_style": "Describe key constitutional provisions in two paragraphs.", "part_c_style": "Evaluate constitutional effectiveness in practice."},
    "Child Rights and Responsibilities": {"part_a_style": "Identify five child rights/responsibilities.", "part_b_style": "Describe rights and responsibilities in two paragraphs.", "part_c_style": "Evaluate implementation of child rights frameworks."},
    "Principles of Good Governance": {"part_a_style": "Name five principles of good governance.", "part_b_style": "Describe governance principles in two paragraphs.", "part_c_style": "Evaluate extent of good governance in practice."},
}

FORM_4_COVERAGE_HINTS = {
    "Causes of the Struggle for Independence in Southern Africa": ["colonial oppression and exclusion", "economic/social grievances", "nationalist mobilisation", "regional context and external support"],
    "The Struggle for Independence in Mozambique": ["colonial context and FRELIMO", "major phases of struggle", "external support/opposition", "outcomes and significance"],
    "The Struggle for Independence in Angola": ["colonial background and movements", "armed struggle phases", "Cold War involvement", "outcomes/challenges"],
    "The Struggle for Independence in Namibia": ["South African rule context", "SWAPO role", "international diplomacy and pressure", "independence process"],
    "The Struggle for Independence in South Africa": ["apartheid system and resistance", "internal and external struggle forms", "negotiated transition", "legacy/evaluation"],
    "Role of Liberation Movements in Southern Africa": ["movement objectives and strategy", "mass mobilisation and military roles", "regional coordination", "effectiveness and limits"],
    "Role of the International Community in Southern African Liberation": ["diplomatic pressure/sanctions", "material/political support", "UN/OAU/AU roles", "impact assessment"],
    "Effects of the Struggles for Independence in Southern Africa": ["political outcomes", "social/economic effects", "regional security implications", "long-term legacy"],
    "Causes of the First World War": ["M.A.I.N long-term causes", "alliances and Balkan tensions", "Sarajevo trigger", "cause interaction analysis"],
    "Course of the First World War": ["major fronts and phases", "trench warfare and technology", "turning points and alliances", "end of war/armistice"],
    "Effects of the First World War": ["human/economic losses", "political restructuring", "social change", "pathway to later instability"],
    "The Treaty of Versailles": ["conference aims and actors", "key treaty terms", "strengths/weaknesses", "impact on Germany/Europe"],
    "Other Post-War Treaties": ["Saint-Germain/Trianon/Neuilly/Sevres-Lausanne", "territorial/political effects", "minority disputes", "historical significance"],
    "Political Developments during the Inter-War Period": ["state system changes", "democracy vs authoritarianism", "diplomacy and collective security", "instability drivers"],
    "Economic Developments during the Inter-War Period": ["post-war recovery issues", "Great Depression dynamics", "policy responses", "political consequences"],
    "Social Developments during the Inter-War Period": ["social dislocation", "labour and class shifts", "culture/ideology changes", "links to political radicalisation"],
    "Rise of Dictatorships in Europe": ["conditions enabling dictatorships", "Mussolini/Hitler comparisons", "propaganda/repression", "impact on peace"],
    "Causes of the Second World War": ["Versailles and revisionism", "League failures", "appeasement and expansion", "immediate triggers"],
    "Course of the Second World War": ["major theatres/phases", "key turning points", "alliance dynamics", "war end and settlements"],
    "Effects of the Second World War": ["human/economic destruction", "geopolitical realignment", "decolonisation stimulus", "institutional consequences"],
    "Formation of the United Nations": ["reasons for UN formation", "UN aims/principles", "organs/structure", "early significance/limits"],
    "The Cold War - Causes": ["ideological rivalry", "post-war power vacuum", "security dilemmas/bloc formation", "early crises"],
    "The Cold War - Effects": ["proxy conflicts and arms race", "global alignment and aid", "decolonisation interactions", "long-term consequences"],
    "Decolonisation after the Second World War": ["drivers of decolonisation", "modes of transition", "role of nationalism/international pressure", "outcomes and challenges"],
}

FORM_4_TEMPLATE_HINTS = {
    "Causes of the Struggle for Independence in Southern Africa": {"part_a_style": "Name five causes of liberation struggles in Southern Africa.", "part_b_style": "Describe major causes in two paragraphs.", "part_c_style": "Evaluate most decisive causes across the region."},
    "The Struggle for Independence in Mozambique": {"part_a_style": "Identify five key Mozambique liberation facts/events.", "part_b_style": "Describe struggle phases in two paragraphs.", "part_c_style": "Evaluate significance of the Mozambican struggle."},
    "The Struggle for Independence in Angola": {"part_a_style": "List five key Angola liberation facts/events.", "part_b_style": "Describe Angola struggle dynamics in two paragraphs.", "part_c_style": "Evaluate impact of Cold War on Angola liberation."},
    "The Struggle for Independence in Namibia": {"part_a_style": "Name five key elements of Namibia struggle.", "part_b_style": "Describe Namibia independence process in two paragraphs.", "part_c_style": "Evaluate importance of international pressure in Namibia."},
    "The Struggle for Independence in South Africa": {"part_a_style": "Identify five key anti-apartheid struggle features.", "part_b_style": "Describe struggle and transition in two paragraphs.", "part_c_style": "Evaluate factors behind South Africa's transition."},
    "Role of Liberation Movements in Southern Africa": {"part_a_style": "Name five roles of liberation movements.", "part_b_style": "Describe liberation movement roles in two paragraphs.", "part_c_style": "Evaluate effectiveness of liberation movements."},
    "Role of the International Community in Southern African Liberation": {"part_a_style": "List five international support mechanisms.", "part_b_style": "Describe international role in two paragraphs.", "part_c_style": "Evaluate how far international community shaped liberation outcomes."},
    "Effects of the Struggles for Independence in Southern Africa": {"part_a_style": "Identify five effects of liberation struggles.", "part_b_style": "Describe major effects in two paragraphs.", "part_c_style": "Evaluate long-term legacy of liberation struggles."},
    "Causes of the First World War": {"part_a_style": "Name five causes of WWI.", "part_b_style": "Describe long-term and immediate causes in two paragraphs.", "part_c_style": "Evaluate relative weight of WWI causes."},
    "Course of the First World War": {"part_a_style": "List five major WWI events/phases.", "part_b_style": "Describe course of WWI in two paragraphs.", "part_c_style": "Evaluate decisive turning points of WWI."},
    "Effects of the First World War": {"part_a_style": "Name five effects of WWI.", "part_b_style": "Describe political/economic effects in two paragraphs.", "part_c_style": "Evaluate which WWI effect was most significant."},
    "The Treaty of Versailles": {"part_a_style": "Identify five terms/features of Versailles.", "part_b_style": "Describe key terms and reactions in two paragraphs.", "part_c_style": "Evaluate how far Versailles caused later conflict."},
    "Other Post-War Treaties": {"part_a_style": "Name five post-WWI treaties/terms.", "part_b_style": "Describe other post-war treaties in two paragraphs.", "part_c_style": "Evaluate effects of post-war treaties on stability."},
    "Political Developments during the Inter-War Period": {"part_a_style": "List five inter-war political developments.", "part_b_style": "Describe political developments in two paragraphs.", "part_c_style": "Evaluate political instability in inter-war Europe."},
    "Economic Developments during the Inter-War Period": {"part_a_style": "Name five inter-war economic developments.", "part_b_style": "Describe key economic developments in two paragraphs.", "part_c_style": "Evaluate impact of economic crises on politics."},
    "Social Developments during the Inter-War Period": {"part_a_style": "Identify five social changes in inter-war period.", "part_b_style": "Describe social developments in two paragraphs.", "part_c_style": "Evaluate social change and political radicalisation links."},
    "Rise of Dictatorships in Europe": {"part_a_style": "Name five factors behind rise of dictatorships.", "part_b_style": "Describe dictatorship rise in two paragraphs.", "part_c_style": "Evaluate most important factor in rise of dictatorships."},
    "Causes of the Second World War": {"part_a_style": "List five causes of WWII.", "part_b_style": "Describe key causes in two paragraphs.", "part_c_style": "Evaluate immediate triggers versus long-term causes of WWII."},
    "Course of the Second World War": {"part_a_style": "Identify five major WWII events/phases.", "part_b_style": "Describe course of WWII in two paragraphs.", "part_c_style": "Evaluate decisive turning points of WWII."},
    "Effects of the Second World War": {"part_a_style": "Name five effects of WWII.", "part_b_style": "Describe major effects in two paragraphs.", "part_c_style": "Evaluate most significant global effect of WWII."},
    "Formation of the United Nations": {"part_a_style": "List five facts about UN formation/structure.", "part_b_style": "Describe UN formation and aims in two paragraphs.", "part_c_style": "Evaluate how far UN addressed failures of League of Nations."},
    "The Cold War - Causes": {"part_a_style": "Identify five causes of the Cold War.", "part_b_style": "Describe Cold War causes in two paragraphs.", "part_c_style": "Evaluate ideological versus strategic causes of Cold War."},
    "The Cold War - Effects": {"part_a_style": "Name five effects of the Cold War.", "part_b_style": "Describe global effects in two paragraphs.", "part_c_style": "Evaluate long-term impact of the Cold War."},
    "Decolonisation after the Second World War": {"part_a_style": "List five drivers of post-WWII decolonisation.", "part_b_style": "Describe decolonisation process in two paragraphs.", "part_c_style": "Evaluate outcomes and limits of decolonisation."},
}


def _normalize_form_level(form_level: Optional[str]) -> str:
    if not form_level or not isinstance(form_level, str):
        return "Form 1"
    cleaned = form_level.strip().lower().replace("_", " ")
    if cleaned in ("form 1", "form1"):
        return "Form 1"
    if cleaned in ("form 2", "form2"):
        return "Form 2"
    if cleaned in ("form 3", "form3"):
        return "Form 3"
    if cleaned in ("form 4", "form4"):
        return "Form 4"
    return "Form 1"


def _get_form_topics(form_level: str) -> List[str]:
    return FORM_TOPIC_MAP.get(form_level, FORM_1_TOPICS)


def _normalize_topic(topic: Optional[str], form_level: str) -> str:
    allowed_topics = _get_form_topics(form_level)
    if not topic or not isinstance(topic, str):
        return allowed_topics[0]

    topic_clean = topic.strip()
    for t in allowed_topics:
        if t.lower() == topic_clean.lower():
            return t
        if t.lower().replace(" ", "_") == topic_clean.lower().replace(" ", "_"):
            return t

    # Keep the generation scoped to the selected form.
    return allowed_topics[0]


def _get_topic_hints(form_level: str, topic_name: str) -> List[str]:
    if form_level == "Form 2":
        return FORM_2_COVERAGE_HINTS.get(topic_name, _default_topic_hints(topic_name))
    if form_level == "Form 1":
        return FORM_1_COVERAGE_HINTS.get(topic_name, _default_topic_hints(topic_name))
    if form_level == "Form 3":
        return FORM_3_COVERAGE_HINTS.get(topic_name, _default_topic_hints(topic_name))
    if form_level == "Form 4":
        return FORM_4_COVERAGE_HINTS.get(topic_name, _default_topic_hints(topic_name))
    return _default_topic_hints(topic_name)


def _get_topic_template_hints(form_level: str, topic_name: str) -> Dict[str, str]:
    if form_level == "Form 1":
        return FORM_1_TEMPLATE_HINTS.get(topic_name, _default_template_hints(topic_name))
    if form_level == "Form 2":
        return FORM_2_TEMPLATE_HINTS.get(topic_name, _default_template_hints(topic_name))
    if form_level == "Form 3":
        return FORM_3_TEMPLATE_HINTS.get(topic_name, _default_template_hints(topic_name))
    if form_level == "Form 4":
        return FORM_4_TEMPLATE_HINTS.get(topic_name, _default_template_hints(topic_name))
    return _default_template_hints(topic_name)


def _default_topic_hints(topic_name: str) -> List[str]:
    return [
        f"core meaning and historical context of {topic_name}",
        "major causes/drivers and key actors",
        "main developments/process and supporting evidence",
        "effects, significance, and evaluative judgment",
    ]


def _default_template_hints(topic_name: str) -> Dict[str, str]:
    return {
        "part_a_style": f"Name/identify five key facts or points on {topic_name}.",
        "part_b_style": f"Describe/explain major developments in {topic_name} in two clear paragraphs (no conclusion).",
        "part_c_style": f"Evaluate {topic_name} using balanced argument and a final judgment.",
    }


def generate_question(
    topic: Optional[str],
    difficulty: str = "medium",
    user_id: Optional[str] = None,
    form_level: Optional[str] = "Form 1",
) -> Dict[str, Any]:
    """
    Generate one ZIMSEC-style 3-part History essay question for the given topic.

    Returns:
        Dict with: id, form_level, topic, question_text,
        parts ([{label, question_text, marks}]), total_marks (32),
        marking_notes (optional), difficulty.
    """
    normalized_form_level = _normalize_form_level(form_level)
    topic_name = _normalize_topic(topic, normalized_form_level)
    allowed_topics = _get_form_topics(normalized_form_level)
    context = f"history:essay:{normalized_form_level}:{topic_name}:{difficulty}"
    topic_hints = _get_topic_hints(normalized_form_level, topic_name)
    topic_template_hints = _get_topic_template_hints(normalized_form_level, topic_name)
    hint_text = f"Topic coverage checklist: {', '.join(topic_hints)}" if topic_hints else "Topic coverage checklist: cover breadth of syllabus points for this topic."
    template_hint_text = (
        "Topic-specific template guidance:\n"
        f"- Part [a] style: {topic_template_hints.get('part_a_style', 'Use strict list/identify pattern.')}\n"
        f"- Part [b] style: {topic_template_hints.get('part_b_style', 'Use strict describe/explain pattern.')}\n"
        f"- Part [c] style: {topic_template_hints.get('part_c_style', 'Use strict evaluate/how-far pattern.')}"
        if topic_template_hints else
        "Topic-specific template guidance: follow standard ZIMSEC 5/12/15 pattern."
    )

    prompt = f"""Generate a ZIMSEC O-Level History 3-part essay question for {normalized_form_level}.

Selected topic: **{topic_name}**
Allowed topics for this form: {", ".join(allowed_topics)}
{hint_text}
{template_hint_text}

Format (strict):
- Part [a]: One short question asking to LIST or IDENTIFY 5 items (e.g. "Name any five ..."). Worth 5 marks.
- Part [b]: One question asking to DESCRIBE or EXPLAIN (e.g. "Describe the ..."). Worth 12 marks. Answer = 2 paragraphs, NO conclusion.
- Part [c]: One analytical/evaluation question (e.g. "How far do you agree that ...?"). Worth 15 marks. Answer = intro + body + conclusion (8-10 lines).

Return ONLY this JSON (no markdown, no extra text):
{{
  "question_text": "Brief stem/context for the question (1-2 sentences).",
  "parts": [
    {{ "label": "[a]", "question_text": "...", "marks": 5 }},
    {{ "label": "[b]", "question_text": "...", "marks": 12 }},
    {{ "label": "[c]", "question_text": "...", "marks": 15 }}
  ],
  "marking_notes": "Optional short note for examiners (e.g. key expected points)."
}}"""

    full_prompt = f"{SYSTEM_MESSAGE}\n\n{prompt}"

    try:
        vertex_response = try_vertex_json(full_prompt, logger=logger, context=context)
        if vertex_response and vertex_response.get("parts") and len(vertex_response["parts"]) >= 3:
            return _build_question_payload(
                vertex_response,
                topic_name,
                difficulty,
                user_id,
                form_level=normalized_form_level,
                source="vertex_ai",
            )
    except Exception as exc:
        logger.warning("Vertex AI history question generation failed: %s", exc)

    return _get_fallback_question(topic_name, difficulty, user_id, form_level=normalized_form_level)


def _build_question_payload(
    data: Dict,
    topic_name: str,
    difficulty: str,
    user_id: Optional[str],
    form_level: str = "Form 1",
    source: str = "vertex_ai",
) -> Dict[str, Any]:
    question_text = data.get("question_text") or "Answer the following parts in ZIMSEC format."
    parts_raw = data.get("parts") or []
    parts: List[Dict[str, Any]] = []
    for i, p in enumerate(parts_raw[:3]):
        label = p.get("label") or ["[a]", "[b]", "[c]"][i]
        parts.append({
            "label": label,
            "question_text": p.get("question_text") or "",
            "marks": int(p.get("marks", [5, 12, 15][i])),
        })

    if len(parts) < 3:
        parts = [
            {"label": "[a]", "question_text": "List five key points.", "marks": 5},
            {"label": "[b]", "question_text": "Describe the main developments.", "marks": 12},
            {"label": "[c]", "question_text": "How far do you agree with the given statement?", "marks": 15},
        ]

    total_marks = sum(p["marks"] for p in parts)
    return {
        "id": str(uuid.uuid4()),
        "form_level": form_level,
        "topic": topic_name,
        "question_text": question_text,
        "parts": parts,
        "total_marks": total_marks,
        "marking_notes": data.get("marking_notes") or "",
        "difficulty": difficulty,
        "source": source,
    }


def _get_fallback_question(
    topic_name: str,
    difficulty: str,
    user_id: Optional[str],
    form_level: str = "Form 1",
) -> Dict[str, Any]:
    """Fallback 3-part question when AI is unavailable."""
    return _build_question_payload(
        {
            "question_text": f"ZIMSEC O-Level History ({form_level}): {topic_name}.",
            "parts": [
                {"label": "[a]", "question_text": f"Name any five important aspects of {topic_name}.", "marks": 5},
                {"label": "[b]", "question_text": f"Describe the main developments in {topic_name}.", "marks": 12},
                {"label": "[c]", "question_text": f"\"{topic_name} was the most important factor.\" How far do you agree?", "marks": 15},
            ],
            "marking_notes": "Mark according to ZIMSEC bands for [a] 1 mark each, [b] 12 marks, [c] 15 marks.",
        },
        topic_name,
        difficulty,
        user_id,
        form_level=form_level,
        source="fallback",
    )
