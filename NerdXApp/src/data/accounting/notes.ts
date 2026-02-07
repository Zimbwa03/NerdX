// ZIMSEC O-Level Principles of Accounting 7112 – Notes
// 15 topics aligned with syllabus – all notes expanded and detailed
import { TopicNotes } from '../scienceNotes/types';

export const accountingNotes: Record<string, TopicNotes> = {
  'Introduction to Principles of Accounting': {
    topic: 'Introduction to Principles of Accounting',
    subject: 'Principles of Accounting',
    summary: 'Accounting is the systematic recording, analysing, and reporting of financial transactions. It provides information to owners, managers, creditors, and other stakeholders to make informed decisions. This topic covers the purpose of accounting, users of financial information, and fundamental accounting concepts.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Accounting_Is_A_Language_Not_Math.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvQWNjb3VudGluZ19Jc19BX0xhbmd1YWdlX05vdF9NYXRoLm00YSIsImlhdCI6MTc3MDI3MTA2OCwiZXhwIjo1MjcwNzY3MDY4fQ.Of2sQ8N-BbO3u3FMWP-dVL0_KaA7N4F8dzQ2CZ1p68M',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Accounting__Chaos_to_Clarity.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9BY2NvdW50aW5nX19DaGFvc190b19DbGFyaXR5Lm1wNCIsImlhdCI6MTc3MDI3MTUwMiwiZXhwIjo1MjcwNzY3NTAyfQ.9-_dK8HMdS9srHGxtHDCY-EIKX-kfttOkXNT-PtzsxA',
    sections: [
      {
        title: 'Purpose of Accounting',
        content: `**Definition of accounting**  
Accounting is the **process of identifying, measuring, recording, and communicating** financial information about an entity in a useful form. It allows businesses to:
- **Record** all transactions (sales, purchases, expenses, receipts, payments).
- **Summarise** data into financial statements (income statement, statement of financial position).
- **Report** results to owners, lenders, tax authorities, and other users.
- **Support decision-making** (e.g. whether to expand, lend, or invest).

**Why accounting matters**  
Without proper records, a business cannot know if it is making a profit, how much it owes or is owed, or what its assets are worth. Accounting provides a **true and fair view** of financial performance and position, which is required by law for companies and useful for all organisations.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Users of Financial Information',
        content: `**Internal users**  
- **Owners** – to see profit, growth, and whether the business is worth keeping or selling.  
- **Managers** – to plan, control costs, set budgets, and make day-to-day decisions (e.g. pricing, staffing).  
- **Employees** – to assess job security and negotiate wages (where information is shared).

**External users**  
- **Investors** – to decide whether to buy, hold, or sell shares; to assess risk and return.  
- **Lenders (banks, creditors)** – to decide whether to lend and on what terms; to monitor ability to repay.  
- **Suppliers** – to assess creditworthiness before giving trade credit.  
- **Tax authorities** – to calculate and verify tax (e.g. income tax, VAT).  
- **Government and regulators** – for statistics, regulation, and policy.  
- **Public** – e.g. local communities interested in employment and environmental impact.

Different users need different information: lenders focus on **liquidity** and **gearing**; investors on **profitability** and **growth**; tax authorities on **revenue** and **expenses**.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Accounting Concepts',
        content: `**Going concern** – The business is assumed to continue operating for the foreseeable future (e.g. 12 months). Assets are valued on that basis; if the business were closing, asset values might be different (e.g. forced sale).

**Accruals (matching)** – Income and expenses are **recognised when earned or incurred**, not when cash is received or paid. So sales on credit are recorded when the sale is made; expenses (e.g. wages, rent) are recorded when they are owed, even if paid later.

**Consistency** – The same accounting policies (e.g. depreciation method, valuation basis) should be used from one period to the next so that financial statements can be compared fairly. Changes must be disclosed.

**Prudence (conservatism)** – Don’t overstate profits or assets; anticipate losses (e.g. doubtful debts, obsolescence). Don’t record profits until they are realised; provide for known risks.

**Business entity** – The business is treated as **separate from the owner(s)**. Personal transactions of the owner are not mixed with business transactions. Only business assets, liabilities, income, and expenses appear in the business accounts.

**Money measurement** – Only items that can be **expressed in money** are recorded. Important factors such as staff morale or reputation are not in the accounts unless they result in a measurable transaction.

**Historical cost** – Assets are usually recorded at **cost** when acquired. This is objective and verifiable, but may not reflect current market value.

**Materiality** – Items that could influence users’ decisions should be disclosed separately; trivial items can be grouped or omitted.

**Dual aspect** – Every transaction has **two effects** (double entry): for every debit there is an equal credit. Assets = Capital + Liabilities.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Accounting identifies, measures, records, and communicates financial information.',
      'Users include owners, managers, lenders, investors, tax authorities, and suppliers.',
      'Going concern, accruals, consistency, prudence, and business entity are key concepts.',
      'Dual aspect means every transaction has two equal effects (debit and credit).',
    ],
    exam_tips: [
      'State the purpose of accounting and list internal and external users with their needs.',
      'Explain going concern, accruals, prudence, and business entity with examples.',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Define "Accounting" and explain why it is called the language of business.',
        answer: 'Accounting is the process of recording, summarising, analysing, and interpreting financial information. It is called the language of business because it communicates the financial health and performance of an entity to stakeholders for decision-making.'
      },
      {
        id: 'q2',
        question: 'List three internal users and three external users of financial information.',
        answer: 'Internal: Owners, Managers, Employees. External: Lenders (Banks), Suppliers, Government (Tax Authorities), Investors, Customers.'
      },
      {
        id: 'q3',
        question: 'Explain the "Business Entity" concept with an example.',
        answer: 'The business is treated as separate from its owner. Personal transactions of the owner are not mixed with business transactions. Example: If the owner takes cash for personal use, it is Drawings, not a business expense.'
      },
      {
        id: 'q4',
        question: 'If Assets = $50,000 and Liabilities = $15,000, calculate the Capital.',
        answer: 'Capital = Assets - Liabilities. Capital = $50,000 - $15,000 = $35,000.'
      },
      {
        id: 'q5',
        question: 'Which accounting concept requires that revenue and expenses are recorded when they occur, not just when cash changes hands?',
        answer: 'The Accruals (Matching) Concept.'
      }
    ],
  },

  'Types of Business Organizations': {
    topic: 'Types of Business Organizations',
    subject: 'Principles of Accounting',
    summary: 'Different forms of business ownership exist to suit different needs. The three main types are Sole Traders, Partnerships, and Limited Companies. Each has distinct legal characteristics, liability structures, and accounting treatments.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Sole_Traders_Partnerships_and_Limited_Liability.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvU29sZV9UcmFkZXJzX1BhcnRuZXJzaGlwc19hbmRfTGltaXRlZF9MaWFiaWxpdHkubTRhIiwiaWF0IjoxNzcwMjcxMTgwLCJleHAiOjUyNzA3NjcxODB9.H4iHQSDV9ADbkeU-J2ib-558TkzrYRVrdFX0iali1D8',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Principles_of_Accounting%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9QcmluY2lwbGVzX29mX0FjY291bnRpbmcgKDEpLm1wNCIsImlhdCI6MTc3MDI3MTY0MywiZXhwIjo1MjcwNzY3NjQzfQ.QtAVygMr2I4WFosVAV1V_m-ksJ1WvqTx_uFunnghFIE',
    sections: [
      {
        title: 'Sole Trader',
        content: `**Definition**  
A business owned and operated by one person. It is the simplest form of business organization.

**Characteristics**
*   **Ownership**: One person.
*   **Liability**: Unlimited (Owner is personally liable for debts).
*   **Capital**: Provided by the owner.
*   **Profit**: All profit belongs to the owner.
*   **Decisions**: Owner makes all decisions.

**Accounting Treatment**
*   **Capital Account**: Records the owner's investment.
*   **Drawings**: Items taken by the owner for personal use.
*   **Financial Statements**: Income Statement and Statement of Financial Position are straightforward.
*   **Pros**: Easy to set up, full control, privacy.
*   **Cons**: Unlimited liability, limited capital, lack of continuity (if owner dies).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Partnership',
        content: `**Definition**  
A business formed by two or more people (usually 2-20) with a view to profit. governed by a Partnership Act or a Deed of Partnership.

**Characteristics**
*   **Ownership**: 2 or more partners.
*   **Liability**: Unlimited (Joint and Several Liability).
*   **Agreement**: Deed of Partnership sets out rules (profit sharing ratio, salaries, interest largely).

**Accounting Treatment**
*   **Appropriation Account**: Used to share out the Net Profit.
    *   Add Interest on Drawings.
    *   Less Partner Salaries.
    *   Less Interest on Capital.
    *   Share Balance of Profit.
*   **Current Accounts**: Record day-to-day transactions between partner and firm (Profit share, Drawings, Interest).
*   **Capital Accounts**: Fixed capital contributed.

**Pros**: More capital, shared responsibility and skills.
**Cons**: Unlimited liability, disputes, slower decision making.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Limited Companies',
        content: `**Definition**  
A business that has a separate legal identity from its owners (shareholders).

**Types**
1.  **Private Limited Company (Pvt Ltd / Ltd)**: Shares sold privately to friends/family. Cannot sell to public.
2.  **Public Limited Company (Plc)**: Shares can be sold to the public on the Stock Exchange.

**Characteristics**
*   **Separate Legal Entity**: The company can own property and be sued in its own name.
*   **Limited Liability**: Shareholders are only liable up to the amount unpaid on their shares. They cannot lose personal assets.
*   **Ownership vs Control**: Shareholders own it, Directors run it (divorce of ownership and control).

**Accounting Treatment**
*   **Share Capital**: Ordinary and Preference Shares.
*   **Reserves**: Retained Earnings, Share Premium, Revaluation Reserve.
*   **Dividends**: Part of profit distributed to shareholders.
*   **Tax**: Company pays Corporation Tax.

| Feature | Sole Trader | Partnership | Limited Company |
|---|---|---|---|
| **Liability** | Unlimited | Unlimited | Limited |
| **Capital** | Owner | Partners | Shareholders |
| **Control** | Owner | Partners | Directors |
| **Profit** | To Owner | Shared | Dividends/Retained |`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Sole trader: one owner, unlimited liability, Capital and Drawings accounts.',
      'Partnership: Two or more owners, partnership deed, Appropriation Account required.',
      'Limited company: separate legal entity, limited liability for shareholders, dividends paid from profits.',
    ],
    exam_tips: [
      'Compare liability and capital structure of sole trader, partnership, and company.',
      'Remember that "Drawings" are for Sole Traders/Partnerships, while Companies pay "Dividends".',
      'Explain the concept of "Separate Legal Entity".',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Define "Limited Liability".',
        answer: 'It means the liability of the shareholders is limited to the amount they have invested (or agreed to invest) in the company. Their personal assets cannot be taken to pay business debts.'
      },
      {
        id: 'q2',
        question: 'List two advantages of a Partnership over a Sole Trader.',
        answer: '1. More capital available from multiple partners. 2. Shared workload and diverse skills/expertise.'
      },
      {
        id: 'q3',
        question: 'What is a "Deed of Partnership"?',
        answer: 'A legal document that sets out the rules for the partnership, such as profit-sharing ratios, interest on capital, partner salaries, and procedures for admitting new partners.'
      },
      {
        id: 'q4',
        question: 'Distinguish between a Private Limited Company and a Public Limited Company.',
        answer: 'A Private Limited Company cannot sell shares to the public and restricts share transfers. A Public Limited Company can sell shares to the general public on the stock exchange.'
      },
      {
        id: 'q5',
        question: 'What account is used in Partnership accounting to distribute Net Profit?',
        answer: 'The Appropriation Account.'
      }
    ]
  },

  'Source Documents and Books of Prime Entry': {
    topic: 'Source Documents and Books of Prime Entry',
    subject: 'Principles of Accounting',
    summary: 'Transactions must be recorded systematically. Source documents provide the evidence, and Books of Prime Entry (Journals) are the first place they are recorded before being posted to the Ledger.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Source_Documents_and_the_Chain_of_Custody%20(1).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvU291cmNlX0RvY3VtZW50c19hbmRfdGhlX0NoYWluX29mX0N1c3RvZHkgKDEpLm00YSIsImlhdCI6MTc3MDI3MTE5NiwiZXhwIjo1MjcwNzY3MTk2fQ.mzuXFiGrsT5wWavxbR_quZTUCAA91pmXN_0IY2FMV-s',
    sections: [
      {
        title: 'Source Documents',
        content: `**Purpose**  
Every transaction must be supported by a document (evidence).

| Document | Purpose | Transaction Type |
|---|---|---|
| **Invoice** | Demand for payment for goods/services. | Credit Purchase / Credit Sale |
| **Credit Note** | Reduces the amount owed (e.g. returns). | Returns Inwards / Outwards |
| **Receipt** | Proof of payment received. | Cash Transaction |
| **Cheque Counterfoil** | Record of payment made by cheque. | Bank Payment |
| **Paying-in Slip** | Record of cash/cheques banked. | Bank Deposit |
| **Petty Cash Voucher** | Authorisation for small cash payments. | Petty Cash Expense |
| **Statement of Account** | Summary of transactions for the month. | Reminder (Not a transaction) |`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Books of Prime Entry (Day Books)',
        content: `Transactions are first recorded in these books.

**1. Sales Journal (Sales Day Book)**
*   Records: **Credit Sales** of inventory.
*   Source: Copies of Sales Invoices.

| Date | Customer | Invoice No. | Folio | Amount ($) |
|---|---|---|---|---|
| May 1 | A. Smith | 001 | SL1 | 100 |
| May 4 | B. Jones | 002 | SL2 | 50 |
| **Total** | | | | **150** |
*   **Posting**: Total ($150) -> Cr Sales Account. Individual amounts -> Dr Customer Accounts.

**2. Purchases Journal (Purchases Day Book)**
*   Records: **Credit Purchases** of inventory.
*   Source: Purchase Invoices received.
*   **Posting**: Total -> Dr Purchases Account. Individual amounts -> Cr Supplier Accounts.

**3. Returns Inwards Journal (Sales Returns)**
*   Records: Goods returned by customers.
*   Source: Copies of Credit Notes sent.
*   **Posting**: Total -> Dr Sales Returns Account. Individual amounts -> Cr Customer Accounts.

**4. Returns Outwards Journal (Purchases Returns)**
*   Records: Goods returned to suppliers.
*   Source: Credit Notes received.
*   **Posting**: Total -> Cr Purchases Returns Account. Individual amounts -> Dr Supplier Accounts.

**5. Cash Book**
*   Records: All Cash and Bank receipts and payments.
*   Including Discounts Allowed (expense) and Discounts Received (income).

**6. The General Journal**
*   Records: Anything not in the other books (The "Dustbin" book).
    *   Purchase/Sale of Non-Current Assets on credit.
    *   Correction of errors.
    *   Opening entries.
    *   Bad debts written off.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Trade Discount vs Cash Discount',
        content: `**Trade Discount**
*   Given to traders (bulk buying).
*   Deducted on the Invoice.
*   **Never recorded** in the ledger accounts. Only the net amount is recorded.
*   Example: List price $100, Trade Discount 10%. Invoice = $90. Record $90.

**Cash Discount**
*   Given for **prompt payment** (e.g. pay within 7 days).
*   Recorded in the Cash Book and Ledger.
*   **Discount Allowed**: Expense (Dr) - For customers paying us.
*   **Discount Received**: Income (Cr) - For us paying suppliers.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Source documents verify transactions.',
      'Books of prime entry categorize transactions before posting to the ledger.',
      'Sales/Purchases Journals are for CREDIT transactions of INVENTORY only.',
      'Trade discount is not recorded; Cash discount is recorded.',
    ],
    exam_tips: [
      'Never put cash sales in the Sales Journal (they go to the Cash Book).',
      'Never put the sale of a Van in the Sales Journal (it goes to the General Journal).',
      'Understand the flow: Document -> Day Book -> Ledger -> Trial Balance.',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which source document is sent by a supplier to a customer when goods are returned?',
        answer: 'A Credit Note.'
      },
      {
        id: 'q2',
        question: 'In which book of prime entry are Credit Sales recorded?',
        answer: 'The Sales Journal (or Sales Day Book).'
      },
      {
        id: 'q3',
        question: 'Where would the purchase of a new computer on credit be recorded?',
        answer: 'The General Journal (because it is a Non-Current Asset, not inventory).'
      },
      {
        id: 'q4',
        question: 'Explain the difference between Trade Discount and Cash Discount.',
        answer: 'Trade Discount is for bulk buying and is deduced on the invoice (not recorded). Cash Discount is for prompt payment and is recorded as an expense (Allowed) or income (Received).'
      },
      {
        id: 'q5',
        question: 'What is the purpose of a Petty Cash Voucher?',
        answer: 'To authorize and record small cash payments (e.g., postage, cleaning) from the petty cash fund.'
      }
    ]
  },

  'Ledger and Double Entry': {
    topic: 'Ledger and Double Entry',
    subject: 'Principles of Accounting',
    summary: 'The double-entry system is the basis of modern accounting. It relies on the principle that every transaction involves a giving and a receiving aspect, affecting two accounts. This topic explains the rules of debit and credit, the layout of ledger accounts, and how to record transactions and balance accounts.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Why_Every_Penny_Is_Tracked_Twice.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvV2h5X0V2ZXJ5X1Blbm55X0lzX1RyYWNrZWRfVHdpY2UubTRhIiwiaWF0IjoxNzcwMjcxMjc5LCJleHAiOjUyNzA3NjcyNzl9.4V86uu7Wd8fN_svM-w5Au71F0focSC0CWk0aCN9U00w',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/The_Logic_of_the_Ledger.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9UaGVfTG9naWNfb2ZfdGhlX0xlZGdlci5tcDQiLCJpYXQiOjE3NzAyNzE2ODYsImV4cCI6NTI3MDc2NzY4Nn0.S0ASgELRLvpT02-Un-SFI98DD9iVFQz5waI9MGv6hZI',
    sections: [
      {
        title: 'The Dual Aspect Concept',
        content: `**Double Entry Rule**  
For every transaction, there are two entries: a **Debit (Dr)** entry and a **Credit (Cr)** entry.  
*   **Debit** the Receiver (or value coming IN).
*   **Credit** the Giver (or value going OUT).

**The Layout of an Account (T-Account)**  
An account is a record of transactions related to a specific item or person. It is "T" shaped.
*   **Left side** = Debit side (Dr)
*   **Right side** = Credit side (Cr)

| Date | Details | Folio | Amount ($) | Date | Details | Folio | Amount ($) |
|---|---|---|---|---|---|---|---|
| Jan 1 | (Debit Entry) | | 100 | Jan 15 | (Credit Entry) | | 50 |

**Rules for Asset, Liability, and Capital Accounts**  
1.  **Assets** (e.g., Cash, Van, Debtors):
    *   To Increase: **Debit**
    *   To Decrease: **Credit**
2.  **Liabilities** (e.g., Creditors, Loans):
    *   To Increase: **Credit**
    *   To Decrease: **Debit**
3.  **Capital**:
    *   To Increase (Profit/Introduction): **Credit**
    *   To Decrease (Drawings/Loss): **Debit**`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Worked Example: Recording Transactions',
        content: `Let's record the following transactions for a new business "Computer World":

**May 1**: Started business with $10,000 cash in the bank.
*   Asset (Bank) increases -> **Dr Bank**
*   Capital increases -> **Cr Capital**

**Bank Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 1 | Capital | 10,000 | | | |

**Capital Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| | | | May 1 | Bank | 10,000 |

**May 2**: Bought a Computer for $2,000 paying by cheque.
*   Asset (Computer) increases -> **Dr Computer Equipment**
*   Asset (Bank) decreases -> **Cr Bank**

**Computer Equipment Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 2 | Bank | 2,000 | | | |

**Bank Account** (Updated)
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 1 | Capital | 10,000 | May 2 | Computer Eq | 2,000 |

**May 5**: Bought goods (Inventory) for $500 on credit from T. Tech.
*   Asset (Purchases) increases -> **Dr Purchases**
*   Liability (Creditor) increases -> **Cr T. Tech**

**Purchases Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 5 | T. Tech | 500 | | | |

**T. Tech Account** (Creditor)
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| | | | May 5 | Purchases | 500 |

**May 10**: Sold goods for $800 cash.
*   Asset (Cash) increases -> **Dr Cash**
*   Income (Sales) increases -> **Cr Sales**

**Cash Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 10 | Sales | 800 | | | |

**Sales Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| | | | May 10 | Cash | 800 |

**May 15**: Paid T. Tech $200 by cheque.
*   Liability (T. Tech) decreases -> **Dr T. Tech**
*   Asset (Bank) decreases -> **Cr Bank**

**T. Tech Account** (Updated)
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 15 | Bank | 200 | May 5 | Purchases | 500 |

**Bank Account** (Updated)
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 1 | Capital | 10,000 | May 2 | Computer Eq | 2,000 |
| | | | May 15 | T. Tech | 200 |`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Balancing Ledger Accounts',
        content: `At the end of a period (e.g., month-end), accounts must be **balanced**. We do this to find the net amount remaining in the account.

**Steps to Balance an Account:**
1.  Add up the totals of the Debit and Credit columns.
2.  Find the difference between the two totals.
3.  Enter the difference on the **smaller** side as **"Balance c/d"** (carried down). This makes the totals equal.
4.  Total both columns on the same line (double underline the totals).
5.  Bring the balance down to the **opposite** side (the larger side) below the total as **"Balance b/d"** (brought down). This is the opening balance for the next period.

**Example: Balancing the Bank Account from above**
*   Debit Total: $10,000
    *   (May 1 Capital)
*   Credit Total so far: $2,200
    *   (May 2 Computer: 2,000 + May 15 T. Tech: 200)
*   Difference: $7,800 ($10,000 - $2,200)
*   Since Credit side is smaller, put "Balance c/d 7,800" on the Credit side.

**Bank Account**
| Date | Details | Amount ($) | Date | Details | Amount ($) |
|---|---|---|---|---|---|
| May 1 | Capital | 10,000 | May 2 | Computer Eq | 2,000 |
| | | | May 15 | T. Tech | 200 |
| | | | **May 31** | **Balance c/d** | **7,800** |
| | | **10,000** | | | **10,000** |
| **Jun 1** | **Balance b/d** | **7,800** | | | |

**Explanation**: The "Balance b/d" of $7,800 on the Debit side tells us we have $7,800 **Asset** (Cash in Bank) at the start of June. A debit balance represents an Asset or Expense. A credit balance represents a Liability, Capital, or Income.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Debit the Receiver, Credit the Giver.',
      'Assets/Expenses (PEA): Increase Dr, Decrease Cr.',
      'Liabilities/Income/Capital (LIC): Increase Cr, Decrease Dr.',
      'Balance c/d goes on the smaller side to make totals agree',
      'Balance b/d is the true balance brought down to the larger side for the next period.',
    ],
    exam_tips: [
      'Always ask: Which two accounts are affected? Is it an asset, liability, expense or income? Is it increasing or decreasing?',
      'When balancing, the totals must be on the same horizontal line.',
      'A Debit balance b/d means Asset/Expense (or Drawings). A Credit balance b/d means Liability/Income/Capital.',
    ],
    questions: [
      {
        id: 'q1',
        question: 'State the double entry rule for Assets and Liabilities.',
        answer: 'Assets: Debit to increase, Credit to decrease. Liabilities: Credit to increase, Debit to decrease.'
      },
      {
        id: 'q2',
        question: 'What is the double entry to record the purchase of a Motor Van for $5,000 paying by cheque?',
        answer: 'Debit Motor Van $5,000; Credit Bank $5,000.'
      },
      {
        id: 'q3',
        question: 'What is the double entry to record goods sold for $200 on credit to J. Brown?',
        answer: 'Debit J. Brown (Debtor) $200; Credit Sales $200.'
      },
      {
        id: 'q4',
        question: 'Explain what a "Debit balance b/d" on a Bank Account means.',
        answer: 'It means the business has money in the bank (an Asset). It is a positive bank balance.'
      },
      {
        id: 'q5',
        question: 'When balancing an account, on which side do you write "Balance c/d"?',
        answer: 'On the smaller side, to make the totals of the debit and credit columns equal.'
      }
    ],
  },

  'Trial Balance': {
    topic: 'Trial Balance',
    subject: 'Principles of Accounting',
    summary: 'The main purpose of the Trial Balance is to check the arithmetical accuracy of the double-entry bookkeeping. It is a list of all ledger balances at a specific date.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Silent_Errors_Hiding_in_the_Trial_Balance.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvU2lsZW50X0Vycm9yc19IaWRpbmdfaW5fdGhlX1RyaWFsX0JhbGFuY2UubTRhIiwiaWF0IjoxNzcwMjcxMTY0LCJleHAiOjUyNzA3NjcxNjR9.9aXLSwGdzL2cUh3_cn1O0IpIh8FV_xjcXNwsA1mdt1c',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/The_Trial_Balance.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9UaGVfVHJpYWxfQmFsYW5jZS5tcDQiLCJpYXQiOjE3NzAyNzE3MDAsImV4cCI6NTI3MDc2NzcwMH0.G9uA0flFctOF1h3O57xykqv2UWw8NW0ZQw2iF_2mt-s',
    sections: [
      {
        title: 'Extraction of a Trial Balance',
        content: `**Process**
1.  Balance all ledger accounts.
2.  List every account with a Debit balance in the LEFT column.
3.  List every account with a Credit balance in the RIGHT column.
4.  Total both columns.

**Rule**: **Total Debits must equal Total Credits.**

| Account | Debit ($) | Credit ($) |
|---|---|---|
| Capital | | 10,000 |
| Bank | 5,000 | |
| Motor Vehicles | 8,000 | |
| Sales | | 15,000 |
| Purchases | 9,000 | |
| Wages | 2,000 | |
| Creditors | | 1,000 |
| Debtors | 2,000 | |
| **Totals** | **26,000** | **26,000** |

This proves that for every debit entry, there has been a corresponding credit entry. However, it does not prove the accounts are 100% correct (see Errors).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Errors Revealed by a Trial Balance',
        content: `If the Trial Balance totals do **not** agree, it means a mathematical error has occurred.
*   **Single Entry**: Only recording one side of a transaction.
*   **Incorrect Addition**: Adding up the ledger account or Trial Balance column incorrectly.
*   **Different Amounts**: Entering Dr $50 and Cr $500.
*   **Extraction Error**: Listing a debit balance as a credit (or vice versa).

**Correction**: These are usually fixed by checking calculations or using a Suspense Account temporarily.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Errors NOT Revealed by a Trial Balance',
        content: `Even if the Trial Balance balances, these 6 errors might still exist (Use acronym **CROPPC** or **CORPPC**):

1.  **Commission**: Wrong account, but correct class (e.g., Sold to J. Smith, debited J. Brown).
2.  **Omission**: Transaction completely missed from books.
3.  **Reversal**: Debit and Credit entries swapped (e.g., Dr Sales, Cr Debtors).
4.  **Principle**: Wrong class of account (e.g., Bought Van, debited Motor Expenses instead of Motor Vehicles).
5.  **Principle (Original Entry)**: Wrong figure used for both entries (e.g., Sale of $100 entered as $10).
6.  **Compensating**: Two separate errors cancel each other out.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Trial Balance checks arithmetical accuracy: Total Dr = Total Cr.',
      'Debit balances: Assets and Expenses.',
      'Credit balances: Liabilities, Income, and Capital.',
      'CROPPC errors (Commission, Reversal, Omission, Principle, Original Entry, Compensating) are NOT revealed.',
    ],
    exam_tips: [
      'If the question asks for limitations of a Trial Balance, list the errors not revealed.',
      'When preparing a Trial Balance, careful with the Bank Balance - it can be Dr (Asset) or Cr (Overdraft).',
    ],
    questions: [
      {
        id: 'q1',
        question: 'State the purpose of a Trial Balance.',
        answer: 'To check the arithmetical accuracy of the double-entry records (Debits = Credits).'
      },
      {
        id: 'q2',
        question: 'List three types of accounts that typically have a Credit balance.',
        answer: 'Sales (Income), Capital, Creditors (Liabilities), Bank Overdraft.'
      },
      {
        id: 'q3',
        question: 'If a Trial Balance agrees, does it mean there are no errors? Explain.',
        answer: 'No. Errors of Omission, Commission, Principle, etc., do not affect the agreement of the Trial Balance totals.'
      },
      {
        id: 'q4',
        question: 'Define "Error of Principle".',
        answer: 'When a transaction is entered in the wrong CLASS of account (e.g., treating a Capital Expenditure as Revenue Expenditure, like debiting Repairs instead of Van).'
      },
      {
        id: 'q5',
        question: 'How do you calculate the Suspense Account balance from a Trial Balance difference?',
        answer: 'Insert the difference on the smaller side of the Trial Balance to make the totals agree. This amount is the opening balance of the Suspense Account.'
      }
    ]
  },

  'Correction of Errors': {
    topic: 'Correction of Errors',
    subject: 'Principles of Accounting',
    summary: 'When errors are discovered, they are corrected by journal entries.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Why_Balanced_Books_Can_Be_Total_Fiction.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvV2h5X0JhbGFuY2VkX0Jvb2tzX0Nhbl9CZV9Ub3RhbF9GaWN0aW9uLm00YSIsImlhdCI6MTc3MDI3MTI1NiwiZXhwIjo1MjcwNzY3MjU2fQ.psxFbF3k0UYwo4LrB2axnUYk5_S3XhxAxfVYN3Aee6k',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Correcting_Accounting_Errors.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9Db3JyZWN0aW5nX0FjY291bnRpbmdfRXJyb3JzLm1wNCIsImlhdCI6MTc3MDI3MTU0OSwiZXhwIjo1MjcwNzY3NTQ5fQ.7rWc_iAv6xIN9MIbmncDw1A-aC_-xlqo2YtGmYPFITs',
    sections: [
      {
        title: 'Types of Errors and Correction Method',
        content: `**General approach**  
1. **Identify** the error (what was done wrong).  
2. **Determine** the correct entry.  
3. **Journal entry** to correct:  
   - **Cancel** the wrong effect (reverse it).  
   - **Record** the correct effect.  
   Or: one entry that brings the accounts to the correct position (net correction).

**Suspense account**  
- Used when the **trial balance** does not agree (e.g. one-sided entry). The **difference** is put to **Suspense** (Dr or Cr as needed) so that the trial balance balances.  
- When the error is **found**, correct it by **journal**: Dr/Cr the right accounts and **clear Suspense** (Cr/Dr Suspense).  
- After all corrections, **Suspense should have a zero balance**. If not, another error exists.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Examples of Corrections',
        content: `**1. Omission** – e.g. credit sale not recorded.  
- **Correct**: Dr Debtors, Cr Sales.  
- Effect: Assets up, profit up.

**2. Commission** – e.g. rent debited to Motor expenses.  
- **Correct**: Dr Rent, Cr Motor expenses.  
- Effect: Correct expense classification; profit unchanged if both are expenses for the period.

**3. Principle** – e.g. machinery purchased debited to Purchases.  
- **Correct**: Dr Machinery (asset), Cr Purchases.  
- Effect: Asset up, expense down; profit up; statement of financial position correct.

**4. Original entry** – e.g. sale of $500 recorded as $50 (both sides).  
- **Correct**: Dr Debtors 450, Cr Sales 450.  
- Effect: Assets and profit both increase by 450.

**5. Reversal** – e.g. cash from debtor recorded as Dr Sales, Cr Cash.  
- **Correct**: Dr Cash, Cr Sales (reverses wrong entry); then Dr Debtors, Cr Sales (correct entry).  
- Or: Dr Cash, Cr Debtors (net 2 Dr Cash, 2 Cr Sales cancel; 1 Dr Debtors, 1 Cr Cash cancel; leave Dr Cash, Cr Debtors for the receipt).

**6. Single entry (trial balance disagreed)** – e.g. only Dr Purchases recorded.  
- **Initially**: Cr Suspense (to balance).  
- **Correct**: Dr Creditors (or Cash if paid), Cr Suspense.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Effect on Profit and Statement of Financial Position',
        content: `**Profit** – Corrections that increase (decrease) income or decrease (increase) expenses will **increase (decrease)** profit.  
**Statement of financial position** – Corrections that increase (decrease) assets or decrease (increase) liabilities will change net assets and therefore capital (and retained earnings).

**Statement of correction** – Some questions ask for a **statement** showing:  
- Original profit (or net profit).  
- Add/(Less): effect of each correction.  
- Corrected profit.  
- And/or corrected balances for assets/liabilities.  
Use the **journal entries** to see whether each correction adds or subtracts from profit and from which line items.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Correct errors by journal entry; use Suspense when trial balance did not agree.',
      'Omission, commission, principle, original entry, reversal – each needs appropriate Dr/Cr.',
      'Clear Suspense when correcting one-sided errors; state effect on profit and SFP.',
    ],
    exam_tips: [
      'Write journal entries to correct given errors; clear Suspense where relevant.',
      'Prepare statement of corrected profit and/or corrected balances.',
    ],
  },

  'Financial Statements (Sole Trader)': {
    topic: 'Financial Statements (Sole Trader)',
    subject: 'Principles of Accounting',
    summary: 'The final destination of the accounting process is the preparation of Financial Statements. For a sole trader, these are the Income Statement (showing financial performance) and the Statement of Financial Position (showing financial position at a specific date).',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/The_Sole_Trader_Accounting_Scoreboard.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvVGhlX1NvbGVfVHJhZGVyX0FjY291bnRpbmdfU2NvcmVib2FyZC5tNGEiLCJpYXQiOjE3NzAyNzEyNDEsImV4cCI6NTI3MDc2NzI0MX0.MzVOCDjSJ9UWyKy19quIvTwkgUnCTfnmTo-KmX8r9WE',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Financial_Statements.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9GaW5hbmNpYWxfU3RhdGVtZW50cy5tcDQiLCJpYXQiOjE3NzAyNzE1NzQsImV4cCI6NTI3MDc2NzU3NH0.yQNLbETMxGwmcZfojTOcGGiVN8oGSSCENjOQ673Ud_0',
    sections: [
      {
        title: 'Income Statement',
        content: `**Purpose**: To calculate the **Gross Profit** and **Net Profit** (or Loss) for the year.
It has two parts:
1.  **Trading Account**: Calculates Gross Profit (Revenue - Cost of Sales).
2.  **Profit and Loss Section**: Calculates Net Profit (Gross Profit - Expenses).

**Pro Forma Income Statement for the year ended 31 December 20XX**
| | $ | $ | $ |
|---|---|---|---|
| **Revenue** (Sales) | | | 100,000 |
| Less: Sales Returns | | | (2,000) |
| **Net Revenue** | | | **98,000** |
| | | | |
| **Less: Cost of Sales** | | | |
| Opening Inventory | | 15,000 | |
| Purchases | 60,000 | | |
| Add: Carriage Inwards | 1,000 | | |
| Less: Purchase Returns | (3,000) | | |
| | | 58,000 | |
| Cost of Goods Available | | 73,000 | |
| Less: Closing Inventory | | (18,000) | |
| **Cost of Sales** | | | **(55,000)** |
| **Gross Profit** | | | **43,000** |
| | | | |
| **Add: Other Income** | | | |
| Rent Received | | 1,200 | |
| Discount Received | | 500 | 1,700 |
| | | | 44,700 |
| **Less: Expenses** | | | |
| Wages and Salaries | | 12,000 | |
| Rent and Rates | | 5,000 | |
| Lighting and Heating | | 1,500 | |
| Motor Expenses | | 2,000 | |
| Carriage Outwards | | 800 | |
| Depreciation | | 3,000 | |
| **Total Expenses** | | | **(24,300)** |
| **Profit for the Year (Net Profit)** | | | **20,400** |

**Note**:
*   **Carriage Inwards**: Cost of bringing purchases IN (part of Cost of Sales).
*   **Carriage Outwards**: Cost of sending sales OUT (an expense).
*   **Closing Inventory**: Valued at lower of cost or NRV. Deducted here and added to Current Assets.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Statement of Financial Position (Balance Sheet)',
        content: `**Purpose**: To show the financial position of the business at a specific point in time (what it owns and what it owes).
**Equation**: Assets = Capital + Liabilities.

**Pro Forma Statement of Financial Position as at 31 December 20XX**
| | Cost | Acc. Dep | NBV |
|---|---|---|---|
| **Non-Current Assets** | $ | $ | $ |
| Land and Buildings | 100,000 | - | 100,000 |
| Motor Vehicles | 30,000 | (10,000) | 20,000 |
| Fixtures and Fittings | 8,000 | (3,000) | 5,000 |
| **Total Non-Current Assets** | | | **125,000** |
| | | | |
| **Current Assets** | | | |
| Inventory (Closing) | | 18,000 | |
| Trade Receivables | | 12,000 | |
| Less: Provision for Doubtful Debts| | (600) | 11,400 |
| Bank | | 5,000 | |
| Cash | | 200 | |
| Prepayments | | 400 | |
| **Total Current Assets** | | | **35,000** |
| **Total Assets** | | | **160,000** |
| | | | |
| **Capital and Liabilities** | | | |
| **Capital** | | | |
| Opening Capital | | | 130,000 |
| Add: Profit for the year | | | 20,400 |
| Less: Drawings | | | (15,000) |
| **Closing Capital** | | | **135,400** |
| | | | |
| **Non-Current Liabilities** | | | |
| Bank Loan (repayable 2030) | | | 20,000 |
| | | | |
| **Current Liabilities** | | | |
| Trade Payables | | 4,000 | |
| Accruals | | 600 | |
| **Total Current Liabilities** | | | **4,600** |
| **Total Capital and Liabilities** | | | **160,000** |

**Key Checks**:
*   Total Assets MUST equal Total Capital and Liabilities.
*   **Working Capital** = Current Assets - Current Liabilities.
*   **Capital Employed** = Owner's Capital + Non-Current Liabilities.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Gross Profit = Revenue - Cost of Sales.',
      'Net Profit = Gross Profit + Other Income - Expenses.',
      'Closing Inventory appears in TWO places: Cost of Sales (Trading A/c) and Current Assets (SFP).',
      'Carriage Inwards increases Cost of Sales; Carriage Outwards is an Expense.',
      'Assets must always equal Equity + Liabilities.',
    ],
    exam_tips: [
      'Learn the pro-formas by heart. Marks are awarded for correct headings and layout.',
      'Always start with Opening Inventory + Purchases - Closing Inventory for Cost of Sales.',
      'Do not forget to deduct Drawings from the Profit to get the final Capital figure.',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Calculate Cost of Sales: Opening Stock $5,000, Purchases $20,000, Closing Stock $4,000.',
        answer: 'Cost of Sales = $5,000 + $20,000 - $4,000 = $21,000.'
      },
      {
        id: 'q2',
        question: 'Where is "Carriage Inwards" shown in the Income Statement?',
        answer: 'It is added to Purchases in the Trading Account section (Cost of Sales).'
      },
      {
        id: 'q3',
        question: 'Distinguish between Gross Profit and Net Profit.',
        answer: 'Gross Profit is Revenue minus Cost of Sales. Net Profit is Gross Profit minus all other Expenses (overheads).'
      },
      {
        id: 'q4',
        question: 'In the Statement of Financial Position, under which heading is "Bank Overdraft" shown?',
        answer: 'Current Liabilities.'
      },
      {
        id: 'q5',
        question: 'How is Closing Capital calculated?',
        answer: 'Closing Capital = Opening Capital + Net Profit (or - Net Loss) - Drawings.'
      }
    ],
  },

  'Adjustments (Accruals, Prepayments, Depreciation)': {
    topic: 'Adjustments (Accruals, Prepayments, Depreciation)',
    subject: 'Principles of Accounting',
    summary: 'Adjustments ensure that income and expenses are matched to the correct period (accruals and prepayments) and that non-current assets are charged as expense over their useful life (depreciation). Doubtful debts adjust receivables to expected collectable amount.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/The_Four_Horsemen_Of_Accounting_Adjustments.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvVGhlX0ZvdXJfSG9yc2VtZW5fT2ZfQWNjb3VudGluZ19BZGp1c3RtZW50cy5tNGEiLCJpYXQiOjE3NzAyNzEyMjgsImV4cCI6NTI3MDc2NzIyOH0.vD4R4eJGijhXsKsT_01he7iheTrWzLAhvAC-pfbc-GE',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Accounting_Adjustments.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9BY2NvdW50aW5nX0FkanVzdG1lbnRzLm1wNCIsImlhdCI6MTc3MDI3MTUyMiwiZXhwIjo1MjcwNzY3NTIyfQ.k_xBbAtaIx65M2OKqN6ggE40c4naq89F6z82fqqLAoY',
    sections: [
      {
        title: 'Accruals and Prepayments',
        content: `**Accruals (expense)** – Expense **incurred** in the period but **not yet paid**.  
- **Example**: Wages earned by staff in the last week of the year, paid in the new year.  
- **Adjustment**: Dr Wages (expense), Cr Accruals / Wages payable (liability).  
- **Effect**: Expense for the period increases; current liability increases.  
- **Next period**: When paid, Dr Accruals, Dr Wages (current period), Cr Cash.

**Prepayments (expense)** – Expense **paid** in advance (for a future period).  
- **Example**: Rent paid for Jan–Dec, but year end is 30 June; July–Dec is prepayment.  
- **Adjustment**: Dr Prepayments (current asset), Cr Rent (expense).  
- **Effect**: Expense for the period decreases; current asset (prepayment) increases.  
- **Next period**: Dr Rent, Cr Prepayments when the period to which it relates starts.

**Accrued income** – Income **earned** but **not yet received**. Dr Accrued income (asset), Cr Income.  
**Prepaid income (income in advance)** – Cash received for **future** period. Dr Income, Cr Income received in advance (liability).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Depreciation',
        content: `**Purpose** – To **allocate the cost** (or revalued amount) of a **non-current asset** over its **useful life** as an expense. Reflects wear and tear, obsolescence, and use.

**Methods**  
- **Straight line**: Depreciation = (Cost − Residual value) / Useful life (years). Same amount each year.  
- **Reducing balance**: Depreciation = Carrying amount × Fixed %. Higher charge in early years.  
- **Revaluation**: Used for some assets (e.g. loose tools). (Opening value − Closing value) = depreciation (or gain).

**Accounting entries**  
- **Dr** Depreciation expense (income statement).  
- **Cr** Accumulated depreciation (statement of financial position, deducted from asset) **or** Cr Asset account (asset at net book value).  
- **Net book value (NBV)** = Cost − Accumulated depreciation (or = Carrying amount).

**Disposal** – Remove cost and accumulated depreciation; record proceeds; balance is profit or loss on disposal (income statement).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Doubtful Debts and Allowance',
        content: `**Doubtful debts** – Some receivables may **not** be collected. **Allowance for doubtful debts** (provision) is a **reduction** of receivables to reflect expected collectable amount.

**Initial allowance** – e.g. 5% of receivables at year end.  
- **Dr** Doubtful debts expense (income statement).  
- **Cr** Allowance for doubtful debts (statement of financial position, deducted from receivables).  
- **Receivables** in SFP = Trade receivables − Allowance.

**Increase in allowance** – If allowance last year was 100 and this year should be 150:  
- **Dr** Doubtful debts expense 50, **Cr** Allowance 50.  
**Decrease** – **Dr** Allowance, **Cr** Doubtful debts expense (or reduce expense).

**Bad debt** – Customer balance **written off** (irrecoverable).  
- **Dr** Bad debts expense, **Cr** Trade receivables.  
- If there is an allowance, may also **Dr** Allowance, **Cr** Trade receivables for the same customer (write off); then **restore** allowance to required level (Dr Expense, Cr Allowance).`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Accruals: expense incurred, not paid → Dr Expense, Cr Liability.',
      'Prepayments: paid in advance → Dr Prepayment (asset), Cr Expense.',
      'Depreciation: Dr Expense, Cr Accumulated depreciation; straight line or reducing balance.',
      'Allowance for doubtful debts: reduces receivables; bad debt write-off Dr Expense, Cr Receivables.',
    ],
    exam_tips: [
      'Calculate and journalise accruals, prepayments, depreciation, and allowance for doubtful debts.',
      'Show effect on profit and statement of financial position.',
    ],
  },

  'Incomplete Records': {
    topic: 'Incomplete Records',
    subject: 'Principles of Accounting',
    summary: 'When full double-entry records are not kept, profit and statement of financial position can still be derived using opening and closing capital, drawings, bank/cash summaries, and control accounts (e.g. debtors, creditors) to infer missing figures.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Reconstructing_Financials_From_The_Shoebox_Scenario.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvUmVjb25zdHJ1Y3RpbmdfRmluYW5jaWFsc19Gcm9tX1RoZV9TaG9lYm94X1NjZW5hcmlvLm00YSIsImlhdCI6MTc3MDI3MTE0OSwiZXhwIjo1MjcwNzY3MTQ5fQ.RJL-mSKedqkjIJBlgnJtDUc23JGhAylZBUMi_rn-Neo',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/The_Case_of_the_Missing_Profit.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9UaGVfQ2FzZV9vZl90aGVfTWlzc2luZ19Qcm9maXQubXA0IiwiaWF0IjoxNzcwMjcxNjY5LCJleHAiOjUyNzA3Njc2Njl9.5oKQVxQiyVPihvAJR-LcDoDPMcJBGGO-1suUh2009SA',
    sections: [
      {
        title: 'Why Records Are Incomplete',
        content: `**Reasons** – Small businesses may keep only **cash book** and **invoices**, or a **single-entry** summary. **Theft or loss** of records; **fire**; **neglect**.  
**Goal** – Derive **profit** (or loss) and **statement of financial position** using whatever information is available: opening/closing capital, drawings, bank statements, list of debtors/creditors, inventory counts, and known income/expenses.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Calculation of Profit from Capital',
        content: `**Accounting equation** – **Capital = Assets − Liabilities**.  
**Profit** (assuming no capital introduced):  
**Closing capital − Opening capital = Profit − Drawings** (or **Profit = Closing capital − Opening capital + Drawings**).  
If **capital introduced**: **Profit = Closing capital − Opening capital − Capital introduced + Drawings**.

**Steps**  
1. **Opening statement of financial position** (or list of opening assets and liabilities) → **Opening capital**.  
2. **Closing statement of financial position** (closing assets and liabilities) → **Closing capital**.  
3. **Drawings** – total taken (cash, goods, personal expenses paid by business).  
4. **Capital introduced** – if any.  
5. **Profit** = Closing capital − Opening capital + Drawings − Capital introduced.  
**Note** – This gives **net profit** before any **adjustments** (e.g. depreciation, accruals). For a more accurate figure, adjustments should be applied where possible.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Missing Figures: Sales, Purchases, Creditors, Debtors',
        content: `**Credit sales** – If opening debtors, closing debtors, and receipts from debtors are known:  
**Credit sales = Closing debtors + Receipts − Opening debtors**.  
(Or use **sales ledger control account** format: Opening + Sales − Receipts − Contra − Discounts allowed − Bad debts = Closing.)

**Credit purchases** – If opening creditors, closing creditors, and payments to creditors are known:  
**Credit purchases = Closing creditors + Payments − Opening creditors**.  
(Or **purchases ledger control account**: Opening + Purchases − Payments − Contra − Discounts received = Closing.)

**Cash sales / cash purchases** – From cash book or bank summary if only one type of sale/purchase is on credit.  
**Opening / closing inventory** – From inventory count or from cost of sales if other three figures known: **Opening + Purchases − Closing = Cost of sales**; so **Closing = Opening + Purchases − Cost of sales** (if cost of sales can be estimated, e.g. from margin).  
**Expenses** – From cash paid plus accrual increase (or minus prepayment increase); or from opening/closing prepayments and accruals.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Profit = Closing capital − Opening capital + Drawings − Capital introduced (no other capital change).',
      'Use control account logic to find credit sales and credit purchases from debtors/creditors and cash.',
      'Closing inventory and cost of sales can be derived when three of the four are known.',
    ],
    exam_tips: [
      'Calculate profit from opening/closing capital and drawings.',
      'Prepare control accounts or derive sales/purchases from given debtors, creditors, and cash.',
    ],
  },

  'Partnership Accounts': {
    topic: 'Partnership Accounts',
    subject: 'Principles of Accounting',
    summary: 'Partnerships maintain Capital and Current accounts for each partner. Profit is shared according to the agreement (salaries, interest on capital, interest on drawings, then remainder in profit-sharing ratio). The appropriation account and partners’ current accounts are key.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Partnership_Accounting_and_The_1890_Default_Trap.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvUGFydG5lcnNoaXBfQWNjb3VudGluZ19hbmRfVGhlXzE4OTBfRGVmYXVsdF9UcmFwLm00YSIsImlhdCI6MTc3MDI3MTExOSwiZXhwIjo1MjcwNzY3MTE5fQ.mme1uvEo1uCuiXeASWu8CBJWWhTRWn8TWnPbgRPUK3Y',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Partnership_Accounts.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9QYXJ0bmVyc2hpcF9BY2NvdW50cy5tcDQiLCJpYXQiOjE3NzAyNzE2MjYsImV4cCI6NTI3MDc2NzYyNn0.N87KcPJ4GXcemex9vS_dGuSfWoN-AbwFBGE_covHaIs',
    sections: [
      {
        title: 'Capital and Current Accounts',
        content: `**Capital account** – Records each partner’s **long-term investment**. Usually **fixed** unless there is agreement to change (e.g. admission/retirement).  
- **Credit** balance = amount owed by partnership to partner.  
- Changes: introduction of capital (Cr); withdrawal of capital (Dr); revaluation (Cr or Dr).

**Current account** – Records **profit share**, **salary**, **interest on capital**, **interest on drawings**, and **drawings**.  
- **Credit** balance = partner’s share of profit etc. exceeds drawings (amount owed to partner).  
- **Debit** balance = drawings exceed share (amount owed by partner to business).  
- **Format**: Salary (Cr), Interest on capital (Cr), Share of profit (Cr) | Drawings (Dr), Interest on drawings (Dr). Balance c/d.

**Division of profit** – Shown in **appropriation account** (after net profit from income statement).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Appropriation Account',
        content: `**Layout**  
- **Net profit** (from income statement) **add** Interest on drawings (total). **Less** Partner salaries. **Less** Interest on capital. **Remainder** = **Profit shared in profit-sharing ratio** (e.g. 2:1).  
- Each partner’s **salary**, **interest on capital**, **interest on drawings**, and **share of remainder** are then **transferred** to their **current accounts**.

**Interest on drawings** – Increases profit available for distribution (penalises early drawings). **Dr** Partner’s current account, **Cr** Appropriation.  
**Salary** – **Dr** Appropriation, **Cr** Partner’s current account.  
**Interest on capital** – **Dr** Appropriation, **Cr** Partner’s current account.  
**Share of profit** – **Dr** Appropriation, **Cr** Each partner’s current account.

**Guaranteed minimum** – Sometimes one partner is guaranteed a minimum share; the guarantee is met by the other partner(s) if profit share would otherwise be lower.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Partnership Statement of Financial Position',
        content: `**Equity section** – Under **Capital**, show each partner’s **Capital account** balance. Under **Current accounts**, show each partner’s **Current account** balance (Credit as liability, Debit as asset – amount due from partner).  
**Total equity** = Sum of Capital + Sum of Current (Credits − Debits).  
**Assets and liabilities** – Same as for sole trader (non-current assets, current assets, current/non-current liabilities).  
**Drawings** – Not in statement of financial position; already reflected in current accounts.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Capital account: fixed capital; Current account: profit share, salary, interest, drawings.',
      'Appropriation: Net profit + Interest on drawings − Salaries − Interest on capital; remainder in PSR.',
      'Statement of financial position: show Capital and Current account balance for each partner.',
    ],
    exam_tips: [
      'Prepare appropriation account and partners’ current accounts from profit and agreement.',
      'Prepare partnership statement of financial position including capital and current accounts.',
    ],
  },

  'Company Accounts': {
    topic: 'Company Accounts',
    subject: 'Principles of Accounting',
    summary: 'Companies have share capital (ordinary and preference shares), reserves (e.g. retained earnings, revaluation reserve), and pay dividends. The income statement and statement of financial position follow company format; equity = Share capital + Reserves.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Limited_Liability_and_the_Payment_Waterfall.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvTGltaXRlZF9MaWFiaWxpdHlfYW5kX3RoZV9QYXltZW50X1dhdGVyZmFsbC5tNGEiLCJpYXQiOjE3NzAyNzEwOTEsImV4cCI6NTI3MDc2NzA5MX0.ueoIApI8xNaSimwTaRmKLmdd3UpGL_9E6a_XWbUh1BM',
    sections: [
      {
        title: 'Share Capital and Reserves',
        content: `**Share capital** – **Ordinary shares** (equity; voting; residual profit). **Preference shares** (often fixed dividend; may be cumulative; priority over ordinary).  
- **Nominal value** (par value) – face value of share.  
- **Issued share capital** – nominal value of shares **issued**.  
- **Share premium** – amount received **above** nominal value (Credit to share premium account).

**Reserves**  
- **Retained earnings** – accumulated profit not distributed; increased by profit, decreased by dividends and losses.  
- **Revaluation reserve** – surplus on revaluation of assets (non-distributable in many jurisdictions until realised).  
- **Other reserves** – as per company law and accounting standards.

**Equity** = Share capital + Share premium + Revaluation reserve + Retained earnings + Other reserves.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Income Statement and Dividends',
        content: `**Income statement** – Revenue, cost of sales, gross profit, expenses, **profit before tax**, **tax**, **profit after tax**.  
- **Profit after tax** is transferred to **retained earnings** (or used for dividends).  
- **Dividends** – **Proposed** (declared but not yet paid) and **Paid**.  
- **Dr** Retained earnings (or Dr Profit and loss), **Cr** Dividends payable (current liability). When paid: **Dr** Dividends payable, **Cr** Cash.

**Preference dividend** – Often fixed % on nominal value; deducted before ordinary dividend.  
**Ordinary dividend** – Declared by directors; amount per share or total.  
**Interim vs final** – Interim paid during the year; final proposed at year end.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Statement of Financial Position (Company)',
        content: `**Equity**  
- **Share capital** – Ordinary, Preference (nominal value).  
- **Share premium**.  
- **Reserves** – Revaluation, Retained earnings, etc.  
- **Non-current liabilities** – Long-term loans.  
- **Current liabilities** – Trade payables, Tax, Dividends payable, Bank overdraft, etc.  
- **Assets** – Non-current then current (as for sole trader).

**Disclosure** – Companies often show **authorised** vs **issued** share capital; number of shares; dividend per share.  
**Directors’ remuneration** – Shown as expense in income statement; not “drawings”.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Share capital (ordinary, preference); share premium; retained earnings and other reserves.',
      'Dividends: Dr Retained earnings, Cr Dividends payable; reduce equity when declared.',
      'Company SFP: Equity = Share capital + Reserves; show dividends payable under current liabilities.',
    ],
    exam_tips: [
      'Prepare company income statement and statement of financial position from trial balance.',
      'Calculate and record dividends; update retained earnings.',
    ],
  },

  'Cash Flow': {
    topic: 'Cash Flow',
    subject: 'Principles of Accounting',
    summary: 'The cash flow statement shows cash generated and used under three headings: Operating activities, Investing activities, and Financing activities. It explains the change in cash and bank balance over the period.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Profit_Is_Opinion_But_Cash_Is_Fact.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvUHJvZml0X0lzX09waW5pb25fQnV0X0Nhc2hfSXNfRmFjdC5tNGEiLCJpYXQiOjE3NzAyNzExMzIsImV4cCI6NTI3MDc2NzEzMn0.YoOkv0wgAWxJNOmR8KdrCuOzMQHQXRuIAkChkJxY6f8',
    sections: [
      {
        title: 'Purpose and Structure',
        content: `**Purpose** – To show **sources** and **uses** of **cash** (and cash equivalents) during a period. Profit is not the same as cash (e.g. credit sales, depreciation, purchase of assets). The statement helps users assess **liquidity** and **ability to pay** debts and dividends.

**Three sections**  
1. **Operating activities** – Cash from main operations (receipts from customers, payments to suppliers and employees, other operating cash flows). Can be presented **direct** (actual cash in/out) or **indirect** (starting from profit, adjust for non-cash and working capital changes).  
2. **Investing activities** – Purchase/sale of non-current assets; purchase/sale of investments; interest received (if classified here).  
3. **Financing activities** – Proceeds from shares or loans; repayment of loans; dividends paid; drawings (sole trader/partnership).

**Net change in cash** = Operating + Investing + Financing. **Opening cash + Net change = Closing cash**.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Indirect Method (Operating Activities)',
        content: `**Start** with **profit before tax** (or net profit).  
**Add back** non-cash charges: **Depreciation**; **Loss on disposal** of asset.  
**Adjust for** changes in working capital (use **increase/decrease** in balances):  
- **Increase in inventory** → **Deduct** (cash used).  
- **Increase in receivables** → **Deduct** (cash not yet received).  
- **Decrease in payables** → **Deduct** (cash paid).  
- **Decrease in inventory** → Add. **Decrease in receivables** → Add. **Increase in payables** → Add.  
**Interest paid** – Deduct (or show separately). **Tax paid** – Deduct (or separate line).  
**Result** = **Net cash from operating activities**.  
**Then** add **Investing** and **Financing** sections; **reconcile** to **cash and bank** movement.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Investing and Financing',
        content: `**Investing** – **Outflow**: Purchase of machinery, vehicles, investments. **Inflow**: Sale of assets, sale of investments, interest/dividends received (if classified here).  
**Financing** – **Inflow**: Issue of shares, new loan. **Outflow**: Repayment of loan, dividends paid, drawings.  
**Non-cash transactions** – e.g. issue of shares to buy an asset: **disclose** in a note; do **not** include in cash flow (no cash).  
**Interest and dividends** – Classify consistently (e.g. interest paid under operating or financing; dividend paid under financing).`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Cash flow: Operating + Investing + Financing = change in cash.',
      'Indirect operating: Profit + Depreciation ± Working capital changes − Interest/tax paid.',
      'Investing: buy/sell assets; Financing: shares, loans, dividends, drawings.',
    ],
    exam_tips: [
      'Prepare cash flow statement using indirect method for operating activities.',
      'Reconcile opening and closing cash; classify items under correct heading.',
    ],
  },

  'Interpretation of Financial Statements': {
    topic: 'Interpretation of Financial Statements',
    subject: 'Principles of Accounting',
    summary: 'Ratios and other tools are used to assess profitability, liquidity, efficiency, and gearing. Interpretation involves comparing with prior years, competitors, or benchmarks and explaining what the figures mean.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Financial_Ratios_Expose_Zombie_Companies.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvRmluYW5jaWFsX1JhdGlvc19FeHBvc2VfWm9tYmllX0NvbXBhbmllcy5tNGEiLCJpYXQiOjE3NzAyNzEwODEsImV4cCI6NTI3MDc2NzA4MX0.03i7se_bbRQFcDnOZChLLMnnA2tX6WIX8FOR4iLIxPI',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Interpreting_Financials.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9JbnRlcnByZXRpbmdfRmluYW5jaWFscy5tcDQiLCJpYXQiOjE3NzAyNzE1OTMsImV4cCI6NTI3MDc2NzU5M30.fygfYe1sNsJEJ5fplFY42Rcy2icvf_4K5zuUMOOISHY',
    sections: [
      {
        title: 'Profitability Ratios',
        content: `**Gross profit margin** = Gross profit / Revenue × 100.  
- Higher margin may mean better pricing or lower cost of sales; compare with previous years and industry.

**Net profit margin (before tax)** = Profit before tax / Revenue × 100.  
- Shows profit after all expenses; affected by operating efficiency and financing costs.

**Return on capital employed (ROCE)** = Profit before interest and tax / Capital employed × 100.  
- **Capital employed** = Equity + Non-current liabilities (or Total assets − Current liabilities).  
- Measures return on long-term funding; useful for comparing different businesses.

**Return on equity (ROE)** = Profit after tax / Equity × 100.  
- Return to shareholders.  
Improving profitability ratios generally indicate better performance; declining may signal competition, cost increases, or inefficiency.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Liquidity Ratios',
        content: `**Current ratio** = Current assets / Current liabilities.  
- Ideally > 1 (assets cover short-term debts). Too high may mean excess inventory or receivables; too low may mean difficulty paying creditors.

**Liquid ratio (acid test)** = (Current assets − Inventory) / Current liabilities.  
- Excludes inventory (may be slow to sell). Stricter test of ability to pay short-term debts.

**Interpretation** – Liquidity ratios show **ability to pay** current obligations. A falling current ratio may indicate cash flow problems; a very high ratio may indicate underuse of assets.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Efficiency and Gearing',
        content: `**Efficiency (activity) ratios**  
- **Rate of inventory turnover** = Cost of sales / Average inventory (or Closing inventory).  
- **Receivables collection period** = Trade receivables / Revenue × 365 (days).  
- **Payables payment period** = Trade payables / Purchases × 365 (days).  
- Faster inventory turnover and shorter receivables period can improve cash flow; longer payables period may help cash but must not damage supplier relations.

**Gearing** = Non-current liabilities (or Long-term debt) / Capital employed × 100 (or Debt / (Debt + Equity)).  
- High gearing = more debt; higher financial risk (interest, repayment) but can amplify returns.  
- Low gearing = more equity; lower risk but may mean missed growth opportunities.

**Limitations** – Ratios are based on **past** data and **book values**; seasonal businesses may need averages; one ratio alone is not enough; compare trends and benchmarks.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Profitability: GP margin, NP margin, ROCE, ROE.',
      'Liquidity: Current ratio, Liquid ratio (acid test).',
      'Efficiency: Inventory turnover, Receivables/Payables days; Gearing: debt/capital employed.',
    ],
    exam_tips: [
      'Calculate and interpret profitability, liquidity, and efficiency ratios from given statements.',
      'Comment on what an increase or decrease in a ratio might mean.',
    ],
  },

  'Not-for-Profit Organizations': {
    topic: 'Not-for-Profit Organizations',
    subject: 'Principles of Accounting',
    summary: 'Clubs, societies, and charities do not aim for profit. They prepare Receipts and Payments account (cash summary) and/or Income and Expenditure account (like income statement) and a Statement of Financial Position. Surplus or deficit replaces profit.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Accounting_For_Surplus_Instead_Of_Profit.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvQWNjb3VudGluZ19Gb3JfU3VycGx1c19JbnN0ZWFkX09mX1Byb2ZpdC5tNGEiLCJpYXQiOjE3NzAyNzEwMzEsImV4cCI6NTI3MDc2NzAzMX0.ABQ8AQtdn2GJEsFdD91jwPqpeQOOG3hm2dp29mnHrHg',
    videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Accounts/Accounting_for_a_Cause.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9BY2NvdW50cy9BY2NvdW50aW5nX2Zvcl9hX0NhdXNlLm1wNCIsImlhdCI6MTc3MDI3MTUzNSwiZXhwIjo1MjcwNzY3NTM1fQ.NKBBFnE9_mIVhLWtR7qZ8m5o5CgR1Zwdr3GZnkZZvGM',
    sections: [
      {
        title: 'Receipts and Payments Account',
        content: `**Purpose** – Summary of **all cash and bank** receipts and payments during a period.  
**Format** – **Receipts** (subscriptions, donations, fundraising, interest received, etc.) on one side; **Payments** (rent, wages, equipment, etc.) on the other. **Balance** = Closing cash/bank (or overdraft).  
**Limitation** – Does **not** show **accruals** or **prepayments**; does not distinguish capital from revenue; so it does **not** show true surplus/deficit for the period. It is a **cash summary**, not an income statement.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Income and Expenditure Account',
        content: `**Purpose** – Like an **income statement** for the period: **Income** (subscriptions for the period, donations, interest earned, etc.) minus **Expenditure** (rent, wages, depreciation, etc.) = **Surplus** (or **Deficit**).  
**Accruals** – Include only income **earned** and expenditure **incurred** in the period.  
- **Subscriptions** – Adjust for arrears (owed to club) and advance (received for next period).  
- **Prepayments** – Deduct from expense; show as asset.  
- **Accruals** – Add to expense; show as liability.  
**Depreciation** – Charge on assets (e.g. equipment, building).  
**Format** – Income at top; Expenditure below; **Surplus** or **Deficit** at bottom.  
**Accumulated fund** – Like capital. **Accumulated fund end = Accumulated fund start + Surplus − Deficit** (and ± other adjustments, e.g. legacy, sale of asset).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Statement of Financial Position and Subscriptions',
        content: `**Statement of financial position** – **Assets**: Cash, Bank, Subscriptions receivable, Prepayments, Equipment (net), etc. **Liabilities**: Subscriptions in advance, Accruals, Loans. **Accumulated fund** = Assets − Liabilities.  
**Subscriptions** – Key income. **Subscriptions account**:  
- **Credit** side: Arrears b/f, Income for year (from I&E), Advance c/f.  
- **Debit** side: Received in year, Arrears c/f, Advance b/f.  
**Bar, catering** – Often separate **trading** section: Sales − Cost of sales = Gross profit; then minus wages, etc. = Net profit from bar; transfer to I&E as income.  
**Life membership** – Treated as **capital** (credit Accumulated fund), not income; or spread over expected membership life.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Receipts and Payments = cash summary; Income and Expenditure = surplus/deficit for period.',
      'Subscriptions: adjust for arrears and advance; use accruals basis in I&E.',
      'Accumulated fund = assets − liabilities; surplus increases it, deficit decreases it.',
    ],
    exam_tips: [
      'Prepare Income and Expenditure account and Statement of Financial Position from given data.',
      'Prepare subscriptions account and show adjustment for arrears and advance.',
    ],
  },

  'Manufacturing Accounts': {
    topic: 'Manufacturing Accounts',
    subject: 'Principles of Accounting',
    summary: 'A manufacturing business produces goods. The manufacturing account calculates the cost of production (direct materials, direct labour, direct expenses, factory overheads). This cost is then used in the income statement as opening/closing inventory of finished goods and cost of sales.',
    audioUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Accounts/Untitled%20folder/Manufacturing_Accounts_Reveal_True_Production_Costs.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9BY2NvdW50cy9VbnRpdGxlZCBmb2xkZXIvTWFudWZhY3R1cmluZ19BY2NvdW50c19SZXZlYWxfVHJ1ZV9Qcm9kdWN0aW9uX0Nvc3RzLm00YSIsImlhdCI6MTc3MDI3MTEwMywiZXhwIjo1MjcwNzY3MTAzfQ.vpbnO7Khm6qU8Diytf-Qm63mQxO5yvj9H8TJuBJxqbE',
    sections: [
      {
        title: 'Cost of Production',
        content: `**Direct costs** – Traceable to the product:  
- **Direct materials** – Raw materials used.  
- **Direct labour** – Wages of workers directly making the product.  
- **Direct expenses** – Other direct costs (e.g. royalty per unit).

**Factory overheads (indirect)** – Manufacturing costs not directly traceable:  
- Factory rent, rates, power; Depreciation of factory machinery; Indirect labour (supervisors, cleaners); Factory insurance.  
- **Prime cost** = Direct materials + Direct labour + Direct expenses.  
- **Total cost of production** = Prime cost + Factory overheads.  
**Work in progress** – Partly finished goods. **Opening WIP** is added at start; **Closing WIP** is deducted at end so that only **finished** production is costed:  
**Cost of production of goods completed** = Opening WIP + Prime cost + Factory overheads − Closing WIP.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Manufacturing Account Format',
        content: `**Layout**  
- **Direct materials**: Opening inventory raw materials + Purchases − Closing inventory raw materials = **Materials consumed**.  
- **Direct labour**.  
- **Direct expenses**.  
- **Prime cost**.  
- **Factory overheads** (list).  
- **Total production cost**.  
- **Add** Opening work in progress.  
- **Less** Closing work in progress.  
- **Cost of production of goods completed** (transferred to income statement or finished goods account).

**Income statement** – **Revenue** (sales). **Cost of sales**: Opening inventory finished goods + Cost of production − Closing inventory finished goods. **Gross profit**; then **Administrative and selling expenses**; **Net profit**.  
**Statement of financial position** – Show **three** inventories: Raw materials, Work in progress, Finished goods (each as current asset).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Transfer Price and Profit',
        content: `**Transfer price** – When the factory “sells” goods to the selling division, a **transfer price** may be used. For a single company, often **cost** (no internal profit). If **cost + margin**, the income statement may show **manufacturing profit** and then **add** opening/closing inventory at transfer value; adjust for unrealised profit in inventory if necessary (advanced).  
**At cost** – Simpler: transfer at cost of production; no internal profit; closing inventory at cost.  
**Administrative expenses** – Office, salaries of non-factory staff, etc. – **not** in manufacturing account; in income statement. **Selling and distribution** – Also in income statement.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Manufacturing account: Direct materials + Direct labour + Direct expenses = Prime cost; + Overheads; ± WIP = Cost of production.',
      'Cost of sales: Opening finished + Cost of production − Closing finished.',
      'Three inventories in SFP: Raw materials, WIP, Finished goods.',
    ],
    exam_tips: [
      'Prepare manufacturing account and income statement from given data.',
      'Calculate prime cost, total production cost, and cost of goods completed; show inventories in SFP.',
    ],
  },
};

export function getTopicNotes(topicName: string): TopicNotes | null {
  return accountingNotes[topicName] ?? null;
}

export function getAllTopicNames(): string[] {
  return Object.keys(accountingNotes);
}
