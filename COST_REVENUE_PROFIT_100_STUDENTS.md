# Cost, Revenue & Profit for 100 Students

Based on your **current credit system** (Option B in `config.py`):
- **Commands:** 1 credit = 2 commands (bundled)
- **AI content:** 1 credit per use (questions, teacher mode, etc.)
- **Complex features:** 2 credits per use (essays, comprehension, A-Level, image solve, etc.)

---

## Your operational cost per credit

| Tier | Your cost per credit | Notes |
|------|----------------------|--------|
| Commands (1 credit = 2 uses) | $0.010 | Twilio $0.005 × 2 messages |
| AI-generated (1 credit per use) | $0.007 | Twilio $0.005 + AI ~$0.002 |
| Complex (2 credits per use) | $0.006 | $0.012 per 2 credits |
| **Blended average** | **~$0.007** | Assumes 10% commands, 60% AI, 30% complex |

---

## Credit packages (from `payment_service.py`)

| Package | Price | Credits | Student pays per credit |
|---------|-------|---------|--------------------------|
| LITE STARTER | $2.00 | 150 | $0.0133 |
| STARTER | $5.00 | 400 | $0.0125 |
| STANDARD | $10.00 | 850 | $0.0118 |
| PRO | $18.00 | 1,600 | $0.01125 |
| PREMIUM | $25.00 | 2,250 | $0.0111 |

---

## Assumptions for “100 students”

- Each of the 100 students buys **one package per month**.
- **70% of credits are used**; 30% expire (your docs use this).
- Your cost is **$0.007 per credit consumed** (Option B blended average).

---

## Cost, revenue & profit for 100 students (by package)

### If all 100 students buy the same package each month

| Package | Revenue (100 students) | Your cost | Profit | Profit margin |
|---------|------------------------|-----------|--------|----------------|
| LITE STARTER | **$200.00** | $73.50 | **$126.50** | 63.3% |
| STARTER | **$500.00** | $196.00 | **$304.00** | 60.8% |
| STANDARD | **$1,000.00** | $416.50 | **$583.50** | 58.4% |
| PRO | **$1,800.00** | $784.00 | **$1,016.00** | 56.4% |
| PREMIUM | **$2,500.00** | $1,102.50 | **$1,397.50** | 55.9% |

### Per-student (monthly)

| Package | Revenue/student | Cost/student | Profit/student |
|---------|------------------|--------------|----------------|
| LITE STARTER | $2.00 | $0.735 | $1.265 |
| STARTER | $5.00 | $1.96 | $3.04 |
| STANDARD | $10.00 | $4.165 | $5.835 |
| PRO | $18.00 | $7.84 | $10.16 |
| PREMIUM | $25.00 | $11.025 | $13.975 |

---

## How the numbers are calculated

**Revenue (100 students)**  
= 100 × package price  

**Credits used per student**  
= credits in package × 70%  

**Your cost (100 students)**  
= 100 × (credits used per student × $0.007)  

**Profit**  
= Revenue − Cost  

**Example – 100 on PREMIUM:**  
- Revenue: 100 × $25 = **$2,500**  
- Credits used per student: 2,250 × 0.70 = 1,575  
- Your cost: 100 × (1,575 × $0.007) = 100 × $11.025 = **$1,102.50**  
- Profit: $2,500 − $1,102.50 = **$1,397.50**  

---

## Mixed scenario: 100 students across packages

If you assume a **typical mix** of packages (example below), total revenue, cost, and profit change accordingly.

**Example mix:**

| Package | Students | Revenue | Cost | Profit |
|---------|----------|---------|------|--------|
| LITE | 20 | $40 | $14.70 | $25.30 |
| STARTER | 25 | $125 | $49.00 | $76.00 |
| STANDARD | 30 | $300 | $124.95 | $175.05 |
| PRO | 15 | $270 | $117.60 | $152.40 |
| PREMIUM | 10 | $250 | $110.25 | $139.75 |
| **Total** | **100** | **$985** | **$416.50** | **$568.50** |

In this example, **100 students** → **$985 revenue**, **$416.50 cost**, **$568.50 profit** (~57.7% margin).

---

## Summary

- **Cost** = what you pay (Twilio + AI) for the credits students actually use (~$0.007 per credit, 70% utilization).
- **Revenue** = what students pay (package price × number of students).
- **Profit** = Revenue − Cost.

For **100 students**, if **everyone is on PREMIUM**: **$2,500 revenue**, **$1,102.50 cost**, **$1,397.50 profit**.  
If you use the mixed example above: **$985 revenue**, **$416.50 cost**, **$568.50 profit**.

To adapt this to your real “100 students” case, plug in your actual distribution of packages (e.g. from `payment_service` or analytics).
