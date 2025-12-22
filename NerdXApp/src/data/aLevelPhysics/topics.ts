// A Level Physics Topics Data
// Contains all 24 A Level Physics topics with learning objectives

export interface ALevelPhysicsTopic {
    id: string;
    name: string;
    description: string;
    learningObjectives: string[];
    keyFormulas?: string[];
    difficulty: 'AS Level' | 'A2 Level';
}

// Complete list of A Level Physics topics
export const aLevelPhysicsTopics: ALevelPhysicsTopic[] = [
    // AS Level Topics (1-11)
    {
        id: 'physical_quantities',
        name: 'Physical Quantities and Units',
        description: 'SI units, prefixes, uncertainties, and dimensional analysis',
        difficulty: 'AS Level',
        learningObjectives: [
            'Use SI base units and derived units',
            'Apply standard prefixes (nano to giga)',
            'Calculate and combine uncertainties',
            'Distinguish between scalar and vector quantities',
            'Add and subtract coplanar vectors',
            'Estimate physical quantities using order of magnitude'
        ],
        keyFormulas: [
            'Percentage uncertainty = (absolute uncertainty / value) × 100%',
            'Combined uncertainties: addition and quadrature'
        ]
    },
    {
        id: 'kinematics',
        name: 'Kinematics',
        description: 'Motion, velocity, acceleration, and equations of motion',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define displacement, velocity, and acceleration',
            'Use equations of uniformly accelerated motion',
            'Interpret and draw displacement-time and velocity-time graphs',
            'Analyze projectile motion in two dimensions',
            'Understand motion under gravity'
        ],
        keyFormulas: [
            'v = u + at',
            's = ut + ½at²',
            'v² = u² + 2as',
            's = ½(u + v)t'
        ]
    },
    {
        id: 'dynamics',
        name: 'Dynamics',
        description: "Newton's laws, momentum, and collisions",
        difficulty: 'AS Level',
        learningObjectives: [
            "State and apply Newton's three laws of motion",
            'Define and calculate momentum (p = mv)',
            'Understand impulse and its relation to momentum change',
            'Apply conservation of momentum to collisions',
            'Distinguish between elastic and inelastic collisions',
            'Analyze forces using free body diagrams'
        ],
        keyFormulas: [
            'F = ma',
            'p = mv',
            'Impulse = FΔt = Δp',
            'Conservation: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂'
        ]
    },
    {
        id: 'forces_pressure',
        name: 'Forces, Density, and Pressure',
        description: 'Types of forces, density, and pressure in fluids',
        difficulty: 'AS Level',
        learningObjectives: [
            'Identify gravitational, electromagnetic, and nuclear forces',
            'Calculate density using ρ = m/V',
            'Apply pressure formula P = F/A',
            'Understand hydrostatic pressure P = ρgh',
            'Apply Archimedes principle to buoyancy problems'
        ],
        keyFormulas: [
            'ρ = m/V',
            'P = F/A',
            'P = ρgh',
            'Upthrust = weight of fluid displaced'
        ]
    },
    {
        id: 'work_energy_power',
        name: 'Work, Energy, and Power',
        description: 'Energy conservation, work done, and power',
        difficulty: 'AS Level',
        learningObjectives: [
            'Calculate work done W = Fs cos θ',
            'Apply kinetic energy formula KE = ½mv²',
            'Calculate gravitational potential energy PE = mgh',
            'Apply conservation of energy in mechanical systems',
            'Calculate power and efficiency'
        ],
        keyFormulas: [
            'W = Fs cos θ',
            'KE = ½mv²',
            'PE = mgh',
            'P = W/t = Fv',
            'Efficiency = useful output / total input × 100%'
        ]
    },
    {
        id: 'deformation_solids',
        name: 'Deformation of Solids',
        description: "Hooke's law, stress, strain, and Young modulus",
        difficulty: 'AS Level',
        learningObjectives: [
            "Apply Hooke's law F = kx within elastic limit",
            'Calculate stress σ = F/A and strain ε = ΔL/L',
            'Determine Young modulus E = stress/strain',
            'Interpret stress-strain graphs',
            'Distinguish between elastic and plastic deformation',
            'Calculate strain energy from force-extension graphs'
        ],
        keyFormulas: [
            'F = kx',
            'σ = F/A',
            'ε = ΔL/L',
            'E = σ/ε',
            'Energy = ½Fx = ½kx²'
        ]
    },
    {
        id: 'waves',
        name: 'Waves',
        description: 'Wave properties, polarization, and the electromagnetic spectrum',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define amplitude, wavelength, frequency, period, and wave speed',
            'Distinguish between transverse and longitudinal waves',
            'Apply the wave equation v = fλ',
            'Understand polarization of transverse waves',
            'Know properties of electromagnetic spectrum regions',
            'Apply the inverse square law for intensity'
        ],
        keyFormulas: [
            'v = fλ',
            'T = 1/f',
            'I = P/A',
            'I ∝ 1/r²'
        ]
    },
    {
        id: 'superposition',
        name: 'Superposition',
        description: 'Interference, diffraction, and stationary waves',
        difficulty: 'AS Level',
        learningObjectives: [
            'Understand the principle of superposition',
            'Explain constructive and destructive interference',
            "Apply Young's double-slit experiment formula",
            'Analyze diffraction gratings using d sin θ = nλ',
            'Understand formation and properties of stationary waves',
            'Identify nodes and antinodes'
        ],
        keyFormulas: [
            'λ = ax/D (Young\'s double slit)',
            'd sin θ = nλ (diffraction grating)',
            'Path difference for interference'
        ]
    },
    {
        id: 'electricity',
        name: 'Electricity',
        description: 'Current, voltage, resistance, and electrical power',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define electric current I = Q/t',
            'Apply potential difference V = W/Q',
            "State and use Ohm's law V = IR",
            'Calculate resistance and resistivity',
            'Sketch I-V characteristics for various components',
            'Calculate electrical power and energy'
        ],
        keyFormulas: [
            'I = Q/t',
            'V = IR',
            'R = ρL/A',
            'P = IV = I²R = V²/R',
            'E = Pt'
        ]
    },
    {
        id: 'dc_circuits',
        name: 'D.C. Circuits',
        description: "Kirchhoff's laws, potential dividers, and EMF",
        difficulty: 'AS Level',
        learningObjectives: [
            'Calculate equivalent resistance in series and parallel',
            "Apply Kirchhoff's first law (current at junctions)",
            "Apply Kirchhoff's second law (voltage in loops)",
            'Design and analyze potential divider circuits',
            'Understand EMF and internal resistance',
            'Apply ε = V + Ir'
        ],
        keyFormulas: [
            'Series: R_total = R₁ + R₂ + ...',
            'Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...',
            'V_out = V_in × R₂/(R₁ + R₂)',
            'ε = V + Ir'
        ]
    },
    {
        id: 'particle_physics',
        name: 'Particle Physics',
        description: 'Quarks, leptons, hadrons, and fundamental particles',
        difficulty: 'AS Level',
        learningObjectives: [
            'Know the constituents of atoms (protons, neutrons, electrons)',
            'Understand quarks (up, down, strange) and their properties',
            'Classify particles as leptons, baryons, or mesons',
            'Know properties of antiparticles',
            'Apply conservation laws (charge, baryon number, lepton number)',
            'Represent interactions using Feynman diagrams'
        ],
        keyFormulas: [
            'Proton = uud, Neutron = udd',
            'Conservation of baryon number',
            'Conservation of lepton number'
        ]
    },
    // A2 Level Topics (12-24)
    {
        id: 'circular_motion',
        name: 'Motion in a Circle',
        description: 'Angular velocity and centripetal force',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define angular displacement and angular velocity',
            'Relate angular velocity to linear velocity v = rω',
            'Calculate centripetal acceleration a = v²/r = ω²r',
            'Apply centripetal force F = mv²/r = mω²r',
            'Analyze objects moving in vertical circles'
        ],
        keyFormulas: [
            'ω = θ/t = 2πf',
            'v = rω',
            'a = v²/r = ω²r',
            'F = mv²/r = mω²r'
        ]
    },
    {
        id: 'gravitational_fields',
        name: 'Gravitational Fields',
        description: "Newton's law of gravitation and orbital motion",
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define gravitational field strength g = F/m',
            "Apply Newton's law of gravitation F = GMm/r²",
            'Calculate gravitational potential Φ = -GM/r',
            'Derive orbital velocity and period for satellites',
            'Calculate escape velocity v = √(2GM/r)',
            'Understand geostationary orbits'
        ],
        keyFormulas: [
            'F = GMm/r²',
            'g = GM/r²',
            'Φ = -GM/r',
            'v_orbit = √(GM/r)',
            'v_escape = √(2GM/r)'
        ]
    },
    {
        id: 'temperature',
        name: 'Temperature',
        description: 'Thermal equilibrium, heat capacity, and latent heat',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Understand thermal equilibrium and zeroth law',
            'Convert between Celsius and Kelvin scales',
            'Apply specific heat capacity Q = mcΔT',
            'Apply specific latent heat Q = mL',
            'Interpret heating and cooling curves'
        ],
        keyFormulas: [
            'T(K) = T(°C) + 273',
            'Q = mcΔT',
            'Q = mL'
        ]
    },
    {
        id: 'ideal_gases',
        name: 'Ideal Gases',
        description: 'Gas laws and kinetic theory',
        difficulty: 'A2 Level',
        learningObjectives: [
            "Apply Boyle's, Charles's, and pressure law",
            'Use ideal gas equation pV = nRT',
            'Understand kinetic theory assumptions',
            'Derive and use p = ⅓ρ⟨c²⟩',
            'Relate kinetic energy to temperature E = 3/2 kT'
        ],
        keyFormulas: [
            'pV = nRT',
            'pV = NkT',
            'p = ⅓ρ⟨c²⟩',
            'E_k = 3/2 kT'
        ]
    },
    {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        description: 'First law and heat engines',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Apply first law ΔU = Q - W',
            'Calculate work done from p-V diagrams',
            'Understand isothermal and adiabatic processes',
            'Analyze heat engine efficiency'
        ],
        keyFormulas: [
            'ΔU = Q - W',
            'W = pΔV (at constant pressure)',
            'Efficiency = W/Q_hot'
        ]
    },
    {
        id: 'oscillations',
        name: 'Oscillations',
        description: 'Simple harmonic motion, damping, and resonance',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define SHM and apply a = -ω²x',
            'Use displacement equations x = A cos(ωt)',
            'Calculate velocity and acceleration in SHM',
            'Understand energy exchange in SHM',
            'Classify damping types (light, heavy, critical)',
            'Explain resonance and its effects'
        ],
        keyFormulas: [
            'a = -ω²x',
            'x = A cos(ωt)',
            'v = ±ω√(A² - x²)',
            'T = 2π√(m/k)',
            'T = 2π√(l/g)'
        ]
    },
    {
        id: 'electric_fields',
        name: 'Electric Fields',
        description: "Coulomb's law and electric potential",
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define electric field strength E = F/q',
            "Apply Coulomb's law F = kQ₁Q₂/r²",
            'Calculate electric potential V = kQ/r',
            'Analyze motion of charges in uniform fields',
            'Draw and interpret field lines and equipotentials'
        ],
        keyFormulas: [
            'E = F/q',
            'F = kQ₁Q₂/r²',
            'V = kQ/r',
            'E = V/d (uniform field)'
        ]
    },
    {
        id: 'capacitance',
        name: 'Capacitance',
        description: 'Capacitor charging, discharging, and energy storage',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define capacitance C = Q/V',
            'Calculate parallel plate capacitance C = ε₀εᵣA/d',
            'Calculate energy stored E = ½CV² = ½QV',
            'Analyze charging/discharging curves',
            'Use time constant τ = RC'
        ],
        keyFormulas: [
            'C = Q/V',
            'C = ε₀εᵣA/d',
            'E = ½CV² = ½QV = ½Q²/C',
            'Q = Q₀e^(-t/RC)',
            'τ = RC'
        ]
    },
    {
        id: 'magnetic_fields',
        name: 'Magnetic Fields',
        description: 'Forces on conductors and electromagnetic induction',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define magnetic flux density B',
            'Apply force on current-carrying conductor F = BIL sin θ',
            'Apply force on moving charge F = Bqv sin θ',
            "Understand Faraday's law of electromagnetic induction",
            "Apply Lenz's law for direction of induced EMF",
            'Analyze transformer operation'
        ],
        keyFormulas: [
            'F = BIL sin θ',
            'F = Bqv sin θ',
            'ε = -dΦ/dt',
            'Φ = BA',
            'N_s/N_p = V_s/V_p'
        ]
    },
    {
        id: 'alternating_currents',
        name: 'Alternating Currents',
        description: 'RMS values, rectification, and AC circuits',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Understand sinusoidal AC variation',
            'Calculate RMS values I_rms = I₀/√2',
            'Calculate power in AC circuits',
            'Understand half-wave and full-wave rectification',
            'Use oscilloscopes to measure AC properties'
        ],
        keyFormulas: [
            'I_rms = I₀/√2',
            'V_rms = V₀/√2',
            'P = I_rms × V_rms'
        ]
    },
    {
        id: 'quantum_physics',
        name: 'Quantum Physics',
        description: 'Photoelectric effect and wave-particle duality',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Understand photon energy E = hf = hc/λ',
            'Explain the photoelectric effect',
            'Apply Einstein equation hf = Φ + ½mv²_max',
            'Understand de Broglie wavelength λ = h/p',
            'Interpret energy levels and line spectra'
        ],
        keyFormulas: [
            'E = hf = hc/λ',
            'hf = Φ + ½mv²_max',
            'λ = h/p = h/mv',
            'E = hf (photon energy)'
        ]
    },
    {
        id: 'nuclear_physics',
        name: 'Nuclear Physics',
        description: 'Radioactive decay, binding energy, and nuclear reactions',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Understand nuclear structure and notation',
            'Describe alpha, beta, and gamma decay',
            'Apply half-life and decay constant',
            'Use N = N₀e^(-λt) for radioactive decay',
            'Calculate binding energy using E = mc²',
            'Understand nuclear fission and fusion'
        ],
        keyFormulas: [
            'N = N₀e^(-λt)',
            'A = λN',
            't_½ = ln2/λ',
            'E = mc²',
            'Binding energy per nucleon'
        ]
    },
    {
        id: 'astronomy_cosmology',
        name: 'Astronomy and Cosmology',
        description: "Stellar evolution, Hubble's law, and the Big Bang",
        difficulty: 'A2 Level',
        learningObjectives: [
            'Interpret the HR diagram',
            'Understand stellar life cycles',
            'Use standard candles for distance measurement',
            "Apply Hubble's law v = H₀d",
            'Understand evidence for the Big Bang',
            'Know about dark matter and dark energy'
        ],
        keyFormulas: [
            'v = H₀d',
            'L = 4πr²σT⁴ (Stefan-Boltzmann)',
            'λ_max T = constant (Wien\'s law)'
        ]
    }
];

// Helper function to get topic by ID
export function getTopicById(id: string): ALevelPhysicsTopic | undefined {
    return aLevelPhysicsTopics.find(topic => topic.id === id);
}

// Get topics by difficulty level
export function getTopicsByLevel(level: 'AS Level' | 'A2 Level'): ALevelPhysicsTopic[] {
    return aLevelPhysicsTopics.filter(topic => topic.difficulty === level);
}

// Get all topic names
export function getAllTopicNames(): string[] {
    return aLevelPhysicsTopics.map(topic => topic.name);
}
