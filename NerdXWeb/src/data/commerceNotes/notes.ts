// O-Level Commerce Notes – ZIMSEC syllabus aligned
import type { TopicNotes } from './types';

// 11 topics from ZIMSEC O-Level Principles of Commerce syllabus
export const commerceTopicNames: string[] = [
  'Production',
  'Trade',
  'Consumer Protection',
  'Business Organisations',
  'Enterprise',
  'Finance and Banking',
  'Insurance and Assurance',
  'Business Communication',
  'Transport',
  'Warehousing',
  'Marketing',
];

/** Slug (id) to display name for URL param lookup */
export function topicSlugToName(slug: string): string | null {
  const normalized = slug.replace(/-/g, '_').toLowerCase();
  const found = commerceTopicNames.find(
    (name) => name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') === normalized
  );
  return found ?? null;
}

export const commerceNotes: Record<string, TopicNotes> = {
  'Business Organisations': {
    topic: 'Business Organisations',
    subject: 'Commerce',
    summary: 'Business organisations are the legal and ownership structures under which firms operate. The main types are: sole trader (one owner), partnership (two or more owners), private limited company (Pvt Ltd), and public limited company (PLC). Each has different features – especially who owns the business, who controls it, who bears risk (liability), and how capital is raised. This topic covers the characteristics, advantages, and disadvantages of each type, and how to choose a suitable structure for a given situation. Key ideas include unlimited vs limited liability, the role of shares and the stock exchange, and the trade-off between simplicity (sole trader, partnership) and access to capital and protection (companies).',
    sections: [
      {
        title: '1. Business Organisation and Liability',
        content: `A **business organisation** is the **legal form** in which a business is owned and run. The form affects who owns the business, who shares the profits and losses, who makes decisions, and who is responsible for the business’s debts.

**Unlimited liability**
The owner(s) are **personally liable** for all the business’s debts. If the business cannot pay, creditors can claim the **personal assets** of the owner(s) (e.g. house, savings). Sole traders and most partnerships have unlimited liability.

**Limited liability**
The business is a **separate legal entity** from its owners. The owners (e.g. shareholders) are only liable up to the amount they have invested (or agreed to invest). Their **personal assets** are protected from business debts. Private and public limited companies have limited liability.`,
      },
      {
        title: '2. Sole Trader (Sole Proprietorship)',
        content: `**Definition**
A business **owned and run by one person**. The owner provides (or borrows) the capital, takes all the decisions, and keeps all the profit (or bears all the loss). There is no legal distinction between the owner and the business for liability – the owner has **unlimited liability**.

**Features**
- One owner; simple to set up (few or no formal registration requirements in many countries).
- Owner has full control; keeps all profit; bears all losses.
- Business often relies on the owner’s skills and time; capital is usually limited to owner’s savings and what they can borrow.

**Advantages**
- **Easy to start** – minimal legal formalities.
- **Full control** – owner makes all decisions.
- **All profit** goes to the owner.
- **Flexibility** – can change quickly; personal relationship with customers.
- **Privacy** – no requirement to publish accounts.

**Disadvantages**
- **Unlimited liability** – personal assets at risk if the business fails.
- **Limited capital** – hard to raise large sums; growth may be limited.
- **Heavy workload** – owner may have to do everything.
- **Business may end** if the owner dies or is ill (no separate legal entity).

**Examples**: Small shops, market stalls, tailors, plumbers, hairdressers – many small businesses in Zimbabwe and worldwide are sole traders.`,
      },
      {
        title: '3. Partnership',
        content: `**Definition**
A business **owned by two or more people** (often 2–20, depending on the law). Partners usually share capital, work, profits, and losses according to a **partnership agreement**. In a typical (general) partnership, each partner has **unlimited liability** – so each can be held responsible for all the firm’s debts. Some countries allow **limited liability partnerships (LLP)** where partners can have limited liability.

**Features**
- Two or more owners; agreement can be written or oral (written is safer).
- Partners share management, profit, and loss (often equally, unless agreed otherwise).
- More capital and skills than a sole trader, but still usually unlimited liability unless it is an LLP.

**Advantages**
- **More capital** than a sole trader – each partner can contribute.
- **Shared workload and skills** – partners can specialise.
- **Easy to form** – few formalities compared to a company.
- **Privacy** – no requirement to publish accounts (in many jurisdictions).

**Disadvantages**
- **Unlimited liability** (in a general partnership) – each partner can be liable for all debts; personal assets at risk.
- **Disputes** – partners may disagree; one partner’s mistake can bind the others.
- **Shared profit** – profit is split; decision-making is shared, so less single control.
- **Business may end** when a partner leaves or dies unless the agreement provides otherwise.

**Examples**: Law firms, medical practices, small trading firms, family businesses run by two or more relatives.`,
      },
      {
        title: '4. Private Limited Company (Pvt Ltd)',
        content: `**Definition**
A **company** that is a **separate legal entity** from its owners. The owners are **shareholders** who hold **shares** in the company. Shares are **not offered to the general public** – they are sold privately (e.g. to family, friends, or a few investors). The company must be **registered** (incorporated) and must have at least one director and one shareholder (exact rules vary by country). Shareholders have **limited liability**.

**Features**
- Separate legal entity – the company can own property, sue, and be sued in its own name.
- Limited liability – shareholders lose only what they have invested (or agreed to pay for shares).
- Shares are not traded on the stock exchange; transfer of shares may be restricted by the company’s rules.
- Must comply with company law (e.g. registration, filing annual returns, keeping accounts).

**Advantages**
- **Limited liability** – personal assets of shareholders are protected.
- **More capital** than sole trader or partnership – can invite more shareholders (within the private limit).
- **Continuity** – company continues even if a shareholder dies or sells shares.
- **Credibility** – “Pvt Ltd” or “(Pty) Ltd” may help with suppliers and banks.

**Disadvantages**
- **Legal formalities** – registration, annual returns, more paperwork.
- **Less privacy** – some information may be filed with the registrar.
- **Cannot raise capital from the public** by selling shares on the stock exchange.
- **Decision-making** – directors run the company; shareholders may have less day-to-day control.

**Examples (Zimbabwe)**: Many medium-sized businesses, family companies, and subsidiaries of larger groups are private limited companies.`,
      },
      {
        title: '5. Public Limited Company (PLC)',
        content: `**Definition**
A **company** whose **shares can be offered to the public** and **traded on a stock exchange**. It must have a minimum share capital (set by law), must publish annual reports and accounts, and is subject to strict rules to protect investors. Shareholders have **limited liability**. In Zimbabwe, the Zimbabwe Stock Exchange (ZSE) is where shares of listed public companies are traded.

**Features**
- Separate legal entity; limited liability for shareholders.
- Shares are **freely transferable** (on the stock exchange or otherwise).
- Must publish **annual reports** and **financial statements**.
- Run by **directors** elected by shareholders; ownership can be spread among many shareholders.

**Advantages**
- **Large capital** – can raise huge sums by selling shares to the public.
- **Limited liability** for shareholders.
- **Continuity** – company continues regardless of changes in shareholders.
- **Liquidity** – shareholders can sell shares on the stock exchange (if listed).

**Disadvantages**
- **Heavy regulation** – strict disclosure and governance requirements.
- **Cost** – expensive to list and to comply with stock exchange rules.
- **Loss of control** – original owners may hold a small fraction of shares after many issues.
- **Public scrutiny** – accounts and performance are public.

**Examples (Zimbabwe)**: Companies listed on the Zimbabwe Stock Exchange (ZSE) – e.g. in banking, manufacturing, retail – are public limited companies.`,
      },
      {
        title: '6. Choosing a Business Structure',
        content: `When choosing the form of business organisation, consider:

**Capital needed**
- **Sole trader / partnership**: Suited when capital needs are small; rely on owner(s) and loans.
- **Private limited**: Can bring in more shareholders (private) for medium capital.
- **Public limited**: For very large capital needs; can raise funds from the public via the stock exchange.

**Liability**
- If the owner(s) want **personal assets protected** from business debts, a **company** (Pvt Ltd or PLC) with limited liability is suitable.
- If the business is small and low-risk, sole trader or partnership may be acceptable despite unlimited liability.

**Control**
- **Sole trader**: Full control with one owner.
- **Partnership**: Shared control; need agreement on decisions.
- **Company**: Directors run the business; shareholders have a say through voting but may not run day-to-day operations.

**Legal requirements and costs**
- **Sole trader / partnership**: Fewer formalities; lower cost to start and run.
- **Company**: Registration, annual returns, possible audits; more cost and paperwork.

**Recommendation**
For a **small, low-risk** business (e.g. small shop, artisan), **sole trader** may be enough. For **shared skills and capital** with a few people, **partnership**. For **growth and limited liability**, **private limited**. For **very large scale and raising capital from the public**, **public limited** and listing on the stock exchange.`,
      },
    ],
    key_points: [
      'Sole trader: one owner, unlimited liability, full control, easy to start; personal assets at risk.',
      'Partnership: 2+ owners, usually unlimited liability, shared profit and control; more capital and skills than sole trader.',
      'Private limited (Pvt Ltd): separate legal entity, limited liability, shares not sold to public; more capital and continuity than sole/partnership.',
      'Public limited (PLC): shares can be sold to public and traded on stock exchange; limited liability; large capital but heavy regulation.',
      'Choice depends on capital needed, liability (limited vs unlimited), control, and legal/cost requirements.',
    ],
    exam_tips: [
      'For each type, state clearly: number of owners, liability (unlimited or limited), and how capital is raised.',
      'Always give at least two advantages and two disadvantages when asked to “compare” or “discuss” business types.',
      'Limited liability = only lose what you invested; unlimited liability = personal assets can be used to pay business debts.',
      'When recommending a structure, link your answer to the scenario: need for capital, risk, size, desire for control.',
      'Use correct terms: “sole trader”, “partnership”, “private limited company”, “public limited company”; mention ZSE for PLC in Zimbabwe.',
    ],
  },
  'Consumer Protection': {
    topic: 'Consumer Protection',
    subject: 'Commerce',
    summary: 'Consumer protection is about safeguarding buyers of goods and services from unfair or dangerous practices. Consumers often have less information and power than sellers, so laws and organisations exist to balance this. This topic covers: who a consumer is; the main consumer rights (safety, information, choice, to be heard, redress, and consumer education); consumer responsibilities; common forms of exploitation (overcharging, false advertising, substandard goods, short weights, adulteration); and the roles of key bodies in Zimbabwe – the Consumer Council of Zimbabwe (CCZ) and the Standards Association of Zimbabwe (SAZ). You need to state rights and responsibilities, explain how consumers can be exploited, and describe how CCZ and SAZ help protect consumers.',
    sections: [
      {
        title: '1. Who is a Consumer?',
        content: `A **consumer** is any person (or sometimes a business) who **buys or uses** goods or services for personal or household use – not for resale or for making other products. When you buy food, pay for transport, use electricity, or visit a doctor, you are a consumer.

**Why protection is needed**
- **Information gap**: Sellers often know more about the product than buyers; consumers can be misled.
- **Unequal power**: Large firms or monopolies can impose unfair terms or prices.
- **Safety**: Faulty or dangerous goods can cause injury or loss.
- **Fair dealing**: Consumers deserve honest weights, accurate labelling, and the right to complain and get redress.

Consumer protection helps to ensure **fair trading**, **safety**, and **redress** when things go wrong.`,
      },
      {
        title: '2. Consumer Rights',
        content: `Consumer rights are the entitlements that buyers should have when dealing with sellers. Common rights (as promoted by the UN and many countries, including Zimbabwe) include:

**Right to safety**
Protection against goods and services that are **dangerous** to life or health. Products should meet safety standards; hazardous goods should be clearly labelled or withdrawn.

**Right to information**
Consumers should receive **accurate** information about goods and services – what they contain, how to use them, expiry dates, prices, and terms. Labels and adverts should not mislead.

**Right to choice**
Where possible, consumers should have a **variety** of products and suppliers to choose from. Monopolies or cartels that remove choice can harm consumers.

**Right to be heard**
Consumers’ **views and complaints** should be taken seriously. There should be ways to complain to the seller and to independent bodies (e.g. CCZ).

**Right to redress**
If a product is faulty or a service is not as promised, consumers have the right to **compensation** – repair, replacement, or refund – according to the law and the terms of sale.

**Right to consumer education**
Consumers have the right to **learn** about their rights, how to compare products, how to complain, and how to manage money. This is often done through CCZ, schools, and the media.`,
      },
      {
        title: '3. Consumer Responsibilities',
        content: `With rights come **responsibilities**. Consumers are expected to:

- **Be informed**: Read labels, compare prices and quality, and ask questions before buying.
- **Use products safely**: Follow instructions and use goods for their intended purpose.
- **Complain fairly**: Report genuine problems to the seller or to CCZ; do not make false claims.
- **Pay for what they buy**: Honour contracts and pay debts.
- **Avoid waste**: Use resources responsibly (e.g. not damaging goods and then demanding a refund without cause).
- **Support fair trade**: Where possible, choose sellers who treat consumers and workers fairly.

Responsible behaviour helps markets work better and makes it easier for others to get redress when they are genuinely wronged.`,
      },
      {
        title: '4. Forms of Consumer Exploitation',
        content: `**Exploitation** means treating consumers unfairly or dishonestly. Common forms include:

**Overcharging**
Sellers charge **more than a fair or regulated price**, or hide extra charges. In times of shortage, some traders may charge very high prices (profiteering).

**False or misleading advertising**
Adverts **exaggerate** benefits, hide defects, or make claims that are not true. Consumers buy on the basis of wrong information and are cheated.

**Substandard or counterfeit goods**
Goods that are **below the stated or expected quality**, or **fake** (counterfeit) copies of branded products. They may be unsafe or break quickly.

**Short weight or measure**
Sellers give **less** than the stated weight or quantity – e.g. a “kilogram” that is only 900 g. This is illegal in most countries.

**Adulteration**
**Mixing** inferior or harmful substances into food or other products (e.g. adding water to milk, or harmful chemicals to food). This can endanger health.

**Expired or damaged goods**
Selling goods that are **past their expiry date** or already **damaged** without informing the buyer.

Consumers who experience these can **complain to the seller** first, then to the **Consumer Council of Zimbabwe (CCZ)** or other authorities. For product standards and certification, the **Standards Association of Zimbabwe (SAZ)** plays a key role.`,
      },
      {
        title: '5. Consumer Protection Organisations in Zimbabwe',
        content: `**Consumer Council of Zimbabwe (CCZ)**
A body that promotes and protects consumer interests in Zimbabwe.
- **Functions**: Handles **complaints** from consumers (e.g. faulty goods, poor service); conducts **consumer education** (rights, how to complain, budgeting); **monitors prices** and highlights overcharging or unfair practices; may lobby for better laws and policies.
- **What consumers can do**: Contact CCZ to report exploitation, get advice, or learn about their rights. CCZ may mediate between consumer and seller or refer matters to other authorities.

**Standards Association of Zimbabwe (SAZ)**
SAZ is the national standards body. It sets **technical standards** for products (quality, safety, dimensions) and runs **certification** schemes so that products that meet standards can carry a mark (e.g. SAZ certified).
- **Role in consumer protection**: When products are made and tested to SAZ standards, consumers have more assurance of **quality and safety**. SAZ does not handle individual complaints; it works with industry to improve standards. Government or regulators may require certain products to meet SAZ standards before they can be sold.

**Other possible bodies**
Depending on the syllabus, you may refer to **government ministries** (e.g. responsible for trade, health) that enforce laws on weights and measures, food safety, or fair trading; **courts** for legal redress; and **media** that expose bad practices and inform the public.`,
      },
    ],
    key_points: [
      'A consumer is anyone who buys or uses goods/services for personal or household use. Protection is needed due to information gaps and unequal power.',
      'Key rights: safety, information, choice, to be heard, redress, consumer education.',
      'Consumer responsibilities: be informed, use products safely, complain fairly, pay for purchases, avoid waste.',
      'Exploitation includes: overcharging, false advertising, substandard/counterfeit goods, short weights, adulteration, selling expired/damaged goods.',
      'CCZ: handles complaints, consumer education, price monitoring. SAZ: sets quality/safety standards and certifies products.',
    ],
    exam_tips: [
      'List at least four to six consumer rights and give a brief explanation of each (safety, information, choice, be heard, redress, education).',
      'Always mention both rights and responsibilities when the question asks about “consumers”.',
      'For “exploitation”, give examples: overcharging, false ads, substandard goods, short weight, adulteration – and say consumers can report to CCZ.',
      'Distinguish CCZ (complaints, education, price monitoring) from SAZ (standards and certification – not complaint handling).',
      'Use Zimbabwean context: CCZ and SAZ by name; examples like expired food, short weight at market, fake products.',
    ],
  },
  'Enterprise': {
    topic: 'Enterprise',
    subject: 'Commerce',
    summary: 'Enterprise is the willingness and ability to take risks and to organise resources to create and run a business. The person who does this is the entrepreneur. This topic covers: the role of the entrepreneur in combining the factors of production, innovating, and bearing risk and uncertainty; the qualities and skills of successful entrepreneurs; the four management functions – planning, organising, leading, and controlling; business plans and business ethics; and intellectual property (patents, trademarks, copyright) and why it matters for enterprise. Understanding enterprise helps explain how new businesses start, how they are managed, and how ideas and brands are protected.',
    sections: [
      {
        title: '1. What is Enterprise and Who is an Entrepreneur?',
        content: `**Enterprise** can mean two things: (1) the **activity** of starting and running a business – taking the initiative and risk; (2) a **business** or organisation itself (e.g. “a small enterprise”).

An **entrepreneur** is a person who **starts and runs** a business. He or she **identifies an opportunity** (a need or a gap in the market), **takes the risk** of investing time and money, and **organises** the factors of production – land, labour, and capital – to produce goods or services. Entrepreneurs are often seen as **innovators**: they introduce new products, new ways of doing things, or new markets.

**Why entrepreneurs matter**
- They **create jobs** – new businesses employ people.
- They **drive economic growth** – new ideas and competition can increase output and efficiency.
- They **bear uncertainty** – they take the risk that the business might fail; in return they hope for profit.`,
      },
      {
        title: '2. Role of the Entrepreneur',
        content: `The entrepreneur has several key roles:

**Combining the factors of production**
The entrepreneur **brings together** land (natural resources, premises), labour (workers), and capital (machinery, money) and **organises** them so that production takes place. Without this organising role, the factors would not automatically combine into a working business.

**Innovation**
Entrepreneurs often **introduce something new** – a new product, a new process, a new market, or a new way of organising. Innovation can give a business a competitive advantage and can benefit the economy.

**Risk-taking and bearing uncertainty**
Starting and running a business involves **risk**. The business might fail; demand might fall; costs might rise. The entrepreneur **bears this uncertainty** – they invest their own (or borrowed) money and time. If the business succeeds, they earn **profit**; if it fails, they may lose their investment. This risk-bearing is the fourth factor of production (entrepreneurship), and profit (or loss) is its reward.

**Decision-making**
The entrepreneur (or the management team in a large firm) makes **key decisions**: what to produce, how to produce it, where to sell, how to price, and how to respond to competition and change.`,
      },
      {
        title: '3. Entrepreneurial Qualities and Skills',
        content: `Successful entrepreneurs often show certain **qualities** and **skills**:

**Qualities**
- **Initiative** – willing to start something without waiting to be told.
- **Risk-taking** – prepared to invest and to accept the chance of failure.
- **Persistence** – not giving up when things are difficult.
- **Creativity / innovation** – able to think of new ideas or new ways to do things.
- **Self-confidence** – belief in their idea and their ability to make it work.
- **Leadership** – able to inspire and direct others.

**Skills**
- **Planning** – setting goals and working out how to achieve them.
- **Organising** – arranging resources, people, and tasks.
- **Financial management** – understanding costs, revenue, cash flow, and profit.
- **Communication** – dealing with customers, suppliers, and staff.
- **Problem-solving** – finding solutions when obstacles arise.

Not every entrepreneur has all of these, but a combination helps. Many of these can be learned or improved through education and experience.`,
      },
      {
        title: '4. The Four Management Functions',
        content: `Once a business is running, **management** is needed. The four main functions of management are:

**Planning**
**Setting objectives** and deciding **how** to achieve them. This includes: what to produce or sell; what targets to set (e.g. sales, profit); what resources are needed; and what steps to take. Planning can be short-term (e.g. this month) or long-term (e.g. five years). Without planning, the business may drift and waste resources.

**Organising**
**Allocating resources** and **arranging tasks and people** so that plans can be carried out. This includes: who does what (roles and responsibilities); how work is divided; how materials, equipment, and money are assigned; and how the structure of the business (departments, teams) is set up.

**Leading (or directing)**
**Motivating, guiding, and supervising** staff so that they work towards the business’s goals. Leading involves communication, delegation, and sometimes discipline. Good leadership helps employees understand what is expected and feel motivated to do their best.

**Controlling**
**Monitoring** performance (e.g. sales, costs, quality) and **correcting** when things go off track. Controlling means comparing actual results with plans, finding out why there are differences, and taking action (e.g. cut costs, improve quality, retrain staff) to get back on target.

These four – **planning, organising, leading, controlling** – are often called the **functions of management**. They apply to small businesses (where the owner does most of it) and to large firms (where professional managers are employed).`,
      },
      {
        title: '5. Business Plans and Business Ethics',
        content: `**Business plan**
A **business plan** is a written document that describes the business idea, its objectives, the market, the product or service, how it will be financed, and how it will be run. It is used to:
- **Clarify** the entrepreneur’s own thinking.
- **Persuade** banks or investors to lend or invest money.
- **Guide** the business in its first years.

A typical business plan includes: executive summary; description of the product/service; market analysis; marketing and sales strategy; operations (how the business will produce or deliver); management team; financial forecasts (sales, costs, profit, cash flow); and funding requirements.

**Business ethics**
**Business ethics** means acting in a **morally right** way in business – being honest, fair, and responsible. Examples: not cheating customers (e.g. false advertising, short weight); treating workers fairly (fair wages, safe conditions); paying taxes; not damaging the environment; and dealing honestly with suppliers and competitors. Ethical behaviour can build trust and a good reputation; unethical behaviour can lead to loss of customers, legal action, or fines.`,
      },
      {
        title: '6. Intellectual Property',
        content: `**Intellectual property (IP)** is the legal right to **own and protect** creations of the mind – inventions, designs, brands, and artistic or written work. Protecting IP encourages innovation and enterprise because creators and businesses know they can benefit from their ideas.

**Patent**
A **patent** protects a **new invention** – a product or process that is new, useful, and not obvious. The patent holder has the exclusive right to make, use, or sell the invention for a limited period (e.g. 20 years). Others cannot copy it without permission. Example: a new machine or a new drug.

**Trademark**
A **trademark** protects a **brand name**, logo, or symbol that identifies a business or its products. It stops others from using the same or a confusingly similar mark. Example: the name “EcoCash” or a company logo. Trademarks help consumers recognise and trust a brand.

**Copyright**
**Copyright** protects **original works** such as books, music, films, software, and artwork. The creator (or the person who owns the rights) has the exclusive right to reproduce, publish, or perform the work for a limited period. Others cannot copy it without permission. Example: a textbook, a song, or a computer program.

**Why it matters for enterprise**
Entrepreneurs who invent, create, or build brands can use patents, trademarks, and copyright to **protect** their ideas from being copied. This can make it easier to attract investment and to earn a return on innovation. Copying someone else’s IP without permission (piracy, counterfeiting) is illegal and can be punished by law.`,
      },
    ],
    key_points: [
      'Enterprise = taking the initiative and risk to start/run a business. Entrepreneur = person who does this; combines factors of production, innovates, bears uncertainty.',
      'Entrepreneur’s roles: combine land, labour, capital; innovate; take risk / bear uncertainty; make key decisions.',
      'Qualities: initiative, risk-taking, persistence, creativity, self-confidence, leadership. Skills: planning, organising, financial management, communication, problem-solving.',
      'Four management functions: Planning (objectives, how to achieve); Organising (resources, tasks, structure); Leading (motivating, guiding staff); Controlling (monitoring, correcting).',
      'Business plan: written document for the idea, market, finances, and operations; used to clarify, persuade lenders/investors, and guide the business. Business ethics: acting honestly and responsibly.',
      'Intellectual property: Patent (invention), Trademark (brand/logo), Copyright (books, music, software). Protects creators and encourages innovation.',
    ],
    exam_tips: [
      'When describing the entrepreneur’s role, mention combining factors of production, innovation, and risk-bearing (uncertainty), and link profit/loss to the reward for entrepreneurship.',
      'Learn the four management functions and a one-line explanation each: Planning, Organising, Leading, Controlling.',
      'For “qualities of an entrepreneur”, list at least four (e.g. initiative, risk-taking, persistence, creativity) and briefly say what each means.',
      'Business plan: state it is a written document and mention it is used for planning, for convincing banks/investors, and for guiding the business.',
      'Distinguish patent (invention), trademark (brand/logo), and copyright (creative works); say why IP protection matters for enterprise.',
    ],
  },
  'Finance and Banking': {
    topic: 'Finance and Banking',
    subject: 'Commerce',
    summary: 'Finance and banking cover the role of money, how people and businesses manage their finances, and how banks and other financial institutions work. This topic includes: the functions of money (medium of exchange, measure of value, store of value, standard of deferred payment); personal finance – budgeting, saving, and borrowing (overdrafts, loans, trade credit) and the basics of PAYE (Pay As You Earn) tax; the Reserve Bank of Zimbabwe (RBZ) as the central bank; commercial banks and their services (deposits, loans, transfers, ATMs); building societies and microfinance; and trends such as mobile money (EcoCash, OneMoney) and internet banking. You need to explain the role of the RBZ, the services offered by commercial banks, and how individuals and firms use the financial system.',
    sections: [
      {
        title: '1. What is Money and the Functions of Money',
        content: `**Money** is anything that is widely **accepted** as payment for goods and services and for settling debts. In modern economies, money is usually **currency** (notes and coins) issued by the central bank, plus **bank deposits** (balances in accounts that can be used for payments).

**Functions of money**

**Medium of exchange**
Money is used to **buy and sell** goods and services. Without money, we would need barter (swapping one good for another), which is inefficient because both sides must want what the other has. Money avoids this by being accepted by everyone.

**Measure of value (unit of account)**
Money is used to **state and compare** the value of different goods and services. Prices are given in money (e.g. dollars, Zimbabwe dollar), so we can compare the cost of one product with another.

**Store of value**
Money can be **kept** and used later. People can save money today and spend it in the future. (Inflation can reduce the real value of money over time, but money still acts as a store of value in the short term.)

**Standard of deferred payment**
Money is used to **settle debts** that are to be paid in the future. When you borrow or buy on credit, the amount to be repaid is stated in money.

These four functions – medium of exchange, measure of value, store of value, and standard of deferred payment – explain why money is essential in a modern economy.`,
      },
      {
        title: '2. Personal Finance: Budgeting, Saving, and Borrowing',
        content: `**Budgeting**
A **budget** is a plan of **income** and **spending** over a period (e.g. a month). By listing expected income (wages, allowances, other) and planned spending (rent, food, transport, etc.), a person can avoid overspending, plan for savings, and prepare for large future expenses. Good budgeting helps to avoid debt problems and to save for goals.

**Saving**
**Saving** means setting aside part of income instead of spending it. People save for emergencies, for large purchases (e.g. a car, education), or for retirement. Savings can be kept at home or (better) in a **bank** or other financial institution, where they may earn **interest** and are safer. Banks use deposits to lend to others, so saving in a bank also helps the economy.

**Borrowing**
**Borrowing** means getting money (or goods) now and promising to pay back later, usually with **interest**. Common forms:
- **Overdraft**: A bank allows an account holder to withdraw more than the balance, up to a limit; interest is charged on the amount overdrawn. Flexible but can be expensive if used for long periods.
- **Loan**: A fixed sum is borrowed and repaid in instalments over an agreed period. Used for larger purchases (e.g. car, education). Interest and terms are set in advance.
- **Trade credit**: A supplier allows a business (or sometimes a consumer) to buy now and pay later (e.g. “net 30 days”). No interest if paid on time; useful for managing cash flow.

Borrowing has **costs** (interest, fees) and **risks** (debt can grow if not repaid; assets may be seized if secured loans default). Responsible borrowing means only taking on debt that can be repaid.

**PAYE (Pay As You Earn)**
**PAYE** is a system of **income tax** where the employer **deducts** tax from an employee’s wages or salary each pay period and pays it to the tax authority (e.g. ZIMRA in Zimbabwe). The employee receives take-home pay after tax (and often after other deductions such as pension). PAYE spreads tax payment over the year and ensures the government collects tax as income is earned.`,
      },
      {
        title: '3. The Reserve Bank of Zimbabwe (RBZ)',
        content: `The **Reserve Bank of Zimbabwe (RBZ)** is Zimbabwe’s **central bank**. It does not serve the general public as a normal bank; it oversees the financial system and supports the government and commercial banks.

**Main functions of the RBZ**

**Issuing currency**
The RBZ has the sole right to **issue** the national currency (notes and coins). It controls how much money is in circulation and replaces worn or damaged notes.

**Banker to the government**
The government keeps its accounts with the RBZ. The RBZ receives government revenue, makes payments on behalf of the government, and may lend to the government (within legal limits). It also manages the country’s **foreign reserves** (foreign currency and gold held by the country).

**Banker to the banks**
Commercial banks hold accounts with the RBZ. The RBZ can lend to banks (as lender of last resort), supervise them, and require them to hold a certain proportion of their deposits as **reserves** at the RBZ.

**Monetary policy**
The RBZ helps to implement **monetary policy** – influencing the supply of money and the cost of borrowing (interest rates) in the economy. This can affect inflation, exchange rates, and economic activity. Tools may include interest rates, reserve requirements, and open market operations.

**Regulation and supervision**
The RBZ **regulates and supervises** banks and other financial institutions to ensure they are safe and sound and to protect depositors.`,
      },
      {
        title: '4. Commercial Banks',
        content: `**Commercial banks** are banks that serve **individuals and businesses** – they take deposits, lend money, and provide payment and other services. In Zimbabwe, examples include CBZ Bank, Stanbic Bank, FBC Bank, Standard Chartered, and others.

**Services offered by commercial banks**

**Deposits**
- **Current (cheque) accounts**: For everyday transactions; may pay little or no interest; often allow overdrafts.
- **Savings accounts**: For saving; usually pay interest; may have limits on withdrawals.
- **Fixed or term deposits**: Money is locked away for a set period; usually higher interest; withdrawal before maturity may attract a penalty.

**Lending**
- **Overdrafts**: Short-term borrowing linked to an account, up to a limit.
- **Loans**: Personal loans, business loans, vehicle loans, etc.; repaid in instalments with interest.
- **Mortgages**: Long-term loans for buying property; the property is usually security for the loan.

**Payment services**
- **Transfers**: Moving money between accounts (within the bank or to other banks). **RTGS** (Real Time Gross Settlement) allows large or urgent transfers, often same-day.
- **Cheques**: Written orders to the bank to pay a stated sum to a named person or business.
- **ATMs**: Automated Teller Machines for withdrawing cash and sometimes for deposits and other services.
- **Card payments**: Debit cards (take money from the account) and credit cards (borrow from the bank up to a limit) for purchases and withdrawals.

**Other services**
- **Safe custody**: Keeping valuables in safe deposit boxes.
- **Foreign exchange**: Buying and selling foreign currency.
- **Advice**: Investment, business, or trade finance advice (especially for business customers).

Banks earn income mainly from **interest** on loans (and from fees); they pay **interest** on deposits and use the difference (and fees) to cover costs and make profit.`,
      },
      {
        title: '5. Other Financial Institutions',
        content: `**Building societies**
**Building societies** (or similar institutions) specialise in **mortgages** – long-term loans for buying or building property. They take savings from the public and lend mainly for housing. In Zimbabwe, building societies have historically played a role in housing finance. They may offer savings accounts and mortgage products.

**Microfinance institutions**
**Microfinance** provides **small loans**, savings, and other financial services to people who often have little or no access to commercial banks (e.g. small-scale farmers, informal traders, low-income households). Loans may be small, short-term, and sometimes group-based. Microfinance helps with working capital, small business start-up, or emergency needs. Interest rates may be higher than banks because of higher costs and risk. In Zimbabwe, various microfinance institutions and NGOs offer microfinance services.`,
      },
      {
        title: '6. Trends: Mobile Money and Digital Banking',
        content: `**Mobile money**
**Mobile money** allows people to store value on a **mobile phone** and to send money, pay bills, and sometimes save or borrow, without needing a traditional bank account. In Zimbabwe, **EcoCash** (Econet) and **OneMoney** (NetOne) are widely used. Users can:
- **Send and receive** money to other users (person to person).
- **Pay bills** (e.g. electricity, water, school fees).
- **Pay for goods and services** at shops and vendors.
- **Cash in and out** at agents (e.g. shops, kiosks) that convert mobile money to cash and vice versa.

Mobile money has greatly increased **financial inclusion** – many people who do not have a bank account can still make electronic payments and save or borrow through mobile platforms.

**Internet and digital banking**
**Internet banking** (and banking apps) allow customers to manage their accounts, transfer money, pay bills, and sometimes apply for loans or cards **online** using a computer or smartphone. This is convenient and reduces the need to visit a branch. Banks also use **SMS**, **USSD**, and **ATMs** to offer services. These trends make banking faster and more accessible but require attention to **security** (e.g. passwords, avoiding fraud).`,
      },
    ],
    key_points: [
      'Money has four functions: medium of exchange, measure of value, store of value, standard of deferred payment.',
      'Personal finance: budget (plan income and spending); save (in banks for safety and interest); borrow (overdraft, loan, trade credit) – know costs and risks. PAYE = tax deducted by employer from wages.',
      'RBZ = central bank: issues currency, banker to government, banker to banks, monetary policy, regulation of financial institutions.',
      'Commercial banks: take deposits (current, savings, fixed); lend (overdraft, loans, mortgages); offer payments (transfers, RTGS, cheques, ATMs, cards).',
      'Building societies: specialise in mortgages. Microfinance: small loans and savings for those with limited access to banks.',
      'Mobile money (EcoCash, OneMoney): send money, pay bills, pay at shops, cash in/out at agents. Internet banking: manage accounts and pay online.',
    ],
    exam_tips: [
      'List and briefly explain all four functions of money – medium of exchange, measure of value, store of value, standard of deferred payment.',
      'For RBZ, state it is the central bank and give at least four functions: issue currency, banker to government, banker to banks, monetary policy, regulation.',
      'For commercial banks, name services under deposits, lending, and payments (e.g. current account, loans, RTGS, ATMs, cards).',
      'Distinguish RBZ (central bank – does not serve general public) from commercial banks (serve individuals and businesses).',
      'Use Zimbabwe examples: RBZ, CBZ/Stanbic/FBC, EcoCash, OneMoney, ZIMRA for PAYE.',
    ],
  },
  'Insurance and Assurance': {
    topic: 'Insurance and Assurance',
    subject: 'Commerce',
    summary: 'Insurance and assurance are ways of managing risk by transferring it to a company in exchange for a premium. Insurance covers uncertain events (fire, theft, accident) that may or may not happen; assurance (life assurance) covers an event that is certain to happen (death) but the timing is unknown. This topic covers: the difference between insurance and assurance; key principles (utmost good faith, insurable interest, indemnity, proximate cause); types of insurance (fire, motor, marine, burglary, etc.); types of life assurance (whole life, term, endowment); how policies and claims work; and communal or traditional risk-sharing systems in Zimbabwe (e.g. burial societies, mukando, Zunde raMambo). You need to explain the principles, classify types, and give examples.',
    sections: [
      {
        title: '1. What is Insurance and Assurance?',
        content: `**Insurance** and **assurance** are both contracts where one party (the **insurer** – usually an insurance company) agrees to pay money or provide a benefit if a specified event happens, in return for **premiums** paid by the other party (the **policyholder** or **insured**). They help people and businesses to **manage risk** – instead of bearing the full loss alone, they transfer part of the risk to the insurer.

**Insurance**
**Insurance** covers **uncertain** events – things that **may or may not** happen. Examples: a fire may or may not destroy a building; a car may or may not be stolen or damaged; a ship may or may not be lost at sea. The policyholder pays a premium; if the event happens (the **claim** is valid), the insurer pays compensation. If it does not happen, the premium is the cost of having had protection.

**Assurance (life assurance)**
**Assurance** (in the traditional sense) often refers to **life assurance** – covering an event that is **certain** to happen (everyone dies) but the **timing** is uncertain. The policy pays out on the death (or sometimes serious illness) of the insured person, or at a fixed date if the person is still alive (e.g. endowment). So “assurance” = the event will occur; “insurance” = the event might occur. In everyday language, “life insurance” is also used for life assurance.

**Why people use insurance and assurance**
- **Peace of mind** – financial loss from fire, theft, accident, or death is partly covered.
- **Protection for dependants** – life assurance can provide for family after the breadwinner’s death.
- **Legal or contractual requirement** – e.g. motor insurance is often compulsory.
- **Business continuity** – firms insure assets and liability so that a single event does not ruin the business.`,
      },
      {
        title: '2. Key Principles of Insurance',
        content: `Insurance contracts are based on several important **principles**:

**Utmost good faith (uberrima fides)**
Both the insurer and the insured must act in **good faith** – they must tell the truth and not hide important facts. The insured must disclose everything that could affect the insurer’s decision (e.g. previous claims, dangerous activities). If the insured hides or misrepresents something important, the insurer may refuse to pay a claim or may cancel the policy.

**Insurable interest**
The insured must have an **insurable interest** in what is being insured – they must stand to **lose financially** if the event happens. You can insure your own car (you own it) or your own life (your family depends on you); you cannot normally insure a stranger’s car or life purely to profit from a claim. Insurable interest must exist **at the time of taking out the policy** and usually (for non-life) **at the time of the loss**.

**Indemnity**
For most types of **insurance** (not life assurance), the principle of **indemnity** applies: the insured should be **put back in the same financial position** as before the loss – no more, no less. So the payout should not exceed the actual loss. This prevents people from making a profit from insurance (e.g. over-insuring and then causing or exaggerating a loss). **Life assurance** is not strictly one of indemnity – the sum assured is agreed in advance because you cannot put a precise financial value on a life.

**Proximate cause**
The insurer only pays if the loss was **caused** by the event covered by the policy. **Proximate cause** means the main or dominant cause of the loss. If the policy covers fire and the building is destroyed by fire, the claim is valid; if it is destroyed by flood and the policy does not cover flood, the claim is not valid. Disputes can arise when several causes contribute – the courts or policy terms decide which cause is “proximate”.`,
      },
      {
        title: '3. Types of Insurance (General Insurance)',
        content: `**Fire insurance**
Covers loss or damage to property caused by **fire** (and sometimes lightning, explosion). Businesses and homeowners often take fire insurance for buildings and contents. The sum insured and the premium depend on the value of the property and the risk.

**Motor insurance**
Covers **vehicles** against accident, theft, or damage. Often split into **third party** (covers damage or injury to others caused by the insured vehicle – often compulsory) and **comprehensive** (covers the insured’s own vehicle as well). Premiums may depend on the driver’s age, record, and the type of vehicle.

**Marine insurance**
Covers **ships, cargo, and related interests** against loss or damage at sea (e.g. sinking, piracy, storm). Important for importers, exporters, and shipping companies. Can cover the vessel (hull), the cargo, or freight (payment for carriage).

**Burglary / theft insurance**
Covers loss of or damage to property due to **burglary** (breaking and entering) or **theft**. Often taken by businesses and sometimes by households. May have conditions (e.g. locks, alarms).

**Other types**
- **Employers’ liability** – covers the employer if an employee is injured or becomes ill because of work.
- **Public liability** – covers the insured if a member of the public is injured or their property damaged because of the insured’s business or premises.
- **Travel insurance** – covers medical emergencies, cancellation, or lost baggage when travelling.
- **Crop or livestock insurance** – covers farmers against loss of crops or animals due to weather, disease, etc.`,
      },
      {
        title: '4. Types of Life Assurance',
        content: `**Whole life assurance**
The policy runs for the **whole of the insured’s life**. A **sum assured** is paid out when the person **dies** (to the beneficiaries named in the policy). Premiums may be paid for a limited period or for life. No payout if the policy is surrendered early unless the policy has a surrender value. Used mainly for **protection** – to provide for dependants after death.

**Term assurance**
Cover is for a **fixed period** (term), e.g. 10 or 20 years. If the insured **dies during the term**, the sum assured is paid to the beneficiaries. If the person survives to the end of the term, **nothing** is paid (no maturity value). Premiums are usually lower than whole life because there may be no payout. Used for **temporary** protection (e.g. covering a mortgage or providing for children until they are independent).

**Endowment assurance**
The policy runs for a **fixed term**. If the insured **dies during the term**, the sum assured is paid. If the insured **survives to the end** of the term, a **maturity value** (often the sum assured) is paid to the policyholder. So there is always a payout – either on death or at maturity. Premiums are higher than term assurance. Used for **savings with protection** – e.g. saving for a child’s education or for retirement, with life cover in the meantime.`,
      },
      {
        title: '5. How Insurance Works: Premium, Policy, Claim',
        content: `**Premium**
The **premium** is the amount the policyholder pays to the insurer (monthly, yearly, or as a single payment). The insurer uses premiums to pay claims, cover expenses, and make a profit. Premiums are set based on **risk** – the higher the chance of a claim and the larger the potential payout, the higher the premium. Factors include: type of cover, value insured, age (for life), health (for life), past claims, and location (e.g. for fire or theft).

**Policy**
The **policy** is the **contract** between the insurer and the insured. It states: what is covered; what is excluded; the sum insured or sum assured; the premium and when it is paid; the period of cover; and the duties of both sides (e.g. to disclose information, to pay premiums, to notify claims). The insured receives a **policy document** as proof of cover.

**Claim**
When the **insured event** happens, the policyholder (or beneficiary) makes a **claim** – they inform the insurer and ask for payment. The insurer will check that the claim is valid (event covered, policy in force, no fraud or breach of conditions) and may send an assessor to verify the loss. If the claim is accepted, the insurer pays the agreed amount (or the actual loss, if indemnity applies and the loss is less than the sum insured). If the claim is rejected, the insurer must give reasons (e.g. exclusion, non-disclosure).`,
      },
      {
        title: '6. Communal and Traditional Risk-Sharing (Zimbabwe)',
        content: `Besides formal insurance and assurance, many people in Zimbabwe and elsewhere use **communal or traditional** ways of sharing risk and helping each other in times of need. These are not the same as commercial insurance but serve similar purposes – **pooling resources** and **spreading risk**.

**Burial societies**
**Burial societies** (or funeral societies) are groups where members pay regular **contributions** into a common fund. When a **member or a designated family member dies**, the society pays for or contributes to **funeral costs** and sometimes gives support to the family. This reduces the financial shock of a death. Membership is often based on community, workplace, or church.

**Mukando (rounds / rotating savings)**
**Mukando** is a group where members contribute a fixed amount regularly (e.g. each month). Each time, the **whole pool** goes to one member in turn (by rotation or agreement). So everyone saves regularly, and each gets a lump sum when their turn comes. It is a form of **saving and credit**, not strictly insurance, but it helps people manage money and cope with large one-off needs (e.g. school fees, a funeral, a business expense).

**Zunde raMambo**
**Zunde raMambo** (or similar community grain or food reserves) is a traditional practice where the community (often under a chief or leader) **grows and stores grain** collectively. In times of **drought or shortage**, the stored grain is used to feed the needy. It is a form of **community insurance** against crop failure or food insecurity.

These systems show that **risk-sharing** and **mutual support** have long existed alongside or instead of formal insurance, especially where access to insurance is limited or where culture favours community-based arrangements.`,
      },
    ],
    key_points: [
      'Insurance = cover for uncertain events (fire, theft, accident); Assurance (life) = cover for certain event (death) but uncertain timing.',
      'Principles: utmost good faith (disclose all relevant facts); insurable interest (must stand to lose); indemnity (restore to same position, mainly non-life); proximate cause (loss must be caused by insured event).',
      'Types of insurance: fire, motor, marine, burglary, liability, travel, crop. Types of life assurance: whole life (payout on death), term (payout only if death in term), endowment (payout on death or at maturity).',
      'Premium = payment for cover; policy = contract (what is covered, sum insured, exclusions); claim = request for payment when event occurs.',
      'Communal systems: burial societies (funeral costs); mukando (rotating savings); Zunde raMambo (community grain reserve for food security).',
    ],
    exam_tips: [
      'Always distinguish insurance (uncertain events – may or may not happen) from assurance (life – death is certain, timing uncertain).',
      'Learn the four principles and one-line meaning each: utmost good faith, insurable interest, indemnity, proximate cause.',
      'For types, give at least two examples of general insurance (e.g. fire, motor) and two of life assurance (e.g. whole life, term, endowment).',
      'Indemnity applies to general insurance (no profit from claim); life assurance has an agreed sum assured, not strict indemnity.',
      'When asked about traditional/communal, name burial societies, mukando, and Zunde raMambo and state briefly what each does.',
    ],
  },
  'Business Communication': {
    topic: 'Business Communication',
    subject: 'Commerce',
    summary: 'Business communication is the exchange of information between people inside and outside an organisation so that decisions can be made, work can be done, and relationships can be maintained. This topic covers: the communication process (sender, message, medium, receiver, feedback); barriers to effective communication and how to reduce them; formal and informal communication and the grapevine; telecommunication in Zimbabwe (TelOne for landline; Econet, NetOne, Telecel for mobile); postal services (ZimPost, registered mail, EMS); and modern trends (email, video conferencing, WhatsApp Business). You need to explain the process, identify barriers, and describe the role of different communication channels and service providers.',
    sections: [
      {
        title: '1. What is Business Communication and Why It Matters',
        content: `**Business communication** is the **sending and receiving** of information within and between businesses, and between businesses and customers, suppliers, and other stakeholders. It can be **oral** (meetings, phone calls), **written** (letters, reports, emails), or **visual** (charts, videos). It can be **internal** (between staff and departments) or **external** (with customers, suppliers, government).

**Why it matters**
- **Coordination**: People need to know what to do, when, and how – communication coordinates work.
- **Decision-making**: Managers need accurate and timely information to make good decisions.
- **Customer relations**: Clear communication with customers builds trust and helps sell and support products.
- **Supplier and partner relations**: Orders, contracts, and delivery details depend on reliable communication.
- **Record and evidence**: Written communication (letters, emails, contracts) provides a record for future reference and for resolving disputes.

Poor communication leads to mistakes, delays, conflict, and lost business; good communication improves efficiency and relationships.`,
      },
      {
        title: '2. The Communication Process',
        content: `Communication can be described as a **process** with these elements:

**Sender**
The person or organisation that **originates** the message – the one who wants to pass on information, an instruction, or a request. The sender must decide what to say and how to encode it (in words, numbers, or symbols) so that the receiver can understand.

**Message**
The **information** or **content** being sent – the idea, instruction, question, or feedback. The message should be clear, complete, and appropriate for the receiver.

**Medium (channel)**
The **method or channel** used to carry the message – e.g. face-to-face talk, telephone, letter, email, report, notice board, video call. The choice of medium affects speed, cost, and whether there is a written record.

**Receiver**
The person or group for whom the message is **intended**. The receiver must be able to receive the message (e.g. have access to the phone or email) and **decode** it – interpret the words or symbols correctly.

**Feedback**
The **response** from the receiver back to the sender – e.g. a reply, a nod, a question, or an action. Feedback shows whether the message was received and understood. Without feedback, the sender may not know if communication succeeded.

**Process in order**: Sender → encodes message → sends via medium → Receiver receives and decodes → may send feedback → Sender receives feedback. **Noise** (see barriers) can disturb the message at any stage.`,
      },
      {
        title: '3. Barriers to Communication',
        content: `**Barriers** are things that **block or distort** communication so that the message is not received or is misunderstood. Common barriers include:

**Language**
Different languages, or different levels of fluency, can prevent understanding. Jargon (technical terms) may confuse people outside the field. **Reduction**: Use simple language; use an interpreter or translate when necessary; explain technical terms.

**Noise**
**Physical noise** (traffic, machinery, other people talking) can make it hard to hear. **“Noise”** can also mean distractions, poor signal (in phone or internet), or too much information at once. **Reduction**: Choose a quiet place; use a clear channel; repeat or summarise important points.

**Distance**
When sender and receiver are in different places, they rely on technology or written messages. Delays, cost, or lack of access to a medium can be barriers. **Reduction**: Use appropriate technology (phone, email, video call); ensure both sides have access.

**Wrong or unsuitable medium**
Some messages need face-to-face discussion (e.g. sensitive or complex topics); others are fine by email. Using the wrong medium (e.g. email for urgent or emotional matters) can cause misunderstanding. **Reduction**: Match the medium to the message and the receiver.

**Prejudice, attitude, or lack of trust**
If the receiver distrusts the sender or is not willing to listen, the message may be ignored or misinterpreted. **Reduction**: Build trust; be respectful and clear; encourage feedback.

**Information overload**
Too much information at once can overwhelm the receiver; important points get lost. **Reduction**: Be concise; prioritise; use headings and lists.`,
      },
      {
        title: '4. Formal, Informal, and Grapevine Communication',
        content: `**Formal communication**
Communication that follows the **official structure** of the organisation – e.g. reports to a manager, memos from head office, notices on the board, official letters to customers. It is usually **planned**, **recorded**, and follows **rules** (who reports to whom, what format to use). Used for instructions, policies, and official records.

**Informal communication**
Communication that is **not** part of the official structure – e.g. chat between colleagues, quick questions in the corridor, social conversation. It is **faster** and **more flexible** but may be **incomplete** or **inaccurate** and is often not recorded. It can support teamwork and spread news quickly, but rumours can also spread this way.

**Grapevine**
The **grapevine** is the **informal network** of communication – rumours and gossip that spread from person to person without going through official channels. It can spread **fast** and reach many people, but the message often gets **distorted** or **exaggerated**. Managers cannot usually stop the grapevine but can reduce harm by giving **accurate official information** promptly so that rumours are less likely to fill the gap.`,
      },
      {
        title: '5. Telecommunication in Zimbabwe',
        content: `**Telecommunication** means **communication over distance** using technology – voice, data, and video.

**Landline (fixed line)**
**TelOne** is Zimbabwe’s main provider of **fixed-line** telephone services (landlines). Landlines use cables and are typically used in homes, offices, and institutions. They can be used for voice calls and, with the right equipment, for internet (e.g. ADSL). Landlines are generally reliable and can be used for fax and for security alarms.

**Mobile networks**
Mobile (cellular) networks allow **wireless** voice and data communication using mobile phones and SIM cards. In Zimbabwe, the main mobile network operators include:
- **Econet Wireless** – one of the largest; offers voice, data, and mobile money (EcoCash).
- **NetOne** – state-linked operator; offers OneMoney (mobile money) and other services.
- **Telecel** – another mobile operator.

Mobile services include: voice calls, SMS (text), data (internet), and mobile money. Coverage and quality vary by area. Businesses use mobile for quick contact with staff, customers, and suppliers; for marketing (SMS, USSD); and for payments (EcoCash, OneMoney).

**Choosing telecommunication**
Factors include: **cost** (calls, data, line rental); **coverage** (whether the area has signal); **speed and reliability** (for data and video); **need for a written record** (email or letter may be better than a phone call for contracts or complaints).`,
      },
      {
        title: '6. Postal Services',
        content: `**Postal services** involve the **physical collection, transport, and delivery** of letters, parcels, and documents. In Zimbabwe, **ZimPost** (Zimbabwe Posts) is the main national postal operator.

**Ordinary mail**
Letters and small parcels are collected from post offices or post boxes, sorted, and delivered to addresses. **Cheap** but can be **slow** and sometimes **lost**. Suitable for non-urgent, low-value items.

**Registered mail**
The item is **recorded** at each stage; the sender gets proof of posting and the receiver may sign on delivery. **More secure** than ordinary mail; useful for important documents (e.g. certificates, contracts). Slightly more expensive and may take a similar time.

**EMS (Express Mail Service)**
**Faster** delivery – often prioritised and tracked. Used for **urgent** documents or small parcels. **More expensive** than ordinary or registered mail. ZimPost and other operators may offer express or courier-style services.

**Role in business**
Businesses use post for: sending **invoices**, **statements**, and **contracts**; receiving **orders** and **payments** (e.g. cheques); and dispatching **small goods**. Where speed and proof of delivery matter, **courier** firms (private) or **registered/express** post are used instead of ordinary mail.`,
      },
      {
        title: '7. Modern Trends in Business Communication',
        content: `**Email**
**Email** allows **written** messages to be sent **instantly** to one or many people. It provides a **record** and allows **attachments** (documents, images). Used for orders, confirmations, reports, and day-to-day coordination. Drawbacks: overload, spam, and risk of misunderstanding tone. **Professional** use: clear subject lines, concise text, appropriate tone.

**Video conferencing**
**Video conferencing** (e.g. Zoom, Microsoft Teams, Google Meet) allows **face-to-face** meetings **online** with people in different places. Useful for meetings, training, and interviews when people cannot meet in person. Requires good internet and a device with camera and microphone.

**WhatsApp Business and social media**
**WhatsApp Business** and similar apps let businesses **chat** with customers, send updates, and sometimes take orders. **Social media** (Facebook, Instagram, Twitter/X) are used for **marketing**, **customer service**, and **brand building**. Communication is **informal** and **fast** but may need to be backed by formal records (e.g. contracts) for important agreements.

**Choosing the right method**
Consider: **urgency** (phone or instant message for urgent; email or post for less urgent); **need for record** (written for proof); **complexity** (face-to-face or video for difficult discussions); **cost** (post vs email; local vs international call).`,
      },
    ],
    key_points: [
      'Business communication = exchange of information for coordination, decisions, and relationships. Internal (within firm) and external (customers, suppliers).',
      'Process: Sender → Message → Medium → Receiver → Feedback. Noise and other barriers can distort or block the message.',
      'Barriers: language, noise, distance, wrong medium, prejudice, information overload. Reduce by clear language, right channel, feedback, and trust.',
      'Formal = official, recorded; Informal = unofficial, flexible. Grapevine = rumours through informal network; counter with timely accurate information.',
      'Telecommunication: TelOne (landline); Econet, NetOne, Telecel (mobile). Postal: ZimPost – ordinary, registered, EMS. Trends: email, video conferencing, WhatsApp Business.',
    ],
    exam_tips: [
      'Draw or describe the communication process with all five elements: sender, message, medium, receiver, feedback.',
      'For barriers, name at least three (e.g. language, noise, distance) and suggest one way to reduce each.',
      'Distinguish formal communication (official channels, records) from informal and grapevine (unofficial, can be fast but distorted).',
      'Name Zimbabwean providers: TelOne (landline), Econet/NetOne/Telecel (mobile), ZimPost (postal). Say one use of each.',
      'When recommending a communication method, consider: speed, cost, need for a record, and whether the receiver has access.',
    ],
  },
  'Warehousing': {
    topic: 'Warehousing',
    subject: 'Commerce',
    summary: 'Warehousing is the storage of goods between production and sale or use. It helps businesses manage stock, smooth out supply and demand, and prepare goods for distribution. This topic covers: the functions of warehousing (storage, breaking bulk, blending, and the use of warehouse receipts for finance); types of warehouses (private, public, bonded, cold storage); factors affecting the location of warehouses; and traditional or indigenous storage methods in Zimbabwe (e.g. dura/isiphala, underground pits). You need to explain why warehousing is needed, classify warehouse types, and describe how each type is used.',
    sections: [
      {
        title: '1. Why Warehousing is Needed',
        content: `**Warehousing** means **storing** goods in a **building or facility** (a **warehouse**) until they are needed for sale, distribution, or use. It is a key part of the **distribution** chain because:

- **Production and consumption are often not at the same time** – e.g. crops are harvested once or twice a year but consumed all year; goods are made in batches but sold gradually. Warehousing **bridges the time gap**.
- **Production and consumption are often in different places** – goods may be made in one town and sold in many; they need to be **stored** near markets or at points along the transport route.
- **Businesses need **buffer stock** – to avoid running out when demand is high or supply is delayed; to buy in bulk when prices are low and store for later.

Without warehousing, businesses would have to match production exactly to immediate demand and deliver everything at once, which is usually impossible or very costly. Warehousing adds **time utility** (goods available when needed) and **place utility** (goods available where needed).`,
      },
      {
        title: '2. Functions of Warehousing',
        content: `**Storage**
The main function is to **hold** goods safely and securely until they are required. This protects goods from weather, theft, and damage and allows businesses to keep **stock** (inventory) to meet future demand.

**Breaking bulk**
Goods often arrive at the warehouse in **large quantities** (e.g. a full truck or container). The warehouse **breaks bulk** – it holds the stock and **releases it in smaller quantities** to retailers or customers as needed. So the producer or importer sells in bulk; the warehouse enables smaller buyers to get the quantities they need.

**Blending and packing**
Some warehouses **blend** or **assemble** goods – e.g. mixing different grades of grain, or putting together orders from different products (e.g. a variety pack). They may also **repack** – putting bulk goods into smaller packets or labels for different customers. This adds value and prepares goods for the next stage of distribution.

**Warehouse receipts and finance**
A **warehouse receipt** is a **document** that proves goods are stored in a named warehouse. The owner of the goods can use this receipt as **collateral** to borrow money from a bank – the bank knows the goods exist and can be sold if the loan is not repaid. So warehousing supports **trade finance** and helps businesses access credit.`,
      },
      {
        title: '3. Types of Warehouses',
        content: `**Private warehouses**
**Owned or leased by a single business** (manufacturer, wholesaler, or large retailer) for **its own** storage needs. The business has full control over layout, security, and use. Examples: a beverage company’s depot, a supermarket chain’s distribution centre. **Advantage**: tailored to the firm’s needs. **Disadvantage**: high cost if storage needs vary (empty space in quiet periods).

**Public warehouses**
**Run by a separate company** that offers storage **to any business** (or individual) in return for a **fee**. Users rent space as needed; the warehouse operator manages the building and often handling. **Advantage**: flexible – pay only for space used; no need to build or own. **Disadvantage**: less control; may be shared with other firms’ goods. Useful for **small businesses** or firms with **seasonal** or variable stock.

**Bonded warehouses**
**Approved by customs** for storing **imported goods** on which **duty (tax) has not yet been paid**. Goods can be brought into the country and stored in the bonded warehouse; duty is paid only when the goods are **removed** for sale or use. This helps importers manage cash flow and allows goods to be re-exported without ever paying local duty. **Strictly controlled** – customs supervises the warehouse.

**Cold storage warehouses**
**Refrigerated** or **frozen** storage for **perishable** goods – e.g. fruit, vegetables, meat, fish, dairy, medicines. Temperature and sometimes humidity are controlled to slow decay. Essential for **food supply chains** and for **export** of fresh produce. **Cost** is higher than ordinary storage because of refrigeration.`,
      },
      {
        title: '4. Location of Warehouses',
        content: `Where a warehouse is **sited** affects cost, speed of delivery, and security. Important **factors**:

**Nearness to market**
Warehouses are often located **close to customers** or to **main distribution routes** so that delivery is fast and transport cost is low. E.g. a depot on the outskirts of a city can serve many retail outlets in that city.

**Transport links**
Good **access to road** (and sometimes **rail** or **port**) so that goods can be brought in and sent out easily. A site on a main highway or near a railway siding is often chosen.

**Cost of land**
Land in city centres is expensive; many warehouses are on **cheaper** land on the edge of towns or in industrial areas, as long as transport access is still good.

**Security**
The area should be **safe** from theft, fire, and flood. Security (fencing, guards, alarms) is easier and cheaper in a controlled industrial zone than in a remote or high-crime area.

**Labour**
Enough **workers** (for loading, packing, handling) should be available nearby.`,
      },
      {
        title: '5. Traditional and Indigenous Storage (Zimbabwe)',
        content: `Besides modern warehouses, many people in Zimbabwe and the region use **traditional** or **indigenous** methods to store goods, especially **grain** and **food**:

**Dura / Isiphala (granary)**
A **granary** is a structure (often raised off the ground) used to store **grain** (maize, sorghum, millet) after harvest. It protects grain from **moisture**, **pests**, and **animals**. Traditional granaries may be made from local materials (e.g. mud, thatch, wood). They allow families or communities to **store surplus** for use until the next harvest and to **smooth** food supply through the year.

**Underground pits**
**Pits** dug in the ground, sometimes lined and covered, used to store grain or other produce. The earth provides **insulation** and some **protection** from pests. Used in various cultures for **long-term** storage. Must be kept **dry** to avoid mould.

**Other**
- **Silos** (modern or traditional) for bulk grain at household or community level.
- **Smoking, drying, or salting** of food to preserve it (a form of “storage” by reducing spoilage).

These methods show that **storage** has always been part of farming and trade; modern warehousing extends the same idea with larger scale, better technology, and services like warehouse receipts and cold storage.`,
      },
    ],
    key_points: [
      'Warehousing = storage of goods between production and sale; bridges time and place gaps; enables buffer stock.',
      'Functions: storage (hold goods safely); breaking bulk (large in, small out); blending/packing (add value); warehouse receipts (collateral for loans).',
      'Private = owned by one business for own use. Public = hire space to any business. Bonded = customs-approved for imported goods before duty. Cold storage = refrigerated for perishables.',
      'Location factors: near market, good transport, land cost, security, labour.',
      'Traditional: dura/granary, underground pits for grain; preserve food for the year.',
    ],
    exam_tips: [
      'List and briefly explain the main functions of warehousing: storage, breaking bulk, blending, and warehouse receipts.',
      'When asked to “classify” or “types”, name private, public, bonded, and cold storage and say who uses each (e.g. bonded = importers before paying duty).',
      'For “why is warehousing important?”, mention time gap, place gap, buffer stock, and breaking bulk.',
      'Location: mention at least three factors (e.g. near market, transport, security).',
      'For indigenous/traditional storage, name dura/granary and underground pits and say they store grain for use through the year.',
    ],
  },
  'Marketing': {
    topic: 'Marketing',
    subject: 'Commerce',
    summary: 'Marketing is the process of identifying customer needs and satisfying them profitably through the right product, price, place, and promotion. This topic covers: marketing concepts (production, product, selling, marketing, societal orientation); types of markets (physical and virtual, including e-commerce); market segmentation (demographic, geographic, psychographic); the marketing mix – the 4Ps (Product, Price, Place, Promotion); branding and packaging; advertising – purposes, media, and ethics; and sales promotion. You need to define marketing, apply the 4Ps to scenarios, explain segmentation and advertising, and use Zimbabwean examples (e.g. Mbare Musika, e-commerce) where relevant.',
    sections: [
      {
        title: '1. What is Marketing?',
        content: `**Marketing** is the process of **identifying** customer needs and **satisfying** them through the right product or service, at the right price, in the right place, with the right promotion. The aim is to **meet customer needs** while achieving the business’s **objectives** (usually profit). Marketing is not just **selling** or **advertising** – it includes **research** (what do customers want?), **product design**, **pricing**, **distribution**, and **communication**. It starts **before** the product is made (understanding the market) and continues **after** the sale (customer service, feedback).

**Marketing vs selling**
- **Selling** focuses on **getting the customer to buy** what the firm already has – pushing the product.
- **Marketing** focuses on **finding out what the customer needs** and then offering a product that meets that need – pulling the customer. Modern businesses try to be **market-oriented** (customer-led) rather than **sales-oriented** (product-led).`,
      },
      {
        title: '2. Marketing Concepts (Orientations)',
        content: `Different businesses focus on different things. These are often called **marketing concepts** or **orientations**:

**Production concept**
The firm focuses on **producing efficiently** and in large volume; it assumes customers want products that are **available and affordable**. “If we make it cheap and widely available, they will buy.” Often used when demand exceeds supply or when cost is the main concern.

**Product concept**
The firm focuses on **product quality and features**; it assumes customers want the **best** product. Risk: ignoring what customers actually want or what competitors offer.

**Selling concept**
The firm focuses on **selling** what it has through **promotion and sales effort**. Assumes customers will not buy enough unless pushed. Common for unsought goods (e.g. insurance) or when there is overcapacity.

**Marketing concept**
The firm focuses on **customer needs** first; it **designs** products, **prices**, **distributes**, and **promotes** to satisfy those needs better than competitors. The customer is at the centre; the aim is **customer satisfaction** and **long-term relationship**.

**Societal marketing concept**
Like the marketing concept, but the firm also considers **society and the environment** – e.g. not selling harmful products, reducing waste, acting ethically. “Meet customer needs in a way that benefits society too.”`,
      },
      {
        title: '3. Markets and Market Segmentation',
        content: `**Market**
A **market** is where **buyers** and **sellers** meet to exchange goods and services. It can be:
- **Physical** – a specific place, e.g. a **marketplace** (Mbare Musika in Harare), a **shop**, a **mall**.
- **Virtual** – **online** or **electronic**; buyers and sellers interact via the **internet** (e-commerce). Examples: online stores, apps, social media sales.

**Market segmentation**
**Segmentation** means dividing the **total market** into **groups** (segments) of customers with **similar needs or characteristics**. The business can then **target** one or more segments and **tailor** its product, price, place, and promotion to that segment.

**Demographic segmentation**
Dividing by **measurable** characteristics: **age**, **gender**, **income**, **education**, **family size**, **occupation**. E.g. “products for teenagers”, “premium products for high-income households”.

**Geographic segmentation**
Dividing by **location**: **region**, **town/rural**, **climate**. E.g. “warm clothing for cold areas”, “different products for urban vs rural”.

**Psychographic segmentation**
Dividing by **lifestyle**, **values**, **personality**, **interests**. E.g. “eco-friendly products for environmentally conscious consumers”, “luxury for status-seeking customers”.

Segmentation helps the business **focus** its effort and **communicate** more effectively with the right customers.`,
      },
      {
        title: '4. The Marketing Mix (4Ps)',
        content: `The **marketing mix** is the set of **tools** the business uses to pursue its marketing objectives. It is often summarised as the **4Ps**: **Product**, **Price**, **Place**, **Promotion**.

**Product**
What is being offered – the **good or service**, including its **features**, **quality**, **design**, **brand name**, **packaging**, and **after-sales service**. The product must **meet customer needs** and may be **differentiated** from competitors (e.g. by brand, quality, or design). **Branding** (a name, logo, or symbol that identifies the product and builds trust) is part of product decisions.

**Price**
The **amount** the customer pays. Price affects **demand** (usually higher price → lower quantity demanded), **revenue**, and **profit**. Pricing decisions include: setting the **level** (e.g. premium vs low cost); **discounts**; **credit** terms; and **psychological pricing** (e.g. 99 instead of 100). Price must cover costs and fit with the product’s **position** (e.g. luxury vs economy).

**Place (distribution)**
**Where** and **how** the product reaches the customer – **channels** (e.g. producer → wholesaler → retailer → consumer), **locations** (shops, markets, online), **transport**, and **storage**. Place must make the product **available** when and where the customer wants it. E.g. selling at Mbare Musika (physical place) or via a website (virtual place).

**Promotion**
**How** the business **communicates** with customers to inform, persuade, or remind them about the product. Includes **advertising** (paid messages in media), **sales promotion** (short-term incentives – discounts, free samples, competitions), **personal selling** (sales staff), **public relations** (e.g. press, events), and **direct marketing** (e.g. email, SMS). Promotion must reach the **target segment** and deliver a **clear message**.`,
      },
      {
        title: '5. Advertising: Purposes, Media, and Ethics',
        content: `**Advertising** is **paid**, **non-personal** communication through **mass media** (e.g. TV, radio, newspapers, billboards, internet) to promote a product, brand, or idea.

**Purposes of advertising**
- **Inform** – tell customers about a new product, a feature, or where to buy. Builds **awareness**.
- **Persuade** – convince customers that this product is better or more suitable; encourage them to **choose** it over competitors.
- **Remind** – keep the brand in customers’ minds so they **remember** it when they decide to buy.

**Media (channels)**
- **Print** – newspapers, magazines, posters, leaflets. Good for local or detailed messages.
- **Broadcast** – **TV** and **radio**. Reach large audiences; TV combines sound and visual. Cost can be high.
- **Outdoor** – billboards, banners, transport advertising. Good for **reminder** and **brand** in specific areas.
- **Digital** – **internet** (banners, social media, search ads), **mobile** (SMS, in-app ads). Can be **targeted** to specific users and **measured** (clicks, views).

**Ethics in advertising**
Advertising should be **honest** – not **misleading** (false claims, exaggerated benefits) or **deceptive** (hidden conditions). It should not **harm** – e.g. advertising harmful products to children, or using offensive or discriminatory content. **Regulation** (e.g. by government or industry bodies) and **self-regulation** help to maintain standards. Unethical advertising can damage trust and lead to legal action or fines.`,
      },
      {
        title: '6. Sales Promotion and Branding',
        content: `**Sales promotion**
**Short-term** incentives to **increase sales** or **trial**. Examples: **discounts** (e.g. “20% off”), **coupons**, **free samples**, **buy-one-get-one**, **competitions** and **prizes**, **point-of-sale** displays. Sales promotion is often used alongside advertising to **push** customers to buy **now**. It can attract new customers or reward loyal ones but may **reduce** profit per unit or train customers to wait for promotions.

**Branding**
A **brand** is a **name**, **logo**, **symbol**, or **design** that identifies a product or business and **differentiates** it from competitors. **Branding** is the process of building and maintaining that identity. A strong brand can create **trust**, **loyalty**, and **willingness to pay a higher price**. Packaging (how the product is wrapped and presented) supports the brand and can protect the product and provide information (e.g. ingredients, expiry).

**Applying the 4Ps**
In exams, you may be asked to **suggest** a marketing mix for a given product or business. Use the 4Ps: **Product** (what to sell, quality, brand); **Price** (level, discounts); **Place** (where to sell – physical and/or online); **Promotion** (advertising and sales promotion, and which media). Always link your suggestions to the **target customer** and the **scenario** (e.g. “for young urban customers, use social media and online store”).`,
      },
    ],
    key_points: [
      'Marketing = identifying and satisfying customer needs profitably; includes research, product, price, place, promotion. Customer at centre.',
      'Concepts: production (efficiency), product (quality), selling (push), marketing (customer needs), societal (customer + society).',
      'Markets: physical (e.g. Mbare Musika) and virtual (e-commerce). Segmentation: demographic, geographic, psychographic.',
      '4Ps: Product (features, brand, packaging); Price (level, discounts); Place (distribution, where sold); Promotion (advertising, sales promotion).',
      'Advertising: inform, persuade, remind. Media: print, broadcast, outdoor, digital. Must be honest and ethical.',
      'Sales promotion = short-term incentives (discounts, samples, competitions). Branding = name, logo, identity; builds trust and loyalty.',
    ],
    exam_tips: [
      'When asked to “apply the 4Ps”, give at least one point for each P (Product, Price, Place, Promotion) linked to the scenario.',
      'Distinguish marketing concept (customer needs first) from selling concept (pushing what we have).',
      'For segmentation, name demographic, geographic, psychographic and give one example of each.',
      'Advertising purposes: inform, persuade, remind. Mention at least two media and one ethical point (e.g. no misleading claims).',
      'Use Zimbabwean examples: Mbare Musika (physical market), e-commerce (virtual), local brands and adverts.',
    ],
  },
  'Production': {
    topic: 'Production',
    subject: 'Commerce',
    summary: 'Production is the process of creating goods and services to satisfy human wants. It involves converting raw materials and resources into finished products or services that have value. This topic covers: the four types of production (primary, secondary, tertiary, and quaternary); the four factors of production (land, labour, capital, and entrepreneurship) and their rewards; how production adds value at each stage of the chain; and the role of division of labour and specialisation. Understanding production is essential for explaining how businesses and economies work, from the farm or mine to the final consumer.',
    sections: [
      {
        title: '1. What is Production?',
        content: `**Production** is any activity that creates **utility** – that is, it makes goods or services more useful or valuable to people. Human wants are unlimited, but resources are limited (scarcity), so production is at the heart of economics and commerce.

Production can be:
- **Goods**: physical items (e.g. maize, bread, furniture, machinery).
- **Services**: intangible activities (e.g. teaching, banking, transport, healthcare).

**Example (Zimbabwe)**: A farmer grows maize (good); a miller turns it into mealie-meal (good); a retailer sells it to a consumer (service – distribution). At each stage, **value is added** – the product becomes more useful or convenient for the next user.`,
      },
      {
        title: '2. Types of Production',
        content: `Production is often classified into four levels or **sectors**:

**Primary production (extractive)**
Involves **extracting** or harvesting raw materials from the earth or sea. No manufacturing – just obtaining natural resources.
- **Examples**: farming (crops, livestock), mining (gold, coal, platinum), fishing, forestry, quarrying.
- **Zimbabwe**: Tobacco farming, cotton, maize, gold mining, chrome, and forestry are major primary activities.

**Secondary production (manufacturing and construction)**
Involves **converting** raw materials into finished or semi-finished goods. This is manufacturing and building.
- **Examples**: milling maize into mealie-meal, making bread, assembling cars, building houses, refining sugar, tanning leather.
- **Zimbabwe**: Food processing, textiles, cement, steel, and construction are secondary sectors.

**Tertiary production (services)**
Involves **providing services** rather than making physical goods. Supports primary and secondary sectors and final consumers.
- **Examples**: retail, wholesale, banking, insurance, transport, education, healthcare, hairdressing, tourism.
- **Zimbabwe**: Shops, EcoCash, buses, schools, hospitals, and tourism (e.g. Victoria Falls) are tertiary.

**Quaternary production (knowledge-based services)**
Involves **information**, **research**, and **expertise**. Often seen as a subset of tertiary or a fourth sector.
- **Examples**: IT, software, consultancy, research and development, financial planning.
- **Zimbabwe**: IT firms, telecoms (Econet, NetOne), and professional services fall into this category.

**Chain of production**: Raw material (primary) → manufactured good (secondary) → sold and distributed (tertiary). For instance: cotton (primary) → cloth/garments (secondary) → retail shop (tertiary).`,
      },
      {
        title: '3. Factors of Production',
        content: `To produce anything, four **factors of production** (resources) are needed. Each has a **reward** paid to the owner of that factor:

**Land**
All **natural resources** – not just soil, but minerals, water, forests, and the land itself.
- **Reward**: **Rent** (or rent and royalties for minerals).
- **Examples**: A farmer pays rent for land; a mine pays royalties for mineral rights.

**Labour**
**Human effort** – both physical and mental – used in production.
- **Reward**: **Wages** (or salaries).
- **Examples**: Workers in a factory, teachers, drivers, managers – all provide labour and receive wages or salaries.

**Capital**
**Man-made aids** to production – tools, machinery, buildings, vehicles, and equipment used to produce other goods. (Money used to buy these is often called “capital” in everyday language, but in economics “capital” usually means the physical assets.)
- **Reward**: **Interest** (when capital is borrowed) or **profit** (when the business owner provides it).
- **Examples**: Tractors, computers, factories, delivery trucks – all are capital.

**Entrepreneurship**
The **organisation** of the other three factors. The entrepreneur takes **risks**, makes decisions, and bears uncertainty. He or she brings together land, labour, and capital and organises production.
- **Reward**: **Profit** (or loss).
- **Examples**: The person who starts a shop, a farm, or a factory is the entrepreneur.

**Summary**: Land → Rent; Labour → Wages; Capital → Interest; Entrepreneurship → Profit.`,
      },
      {
        title: '4. Added Value and the Production Chain',
        content: `At each stage of production, **value is added**. The value of the output is greater than the cost of inputs because of the work and resources used.

**Example – Bread**:
1. Farmer grows wheat (primary) – adds value by growing the crop.
2. Miller grinds wheat into flour (secondary) – adds value by processing.
3. Baker makes bread (secondary) – adds value by baking.
4. Retailer sells bread to consumer (tertiary) – adds value by making it available in the right place and time.

**Added value** = Selling price − Cost of materials (or inputs). Businesses aim to add value so they can cover costs and make a profit. The **chain of production** from raw material to final consumer shows how primary, secondary, and tertiary sectors are linked.`,
      },
      {
        title: '5. Division of Labour and Specialisation',
        content: `**Division of labour** means breaking production into **smaller tasks**, each done by a different person or group. **Specialisation** means concentrating on one type of work or product where one is most efficient.

**Advantages**:
- Workers become **faster and more skilled** at their task.
- **Time** is saved (no constant switching between tasks).
- **Machinery** can be used more effectively for specific tasks.
- **Output** increases; costs per unit can fall.

**Disadvantages**:
- Work can become **repetitive and boring**.
- If one worker or stage stops, the whole process can be **disrupted**.
- Workers may have **narrow skills** and find it hard to change jobs.

**Example**: In a garment factory, one person cuts cloth, another sews, another buttons, another packs – each specialises. In commerce, wholesalers specialise in bulk buying and selling; retailers specialise in selling to final consumers.`,
      },
    ],
    key_points: [
      'Production creates utility (goods and services) to satisfy human wants; it adds value at each stage.',
      'Primary = extraction (farming, mining, fishing); Secondary = manufacturing and construction; Tertiary = services; Quaternary = knowledge-based services.',
      'Four factors of production: Land (reward: rent), Labour (wages), Capital (interest), Entrepreneurship (profit).',
      'Chain of production: raw material → manufactured good → distribution to consumer; each stage adds value.',
      'Division of labour and specialisation increase efficiency but can make work repetitive and create dependence.',
    ],
    exam_tips: [
      'When asked to “classify” an industry, state clearly: primary, secondary, tertiary, or quaternary, and give a brief reason.',
      'Always link factors of production to their rewards: land–rent, labour–wages, capital–interest, entrepreneurship–profit.',
      'Use a simple chain (e.g. cotton → cloth → shop) to show how primary, secondary, and tertiary production are linked.',
      'For “added value”, explain that it is the difference between the value of the output and the cost of inputs.',
      'Give Zimbabwean or local examples (e.g. tobacco, mining, EcoCash, retail) to show you understand real applications.',
    ],
  },
  'Trade': {
    topic: 'Trade',
    subject: 'Commerce',
    summary: 'Trade is the buying and selling of goods and services. It links producers to consumers and enables specialisation and exchange. This topic covers: the difference between home trade (within a country) and foreign trade (between countries); wholesale and retail trade and their roles in the distribution channel; visible trade (goods) and invisible trade (services); balance of trade and balance of payments; and why trade – both domestic and international – is important for employment, choice, and economic growth. Understanding trade is essential for explaining how goods move from farm or factory to the final buyer, and how countries benefit from exporting and importing.',
    sections: [
      {
        title: '1. What is Trade?',
        content: `**Trade** is the **exchange of goods and services** – buying and selling – usually for money. It is a core part of **commerce**: without trade, producers would have no way to reach consumers, and people could not specialise in what they do best.

Trade is divided into:
- **Home trade (domestic trade)**: buying and selling **within the borders of one country**. For example, a Harare shop selling goods to a customer in Bulawayo.
- **Foreign trade (international trade)**: buying and selling **between different countries**. For example, Zimbabwe exporting tobacco to China or importing fuel from neighbouring countries.

Both types create **employment**, widen **choice** for consumers, and allow **specialisation** – countries or regions produce what they are best at and trade for the rest.`,
      },
      {
        title: '2. Home Trade: Wholesale and Retail',
        content: `**Wholesale trade**
Wholesalers buy goods in **large quantities** from producers or importers and sell in **smaller bulk** to retailers or other businesses (e.g. hotels, schools). They rarely sell to the final consumer.
- **Characteristics**: Large volumes, lower unit price, fewer customers (retailers), often need warehouses and delivery vehicles.
- **Examples (Zimbabwe)**: Wholesalers supplying tuckshops, supermarkets, or bottle stores with stock; distribution of mealie-meal, cooking oil, or beverages.

**Retail trade**
Retailers buy from wholesalers (or sometimes producers) and sell in **small quantities** to the **final consumer**.
- **Characteristics**: Small quantities per sale, higher unit price, many individual customers, shops or market stalls.
- **Examples (Zimbabwe)**: Supermarkets (OK, Pick n Pay), tuckshops, Mbare Musika market stalls, bottle stores, clothing shops.

**Distribution channel**
A common channel is: **Producer → Wholesaler → Retailer → Consumer**. Sometimes the channel is shorter: **Producer → Retailer → Consumer** (e.g. a farmer selling at a market) or **Producer → Consumer** (direct sale). The longer the channel, the more hands add cost and possibly value (e.g. storage, transport, convenience).`,
      },
      {
        title: '3. Foreign Trade: Import and Export',
        content: `**Export** – selling goods or services **to other countries**. The country **receives** payment from abroad.
- **Examples (Zimbabwe)**: Tobacco, gold, platinum, cotton, sugar, beef, and tourism (invisible export).

**Import** – buying goods or services **from other countries**. The country **pays** foreign suppliers.
- **Examples (Zimbabwe)**: Fuel, machinery, vehicles, medicines, electronics, and some food items.

**Visible trade**
Trade in **physical goods** – things you can see and touch (e.g. cars, machinery, grain, minerals). Visible exports and visible imports are recorded at the border (customs).

**Invisible trade**
Trade in **services** – no physical good crosses the border, but payment does.
- **Invisible exports**: Tourism (foreign visitors spend in Zimbabwe), transport (e.g. airlines), insurance, banking services sold to foreigners, remittances from diaspora.
- **Invisible imports**: Zimbabweans travelling abroad, paying for foreign shipping or insurance, royalties.

**Why countries trade**
- **Different resources**: Some countries have minerals, others have fertile land or skilled labour; they exchange what they have for what they need.
- **Specialisation**: Countries produce what they are best at and trade for the rest, so overall output and variety increase.
- **Choice and competition**: Imports give consumers more choice and can keep prices and quality competitive.`,
      },
      {
        title: '4. Balance of Trade and Balance of Payments',
        content: `**Balance of trade (BOT)**
The difference between the value of **visible exports** and **visible imports** over a period (e.g. a year).
- **Formula**: Balance of trade = Visible exports − Visible imports.
- **Surplus**: Exports > Imports (country earns more from goods than it spends).
- **Deficit**: Imports > Exports (country spends more on goods than it earns).

**Balance of payments (BOP)**
A record of **all** economic transactions between a country and the rest of the world – goods, services, and capital (e.g. investments, loans). It has two main parts: **current account** (trade in goods and services, plus income and transfers) and **capital account** (flows of money for investment, loans, etc.).
- **Balance of payments** is in balance when total inflows of money equal total outflows (overall). A **current account deficit** means the country is spending more on goods, services, and transfers than it earns; it may be financed by borrowing or by capital inflows.

**Important distinction**
- **Balance of trade** = only **visible** (goods) trade.
- **Balance of payments** = **all** flows (goods + services + income + capital). So a country can have a visible trade deficit but still have other inflows (e.g. tourism, remittances) that help the overall balance.`,
      },
      {
        title: '5. Advantages of Trade',
        content: `**Advantages of home trade**
- Goods reach consumers everywhere (towns, rural areas) through wholesalers and retailers.
- **Employment** in transport, warehousing, and retail.
- **Choice** – many products and brands available.
- **Convenience** – retailers open near customers and sell in small quantities.

**Advantages of international trade**
- **Specialisation**: Countries focus on what they produce best; global output and efficiency rise.
- **Variety**: Consumers and firms get goods and services not available at home (e.g. technology, certain raw materials).
- **Employment**: Export industries and import-handling (ports, logistics) create jobs.
- **Foreign exchange**: Exports (and invisible earnings like tourism) bring in foreign currency needed to pay for imports.
- **Competition**: Import competition can improve quality and keep prices in check.

**Zimbabwe in context**: Exports (tobacco, minerals, etc.) earn foreign currency; imports (fuel, machinery, medicines) use it. A sustainable balance requires growing exports and/or invisible earnings (e.g. tourism) to pay for necessary imports.`,
      },
    ],
    key_points: [
      'Trade = buying and selling of goods and services. Home trade is within a country; foreign trade is between countries.',
      'Wholesale: bulk sales to retailers/businesses. Retail: small sales to final consumers. Channel: Producer → Wholesaler → Retailer → Consumer.',
      'Export = selling abroad; Import = buying from abroad. Visible = goods; Invisible = services (tourism, banking, transport).',
      'Balance of trade = Visible exports − Visible imports (surplus or deficit). Balance of payments = all inflows and outflows (goods + services + capital).',
      'Trade creates employment, widens choice, allows specialisation, and (in international trade) earns foreign exchange.',
    ],
    exam_tips: [
      'Always distinguish wholesale (bulk, to retailers) from retail (small quantities, to final consumer), and give an example of each.',
      'For “visible” vs “invisible” trade: visible = physical goods; invisible = services (tourism, banking, insurance, transport).',
      'Balance of trade uses only visible (goods) trade; balance of payments includes goods, services, and capital – do not confuse them.',
      'When explaining advantages of international trade, mention specialisation, variety, employment, and foreign exchange.',
      'Use Zimbabwean examples: tobacco/gold exports, fuel imports, tourism as invisible export, Mbare Musika for retail.',
    ],
  },
  'Transport': {
    topic: 'Transport',
    subject: 'Commerce',
    summary: 'Transport is the movement of goods and people from one place to another. It is essential for trade: without transport, goods cannot reach markets and people cannot reach work or services. This topic covers: the importance of transport in commerce; the four main modes – road, rail, air, and water – with their advantages and disadvantages; factors that influence the choice of transport (speed, cost, nature of goods, distance, reliability); and the role of transport in the distribution chain. You need to compare modes and recommend a suitable mode for given scenarios, including Zimbabwean examples where relevant.',
    sections: [
      {
        title: '1. Importance of Transport in Commerce',
        content: `**Transport** is the **movement** of goods and people from one location to another. In commerce, transport is vital because:

- **Goods** must move from **producers** (farms, factories) to **wholesalers**, **retailers**, and **consumers**. Without transport, trade over distance would be impossible.
- **People** need to get to **work**, **markets**, **schools**, and **services**. Transport enables labour mobility and access to opportunities.
- **Raw materials** must reach **factories**; **finished products** must reach **ports** or **markets**. Transport links the stages of production and distribution.

Transport **adds place utility** – it makes goods and services available where they are needed. It is part of the **distribution** function in commerce and is often a major **cost** for businesses, so choosing the right mode matters.`,
      },
      {
        title: '2. Road Transport',
        content: `**Road transport** uses **vehicles** (lorries, vans, buses, cars) on **roads and highways**. It is the most common mode for short and medium distances and for door-to-door delivery.

**Advantages**
- **Flexible** – vehicles can go almost anywhere roads exist; door-to-door delivery without changing mode.
- **Suitable for small consignments** – a van can deliver to many stops.
- **Relatively fast** for short distances; no need to wait for schedules like rail or ship.
- **Wide network** – in most countries, roads reach more places than rail or ports.

**Disadvantages**
- **Cost** – fuel, maintenance, and labour can be high per tonne-kilometre for long hauls.
- **Congestion** – traffic jams cause delays, especially in cities.
- **Accidents and breakdowns** – risk of damage to goods and injury.
- **Limited capacity** – a single lorry carries less than a train or ship; bulk cargo over long distance is often cheaper by rail or water.

**Use**: Ideal for **retail distribution**, **perishables** (with refrigerated trucks), **small orders**, and **areas not served by rail or water**. In Zimbabwe, road transport is dominant for domestic goods movement (e.g. maize, fuel, consumer goods).`,
      },
      {
        title: '3. Rail Transport',
        content: `**Rail transport** uses **trains** on **railway tracks**. It is well suited to **bulk cargo** and **long distances** over land.

**Advantages**
- **Bulk** – one train can carry many wagons of coal, grain, minerals, or containers; **low cost per tonne** over long distances.
- **Reliable** – not affected by road congestion; schedules can be predictable.
- **Less fuel per tonne** than road for heavy loads over long distance.
- **Safety** – fewer accidents than road for equivalent tonnage.

**Disadvantages**
- **Inflexible** – trains run on fixed routes; goods need to be taken to and from stations by road.
- **Not door-to-door** – need other transport at each end (e.g. lorry from factory to station, station to customer).
- **Capital-intensive** – building and maintaining tracks is expensive; some areas have no rail.
- **Slower** for small consignments (waiting for full train, shunting).

**Use**: **Bulk commodities** (minerals, grain, fuel), **long-distance** land movement, **containers** (where rail links port to inland). Zimbabwe has rail links (e.g. Bulawayo–Harare, links to South Africa, Beira) used for minerals, grain, and general cargo.`,
      },
      {
        title: '4. Air Transport',
        content: `**Air transport** uses **aeroplanes** to move goods and people by **air**. It is the **fastest** mode but usually the **most expensive** per kilogramme.

**Advantages**
- **Speed** – same-day or next-day delivery across continents; essential for **urgent** documents, **emergency** supplies, **perishables** (flowers, fresh fish).
- **Reduces risk** for high-value or fragile goods (short time in transit).
- **Reaches** places with no road or rail (remote areas, islands).

**Disadvantages**
- **High cost** – fuel and handling make it expensive per kg; not economical for heavy, low-value bulk (e.g. grain, minerals).
- **Limited capacity** – aircraft hold less than ships or trains; weight and space are limited.
- **Weather and security** – flights can be delayed or cancelled; strict security for cargo.
- **Environmental impact** – high carbon footprint per tonne.

**Use**: **Perishables** (fresh produce for export), **high-value** goods (electronics, jewellery), **urgent** documents and **emergency** relief, **passengers** for business and tourism. Zimbabwe uses air for export of flowers, fresh produce, and for passenger travel (e.g. Harare–Johannesburg).`,
      },
      {
        title: '5. Water Transport (Sea and Inland)',
        content: `**Water transport** uses **ships** and **boats** on **seas, rivers, and lakes**. It is the **cheapest** per tonne for **bulk** cargo over **long** distances, but the **slowest**.

**Advantages**
- **Low cost** – very large ships carry huge volumes; cost per tonne-kilometre is low for bulk (e.g. oil, grain, minerals, containers).
- **Large capacity** – tankers, bulk carriers, and container ships carry far more than any other mode.
- **Suitable for heavy, non-urgent** goods – machinery, raw materials, vehicles.

**Disadvantages**
- **Slow** – journeys can take weeks; not suitable for perishables unless refrigerated.
- **Fixed routes** – only between ports; goods need road or rail to and from port.
- **Weather** – storms can delay or endanger ships.
- **Not all countries are coastal** – landlocked countries (like Zimbabwe) depend on ports in neighbouring countries (e.g. Beira, Durban) and connecting road/rail.

**Use**: **International trade** in bulk (oil, grain, minerals, manufactured goods in containers). **Inland water** (rivers, lakes) used where available (e.g. Kariba for some cargo). Zimbabwe uses **corridors** (road/rail) to Mozambican and South African ports for imports and exports.`,
      },
      {
        title: '6. Choosing the Right Mode',
        content: `The choice of transport depends on several **factors**:

**Nature of the goods**
- **Perishables** (fruit, flowers, dairy) → need **speed** or **refrigeration** → often **air** or **road** (refrigerated).
- **Bulky, low-value** (grain, coal, minerals) → **rail** or **water** for low cost.
- **High-value, small** (jewellery, documents) → **air** for speed and security.
- **Fragile** → avoid multiple handling; **road** door-to-door or **air** for long distance.

**Distance**
- **Short** → **road** (flexible, door-to-door).
- **Long over land** → **rail** for bulk; **road** for smaller consignments.
- **International, bulk** → **sea**. **International, urgent** → **air**.

**Cost vs speed**
- **Cheapest** usually **water**, then **rail**, then **road**, then **air** (per tonne-km).
- **Fastest** is **air**, then **road**, then **rail**, then **water**. The customer or business must balance **cost** and **speed**.

**Other factors**: **Reliability** (schedules, delays); **availability** (does the mode serve the route?); **security** (theft, damage); **packaging** required (e.g. containers for sea). When answering exam questions, **state the scenario** (e.g. “exporting flowers to Europe”) and **recommend a mode** with a clear reason (e.g. “air – perishable and high value, need speed”).`,
      },
    ],
    key_points: [
      'Transport = movement of goods and people; essential for trade and distribution; adds place utility.',
      'Road: flexible, door-to-door; good for short/medium distance, small consignments; higher cost for long bulk.',
      'Rail: bulk, long distance, low cost per tonne; fixed routes; need road at each end.',
      'Air: fastest, expensive; for perishables, high-value, urgent; limited capacity.',
      'Water: cheapest per tonne for bulk, slow; for international bulk (minerals, grain, containers); landlocked countries use corridors to ports.',
      'Choice depends on: nature of goods, distance, cost vs speed, reliability, and availability of the mode.',
    ],
    exam_tips: [
      'When comparing modes, give at least two advantages and two disadvantages for each mode asked.',
      'For “recommend a mode” questions, state the mode and give a clear reason linked to the scenario (e.g. perishable → speed → air).',
      'Remember: road = flexible; rail = bulk over land; air = speed, high cost; water = bulk, low cost, slow.',
      'Zimbabwe: road dominant domestically; rail for bulk (minerals, grain); air for export of flowers/fresh produce; sea via neighbouring ports.',
    ],
  },
};

/** Get notes by topic slug (URL param) */
export function getTopicNotesBySlug(slug: string): TopicNotes | null {
  const name = topicSlugToName(slug);
  if (!name) return null;
  return commerceNotes[name] ?? null;
}
