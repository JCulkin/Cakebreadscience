# Worksheets Expansion Plan

This plan covers how we will expand worksheets to provide slow, in-depth coverage of the specification with consistent formatting, beautiful math, and easy-to-use mark schemes.

## Goals
- Create many more worksheets: about 50 per subject, flexible as needed to cover the spec.
- Cover the specification slowly and in depth, with gentle progression.
- Ensure every worksheet has:
  - Beautiful math rendering (MathJax)
  - Answer boxes sized to the task
  - A clear, complete mark scheme

## Guiding Principles
- Scope control: each worksheet targets a small, explicit spec slice.
- Gradual progression: recall -> simple application -> short interpretation.
- Consistent formatting: sections, question numbering, and answer box sizes.
- Mathematics should be readable and rendered, never raw symbols.
- Mark schemes should be concise, aligned to question numbering, and easy to scan.

## Math Rendering Standard
- Use MathJax for all worksheets.
- Inline math uses $...$ with proper TeX (e.g., $v = d/t$, $m/s^2$).
- No raw caret or dollar signs should appear to users after render.
- The MathJax loader should be included in every worksheet or injected globally if we add a shared template later.

## Worksheet Structure Standard
1. Header (title, subtitle, spec range)
2. Definition box (1-3 short key ideas)
3. Sections A/B/C... with 4-10 questions each
4. Total marks
5. Mark scheme with short, unambiguous answers

## Answer Box Sizing Rules
- 1 line (fact/definition): use standard answer-space
- 2-3 lines (short explanation): use large
- Calculations: use standard unless multiple steps are required
- Diagram/drawing: use large or custom diagram area

## Scope and Volume Targets
We will aim for about 50 worksheets per subject, flexing up or down to ensure full spec coverage and sensible pacing. That means:
- Physics: about 50
- Chemistry: about 50
- Biology: about 50
Total target: about 150 (plus cross-curricular if needed)

## Coverage Strategy
We will build a layered bank per subject:
- Layer 1: Fundamentals (definitions, units, simple recall)
- Layer 2: Straightforward calculations
- Layer 3: Simple data interpretation
- Layer 4: Mini practicals and method questions
- Layer 5: Mixed-review mini checks

Each spec point will appear across multiple layers to slow the pace and deepen mastery.

## Naming Convention
- Subject folder: worksheets/physics, worksheets/chemistry, worksheets/biology
- Filename: topic.subtopic_short_title_level.html
- Example: 1.1_speed_graphs_basics.html

## Index and Navigation
- Update worksheets/index.html to group by subject -> topic -> level
- Each worksheet should list the spec numbers it targets
- Add a visual level tag in the title or subtitle

## Quality Checklist (Per Worksheet)
- Spec slice stated clearly
- Questions strictly within spec
- Math rendered correctly
- Answer box size appropriate
- Mark scheme complete and aligned
- No spelling or unit errors

## Implementation Plan

### Phase 1: Foundations and Templates
1. Create a worksheet template file with MathJax included.
2. Create a mark scheme template section.
3. Add a simple checklist to use for each worksheet.

### Phase 2: Physics Rollout (Pilot)
1. For physics, map spec points into small, explicit slices until coverage is complete.
2. Generate worksheets in batches of 10.
3. After each batch, review formatting and difficulty.

### Phase 3: Chemistry Rollout
1. Apply the same approach to chemistry.
2. Maintain consistent style and math formatting.

### Phase 4: Biology Rollout
1. Apply the same approach to biology.
2. Maintain consistent style and math formatting.

### Phase 5: Index and QA
1. Update worksheets/index.html in sync with new files.
2. Run a final spec coverage check.
3. Spot-check sample worksheets for math rendering and box sizes.

## First Deliverables (Next Steps)
- Create template worksheet file with MathJax, sections, and mark scheme.
- Produce a physics spec slice map with coverage targets.
- Generate the first batch of 10 physics worksheets.

## Biology Gap Plan (Current)
The remaining Biology coverage focuses on coordination/response, practicals, and a few inheritance details. Planned worksheet slices:
- 2.86-2.89 Nervous system, impulses, and synapses
- 2.90 Reflex arc structure and function
- 2.91-2.92 Eye structure, accommodation, and light response
- 2.93 Temperature regulation by skin
- 2.94 Hormones overview (adrenaline, insulin, testosterone, progesterone, oestrogen)
- 2.67 Coronary heart disease risk factors
- 2.18-2.22 Photosynthesis practicals (starch test; light/CO2/chlorophyll requirements)
- 2.34-2.38 Respiration practical (CO2/heat from respiring seeds)
- 3.3-3.4 Pollination and fertilisation in flowering plants
- 3.5 Seed germination practical
- 3.7 Asexual reproduction methods (natural and artificial)
- 3.22 Polygenic inheritance and variation
- 3.24 Pedigree diagrams
- 3.26-3.27 Sex determination using genetic diagrams

## Open Decisions
- Whether to introduce a shared template system later (to reduce repetition).
- How to visually label difficulty levels in the index.
