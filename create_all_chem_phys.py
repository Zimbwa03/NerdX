#!/usr/bin/env python3
"""
ALL CHEMISTRY & PHYSICS TOPICS - Final Batch
Creates all 11 Chemistry + 5 Physics topics with comprehensive ZIMSEC content
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_all_chemistry_physics():
    """Create all Chemistry and Physics topics"""
    
    all_topics = []
    
    # ========== CHEMISTRY TOPICS (11) ==========
    
    # Chemistry 1: Experimental Chemistry
    all_topics.append({
        "topic": "Experimental Chemistry",
        "subject": "Chemistry",
        "summary": "Laboratory techniques and skills for conducting chemistry experiments safely and accurately.",
        "sections": [
            {"title": "Lab Safety", "content": "**Safety Rules:**\n- Wear safety goggles and lab coat\n- Tie back long hair\n- No eating/drinking in lab\n- Know location of fire extinguisher, first aid\n- Handle chemicals carefully\n- Follow instructions exactly\n\n**Hazard Symbols:** Corrosive, Flammable, Toxic, Oxidizing, Harmful", "diagrams": [], "subsections": []},
            {"title": "Separation Techniques", "content": "**Filtration:** Separate insoluble solid from liquid\n**Evaporation:** Obtain solid from solution\n**Crystallization:** Obtain pure crystals\n**Distillation:** Separate liquids with different boiling points\n**Fractional Distillation:** Separate miscible liquids\n**Chromatography:** Separate colored substances\n\n**When to use:** Choose based on mixture type and properties", "diagrams": [], "subsections": []},
            {"title": "Measuring", "content": "**Apparatus:**\n- Measuring cylinder: ±1 cm³\n- Pipette: ±0.1 cm³ (accurate)\n- Burette: ±0.05 cm³ (most accurate)\n- Balance: mass measurement\n\n**Reading meniscus:** Read at eye level, bottom of curve", "diagrams": [], "subsections": []}
        ],
        "key_points": ["Filtration separates insoluble solid from liquid", "Distillation separates liquids by boiling point", "Always read burette/measuring cylinder at eye level (meniscus)", "Crystallization produces pure crystals from solution", "Chromatography separates colored mixtures", "Wear safety goggles at all times in lab", "Bunsen burner: blue flame (hot), yellow flame (luminous, less hot)", "Pipette more accurate than measuring cylinder", "Evaporation leaves solid residue, distillation collects liquid", "Know hazard symbols: corrosive, toxic, flammable, oxidizing"],
        "exam_tips": ["For separation methods, state WHICH technique and WHY it's suitable", "Mention safety precautions in practicals (goggles, heat carefully, etc.)", "Chromatography: Rf value = distance moved by substance / distance moved by solvent", "Don't confuse: Evaporation (collect solid) vs Distillation (collect liquid)", "Reading meniscus: bottom of curve for colorless liquids", "Burette reading: record to 2 decimal places (e.g., 25.30 cm³)", "Common mistake: Saying 'filter to remove liquid' - filter to remove SOLID", "For distillation, mention: thermometer at top, water in condenser flows UP", "Pure substance has sharp melting point, mixture has range", "Know when to use fractional distillation vs simple distillation"]
    })
    
    # Chemistry 2-11: Remaining Chemistry topics (condensed for efficiency)
    chemistry_topics = [
        {
            "topic": "Particulate Nature of Matter",
            "summary": "Matter is made of tiny particles. This covers states of matter, kinetic theory, and changes of state.",
            "key_points": ["Three states: solid (fixed shape, fixed volume), liquid (no fixed shape, fixed volume), gas (no fixed shape, no fixed volume)", "Particles in solid: vibrate, close together, strong forces", "Particles in liquid: move around, close together, weaker forces", "Particles in gas: move freely, far apart, very weak forces", "Melting: solid → liquid (heat absorbed)", "Boiling: liquid → gas (heat absorbed)", "Condensation: gas → liquid (heat released)", "Freezing: liquid → solid (heat released)", "Diffusion faster at higher temperature (more kinetic energy)", "Brownian motion proves particles are moving randomly"],
            "exam_tips": ["Diagram: draw particles as circles/spheres", "Solid particles vibrate but DON'T move position", "Gas particles are FAR APART (not just 'further apart')", "Evaporation happens at ANY temperature, boiling at specific temperature", "Sublimation: solid → gas directly (e.g., dry ice, iodine)", "Diffusion is passive (no energy input needed)", "Don't say 'particles get bigger when heated' - they move FASTER", "Kinetic energy increases with temperature", "Pressure of gas due to particles hitting walls", "Know difference: Evaporation (surface only) vs Boiling (throughout liquid)"]
        },
        {
            "topic": "Formulae and Stoichiometry",
            "summary": "Chemical formulae show composition. Stoichiometry deals with quantities in reactions.",
            "key_points": ["Relative atomic mass (Ar) from periodic table", "Relative molecular mass (Mr) = sum of Ar of all atoms", "Mole = 6.02 × 10²³ particles (Avogadro's number)", "Moles = mass / Mr", "Empirical formula: simplest whole number ratio", "Molecular formula: actual number of atoms", "Balanced equations: same atoms on both sides", "Coefficients show mole ratios", "Percentage composition = (mass of element / total mass) × 100", "Limiting reactant is the one that runs out first"],
            "exam_tips": ["Always balance equations - check each element", "Mole calculations: moles = mass/Mr, mass = moles × Mr", "Empirical formula: divide by smallest, then multiply to get whole numbers", "State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous", "In calculations, show working (formula, substitution, answer with units)", "Don't forget to include multipliers from equation in mole ratio", "Percentage yield = (actual/theoretical) × 100", "Know the difference: Empirical (simplest) vs Molecular (actual)", "For limiting reactant, calculate which gives LESS product", "Concentration = moles / volume(dm³) or mass / volume"]
        },
        {
            "topic": "Electrolysis",
            "summary": "Electrolysis is decomposition using electricity. Covers electrolysis of molten compounds and aqueous solutions.",
            "key_points": ["Electrolysis: decomposition using electric current", "Electrolyte: conducts electricity when molten/dissolved", "Cathode (negative): attracts cations (positive ions), reduction", "Anode (positive): attracts anions (negative ions), oxidation", "Molten electrolysis: metal at cathode, non-metal at anode", "Aqueous electrolysis: depends on reactivity (H₂ or metal at cathode, O₂ or halogen at anode)", "Oxidation: loss of electrons", "Reduction: gain of electrons (OIL RIG)", "Electroplating: coating with metal using electrolysis", "Purification of copper using electrolysis"],
            "exam_tips": ["Remember: Cathode = Negative (attracts Cations), Anode = Positive (attracts Anions)", "OIL RIG: Oxidation Is Loss (electrons), Reduction Is Gain", "For aqueous: less reactive metal or H₂; halogen or O₂", "Half equations must balance for atoms AND charges", "Common mistake: Confusing which electrode is which", "Electroplating: object to plate is cathode, pure metal is anode", "For copper purification: impure copper anode, pure copper cathode", "Electrolysis of brine produces Cl₂, H₂, and NaOH", "Molten lead bromide: Pb at cathode, Br₂ at anode", "Always state symbols in half equations"]
        },
        {
            "topic": "Energy from Chemicals",
            "summary": "Chemical reactions involve energy changes. Covers exothermic and endothermic reactions.",
            "key_points": ["Exothermic: releases heat (temperature increases)", "Endothermic: absorbs heat (temperature decreases)", "Combustion is exothermic (burning releases heat)", "Neutralization is exothermic", "Thermal decomposition usually endothermic", "Energy profile diagrams show energy change", "Activation energy: minimum energy needed to start reaction", "Bond breaking requires energy (endothermic)", "Bond making releases energy (exothermic)", "Overall energy change = bonds broken - bonds made"],
            "exam_tips": ["Exothermic: products have LESS energy than reactants (energy released)", "Endothermic: products have MORE energy than reactants (energy absorbed)", "Activation energy is the 'hump' on energy profile diagram", "Don't confuse: Energy needed to break bonds vs energy released when making bonds", "Examples: Exo (combustion, neutralization, respiration), Endo (photosynthesis, thermal decomposition)", "Temperature change exothermic = UP, endothermic = DOWN", "Catalyst lowers activation energy (provides alternative pathway)", "Energy profile: reactants on left, products on right, peak is activation energy", "All combustion reactions are exothermic", "Self-heating cans use exothermic reaction"]
        },
        {
            "topic": "Chemical Reactions",
            "summary": "Types of chemical reactions and factors affecting reaction rates.",
            "key_points": ["Types: Synthesis, Decomposition, Displacement, Neutralization, Combustion", "Rate of reaction: how fast reactants turn into products", "Factors affecting rate: temperature, concentration, surface area, catalyst, pressure (gases)", "Higher temperature = faster rate (more kinetic energy, more collisions)", "Higher concentration = faster rate (more particles, more collisions)", "Larger surface area = faster rate (more exposed particles)", "Catalyst speeds up reaction without being used up", "Collision theory: particles must collide with enough energy", "Measuring rate: gas volume, mass change, color change, time for precipitate", "Reversible reactions can go both ways (⇌)"],
            "exam_tips": ["For factors, explain HOW they affect rate (more collisions with energy > activation)", "Higher surface area: powder reacts faster than lump (same mass)", "Catalyst lowers activation energy, increases rate, NOT used up", "Temperature increase has biggest effect on rate", "Graph: steeper slope = faster rate, levels off when reaction complete", "Don't say 'particles move faster so react faster' - say 'more frequent and energetic collisions'", "Catalyst examples: MnO₂ (H₂O₂ decomposition), Fe (Haber process)", "Reversible reaction: forward and backward occur simultaneously at equilibrium", "For experiments, control variables (same mass, volume, temperature)", "Rate can be measured as: 1/time or change/time"]
        },
        {
            "topic": "Acids, Bases and Salts",
            "summary": "Properties of acids and bases, neutralization, and salt formation.",
            "key_points": ["Acid: produces H⁺ ions in water, pH < 7", "Base: accepts H⁺ ions or produces OH⁻ ions, pH > 7", "Alkali: soluble base", "Neutralization: Acid + Base → Salt + Water", "Indicators: litmus (red in acid, blue in alkali), universal indicator (full pH scale), phenolphthalein (colorless in acid, pink in alkali)", "Strong acid: fully ionized (HCl, H₂SO₄, HNO₃)", "Weak acid: partially ionized (CH₃COOH, citric acid)", "Salt formation: Acid + Metal → Salt + H₂, Acid + Base → Salt + Water, Acid + Carbonate → Salt + Water + CO₂", "pH scale: 0-14, 7 is neutral, <7 acidic, >7 alkaline", "Titration: find concentration using neutralization"],
            "exam_tips": ["Neutralization word equation: Acid + Base → Salt + Water", "Salt name: metal from base + acid name (e.g., sodium chloride from NaOH + HCl)", "For salt name: -chloride (HCl), -sulfate (H₂SO₄), -nitrate (HNO₃)", "Don't confuse: Base (any) vs Alkali (soluble base only)", "Strong acid ≠ concentrated acid (different concepts)", "Universal indicator: red (acidic), green (neutral), purple (alkaline)", "Carbonate test: add acid, if fizzes and produces CO₂, it's a carbonate", "Titration: use burette, pipette, phenolphthalein/methyl orange", "pH 1 is VERY acidic, pH 14 is VERY alkaline", "Common acids: HCl (hydrochloric), H₂SO₄ (sulfuric), HNO₃ (nitric), CH₃COOH (ethanoic)"]
        },
        {
            "topic": "Periodic Table",
            "summary": "Organization of elements and periodic trends.",
            "key_points": ["Elements arranged by atomic number", "Groups: vertical columns (same valence electrons)", "Periods: horizontal rows (same number of shells)", "Group 1 (Alkali metals): soft, reactive, +1 charge, reactivity increases down group", "Group 7 (Halogens): reactive non-metals, -1 charge, reactivity decreases down group", "Group 0 (Noble gases): unreactive, full outer shell", "Metals: left side, conduct electricity, malleable, ductile", "Non-metals: right side, don't conduct (except graphite), brittle", "Transition metals: middle block, colored compounds, catalysts, variable oxidation states", "Periodic trends: atomic size increases down group, reactivity of metals increases down group"],
            "exam_tips": ["Group number = number of valence electrons (for main groups)", "Period number = number of electron shells", "Group 1: Li, Na, K (reactivity increases, density increases, melting point decreases)", "Group 7: F₂, Cl₂, Br₂, I₂ (reactivity decreases, boiling point increases)", "Group 0: He, Ne, Ar, Kr (unreactive due to full outer shell)", "Alkali metals stored in oil (prevent reaction with air/water)", "Halogens: F (lightest, most reactive), I (heaviest, least reactive)", "Displacement: more reactive halogen displaces less reactive", "Noble gases: single atoms, don't form compounds (very stable)", "Transition metals: Fe, Cu, Ni (form colored ions, good catalysts)"]
        },
        {
            "topic": "Metals",
            "summary": "Properties, extraction, and reactivity of metals.",
            "key_points": ["Metals: good conductors, malleable, ductile, shiny, high melting points", "Reactivity series: K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au", "More reactive metals displace less reactive from compounds", "Extraction: reactive metals by electrolysis, less reactive by reduction with carbon", "Oxidation: metal loses electrons to form positive ions", "Corrosion: reaction with oxygen/water (rust for iron)", "Rust prevention: painting, oiling, galvanizing, alloying", "Alloys: mixtures of metals (stronger than pure metals)", "Examples: Steel (Fe + C), Brass (Cu + Zn), Bronze (Cu + Sn)", "Metal + Acid → Salt + H₂, Metal + Water → Metal hydroxide + H₂"],
            "exam_tips": ["Reactivity series mnemonic: Please Send Charlie's Monkeys And Zebras Instead Carrying Heavy Copper/Silver Guns", "More reactive displaces less reactive in displacement reactions", "Carbon is between Al and Zn in reactivity (used for extraction)", "Metals above carbon extracted by electrolysis (expensive)", "Metals below carbon extracted by reduction with carbon (cheaper)", "Rusting needs BOTH oxygen AND water", "Galvanizing: coating with zinc (zinc corrodes instead of iron)", "Sacrificial protection: more reactive metal corrodes instead", "Alloys are harder/stronger than pure metals (atoms different sizes)", "For extraction, state: how reactive metal is and method used"]
        },
        {
            "topic": "Chemistry of Environment",
            "summary": "Environmental chemistry including air, water, and pollution.",
            "key_points": ["Air composition: 78% N₂, 21% O₂, 0.04% CO₂, 1% noble gases, variable water vapor", "Water cycle: evaporation, condensation, precipitation", "Water treatment: filtration, chlorination, fluoridation", "Air pollution: CO₂ (greenhouse effect), SO₂ (acid rain), CO (toxic), NO₂ (acid rain)", "Greenhouse effect: CO₂, CH₄ trap heat, cause global warming", "Acid rain: SO₂ + NO₂ + water form acids, damage buildings/plants/aquatic life", "Water pollution: sewage, fertilizers (eutrophication), pesticides, oil", "Carbon monoxide from incomplete combustion (toxic, prevents oxygen transport)", "Tests: Oxygen (relights glowing splint), CO₂ (lime water turns milky)", "Recycling reduces pollution and conserves resources"],
            "exam_tips": ["Greenhouse gases: CO₂, CH₄, water vapor", "Greenhouse effect is natural, enhanced greenhouse effect is the problem", "Acid rain equation: SO₂ + O₂ + H₂O → H₂SO₄", "CO₂ test: limewater turns milky/cloudy", "O₂ test: relights glowing splint", "H₂ test: squeaky pop with lighted splint", "Complete combustion: hydrocarbon + O₂ → CO₂ + H₂O", "Incomplete combustion: insufficient O₂ → CO (and C soot)", "Water treatment: filtration removes solid, chlorination kills bacteria", "Eutrophication: excess nutrients → algae → block light → plants die → bacteria → O₂ depletion"]
        },
        {
            "topic": "Organic Chemistry",
            "summary": "Carbon compounds including alkanes, alkenes, and alcohols.",
            "key_points": ["Hydrocarbons: compounds containing only C and H", "Alkanes: single bonds, CₙH₂ₙ₊₂ (saturated)", "Alkenes: double bond C=C, CₙH₂ₙ (unsaturated)", "Alkanes: methane (CH₄), ethane (C₂H₆), propane (C₃H₈), butane (C₄H₁₀)", "Alkenes: ethene (C₂H₄), propene (C₃H₆)", "Alkanes unreactive, alkenes reactive (due to C=C)", "Test for alkenes: bromine water decolorizes", "Alcohols: contain -OH group, methanol (CH₃OH), ethanol (C₂H₅OH)", "Fermentation: glucose → ethanol + CO₂ (using yeast)", "Combustion of alkanes: hydrocarbon + O₂ → CO₂ + H₂O + energy"],
            "exam_tips": ["Alkanes saturated (single bonds), alkenes unsaturated (double bond)", "General formula: Alkanes CₙH₂ₙ₊₂, Alkenes CₙH₂ₙ, Alcohols CₙH₂ₙ₊₁OH", "Bromine water test: decolorizes with alkene, stays orange with alkane", "Fermentation needs: yeast, warmth (~30°C), anaerobic (no oxygen)", "Ethanol uses: alcoholic drinks, fuel, solvent", "Alkanes are main components of crude oil/natural gas", "Cracking: long chain alkanes → shorter alkanes + alkenes", "Polymers from alkenes: poly(ethene) from ethene", "Don't confuse: Alkane (saturated) vs Alkene (unsaturated)", "Combustion products: complete (CO₂ + H₂O), incomplete (CO + C)"]
        }
    ]
    
    # Add remaining chemistry topics with full structure
    for chem in chemistry_topics:
        all_topics.append({
            "topic": chem["topic"],
            "subject": "Chemistry",
            "summary": chem["summary"],
            "sections": [{"title": "Key Concepts", "content": "\n".join([f"- {point}" for point in chem["key_points"]]), "diagrams": [], "subsections": []}],
            "key_points": chem["key_points"],
            "exam_tips": chem["exam_tips"]
        })
    
    # ========== PHYSICS TOPICS (5) ==========
    
    physics_topics = [
        {
            "topic": "Motion, Forces and Energy",
            "summary": "Movement, forces, work, energy, and power.",
            "key_points": ["Speed = distance / time", "Velocity: speed with direction", "Acceleration = change in velocity / time", "Force causes change in motion (Newton's laws)", "Newton's 1st Law: object continues in motion unless force acts", "Newton's 2nd Law: F = ma", "Newton's 3rd Law: every action has equal and opposite reaction", "Weight = mass × gravity (W = mg, g = 10 m/s² on Earth)", "Work = force × distance (W = Fd)", "Energy: kinetic (movement), potential (position), cannot be created/destroyed"],
            "exam_tips": ["Speed units: m/s or km/h (convert if needed)", "Acceleration is change in velocity per second (can be negative = deceleration)", "Weight is a force (N), mass is amount of matter (kg)", "F = ma: rearrange for m = F/a or a = F/m", "Distance-time graph: gradient = speed", "Velocity-time graph: gradient = acceleration, area under = distance", "Work done in joules (J) = force (N) × distance (m)", "Don't confuse: Distance (total) vs Displacement (straight line)", "Kinetic energy = ½mv², Potential energy = mgh", "Power = work / time or energy / time (watts)"]
        },
        {
            "topic": "Thermal Physics",
            "summary": "Heat, temperature, and thermal energy transfer.",
            "key_points": ["Temperature: measure of average kinetic energy of particles", "Heat: thermal energy transfer from hot to cold", "Conduction: heat transfer through solids (particles vibrate)", "Convection: heat transfer in fluids (hot fluid rises, cold sinks)", "Radiation: heat transfer by infrared waves (no medium needed)", "Metals good conductors (free electrons), non-metals poor (insulators)", "Specific heat capacity: energy needed to raise 1kg by 1°C", "Q = mcΔT (energy = mass × specific heat × temperature change)", "Expansion: solids/liquids/gases expand when heated", "Applications: bimetallic strip, thermometer, gap in bridges"],
            "exam_tips": ["Heat flows from hot to cold (until thermal equilibrium)", "Conduction: metals best (free electrons carry energy)", "Convection: liquids and gases only (particles move)", "Radiation: travels through vacuum (doesn't need particles)", "Dark surfaces: good absorbers and emitters of radiation", "Shiny surfaces: poor absorbers and emitters, good reflectors", "Thermos flask reduces heat transfer by all three methods", "Specific heat capacity: water = 4200 J/kg°C (high)", "In calculations, ΔT = final temp - initial temp", "Expansion: gaps in bridges, railway tracks, overhead wires"]
        },
        {
            "topic": "Waves",
            "summary": "Wave properties, sound, and light.",
            "key_points": ["Transverse wave: oscillations perpendicular to direction (light, water)", "Longitudinal wave: oscillations parallel to direction (sound)", "Wavelength (λ): distance between consecutive crests", "Frequency (f): number of waves per second (Hz)", "Amplitude: maximum displacement from rest", "Wave equation: v = fλ (speed = frequency × wavelength)", "Reflection: angle of incidence = angle of reflection", "Refraction: bending of light when entering different medium", "Total internal reflection: light reflects inside medium (critical angle)", "Applications: fiber optics, periscope, mirrors"],
            "exam_tips": ["Wave speed v = fλ, rearrange: f = v/λ or λ = v/f", "Sound travels faster in solids > liquids > gases (particles closer)", "Light travels at 3 × 10⁸ m/s in vacuum", "Reflection: angle of incidence = angle of reflection (measure from normal)", "Refraction: light bends towards normal when entering denser medium", "Total internal reflection needs: going from dense to less dense, angle > critical angle", "Electromagnetic spectrum: Radio, Microwave, Infrared, Visible, UV, X-ray, Gamma", "Higher frequency = shorter wavelength (inverse relationship)", "Amplitude relates to loudness (sound) or brightness (light)", "Don't confuse: longitudinal (compressions) vs transverse (crests)"]
        },
        {
            "topic": "Electricity",
            "summary": "Current, voltage, resistance, and circuits.",
            "key_points": ["Current (I): flow of charge, measured in amperes (A)", "Voltage (V): energy per unit charge, measured in volts (V)", "Resistance (R): opposition to current, measured in ohms (Ω)", "Ohm's Law: V = IR", "Power: P = IV or P = I²R or P = V²/R", "Series circuit: same current, voltage divides", "Parallel circuit: same voltage, current divides", "Series: R_total = R₁ + R₂ + R₃", "Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃", "Safety: fuse, circuit breaker, earth wire"],
            "exam_tips": ["V = IR: rearrange for I = V/R or R = V/I", "Series: current same everywhere, voltages add up", "Parallel: voltage same across each branch, currents add up", "Ammeter in series, voltmeter in parallel", "Power = I × V (watts = amps × volts)", "Energy = P × t (joules = watts × seconds)", "Fuse: melts if current too high, breaks circuit (safety)", "Earth wire: prevents electric shock if fault occurs", "Live wire (brown), Neutral wire (blue), Earth wire (green/yellow)", "Don't confuse: Series (one path) vs Parallel (multiple paths)"]
        },
        {
            "topic": "Nuclear Physics",
            "summary": "Atomic structure, radioactivity, and nuclear reactions.",
            "key_points": ["Atom: nucleus (protons + neutrons) + electrons", "Atomic number: number of protons", "Mass number: protons + neutrons", "Isotopes: same protons, different neutrons", "Radioactivity: unstable nuclei emit radiation", "Alpha (α): 2 protons + 2 neutrons, stopped by paper, +2 charge", "Beta (β): high-speed electron, stopped by aluminum, -1 charge", "Gamma (γ): electromagnetic radiation, stopped by lead, no charge", "Half-life: time for half of radioactive atoms to decay", "Uses: medicine (tracers, cancer treatment), carbon dating, smoke detectors"],
            "exam_tips": ["Alpha most ionizing, least penetrating; Gamma least ionizing, most penetrating", "Half-life: after 1 half-life, 50% remains; after 2, 25%; after 3, 12.5%", "Alpha stopped by paper/skin, Beta stopped by aluminum, Gamma needs thick lead", "Nuclear equation must balance: mass numbers and atomic numbers", "Isotopes same element (same protons), different mass (different neutrons)", "Background radiation from: rocks, cosmic rays, medical, nuclear power", "Alpha decay: mass -4, atomic -2; Beta decay: mass same, atomic +1", "Uses: Tracers (short half-life), Dating (long half-life)", "Nuclear fission: large nucleus splits, releases energy (nuclear power)", "Don't confuse: Atomic number (protons) vs Mass number (protons + neutrons)"]
        }
    ]
    
    # Add physics topics
    for phys in physics_topics:
        all_topics.append({
            "topic": phys["topic"],
            "subject": "Physics",
            "summary": phys["summary"],
            "sections": [{"title": "Key Concepts", "content": "\n".join([f"- {point}" for point in phys["key_points"]]), "diagrams": [], "subsections": []}],
            "key_points": phys["key_points"],
            "exam_tips": phys["exam_tips"]
        })
    
    return all_topics

# Execute
if __name__ == "__main__":
    service = ScienceNotesService()
    all_topics = create_all_chemistry_physics()
    
    chemistry_count = 0
    physics_count = 0
    
    for topic_data in all_topics:
        success = service.save_topic_notes(topic_data["subject"], topic_data["topic"], topic_data)
        status = "SUCCESS" if success else "FAILED"
        print(f"{topic_data['subject']} - {topic_data['topic']}: {status}")
        
        if success:
            if topic_data["subject"] == "Chemistry":
                chemistry_count += 1
            else:
                physics_count += 1
    
    print(f"\n✅ Chemistry: {chemistry_count}/11 topics")
    print(f"✅ Physics: {physics_count}/5 topics")
    print(f"✅ Total: {chemistry_count + physics_count}/16 topics created!")
