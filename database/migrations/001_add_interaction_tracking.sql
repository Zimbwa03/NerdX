-- Deep Knowledge Tracing - Interaction Tracking Schema
-- This migration adds comprehensive student interaction tracking for DKT

-- Student Interactions Table
-- Stores every question attempt with temporal data
CREATE TABLE IF NOT EXISTS student_interactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    
    -- Question context
    subject VARCHAR(100) NOT NULL,  -- 'mathematics', 'biology', 'chemistry', 'physics', 'english'
    topic VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,  -- Fine-grained skill (e.g., 'stoichiometry', 'force_analysis')
    question_id VARCHAR(255),
    difficulty VARCHAR(50),  -- 'easy', 'medium', 'hard'
    
    -- Interaction data
    response BOOLEAN NOT NULL,  -- TRUE = correct, FALSE = incorrect
    confidence VARCHAR(50),  -- 'low', 'medium', 'high' (for misconception detection)
    time_spent_seconds INTEGER,  -- Time spent on question
    hints_used INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    
    -- Temporal data
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),  -- Group questions from same study session
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP WITH TIME ZONE,  -- For offline sync tracking
    device_id VARCHAR(255),  -- Support multi-device offline
    
    -- Indexes for fast querying
    INDEX idx_user_skill (user_id, skill_id),
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_session (session_id),
    INDEX idx_sync (user_id, synced_at)
);

-- Student Knowledge State Table
-- Current predicted mastery per skill (DKT output)
CREATE TABLE IF NOT EXISTS student_knowledge_state (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    
    -- DKT predictions
    mastery_probability DECIMAL(5,4),  -- 0.0000 to 1.0000
    confidence_interval DECIMAL(5,4),  -- Uncertainty in prediction
    
    -- Forgetting curve data
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    retention_strength DECIMAL(5,4),  -- Memory strength (S in forgetting curve)
    predicted_retention DECIMAL(5,4),  -- Current retention probability
    next_review_at TIMESTAMP WITH TIME ZONE,  -- Optimal review time
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50),  -- Track which DKT model version
    
    -- Constraints
    UNIQUE(user_id, skill_id),
    INDEX idx_user_reviews (user_id, next_review_at),
    INDEX idx_skill_mastery (skill_id, mastery_probability)
);

-- Skills Taxonomy Table
-- Maps topics to fine-grained skills with dependencies
CREATE TABLE IF NOT EXISTS skills_taxonomy (
    skill_id VARCHAR(255) PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    
    -- Hierarchy
    parent_skill_id VARCHAR(255),  -- Prerequisite skill
    difficulty_level INTEGER,  -- 1-10 scale
    
    -- Metadata
    description TEXT,
    syllabus_reference VARCHAR(255),  -- Cambridge/ZIMSEC reference
    
    FOREIGN KEY (parent_skill_id) REFERENCES skills_taxonomy(skill_id)
);

-- Misconceptions Table
-- Common wrong beliefs per skill
CREATE TABLE IF NOT EXISTS misconceptions (
    id SERIAL PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL,
    misconception_text TEXT NOT NULL,  -- Description of misconception
    
    -- Detection pattern
    wrong_answer_pattern VARCHAR(255),  -- Common wrong answer
    confidence_threshold VARCHAR(50) DEFAULT 'high',  -- Trigger on high confidence errors
    
    -- Remediation
    refutation_text TEXT NOT NULL,  -- Explicit correction with evidence
    corrective_examples TEXT[],  -- Array of examples
    
    -- Tracking
    occurrence_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (skill_id) REFERENCES skills_taxonomy(skill_id)
);

-- Student Misconceptions Log
-- Track when students exhibit misconceptions
CREATE TABLE IF NOT EXISTS student_misconceptions_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    misconception_id INTEGER NOT NULL,
    interaction_id INTEGER NOT NULL,
    
    -- Correction tracking
    corrected BOOLEAN DEFAULT FALSE,
    corrected_at TIMESTAMP WITH TIME ZONE,
    refutation_shown BOOLEAN DEFAULT FALSE,
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (misconception_id) REFERENCES misconceptions(id),
    FOREIGN KEY (interaction_id) REFERENCES student_interactions(id),
    INDEX idx_user_misconceptions (user_id, corrected)
);

-- DKT Model Performance Metrics
-- Track model accuracy for continuous improvement
CREATE TABLE IF NOT EXISTS dkt_model_metrics (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(50) NOT NULL,
    
    -- Accuracy metrics
    prediction_accuracy DECIMAL(5,4),  -- Overall accuracy
    skill_prediction_accuracy JSONB,  -- Per-skill accuracy
    calibration_error DECIMAL(5,4),  -- How well calibrated are probabilities
    
    -- Training data
    training_samples INTEGER,
    validation_samples INTEGER,
    
    -- Deployment
    deployed_at TIMESTAMP WITH TIME ZONE,
    replaced_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT
);

-- Daily Review Queue (Offline-First)
-- Pre-computed daily review questions (can be cached offline)
CREATE TABLE IF NOT EXISTS daily_review_queue (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    review_date DATE NOT NULL,
    
    -- Review items
    skill_id VARCHAR(255) NOT NULL,
    priority INTEGER,  -- 1 (most urgent) to 10
    predicted_retention DECIMAL(5,4),  -- How much they'll remember
    
    -- Question assignment
    question_id VARCHAR(255),  -- Pre-assigned question for offline
    question_data JSONB,  -- Full question cached for offline
    
    -- Status
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, review_date, skill_id),
    INDEX idx_user_date (user_id, review_date, completed)
);

-- Offline Sync Queue
-- Track pending syncs for offline-first architecture
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    
    -- Data to sync
    table_name VARCHAR(100) NOT NULL,  -- 'student_interactions', etc.
    record_id VARCHAR(255) NOT NULL,
    operation VARCHAR(50) NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'
    data JSONB NOT NULL,  -- The actual data to sync
    
    -- Sync status
    synced BOOLEAN DEFAULT FALSE,
    sync_attempts INTEGER DEFAULT 0,
    synced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_pending_sync (user_id, synced, created_at)
);

-- Insert default skills taxonomy (starting set)
-- This will be expanded as we add more content
INSERT INTO skills_taxonomy (skill_id, skill_name, subject, topic, difficulty_level, description) VALUES
-- Mathematics
('math_algebra_basic', 'Basic Algebra', 'mathematics', 'Algebra', 2, 'Solving simple linear equations'),
('math_algebra_quadratic', 'Quadratic Equations', 'mathematics', 'Algebra', 5, 'Solving quadratic equations using factoring or formula'),
('math_geometry_angles', 'Angle Properties', 'mathematics', 'Geometry', 3, 'Understanding angle relationships'),
('math_trigonometry_basic', 'Basic Trigonometry', 'mathematics', 'Trigonometry', 4, 'SOHCAHTOA and basic ratios'),

-- Physics
('physics_mechanics_force', 'Force Analysis', 'physics', 'Mechanics', 4, 'Applying Newton\'s laws'),
('physics_mechanics_energy', 'Energy Conservation', 'physics', 'Mechanics', 5, 'KE, PE, and conservation'),
('physics_electricity_circuits', 'Circuit Analysis', 'physics', 'Electricity', 5, 'Ohm\'s law and series/parallel circuits'),

-- Chemistry
('chem_stoichiometry', 'Stoichiometry', 'chemistry', 'Quantitative Chemistry', 6, 'Mole calculations and balanced equations'),
('chem_organic_nomenclature', 'Organic Nomenclature', 'chemistry', 'Organic Chemistry', 4, 'Naming organic compounds'),
('chem_acids_bases', 'Acids and Bases', 'chemistry', 'Chemical Reactions', 3, 'pH, neutralization, indicators'),

-- Biology
('bio_cell_structure', 'Cell Structure', 'biology', 'Cell Biology', 3, 'Organelles and their functions'),
('bio_photosynthesis', 'Photosynthesis', 'biology', 'Plant Biology', 5, 'Process and factors affecting rate'),
('bio_genetics_mendelian', 'Mendelian Genetics', 'biology', 'Inheritance', 6, 'Punnett squares and inheritance patterns')
ON CONFLICT (skill_id) DO NOTHING;

-- Insert common misconceptions
INSERT INTO misconceptions (skill_id, misconception_text, wrong_answer_pattern, refutation_text, corrective_examples) VALUES
('physics_mechanics_force', 
 'Heavier objects fall faster than lighter objects', 
 'mass_affects_freefall',
 'In a vacuum, all objects fall at the same rate regardless of mass. Air resistance (not mass) causes differences in falling rate. Galileo proved this at the Leaning Tower of Pisa.',
 ARRAY['Feather vs hammer on the Moon (Apollo 15)', 'Dropped penny vs basketball in vacuum chamber']),

('chem_stoichiometry',
 'Coefficients in balanced equations represent grams, not moles',
 'confuse_mass_moles',
 'Coefficients represent the MOLE RATIO, not mass ratio. You must convert mass to moles using molar mass before using the balanced equation.',
 ARRAY['2H₂ + O₂ → 2H₂O means 2 MOLES of H₂, not 2 grams']),

('bio_photosynthesis',
 'Plants only respire at night (photosynthesize during day)',
 'respiration_only_night',
 'Plants respire 24/7 to produce ATP for cellular processes. Photosynthesis only happens in light, but respiration happens constantly.',
 ARRAY['Plants need ATP for growth even at night', 'Cellular respiration occurs in mitochondria continuously'])
ON CONFLICT DO NOTHING;

COMMENT ON TABLE student_interactions IS 'Every student-question interaction for DKT training';
COMMENT ON TABLE student_knowledge_state IS 'Current predicted mastery per skill (DKT output + forgetting curve)';
COMMENT ON TABLE skills_taxonomy IS 'Fine-grained skill breakdown with dependencies';
COMMENT ON TABLE misconceptions IS 'Common wrong beliefs that need explicit refutation';
COMMENT ON TABLE daily_review_queue IS 'Pre-computed daily reviews (offline-cacheable)';
COMMENT ON TABLE offline_sync_queue IS 'Pending data syncs for offline-first architecture';
