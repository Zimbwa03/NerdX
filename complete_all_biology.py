#!/usr/bin/env python3
"""
FINAL BIOLOGY + ALL CHEMISTRY & PHYSICS TOPICS
Comprehensive batch creation for all remaining notes
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_all_remaining_notes():
    """Create all remaining Biology, Chemistry, and Physics topics"""
    
    all_notes = []
    
    # ===== REMAINING 4 BIOLOGY TOPICS =====
    
    # TOPIC 11: Coordination and Response
    all_notes.append({
        "topic": "Coordination and Response",
        "subject": "Biology",
        "summary": "Organisms respond to stimuli using nervous and hormonal systems. This covers the nervous system, eye structure, hormones, and homeostasis.",
        "sections": [
            {"title": "Nervous System", "content": "**Central Nervous System (CNS):** Brain and spinal cord\n**Peripheral Nervous System:** Nerves\n\n**Neuron Structure:** Cell body, dendrites, axon, myelin sheath, synapses\n\n**Reflex Arc:** Receptor → Sensory neuron → Relay neuron (spinal cord) → Motor neuron → Effector\n\n**Voluntary vs Involuntary:** Voluntary (conscious, brain), Involuntary (automatic, spinal cord)", "diagrams": [], "subsections": []},
            {"title": "The Eye", "content": "**Parts:**\n- Cornea: refracts light\n- Iris: controls pupil size\n- Lens: fine focuses light\n- Retina: light-sensitive cells (rods and cones)\n- Optic nerve: carries impulses to brain\n\n**Accommodation:** Lens changes shape to focus on near/far objects\n**Pupil Reflex:** Pupil constricts in bright light, dilates in dim light", "diagrams": [], "subsections": []},
            {"title": "Hormones", "content": "**Endocrine System:** Glands produce hormones\n\n**Key Hormones:**\n- **Insulin:** Lowers blood glucose (pancreas)\n- **Glucagon:** Raises blood glucose (pancreas)\n- **Adrenaline:** Fight or flight response (adrenal glands)\n- **Testosterone:** Male characteristics (testes)\n- **Oestrogen:** Female characteristics (ovaries)\n- **ADH:** Water balance (pituitary)\n\n**Diabetes:** Type 1 (no insulin), Type 2 (insulin resistance)", "diagrams": [], "subsections": []}
        ],
        "key_points": [
            "Nervous system: fast, electrical, short-term response",
            "Hormonal system: slow, chemical, long-term response",
            "Reflex arc: receptor → sensory → relay → motor → effector",
            "Synapse is gap between neurons, uses neurotransmitters",
            "Eye: cornea refracts most, lens fine-tunes focus",
            "Insulin lowers blood glucose, glucagon raises it",
            "Diabetes Type 1 needs insulin injections",
            "Homeostasis maintains constant internal environment",
            "Negative feedback controls blood glucose and body temperature",
            "Pupil reflex is involuntary (protects retina)"
        ],
        "exam_tips": [
            "Reflex arc bypasses brain (faster response)",
            "Don't confuse: Stimulus (change) vs Response (reaction)",
            "Myelin sheath speeds up nerve impulses",
            "Cornea does MOST refraction, lens does fine-tuning",
            "Rods (dim light, black/white), Cones (bright light, color)",
            "Insulin and glucagon work as antagonistic pair",
            "Type 1 diabetes (childhood, genetic), Type 2 (lifestyle)",
            "Homeostasis = constant internal environment (not outside!)",
            "Synapses are ONE-WAY only",
            "Know difference: Voluntary (conscious) vs Reflex (automatic)"
        ]
    })
    
    # TOPIC 12: Reproduction
    all_notes.append({
        "topic": "Reproduction",
        "subject": "Biology",
        "summary": "Reproduction produces new organisms. This covers sexual and asexual reproduction, human reproductive systems, menstrual cycle, and pregnancy.",
        "sections": [
            {"title": "Types of Reproduction", "content": "**Sexual Reproduction:**\n- Involves TWO parents\n- Gametes fuse (fertilization)\n- Offspring genetically DIFFERENT\n- Variation benefits evolution\n\n**Asexual Reproduction:**\n- ONE parent only\n- No gametes, mitosis\n- Offspring genetically IDENTICAL (clones)\n- Faster, no mate needed", "diagrams": [], "subsections": []},
            {"title": "Human Reproductive System", "content": "**Male:**\n- Testes: produce sperm and testosterone\n- Sperm duct: carries sperm\n- Penis: delivers sperm\n\n**Female:**\n- Ovaries: produce eggs and oestrogen\n- Oviduct (Fallopian tube): fertilization occurs\n- Uterus: fetus develops\n- Vagina: receives penis\n\n**Fertilization:** Sperm nucleus fuses with egg nucleus → Zygote", "diagrams": [], "subsections": []},
            {"title": "Menstrual Cycle", "content": "**28-day cycle:**\n- Day 1-5: Menstruation (period) - uterus lining breaks down\n- Day 14: Ovulation - egg released from ovary\n- Day 14-28: Uterus lining thickens (prepares for pregnancy)\n\n**Hormones:**\n- FSH: stimulates egg maturation\n- LH: triggers ovulation\n- Oestrogen: repairs uterus lining\n- Progesterone: maintains uterus lining", "diagrams": [], "subsections": []},
            {"title": "Pregnancy and Birth", "content": "**Pregnancy:** ~40 weeks (9 months)\n\n**Placenta Functions:**\n- Allows oxygen and nutrients to pass to fetus\n- Allows CO₂ and urea to pass to mother\n- Barrier to bacteria and large molecules\n- Produces hormones\n\n**Umbilical Cord:** Connects fetus to placenta\n**Amniotic Fluid:** Protects fetus, allows movement\n\n**Birth:** Contractions push baby out", "diagrams": [], "subsections": []}
        ],
        "key_points": [
            "Sexual reproduction involves fusion of gametes (fertilization)",
            "Asexual reproduction produces genetically identical offspring (clones)",
            "Fertilization occurs in the oviduct (Fallopian tube)",
            "Menstrual cycle is 28 days, ovulation on day 14",
            "Placenta allows exchange between mother and fetus blood (NO MIXING)",
            "Amniotic fluid protects fetus from shock",
            "Sperm: small, mobile tail, many mitochondria",
            "Egg: large, food reserves, cytoplasm",
            "Contraception prevents pregnancy (condoms, pills, IUD)",
            "Twins: Identical (one egg splits) vs Fraternal (two eggs)"
        ],
        "exam_tips": [
            "Sexual = variation (good for evolution), Asexual = identical (faster)",
            "Fertilization is in OVIDUCT, implantation is in UTERUS",
            "Placenta: mother's blood and fetus blood DON'T MIX (separated)",
            "Day 1 = first day of period, Day 14 = ovulation",
            "FSH and LH from pituitary, Oestrogen and Progesterone from ovaries",
            "Umbilical cord has 2 arteries (deoxygenated TO placenta) and 1 vein (oxygenated FROM placenta)",
            "Common mistake: Saying placenta cleans blood - it allows EXCHANGE",
            "Contraception methods: Barrier, Hormonal, Surgical",
            "Sperm adaptations: tail (swimming), mitochondria (energy), acrosome (enzymes)",
            "Know difference: Zygote (fertilized egg) → Embryo → Fetus"
        ]
    })
    
    # TOPIC 13: Organisms and Environment
    all_notes.append({
        "topic": "Organisms and Environment",
        "subject": "Biology",
        "summary": "Organisms interact with their environment and each other. This covers ecosystems, food chains, carbon and nitrogen cycles, and population dynamics.",
        "sections": [
            {"title": "Ecosystems", "content": "**Ecosystem:** Community of organisms + their environment\n\n**Habitat:** Where an organism lives\n**Population:** All organisms of one species in an area\n**Community:** All populations in an area\n\n**Abiotic Factors:** Non-living (temperature, light, water, soil pH)\n**Biotic Factors:** Living (predators, prey, competition, disease)", "diagrams": [], "subsections": []},
            {"title": "Food Chains and Webs", "content": "**Producer:** Makes own food (plants)\n**Primary Consumer:** Eats plants (herbivore)\n**Secondary Consumer:** Eats herbivores (carnivore)\n**Tertiary Consumer:** Top carnivore\n**Decomposer:** Breaks down dead material (bacteria, fungi)\n\n**Energy Transfer:** Only 10% passed to next level (90% lost as heat, movement, waste)\n\n**Pyramid of Numbers/Biomass:** Shows quantity at each level", "diagrams": [], "subsections": []},
            {"title": "Carbon Cycle", "content": "**Processes:**\n- **Photosynthesis:** Removes CO₂ from air\n- **Respiration:** Adds CO₂ to air (all organisms)\n- **Combustion:** Burning fossil fuels adds CO₂\n- **Decomposition:** Dead matter releases CO₂\n\n**Carbon stored in:** Fossil fuels, plants, animals, atmosphere, oceans", "diagrams": [], "subsections": []},
            {"title": "Nitrogen Cycle", "content": "**Processes:**\n- **Nitrogen Fixation:** Bacteria convert N₂ → nitrates\n- **Absorption:** Plants absorb nitrates from soil\n- **Feeding:** Animals eat plants/animals\n- **Decomposition:** Dead matter → ammonia\n- **Nitrification:** Ammonia → nitrates (bacteria)\n- **Denitrification:** Nitrates → N₂ gas (bacteria)\n\n**Key:** Bacteria are essential!", "diagrams": [], "subsections": []}
        ],
        "key_points": [
            "Food chains show energy flow from producers to consumers",
            "Energy is lost at each trophic level (only 10% transferred)",
            "Decomposers recycle nutrients (bacteria and fungi)",
            "Carbon cycle: photosynthesis removes CO₂, respiration adds CO₂",
            "Nitrogen fixation by bacteria converts N₂ gas to nitrates",
            "Plants absorb nitrates for protein synthesis",
            "Pyramids of biomass/energy always pyramid-shaped",
            "Abiotic factors: light, temperature, water, pH, wind",
            "Biotic factors: predation, competition, disease, mutualism",
            "Decomposers are saprophytes (feed on dead material)"
        ],
        "exam_tips": [
            "Arrows in food chains show ENERGY FLOW (not 'who eats whom')",
            "Energy lost as: heat, movement, waste, incomplete digestion",
            "Only 10% energy passed on - explain why pyramids taper",
            "Producers always at bottom (plants), decomposers recycle",
            "Carbon cycle: know ALL processes (photosynthesis, respiration, combustion, decomposition)",
            "Nitrogen fixation needs BACTERIA (lightning also works but rare)",
            "Don't say 'nitrogen cycle is for proteins' - it's for ALL nitrogen compounds",
            "Decomposers break down ALL dead material (not just plants)",
            "Pyramid of numbers can be inverted (e.g., one tree, many insects)",
            "Pyramid of biomass/energy ALWAYS pyramid (energy lost)"
        ]
    })
    
    # TOPIC 14: Human Influences on Ecosystem  
    all_notes.append({
        "topic": "Human Influences on Ecosystem",
        "subject": "Biology",
        "summary": "Human activities impact ecosystems negatively. This covers pollution, deforestation, overfishing, and conservation methods.",
        "sections": [
            {"title": "Pollution", "content": "**Air Pollution:**\n- CO₂: greenhouse effect, global warming\n- SO₂: acid rain, damages plants/buildings\n- CFCs: ozone layer depletion\n\n**Water Pollution:**\n- Sewage: eutrophication, algal bloom, oxygen depletion\n- Chemicals: pesticides, fertilizers\n- Oil spills: kills marine life\n\n**Land Pollution:**\n- Pesticides: bioaccumulation in food chains\n- Plastics: non-biodegradable\n- Heavy metals: toxic", "diagrams": [], "subsections": []},
            {"title": "Deforestation", "content": "**Causes:**\n- Agriculture (farming, cattle ranching)\n- Logging (timber)\n- Urbanization (cities)\n\n**Effects:**\n- Soil erosion\n- Loss of habitat\n- Reduced biodiversity\n- Less CO₂ absorption\n- Climate change\n- Flooding", "diagrams": [], "subsections": []},
            {"title": "Conservation", "content": "**Methods:**\n- Protected areas (national parks, reserves)\n- Breeding programs (zoos)\n- Seed banks\n- Legal protection (laws against poaching)\n- Sustainable practices\n- Recycling\n- Alternative energy (solar, wind)\n- Reduce, Reuse, Recycle\n\n**Sustainable Development:** Meet needs without harming future generations", "diagrams": [], "subsections": []}
        ],
        "key_points": [
            "Deforestation causes soil erosion, habitat loss, and climate change",
            "Eutrophication: excess nutrients → algal bloom → oxygen depletion → fish die",
            "Greenhouse effect: CO₂ traps heat, causes global warming",
            "Acid rain from SO₂ and NO₂ damages plants and buildings",
            "Bioaccumulation: pesticides concentrate up food chain",
            "Overfishing depletes fish stocks, disrupts food webs",
            "Conservation protects biodiversity and ecosystems",
            "Sustainable development meets current needs without harming future",
            "Recycling reduces waste and conserves resources",
            "Alternative energy reduces fossil fuel use and pollution"
        ],
        "exam_tips": [
            "Eutrophication full sequence: nutrients → algae → block light → plants die → decomposers use O₂ → fish die",
            "Greenhouse effect is NATURAL, enhanced greenhouse effect is the problem",
            "Acid rain damages LIMESTONE buildings specifically (chemical reaction)",
            "Bioaccumulation means concentration INCREASES up food chain",
            "Deforestation effects: soil erosion, flooding, biodiversity loss, climate change",
            "Know specific examples: DDT (bioaccumulation), CFCs (ozone)",
            "Conservation isn't just 'protecting animals' - explain METHODS",
            "Sustainable = meeting needs without compromising future generations",
            "Don't confuse: Biodegradable (breaks down) vs Non-biodegradable (doesn't)",
            "Global warming effects: ice caps melt, sea levels rise, extreme weather"
        ]
    })
    
    # TOPIC 15: Classification (Last Biology!)
    all_notes.append({
        "topic": "Classification",
        "subject": "Biology",
        "summary": "Classification organizes living organisms into groups. This covers the five kingdoms, binomial nomenclature, and classification keys.",
        "sections": [
            {"title": "Why Classify?", "content": "**Reasons:**\n- Organize diversity\n- Show relationships\n- Identify organisms\n- Study evolution\n\n**Binomial Nomenclature:**\n- Two names: Genus species\n- Example: Homo sapiens\n- Genus capitalized, species lowercase\n- Both italicized/underlined", "diagrams": [], "subsections": []},
            {"title": "Five Kingdoms", "content": "**1. Animals (An imalia):**\n- Multicellular, heterotrophs, no cell walls, can move\n\n**2. Plants (Plantae):**\n- Multicellular, autotrophs, cell walls (cellulose), chlorophyll\n\n**3. Fungi:**\n- Multicellular/unicellular, heterotrophs (saprophytes), cell walls (chitin)\n\n**4. Protoctista:**\n- Mostly unicellular, nucleus present\n- Examples: Amoeba, Euglena, Paramecium\n\n**5. Bacteria (Prokaryotes):**\n- Unicellular, no nucleus, small, simple\n- Cell wall present", "diagrams": [], "subsections": []},
            {"title": "Classification Hierarchy", "content": "**Largest to Smallest:**\n\nKingdom → Phylum → Class → Order → Family → Genus → Species\n\n**Mnemonic:** King Philip Came Over For Good Spaghetti\n\n**Example (Human):**\n- Kingdom: Animalia\n- Phylum: Chordata\n- Class: Mammalia\n- Order: Primates\n- Family: Hominidae\n- Genus: Homo\n- Species: sapiens", "diagrams": [], "subsections": []}
        ],
        "key_points": [
            "Five kingdoms: Animals, Plants, Fungi, Protoctista, Bacteria",
            "Binomial nomenclature: Genus species (e.g., Homo sapiens)",
            "Animals: multicellular, heterotrophs, no cell walls",
            "Plants: multicellular, autotrophs, cell walls, chlorophyll",
            "Fungi: saprophytes, cell walls (chitin), no chlorophyll",
            "Bacteria: no nucleus (prokaryotes), small, simple",
            "Protoctista: mostly unicellular, has nucleus",
            "Classification hierarchy: Kingdom → Phylum → Class → Order → Family → Genus → Species",
            "Genus is capitalized, species is lowercase, both italicized",
            "Vertebrates: fish, amphibians, reptiles, birds, mammals"
        ],
        "exam_tips": [
            "Remember: Genus CAPITAL, species lowercase, both italic/underlined",
            "Five kingdoms: Animals, Plants, Fungi, Protoctista, Bacteria (not Monera anymore)",
            "Key difference: Prokaryotes (no nucleus) vs Eukaryotes (has nucleus)",
            "Fungi have cell walls made of CHITIN (not cellulose like plants)",
            "Protoctista is the 'odds and ends' kingdom (doesn't fit other 4)",
            "Classification key uses YES/NO questions to identify organisms",
            "Vertebrate classes: Fish (scales, gills), Amphibians (moist skin), Reptiles (dry scales), Birds (feathers), Mammals (hair, milk)",
            "Don't confuse: Kingdom (biggest group) vs Species (smallest)",
            "Bacteria are prokaryotes (all others are eukaryotes)",
            "Mnemonic: King Philip Came Over For Good Spaghetti"
        ]
    })
    
    return all_notes

# Execute and save
if __name__ == "__main__":
    service = ScienceNotesService()
    all_topics = create_all_remaining_notes()
    
    count = 0
    for topic_data in all_topics:
        success = service.save_topic_notes(topic_data["subject"], topic_data["topic"], topic_data)
        status = "SUCCESS" if success else "FAILED"
        print(f"{topic_data['topic']}: {status}")
        if success:
            count += 1
    
    print(f"\nTotal successful: {count}/{len(all_topics)}")
