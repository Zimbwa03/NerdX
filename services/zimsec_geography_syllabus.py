"""
ZIMSEC O-Level Geography Syllabus — All Level (Forms 1–4) structure for NerdX.
Paper 1: Multiple Choice (MCQ, 40 items).
Paper 2: Structured/Data-Response (9 questions, answer 4 × 25 marks).

This module mirrors `zimsec_cs_syllabus.py` and is used ONLY for prompt-building:
- We keep the mobile UI simple: a flat list of Geography topics (no Form groupings).
- But each topic here carries the full Forms 1–4 outline as subtopics + learning objectives.
"""

# Syllabus meta
ZIMSEC_GEOGRAPHY_CODE = "2248"  # common ZIMSEC code used for O-Level Geography (can be adjusted if needed)

PAPER_1_FOCUS = (
    "Breadth of knowledge and basic skills across all topics (MCQ, 40 items, 20% of final grade). "
    "Questions sample map work, physical geography, economic geography, and population/settlement/trade."
)

PAPER_2_FOCUS = (
    "Deep understanding, data-response, and extended structured writing (4 × 25-mark questions, 40% of final grade). "
    "One compulsory question from each section (Physical, Economic, Population/Settlement/Trade) plus one free-choice."
)


# Ordered list of high-level ZIMSEC topics (used to sanity-check topic names)
ZIMSEC_GEOGRAPHY_TOPICS = [
    "Weather and Climate",
    "Landforms and Landscape Processes",
    "Ecosystems",
    "Natural Resources",
    "Energy and Power Development",
    "Map Work and Geographical Information Systems (GIS)",
    "Minerals and Mining",
    "Environmental Management",
    "Agriculture and Land Reform",
    "Industry",
    "Settlement and Population",
    "Transport and Trade",
]


# Per-topic subtopics and learning objectives, consolidated across Forms 1–4.
# These bullets are deliberately compact but rich enough for Vertex AI to generate
# exam-style questions that cover the full All-Level syllabus, not just a single Form.
ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES = {
    "Weather and Climate": {
        "subtopics": [
            # Forms 1–2: local weather elements and hazards
            "Difference between weather and climate; elements of weather (temperature, rainfall, wind, humidity, pressure, cloud cover)",
            "Weather instruments and units of measurement; siting and layout of a standard weather station (Stevenson screen, rain gauge, anemometer, barometer, wind vane, hygrometer)",
            "Recording and presenting weather data in tables, graphs, and simple synoptic maps; use of symbols",
            "Types of rainfall (relief, convectional, frontal) and their formation processes",
            "Weather hazards in Zimbabwe and the region (droughts, floods, lightning, storms) and simple mitigation/adaptation strategies",
            # Forms 3–4: regional to global climate and atmospheric systems
            "Air masses and fronts; global wind systems; pressure belts; Inter-Tropical Convergence Zone (ITCZ)",
            "World climatic regions (equatorial, tropical wet and dry, desert, Mediterranean, temperate, mountain climates) and their characteristics",
            "Interpretation of climatic graphs and maps; calculation of temperature and rainfall statistics",
            "Tropical cyclones and temperate depressions: causes, tracks, and impacts on Southern Africa",
            "Climate change: natural and human causes, evidence, impacts on Zimbabwean agriculture, water resources and settlements; adaptation and mitigation",
        ],
        "learning_objectives": [
            "Distinguish clearly between weather and climate and identify the main elements of each.",
            "Operate and interpret basic weather instruments and present weather data accurately.",
            "Explain processes leading to different rainfall types and associated weather conditions.",
            "Describe and explain the characteristics of major world climatic regions and related human activities.",
            "Assess the causes and impacts of weather hazards and climate change, with examples from Zimbabwe and Southern Africa.",
        ],
    },
    "Landforms and Landscape Processes": {
        "subtopics": [
            # Forms 1–2: rocks, weathering and simple landforms
            "Rock types and rock cycle: igneous, sedimentary, and metamorphic rocks; examples from Zimbabwe and Southern Africa",
            "Mechanical/physical weathering (freeze–thaw, exfoliation, pressure release) and chemical weathering (solution, carbonation, hydrolysis, oxidation)",
            "Relationship between climate, rock type and dominant weathering processes",
            "Granite landforms (tors, dwalas, bornhardts, castle kopjes) and limestone/karst landforms (sinkholes, caves, stalactites, stalagmites, dolines, poljes)",
            # Forms 3–4: internal structure, tectonics and fluvial/aeolian landforms
            "Internal structure of the Earth (crust, mantle, core); types of plate boundaries and plate movements",
            "Plate tectonics, folding, faulting, earthquakes and volcanoes; associated hazards and case studies",
            "River processes (erosion, transportation, deposition) and related landforms: valleys, waterfalls, gorges, meanders, floodplains, levees, deltas",
            "Coastal and aeolian processes and landforms (where applicable in regional case studies)",
            "Disaster risk management and mitigation for tectonic and geomorphic hazards",
        ],
        "learning_objectives": [
            "Classify and describe major rock types and explain the rock cycle with local examples.",
            "Explain mechanical and chemical weathering processes and relate them to climate and landform development.",
            "Describe and explain tectonic processes and associated landforms and hazards.",
            "Analyse how river and other geomorphic processes shape landscapes over time.",
            "Evaluate the impacts of geomorphic and tectonic hazards and suggest appropriate management strategies.",
        ],
    },
    "Ecosystems": {
        "subtopics": [
            # Forms 1–2: basic ecology
            "Components of ecosystems (biotic and abiotic); habitats, populations, communities; ecological niches",
            "Food chains and food webs; energy flow and trophic levels; pyramid of numbers and biomass",
            "Major biomes with emphasis on tropical grasslands/savanna, tropical rainforest, deserts and wetlands in Africa",
            "Biodiversity and its importance; threats to biodiversity (deforestation, overgrazing, pollution, invasive species)",
            # Forms 3–4: cycles, soils, and applied ecosystem management
            "Biogeochemical cycles (water, carbon, nitrogen, phosphorus) and linkages with climate and human activities",
            "Wetlands: characteristics, ecological importance, threats and conservation strategies in Zimbabwe and the region",
            "Soil as a component of the ecosystem: factors of soil formation (parent material, climate, organisms, relief, time)",
            "Soil profile horizons (O, A, B, C) and main tropical soil types; laterisation and soil degradation",
            "Sustainable ecosystem management and community-based natural resource management (CBNRM) opportunities for enterprise.",
        ],
        "learning_objectives": [
            "Describe components of ecosystems and explain how energy flows through food chains and food webs.",
            "Identify and locate major world and African biomes and relate climate, soils and vegetation.",
            "Explain the main nutrient cycles and their significance to ecosystems and human activities.",
            "Describe the formation and properties of tropical soils and relate them to land use.",
            "Assess threats to ecosystems and evaluate conservation and sustainable management strategies.",
        ],
    },
    "Natural Resources": {
        "subtopics": [
            "Definition and classification of natural resources (renewable, non-renewable, continuous); examples from Zimbabwe and Africa",
            "Resource distribution patterns at local, national and regional scales",
            "Population–resource relationships, carrying capacity and sustainable yield concepts",
            "Overexploitation and underutilisation of resources; poverty, development and resource use",
            "Principles and strategies of sustainable resource management, including community participation and policy frameworks.",
        ],
        "learning_objectives": [
            "Classify natural resources and provide relevant examples at different scales.",
            "Describe and explain spatial patterns of resource distribution in Zimbabwe and the region.",
            "Explain relationships between population, resources and carrying capacity.",
            "Discuss problems arising from unsustainable resource use and suggest management strategies.",
        ],
    },
    "Energy and Power Development": {
        "subtopics": [
            "Types and sources of energy: non-renewable (coal, oil, gas) and renewable (hydro, solar, wind, biomass, geothermal)",
            "Factors influencing the location of power stations and transmission networks",
            "Case studies of major power stations and energy projects in Zimbabwe and Southern Africa (e.g., Kariba, Hwange)",
            "Environmental and social impacts of different energy sources, including climate change and pollution",
            "Energy conservation, efficiency, and appropriate technology for rural and urban areas.",
        ],
        "learning_objectives": [
            "Identify main energy sources and describe their advantages and disadvantages.",
            "Explain factors affecting siting of power stations and routes of transmission lines.",
            "Analyse the environmental and socio-economic impacts of different energy developments.",
            "Suggest realistic energy conservation and alternative energy measures for Zimbabwe and the region.",
        ],
    },
    "Map Work and Geographical Information Systems (GIS)": {
        "subtopics": [
            # Basic map skills
            "Map elements: title, key/legend, scale, orientation, grid and index; types of maps (topographical, political, physical, thematic)",
            "Latitude and longitude; grid references (4- and 6-figure); direction and bearing",
            "Measuring distance (straight-line and along routes); area estimation; calculation of gradient and inter-visibility",
            "Relief representation using contours, spot heights, layer tinting and hachures; interpretation of landforms and drainage patterns on maps",
            "Land use, settlement patterns, communication networks and other map evidence",
            # GIS and remote sensing
            "Introduction to remote sensing (aerial photographs and satellite images) and basic image interpretation",
            "Principles of Geographic Information Systems (GIS); layers, attributes, buffers and overlays (conceptual level)",
            "Use of GPS, world time zones and simple navigation concepts",
            "Application of map work and GIS in resource management, disaster risk management and planning.",
        ],
        "learning_objectives": [
            "Demonstrate competence in using scales, grid references, bearings and gradients on maps.",
            "Interpret relief, drainage, land use and settlement information from topographical maps.",
            "Interpret basic aerial photographs and satellite images for geographical information.",
            "Explain fundamental GIS concepts and describe practical applications in Zimbabwe and the region.",
        ],
    },
    "Minerals and Mining": {
        "subtopics": [
            "Major mineral types and ores (metallic, non-metallic, energy minerals) and their distribution in Zimbabwe and Southern Africa",
            "Factors influencing the location and development of mines (geology, infrastructure, labour, markets, government policy)",
            "Mining methods: surface (open cast, strip), underground (shaft, drift), alluvial and small-scale/ artisanal mining",
            "Economic importance of mining to Zimbabwe and the region (employment, foreign currency, linkages)",
            "Environmental and social impacts of mining (land degradation, pollution, resettlement, health and safety)",
            "Sustainable mining, beneficiation, environmental impact assessment (EIA) and rehabilitation of mined areas.",
        ],
        "learning_objectives": [
            "Identify key minerals and mining areas in Zimbabwe and Southern Africa.",
            "Explain factors affecting the location and development of mining operations.",
            "Describe and compare different mining methods and their suitability for specific ores.",
            "Assess the economic, social and environmental impacts of mining activities.",
            "Discuss measures for sustainable mining and environmental rehabilitation.",
        ],
    },
    "Environmental Management": {
        "subtopics": [
            "Components of the environment (land, water, air, biota) and the concept of environmental quality",
            "Forms and causes of environmental deterioration: deforestation, soil erosion, desertification, pollution, waste management issues",
            "Global environmental issues: ozone depletion, global warming and climate change, biodiversity loss",
            "Environmental legislation and policies in Zimbabwe and international agreements (e.g., climate change conventions, biodiversity conventions)",
            "Environmental management tools: Environmental Impact Assessment (EIA), land use planning, protected areas, community-based initiatives",
            "Disaster risk reduction and climate change adaptation strategies at local and national scales.",
        ],
        "learning_objectives": [
            "Describe major forms of environmental degradation and their causes in Zimbabwe and globally.",
            "Explain the impacts of environmental problems on people, economy and ecosystems.",
            "Outline key environmental laws and policies and the roles of different stakeholders.",
            "Evaluate strategies for environmental management, conservation and disaster risk reduction.",
        ],
    },
    "Agriculture and Land Reform": {
        "subtopics": [
            "Physical and human factors influencing agriculture (climate, soils, relief, water supply, technology, markets, policy)",
            "Farming systems and types (subsistence, commercial, mixed, plantation, smallholder, urban agriculture) with Zimbabwean examples",
            "Agro-ecological zones of Zimbabwe and their agricultural potentials and limitations",
            "Land tenure systems and Zimbabwe’s land reform programme: objectives, processes and outcomes",
            "Linkages between agriculture, food security, poverty, climate change and environmental sustainability",
            "Agribusiness, value addition and opportunities for rural enterprise.",
        ],
        "learning_objectives": [
            "Explain how physical and human factors influence agricultural practices and outputs.",
            "Identify and describe major farming systems and agro-ecological zones in Zimbabwe.",
            "Discuss land tenure systems and evaluate the impacts of land reform on people and production.",
            "Analyse the relationship between agriculture, food security and environmental sustainability.",
        ],
    },
    "Industry": {
        "subtopics": [
            "Classification of industries: primary, secondary, tertiary and quaternary; formal vs informal sector",
            "Factors influencing industrial location (raw materials, power, labour, markets, transport, policy, agglomeration)",
            "Industrial regions and growth points in Zimbabwe and Southern Africa; role of Special Economic Zones (SEZs)",
            "Manufacturing industries: case studies (e.g., agro-processing, textiles, steel, cement) and their linkages to other sectors",
            "Service industries and tourism: attractions, development, impacts and sustainability issues",
            "Informal sector and small-to-medium enterprises (SMEs): roles, challenges and opportunities.",
        ],
        "learning_objectives": [
            "Classify industries and explain the roles of different industrial sectors in the economy.",
            "Describe and explain the location of key industries and industrial regions.",
            "Analyse case studies of manufacturing and service industries in Zimbabwe and the region.",
            "Evaluate the contribution and challenges of tourism, SMEs and informal sector activities.",
        ],
    },
    "Settlement and Population": {
        "subtopics": [
            "Types of settlements (rural and urban); patterns (nucleated, linear, dispersed) and functions",
            "Site and situation of settlements and factors influencing their development",
            "Urbanisation processes, causes and consequences in Zimbabwe and Africa (housing, services, employment, environment)",
            "Urban land use models and internal structure of cities; planned vs unplanned settlements",
            "Population concepts: population size, distribution, density, growth, structure and movement",
            "Population data sources (census, surveys) and presentation methods (maps, graphs, age-sex pyramids)",
            "Migration types (rural–urban, urban–rural, international, refugee) and impacts on origin and destination areas",
            "Population policies and the relationship between population, resources, development and health (including HIV/AIDS).",
        ],
        "learning_objectives": [
            "Differentiate types and patterns of rural and urban settlements and explain their functions.",
            "Describe and explain processes and consequences of urbanisation in Zimbabwe and Africa.",
            "Use and interpret population data and diagrams, including age-sex pyramids and density maps.",
            "Explain causes and effects of migration and evaluate population policies and their impacts.",
        ],
    },
    "Transport and Trade": {
        "subtopics": [
            "Modes of transport (road, rail, air, water, pipeline) and their advantages and disadvantages",
            "Transport networks in Zimbabwe and Southern Africa: major routes, corridors and bottlenecks",
            "Relationship between transport, location of economic activities and regional integration",
            "Types of trade: local, national, regional and international; visible and invisible trade; balance of trade and balance of payments (concepts)",
            "Regional trade groupings and agreements (e.g., SADC, COMESA) and their roles in development",
            "Trade imbalances, terms of trade issues for primary commodity exporters and strategies for improving trade performance.",
        ],
        "learning_objectives": [
            "Identify and compare modes of transport and assess their suitability for different goods and regions.",
            "Describe the layout and significance of transport networks in Zimbabwe and Southern Africa.",
            "Explain types and patterns of trade at different scales and basic trade terminology.",
            "Analyse the role of regional trading blocs and evaluate challenges and opportunities of trade for Zimbabwe and African countries.",
        ],
    },
}


def get_topic_objectives(topic_name: str) -> dict:
    """
    Return subtopics and learning_objectives for a Geography topic.
    Normalizes minor naming variations to ZIMSEC keys.
    """
    if not topic_name or not ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES:
        return {"subtopics": [], "learning_objectives": []}

    t = (topic_name or "").strip()

    # Exact match
    if t in ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES:
        return ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES[t]

    # Legacy / alternative display names → canonical ZIMSEC names
    legacy = {
        "landforms": "Landforms and Landscape Processes",
        "landforms and processes": "Landforms and Landscape Processes",
        "map work and gis": "Map Work and Geographical Information Systems (GIS)",
        "map work": "Map Work and Geographical Information Systems (GIS)",
        "gis": "Map Work and Geographical Information Systems (GIS)",
        "agriculture": "Agriculture and Land Reform",
        "agriculture & land reform": "Agriculture and Land Reform",
        "settlement": "Settlement and Population",
        "population": "Settlement and Population",
    }

    key = legacy.get(t.lower(), t)
    if key in ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES:
        return ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES[key]

    # Fuzzy contains match as last resort
    for k in ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES:
        if t.lower() in k.lower() or k.lower() in t.lower():
            return ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES[k]

    return {"subtopics": [], "learning_objectives": []}


def get_paper1_prompt_guidance() -> str:
    """Short guidance for Paper 1 (MCQ) style: breadth of knowledge and skills, ZIMSEC O-Level Geography."""
    return (
        "ZIMSEC Geography Paper 1 style: 40 multiple choice questions sampling BREADTH OF KNOWLEDGE and basic skills "
        "across physical, economic and human geography, plus map work. One clear correct option (A–D); distractors "
        "must be plausible but wrong. No 'all of the above'. Align to syllabus learning objectives and use "
        "Zimbabwean and regional African examples where appropriate."
    )


def get_paper2_prompt_guidance() -> str:
    """Short guidance for Paper 2 (Structured) style: deep understanding, data-response, extended answers."""
    return (
        "ZIMSEC Geography Paper 2 style: 25-mark structured/data-response questions, usually with parts (a), (b), (c) "
        "progressing from simple recall/description to explanation, application and evaluation. Parts should clearly "
        "indicate mark allocations and invite the use of case studies, diagrams or maps where relevant. Include a "
        "marking scheme that lists key points and mark distribution."
    )

