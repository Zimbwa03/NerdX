"""
ZIMSEC O-Level Principles of Commerce Syllabus structure for NerdX.
Paper 1: Multiple Choice (40 items, 30% of total).
Paper 2: Structured Questions - Section A (6 short structured) + Section B (7 essay-type, choose 3), 70% of total.

This module provides topic structure, subtopics, learning objectives, and prompt guidance
for the commerce_generator (MCQ and Essay question generation).
"""

# Syllabus meta
ZIMSEC_COMMERCE_CODE = "4008"  # ZIMSEC O-Level Principles of Commerce

PAPER_1_FOCUS = (
    "Breadth of knowledge across all 11 topics (40 MCQs, 30% of final grade). "
    "Four options (A, B, C, D), one correct answer. Cover definitions, concepts, "
    "Zimbabwe-specific examples (GMB, CCZ, SAZ, RBZ, EcoCash, NRZ, etc.)."
)

PAPER_2_FOCUS = (
    "Section A: 6 short structured questions (40 marks, compulsory). "
    "Section B: 7 essay-type questions (choose 3, 20 marks each = 60 marks). "
    "Essay structure: Introduction, Body (with subheadings), Conclusion. "
    "Use Zimbabwean context and examples where appropriate. Include essay plan and marking criteria."
)

# Ordered list of 11 ZIMSEC Commerce topics
ZIMSEC_COMMERCE_TOPICS = [
    "Production",
    "Trade",
    "Consumer Protection",
    "Business Organisations",
    "Enterprise",
    "Finance and Banking",
    "Insurance and Assurance",
    "Business Communication",
    "Transport",
    "Warehousing",
    "Marketing",
]

# Per-topic subtopics and learning objectives (from ZIMSEC syllabus MD)
ZIMSEC_COMMERCE_TOPIC_OBJECTIVES = {
    "Production": {
        "subtopics": [
            "Introduction to production: creation of goods and services; goods vs services; commerce and production",
            "Stages of production: primary, secondary, tertiary; chain of production",
            "Factors of production: Land, Labor, Capital, Entrepreneur and their rewards (rent, wages, interest, profit)",
            "Ownership of means of production: land reform, indigenisation (51% local), heritage",
            "Forms of production: direct vs indirect; mass production",
            "Division of labour and specialisation; advantages and disadvantages",
            "Value addition and beneficiation; Zimbabwe examples (cotton to textiles, tobacco processing)",
            "Business environment: internal and external; PESTEL factors",
        ],
        "learning_objectives": [
            "Define production and commerce; classify goods and services",
            "Explain primary, secondary, tertiary production with Zimbabwe examples",
            "Identify the four factors of production and their rewards",
            "Discuss land reform and indigenisation in Zimbabwe",
            "Compare direct and indirect production; explain specialisation",
            "Explain value addition and beneficiation",
            "Analyse PESTEL factors affecting businesses",
        ],
    },
    "Trade": {
        "subtopics": [
            "Introduction to trade: barter vs monetary trade; home trade vs foreign trade",
            "Wholesale trade: services, types (cash and carry, general, specialist); marketing boards (GMB)",
            "Retail trade: functions; small-scale vs large-scale; types; EPOS, e-commerce, trends",
            "Hire purchase and deferred payments; credit sale; informal credit (mukando, burial societies)",
            "Discounts: trade discount vs cash discount",
            "Documents in home trade: enquiry, quotation, order, invoice, delivery note, receipt, credit note, debit note, statement",
            "Foreign trade: visible and invisible; documents (bill of lading, certificate of origin); balance of payments; SADC, COMESA",
        ],
        "learning_objectives": [
            "Compare barter and monetary trade; home and foreign trade",
            "Explain wholesaler and retailer services",
            "Distinguish hire purchase from credit sale",
            "Identify trade documents and their purposes",
            "Explain international trade documents and trading blocs",
        ],
    },
    "Consumer Protection": {
        "subtopics": [
            "Need for consumer protection; ways consumers are exploited",
            "Consumer rights: safety, information, choice, be heard, redress, education",
            "Consumer responsibilities",
            "Organisations: CCZ (Consumer Council of Zimbabwe), SAZ (Standards Association of Zimbabwe)",
        ],
        "learning_objectives": [
            "Identify exploitation methods and reasons for protection",
            "Explain consumer rights and responsibilities",
            "Describe roles of CCZ and SAZ",
        ],
    },
    "Business Organisations": {
        "subtopics": [
            "Importance of business organisations; private vs public sector",
            "Unincorporated: sole trader, partnership (2-20); unlimited liability; Deed of Partnership",
            "Incorporated: private limited, public limited; limited liability; Memorandum and Articles of Association; ZSE",
            "Other: cooperatives, SMEs, multinationals, trade associations (ZNCC), parastatals",
        ],
        "learning_objectives": [
            "Distinguish private and public sectors",
            "Compare sole trader and partnership",
            "Explain private and public limited companies; advantages of incorporation",
            "Describe cooperatives, SMEs, multinationals",
        ],
    },
    "Enterprise": {
        "subtopics": [
            "Introduction to enterprise: entrepreneur characteristics; importance to economy",
            "Management functions: planning, organizing, leading, controlling",
            "Business ethics: honesty, integrity, fairness; unethical practices",
            "Business plan: components (executive summary, market analysis, financial projections)",
            "Intellectual property: patent, trademark, copyright, trade secret",
        ],
        "learning_objectives": [
            "Identify entrepreneur characteristics",
            "Explain the four management functions",
            "Discuss business ethics",
            "Explain business plan components",
            "Identify types of intellectual property",
        ],
    },
    "Finance and Banking": {
        "subtopics": [
            "Personal finance: income sources, saving, investment, budgeting",
            "Money: origins, characteristics, functions; inflation",
            "Managing personal finances: borrowing (overdraft, loan, trade credit); PAYE; consequences of mismanagement",
            "Banking: commercial banks (CBZ, Stanbic, FBC); services (deposits, loans, RTGS, ATMs, mobile banking)",
            "Other financial institutions: building societies (CABS), microfinance",
            "Business finance: short-term vs long-term sources",
            "Business taxation: corporate tax, VAT, PAYE, customs",
            "Reserve Bank of Zimbabwe: functions (issue currency, banker to government, monetary policy)",
            "Zimbabwe Stock Exchange",
            "Trends: mobile money (EcoCash, OneMoney), internet banking, plastic money",
        ],
        "learning_objectives": [
            "Explain personal budgeting and borrowing options",
            "Describe functions of money",
            "Explain commercial bank services",
            "Distinguish short-term and long-term business finance",
            "Describe RBZ functions",
            "Identify modern banking trends",
        ],
    },
    "Insurance and Assurance": {
        "subtopics": [
            "Nature and purpose: insurance (uncertain events) vs assurance (certain events); insurable vs non-insurable risks",
            "Communal systems: Zunde raMambo, burial societies, mukando",
            "Principles: utmost good faith, insurable interest, indemnity, contribution, subrogation, proximate cause",
            "Documents: proposal form, cover note, policy, claim form",
            "Procedures: taking insurance, making claims",
            "Types of insurance: fire, motor, marine, burglary, fidelity guarantee",
            "Types of assurance: whole life, term, endowment",
            "ICT impact on insurance",
        ],
        "learning_objectives": [
            "Distinguish insurance and assurance",
            "Identify communal insurance systems",
            "Explain principles of insurance",
            "Describe insurance documents and procedures",
            "Identify types of insurance and assurance policies",
        ],
    },
    "Business Communication": {
        "subtopics": [
            "Importance of communication; process (sender, message, medium, receiver, feedback)",
            "Telecommunication: telephone (TelOne), cell phones (Econet, NetOne, Telecel), internet",
            "Service providers: ISPs (TelOne, Africom, Liquid Telecom, ZOL)",
            "Postal services: ZimPost; registered mail, EMS, PO Box",
            "Effective communication: barriers; characteristics (clear, concise, complete)",
            "Factors in choosing communication mode",
            "Formal vs informal communication; grapevine",
            "Trends: email, video conferencing, social media, WhatsApp Business",
        ],
        "learning_objectives": [
            "Explain communication process and importance",
            "Describe telecommunication and postal services",
            "Identify barriers to communication",
            "Distinguish formal and informal communication",
            "Identify modern communication trends",
        ],
    },
    "Transport": {
        "subtopics": [
            "Importance of transport in commerce; evolution",
            "Modes: road, rail, air, water, pipeline; advantages and disadvantages",
            "Factors influencing choice of transport",
            "Documents: waybill, bill of lading, airway bill, delivery note",
            "Port authorities; Beira Corridor, Durban, Dar es Salaam",
            "Trends: containerization, GPS tracking, electric vehicles",
        ],
        "learning_objectives": [
            "Explain role of transport in commerce",
            "Compare modes of transport",
            "Identify transport documents",
            "Describe port authority roles",
            "Identify modern transport trends",
        ],
    },
    "Warehousing": {
        "subtopics": [
            "Introduction to warehousing; importance",
            "Indigenous storage: dura/isiphala, underground pits, smoke-drying",
            "Functions: storage, breaking bulk, blending, finance (warehouse receipts)",
            "Types: private, public, bonded, cold storage",
            "Location factors",
        ],
        "learning_objectives": [
            "Define warehousing and its importance",
            "Identify traditional storage methods",
            "Explain warehousing functions",
            "Classify warehouse types",
            "Identify location factors",
        ],
    },
    "Marketing": {
        "subtopics": [
            "Marketing concepts: production, product, selling, marketing, societal",
            "Types of markets: physical (Mbare Musika), virtual (e-commerce)",
            "Market segmentation: demographics, geographic, psychographic, behavioral",
            "Marketing approaches: mass, niche, differentiated",
            "Marketing mix 4Ps: Product, Price, Place, Promotion",
            "Advertising: purposes, types, media; ethics",
            "Advertising agencies",
            "Packaging and branding",
            "Advertising code of conduct",
        ],
        "learning_objectives": [
            "Explain marketing concepts",
            "Distinguish physical and virtual markets",
            "Explain market segmentation",
            "Describe the 4Ps",
            "Explain advertising purposes and ethics",
            "Explain packaging and branding",
        ],
    },
}


def get_topic_objectives(topic_name: str) -> dict:
    """
    Return subtopics and learning_objectives for a Commerce topic.
    """
    if not topic_name or not ZIMSEC_COMMERCE_TOPIC_OBJECTIVES:
        return {"subtopics": [], "learning_objectives": []}

    t = (topic_name or "").strip()

    if t in ZIMSEC_COMMERCE_TOPIC_OBJECTIVES:
        return ZIMSEC_COMMERCE_TOPIC_OBJECTIVES[t]

    # Legacy / alternative names
    legacy = {
        "business organisations": "Business Organisations",
        "business organizations": "Business Organisations",
        "finance and banking": "Finance and Banking",
        "insurance and assurance": "Insurance and Assurance",
        "business communication": "Business Communication",
    }

    key = legacy.get(t.lower(), t)
    if key in ZIMSEC_COMMERCE_TOPIC_OBJECTIVES:
        return ZIMSEC_COMMERCE_TOPIC_OBJECTIVES[key]

    for k in ZIMSEC_COMMERCE_TOPIC_OBJECTIVES:
        if t.lower() in k.lower() or k.lower() in t.lower():
            return ZIMSEC_COMMERCE_TOPIC_OBJECTIVES[k]

    return {"subtopics": [], "learning_objectives": []}


def get_paper1_prompt_guidance() -> str:
    """Guidance for Paper 1 (MCQ) style: ZIMSEC O-Level Commerce."""
    return (
        "ZIMSEC Commerce Paper 1 style: 40 multiple choice questions sampling BREADTH OF KNOWLEDGE "
        "across all 11 topics. Four options (A, B, C, D), one clear correct answer. "
        "Use Zimbabwean examples where appropriate (GMB, CCZ, SAZ, RBZ, EcoCash, NRZ, Olivine, Delta, "
        "OK Zimbabwe, TM Supermarkets, Mbare Musika). Distractors must be plausible but wrong. "
        "Align to syllabus learning objectives."
    )


def get_paper2_prompt_guidance() -> str:
    """Guidance for Paper 2 (Essay) style: ZIMSEC O-Level Commerce."""
    return (
        "ZIMSEC Commerce Paper 2 style: Essay-type questions (Section B, 20 marks each). "
        "Structure: Introduction (2 marks), Body with clear subheadings and Zimbabwean examples, Conclusion. "
        "Include essay plan with mark allocation, key terms to include, and marking criteria. "
        "Use command words: Explain, Describe, Discuss, Compare, Evaluate. "
        "Provide model answer structure and expected points for marking."
    )
