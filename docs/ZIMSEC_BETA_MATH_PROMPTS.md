# ZIMSEC Beta Math Prompts

Template-based, expanded prompts for NerdX O-Level Mathematics question generation. When `USE_ZIMSEC_BETA_MATH_PROMPTS` is enabled, the math question generator uses these prompts instead of the default `math_prompts_master` set.

## Source material

- **Topics 10–13 (Trigonometry, Vectors, Matrices, Transformation):** Full templates, learning objectives, exam types, and question patterns from `ZIMSEC-Topics-10-13-Complete.md`.
- **Topics 1–9 (Real Numbers, Sets, Financial Mathematics, Measures and Mensuration, Graphs, Variation, Algebra, Geometry, Statistics):** Subtopics, exam types, and key formulas from `MASTER-INDEX-All-Topics.md` and `ZIMSEC-O-Level-Math-Complete-Guide.md` only. **No full question templates** for 1–9 (those live in `ZIMSEC_Complete_All_13_Topics.md`, which was not provided). Example styles are short generic patterns derived from the index.
- **Probability:** NerdX treats it as a separate topic. Beta prompts use NerdX learning objectives plus index/guide guidance (e.g. experimental vs theoretical, sample space, two-way tables).

## Module layout

| Module | Topics | Source |
|--------|--------|--------|
| `math_trig_prompts_zimsec_beta` | Trigonometry | ZIMSEC Topics 10–13 |
| `math_vectors_prompts_zimsec_beta` | Vectors | ZIMSEC Topics 10–13 |
| `math_matrices_prompts_zimsec_beta` | Matrices | ZIMSEC Topics 10–13 |
| `math_transformation_prompts_zimsec_beta` | Transformation | ZIMSEC Topics 10–13 |
| `math_probability_prompts_zimsec_beta` | Probability | NerdX + index/guide |
| `math_topics_1_9_beta_overlays` | Real Numbers, Sets, Financial Mathematics, Measures and Mensuration, Graphs, Variation, Algebra, Geometry, Statistics | MASTER-INDEX + Complete Guide |
| `math_prompts_zimsec_beta_master` | Aggregator for all 14 topics | Imports above modules |

## Enabling beta prompts

Set the environment variable:

```bash
USE_ZIMSEC_BETA_MATH_PROMPTS=true
```

Or `1` or `yes` (case-insensitive). The math question generator checks this at import time and loads either the beta master or the default `math_prompts_master`. The rest of the generator (including `_create_question_prompt` and JSON schema) is unchanged; beta modules supply richer `prompt` strings only.

## Contract

- Each topic exposes a list of `{subtopic, prompts: {easy, medium, difficult}}`.
- Each prompt is `{id, subtopic, prompt, learning_objective}`. The `prompt` string is injected as **Specific Instructions** inside the “Dr. Muzenda” system block.
- JSON schema (question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes) is appended by the generator; beta prompts do not repeat it.

## Upgrading Topics 1–9

When `ZIMSEC_Complete_All_13_Topics.md` (or equivalent) with full question templates for Topics 1–9 becomes available, the overlay prompts in `math_topics_1_9_beta_overlays` can be upgraded to the same rich, template-based style used for Topics 10–13, and example question styles can be replaced with concrete templates from that file.
