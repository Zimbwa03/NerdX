# NerdX School Package — Project Proposal

**Purpose:** Structured proposal for school partnerships (levy / additional fee integration)  
**Audience:** School administrators, finance, and Ministry-aligned decision-makers  
**Margin target:** 45–60% (company profitable after all costs)

---

## 1. Executive summary

NerdX offers **one school package** for all schools. Every student on the package gets **full access**: all O-Level and A-Level content, AI Teacher, Project Assistant (basic + advanced), comprehension, essays, image solve, voice, study tools, and use of the **WhatsApp bot** and **NerdX mobile application**. There are no tiers — one package, one price, same access for every school.

- **One package for all schools:** full access to everything that matters for the student.
- **Two billing options:** **Per term** (Zimbabwe 3-term calendar) or **per month**.
- **Fixed pricing:** **$30 per student per term** or **$10 per student per month**. Same price for every school; simple to quote and invoice.
- **Daily credits:** each student receives **250 credits per day**. Credits are allocated daily; if a student uses them all, they get a fresh 250 the next day. Unused daily credits do not roll over.
- **Costs covered in this model:** Twilio (WhatsApp), DeepSeek (text AI), Gemini (images), Supabase (database/auth), PayNow (payments), and a platform buffer. See Section 2 and Section 9 for cost and margin notes at 250 credits/day.

---

## 1.1 Quick reference — one-pager for school visits

**Print or share this page when visiting schools.**

**Fixed pricing — one price per student**

| Billing | Price per student | Credits per student per day |
|---------|-------------------|-----------------------------|
| **Per term** | **$30** | **250** per day |
| **Per month** | **$10** | **250** per day |

**Credits per day**  
- Each student gets **250 credits per day**.  
- Credits are **refreshed daily**; unused credits do not roll to the next day.  
- If a student uses all 250 in a day, they get a fresh 250 the next day.  
- Full access: O-Level, A-Level, AI Teacher, Project Assistant, image, voice, etc. — same features; students spend their daily allowance as they choose.

**One package — full access for every student:**  
O-Level (Math, Combined Science, English), A-Level (all subjects), AI Teacher, Project Assistant (basic + advanced), study tools, image solve & OCR, voice/audio. **Access:** WhatsApp bot + **NerdX mobile application** (same account, same daily credits).

**How schools add it:**  
"Add **$30 per student per term** (or **$10 per student per month**) as the **NerdX levy**. We invoice the school for (number of students × price). Every student gets **250 credits per day** and full NerdX access on WhatsApp and the mobile app."

**Zimbabwe calendar:** 3 terms/year; schools choose **per term** or **per month**.

---

## 2. Full cost model (what NerdX pays)

All figures in **USD**. Used to derive minimum per-student prices and to confirm 45–60% margin.

### 2.1 Per-credit usage costs (when a student uses a credit)

| Cost item | Source | Rate | Notes |
|-----------|--------|------|--------|
| **Twilio (WhatsApp)** | Config / docs | $0.005 per message | Every outbound message |
| **DeepSeek (text AI)** | Primary for Q&A, teacher, essays | ~$0.002 per 1k tokens | ~500–1k tokens per "1 credit" AI use |
| **Gemini** | Image solve, generation | Usage-based | Heavier features (e.g. image_solve) ≈ $0.007+ per use |
| **Blended per credit (usage)** | Option B / REVISED_PROFIT_MARGIN_ANALYSIS | **~$0.007** | 10% commands, 60% AI, 30% complex |

**Reference:** Your current **Option B** logic:
- Commands: 1 credit = 2 commands → cost **$0.010** per credit (Twilio only).
- AI content: 1 credit per use → **$0.007** per credit (Twilio + DeepSeek).
- Complex (essays, comprehension, A-Level, image): 2 credits → **$0.006** per credit.

### 2.2 Platform & payment overhead (allocated per credit)

| Item | Approx. impact | Notes |
|------|----------------|--------|
| **Supabase** | ~$0.0005–0.001 per credit | Pro ~$25/mo + usage; allocated by active students/credits |
| **PayNow (EcoCash)** | 2.5% of revenue | EcoCash merchant fee; add 2.5% on school revenue when paid via PayNow |
| **Render / hosting** | Included in "platform" | Backend; part of fixed cost allocation above |
| **Support & admin** | Small buffer | Account and school onboarding |

**Total cost per credit delivered (conservative):**  
**$0.008** per credit  
(= $0.007 usage + ~$0.001 platform/payment buffer)

This **$0.008** is used below for all margin and pricing calculations. PayNow 2.5% is absorbed in the margin target rather than added again on top.

### 2.3 Margin target and minimum price per credit

- **Target margin:** 45–60%.
- **Cost per credit:** $0.008.
- **Required revenue per credit:**
  - 45% margin → revenue per credit ≥ $0.008 / (1 − 0.45) ≈ **$0.0145**
  - 60% margin → revenue per credit ≥ $0.008 / (1 − 0.60) = **$0.02**

**School pricing range:** **$0.015–0.02 per credit**  
We use **$0.015** per credit as the *standard* school rate so that:
- Margin stays **≥ 47%** (($0.015 − $0.008) / $0.015 ≈ 47%).
- Prices remain acceptable for schools with lower fees (~$50–200/term).

### 2.4 School package: fixed pricing and cost at 250 credits/day

**Chosen pricing:** **$30 per student per term** | **$10 per student per month**. **Daily credits:** **250 per student per day** (refreshed daily; no rollover).

**Cost check at 250 credits/day:** At **$0.008 per credit**, cost depends on utilisation. If **~25% use** (62.5 credits/day → 3,750/term): cost ≈ **$30/term** → break-even. If **~70% use** (10,500/term): cost ≈ **$84/term** → margin negative at $30/term. Margin is positive only if average daily use stays well below 250. See Section 9.

**Rough check (cost per student per term):**  
With **20 credits per day** and ~60 active days per term, expect ~**1,200 credits used per term** (assuming ~70% daily use). Cost ≈ 1,200 × $0.008 = **$9.60** per student per term. For ~50% margin, revenue needs to be ≥ **$19** per student per term when we’re at the minimum. The **$15 minimum** is slightly below that; it keeps low-fee schools in reach while we rely on the mix of schools (many at higher fees) and on the fact that actual use is often below 70%. If needed, the minimum can be set to **$18–20** for strict 45–60% margin at the bottom.

**Percentage table (illustrative):**

| Term fees (F) | 10% levy | Applied (min $15/term) | As % of fees |
|---------------|----------|------------------------|---------------|
| $50           | $5       | **$15** (minimum)      | 30%           |
| $100          | $10      | **$15** (minimum)      | 15%           |
| $150          | $15      | $15                     | 10%           |
| $200          | $20      | $20                     | 10%           |
| $300          | $30      | $30                     | 10%           |
| $500          | $50      | $50                     | 10%           |
| $1,000        | $100     | $100                    | 10%           |

Same idea for **monthly**: 10% of monthly fees, minimum **$6** per student per month (so margin stays in the 45–60% band when fees are low).

---

## 3. Zimbabwe school calendar (for "per term" packages)

- **3 terms per year.**  
- Typical length ~**12 weeks (≈ 3 months)** per term.  
- "Per term" = one upfront payment per student for that term's credit allowance and access.

This proposal uses **per-term** and **per-month** options so schools can match either:
- Term-based fee collection (e.g. "add $Y per student per term"), or  
- Monthly billing (e.g. "add $Z per student per month").

---

## 4. One school package — full access for all

There is **one package for all schools**. No BASIC/STANDARD/PREMIUM tiers. Every student on the package gets the same full access: all O-Level and A-Level content, all bots (WhatsApp), and the NerdX mobile application. The only choice for the school is **per term** or **per month** billing.

### 4.1 Daily credits (not a term/month pool)

Credits are **given per day**, not as one pool for the whole term or month.

- **250 credits per student per day.**  
- Each day the student receives a fresh **250 credits**.  
- If the student uses all 250 in a day, they get a new 250 the **next day**; they do not get more the same day.  
- **Unused daily credits do not roll over** to the next day; tomorrow’s allowance is always 250, regardless of how many were used today.

So over a term (~60–90 days), a student can use up to **250 × number of days** credits in total (e.g. 250 × 60 = 15,000 over ~60 active days). Over a month, up to **250 × ~30 = 7,500** credits per student. The **daily** cap keeps usage predictable and easy to explain: “each student gets 250 credits per day.”

### 4.2 Fixed pricing

| Billing     | Price per student | Credits per student per day |
|-------------|-------------------|-----------------------------|
| **Per term**  | **$30**           | **250** per day             |
| **Per month** | **$10**           | **250** per day             |

Same price for every school; simple to quote and invoice. Cost per credit (Twilio, DeepSeek, Gemini, Supabase, PayNow, platform): **$0.008**. See Section 2.4 and Section 9 for cost and margin notes at 250 credits/day.

### 4.3 What's included (full access)

**O-Level**
- **Mathematics:** Topical, exam, quiz, graph practice (1 credit per use).
- **Combined Science:** Topical, exam, MCQ, structured (1 credit each).
- **English:** Topical, comprehension, essay writing, essay marking, comprehension/summary grading (1 or 2 credits per use).

**A-Level**
- **All subjects:** Pure Math, Chemistry, Physics, Biology — topical, MCQ, structured, exam, essay where applicable (2 credits per use). No cap.

**AI & tools**
- **AI Teacher:** Start + follow-up (1 credit each), PDF export (2 credits).
- **Project Assistant:** Basic (start + follow-up, 1 credit each) and **advanced** (web search, deep research, transcribe, image gen, batch — 2 credits each).
- **Study tools:** Flashcard (single + audio), Virtual Lab knowledge check.
- **Image solve & OCR:** 2 credits per use.
- **Voice/audio:** Audio feature, voice chat — 2 credits per use.

**Commands:** 1 credit = 2 commands (same as current system).

**Access**
- **WhatsApp bot** and **NerdX mobile application** — same account, same daily credits. Students use the channel they prefer.

### 4.4 Limits (daily allowance, no rollover)

- **No per-feature caps.** The only limit is the **daily allowance**: **250 credits per student per day**. Students spend those 250 on whatever they use (questions, teacher, essays, image solve, voice, etc.).
- **Daily refresh, no rollover:** Unused credits do not carry to the next day; each day the student gets a fresh 250. If they use all 250 in a day, they get more the next day.
- **Not unlimited:** the daily cap keeps cost predictable for NerdX and usage clear for schools. 250 credits per day supports heavy use (many questions, AI Teacher, essays, image solve, voice) across a full school day.

### 4.5 Typical use

- **Per day:** Up to 250 credits — e.g. many topical/exam questions + AI Teacher or Project Assistant + essays, image solve, voice, etc. as needed.
- **Per term:** ~60 active days → up to 15,000 credits per student over the term. Fits full classroom and exam prep.
- **Per month:** ~30 days → up to 7,500 credits per student per month.

---

## 5. Summary: one package — fixed pricing + daily credits

| Billing     | Price per student | Credits per student per day |
|-------------|-------------------|-----------------------------|
| **Per term**  | **$30**           | **250** per day             |
| **Per month** | **$10**           | **250** per day             |

Credits are **refreshed daily**; unused credits do not roll over. See Section 2.4 and Section 9 for cost and margin notes at 250 credits/day.

---

## 6. How schools integrate: fixed levy

Schools add NerdX as a **fixed per-student levy** — one price, same for every school.

- **Levy:** "NerdX levy = **$30 per student per term** (or **$10 per student per month**). Each student gets **250 credits per day** and full access on WhatsApp and the mobile app."
- **Optional add-on:** "For students who opt in, NerdX is $30/term or $10/month per student, 250 credits per day."

**Invoicing:** School pays **(number of students × $30)** per term, or **(number of students × $10)** per month. No percentage, no minimum — one number.

Because the levy is **tied to each school’s own fees**, it scales with fee level: low-fee schools pay a smaller absolute amount, high-fee schools pay more, and the **percentage** stays the same.

**Example (per term):**

| Term fees (F) | 10% levy | Applied (min $15/term) | NerdX levy per student |
|---------------|----------|------------------------|--------------------------|
| $50           | $5       | minimum applies        | **$15**                  |
| $100          | $10      | minimum applies        | **$15**                  |
| $150          | $15      | 10%                    | **$15**                  |
| $200          | $20      | 10%                    | **$20**                  |
| $300          | $30      | 10%                    | **$30**                  |
| $500          | $50      | 10%                    | **$50**                  |
| $1,000        | $100     | 10%                    | **$100**                 |

**Suggested wording for proposals:**
- "Add **$30 per student per term** (or **$10 per student per month**) as the **NerdX levy**. We invoice the school for (number of students × price). Every student gets **250 credits per day** and full access to O-Level, A-Level, AI Teacher, Project Assistant, and the WhatsApp bot + mobile app."
- "The school pays NerdX once per term (or monthly) for the number of students enrolled; NerdX then activates those accounts with **250 credits per day** per student."

---

## 7. Minimum enrolment and sustainability

To cover fixed costs (Supabase, support, backend), we recommend:

- **Minimum enrolment per school:** e.g. **20 students** on the package (term or month).  
- **Or:** A small **school onboarding fee** (e.g. one-off or per-term administration fee) for schools below that size, so NerdX still covers setup and support.

Exact minimum can be tuned from your actual Supabase + support costs.

---

## 8. What you need to implement (short)

1. **Product/config**
   - One "school" product type: **per term** or **per month** billing.
   - **Daily credit allowance:** **250 credits per student per day**, refreshed each day; **no rollover** of unused credits.
   - **Fixed pricing:** **$30 per student per term** or **$10 per student per month**.
   - Same feature set as individual full access (O-Level, A-Level, AI Teacher, Project Assistant, image, voice, etc.); no per-feature caps beyond the daily 250.

2. **Billing**
   - Invoicing: **(number of students × $30)** per term or **(number of students × $10)** per month. School or NerdX can compute from the school’s stated fee per student.
   - Optional: PayNow aggregation (school pays once per term/month for all students).

3. **Admin**
   - School admin view: list of students, billing option (term/month), period, and (if useful) daily credits used.
   - No tiers — one package; daily credits (250/day) and fixed price ($30/term, $10/month) are the only parameters.

4. **Proposal docs**
   - One-pager: **one package**, **full access**, **$30/term or $10/month**, **250 credits per day**, **how to add as levy**.
   - Full document: this proposal + school calendar + your contact and onboarding steps.

---

## 9. Appendix — Calculation checks

**Cost assumption:** $0.008 per credit.

**Daily credits:** 250 credits per student per day. Cost depends on utilisation.

**Per term (~60 active days):**  
- If **~25% use** (62.5 credits/day → 3,750 credits/term): cost ≈ 3,750 × $0.008 = **$30** → break-even at $30/term.  
- If **~70% use** (175 credits/day → 10,500 credits/term): cost ≈ **$84** → margin negative at $30/term.

**Per month (~30 days):**  
- If **~25% use** (62.5 credits/day → 1,875 credits/month): cost ≈ **$15** → margin negative at $10/month.  
- If **~12% use** (30 credits/day → 900 credits/month): cost ≈ **$7.20** → profit $2.80 → **≈ 28%** margin at $10/month.

**Sustainability note:** At **250 credits/day**, margin is positive only when average daily use is well below 250 (e.g. under ~25% of the allowance). Monitor real utilisation; if most students use a large share of 250/day, consider raising price or reducing credits/day to keep margins in the 45–60% band.

---

**End of proposal.**  
For school visits, use **Section 1.1** and **Section 4** as the package summary (fixed $30/$10 + 250 credits/day), **Section 6** for "how to add as levy," and **Section 2** only if asked how NerdX remains sustainable and pays for Supabase, Twilio, DeepSeek, Gemini, and PayNow.
