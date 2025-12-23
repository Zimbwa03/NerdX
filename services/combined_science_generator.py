"""
Professional Combined Science Question Generator for ZIMSEC O-Level
Generates age-appropriate questions with clear explanations for 15-17 year old students
"""
import os
import json
import requests
import time
import logging
import random
from typing import Dict, List, Optional, Any, Tuple

logger = logging.getLogger(__name__)

class CombinedScienceGenerator:
    """Professional O-Level Combined Science question generator using DeepSeek AI"""
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        
        # O-Level appropriate settings
        self.max_retries = 2
        self.timeouts = [25, 40]  # Reasonable timeouts for O-Level questions
        self.retry_delay = 2
        
        # ZIMSEC O-Level learning objectives per topic
        self.learning_objectives = {
            "Biology": {
                "Cell Structure and Organisation": [
                    "Identify basic cell structures and their functions",
                    "Compare plant and animal cells",
                    "Understand cell theory basics"
                ],
                "Movement In and Out of Cells": [
                    "Explain diffusion and osmosis",
                    "Understand factors affecting movement",
                    "Apply concepts to everyday examples"
                ],
                "Enzymes": [
                    "Describe enzyme properties and functions",
                    "Explain factors affecting enzyme activity",
                    "Give examples of enzyme applications"
                ],
                "Plant Nutrition": [
                    "Understand photosynthesis process",
                    "Identify factors affecting photosynthesis rate",
                    "Describe leaf structure adaptations"
                ],
                "Animal Nutrition": [
                    "Identify components of balanced diet",
                    "Understand digestive system structure",
                    "Explain absorption and assimilation"
                ]
            },
            "Chemistry": {
                "States of Matter": [
                    "Describe particle arrangement and movement in solids, liquids, and gases",
                    "Explain changes of state using kinetic theory (melting, boiling, evaporation)",
                    "Compare properties of each state (shape, volume, compressibility, density)",
                    "Explain Brownian motion as evidence for particle theory",
                    "Interpret heating and cooling curves identifying state changes",
                    "Distinguish between boiling and evaporation",
                    "Apply particle theory to explain diffusion rates"
                ],
                "Atoms, Elements and Compounds": [
                    "Describe atomic structure: protons, neutrons, electrons with their properties",
                    "Calculate proton number, nucleon number, and electron arrangement",
                    "Define isotopes and explain their similarities and differences",
                    "Distinguish between elements, compounds, and mixtures",
                    "Describe physical and chemical separation techniques",
                    "Explain the differences between atoms, molecules, and ions",
                    "Write electron configurations for first 20 elements"
                ],
                "Chemical Bonding": [
                    "Explain why atoms bond (achieving stable electron configuration)",
                    "Describe ionic bonding as electron transfer between metals and non-metals",
                    "Describe covalent bonding as electron sharing between non-metals",
                    "Draw dot-and-cross diagrams for ionic and covalent compounds",
                    "Explain metallic bonding and the 'sea of electrons' model",
                    "Compare properties of ionic, covalent, and metallic substances",
                    "Relate structure and bonding to melting points and conductivity"
                ],
                "Stoichiometry": [
                    "Write and balance chemical equations including state symbols",
                    "Calculate relative atomic mass, formula mass, and molecular mass",
                    "Apply the mole concept to calculations (n = m/M)",
                    "Perform reacting mass calculations using molar ratios",
                    "Calculate gas volumes at STP using molar volume (24 dm³)",
                    "Calculate concentration and perform titration calculations",
                    "Determine empirical and molecular formulae from percentage composition",
                    "Calculate percentage yield and percentage purity"
                ],
                "The Periodic Table": [
                    "Describe the structure of the periodic table (periods, groups)",
                    "Explain trends in properties across periods and down groups",
                    "Describe Group I alkali metals: reactions with water and air",
                    "Describe Group VII halogens: displacement reactions and properties",
                    "Explain properties of Group 0 noble gases",
                    "Describe transition metal properties (variable oxidation states, catalysts)",
                    "Predict chemical behavior based on periodic table position"
                ],
                "Chemical Reactions": [
                    "Define and measure rate of reaction using different methods",
                    "Explain how temperature, concentration, surface area, and catalysts affect rate",
                    "Apply collision theory to explain factors affecting reaction rate",
                    "Interpret rate graphs and identify order of reactions",
                    "Distinguish between reversible and irreversible reactions",
                    "Describe photochemical reactions (e.g., photosynthesis, photography)",
                    "Apply Le Chatelier's principle to predict equilibrium shifts"
                ],
                "Chemical Energetics": [
                    "Distinguish between exothermic and endothermic reactions with examples",
                    "Draw and interpret energy profile diagrams",
                    "Explain bond breaking (endothermic) and bond making (exothermic)",
                    "Calculate enthalpy changes using bond energies",
                    "Compare energy content of fuels and explain combustion",
                    "Describe electrochemical cells and fuel cells",
                    "Explain the energy changes in reversible reactions"
                ],
                "Electrochemistry": [
                    "Distinguish between conductors, insulators, and electrolytes",
                    "Explain electrolysis: movement of ions, electrode reactions",
                    "Write half-equations for cathode and anode reactions",
                    "Predict products of electrolysis of molten and aqueous compounds",
                    "Describe industrial applications: aluminium extraction, copper purification, electroplating",
                    "Explain why carbon anodes need replacement in aluminium extraction",
                    "Describe simple electrochemical cells and identify the negative pole"
                ],
                "Redox Reactions": [
                    "Define oxidation and reduction in terms of oxygen transfer",
                    "Define oxidation and reduction in terms of electron transfer (OIL RIG)",
                    "Identify oxidation state changes to determine redox reactions",
                    "Write half-equations showing electron transfer",
                    "Identify oxidising agents and reducing agents in reactions",
                    "Describe tests for oxidising and reducing agents (KMnO₄, KI)",
                    "Apply redox concepts to combustion, rusting, and metal extraction"
                ],
                "Acids, Bases and Salts": [
                    "Define acids (H⁺ donors) and bases/alkalis (OH⁻ donors)",
                    "Use the pH scale and indicators to classify solutions",
                    "Distinguish between strong/weak acids and bases (degree of ionisation)",
                    "Describe reactions of acids with metals, bases, and carbonates",
                    "Classify oxides as acidic, basic, amphoteric, or neutral",
                    "Apply solubility rules to predict salt precipitation",
                    "Describe salt preparation methods: titration, excess solid, precipitation"
                ],
                "Metals": [
                    "Describe physical and chemical properties of metals",
                    "Arrange metals in the reactivity series using experimental evidence",
                    "Predict displacement reactions in solutions and with oxides",
                    "Explain extraction methods based on reactivity: electrolysis vs reduction",
                    "Describe the blast furnace process for iron extraction",
                    "Describe aluminium extraction by electrolysis of cryolite solution",
                    "Explain why alloys are harder than pure metals",
                    "Describe methods of rust prevention: barrier, galvanising, sacrificial"
                ],
                "Non-metals": [
                    "Describe properties and uses of hydrogen gas",
                    "Explain the Haber process: conditions, yield considerations, catalyst",
                    "Describe fertilizer production and eutrophication problems",
                    "Explain the Contact process for sulfuric acid manufacture",
                    "Describe uses of sulfuric acid (batteries, fertilizers, paints)",
                    "Explain carbon dioxide's role in greenhouse effect",
                    "Describe carbon monoxide toxicity (binds to haemoglobin)",
                    "Apply the limestone cycle: CaCO₃ → CaO → Ca(OH)₂ → limewater"
                ],
                "Chemistry of the Environment": [
                    "Test for water and determine purity using melting/boiling points",
                    "Describe the 4-step water treatment process",
                    "State the composition of clean dry air",
                    "Explain fractional distillation of liquid air",
                    "Identify sources and effects of air pollutants (CO, SO₂, NOₓ)",
                    "Describe acid rain formation and its environmental effects",
                    "Explain catalytic converters and flue gas desulfurisation",
                    "Describe the greenhouse effect and global warming",
                    "Explain ozone layer depletion by CFCs and the Montreal Protocol"
                ],
                "Organic Chemistry": [
                    "Explain carbon's unique properties: tetravalency and catenation",
                    "Describe fractional distillation of crude oil and fraction uses",
                    "Explain cracking: breaking long chains into useful products",
                    "Compare alkanes (saturated) and alkenes (unsaturated)",
                    "Describe the bromine water test for unsaturation",
                    "Write equations for complete and incomplete combustion",
                    "Describe addition reactions: hydrogenation, hydration, halogenation",
                    "Compare fermentation and hydration for ethanol production",
                    "Explain addition polymerisation and draw repeat units",
                    "Discuss environmental problems with plastics and disposal solutions"
                ],
                "Experimental Techniques": [
                    "Select appropriate apparatus for measuring volume accurately",
                    "Test for purity using melting and boiling points",
                    "Describe separation techniques: filtration, crystallisation, distillation, chromatography",
                    "Calculate Rf values and identify substances using chromatography",
                    "Identify cations using NaOH and ammonia solutions",
                    "Test for anions: carbonates, halides, sulfates, nitrates",
                    "Perform tests for gases: H₂, O₂, CO₂, Cl₂, NH₃",
                    "Identify metal ions using flame tests"
                ]
            },
            "Physics": {
                "Motion, Forces and Energy": [
                    "Calculate speed and acceleration",
                    "Apply Newton's laws to simple situations",
                    "Understand work and energy concepts"
                ],
                "Electricity": [
                    "Understand current, voltage, and resistance",
                    "Analyze simple circuits",
                    "Apply Ohm's law to basic problems"
                ]
            }
        }
    
    def generate_topical_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """Generate O-Level appropriate topical question with professional explanation"""
        try:
            if not self.api_key:
                logger.error("DeepSeek API key not configured")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Create O-Level appropriate prompt
            prompt = self._create_olevel_prompt(subject, topic, difficulty)
            
            # Generate question using DeepSeek
            result = self._call_deepseek_api(prompt, f"{subject}_{topic}_{difficulty}")
            
            if result:
                # Validate and enhance the result
                return self._validate_and_enhance_question(result, subject, topic, difficulty, user_id)
            else:
                logger.warning(f"DeepSeek generation failed for {subject}/{topic}, using fallback")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
                
        except Exception as e:
            logger.error(f"Error generating {subject} question for {topic}: {e}")
            return self._get_fallback_question(subject, topic, difficulty, user_id)

    def generate_structured_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """
        Generate a ZIMSEC-style O-Level *Structured* question (not MCQ).

        Output is a dict that includes:
        - question_type='structured'
        - stem/context
        - parts with labels and marks
        - an internal marking rubric (used for AI evaluation)
        """
        try:
            if not self.api_key:
                logger.error("DeepSeek API key not configured (structured)")
                return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

            prompt = self._create_olevel_structured_prompt(subject, topic, difficulty)
            result = self._call_deepseek_api(prompt, f"{subject}_{topic}_{difficulty}_structured")

            if result:
                return self._validate_and_enhance_structured_question(result, subject, topic, difficulty, user_id)

            logger.warning(f"DeepSeek structured generation failed for {subject}/{topic}, using fallback")
            return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

        except Exception as e:
            logger.error(f"Error generating structured {subject} question for {topic}: {e}")
            return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

    def evaluate_structured_answer(self, structured_question: Dict[str, Any], student_answer: str) -> Dict[str, Any]:
        """
        Evaluate a student's answer to a structured question using DeepSeek (preferred),
        falling back to a heuristic rubric matcher if needed.
        """
        try:
            if not structured_question or structured_question.get('question_type') != 'structured':
                return {
                    'success': False,
                    'error': 'Invalid structured question payload',
                    'marks_awarded': 0,
                    'total_marks': 0,
                    'is_correct': False,
                    'overall_feedback': 'Invalid question data.'
                }

            total_marks = int(structured_question.get('total_marks') or 0)
            rubric = structured_question.get('marking_rubric') or structured_question.get('rubric') or {}

            if not self.api_key:
                logger.warning("DeepSeek API key not configured (structured evaluation) - using fallback evaluator")
                return self._fallback_evaluate_structured_answer(structured_question, student_answer)

            prompt = self._create_structured_evaluation_prompt(structured_question, rubric, student_answer)
            result = self._call_deepseek_api(prompt, "structured_evaluation")

            if isinstance(result, dict) and result.get('success') is True:
                # Ensure core fields exist
                result.setdefault('total_marks', total_marks)
                if not result.get('percentage') and result.get('total_marks'):
                    try:
                        result['percentage'] = round((float(result.get('marks_awarded', 0)) / float(result['total_marks'])) * 100, 1)
                    except Exception:
                        result['percentage'] = 0.0
                return result

            # If DeepSeek returned something unexpected, fallback.
            logger.warning("DeepSeek structured evaluation returned invalid result - using fallback")
            return self._fallback_evaluate_structured_answer(structured_question, student_answer)

        except Exception as e:
            logger.error(f"Error evaluating structured answer: {e}")
            return self._fallback_evaluate_structured_answer(structured_question, student_answer)

    def _create_olevel_structured_prompt(self, subject: str, topic: str, difficulty: str) -> str:
        """Create a ZIMSEC O-Level structured-question prompt (parts, marks, rubric)."""
        objectives = self.learning_objectives.get(subject, {}).get(topic, [
            f"Understand key concepts of {topic}",
            f"Apply {topic} knowledge to exam-style questions"
        ])

        difficulty_guidance = {
            'easy': "Short recall + simple application. 3-4 parts. Total 6-8 marks.",
            'medium': "Mixed recall/application/explain. 4-6 parts with subparts. Total 8-12 marks.",
            'difficult': "More depth and reasoning. 5-7 parts with subparts. Total 10-15 marks."
        }

        # ZIMSEC structured questions: short stem, then (a)(i)(ii) style parts, marks in brackets.
        return f"""Create ONE ZIMSEC O-Level *Structured* question for Combined Science ({subject}) on the topic: {topic}.

STUDENT LEVEL: ZIMSEC O-Level Forms 1-4 (ages 15-17 in Zimbabwe).

STYLE REQUIREMENTS (must follow):
- Must be a *STRUCTURED* question (NOT multiple choice).
- Must be broken into parts like (a)(i), (a)(ii), (b), (c)(i) etc.
- Each part must have a mark allocation like [2] and the total marks must be realistic for ZIMSEC.
- Use clear ZIMSEC command words: state, define, describe, explain, calculate, name, label, suggest.
- Keep the stem/context brief and exam-like (avoid long stories).
- Ensure it is *exactly one* question with parts (not a paper, not multiple questions).

Learning Objectives:
{chr(10).join(f"- {obj}" for obj in objectives)}

Difficulty: {difficulty} ({difficulty_guidance.get(difficulty, 'Standard')})

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (example fields):
{{
  "question_type": "structured",
  "subject": "{subject}",
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "stem": "Short exam-style context/instructions (1-3 lines).",
  "parts": [
    {{
      "label": "(a)(i)",
      "question": "Part question text",
      "marks": 2,
      "command_word": "state",
      "expected_points": ["marking point 1", "marking point 2"],
      "model_answer": "A concise model answer a ZIMSEC marker expects"
    }}
  ],
  "total_marks": 10,
  "marking_rubric": {{
    "(a)(i)": {{
      "marks": 2,
      "points": ["point 1", "point 2"],
      "accept_alternatives": ["acceptable alternative phrasing if any"]
    }}
  }},
  "teacher_notes": "Short examiner/teacher note (1-2 lines) about common misconceptions."
}}

Generate the structured question now."""

    def _validate_and_enhance_structured_question(self, question_data: Dict[str, Any], subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict[str, Any]:
        """Validate and enhance structured question payload for consistency."""
        try:
            if not isinstance(question_data, dict):
                return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

            # Required fields
            for field in ['stem', 'parts', 'total_marks']:
                if field not in question_data:
                    logger.warning(f"Structured question missing field {field}")
                    return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

            parts = question_data.get('parts')
            if not isinstance(parts, list) or len(parts) < 2:
                logger.warning("Structured question parts invalid/too few")
                return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

            # Normalize parts and compute totals if needed
            normalized_parts: List[Dict[str, Any]] = []
            computed_total = 0
            for p in parts:
                if not isinstance(p, dict):
                    continue
                label = str(p.get('label') or '').strip() or "(a)"
                qtext = str(p.get('question') or '').strip()
                marks = p.get('marks', 1)
                try:
                    marks_i = int(marks)
                except Exception:
                    marks_i = 1
                marks_i = max(1, min(10, marks_i))
                computed_total += marks_i

                normalized_parts.append({
                    'label': label,
                    'question': qtext,
                    'marks': marks_i,
                    'command_word': str(p.get('command_word') or '').strip().lower(),
                    'expected_points': p.get('expected_points') if isinstance(p.get('expected_points'), list) else [],
                    'model_answer': str(p.get('model_answer') or '').strip()
                })

            if not normalized_parts or any(not p.get('question') for p in normalized_parts):
                logger.warning("Structured question parts missing text")
                return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

            total_marks = question_data.get('total_marks')
            try:
                total_marks_i = int(total_marks)
            except Exception:
                total_marks_i = computed_total
            if total_marks_i <= 0:
                total_marks_i = computed_total

            # Ensure rubric exists and aligns with parts
            rubric = question_data.get('marking_rubric')
            if not isinstance(rubric, dict):
                rubric = {}
            for p in normalized_parts:
                lbl = p['label']
                if lbl not in rubric:
                    rubric[lbl] = {
                        'marks': p['marks'],
                        'points': p.get('expected_points', []),
                        'accept_alternatives': []
                    }

            # Add metadata for compatibility with DB/mobile
            from constants import DIFFICULTY_LEVELS
            points_value = DIFFICULTY_LEVELS.get(difficulty, {}).get('point_value', 10)

            question_data_out = {
                'question_type': 'structured',
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'stem': str(question_data.get('stem') or '').strip(),
                'parts': normalized_parts,
                'total_marks': total_marks_i,
                'marking_rubric': rubric,
                'teacher_notes': str(question_data.get('teacher_notes') or '').strip(),
                'source': 'ai_generated_olevel',
                'points': points_value,
                'category': subject
            }
            return question_data_out

        except Exception as e:
            logger.error(f"Error validating structured question: {e}")
            return self._get_fallback_structured_question(subject, topic, difficulty, user_id)

    def _create_structured_evaluation_prompt(self, structured_question: Dict[str, Any], rubric: Dict[str, Any], student_answer: str) -> str:
        """Prompt DeepSeek to mark like a ZIMSEC marker and give teacher feedback."""
        stem = structured_question.get('stem', '')
        parts = structured_question.get('parts', [])
        total_marks = structured_question.get('total_marks', 0)
        subject = structured_question.get('subject', 'Combined Science')
        topic = structured_question.get('topic', '')
        difficulty = structured_question.get('difficulty', 'medium')

        # Keep prompt size manageable: include only essential rubric points
        compact_rubric = rubric
        return f"""You are an experienced ZIMSEC O-Level Combined Science examiner and a professional teacher.

TASK:
1) Mark the student's answer to the structured question using the marking rubric.
2) Provide professional teacher feedback that is encouraging, clear, and detailed.
3) Explain correct scientific ideas and correct misconceptions.

SUBJECT: {subject}
TOPIC: {topic}
DIFFICULTY: {difficulty}

STRUCTURED QUESTION:
Stem: {stem}
Parts: {json.dumps(parts, ensure_ascii=False)}

MARKING RUBRIC (internal):
{json.dumps(compact_rubric, ensure_ascii=False)}

STUDENT ANSWER (raw text):
{student_answer}

OUTPUT: Return ONLY valid JSON (no markdown, no extra text):
{{
  "success": true,
  "total_marks": {total_marks},
  "marks_awarded": 0,
  "percentage": 0.0,
  "is_correct": false,
  "per_part": [
    {{
      "label": "(a)(i)",
      "max_marks": 2,
      "awarded": 0,
      "what_was_correct": ["..."],
      "what_was_missing": ["..."],
      "teacher_feedback": "Short part-specific feedback",
      "model_answer": "Concise model answer"
    }}
  ],
  "overall_teacher_feedback": "Professional teacher feedback in 6-10 lines. Encourage, correct, and guide improvement.",
  "well_detailed_explanation": "A well explained breakdown of the correct science (8-14 lines), using simple language suitable for teenagers.",
  "next_steps": ["Two or three study tips specific to the topic"]
}}

Mark strictly but fairly like ZIMSEC. Determine is_correct=true if percentage >= 60%."""

    def _fallback_evaluate_structured_answer(self, structured_question: Dict[str, Any], student_answer: str) -> Dict[str, Any]:
        """Heuristic evaluator when AI is unavailable. Matches keywords from rubric points."""
        try:
            parts = structured_question.get('parts', [])
            rubric = structured_question.get('marking_rubric', {}) or {}
            total_marks = int(structured_question.get('total_marks') or 0)
            student_lower = (student_answer or '').lower()

            marks_awarded = 0
            per_part = []

            for p in parts:
                label = p.get('label')
                max_marks = int(p.get('marks') or 1)
                points = []
                r = rubric.get(label) or {}
                if isinstance(r, dict):
                    points = r.get('points') if isinstance(r.get('points'), list) else []

                # Simple keyword scoring: count matched points, cap at max_marks
                matched = []
                missing = []
                for pt in points:
                    pt_text = str(pt).strip()
                    if not pt_text:
                        continue
                    # keyword-ish match: require at least one significant token present
                    tokens = [t for t in pt_text.lower().replace('/', ' ').replace(',', ' ').split() if len(t) >= 4]
                    if tokens and any(tok in student_lower for tok in tokens):
                        matched.append(pt_text)
                    else:
                        missing.append(pt_text)

                awarded = min(max_marks, max(0, len(matched)))
                marks_awarded += awarded

                per_part.append({
                    'label': label,
                    'max_marks': max_marks,
                    'awarded': awarded,
                    'what_was_correct': matched[:3],
                    'what_was_missing': missing[:3],
                    'teacher_feedback': "Good attempt. Add the missing key points for full marks." if awarded < max_marks else "Well done. You covered the key points.",
                    'model_answer': p.get('model_answer', '')
                })

            if total_marks <= 0:
                total_marks = sum(int(p.get('marks') or 1) for p in parts) or max(1, marks_awarded)

            percentage = round((marks_awarded / total_marks) * 100, 1) if total_marks else 0.0
            is_correct = percentage >= 60.0

            return {
                'success': True,
                'total_marks': total_marks,
                'marks_awarded': marks_awarded,
                'percentage': percentage,
                'is_correct': is_correct,
                'per_part': per_part,
                'overall_teacher_feedback': "Good effort. Review the model answers and focus on the missing scientific points." if not is_correct else "Excellent work. Keep practising structured questions.",
                'well_detailed_explanation': "Compare your answer with the model answers and ensure you include the key scientific terms and ideas expected at O-Level.",
                'next_steps': ["Rewrite your answers using the model answers as a guide.", "Learn the key definitions and processes for this topic."]
            }
        except Exception as e:
            logger.error(f"Fallback structured evaluation error: {e}")
            return {
                'success': False,
                'error': 'Evaluation failed',
                'total_marks': 0,
                'marks_awarded': 0,
                'percentage': 0.0,
                'is_correct': False,
                'overall_teacher_feedback': 'Sorry, I could not evaluate your answer right now.'
            }

    def _get_fallback_structured_question(self, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict[str, Any]:
        """Fallback structured questions when AI fails."""
        # Minimal safe fallback for common topics.
        if subject == "Biology":
            stem = "Answer the following questions on cells."
            parts = [
                {"label": "(a)(i)", "question": "State the function of the nucleus in a cell.", "marks": 2, "command_word": "state",
                 "expected_points": ["Controls cell activities", "Contains genetic material (DNA)"], "model_answer": "The nucleus controls cell activities and contains genetic material (DNA)."},
                {"label": "(a)(ii)", "question": "Name ONE structure found in plant cells but not in animal cells.", "marks": 1, "command_word": "name",
                 "expected_points": ["Cell wall OR chloroplast OR large permanent vacuole"], "model_answer": "Cell wall (or chloroplast)."}
            ]
            total = 3
        elif subject == "Chemistry":
            stem = "Answer the following questions on states of matter."
            parts = [
                {"label": "(a)", "question": "Describe the arrangement of particles in a solid.", "marks": 2, "command_word": "describe",
                 "expected_points": ["Closely packed", "Regular arrangement / fixed positions"], "model_answer": "Particles are closely packed in a regular arrangement and vibrate about fixed positions."},
                {"label": "(b)", "question": "Explain why gases are easily compressed.", "marks": 2, "command_word": "explain",
                 "expected_points": ["Particles far apart", "Large spaces between particles"], "model_answer": "Gas particles are far apart with large spaces between them, so they can be pushed closer together."}
            ]
            total = 4
        else:  # Physics
            stem = "Answer the following questions on electricity."
            parts = [
                {"label": "(a)", "question": "State the unit of electric current.", "marks": 1, "command_word": "state",
                 "expected_points": ["ampere (A)"], "model_answer": "Ampere (A)."},
                {"label": "(b)", "question": "State Ohm's law.", "marks": 2, "command_word": "state",
                 "expected_points": ["V is proportional to I", "Provided temperature is constant"], "model_answer": "The current through a conductor is proportional to the potential difference across it, provided temperature is constant."}
            ]
            total = 3

        rubric = {p["label"]: {"marks": p["marks"], "points": p.get("expected_points", []), "accept_alternatives": []} for p in parts}
        from constants import DIFFICULTY_LEVELS
        points_value = DIFFICULTY_LEVELS.get(difficulty, {}).get('point_value', 10)

        return {
            'question_type': 'structured',
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'stem': stem,
            'parts': parts,
            'total_marks': total,
            'marking_rubric': rubric,
            'teacher_notes': "Write answers in full sentences and use correct scientific terms.",
            'source': 'fallback_olevel',
            'points': points_value,
            'category': subject
        }
    
    def _create_olevel_prompt(self, subject: str, topic: str, difficulty: str) -> str:
        """Create O-Level appropriate prompt for DeepSeek AI"""
        
        # Get learning objectives for this topic
        objectives = self.learning_objectives.get(subject, {}).get(topic, [
            f"Understand basic concepts of {topic}",
            f"Apply {topic} knowledge to simple problems",
            f"Explain {topic} using appropriate terminology"
        ])
        
        # Difficulty-appropriate language
        difficulty_guidance = {
            'easy': "Basic recall and understanding level. Simple, direct questions.",
            'medium': "Application and analysis level. Require some thinking and connection of ideas.",
            'difficult': "Evaluation and synthesis level. Multi-step problems requiring deeper understanding."
        }
        
        # Randomly vary question style for variety
        question_style = random.choice([
            'direct_knowledge',      # 50% direct knowledge
            'direct_knowledge',
            'direct_knowledge',
            'application',           # 30% application
            'application',
            'situational'            # 20% situational/context
        ])
        
        style_guidance = {
            'direct_knowledge': """Generate a DIRECT KNOWLEDGE question like ZIMSEC/Cambridge style:
- Ask about definitions, concepts, processes, or principles
- Examples: "What is...", "Which statement correctly describes...", "Define...", "Name the..."
- NO story or situation context - ask directly about the science concept
- Focus on testing understanding of facts and concepts""",
            'application': """Generate an APPLICATION question:
- Test how well students can apply scientific concepts to scenarios
- Examples: "Calculate...", "Predict what happens when...", "Explain why..."
- Brief context is OK, but focus on testing the scientific principle""",
            'situational': """Generate a SITUATIONAL question with local context:
- Use brief Zimbabwean names/places naturally
- Apply science concept to a real-world situation
- Keep the situation brief (one sentence), focus on the science"""
        }
        
        prompt = f"""Generate a ZIMSEC O-Level Combined Science question for {subject} - {topic}.

**STUDENT LEVEL:** O-Level students (ages 15-17). Keep content age-appropriate.

**QUESTION STYLE:** {question_style.upper()}
{style_guidance.get(question_style, style_guidance['direct_knowledge'])}

**Learning Objectives:**
{chr(10).join(f"• {obj}" for obj in objectives)}

**Question Requirements:**
- Subject: {subject}
- Topic: {topic}
- Difficulty: {difficulty} ({difficulty_guidance.get(difficulty, 'Standard level')})
- Format: Multiple choice (4 options A, B, C, D)
- Use clear, simple language suitable for teenagers
- One option must be clearly correct

**IMPORTANT - Avoid:**
- Overly complex laboratory procedures
- University-level content
- Ambiguous options where multiple could be correct

Return ONLY a valid JSON object:
{{
    "question": "Clear, focused question testing understanding of {topic}",
    "options": {{
        "A": "First option",
        "B": "Second option", 
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "B",
    "explanation": "DETAILED SOLUTION: A thorough scientific explanation (4-6 sentences) covering WHY the correct answer is right, why other options are wrong, and the underlying scientific principle. Use proper scientific terminology.",
    "teaching_explanation": "TEACHER FEEDBACK: A warm, encouraging explanation written as if you're a patient tutor having a conversation with the student. Use a relatable analogy, everyday example, or real-life application to help them truly understand. MUST BE DIFFERENT from the explanation above - focus on making the concept memorable and easy to understand.",
    "difficulty": "{difficulty}",
    "learning_objective": "What the student should learn from this question",
    "question_style": "{question_style}"
}}

CRITICAL: The 'explanation' and 'teaching_explanation' MUST be completely different texts with different approaches!

Generate an educational {question_style.replace('_', ' ')} question now!"""

        return prompt
    
    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Call DeepSeek API with O-Level appropriate settings"""
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional O-Level science tutor with 10+ years experience teaching ZIMSEC Combined Science to Zimbabwean teenagers. You create engaging, age-appropriate questions that help students understand concepts clearly. Your explanations are simple, encouraging, and educational."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "temperature": 0.7,  # Balanced creativity for educational content
            "max_tokens": 1500   # Sufficient for O-Level questions and explanations
        }
        
        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            
            try:
                logger.info(f"DeepSeek O-Level {generation_type} attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                response = requests.post(
                    self.api_url,
                    headers=headers,
                    json=data,
                    timeout=timeout
                )
                
                if response.status_code == 200:
                    response_data = response.json()
                    content = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
                    
                    if content:
                        # Parse JSON from response
                        try:
                            # Extract JSON from response (handle markdown formatting)
                            json_start = content.find('{')
                            json_end = content.rfind('}') + 1
                            
                            if json_start != -1 and json_end > json_start:
                                json_str = content[json_start:json_end]
                                result = json.loads(json_str)
                                
                                logger.info(f"✅ Successfully generated O-Level {generation_type}")
                                return result
                            else:
                                logger.error(f"No valid JSON found in DeepSeek response for {generation_type}")
                                
                        except json.JSONDecodeError as e:
                            logger.error(f"JSON parsing error for {generation_type}: {e}")
                            
                        if attempt < self.max_retries - 1:
                            time.sleep(self.retry_delay)
                            continue
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                        continue
                        
            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries} (waited {timeout}s)")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                    
            except Exception as e:
                logger.error(f"DeepSeek error on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
        
        logger.error(f"Failed to generate {generation_type} after {self.max_retries} attempts")
        return None
    
    def _validate_and_enhance_question(self, question_data: Dict, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Validate and enhance the generated question for O-Level standards"""
        try:
            # Ensure all required fields are present
            required_fields = ['question', 'options', 'correct_answer', 'explanation']
            for field in required_fields:
                if field not in question_data:
                    logger.warning(f"Missing field {field} in generated question")
                    return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Validate options format
            if not isinstance(question_data['options'], dict):
                logger.warning("Options not in correct format")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Ensure explanation is O-Level appropriate (not too long or complex)
            explanation = question_data.get('explanation', '')
            if len(explanation) > 300:  # Keep explanations concise for O-Level
                question_data['explanation'] = explanation[:297] + "..."
            
            # Add metadata for database storage
            from constants import DIFFICULTY_LEVELS
            question_data.update({
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'category': subject,  # For database compatibility
                'question_type': 'mcq',
                'source': 'ai_generated_olevel',
                'points': DIFFICULTY_LEVELS.get(difficulty, {}).get('point_value', 10)
            })
            
            return question_data
            
        except Exception as e:
            logger.error(f"Error validating question: {e}")
            return self._get_fallback_question(subject, topic, difficulty, user_id)
    
    def _get_fallback_question(self, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Provide O-Level appropriate fallback questions when AI fails"""
        
        fallback_questions = {
            "Biology": {
                "Cell Structure and Organisation": {
                    "easy": {
                        "question": "Which part of the cell controls all cell activities?",
                        "options": {"A": "Cell membrane", "B": "Nucleus", "C": "Cytoplasm", "D": "Vacuole"},
                        "correct_answer": "B",
                        "explanation": "The nucleus is like the brain of the cell - it contains DNA and controls everything the cell does, just like how your brain controls your body."
                    },
                    "medium": {
                        "question": "What is the main difference between plant and animal cells?",
                        "options": {"A": "Plant cells are bigger", "B": "Animal cells have more organelles", "C": "Plant cells have cell walls and chloroplasts", "D": "Animal cells have nuclei"},
                        "correct_answer": "C",
                        "explanation": "Plant cells have a tough cell wall (like a protective fence) and green chloroplasts for making food through photosynthesis. Animal cells don't have these."
                    }
                },
                "Respiration": {
                    "easy": {
                        "question": "What gas do we breathe in during respiration?",
                        "options": {"A": "Carbon dioxide", "B": "Oxygen", "C": "Nitrogen", "D": "Water vapor"},
                        "correct_answer": "B",
                        "explanation": "We breathe in oxygen from the air. Our body uses oxygen to release energy from food, just like how fire needs oxygen to burn."
                    }
                }
            },
            "Chemistry": {
                "Acids, Bases and Salts": {
                    "easy": {
                        "question": "Which of these is an example of an acid?",
                        "options": {"A": "Water", "B": "Salt", "C": "Lemon juice", "D": "Soap"},
                        "correct_answer": "C",
                        "explanation": "Lemon juice contains citric acid, which is why it tastes sour. All acids have a sour taste - but never taste unknown chemicals in the lab!"
                    }
                },
                "Particulate Nature of Matter": {
                    "easy": {
                        "question": "What happens to particles when a solid is heated and melts?",
                        "options": {"A": "They disappear", "B": "They move faster and spread apart", "C": "They get smaller", "D": "They stick together more"},
                        "correct_answer": "B",
                        "explanation": "When ice melts to water, the particles gain energy and move faster, allowing them to slide past each other instead of staying in fixed positions."
                    }
                }
            },
            "Physics": {
                "Electricity (Current Electricity, Circuits)": {
                    "easy": {
                        "question": "What is the unit used to measure electric current?",
                        "options": {"A": "Volt", "B": "Ampere", "C": "Ohm", "D": "Watt"},
                        "correct_answer": "B",
                        "explanation": "Electric current is measured in Amperes (or Amps for short). Think of it like measuring how much water flows through a pipe - Amps measure how much electricity flows through a wire."
                    }
                },
                "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)": {
                    "easy": {
                        "question": "What force pulls objects towards the Earth?",
                        "options": {"A": "Friction", "B": "Magnetism", "C": "Gravity", "D": "Air resistance"},
                        "correct_answer": "C",
                        "explanation": "Gravity is the force that pulls everything towards Earth. It's why when you drop something, it falls down instead of floating away."
                    }
                }
            },
            "Chemistry": {
                "Experimental Chemistry": {
                    "easy": {
                        "question": "Which piece of apparatus is used to measure exactly 25.0 cm³ of solution?",
                        "options": {"A": "Measuring cylinder", "B": "Pipette", "C": "Beaker", "D": "Conical flask"},
                        "correct_answer": "B",
                        "explanation": "A pipette measures exact volumes accurately. A 25.0 cm³ pipette will deliver exactly that volume, unlike measuring cylinders which are less precise.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Particulate Nature of Matter": {
                    "easy": {
                        "question": "In which state of matter are particles arranged in a regular pattern?",
                        "options": {"A": "Solid", "B": "Liquid", "C": "Gas", "D": "Plasma"},
                        "correct_answer": "A",
                        "explanation": "In solids, particles are arranged in a regular, ordered pattern (crystal lattice) and can only vibrate about fixed positions.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Formulae and Stoichiometry": {
                    "easy": {
                        "question": "What is the chemical formula for calcium carbonate?",
                        "options": {"A": "CaCO₂", "B": "CaCO₃", "C": "Ca₂CO₃", "D": "CaC₂O₃"},
                        "correct_answer": "B", 
                        "explanation": "Calcium carbonate contains Ca²⁺ and CO₃²⁻ ions. Using the cross-multiplication method: Ca²⁺ and CO₃²⁻ give CaCO₃.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Electrolysis": {
                    "easy": {
                        "question": "During electrolysis, positive ions move towards the...",
                        "options": {"A": "Anode", "B": "Cathode", "C": "Center", "D": "Both electrodes"},
                        "correct_answer": "B",
                        "explanation": "Positive ions (cations) are attracted to the negative electrode (cathode). Remember: opposite charges attract.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Energy from Chemicals": {
                    "easy": {
                        "question": "A reaction that releases heat energy to the surroundings is called...",
                        "options": {"A": "Endothermic", "B": "Exothermic", "C": "Isothermic", "D": "Thermodynamic"},
                        "correct_answer": "B", 
                        "explanation": "Exothermic reactions give out heat, making the surroundings warmer. Examples include combustion and neutralization reactions.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Chemical Reactions": {
                    "easy": {
                        "question": "Which metal is most reactive in the reactivity series?",
                        "options": {"A": "Iron", "B": "Copper", "C": "Potassium", "D": "Lead"},
                        "correct_answer": "C",
                        "explanation": "Potassium is at the top of the reactivity series, making it the most reactive metal. It reacts explosively with water.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Acids, Bases and Salts": {
                    "easy": {
                        "question": "What is the pH range for acids?",
                        "options": {"A": "0-6", "B": "7-14", "C": "0-7", "D": "8-14"},
                        "correct_answer": "A",
                        "explanation": "Acids have pH values from 0 to 6 (below 7). The lower the pH, the stronger the acid. pH 7 is neutral.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Periodic Table": {
                    "easy": {
                        "question": "Elements in the same group of the periodic table have the same number of...",
                        "options": {"A": "Protons", "B": "Neutrons", "C": "Electrons in outer shell", "D": "Energy levels"},
                        "correct_answer": "C",
                        "explanation": "Elements in the same group have the same number of valence electrons (electrons in the outer shell), which gives them similar chemical properties.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Metals": {
                    "easy": {
                        "question": "Which property is NOT characteristic of metals?",
                        "options": {"A": "Conduct electricity", "B": "Malleable", "C": "Brittle when hammered", "D": "Lustrous"},
                        "correct_answer": "C",
                        "explanation": "Metals are malleable (can be hammered into sheets) and ductile, not brittle. Non-metals are typically brittle when solid.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Chemistry of Environment": {
                    "easy": {
                        "question": "Which gas is the main cause of the greenhouse effect?",
                        "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Argon"},
                        "correct_answer": "C",
                        "explanation": "Carbon dioxide traps heat in the atmosphere, causing global warming. It's produced by burning fossil fuels and deforestation.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Organic Chemistry": {
                    "easy": {
                        "question": "Hydrocarbons contain only which two elements?",
                        "options": {"A": "Hydrogen and oxygen", "B": "Carbon and oxygen", "C": "Hydrogen and carbon", "D": "Carbon and nitrogen"},
                        "correct_answer": "C",
                        "explanation": "Hydrocarbons are organic compounds containing only hydrogen and carbon atoms. Examples include methane (CH₄) and ethane (C₂H₆).",
                        "cognitive_level": "knowledge_understanding"
                    }
                }
            },
            "Physics": {
                "Measurement and Physical Quantities": {
                    "easy": {
                        "question": "What is the SI unit of length?",
                        "options": {"A": "Kilogram", "B": "Second", "C": "Metre", "D": "Ampere"},
                        "correct_answer": "C",
                        "explanation": "The metre (m) is the SI base unit for length. It's one of the seven fundamental SI units from which all other units are derived.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)": {
                    "easy": {
                        "question": "What is the difference between speed and velocity?",
                        "options": {"A": "There is no difference", "B": "Velocity includes direction", "C": "Speed is faster", "D": "Velocity is measured in km/h"},
                        "correct_answer": "B",
                        "explanation": "Velocity is a vector quantity that includes both magnitude (how fast) and direction. Speed is a scalar that only tells us how fast something is moving.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)": {
                    "easy": {
                        "question": "What is the unit of force?",
                        "options": {"A": "Joule", "B": "Newton", "C": "Watt", "D": "Pascal"},
                        "correct_answer": "B",
                        "explanation": "Force is measured in Newtons (N). This unit is named after Sir Isaac Newton, who formulated the laws of motion.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Work, Energy and Power": {
                    "easy": {
                        "question": "Which formula correctly calculates work done?",
                        "options": {"A": "W = F + s", "B": "W = F × s", "C": "W = F ÷ s", "D": "W = F - s"},
                        "correct_answer": "B",
                        "explanation": "Work done equals Force multiplied by distance (W = Fs). Work is only done when a force moves an object in the direction of the force.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)": {
                    "easy": {
                        "question": "Heat transfer by the movement of fluids is called...",
                        "options": {"A": "Conduction", "B": "Convection", "C": "Radiation", "D": "Expansion"},
                        "correct_answer": "B",
                        "explanation": "Convection is heat transfer in liquids and gases where the heated fluid moves, carrying heat energy with it. Hot air rises because it's less dense.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Waves (General Wave Properties, Optics, Sound)": {
                    "easy": {
                        "question": "Which equation correctly relates wave speed, frequency, and wavelength?",
                        "options": {"A": "v = f + λ", "B": "v = f - λ", "C": "v = f × λ", "D": "v = f ÷ λ"},
                        "correct_answer": "C",
                        "explanation": "The wave equation is v = fλ (speed = frequency × wavelength). This fundamental relationship applies to all types of waves.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Electricity (Current Electricity, Circuits)": {
                    "easy": {
                        "question": "According to Ohm's law, voltage equals...",
                        "options": {"A": "Current × Resistance", "B": "Current + Resistance", "C": "Current ÷ Resistance", "D": "Current - Resistance"},
                        "correct_answer": "A",
                        "explanation": "Ohm's law states that V = I × R (Voltage = Current × Resistance). This is the most important equation in electrical circuits.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Magnetism and Electromagnetism": {
                    "easy": {
                        "question": "What happens when like magnetic poles are brought together?",
                        "options": {"A": "They attract", "B": "They repel", "C": "Nothing happens", "D": "They demagnetize"},
                        "correct_answer": "B",
                        "explanation": "Like poles (N-N or S-S) repel each other, while unlike poles (N-S) attract. This is a fundamental property of magnets.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Electronics (Logic Gates, Components)": {
                    "easy": {
                        "question": "What is the output of a NOT gate when the input is 1?",
                        "options": {"A": "1", "B": "0", "C": "2", "D": "Cannot determine"},
                        "correct_answer": "B",
                        "explanation": "A NOT gate inverts its input. When the input is 1 (High), the output is 0 (Low), and vice versa. It's also called an inverter.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Atomic and Nuclear Physics (Modern Physics)": {
                    "easy": {
                        "question": "Which type of radiation is stopped by a sheet of paper?",
                        "options": {"A": "Alpha", "B": "Beta", "C": "Gamma", "D": "X-rays"},
                        "correct_answer": "A",
                        "explanation": "Alpha particles are the least penetrating radiation and can be stopped by paper or a few centimeters of air. They are helium nuclei with +2 charge.",
                        "cognitive_level": "knowledge_understanding"
                    }
                }
            }
        }
        
        # Get fallback question for the specific topic
        subject_fallbacks = fallback_questions.get(subject, {})
        topic_fallbacks = subject_fallbacks.get(topic, {})
        difficulty_fallback = topic_fallbacks.get(difficulty)
        
        if difficulty_fallback:
            result = difficulty_fallback.copy()
        else:
            # Generic fallback if specific topic not found
            result = {
                "question": f"What is an important concept in {topic}?",
                "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
                "correct_answer": "A",
                "explanation": f"This is a basic concept in {topic} that O-Level students should understand."
            }
        
        # Add metadata
        result.update({
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'category': subject,
            'question_type': 'mcq',
            'source': 'fallback_olevel',
            'learning_objective': f"Understand basic concepts of {topic}",
            'real_world_application': f"Apply {topic} knowledge in everyday situations",
            # Generate a friendly teaching explanation different from the main explanation
            'teaching_explanation': f"Great effort! 🌟 This question tests your understanding of {topic}. Remember, {subject} concepts are all around us in daily life. Keep practicing and you'll master this topic! If you got it wrong, don't worry - every mistake is a chance to learn something new."
        })
        
        return result
    
    def generate_multiple_questions(self, subject: str, topic: str, count: int = 5) -> List[Dict]:
        """Generate multiple questions for a topic across different difficulties"""
        questions = []
        
        # Generate questions across difficulties for comprehensive coverage
        difficulties = ['easy', 'easy', 'medium', 'medium', 'difficult']  # More easy/medium for O-Level
        
        for i in range(min(count, len(difficulties))):
            difficulty = difficulties[i]
            
            try:
                question = self.generate_topical_question(subject, topic, difficulty)
                if question:
                    questions.append(question)
                    time.sleep(1)  # Small delay between generations
                else:
                    logger.warning(f"Failed to generate question {i+1} for {subject}/{topic}")
                    
            except Exception as e:
                logger.error(f"Error generating question {i+1} for {subject}/{topic}: {e}")
        
        return questions
    
    def get_topic_coverage_status(self, subject: str) -> Dict[str, int]:
        """Get current question count per topic for coverage analysis"""
        try:
            from constants import TOPICS
            from database.external_db import count_questions_by_category_and_topic
            
            topics = TOPICS.get(subject, [])
            coverage = {}
            
            for topic in topics:
                count = count_questions_by_category_and_topic(subject, topic)
                coverage[topic] = count
            
            return coverage
            
        except Exception as e:
            logger.error(f"Error getting topic coverage for {subject}: {e}")
            return {}
    
    def ensure_minimum_questions_per_topic(self, subject: str, min_questions: int = 10):
        """Ensure each topic has minimum number of questions in database"""
        try:
            from constants import TOPICS
            
            topics = TOPICS.get(subject, [])
            logger.info(f"Ensuring minimum {min_questions} questions per topic for {subject}")
            
            for topic in topics:
                current_count = self.get_topic_coverage_status(subject).get(topic, 0)
                
                if current_count < min_questions:
                    needed = min_questions - current_count
                    logger.info(f"Generating {needed} questions for {subject}/{topic}")
                    
                    # Generate needed questions
                    new_questions = self.generate_multiple_questions(subject, topic, needed)
                    
                    # Save to database
                    for question in new_questions:
                        self._save_question_to_database(question)
                    
                    logger.info(f"✅ Added {len(new_questions)} questions for {subject}/{topic}")
                else:
                    logger.info(f"✅ {subject}/{topic} has sufficient questions ({current_count})")
                    
        except Exception as e:
            logger.error(f"Error ensuring minimum questions for {subject}: {e}")
    
    def _save_question_to_database(self, question_data: Dict) -> bool:
        """Save generated question to database with proper O-Level metadata"""
        try:
            from database.external_db import save_ai_question_to_database
            
            # Prepare question for database storage
            db_question = {
                'question': question_data['question'],
                'options': question_data['options'],
                'correct_answer': question_data['correct_answer'],
                'explanation': question_data['explanation'],
                'difficulty': question_data['difficulty'],
                'learning_objective': question_data.get('learning_objective', ''),
                'real_world_application': question_data.get('real_world_application', '')
            }
            
            result = save_ai_question_to_database(
                db_question, 
                question_data['subject'], 
                question_data['topic']
            )
            
            if result:
                logger.info(f"✅ Saved O-Level question to database: {question_data['subject']}/{question_data['topic']}")
                return True
            else:
                logger.error(f"❌ Failed to save question to database")
                return False
                
        except Exception as e:
            logger.error(f"Error saving question to database: {e}")
            return False

    def initialize_physics_support(self):
        """Initialize comprehensive Physics topic support with ZIMSEC guidelines"""
        # Enhanced Physics topic details following comprehensive ZIMSEC O-Level syllabus (10 topics)
        self.physics_topic_details = {
            "Measurement and Physical Quantities": {
                "objectives": [
                    "Define physical quantities and distinguish between base and derived quantities",
                    "Use SI units correctly and convert between unit prefixes",
                    "Apply significant figures and accuracy in measurements",
                    "Use vernier calipers and micrometers correctly",
                    "Measure time using pendulums and stopwatches",
                    "Distinguish between mass and weight",
                    "Calculate density using mass and volume",
                    "Understand scalars and vectors"
                ],
                "key_concepts": [
                    "Physical quantities", "SI base units (m, kg, s, A, K, mol, cd)",
                    "Derived units", "Unit prefixes (mega, kilo, milli, micro)",
                    "Significant figures", "Vernier caliper (0.01 cm precision)",
                    "Micrometer screw gauge (0.01 mm precision)", "Zero error correction",
                    "Simple pendulum period", "Mass vs weight (W = mg)",
                    "Density (ρ = m/V)", "Scalar vs vector quantities"
                ],
                "misconceptions": [
                    "Mass and weight are the same thing",
                    "Larger instruments are always more accurate",
                    "Weight is constant everywhere",
                    "Density depends on object size"
                ]
            },
            "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)": {
                "objectives": [
                    "Distinguish between distance and displacement",
                    "Distinguish between speed and velocity",
                    "Calculate average speed and instantaneous speed",
                    "Define and calculate acceleration",
                    "Interpret distance-time graphs (gradient = speed)",
                    "Interpret speed-time graphs (gradient = acceleration, area = distance)",
                    "Apply SUVAT equations to uniformly accelerated motion",
                    "Understand free fall and acceleration due to gravity (g = 10 m/s²)",
                    "Analyze motion using ticker tape experiments"
                ],
                "key_concepts": [
                    "Distance vs displacement", "Speed vs velocity (scalar vs vector)",
                    "Average speed = total distance / total time",
                    "Acceleration = (v - u) / t", "Distance-time graphs",
                    "Speed-time graphs", "Area under graph = distance",
                    "SUVAT equations (v = u + at, s = ut + ½at², v² = u² + 2as)",
                    "Free fall (g = 10 m/s²)", "Ticker tape timer analysis"
                ],
                "misconceptions": [
                    "Distance and displacement are the same",
                    "Speed and velocity are always equal",
                    "Negative acceleration always means slowing down",
                    "Objects fall at different speeds in vacuum"
                ]
            },
            "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)": {
                "objectives": [
                    "Define force and describe its effects on motion and shape",
                    "Distinguish between contact and non-contact forces",
                    "Calculate weight using W = mg",
                    "Apply Newton's three laws of motion",
                    "Calculate resultant force and predict motion",
                    "Understand terminal velocity in fluids",
                    "Calculate moments and apply principle of moments",
                    "Understand center of gravity and stability",
                    "Calculate pressure (P = F/A)",
                    "Understand friction and its applications"
                ],
                "key_concepts": [
                    "Force definition (push or pull)", "Newton (unit of force)",
                    "Weight vs mass", "Newton's First Law (inertia)",
                    "Newton's Second Law (F = ma)", "Newton's Third Law (action-reaction)",
                    "Balanced vs unbalanced forces", "Terminal velocity",
                    "Moment = Force × perpendicular distance",
                    "Principle of moments (equilibrium)", "Center of gravity",
                    "Pressure (P = F/A)", "Friction (useful and problematic)"
                ],
                "misconceptions": [
                    "Force is needed to keep objects moving at constant velocity",
                    "Heavier objects fall faster",
                    "Weight and mass are identical",
                    "Friction is always bad"
                ]
            },
            "Work, Energy and Power": {
                "objectives": [
                    "Define work done and calculate using W = Fs",
                    "Identify different forms of energy",
                    "State and apply the law of conservation of energy",
                    "Calculate kinetic energy (KE = ½mv²)",
                    "Calculate gravitational potential energy (GPE = mgh)",
                    "Calculate power (P = W/t or P = E/t)",
                    "Calculate efficiency and interpret Sankey diagrams",
                    "Compare renewable and non-renewable energy resources"
                ],
                "key_concepts": [
                    "Work done (W = Fs, force × distance)", "Joule (unit of work/energy)",
                    "Forms of energy (kinetic, potential, thermal, chemical, nuclear)",
                    "Law of conservation of energy", "KE = ½mv²",
                    "GPE = mgh", "Power = Work/time", "Watt (unit of power)",
                    "Efficiency = (useful output / total input) × 100%",
                    "Sankey diagrams", "Renewable energy sources",
                    "Non-renewable energy sources"
                ],
                "misconceptions": [
                    "Energy can be created or destroyed",
                    "Power and energy are the same",
                    "Work is done when holding a heavy object still"
                ]
            },
            "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)": {
                "objectives": [
                    "Describe the kinetic molecular model of matter",
                    "Explain Brownian motion as evidence for particles",
                    "Explain gas pressure in terms of particle collisions",
                    "Describe thermal expansion in solids, liquids, and gases",
                    "Distinguish between heat and temperature",
                    "Measure temperature using thermometers",
                    "Calculate energy using specific heat capacity (Q = mcΔθ)",
                    "Calculate energy using latent heat (Q = mL)",
                    "Compare evaporation and boiling",
                    "Explain conduction, convection, and radiation"
                ],
                "key_concepts": [
                    "States of matter (solid, liquid, gas)", "Particle arrangement and movement",
                    "Brownian motion", "Gas pressure", "Thermal expansion",
                    "Bimetallic strip", "Heat vs temperature",
                    "Specific heat capacity (Q = mcΔθ)", "Latent heat (Q = mL)",
                    "Evaporation vs boiling", "Conduction (solids, free electrons)",
                    "Convection (fluids, density currents)", "Radiation (EM waves, no medium)",
                    "Vacuum flask design"
                ],
                "misconceptions": [
                    "Heat and temperature are the same",
                    "All materials expand equally when heated",
                    "Conduction occurs in gases",
                    "Radiation requires a medium"
                ]
            },
            "Waves (General Wave Properties, Optics, Sound)": {
                "objectives": [
                    "Describe wave properties (amplitude, wavelength, frequency, period)",
                    "Distinguish between transverse and longitudinal waves",
                    "Apply the wave equation (v = fλ)",
                    "Explain reflection, refraction, diffraction, and dispersion",
                    "Apply laws of reflection",
                    "Explain refraction and calculate refractive index",
                    "Understand total internal reflection and critical angle",
                    "Describe lens types and image formation",
                    "Explain sound wave properties",
                    "Calculate echo distances (d = vt/2)",
                    "Describe ultrasound applications"
                ],
                "key_concepts": [
                    "Transverse vs longitudinal waves", "Amplitude, wavelength, frequency",
                    "Wave equation (v = fλ)", "Period (T = 1/f)",
                    "Law of reflection (i = r)", "Refraction rules",
                    "Refractive index (n = sin i / sin r)", "Critical angle",
                    "Total internal reflection", "Converging and diverging lenses",
                    "Sound speed in different media", "Echo calculations (d = vt/2)",
                    "Ultrasound applications", "Electromagnetic spectrum"
                ],
                "misconceptions": [
                    "Sound and light are the same type of wave",
                    "Sound travels in vacuum",
                    "Louder sounds travel faster",
                    "Light always travels in straight lines"
                ]
            },
            "Electricity (Current Electricity, Circuits)": {
                "objectives": [
                    "Define electric current and explain charge flow",
                    "Define e.m.f. and potential difference",
                    "Define resistance and apply Ohm's Law (V = IR)",
                    "Sketch and interpret I-V graphs for different components",
                    "Calculate resistance in series and parallel circuits",
                    "Analyze potential divider circuits with sensors",
                    "Calculate electrical power (P = VI, P = I²R, P = V²/R)",
                    "Calculate electrical energy (E = Pt, E = VIt)",
                    "Explain electrical safety features (fuses, circuit breakers, earthing)"
                ],
                "key_concepts": [
                    "Electric current (I = Q/t)", "Ampere (unit of current)",
                    "E.m.f. vs potential difference", "Volt (unit of p.d.)",
                    "Resistance (R = V/I)", "Ohm (unit of resistance)",
                    "Ohm's Law", "I-V graphs (resistor, filament lamp, diode)",
                    "Series circuits (same current, V adds, R adds)",
                    "Parallel circuits (same V, I adds, 1/R = 1/R₁ + 1/R₂)",
                    "Potential dividers", "LDR and thermistor sensors",
                    "Power equations", "Energy calculations (kWh)",
                    "Fuses, circuit breakers, earthing"
                ],
                "misconceptions": [
                    "Current gets used up in a circuit",
                    "Voltage and current are the same",
                    "Thick wires have more resistance",
                    "Batteries are used up when they are dead"
                ]
            },
            "Magnetism and Electromagnetism": {
                "objectives": [
                    "Distinguish between soft and hard magnetic materials",
                    "Describe magnetic poles and magnetic field lines",
                    "Explain methods of magnetization and demagnetization",
                    "Describe the magnetic effect of electric current",
                    "Apply the Right-Hand Grip Rule for field direction",
                    "Explain electromagnet applications",
                    "Describe the motor effect and apply Fleming's Left-Hand Rule",
                    "Explain DC motor operation",
                    "Explain electromagnetic induction (Faraday's and Lenz's Laws)",
                    "Describe AC generator operation",
                    "Apply transformer equations (Vp/Vs = Np/Ns)",
                    "Explain high voltage power transmission"
                ],
                "key_concepts": [
                    "Soft iron vs hard steel", "Magnetic domains",
                    "Magnetic poles (N and S)", "Magnetic field lines",
                    "Magnetization methods", "Demagnetization methods",
                    "Right-Hand Grip Rule", "Electromagnets",
                    "Motor effect", "Fleming's Left-Hand Rule",
                    "DC motor components", "Split-ring commutator",
                    "Electromagnetic induction", "Faraday's Law",
                    "Lenz's Law (opposes change)", "AC generator",
                    "Transformers (Vp/Vs = Np/Ns)", "Step-up vs step-down",
                    "Power transmission (high V, low I, less I²R loss)"
                ],
                "misconceptions": [
                    "All metals are magnetic",
                    "Cutting a magnet gives isolated poles",
                    "Transformers work with DC",
                    "Current creates a magnetic field only in electromagnets"
                ]
            },
            "Electronics (Logic Gates, Components)": {
                "objectives": [
                    "Distinguish between analogue and digital signals",
                    "Explain advantages of digital over analogue signals",
                    "Describe the function and truth table of NOT gate",
                    "Describe the function and truth table of AND gate",
                    "Describe the function and truth table of OR gate",
                    "Describe the function and truth table of NAND gate",
                    "Describe the function and truth table of NOR gate",
                    "Explain LED operation and need for protective resistor",
                    "Describe relay operation and applications",
                    "Explain potential divider circuits with variable resistors"
                ],
                "key_concepts": [
                    "Analogue signals (continuous)", "Digital signals (High/Low, 1/0)",
                    "Logic gates", "NOT gate (inverter)",
                    "AND gate (output 1 only if all inputs 1)",
                    "OR gate (output 1 if any input 1)",
                    "NAND gate (opposite of AND)", "NOR gate (opposite of OR)",
                    "Truth tables", "Universal gates (NAND, NOR)",
                    "LED with protective resistor", "Relay (low power controls high power)",
                    "Variable resistor", "Threshold voltage"
                ],
                "misconceptions": [
                    "Digital and analogue signals carry the same amount of information",
                    "Logic gates can have more than two states",
                    "LEDs work without resistors"
                ]
            },
            "Atomic and Nuclear Physics (Modern Physics)": {
                "objectives": [
                    "Describe Rutherford's scattering experiment and conclusions",
                    "Describe atomic structure (nucleus and electrons)",
                    "Define proton number and nucleon number",
                    "Define isotopes and explain their properties",
                    "Define radioactivity as spontaneous and random decay",
                    "Compare properties of alpha, beta, and gamma radiation",
                    "Describe detection methods (Geiger-Müller tube)",
                    "Explain background radiation sources",
                    "Calculate half-life from decay data",
                    "Explain uses of radioactive isotopes",
                    "Distinguish between nuclear fission and fusion",
                    "Describe safety precautions for handling radioactive materials"
                ],
                "key_concepts": [
                    "Rutherford's experiment", "Nuclear model of atom",
                    "Protons, neutrons, electrons", "Proton number (Z), nucleon number (A)",
                    "Isotopes", "Radioactive decay (spontaneous, random)",
                    "Alpha particles (He nucleus, +2, stopped by paper)",
                    "Beta particles (electrons, -1, stopped by aluminium)",
                    "Gamma rays (EM waves, 0, reduced by lead)",
                    "Ionizing power vs penetrating power",
                    "Geiger-Müller tube", "Background radiation",
                    "Half-life calculations", "Uses of radioisotopes",
                    "Nuclear fission (splitting)", "Chain reaction",
                    "Nuclear fusion (joining)", "Safety precautions"
                ],
                "misconceptions": [
                    "Radioactive decay can be controlled",
                    "All radiation is equally dangerous",
                    "Radioactivity is man-made",
                    "Radiation makes objects permanently radioactive"
                ]
            }
        }
        
        # Enhanced Physics aspect variations following comprehensive ZIMSEC O-Level syllabus (10 topics)
        self.physics_aspect_variations = {
            "Measurement and Physical Quantities": [
                # Physical Quantities and SI Units
                "physical_quantities_definition", "base_quantities_length_mass_time",
                "derived_quantities_speed_area_volume", "si_base_units_metre_kilogram_second",
                "unit_prefixes_mega_kilo_milli_micro", "unit_conversions",
                "significant_figures_accuracy", "scalar_quantities_examples",
                "vector_quantities_examples", "scalar_vs_vector_differences",
                # Measurement Instruments
                "vernier_caliper_structure", "vernier_caliper_reading",
                "micrometer_screw_gauge_structure", "micrometer_reading_technique",
                "zero_error_positive_negative", "zero_error_correction",
                "precision_vs_accuracy", "measurement_uncertainty",
                # Time Measurement
                "simple_pendulum_period", "pendulum_factors_affecting_period",
                "stopwatch_reaction_time_error", "timing_multiple_oscillations",
                # Mass, Weight, Density
                "mass_definition_kg", "weight_definition_force",
                "weight_mass_relationship_w_mg", "gravity_g_10ms2",
                "weight_varies_location", "density_definition_formula",
                "density_mass_volume_relationship", "measuring_density_regular_irregular"
            ],
            "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)": [
                # Distance, Displacement, Speed, Velocity
                "distance_vs_displacement_scalar_vector", "speed_vs_velocity_scalar_vector",
                "average_speed_calculation", "instantaneous_speed_concept",
                "total_distance_divided_total_time", "unit_conversions_kmh_to_ms",
                # Acceleration
                "acceleration_definition", "acceleration_formula_v_u_t",
                "positive_negative_acceleration", "deceleration_concept",
                "acceleration_units_ms2", "uniform_acceleration",
                # Graphs of Motion
                "distance_time_graph_stationary", "distance_time_graph_constant_speed",
                "distance_time_graph_gradient_speed", "distance_time_graph_changing_speed",
                "speed_time_graph_constant_speed", "speed_time_graph_acceleration",
                "speed_time_graph_gradient_acceleration", "speed_time_graph_area_distance",
                "interpreting_motion_graphs", "comparing_motion_graphs",
                # SUVAT Equations
                "suvat_v_u_at", "suvat_s_ut_half_at_squared",
                "suvat_v_squared_u_squared_2as", "suvat_problem_solving",
                # Free Fall
                "free_fall_definition", "gravity_acceleration_10ms2",
                "terminal_velocity_concept", "ticker_tape_timer_analysis"
            ],
            "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)": [
                # Force Basics
                "force_definition_push_pull", "force_effects_motion_shape",
                "newton_unit_of_force", "contact_forces_examples",
                "non_contact_forces_examples", "resultant_force_calculation",
                "balanced_forces_equilibrium", "unbalanced_forces_acceleration",
                # Weight and Mass
                "weight_vs_mass_distinction", "weight_formula_w_mg",
                "weight_varies_gravity", "mass_constant_everywhere",
                # Newton's Laws
                "newtons_first_law_inertia", "newtons_first_law_applications",
                "newtons_second_law_f_ma", "newtons_second_law_calculations",
                "newtons_third_law_action_reaction", "newtons_third_law_examples",
                # Terminal Velocity
                "terminal_velocity_definition", "forces_during_free_fall",
                "air_resistance_increasing", "terminal_velocity_parachute",
                # Moments and Equilibrium
                "moment_definition_formula", "moment_force_perpendicular_distance",
                "principle_of_moments", "equilibrium_conditions",
                "center_of_gravity_concept", "stability_base_area_height",
                # Pressure
                "pressure_formula_f_a", "pressure_units_pascal",
                "pressure_area_relationship", "pressure_applications",
                # Friction
                "friction_definition", "friction_useful_applications",
                "friction_problematic_examples", "reducing_friction_lubrication"
            ],
            "Work, Energy and Power": [
                # Work Done
                "work_done_definition", "work_formula_w_fs",
                "work_joule_unit", "work_requires_force_and_motion",
                "work_direction_consideration", "work_calculation_problems",
                # Forms of Energy
                "kinetic_energy_definition", "gravitational_potential_energy_definition",
                "elastic_potential_energy", "chemical_energy_examples",
                "thermal_energy_heat", "electrical_energy_examples",
                "nuclear_energy_concept", "light_energy_sound_energy",
                # Energy Calculations
                "kinetic_energy_formula_half_mv_squared", "ke_calculation_problems",
                "gravitational_pe_formula_mgh", "gpe_calculation_problems",
                # Conservation of Energy
                "law_of_conservation_energy", "energy_transfers_examples",
                "energy_transformations_pendulum", "energy_transformations_falling_object",
                "energy_chain_diagrams",
                # Power
                "power_definition_rate", "power_formula_w_t",
                "power_watt_unit", "power_calculation_problems",
                # Efficiency
                "efficiency_definition", "efficiency_formula_percentage",
                "sankey_diagrams_interpretation", "improving_efficiency",
                # Energy Resources
                "renewable_energy_sources", "nonrenewable_energy_sources",
                "comparing_energy_sources", "environmental_impact_energy"
            ],
            "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)": [
                # Kinetic Molecular Model
                "states_of_matter_particle_arrangement", "solid_particles_vibrating",
                "liquid_particles_sliding", "gas_particles_random_motion",
                "brownian_motion_evidence", "brownian_motion_explanation",
                # Gas Pressure and Volume
                "gas_pressure_particle_collisions", "pressure_temperature_relationship",
                "pressure_volume_relationship", "explaining_gas_laws_kinetically",
                # Thermal Expansion
                "thermal_expansion_solids", "thermal_expansion_liquids",
                "thermal_expansion_gases", "bimetallic_strip_applications",
                "expansion_gaps_applications", "anomalous_expansion_water",
                # Temperature and Heat
                "temperature_vs_heat_difference", "thermometer_types",
                "temperature_scales_celsius_kelvin", "thermal_equilibrium",
                # Specific Heat Capacity
                "specific_heat_capacity_definition", "shc_formula_q_mc_delta_theta",
                "shc_calculation_problems", "water_high_shc_applications",
                # Latent Heat
                "latent_heat_fusion_definition", "latent_heat_vaporization_definition",
                "latent_heat_formula_q_ml", "latent_heat_calculations",
                "evaporation_vs_boiling", "cooling_by_evaporation",
                # Heat Transfer
                "conduction_mechanism_solids", "conduction_free_electrons_metals",
                "good_poor_conductors", "convection_mechanism_fluids",
                "convection_currents_examples", "radiation_electromagnetic_waves",
                "radiation_no_medium_required", "surface_color_radiation",
                "vacuum_flask_design", "home_insulation_methods"
            ],
            "Waves (General Wave Properties, Optics, Sound)": [
                # General Wave Properties
                "wave_definition_energy_transfer", "transverse_waves_definition",
                "longitudinal_waves_definition", "wave_terms_amplitude",
                "wave_terms_wavelength", "wave_terms_frequency",
                "wave_terms_period", "period_frequency_relationship",
                "wave_equation_v_f_lambda", "wave_equation_calculations",
                # Wave Behaviors
                "reflection_laws", "refraction_speed_change",
                "refraction_direction_change", "refractive_index_calculation",
                "diffraction_through_gaps", "critical_angle_total_internal_reflection",
                # Light and Optics
                "plane_mirrors_reflection", "converging_lens_images",
                "diverging_lens_images", "optical_fibers_applications",
                "dispersion_prism_spectrum", "color_filters",
                # Sound Waves
                "sound_longitudinal_waves", "sound_requires_medium",
                "sound_speed_different_media", "loudness_amplitude",
                "pitch_frequency", "echo_calculations_distance",
                "ultrasound_applications", "audible_range_hearing"
            ],
            "Electricity (Current Electricity, Circuits)": [
                # Current and Charge
                "electric_current_definition", "current_formula_i_q_t",
                "ampere_unit_current", "charge_carriers_electrons",
                "conventional_vs_electron_current",
                # E.m.f. and Potential Difference
                "emf_definition_energy_source", "potential_difference_definition",
                "volt_unit_pd", "emf_vs_pd_distinction",
                # Resistance and Ohm's Law
                "resistance_definition", "ohm_unit_resistance",
                "ohms_law_v_ir", "ohms_law_calculations",
                "factors_affecting_resistance", "resistivity_concept",
                # I-V Graphs
                "iv_graph_ohmic_conductor", "iv_graph_filament_lamp",
                "iv_graph_diode", "interpreting_iv_graphs",
                # Series and Parallel Circuits
                "series_circuit_current_same", "series_circuit_voltage_adds",
                "series_circuit_resistance_adds", "parallel_circuit_voltage_same",
                "parallel_circuit_current_adds", "parallel_resistance_calculation",
                "combined_series_parallel", "circuit_diagrams_symbols",
                # Potential Dividers
                "potential_divider_concept", "ldr_in_potential_divider",
                "thermistor_in_potential_divider", "sensor_circuits",
                # Electrical Power and Energy
                "power_formula_p_vi", "power_formula_p_i2r",
                "power_formula_p_v2_r", "energy_formula_e_pt",
                "kilowatt_hour_unit", "electricity_cost_calculations",
                # Electrical Safety
                "fuse_operation_selection", "circuit_breaker_operation",
                "earthing_safety", "three_pin_plug_wiring",
                "electrical_hazards", "safety_precautions"
            ],
            "Magnetism and Electromagnetism": [
                # Magnetic Materials and Domains
                "magnetic_materials_ferromagnetic", "soft_iron_vs_hard_steel",
                "magnetic_domains_concept", "domain_theory_magnetization",
                # Magnetic Poles and Fields
                "magnetic_poles_north_south", "like_poles_repel",
                "magnetic_field_lines", "field_line_properties",
                # Magnetization and Demagnetization
                "magnetization_methods_stroking", "magnetization_electrical",
                "demagnetization_methods", "temporary_permanent_magnets",
                # Electromagnetism
                "magnetic_effect_current", "right_hand_grip_rule",
                "solenoid_magnetic_field", "electromagnet_construction",
                "electromagnet_applications",
                # Motor Effect
                "motor_effect_force_on_wire", "flemings_left_hand_rule",
                "force_factors_current_field", "dc_motor_operation",
                "split_ring_commutator", "increasing_motor_force_speed",
                # Electromagnetic Induction
                "electromagnetic_induction_concept", "faradays_law",
                "lenzs_law_opposes_change", "inducing_emf_methods",
                "ac_generator_operation", "slip_rings_brushes",
                # Transformers
                "transformer_structure", "transformer_equation_vp_vs",
                "step_up_step_down", "transformer_power_equation",
                "power_transmission_high_voltage", "reducing_power_losses"
            ],
            "Electronics (Logic Gates, Components)": [
                # Analogue and Digital Signals
                "analogue_signals_continuous", "digital_signals_discrete",
                "advantages_digital_signals", "binary_representation",
                # Logic Gates
                "not_gate_inverter", "not_gate_truth_table",
                "and_gate_function", "and_gate_truth_table",
                "or_gate_function", "or_gate_truth_table",
                "nand_gate_function", "nand_gate_truth_table",
                "nor_gate_function", "nor_gate_truth_table",
                "universal_gates_nand_nor", "combined_logic_circuits",
                "drawing_truth_tables", "logic_circuit_analysis",
                # Electronic Components
                "led_operation", "led_protective_resistor",
                "relay_operation", "relay_applications",
                "variable_resistor_rheostat", "potential_divider_sensors",
                "thermistor_applications", "ldr_applications"
            ],
            "Atomic and Nuclear Physics (Modern Physics)": [
                # Atomic Structure
                "rutherford_scattering_experiment", "rutherford_conclusions",
                "nuclear_model_atom", "nucleus_protons_neutrons",
                "electrons_orbits_shells", "proton_number_z",
                "nucleon_number_a", "isotope_definition",
                "isotope_examples", "radioactive_isotopes",
                # Radioactivity
                "radioactivity_spontaneous_random", "types_of_radiation",
                "alpha_particle_properties", "alpha_ionizing_penetrating",
                "alpha_stopped_by", "beta_particle_properties",
                "beta_ionizing_penetrating", "beta_stopped_by",
                "gamma_ray_properties", "gamma_ionizing_penetrating",
                "gamma_reduced_by", "comparing_radiation_types",
                "detecting_radiation_gm_tube", "background_radiation_sources",
                # Half-Life
                "half_life_definition", "half_life_calculations",
                "half_life_graphs", "radioactive_decay_curves",
                # Uses of Radioisotopes
                "medical_tracers", "radiotherapy_cancer_treatment",
                "carbon_14_dating", "industrial_applications",
                "smoke_detectors", "sterilization_applications",
                # Nuclear Fission and Fusion
                "nuclear_fission_splitting", "chain_reaction_concept",
                "nuclear_reactor_components", "nuclear_fusion_joining",
                "fusion_in_sun_stars", "fusion_advantages_challenges",
                # Safety
                "radiation_hazards", "safety_precautions_handling",
                "distance_shielding_time", "radiation_warning_symbol"
            ]
        }
    
    def get_physics_topic_guidelines(self, topic: str) -> Dict:
        """Get comprehensive guidelines for a specific physics topic"""
        if not hasattr(self, 'physics_topic_details'):
            self.initialize_physics_support()
        
        return self.physics_topic_details.get(topic, {
            "objectives": [f"Understand basic concepts of {topic}"],
            "key_concepts": [topic],
            "misconceptions": []
        })
    
    def get_topic_information(self, subject: str, topic: str) -> Dict:
        """Get comprehensive topic information for any subject"""
        if subject == "Biology":
            return self.biology_topic_details.get(topic, {})
        elif subject == "Chemistry":
            if not hasattr(self, 'chemistry_topic_details'):
                self.initialize_chemistry_support()
            return self.chemistry_topic_details.get(topic, {})
        elif subject == "Physics":
            if not hasattr(self, 'physics_topic_details'):
                self.initialize_physics_support()
            return self.physics_topic_details.get(topic, {})
        else:
            return {}

# Global instance
combined_science_generator = CombinedScienceGenerator()
