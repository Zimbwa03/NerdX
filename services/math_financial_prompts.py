#!/usr/bin/env python3
"""
Mathematics Financial Mathematics Question Prompts
180 Unique Prompts for ZIMSEC O-Level Mathematics
Organized by Subtopic and Difficulty Level
"""

# ============================================================================
# TOPIC: FINANCIAL MATHEMATICS - 12 Subtopics × 15 Prompts = 180 Total
# ============================================================================

SIMPLE_INTEREST = {
    "subtopic": "Simple Interest",
    "description": "I = PRT/100 calculations",
    "prompts": {
        "easy": [
            {"id": "FM_SI_E01", "subtopic": "Finding Interest", "prompt": "Generate question finding simple interest given P, R, T. Example: 'Find SI on $5000 at 8% for 3 years'", "learning_objective": "Calculate simple interest"},
            {"id": "FM_SI_E02", "subtopic": "Finding Amount", "prompt": "Generate question finding total amount A = P + I", "learning_objective": "Calculate total amount"},
            {"id": "FM_SI_E03", "subtopic": "Using Formula", "prompt": "Generate basic SI formula application", "learning_objective": "Apply SI formula correctly"},
            {"id": "FM_SI_E04", "subtopic": "Monthly Rate", "prompt": "Generate question with rate per month", "learning_objective": "Convert annual to monthly rate"},
            {"id": "FM_SI_E05", "subtopic": "Time in Months", "prompt": "Generate question with time in months", "learning_objective": "Convert months to years in SI"}
        ],
        "medium": [
            {"id": "FM_SI_M01", "subtopic": "Finding Principal", "prompt": "Generate question finding P given I, R, T", "learning_objective": "Calculate principal from interest"},
            {"id": "FM_SI_M02", "subtopic": "Finding Rate", "prompt": "Generate question finding rate", "learning_objective": "Calculate rate from other values"},
            {"id": "FM_SI_M03", "subtopic": "Finding Time", "prompt": "Generate question finding time period", "learning_objective": "Calculate time from other values"},
            {"id": "FM_SI_M04", "subtopic": "Comparing Options", "prompt": "Generate comparing two SI investments", "learning_objective": "Compare simple interest options"},
            {"id": "FM_SI_M05", "subtopic": "Word Problems", "prompt": "Generate SI word problem", "learning_objective": "Solve SI word problems"}
        ],
        "difficult": [
            {"id": "FM_SI_D01", "subtopic": "Multiple Investments", "prompt": "Generate question with multiple investments", "learning_objective": "Handle multiple SI investments"},
            {"id": "FM_SI_D02", "subtopic": "Finding Split Principal", "prompt": "Generate question splitting principal at different rates", "learning_objective": "Solve split investment problems"},
            {"id": "FM_SI_D03", "subtopic": "Interest Rate Change", "prompt": "Generate question with rate change mid-period", "learning_objective": "Handle rate changes"},
            {"id": "FM_SI_D04", "subtopic": "Time to Double", "prompt": "Generate question finding time to double money", "learning_objective": "Calculate doubling time with SI"},
            {"id": "FM_SI_D05", "subtopic": "Complex Word Problem", "prompt": "Generate complex SI scenario", "learning_objective": "Solve complex SI problems"}
        ]
    }
}

COMPOUND_INTEREST = {
    "subtopic": "Compound Interest",
    "description": "A = P(1 + r/n)^nt calculations",
    "prompts": {
        "easy": [
            {"id": "FM_CI_E01", "subtopic": "Annual Compounding", "prompt": "Generate CI question with annual compounding", "learning_objective": "Calculate CI compounded annually"},
            {"id": "FM_CI_E02", "subtopic": "Finding Amount", "prompt": "Generate finding final amount question", "learning_objective": "Apply CI formula for amount"},
            {"id": "FM_CI_E03", "subtopic": "Finding Interest", "prompt": "Generate finding interest from amount", "learning_objective": "Calculate CI from final amount"},
            {"id": "FM_CI_E04", "subtopic": "Using Calculator", "prompt": "Generate CI requiring calculator", "learning_objective": "Use calculator for CI"},
            {"id": "FM_CI_E05", "subtopic": "Two Years", "prompt": "Generate simple 2-year CI", "learning_objective": "Calculate CI for short periods"}
        ],
        "medium": [
            {"id": "FM_CI_M01", "subtopic": "Half-Yearly", "prompt": "Generate semi-annual compounding", "learning_objective": "Calculate CI compounded semi-annually"},
            {"id": "FM_CI_M02", "subtopic": "Quarterly", "prompt": "Generate quarterly compounding", "learning_objective": "Calculate CI compounded quarterly"},
            {"id": "FM_CI_M03", "subtopic": "Finding Principal", "prompt": "Generate finding P from A, r, t", "learning_objective": "Find principal in CI"},
            {"id": "FM_CI_M04", "subtopic": "SI vs CI Comparison", "prompt": "Generate comparing SI and CI", "learning_objective": "Compare SI and CI returns"},
            {"id": "FM_CI_M05", "subtopic": "Finding Rate", "prompt": "Generate finding rate in CI", "learning_objective": "Calculate rate in CI"}
        ],
        "difficult": [
            {"id": "FM_CI_D01", "subtopic": "Finding Time", "prompt": "Generate finding time using logarithms", "learning_objective": "Use logs to find time in CI"},
            {"id": "FM_CI_D02", "subtopic": "Effective Rate", "prompt": "Generate effective annual rate question", "learning_objective": "Calculate effective interest rate"},
            {"id": "FM_CI_D03", "subtopic": "Continuous Compounding", "prompt": "Generate continuous compounding question", "learning_objective": "Understand continuous compounding"},
            {"id": "FM_CI_D04", "subtopic": "Monthly Compounding", "prompt": "Generate monthly compounding with years", "learning_objective": "Calculate monthly compounded CI"},
            {"id": "FM_CI_D05", "subtopic": "Investment Growth", "prompt": "Generate investment growth scenario", "learning_objective": "Model investment growth with CI"}
        ]
    }
}

DEPRECIATION = {
    "subtopic": "Depreciation",
    "description": "Value reduction over time",
    "prompts": {
        "easy": [
            {"id": "FM_DP_E01", "subtopic": "Simple Depreciation", "prompt": "Generate simple linear depreciation", "learning_objective": "Calculate linear depreciation"},
            {"id": "FM_DP_E02", "subtopic": "Finding Book Value", "prompt": "Generate finding value after depreciation", "learning_objective": "Calculate book value"},
            {"id": "FM_DP_E03", "subtopic": "Annual Depreciation", "prompt": "Generate annual depreciation amount", "learning_objective": "Calculate annual depreciation"},
            {"id": "FM_DP_E04", "subtopic": "Percentage Depreciation", "prompt": "Generate percentage-based depreciation", "learning_objective": "Apply percentage depreciation"},
            {"id": "FM_DP_E05", "subtopic": "Car Depreciation", "prompt": "Generate car value depreciation", "learning_objective": "Apply depreciation to vehicles"}
        ],
        "medium": [
            {"id": "FM_DP_M01", "subtopic": "Reducing Balance", "prompt": "Generate reducing balance depreciation", "learning_objective": "Calculate reducing balance depreciation"},
            {"id": "FM_DP_M02", "subtopic": "Multiple Years", "prompt": "Generate depreciation over several years", "learning_objective": "Track depreciation over time"},
            {"id": "FM_DP_M03", "subtopic": "Finding Rate", "prompt": "Generate finding depreciation rate", "learning_objective": "Calculate depreciation rate"},
            {"id": "FM_DP_M04", "subtopic": "Comparing Methods", "prompt": "Generate comparing depreciation methods", "learning_objective": "Compare depreciation methods"},
            {"id": "FM_DP_M05", "subtopic": "Finding Original Value", "prompt": "Generate finding original from current", "learning_objective": "Calculate original value"}
        ],
        "difficult": [
            {"id": "FM_DP_D01", "subtopic": "Time to Reach Value", "prompt": "Generate finding time to reach certain value", "learning_objective": "Calculate time in depreciation"},
            {"id": "FM_DP_D02", "subtopic": "Fleet Depreciation", "prompt": "Generate fleet of vehicles depreciation", "learning_objective": "Handle multiple asset depreciation"},
            {"id": "FM_DP_D03", "subtopic": "Appreciation vs Depreciation", "prompt": "Generate comparison question", "learning_objective": "Compare appreciation and depreciation"},
            {"id": "FM_DP_D04", "subtopic": "Scrap Value", "prompt": "Generate scrap value calculations", "learning_objective": "Calculate to scrap value"},
            {"id": "FM_DP_D05", "subtopic": "Business Application", "prompt": "Generate business depreciation scenario", "learning_objective": "Apply depreciation in business context"}
        ]
    }
}

PROFIT_AND_LOSS = {
    "subtopic": "Profit and Loss",
    "description": "Cost price, selling price, profit, and loss calculations",
    "prompts": {
        "easy": [
            {"id": "FM_PL_E01", "subtopic": "Finding Profit", "prompt": "Generate finding profit from CP and SP", "learning_objective": "Calculate profit"},
            {"id": "FM_PL_E02", "subtopic": "Finding Loss", "prompt": "Generate finding loss from CP and SP", "learning_objective": "Calculate loss"},
            {"id": "FM_PL_E03", "subtopic": "Profit Percentage", "prompt": "Generate profit percentage question", "learning_objective": "Calculate profit percentage"},
            {"id": "FM_PL_E04", "subtopic": "Loss Percentage", "prompt": "Generate loss percentage question", "learning_objective": "Calculate loss percentage"},
            {"id": "FM_PL_E05", "subtopic": "Finding SP", "prompt": "Generate finding SP from CP and profit", "learning_objective": "Calculate selling price"}
        ],
        "medium": [
            {"id": "FM_PL_M01", "subtopic": "Finding CP from SP", "prompt": "Generate finding CP given SP and profit%", "learning_objective": "Calculate cost price from selling price"},
            {"id": "FM_PL_M02", "subtopic": "Marked Price", "prompt": "Generate marked price and discount", "learning_objective": "Work with marked prices"},
            {"id": "FM_PL_M03", "subtopic": "Break-even", "prompt": "Generate break-even analysis", "learning_objective": "Calculate break-even point"},
            {"id": "FM_PL_M04", "subtopic": "Multiple Items", "prompt": "Generate profit on multiple items", "learning_objective": "Calculate total profit on stock"},
            {"id": "FM_PL_M05", "subtopic": "Word Problems", "prompt": "Generate profit/loss word problem", "learning_objective": "Solve profit/loss word problems"}
        ],
        "difficult": [
            {"id": "FM_PL_D01", "subtopic": "Successive Discounts", "prompt": "Generate successive discount question", "learning_objective": "Calculate successive discounts"},
            {"id": "FM_PL_D02", "subtopic": "False Weights", "prompt": "Generate false weight profit question", "learning_objective": "Understand false weight profit"},
            {"id": "FM_PL_D03", "subtopic": "Mixed Transactions", "prompt": "Generate mixed profit and loss", "learning_objective": "Handle mixed transactions"},
            {"id": "FM_PL_D04", "subtopic": "Overall Profit/Loss", "prompt": "Generate overall business profit", "learning_objective": "Calculate overall profit/loss"},
            {"id": "FM_PL_D05", "subtopic": "Partnership Profit", "prompt": "Generate partnership profit sharing", "learning_objective": "Divide profits in partnership"}
        ]
    }
}

DISCOUNT = {
    "subtopic": "Discount and Marked Price",
    "description": "Discounts, marked prices, and sale prices",
    "prompts": {
        "easy": [
            {"id": "FM_DM_E01", "subtopic": "Finding Discount Amount", "prompt": "Generate discount amount question", "learning_objective": "Calculate discount amount"},
            {"id": "FM_DM_E02", "subtopic": "Finding Sale Price", "prompt": "Generate sale price question", "learning_objective": "Calculate sale price after discount"},
            {"id": "FM_DM_E03", "subtopic": "Discount Percentage", "prompt": "Generate finding discount %", "learning_objective": "Calculate discount percentage"},
            {"id": "FM_DM_E04", "subtopic": "Simple Marked Price", "prompt": "Generate marked price question", "learning_objective": "Understand marked price concept"},
            {"id": "FM_DM_E05", "subtopic": "Finding Original", "prompt": "Generate finding original from sale", "learning_objective": "Calculate original from discounted"}
        ],
        "medium": [
            {"id": "FM_DM_M01", "subtopic": "Successive Discounts", "prompt": "Generate two successive discounts", "learning_objective": "Apply successive discounts"},
            {"id": "FM_DM_M02", "subtopic": "Equivalent Discount", "prompt": "Generate equivalent single discount", "learning_objective": "Find equivalent single discount"},
            {"id": "FM_DM_M03", "subtopic": "Discount and Profit", "prompt": "Generate combined discount-profit", "learning_objective": "Combine discount with profit"},
            {"id": "FM_DM_M04", "subtopic": "Trade Discount", "prompt": "Generate trade discount question", "learning_objective": "Apply trade discounts"},
            {"id": "FM_DM_M05", "subtopic": "Cash vs Credit", "prompt": "Generate cash vs credit price", "learning_objective": "Compare cash and credit prices"}
        ],
        "difficult": [
            {"id": "FM_DM_D01", "subtopic": "Three Successive", "prompt": "Generate three successive discounts", "learning_objective": "Calculate three successive discounts"},
            {"id": "FM_DM_D02", "subtopic": "Net Selling Price", "prompt": "Generate net SP with VAT and discount", "learning_objective": "Calculate with tax and discount"},
            {"id": "FM_DM_D03", "subtopic": "Maximum Discount", "prompt": "Generate finding max discount for profit", "learning_objective": "Calculate maximum allowable discount"},
            {"id": "FM_DM_D04", "subtopic": "Bundle Discounts", "prompt": "Generate bundle/combo discounts", "learning_objective": "Apply bundle pricing"},
            {"id": "FM_DM_D05", "subtopic": "Clearance Sale", "prompt": "Generate clearance pricing scenario", "learning_objective": "Solve clearance sale problems"}
        ]
    }
}

TAXATION = {
    "subtopic": "Tax Calculations",
    "description": "VAT, income tax, and other taxes",
    "prompts": {
        "easy": [
            {"id": "FM_TX_E01", "subtopic": "Finding VAT", "prompt": "Generate finding VAT amount", "learning_objective": "Calculate VAT amount"},
            {"id": "FM_TX_E02", "subtopic": "Price Including VAT", "prompt": "Generate price with VAT", "learning_objective": "Add VAT to price"},
            {"id": "FM_TX_E03", "subtopic": "Price Excluding VAT", "prompt": "Generate finding price before VAT", "learning_objective": "Remove VAT from price"},
            {"id": "FM_TX_E04", "subtopic": "Tax Rate", "prompt": "Generate finding tax rate", "learning_objective": "Calculate tax rate"},
            {"id": "FM_TX_E05", "subtopic": "Simple Income Tax", "prompt": "Generate basic income tax", "learning_objective": "Calculate simple income tax"}
        ],
        "medium": [
            {"id": "FM_TX_M01", "subtopic": "Tax Brackets", "prompt": "Generate tax bracket question", "learning_objective": "Apply tax brackets"},
            {"id": "FM_TX_M02", "subtopic": "Net Pay", "prompt": "Generate net pay calculation", "learning_objective": "Calculate net pay after tax"},
            {"id": "FM_TX_M03", "subtopic": "Tax Allowances", "prompt": "Generate with tax allowance", "learning_objective": "Apply tax allowances"},
            {"id": "FM_TX_M04", "subtopic": "PAYE", "prompt": "Generate PAYE calculation", "learning_objective": "Calculate PAYE tax"},
            {"id": "FM_TX_M05", "subtopic": "Multiple Taxes", "prompt": "Generate combined taxes question", "learning_objective": "Handle multiple tax types"}
        ],
        "difficult": [
            {"id": "FM_TX_D01", "subtopic": "Progressive Tax", "prompt": "Generate progressive tax calculation", "learning_objective": "Calculate progressive income tax"},
            {"id": "FM_TX_D02", "subtopic": "Tax Tables", "prompt": "Generate using tax tables", "learning_objective": "Use tax tables correctly"},
            {"id": "FM_TX_D03", "subtopic": "Effective Tax Rate", "prompt": "Generate effective rate question", "learning_objective": "Calculate effective tax rate"},
            {"id": "FM_TX_D04", "subtopic": "Tax Planning", "prompt": "Generate tax planning scenario", "learning_objective": "Apply tax planning concepts"},
            {"id": "FM_TX_D05", "subtopic": "Business Tax", "prompt": "Generate business tax scenario", "learning_objective": "Calculate business taxes"}
        ]
    }
}

HIRE_PURCHASE = {
    "subtopic": "Hire Purchase",
    "description": "Deposits, installments, and hire purchase calculations",
    "prompts": {
        "easy": [
            {"id": "FM_HP_E01", "subtopic": "Finding Total HP Price", "prompt": "Generate total HP price question", "learning_objective": "Calculate total HP price"},
            {"id": "FM_HP_E02", "subtopic": "Monthly Installment", "prompt": "Generate finding installment", "learning_objective": "Calculate monthly installment"},
            {"id": "FM_HP_E03", "subtopic": "Deposit Calculation", "prompt": "Generate deposit calculation", "learning_objective": "Calculate deposit amount"},
            {"id": "FM_HP_E04", "subtopic": "Balance After Deposit", "prompt": "Generate balance owing question", "learning_objective": "Calculate balance after deposit"},
            {"id": "FM_HP_E05", "subtopic": "Simple HP", "prompt": "Generate simple HP question", "learning_objective": "Understand HP basics"}
        ],
        "medium": [
            {"id": "FM_HP_M01", "subtopic": "Extra Cost", "prompt": "Generate HP extra cost question", "learning_objective": "Calculate extra cost of HP"},
            {"id": "FM_HP_M02", "subtopic": "Interest Rate", "prompt": "Generate finding HP interest rate", "learning_objective": "Calculate HP interest rate"},
            {"id": "FM_HP_M03", "subtopic": "Cash vs HP", "prompt": "Generate comparing cash and HP", "learning_objective": "Compare cash and HP options"},
            {"id": "FM_HP_M04", "subtopic": "Finding Cash Price", "prompt": "Generate finding cash from HP", "learning_objective": "Calculate cash price from HP details"},
            {"id": "FM_HP_M05", "subtopic": "Extended HP", "prompt": "Generate extended payment plan", "learning_objective": "Handle extended HP plans"}
        ],
        "difficult": [
            {"id": "FM_HP_D01", "subtopic": "Effective Interest", "prompt": "Generate effective HP interest", "learning_objective": "Calculate effective HP rate"},
            {"id": "FM_HP_D02", "subtopic": "Balloon Payment", "prompt": "Generate balloon payment scenario", "learning_objective": "Handle balloon payments"},
            {"id": "FM_HP_D03", "subtopic": "Multiple Items HP", "prompt": "Generate HP for multiple items", "learning_objective": "Calculate combined HP"},
            {"id": "FM_HP_D04", "subtopic": "Early Settlement", "prompt": "Generate early HP settlement", "learning_objective": "Calculate early settlement amount"},
            {"id": "FM_HP_D05", "subtopic": "HP Decision", "prompt": "Generate HP decision scenario", "learning_objective": "Make HP financial decisions"}
        ]
    }
}

EXCHANGE_RATES = {
    "subtopic": "Currency Exchange",
    "description": "Foreign exchange calculations",
    "prompts": {
        "easy": [
            {"id": "FM_EX_E01", "subtopic": "Converting Currency", "prompt": "Generate simple currency conversion", "learning_objective": "Convert between currencies"},
            {"id": "FM_EX_E02", "subtopic": "Buying Rate", "prompt": "Generate using buying rate", "learning_objective": "Apply buying exchange rate"},
            {"id": "FM_EX_E03", "subtopic": "Selling Rate", "prompt": "Generate using selling rate", "learning_objective": "Apply selling exchange rate"},
            {"id": "FM_EX_E04", "subtopic": "Reading Exchange Table", "prompt": "Generate reading exchange table", "learning_objective": "Read exchange rate tables"},
            {"id": "FM_EX_E05", "subtopic": "Simple Conversion", "prompt": "Generate USD to ZWL conversion", "learning_objective": "Convert common currencies"}
        ],
        "medium": [
            {"id": "FM_EX_M01", "subtopic": "Buy/Sell Spread", "prompt": "Generate spread calculation", "learning_objective": "Calculate exchange spread"},
            {"id": "FM_EX_M02", "subtopic": "Commission", "prompt": "Generate with commission charge", "learning_objective": "Apply commission to exchange"},
            {"id": "FM_EX_M03", "subtopic": "Cross Rate", "prompt": "Generate cross rate question", "learning_objective": "Calculate cross exchange rates"},
            {"id": "FM_EX_M04", "subtopic": "Travel Money", "prompt": "Generate travel exchange scenario", "learning_objective": "Calculate travel money"},
            {"id": "FM_EX_M05", "subtopic": "Multiple Currencies", "prompt": "Generate multi-currency question", "learning_objective": "Handle multiple currencies"}
        ],
        "difficult": [
            {"id": "FM_EX_D01", "subtopic": "Rate Changes", "prompt": "Generate rate change impact", "learning_objective": "Analyze exchange rate changes"},
            {"id": "FM_EX_D02", "subtopic": "Arbitrage", "prompt": "Generate simple arbitrage question", "learning_objective": "Understand arbitrage concept"},
            {"id": "FM_EX_D03", "subtopic": "Import/Export", "prompt": "Generate import cost question", "learning_objective": "Calculate import costs with exchange"},
            {"id": "FM_EX_D04", "subtopic": "Profit/Loss on Exchange", "prompt": "Generate exchange profit/loss", "learning_objective": "Calculate profit on exchange"},
            {"id": "FM_EX_D05", "subtopic": "Business Transaction", "prompt": "Generate international business deal", "learning_objective": "Handle business currency transactions"}
        ]
    }
}

SALARIES_WAGES = {
    "subtopic": "Salaries and Wages",
    "description": "Wages, overtime, bonuses, and deductions",
    "prompts": {
        "easy": [
            {"id": "FM_SW_E01", "subtopic": "Hourly Wage", "prompt": "Generate hourly wage calculation", "learning_objective": "Calculate hourly wages"},
            {"id": "FM_SW_E02", "subtopic": "Weekly Wage", "prompt": "Generate weekly wage question", "learning_objective": "Calculate weekly wages"},
            {"id": "FM_SW_E03", "subtopic": "Basic Pay", "prompt": "Generate basic pay question", "learning_objective": "Calculate basic pay"},
            {"id": "FM_SW_E04", "subtopic": "Simple Overtime", "prompt": "Generate simple overtime", "learning_objective": "Calculate overtime pay"},
            {"id": "FM_SW_E05", "subtopic": "Daily Rate", "prompt": "Generate daily rate question", "learning_objective": "Convert wages to daily rate"}
        ],
        "medium": [
            {"id": "FM_SW_M01", "subtopic": "Overtime Rates", "prompt": "Generate time-and-half overtime", "learning_objective": "Calculate various overtime rates"},
            {"id": "FM_SW_M02", "subtopic": "Commission", "prompt": "Generate commission question", "learning_objective": "Calculate commission earnings"},
            {"id": "FM_SW_M03", "subtopic": "Gross to Net", "prompt": "Generate gross to net pay", "learning_objective": "Calculate net from gross pay"},
            {"id": "FM_SW_M04", "subtopic": "Bonuses", "prompt": "Generate bonus calculation", "learning_objective": "Calculate bonuses"},
            {"id": "FM_SW_M05", "subtopic": "Deductions", "prompt": "Generate deductions question", "learning_objective": "Calculate payroll deductions"}
        ],
        "difficult": [
            {"id": "FM_SW_D01", "subtopic": "Piece Work", "prompt": "Generate piece work calculation", "learning_objective": "Calculate piece-rate wages"},
            {"id": "FM_SW_D02", "subtopic": "Mixed Payment", "prompt": "Generate salary plus commission", "learning_objective": "Calculate mixed payment structures"},
            {"id": "FM_SW_D03", "subtopic": "Annual Earnings", "prompt": "Generate annual earnings question", "learning_objective": "Calculate annual earnings"},
            {"id": "FM_SW_D04", "subtopic": "Pay Rise", "prompt": "Generate pay rise calculation", "learning_objective": "Calculate pay increases"},
            {"id": "FM_SW_D05", "subtopic": "Complete Payslip", "prompt": "Generate complete payslip", "learning_objective": "Read and calculate payslips"}
        ]
    }
}

BILLS_BUDGETING = {
    "subtopic": "Bills and Budgeting",
    "description": "Utility bills and personal budgeting",
    "prompts": {
        "easy": [
            {"id": "FM_BB_E01", "subtopic": "Reading Meter", "prompt": "Generate meter reading question", "learning_objective": "Calculate usage from meter"},
            {"id": "FM_BB_E02", "subtopic": "Simple Bill", "prompt": "Generate simple utility bill", "learning_objective": "Calculate simple bills"},
            {"id": "FM_BB_E03", "subtopic": "Monthly Budget", "prompt": "Generate simple budget question", "learning_objective": "Create simple budget"},
            {"id": "FM_BB_E04", "subtopic": "Unit Rate", "prompt": "Generate unit rate question", "learning_objective": "Apply unit rates to bills"},
            {"id": "FM_BB_E05", "subtopic": "Standing Charge", "prompt": "Generate standing charge question", "learning_objective": "Include standing charges"}
        ],
        "medium": [
            {"id": "FM_BB_M01", "subtopic": "Electricity Bill", "prompt": "Generate electricity bill", "learning_objective": "Calculate electricity bills"},
            {"id": "FM_BB_M02", "subtopic": "Water Bill", "prompt": "Generate water bill", "learning_objective": "Calculate water bills"},
            {"id": "FM_BB_M03", "subtopic": "Tiered Rates", "prompt": "Generate tiered pricing", "learning_objective": "Apply tiered utility rates"},
            {"id": "FM_BB_M04", "subtopic": "Monthly Budget", "prompt": "Generate household budget", "learning_objective": "Plan household budget"},
            {"id": "FM_BB_M05", "subtopic": "Savings Goal", "prompt": "Generate savings target", "learning_objective": "Calculate savings requirements"}
        ],
        "difficult": [
            {"id": "FM_BB_D01", "subtopic": "Complete Budget", "prompt": "Generate complete budget plan", "learning_objective": "Create comprehensive budget"},
            {"id": "FM_BB_D02", "subtopic": "Cost Reduction", "prompt": "Generate cost reduction scenario", "learning_objective": "Plan cost reductions"},
            {"id": "FM_BB_D03", "subtopic": "Emergency Fund", "prompt": "Generate emergency fund planning", "learning_objective": "Plan emergency savings"},
            {"id": "FM_BB_D04", "subtopic": "Multiple Bills", "prompt": "Generate multiple bills scenario", "learning_objective": "Manage multiple utility bills"},
            {"id": "FM_BB_D05", "subtopic": "Annual Planning", "prompt": "Generate annual financial plan", "learning_objective": "Create annual financial plan"}
        ]
    }
}

INVESTMENTS = {
    "subtopic": "Investments",
    "description": "Savings and investment calculations",
    "prompts": {
        "easy": [
            {"id": "FM_IV_E01", "subtopic": "Savings Account", "prompt": "Generate savings account question", "learning_objective": "Calculate savings interest"},
            {"id": "FM_IV_E02", "subtopic": "Fixed Deposit", "prompt": "Generate fixed deposit question", "learning_objective": "Calculate fixed deposit returns"},
            {"id": "FM_IV_E03", "subtopic": "Simple Return", "prompt": "Generate simple return calculation", "learning_objective": "Calculate investment returns"},
            {"id": "FM_IV_E04", "subtopic": "Monthly Saving", "prompt": "Generate regular savings", "learning_objective": "Calculate regular savings growth"},
            {"id": "FM_IV_E05", "subtopic": "Interest Earned", "prompt": "Generate interest earned question", "learning_objective": "Calculate interest on savings"}
        ],
        "medium": [
            {"id": "FM_IV_M01", "subtopic": "Comparing Investments", "prompt": "Generate investment comparison", "learning_objective": "Compare investment options"},
            {"id": "FM_IV_M02", "subtopic": "Annual Returns", "prompt": "Generate annual return question", "learning_objective": "Calculate annual returns"},
            {"id": "FM_IV_M03", "subtopic": "Capital Growth", "prompt": "Generate capital growth question", "learning_objective": "Calculate capital growth"},
            {"id": "FM_IV_M04", "subtopic": "Dividend", "prompt": "Generate dividend question", "learning_objective": "Calculate dividends"},
            {"id": "FM_IV_M05", "subtopic": "Yield", "prompt": "Generate yield calculation", "learning_objective": "Calculate investment yield"}
        ],
        "difficult": [
            {"id": "FM_IV_D01", "subtopic": "Portfolio", "prompt": "Generate portfolio question", "learning_objective": "Analyze investment portfolio"},
            {"id": "FM_IV_D02", "subtopic": "Annuity", "prompt": "Generate annuity calculation", "learning_objective": "Calculate annuity payments"},
            {"id": "FM_IV_D03", "subtopic": "Total Return", "prompt": "Generate total return question", "learning_objective": "Calculate total investment return"},
            {"id": "FM_IV_D04", "subtopic": "Risk/Return", "prompt": "Generate risk/return question", "learning_objective": "Understand risk vs return"},
            {"id": "FM_IV_D05", "subtopic": "Retirement Planning", "prompt": "Generate retirement savings", "learning_objective": "Plan retirement savings"}
        ]
    }
}

BANK_STATEMENTS = {
    "subtopic": "Bank Statements",
    "description": "Reading and interpreting bank statements",
    "prompts": {
        "easy": [
            {"id": "FM_BS_E01", "subtopic": "Reading Statement", "prompt": "Generate reading statement question", "learning_objective": "Read bank statements"},
            {"id": "FM_BS_E02", "subtopic": "Finding Balance", "prompt": "Generate finding balance question", "learning_objective": "Calculate running balance"},
            {"id": "FM_BS_E03", "subtopic": "Deposits", "prompt": "Generate total deposits question", "learning_objective": "Sum deposits"},
            {"id": "FM_BS_E04", "subtopic": "Withdrawals", "prompt": "Generate total withdrawals", "learning_objective": "Sum withdrawals"},
            {"id": "FM_BS_E05", "subtopic": "Statement Terms", "prompt": "Generate terminology question", "learning_objective": "Understand banking terms"}
        ],
        "medium": [
            {"id": "FM_BS_M01", "subtopic": "Bank Charges", "prompt": "Generate bank charges question", "learning_objective": "Identify bank charges"},
            {"id": "FM_BS_M02", "subtopic": "Overdraft", "prompt": "Generate overdraft question", "learning_objective": "Understand overdraft"},
            {"id": "FM_BS_M03", "subtopic": "Interest Calculation", "prompt": "Generate statement interest", "learning_objective": "Calculate interest on balance"},
            {"id": "FM_BS_M04", "subtopic": "Reconciliation", "prompt": "Generate reconciliation question", "learning_objective": "Reconcile bank statement"},
            {"id": "FM_BS_M05", "subtopic": "Error Finding", "prompt": "Generate finding errors", "learning_objective": "Identify statement errors"}
        ],
        "difficult": [
            {"id": "FM_BS_D01", "subtopic": "Complete Statement", "prompt": "Generate complete statement analysis", "learning_objective": "Analyze complete statement"},
            {"id": "FM_BS_D02", "subtopic": "Missing Entries", "prompt": "Generate finding missing entries", "learning_objective": "Find missing transactions"},
            {"id": "FM_BS_D03", "subtopic": "Average Balance", "prompt": "Generate average balance question", "learning_objective": "Calculate average balance"},
            {"id": "FM_BS_D04", "subtopic": "Cash Flow", "prompt": "Generate cash flow analysis", "learning_objective": "Analyze cash flow"},
            {"id": "FM_BS_D05", "subtopic": "Financial Health", "prompt": "Generate financial health analysis", "learning_objective": "Assess financial health"}
        ]
    }
}

# ============================================================================
# EXPORT ALL SUBTOPICS
# ============================================================================

FINANCIAL_MATH_PROMPTS = [
    SIMPLE_INTEREST,
    COMPOUND_INTEREST,
    DEPRECIATION,
    PROFIT_AND_LOSS,
    DISCOUNT,
    TAXATION,
    HIRE_PURCHASE,
    EXCHANGE_RATES,
    SALARIES_WAGES,
    BILLS_BUDGETING,
    INVESTMENTS,
    BANK_STATEMENTS
]

def get_prompt_count():
    """Count total prompts in this module."""
    total = 0
    for subtopic in FINANCIAL_MATH_PROMPTS:
        for difficulty in ["easy", "medium", "difficult"]:
            total += len(subtopic["prompts"].get(difficulty, []))
    return total

def get_all_prompts():
    """Get all prompts organized by subtopic and difficulty."""
    return FINANCIAL_MATH_PROMPTS
