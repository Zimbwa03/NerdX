"""
ZIMSEC A-Level Geography Syllabus — Forms 5–6 structure for NerdX.
Paper 1: Physical Geography (50%)
Paper 2: Human Geography (50%)

Syllabus Code: 9156
Assessment: Knowledge & understanding, Application, Analysis, Evaluation, Practical geographic skills
"""

# Syllabus meta
ZIMSEC_A_LEVEL_GEOGRAPHY_CODE = "9156"

PAPER_1_FOCUS = (
    "Physical Geography (50% of final grade). "
    "Examines: Knowledge & understanding, Application, Analysis, Evaluation, Practical geographic skills."
)

PAPER_2_FOCUS = (
    "Human Geography (50% of final grade). "
    "Examines: Knowledge & understanding, Application, Analysis, Evaluation, Practical geographic skills."
)

ESSAY_PROMPT_GUIDANCE = (
    "ZIMSEC A-Level Geography essay questions (20-25 marks). "
    "Require extended writing (400-600 words), analysis, evaluation, and critical thinking. "
    "Use command words: Discuss, Evaluate, Assess, To what extent. "
    "Include Zimbabwean/African case studies where relevant. "
    "Focus on knowledge and written analysis (no diagram requests)."
)


# Paper 1: Physical Geography Topics
PAPER_1_TOPICS = [
    "Climatology",
    "Hydrology & Fluvial Geomorphology",
    "Geomorphology",
    "Biogeography",
]

# Paper 2: Human Geography Topics
PAPER_2_TOPICS = [
    "Population Geography",
    "Settlement Geography",
    "Agriculture & Food Production",
    "Industry, Mining & Energy",
    "Environmental Management",
]


# Per-topic subtopics, learning objectives, and case studies (Forms 5-6)
ZIMSEC_A_LEVEL_GEOGRAPHY_TOPIC_OBJECTIVES = {
    # ============================================
    # PAPER 1: PHYSICAL GEOGRAPHY
    # ============================================
    
    "Climatology": {
        "subtopics": [
            "Structure and composition of the atmosphere (troposphere, stratosphere, mesosphere, thermosphere)",
            "Heat budget of the Earth: insolation, albedo, radiation balance",
            "Global atmospheric circulation: Hadley, Ferrel, Polar cells",
            "Pressure belts and wind systems: trade winds, westerlies, polar easterlies",
            "Air masses and weather systems: source regions, characteristics",
            "Fronts: warm fronts, cold fronts, occluded fronts",
            "Tropical cyclones: formation, structure, tracks, impacts on Southern Africa",
            "Mid-latitude cyclones: formation, weather patterns",
            "Climate classification: Köppen system and its application",
            "Climate change and global warming: natural and human causes, evidence, impacts",
            "Micro-climates: urban heat island effect, rural-urban differences",
        ],
        "learning_objectives": [
            "Explain how energy is transferred within the atmosphere",
            "Analyse global wind and pressure systems and their effects",
            "Describe formation of cyclones and weather fronts",
            "Interpret climate graphs and synoptic charts",
            "Evaluate causes and impacts of climate change on agriculture, water resources, and settlements",
        ],
        "case_studies": [
            "Tropical Cyclone Idai (Zimbabwe, Mozambique, 2019)",
            "Urban heat island effect in Harare",
            "Climate variability in Southern Africa",
        ],
    },
    
    "Hydrology & Fluvial Geomorphology": {
        "subtopics": [
            "Hydrological cycle: processes, stores, flows",
            "Drainage basin systems: inputs, outputs, stores, flows",
            "Interception, infiltration, percolation: factors affecting each",
            "River discharge and hydrographs: storm hydrographs, base flow",
            "River processes: erosion (hydraulic action, abrasion, attrition, solution), transportation (traction, saltation, suspension, solution), deposition",
            "River landforms: upper course (V-shaped valleys, waterfalls, gorges), middle course (meanders, floodplains), lower course (deltas, estuaries)",
            "Flooding: causes (physical and human), impacts (social, economic, environmental), management strategies",
        ],
        "learning_objectives": [
            "Understand water movement in drainage basins",
            "Analyse hydrographs and interpret discharge patterns",
            "Explain river landform development through erosion, transportation, and deposition",
            "Evaluate flood control measures and their effectiveness",
        ],
        "case_studies": [
            "Flooding in Muzarabani (Zimbabwe)",
            "Zambezi River system",
            "Tokwe-Mukosi Dam (Zimbabwe)",
        ],
    },
    
    "Geomorphology": {
        "subtopics": [
            "Plate tectonics theory: continental drift, sea-floor spreading, plate boundaries (constructive, destructive, conservative, collision)",
            "Folding and faulting: types of folds (anticline, syncline), types of faults (normal, reverse, strike-slip)",
            "Earthquakes: causes, measurement (Richter scale, Mercalli scale), impacts, prediction",
            "Volcanoes: types (shield, composite, cinder cone), formation, distribution, hazards",
            "Weathering: physical (freeze-thaw, exfoliation, pressure release), chemical (solution, carbonation, hydrolysis, oxidation), biological",
            "Mass movement: types (rockfall, landslide, mudflow, soil creep), causes, impacts",
            "Structural landforms: fold mountains, rift valleys, block mountains",
        ],
        "learning_objectives": [
            "Explain plate tectonic theory and its evidence",
            "Describe formation of folds, faults, earthquakes, and volcanoes",
            "Analyse weathering processes and their relationship to climate and rock type",
            "Evaluate impacts of tectonic and geomorphic hazards",
        ],
        "case_studies": [
            "East African Rift Valley",
            "Great Dyke of Zimbabwe",
            "Mount Nyiragongo (DRC)",
        ],
    },
    
    "Biogeography": {
        "subtopics": [
            "Biomes: distribution, characteristics, factors affecting distribution (climate, soil, topography)",
            "Ecosystems: structure, components (biotic, abiotic), energy flow, nutrient cycling",
            "Vegetation distribution: global patterns, altitudinal zonation",
            "Succession: primary and secondary succession, climax communities",
            "Nutrient cycling: carbon cycle, nitrogen cycle, phosphorus cycle",
            "Human impact on ecosystems: deforestation, overgrazing, pollution, climate change",
        ],
        "learning_objectives": [
            "Describe global biome distribution and characteristics",
            "Explain ecosystem structure and energy flow",
            "Analyse succession processes",
            "Evaluate human impacts on ecosystems and conservation strategies",
        ],
        "case_studies": [
            "Savanna ecosystems in Zimbabwe",
            "Deforestation in Miombo woodlands",
        ],
    },
    
    # ============================================
    # PAPER 2: HUMAN GEOGRAPHY
    # ============================================
    
    "Population Geography": {
        "subtopics": [
            "Population distribution and density: factors affecting distribution (physical, economic, social, political)",
            "Population structure: age-sex pyramids, dependency ratios, demographic characteristics",
            "Fertility: crude birth rate, total fertility rate, factors affecting fertility",
            "Mortality: crude death rate, infant mortality rate, life expectancy, factors affecting mortality",
            "Migration: types (internal, international, voluntary, forced), push and pull factors, impacts",
            "Demographic Transition Model: stages, characteristics, limitations",
            "Population policies: pro-natalist, anti-natalist, examples from different countries",
        ],
        "learning_objectives": [
            "Analyse factors affecting population distribution and density",
            "Interpret population pyramids and demographic data",
            "Explain fertility, mortality, and migration patterns",
            "Evaluate population policies and their effectiveness",
        ],
        "case_studies": [
            "Population growth in Zimbabwe",
            "China's one-child policy",
            "Rural-urban migration to Harare",
        ],
    },
    
    "Settlement Geography": {
        "subtopics": [
            "Rural settlement patterns: nucleated, dispersed, linear; factors affecting patterns",
            "Urban settlement growth: urbanisation, urban sprawl, factors driving growth",
            "Urban land-use models: Burgess concentric zone, Hoyt sector, multiple nuclei",
            "Urban problems: housing shortages, traffic congestion, pollution, crime, unemployment",
            "Urban planning: strategies, sustainable urban development",
        ],
        "learning_objectives": [
            "Describe rural settlement patterns and their causes",
            "Explain urban growth processes and patterns",
            "Apply urban land-use models to real cities",
            "Evaluate urban problems and planning solutions",
        ],
        "case_studies": [
            "Growth of Harare",
            "Informal settlements in Epworth (Zimbabwe)",
        ],
    },
    
    "Agriculture & Food Production": {
        "subtopics": [
            "Types of farming: subsistence (shifting cultivation, pastoral nomadism), commercial (plantation, mixed, extensive, intensive)",
            "Factors affecting agriculture: physical (climate, soil, relief), economic (markets, transport, technology), social (land tenure, labour)",
            "Food security: definition, causes of food insecurity, strategies to improve food security",
            "Sustainable agriculture: organic farming, agroforestry, conservation agriculture",
        ],
        "learning_objectives": [
            "Compare different types of farming systems",
            "Analyse factors affecting agricultural productivity",
            "Evaluate strategies to improve food security",
            "Assess sustainability of different agricultural practices",
        ],
        "case_studies": [
            "Commercial vs communal farming in Zimbabwe",
            "Irrigation schemes (e.g., Chisumbanje)",
        ],
    },
    
    "Industry, Mining & Energy": {
        "subtopics": [
            "Industrial location theories: Weber's theory, factors affecting location (raw materials, markets, labour, transport, government policy)",
            "Manufacturing industries: types, location factors, impacts",
            "Mining and mineral exploitation: types of mining, environmental impacts, economic benefits",
            "Energy resources: renewable (hydro, solar, wind, biomass, geothermal) and non-renewable (coal, oil, gas)",
        ],
        "learning_objectives": [
            "Apply industrial location theories to real examples",
            "Analyse factors affecting industrial location",
            "Evaluate impacts of mining and energy extraction",
            "Assess sustainability of different energy sources",
        ],
        "case_studies": [
            "Gold mining in Zimbabwe",
            "Kariba Hydroelectric Power Station",
        ],
    },
    
    "Environmental Management": {
        "subtopics": [
            "Environmental degradation: deforestation, soil erosion, water pollution, air pollution, causes and impacts",
            "Conservation strategies: protected areas, sustainable resource use, community-based conservation",
            "Sustainable development: definition, principles, challenges",
            "Environmental policies: national and international, effectiveness",
        ],
        "learning_objectives": [
            "Identify causes and impacts of environmental degradation",
            "Evaluate conservation strategies",
            "Assess progress towards sustainable development",
            "Analyse effectiveness of environmental policies",
        ],
        "case_studies": [
            "Deforestation in Zimbabwe",
            "CAMPFIRE programme (Communal Areas Management Programme for Indigenous Resources)",
        ],
    },
}


def get_topic_objectives_a_level(topic_name: str) -> dict:
    """Get subtopics, learning objectives, and case studies for an A-Level Geography topic."""
    return ZIMSEC_A_LEVEL_GEOGRAPHY_TOPIC_OBJECTIVES.get(topic_name, {
        "subtopics": [],
        "learning_objectives": [],
        "case_studies": [],
    })


def get_paper1_prompt_guidance_a_level() -> str:
    """Short guidance for Paper 1 (Physical Geography) style: ZIMSEC A-Level Geography."""
    return PAPER_1_FOCUS


def get_paper2_prompt_guidance_a_level() -> str:
    """Short guidance for Paper 2 (Human Geography) style: ZIMSEC A-Level Geography."""
    return PAPER_2_FOCUS


def get_essay_prompt_guidance_a_level() -> str:
    """Guidance for essay questions: ZIMSEC A-Level Geography (20-25 marks, 400-600 words)."""
    return ESSAY_PROMPT_GUIDANCE


def get_topic_paper(topic_name: str) -> str:
    """Return 'Paper 1' or 'Paper 2' for a given topic."""
    if topic_name in PAPER_1_TOPICS:
        return "Paper 1"
    elif topic_name in PAPER_2_TOPICS:
        return "Paper 2"
    return "Paper 1"  # Default
