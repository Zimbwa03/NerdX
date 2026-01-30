// Computer Science Notes - Main Entry Point
// Topics and exports for O-Level Computer Science

import { TopicNotes } from './types';

// Export types
export { TopicNotes, NotesSection } from './types';

const CS_DIAGRAMS = {
    hardwareIpo: require('../../../assets/diagrams/cs_hardwareIpo.png'),
    cpuCycle: require('../../../assets/diagrams/cs_cpuCycle.png'),
    softwareTypes: require('../../../assets/diagrams/cs_softwareTypes.png'),
    applications: require('../../../assets/diagrams/cs_applications.png'),
    infoSystem: require('../../../assets/diagrams/cs_infoSystem.png'),
    controlLoop: require('../../../assets/diagrams/cs_controlLoop.png'),
    techImpact: require('../../../assets/diagrams/cs_techImpact.png'),
    numberBases: require('../../../assets/diagrams/cs_numberBases.png'),
    numberConversions: require('../../../assets/diagrams/cs_numberConversions.png'),
    logicGates: require('../../../assets/diagrams/cs_logicGates.png'),
    networkTopologies: require('../../../assets/diagrams/cs_networkTopologies.png'),
    networkDevices: require('../../../assets/diagrams/cs_networkDevices.png'),
    tcpIpStack: require('../../../assets/diagrams/cs_tcpIpStack.png'),
    networkPerformance: require('../../../assets/diagrams/cs_networkPerformance.png'),
    ciaTriad: require('../../../assets/diagrams/cs_ciaTriad.png'),
    securityLayers: require('../../../assets/diagrams/cs_securityLayers.png'),
    ethicsBalance: require('../../../assets/diagrams/cs_ethicsBalance.png'),
    dataLifecycle: require('../../../assets/diagrams/cs_dataLifecycle.png'),
    sdlcOverview: require('../../../assets/diagrams/cs_sdlcOverview.png'),
    telosFeasibility: require('../../../assets/diagrams/cs_telosFeasibility.png'),
    modelingTools: require('../../../assets/diagrams/cs_modelingTools.png'),
    systemDesign: require('../../../assets/diagrams/cs_systemDesign.png'),
    testingCycle: require('../../../assets/diagrams/cs_testingCycle.png'),
    algorithmSteps: require('../../../assets/diagrams/cs_algorithmSteps.png'),
    flowchartSymbols: require('../../../assets/diagrams/cs_flowchartSymbols.png'),
    programmingStructures: require('../../../assets/diagrams/cs_programmingStructures.png'),
    variablesMemory: require('../../../assets/diagrams/cs_variablesMemory.png'),
    operatorTypes: require('../../../assets/diagrams/cs_operatorTypes.png'),
    translatorsPipeline: require('../../../assets/diagrams/cs_translatorsPipeline.png'),
    relationalModel: require('../../../assets/diagrams/cs_relationalModel.png'),
    sqlCrud: require('../../../assets/diagrams/cs_sqlCrud.png'),
    internetVsWeb: require('../../../assets/diagrams/cs_internetVsWeb.png'),
    webStack: require('../../../assets/diagrams/cs_webStack.png'),
    webDesignPrinciples: require('../../../assets/diagrams/cs_webDesignPrinciples.png'),
    internetServices: require('../../../assets/diagrams/cs_internetServices.png'),
    mlPipeline: require('../../../assets/diagrams/cs_mlPipeline.png'),
    iotCloud: require('../../../assets/diagrams/cs_iotCloud.png'),
    emergingTech: require('../../../assets/diagrams/cs_emergingTech.png'),
};

        System -> {OS Utilities Drivers};
        Application -> {WordProcessor Spreadsheet Browser};
    }`),
    applications: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Computer -> {Education Health Banking Transport Agriculture Manufacturing Government Business};
    }`),
    infoSystem: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        InformationSystem [shape=ellipse,label=\"Information System\"];
        InformationSystem -> {People Data Process Hardware Software};
    }`),
    controlLoop: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Sensors -> Controller -> Actuators -> Environment;
        Environment -> Sensors [label=\"feedback\"];
    }`),
    techImpact: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Technology -> Benefits -> Society;
        Technology -> Challenges -> Society;
    }`),
    numberBases: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Binary [label=\"Binary (base 2)\"];
        Decimal [label=\"Decimal (base 10)\"];
        Hex [label=\"Hex (base 16)\"];
        Binary -> Decimal -> Hex;
    }`),
    numberConversions: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Binary -> Decimal [dir=both];
        Decimal -> Hex [dir=both];
        Binary -> Hex [style=dashed];
    }`),
    logicGates: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        LogicGates [shape=ellipse,label=\"Logic Gates\"];
        LogicGates -> {AND OR NOT NAND NOR XOR};
    }`),
    networkTopologies: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Topologies [shape=ellipse,label=\"Topologies\"];
        Topologies -> {Star Bus Ring Mesh};
    }`),
    networkDevices: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Device -> Switch -> Router -> Internet;
        Modem -> Internet;
        AccessPoint -> Switch;
    }`),
    tcpIpStack: graphvizUrl(`digraph{
        rankdir=TB;
        node [shape=box, style=rounded];
        Application -> Transport -> Internet -> Link;
    }`),
    networkPerformance: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Bandwidth -> Throughput;
        Latency -> Throughput;
        PacketLoss -> Throughput;
    }`),
    ciaTriad: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Security [shape=ellipse,label=\"Security Goals\"];
        Security -> {Confidentiality Integrity Availability};
    }`),
    securityLayers: graphvizUrl(`digraph{
        rankdir=TB;
        node [shape=box, style=rounded];
        Security -> {Physical Network Application Data};
    }`),
    ethicsBalance: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Ethics -> {Privacy \"Intellectual Property\" \"Responsible Use\"};
    }`),
    dataLifecycle: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Collect -> Store -> Use -> Share -> Dispose;
    }`),
    sdlcOverview: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Analysis -> Design -> Implementation -> Testing -> Deployment -> Maintenance -> Analysis;
    }`),
    telosFeasibility: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        TELOS [shape=ellipse,label=\"Feasibility\"];
        TELOS -> {Technical Economic Legal Operational Schedule};
    }`),
    modelingTools: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Modeling -> {DFD ERD Flowchart IPO};
    }`),
    systemDesign: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Inputs -> Processing -> Outputs;
        Processing -> Database;
        Processing -> UI;
    }`),
    testingCycle: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Unit -> Integration -> System -> UAT;
    }`),
    algorithmSteps: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Start -> Step1 -> Step2 -> Output -> End;
    }`),
    flowchartSymbols: graphvizUrl(`digraph{
        rankdir=LR;
        Start [shape=oval,label=\"Start/End\"];
        Process [shape=box,label=\"Process\"];
        Decision [shape=diamond,label=\"Decision\"];
        Input [shape=parallelogram,label=\"Input/Output\"];
        Start -> Process -> Decision -> Input;
    }`),
    programmingStructures: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Structures [shape=ellipse,label=\"Structures\"];
        Structures -> {Sequence Selection Iteration};
    }`),
    variablesMemory: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Variable -> Memory -> Value;
    }`),
    operatorTypes: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Operators [shape=ellipse];
        Operators -> {Arithmetic Comparison Logical};
    }`),
    translatorsPipeline: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        SourceCode -> {Compiler Interpreter Assembler};
        Compiler -> MachineCode;
        Interpreter -> Output;
        Assembler -> MachineCode;
    }`),
    relationalModel: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Students [label=\"Students (PK: StudentID)\"];
        Courses [label=\"Courses (PK: CourseID)\"];
        Enroll [label=\"Enrollments (FK: StudentID, CourseID)\"];
        Students -> Enroll;
        Courses -> Enroll;
    }`),
    sqlCrud: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        SQL -> {Create Read Update Delete};
    }`),
    internetVsWeb: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Internet [shape=ellipse];
        Internet -> {Web Email FTP};
    }`),
    webStack: graphvizUrl(`digraph{
        rankdir=TB;
        node [shape=box, style=rounded];
        HTML -> CSS -> JavaScript -> Browser;
    }`),
    webDesignPrinciples: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Design -> {Usability Readability Navigation Accessibility Performance};
    }`),
    internetServices: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Services [shape=ellipse,label=\"Internet Services\"];
        Services -> {Email FTP VoIP Cloud Ecommerce \"Social Media\" Search};
    }`),
    mlPipeline: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Data -> Train -> Model -> Prediction;
    }`),
    iotCloud: graphvizUrl(`digraph{
        rankdir=LR;
        node [shape=box, style=rounded];
        Devices -> Gateway -> Cloud -> Apps;
    }`),
    emergingTech: graphvizUrl(`digraph{
        node [shape=box, style=rounded];
        Emerging -> {Robotics \"3D Printing\" Biometrics \"VR/AR\" Blockchain};
    }`),
};

// ZIMSEC O-Level Computer Science 7014 — 11 topics (theory; practical in Virtual Labs)
export const computerScienceTopics: string[] = [
    "Hardware and Software",
    "Application of Computer Science",
    "Data Representation",
    "Communication Networks and Internet Technologies",
    "Security and Ethics",
    "Systems Analysis and Design",
    "Algorithm Design and Problem-Solving",
    "Programming",
    "Databases",
    "Web Design and Internet Uses",
    "Automated and Emerging Technologies",
];

// Computer Science Notes - Basic structure for each topic
export const computerScienceNotes: Record<string, TopicNotes> = {
    "Hardware and Software": {
        topic: "Hardware and Software",
        subject: "Computer Science",
        summary: "Understanding the physical components of computers and the software that runs on them.",
        sections: [
            {
                title: "Hardware Components",
                content: `Hardware refers to the physical components of a computer system that you can touch and see.

**Input Devices** - Used to enter data into the computer:
- Keyboard, Mouse, Scanner, Microphone, Webcam, Touchscreen, Barcode reader

**Output Devices** - Used to display or present processed data:
- Monitor, Printer, Speakers, Projector, Headphones

**Storage Devices** - Used to store data permanently:
- Hard Disk Drive (HDD), Solid State Drive (SSD), USB Flash Drive, Optical discs (CD/DVD/Blu-ray), Cloud storage

**Processing Devices**:
- CPU (Central Processing Unit) - the "brain" of the computer
- RAM (Random Access Memory) - temporary working memory
- GPU (Graphics Processing Unit) - processes graphics`,
                diagrams: [CS_DIAGRAMS.hardwareIpo],
            },
            {
                title: "The CPU",
                content: `The CPU (Central Processing Unit) is the main processor that executes instructions.

**Components of the CPU:**
- **ALU (Arithmetic Logic Unit)**: Performs calculations and logical operations
- **CU (Control Unit)**: Controls the sequence of operations
- **Registers**: Small, fast storage locations within the CPU

**The Fetch-Decode-Execute Cycle:**
1. **Fetch**: The next instruction is fetched from memory
2. **Decode**: The instruction is decoded to understand what action is needed
3. **Execute**: The instruction is carried out`,
                diagrams: [CS_DIAGRAMS.cpuCycle],
            },
            {
                title: "Software Types",
                content: `Software is the set of instructions that tell the hardware what to do.

**System Software:**
- Operating Systems (Windows, macOS, Linux, Android, iOS)
- Utility programs (antivirus, disk cleanup, backup software)
- Device drivers (software that allows OS to communicate with hardware)

**Application Software:**
- Word processors (Microsoft Word, Google Docs)
- Spreadsheets (Microsoft Excel, Google Sheets)
- Databases (Microsoft Access, MySQL)
- Graphics software (Photoshop, GIMP)
- Web browsers (Chrome, Firefox, Safari)`,
                diagrams: [CS_DIAGRAMS.softwareTypes],
            }
        ],
        key_points: [
            "Hardware is physical, software is logical/programs",
            "CPU components: ALU, CU, and Registers",
            "Fetch-Decode-Execute cycle describes how CPU processes instructions",
            "System software manages the computer, application software helps users perform tasks",
            "Input devices receive data, output devices display results"
        ],
        exam_tips: [
            "Be able to classify devices as input, output, or storage",
            "Know the difference between system and application software with examples",
            "Understand each stage of the Fetch-Decode-Execute cycle",
            "Remember the functions of different CPU components"
        ]
    },
    "Application of Computer Science": {
        topic: "Application of Computer Science",
        subject: "Computer Science",
        summary: "How computer systems are applied in real-life sectors to improve efficiency, accuracy, and decision-making.",
        sections: [
            {
                title: "Overview of Applications",
                content: `Computer science is applied to solve real-world problems by collecting, processing, and communicating information.

**Common application areas and examples:**
- **Education**: e-learning platforms, online assessments, digital libraries, learning analytics
- **Health**: electronic health records (EHR), diagnostic systems, telemedicine, hospital management systems
- **Banking and Finance**: ATMs, mobile banking, fraud detection, online payments
- **Transport**: GPS navigation, traffic management systems, booking systems, logistics tracking
- **Agriculture**: precision farming, irrigation control, market price information systems
- **Manufacturing**: robotics, CAD/CAM, automated quality control
- **Government**: e-services, national ID systems, tax processing, voter registration
- **Retail and Business**: stock control, point-of-sale (POS), customer relationship management (CRM)`,
                diagrams: [CS_DIAGRAMS.applications],
            },
            {
                title: "Information Systems in Organizations",
                content: `An information system combines **people, data, processes, hardware, and software** to support operations and decision-making.

**Types of information systems:**
- **Transaction Processing Systems (TPS)**: handle routine transactions (sales, payroll, inventory)
- **Management Information Systems (MIS)**: produce regular reports for managers
- **Decision Support Systems (DSS)**: analyze data to support complex decisions
- **Executive Support Systems (ESS)**: high-level dashboards for strategic decisions

**Data processing methods:**
- **Batch processing**: data collected over time then processed together (e.g., monthly billing)
- **Real-time processing**: immediate processing as data arrives (e.g., ATM withdrawals)
- **Online processing**: users interact directly with the system via terminals or web`,
                diagrams: [CS_DIAGRAMS.infoSystem],
            },
            {
                title: "Automation, Control, and Embedded Systems",
                content: `Computer systems are used to control physical processes using sensors and actuators.

**Key concepts:**
- **Sensors** capture data (temperature, pressure, motion, light)
- **Controllers** process inputs using programmed rules
- **Actuators** perform actions (motors, valves, alarms)

**Examples:**
- Automatic traffic lights and railway crossings
- Industrial robots and conveyor systems
- Smart home systems (security, lighting, temperature)

**Benefits and challenges:**
- **Benefits**: speed, accuracy, safety, 24/7 operation
- **Challenges**: job displacement, cost, system failures, maintenance needs`,
                diagrams: [CS_DIAGRAMS.controlLoop],
            },
            {
                title: "Social and Economic Impact",
                content: `Computer science applications change how people live and work.

**Positive impacts:**
- Increased productivity and accuracy
- Improved access to services (banking, education, health)
- Faster communication and global connectivity

**Negative impacts:**
- **Digital divide**: unequal access to technology
- Privacy concerns due to large-scale data collection
- Over-reliance on technology and reduced human skills`,
                diagrams: [CS_DIAGRAMS.techImpact],
            }
        ],
        key_points: [
            "Computer applications solve real-world problems across many sectors",
            "Information systems combine people, processes, data, and technology",
            "TPS, MIS, DSS, and ESS support different levels of decision-making",
            "Automation uses sensors, controllers, and actuators to manage processes",
            "Technology brings both benefits and social challenges"
        ],
        exam_tips: [
            "Use sector-based examples when explaining applications",
            "Differentiate between TPS, MIS, DSS, and ESS with clear use-cases",
            "Explain batch vs real-time processing with suitable examples",
            "State both advantages and disadvantages of computerization",
            "Remember that applications are about solving problems, not just using devices"
        ]
    },
    "Data Representation": {
        topic: "Data Representation",
        subject: "Computer Science",
        summary: "How computers store and represent different types of data using binary, denary, and hexadecimal systems.",
        sections: [
            {
                title: "Number Systems",
                content: `Computers use different number systems to represent data.

**Binary (Base 2)**: Uses only 0 and 1
- Example: 1101 (binary) = 13 (denary)

**Denary/Decimal (Base 10)**: Our everyday number system using 0-9
- Example: 255

**Hexadecimal (Base 16)**: Uses 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15)
- Example: FF (hex) = 255 (denary)`,
                diagrams: [CS_DIAGRAMS.numberBases],
            },
            {
                title: "Number Conversions",
                content: `**Binary to Denary:**
Each position represents a power of 2: 128, 64, 32, 16, 8, 4, 2, 1
Example: 1101 = 8 + 4 + 0 + 1 = 13

**Denary to Binary:**
Divide by 2 repeatedly and record remainders
Example: 13 ÷ 2 = 6 r1, 6 ÷ 2 = 3 r0, 3 ÷ 2 = 1 r1, 1 ÷ 2 = 0 r1 → 1101

**Hexadecimal to Binary:**
Each hex digit = 4 binary bits
Example: A3 = 1010 0011`,
                diagrams: [CS_DIAGRAMS.numberConversions],
            },
            {
                title: "Logic Gates",
                content: `Logic gates process binary inputs to produce outputs.

**AND Gate**: Output is 1 only if BOTH inputs are 1
**OR Gate**: Output is 1 if EITHER input is 1
**NOT Gate**: Inverts the input (1 becomes 0, 0 becomes 1)
**NAND Gate**: NOT AND - opposite of AND
**NOR Gate**: NOT OR - opposite of OR
**XOR Gate**: Output is 1 if inputs are DIFFERENT

Logic gates can be combined to create complex circuits.`,
                diagrams: [CS_DIAGRAMS.logicGates],
            }
        ],
        key_points: [
            "Binary uses only 0 and 1 (base 2)",
            "Hexadecimal uses 0-9 and A-F (base 16)",
            "1 byte = 8 bits, can store values 0-255",
            "Logic gates: AND, OR, NOT, NAND, NOR, XOR",
            "Truth tables show all possible input/output combinations"
        ],
        exam_tips: [
            "Practice conversions between binary, denary, and hexadecimal",
            "Know the truth tables for all basic logic gates",
            "Binary addition: 1+1=10 (carry the 1)",
            "Remember: 1 nibble = 4 bits = 1 hex digit"
        ]
    },
    "Communication Networks and Internet Technologies": {
        topic: "Communication Networks and Internet Technologies",
        subject: "Computer Science",
        summary: "How computers connect, share data, and use Internet services through network devices and protocols.",
        sections: [
            {
                title: "Network Types and Topologies",
                content: `A network is a group of computers/devices connected to share resources and data.

**Network types:**
- **LAN** (Local Area Network): small area like a lab, school, or office
- **WAN** (Wide Area Network): large area, connects LANs across cities or countries
- **MAN** (Metropolitan Area Network): city-wide network
- **PAN** (Personal Area Network): short range (e.g., Bluetooth)

**Topologies:**
- **Star**: all devices connect to a central switch/hub
- **Bus**: all devices share one main cable
- **Ring**: devices connected in a circle
- **Mesh**: multiple paths between devices for reliability

**Factors affecting choice:** cost, reliability, scalability, and ease of maintenance.`,
                diagrams: [CS_DIAGRAMS.networkTopologies],
            },
            {
                title: "Network Devices and Transmission Media",
                content: `**Devices:**
- **Switch**: connects devices in a LAN using MAC addresses
- **Router**: connects different networks and routes data using IP addresses
- **Hub**: simple device that sends data to all ports (less secure)
- **Modem**: converts digital signals to analog and back for Internet access
- **Access Point**: provides wireless connectivity

**Transmission media:**
- **Twisted pair (UTP/STP)**: common for LANs, low cost
- **Coaxial cable**: better shielding, used in cable TV
- **Fiber optic**: very fast, long distance, immune to interference
- **Wireless**: Wi-Fi, Bluetooth, cellular; convenient but more interference`,
                diagrams: [CS_DIAGRAMS.networkDevices],
            },
            {
                title: "Internet Technologies and Protocols",
                content: `The Internet uses a set of protocols (TCP/IP) to move data between devices.

**Key protocols and services:**
- **IP (Internet Protocol)**: addressing and routing
- **TCP (Transmission Control Protocol)**: reliable data delivery
- **HTTP/HTTPS**: web pages and secure web communication
- **FTP**: file transfer
- **SMTP/POP3/IMAP**: email sending and receiving
- **DNS**: converts domain names to IP addresses

**Web concepts:**
- **URL**: address of a resource on the web
- **Web browser**: software to access web pages
- **Search engine**: service that finds information on the web`,
                diagrams: [CS_DIAGRAMS.tcpIpStack],
            },
            {
                title: "Network Performance and Reliability",
                content: `**Performance factors:**
- **Bandwidth**: amount of data that can be transmitted per second
- **Latency**: delay between sending and receiving data
- **Throughput**: actual rate of data transfer
- **Packet loss**: data not reaching its destination

**Reliability measures:**
- Backups and redundant links
- Error detection and correction (parity, checksums)
- Proper configuration and maintenance`,
                diagrams: [CS_DIAGRAMS.networkPerformance],
            }
        ],
        key_points: [
            "LAN, WAN, MAN, and PAN serve different geographic ranges",
            "Star topology is common due to reliability and ease of expansion",
            "Switches use MAC addresses; routers use IP addresses",
            "TCP/IP is the core protocol suite of the Internet",
            "Bandwidth and latency determine network performance"
        ],
        exam_tips: [
            "Be able to compare topologies using advantages and disadvantages",
            "Explain the role of common devices like switch, router, and modem",
            "Use real-life examples when describing Internet services",
            "Know the purpose of DNS, HTTP/HTTPS, and email protocols",
            "Use correct terms: bandwidth, latency, throughput"
        ]
    },
    "Security and Ethics": {
        topic: "Security and Ethics",
        subject: "Computer Science",
        summary: "Protecting computer systems and data while using technology responsibly and ethically.",
        sections: [
            {
                title: "Security Goals and Threats",
                content: `The main security goals are **Confidentiality, Integrity, and Availability (CIA)**.

**Common threats:**
- **Malware**: viruses, worms, trojans, spyware, ransomware
- **Phishing**: tricking users to reveal passwords or personal data
- **Hacking/unauthorized access**: breaking into systems
- **Social engineering**: manipulating people to gain access
- **Physical threats**: theft, fire, power failure, water damage`,
                diagrams: [CS_DIAGRAMS.ciaTriad],
            },
            {
                title: "Protection Measures",
                content: `**Technical measures:**
- **Authentication**: passwords, biometrics, two-factor authentication (2FA)
- **Authorization**: user access rights and permissions
- **Encryption**: converts data into unreadable form for security
- **Firewalls**: control incoming/outgoing network traffic
- **Anti-malware**: detect and remove malicious software
- **Regular updates**: patch security vulnerabilities

**Physical measures:**
- Locked server rooms, CCTV, access cards
- Backup power supplies (UPS)

**Data protection measures:**
- **Backups**: full, incremental, and differential
- **Disaster recovery plans**: procedures for restoring systems after failure`,
                diagrams: [CS_DIAGRAMS.securityLayers],
            },
            {
                title: "Ethics and Responsible Use",
                content: `Ethics covers how technology should be used to respect people and society.

**Key ethical issues:**
- **Privacy**: personal data should be collected and used responsibly
- **Intellectual property**: respect copyright, patents, and licensing
- **Software piracy**: illegal copying or distribution of software
- **Plagiarism**: presenting someone else's work as your own
- **Cyberbullying**: harming others using digital tools

**Responsible behavior:**
- Use strong passwords and keep them private
- Verify sources before sharing information
- Follow school, workplace, and national ICT policies`,
                diagrams: [CS_DIAGRAMS.ethicsBalance],
            },
            {
                title: "Data Protection and Legal Considerations",
                content: `Many countries have data protection laws that require organizations to:
- Collect only necessary data
- Store data securely
- Use data only for stated purposes
- Allow individuals to access and correct their data

Failing to follow these rules can lead to legal penalties and loss of trust.`,
                diagrams: [CS_DIAGRAMS.dataLifecycle],
            }
        ],
        key_points: [
            "Security is based on confidentiality, integrity, and availability",
            "Threats include malware, phishing, hacking, and physical damage",
            "Protection includes technical, physical, and administrative measures",
            "Ethical use requires respect for privacy and intellectual property",
            "Backups and disaster recovery keep systems available"
        ],
        exam_tips: [
            "Explain the difference between authentication and authorization",
            "Give examples of different malware types and their effects",
            "State both security measures and why they are needed",
            "Link ethical issues to real-world consequences",
            "Remember the CIA triad and use it in explanations"
        ]
    },
    "Systems Analysis and Design": {
        topic: "Systems Analysis and Design",
        subject: "Computer Science",
        summary: "How to investigate, design, implement, and maintain computer-based systems that solve real problems.",
        sections: [
            {
                title: "Systems Analysis: Understanding the Problem",
                content: `Systems analysis is the process of studying an existing system to understand how it works and what must be improved.

**Key tasks in analysis:**
- **Define the problem** clearly (what is wrong, where, and why)
- **Identify stakeholders** (users, managers, customers, technicians)
- **Collect requirements** (what the new system must do)

**Fact-finding methods:**
- **Interviews**: deep, detailed information from key users
- **Questionnaires**: reach many users quickly with standard questions
- **Observation**: see how tasks are actually done
- **Document analysis**: study forms, reports, policies, and logs
- **Sampling**: analyze a subset of records to understand patterns`,
                diagrams: [CS_DIAGRAMS.sdlcOverview],
            },
            {
                title: "Feasibility and Requirements",
                content: `Before building a system, check if it is **feasible**.

**Feasibility (TELOS):**
- **Technical**: do we have the hardware, software, and skills?
- **Economic**: are the costs justified by the benefits?
- **Legal**: does it comply with laws (data protection, copyright)?
- **Operational**: will users accept and use it?
- **Schedule**: can it be completed on time?

**Requirements types:**
- **Functional requirements**: what the system must do (e.g., calculate totals, print receipts)
- **Non-functional requirements**: performance, security, usability, reliability, backup, response time`,
                diagrams: [CS_DIAGRAMS.telosFeasibility],
            },
            {
                title: "System Modeling Tools",
                content: `Models help explain how data flows and how processes work.

**Common tools:**
- **Data Flow Diagrams (DFD)**: show inputs, processes, data stores, and outputs
  - **Level 0**: overall system
  - **Level 1**: detailed processes
- **Flowcharts**: show step-by-step logic of a process
- **IPO charts (Input-Process-Output)**: simple overview of tasks
- **Entity-Relationship Diagrams (ERD)**: show data entities and relationships

**Why models matter:**
- They help analysts communicate clearly with users
- They reduce misunderstandings before coding starts`,
                diagrams: [CS_DIAGRAMS.modelingTools],
            },
            {
                title: "Systems Design",
                content: `Systems design turns requirements into a plan for building the system.

**Design areas:**
- **Input design**: forms, screens, validation rules (range, type, presence)
- **Output design**: reports, dashboards, print layouts
- **File/database design**: tables, fields, keys, relationships
- **Processing design**: algorithms and workflows
- **User interface design**: usability, navigation, consistency

**Good design principles:**
- Accuracy and simplicity
- Clear feedback to users
- Security and access control`,
                diagrams: [CS_DIAGRAMS.systemDesign],
            },
            {
                title: "Testing, Implementation, and Maintenance",
                content: `**Testing types:**
- **Unit testing**: each component works correctly
- **Integration testing**: components work together
- **System testing**: full system works as expected
- **User acceptance testing (UAT)**: users confirm it meets their needs

**Implementation methods:**
- **Direct changeover**: old system replaced immediately
- **Parallel running**: old and new run together for a period
- **Phased implementation**: system introduced in stages
- **Pilot**: new system tested in one branch/department first

**Documentation:**
- **Technical**: for programmers and system maintenance
- **User**: for training and daily use

**Maintenance types:**
- **Corrective**: fix errors
- **Adaptive**: adjust to new requirements
- **Perfective**: improve performance/features
- **Preventive**: reduce future failures`,
                diagrams: [CS_DIAGRAMS.testingCycle],
            }
        ],
        key_points: [
            "Systems analysis investigates problems and gathers requirements",
            "Feasibility checks technical, economic, legal, operational, and schedule factors",
            "Models like DFDs and ERDs describe data and process flow",
            "Design covers inputs, outputs, databases, processing, and user interface",
            "Testing, implementation, documentation, and maintenance ensure success"
        ],
        exam_tips: [
            "Use TELOS when explaining feasibility",
            "Distinguish functional vs non-functional requirements clearly",
            "Label DFD symbols correctly: process, data store, data flow, external entity",
            "Compare implementation methods using advantages and disadvantages",
            "Mention at least two testing types in system questions"
        ]
    },
    "Algorithm Design and Problem-Solving": {
        topic: "Algorithm Design and Problem-Solving",
        subject: "Computer Science",
        summary: "Developing step-by-step solutions using flowcharts, pseudocode, and programming structures.",
        sections: [
            {
                title: "What is an Algorithm?",
                content: `An algorithm is a step-by-step procedure for solving a problem.

**Characteristics of good algorithms:**
- Clear and precise steps
- Finite - must terminate
- Effective - each step is doable
- Input - takes zero or more inputs
- Output - produces at least one output`,
                diagrams: [CS_DIAGRAMS.algorithmSteps],
            },
            {
                title: "Flowcharts",
                content: `Flowcharts use symbols to represent algorithms visually.

**Flowchart Symbols:**
- **Oval/Terminator**: Start/End
- **Rectangle**: Process/Action
- **Diamond**: Decision (Yes/No)
- **Parallelogram**: Input/Output
- **Arrow**: Flow direction`,
                diagrams: [CS_DIAGRAMS.flowchartSymbols],
            },
            {
                title: "Programming Structures",
                content: `**Sequence**: Steps executed one after another in order

**Selection (IF-THEN-ELSE)**:
\`\`\`
IF condition THEN
    action1
ELSE
    action2
ENDIF
\`\`\`

**Iteration (Loops)**:
- FOR loop: Repeats a fixed number of times
- WHILE loop: Repeats while condition is true
- REPEAT-UNTIL: Repeats until condition becomes true`,
                diagrams: [CS_DIAGRAMS.programmingStructures],
            }
        ],
        key_points: [
            "Algorithms are step-by-step problem solutions",
            "Flowcharts use standard symbols to represent algorithms",
            "Three main structures: Sequence, Selection, Iteration",
            "FOR loops have a known number of iterations",
            "WHILE loops may not execute at all if condition is false initially"
        ],
        exam_tips: [
            "Always use correct flowchart symbols",
            "Trace tables help verify algorithm correctness",
            "Pseudocode should be language-independent",
            "Check boundary conditions when testing algorithms"
        ]
    },
    "Programming": {
        topic: "Programming",
        subject: "Computer Science",
        summary: "Writing code using variables, data types, control structures, and functions.",
        sections: [
            {
                title: "Variables and Data Types",
                content: `**Variables** store data that can change during program execution.

**Common Data Types:**
- **Integer**: Whole numbers (e.g., 42, -7)
- **Real/Float**: Decimal numbers (e.g., 3.14, -0.5)
- **String**: Text (e.g., "Hello World")
- **Boolean**: True or False
- **Character**: Single letter/symbol (e.g., 'A')

**Constants**: Values that don't change during execution (e.g., PI = 3.14159)`,
                diagrams: [CS_DIAGRAMS.variablesMemory],
            },
            {
                title: "Operators",
                content: `**Arithmetic Operators:**
+ (addition), - (subtraction), * (multiplication), / (division)
MOD (remainder), DIV (integer division)

**Comparison Operators:**
= (equal), <> (not equal), < (less than), > (greater than)
<= (less than or equal), >= (greater than or equal)

**Logical Operators:**
AND, OR, NOT`,
                diagrams: [CS_DIAGRAMS.operatorTypes],
            },
            {
                title: "Translators",
                content: `Translators convert source code into machine code.

**Compiler**: Translates entire program at once, creates executable file
- Faster execution after compilation
- Errors shown after full compilation

**Interpreter**: Translates and executes line by line
- Slower execution
- Errors shown immediately, easier debugging

**Assembler**: Translates assembly language to machine code`,
                diagrams: [CS_DIAGRAMS.translatorsPipeline],
            }
        ],
        key_points: [
            "Variables store changeable data, constants don't change",
            "Choose appropriate data types for efficiency",
            "MOD gives remainder, DIV gives integer division",
            "Compilers translate all at once, interpreters line by line",
            "Functions/procedures help organize and reuse code"
        ],
        exam_tips: [
            "Always declare variable data types appropriately",
            "Know the difference between compiler and interpreter",
            "Use meaningful variable names",
            "Test programs with normal, boundary, and erroneous data"
        ]
    },
    "Databases": {
        topic: "Databases",
        subject: "Computer Science",
        summary: "Creating, querying, and managing structured collections of data.",
        sections: [
            {
                title: "Database Concepts",
                content: `A database is an organized collection of structured data.

**Key Terms:**
- **Table**: Collection of related records
- **Record**: A single row containing data about one entity
- **Field**: A single item of data (column)
- **Primary Key**: Unique identifier for each record
- **Foreign Key**: Links records between tables`,
                diagrams: [CS_DIAGRAMS.relationalModel],
            },
            {
                title: "SQL Basics",
                content: `SQL (Structured Query Language) is used to interact with databases.

**SELECT**: Retrieve data
\`\`\`sql
SELECT FirstName, Surname FROM Students WHERE Age > 16
\`\`\`

**INSERT**: Add new records
\`\`\`sql
INSERT INTO Students (FirstName, Surname, Age) VALUES ('John', 'Doe', 17)
\`\`\`

**UPDATE**: Modify existing records
\`\`\`sql
UPDATE Students SET Age = 18 WHERE StudentID = 1
\`\`\`

**DELETE**: Remove records
\`\`\`sql
DELETE FROM Students WHERE StudentID = 5
\`\`\``,
                diagrams: [CS_DIAGRAMS.sqlCrud],
            }
        ],
        key_points: [
            "Primary keys uniquely identify each record",
            "Foreign keys create relationships between tables",
            "SELECT retrieves data, INSERT adds data",
            "UPDATE modifies existing data, DELETE removes data",
            "WHERE clause filters records based on conditions"
        ],
        exam_tips: [
            "Always include WHERE in UPDATE/DELETE to avoid affecting all records",
            "Use ORDER BY to sort results",
            "Know the difference between flat-file and relational databases",
            "Practice writing SQL queries with multiple conditions"
        ]
    },
    "Web Design and Internet Uses": {
        topic: "Web Design and Internet Uses",
        subject: "Computer Science",
        summary: "Designing effective web pages and understanding common Internet services and uses.",
        sections: [
            {
                title: "Internet vs World Wide Web",
                content: `**Internet** is the global network of connected computers.  
**World Wide Web (WWW)** is a service on the Internet that uses web pages and hyperlinks.

**Key concepts:**
- **Client-server model**: browser (client) requests pages from a web server
- **URL**: unique address for a web resource
- **Web hosting**: storing website files on a server connected to the Internet
- **Web browser**: software used to access web pages`,
                diagrams: [CS_DIAGRAMS.internetVsWeb],
            },
            {
                title: "Basic Web Technologies",
                content: `**HTML (HyperText Markup Language)** defines page structure.

**Common HTML elements:**
- Headings (\`<h1>\` to \`<h6>\`)
- Paragraphs (\`<p>\`)
- Links (\`<a>\`)
- Images (\`<img>\`)
- Lists (\`<ul>\`, \`<ol>\`, \`<li>\`)

**CSS (Cascading Style Sheets)** controls presentation:
- Fonts, colors, spacing, layout, backgrounds

**JavaScript** adds interactivity:
- Form validation, animations, dynamic content`,
                diagrams: [CS_DIAGRAMS.webStack],
            },
            {
                title: "Good Web Design Principles",
                content: `A good website is **clear, usable, and accessible**.

**Design principles:**
- **Consistency**: same style across pages
- **Navigation**: simple menus, clear links
- **Readability**: readable fonts, good contrast
- **Responsive design**: works on phones, tablets, and desktops
- **Accessibility**: alt text for images, keyboard navigation
- **Performance**: optimized images, minimal loading time`,
                diagrams: [CS_DIAGRAMS.webDesignPrinciples],
            },
            {
                title: "Internet Services and Uses",
                content: `**Common Internet services:**
- **Email**: sending and receiving messages
- **FTP**: file transfer between computers
- **VoIP**: voice calls over the Internet
- **Cloud services**: online storage and applications
- **E-commerce**: buying and selling goods online
- **Social media**: communication and content sharing
- **Search engines**: locating information online

**Risks and safety:**
- Phishing and scams
- Malware downloads
- Privacy issues when sharing personal data
- Copyright violations`,
                diagrams: [CS_DIAGRAMS.internetServices],
            }
        ],
        key_points: [
            "The Internet is the network; the Web is one of its services",
            "HTML structures content, CSS styles it, JavaScript adds interactivity",
            "Good web design focuses on usability, readability, and accessibility",
            "Internet services include email, FTP, cloud, VoIP, and e-commerce",
            "Online safety is essential due to scams and malware"
        ],
        exam_tips: [
            "Differentiate Internet and WWW with clear definitions",
            "Explain client-server model using a simple example",
            "State at least three web design principles in questions",
            "Give examples of Internet services and their uses",
            "Include safety measures when asked about Internet use"
        ]
    },
    "Automated and Emerging Technologies": {
        topic: "Automated and Emerging Technologies",
        subject: "Computer Science",
        summary: "Modern technologies that automate tasks, process large data, and transform industries.",
        sections: [
            {
                title: "Automation and Control",
                content: `**Automation** means using computers and machines to perform tasks with minimal human intervention.

**Key components:**
- **Sensors** to capture data (temperature, motion, light)
- **Controllers** to process input and make decisions
- **Actuators** to perform actions (motors, valves, alarms)

**Examples:**
- Automated teller machines (ATMs)
- Smart irrigation systems
- Industrial robots on assembly lines
- Traffic light control systems`,
                diagrams: [CS_DIAGRAMS.controlLoop],
            },
            {
                title: "Artificial Intelligence and Machine Learning",
                content: `**Artificial Intelligence (AI)** is the simulation of human intelligence by computers.

**Common AI uses:**
- Speech recognition (voice assistants)
- Image recognition (face unlock)
- Recommendation systems (videos, shopping)
- Chatbots and automated support

**Machine Learning (ML)** allows systems to learn patterns from data and improve over time.`,
                diagrams: [CS_DIAGRAMS.mlPipeline],
            },
            {
                title: "Internet of Things (IoT) and Cloud Computing",
                content: `**IoT** connects everyday devices to the Internet so they can send and receive data.

**Examples:**
- Smart home devices (lights, locks, cameras)
- Wearable devices (fitness trackers, smartwatches)
- Smart farming (soil sensors, weather monitoring)

**Cloud computing** provides services over the Internet:
- **Storage** (cloud drives)
- **Processing** (run software without installing locally)
- **Collaboration** (shared documents and tools)`,
                diagrams: [CS_DIAGRAMS.iotCloud],
            },
            {
                title: "Other Emerging Technologies",
                content: `**Robotics**: machines that perform physical tasks autonomously  
**3D printing**: creating objects from digital designs  
**Biometrics**: identification using fingerprints, iris, or face  
**Virtual/Augmented Reality (VR/AR)**: immersive or enhanced digital environments  
**Blockchain**: secure, shared digital ledger for transactions`,
                diagrams: [CS_DIAGRAMS.emergingTech],
            },
            {
                title: "Impacts, Benefits, and Challenges",
                content: `**Benefits:**
- Higher efficiency and accuracy
- Improved safety in dangerous tasks
- Better data-driven decisions

**Challenges:**
- Job displacement and skills gaps
- Privacy and surveillance concerns
- Security risks (hacked devices)
- Dependence on reliable power and Internet`,
                diagrams: [CS_DIAGRAMS.techImpact],
            }
        ],
        key_points: [
            "Automation uses sensors, controllers, and actuators to perform tasks",
            "AI and ML enable systems to recognize patterns and make decisions",
            "IoT connects devices to share data over the Internet",
            "Cloud computing provides storage and processing services online",
            "Emerging tech brings both opportunities and ethical challenges"
        ],
        exam_tips: [
            "Use real-life examples to explain emerging technologies",
            "State both benefits and risks in evaluation questions",
            "Differentiate automation from manual processing clearly",
            "Explain why IoT devices need security measures",
            "Link AI or robotics to specific industry applications"
        ]
    }
};

// Helper function to get topics
export function getTopics(): string[] {
    return computerScienceTopics;
}

// Helper function to get notes for a topic
export function getTopicNotes(topic: string): TopicNotes | null {
    return computerScienceNotes[topic] || null;
}
