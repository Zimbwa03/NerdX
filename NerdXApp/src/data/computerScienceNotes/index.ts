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
        summary: "A comprehensive guide to the physical components of computers and the programs that control them.",
        sections: [
            {
                title: "1. Computer Hardware Overview",
                content: `**Hardware** refers to the physical, tangible parts of a computer system - the components you can touch and see.

**The Main Components:**
A typical computer system consists of:
1.  **Input Devices**: Used to send data *into* the computer.
2.  **Processing Devices**: The "brains" that process data (CPU).
3.  **Output Devices**: Used to display results *out* of the computer.
4.  **Storage Devices**: Used to save data permanently.
5.  **Internal Components**: Essential parts inside the case (Motherboard, RAM, PSU).

**Key Concept: The IPO Model**
All computer systems follow the **Input-Process-Output (IPO)** model:
*   **Input**: Data enters the system.
*   **Process**: Data is manipulated/changed into information.
*   **Output**: Information is presented to the user.
*   **Storage**: Data is kept for later use.`,
                diagrams: [CS_DIAGRAMS.hardwareIpo],
            },
            {
                title: "2. Input Devices",
                content: `**Input devices** allow users to enter data and instructions into a computer.

**Manual Input Devices:**
*   **Keyboard**: The primary text input device. Uses a grid of switches to detect key presses.
    *   *Usage*: Typing documents, entering commands, gaming.
*   **Mouse / Trackpad**: Pointing devices that control a cursor on screen.
    *   *Usage*: Selecting icons, drawing, navigating GUIs.
*   **Microphone**: Captures sound waves and converts them to digital audio.
    *   *Usage*: Voice recording, VoIP calls, voice recognition.
*   **Scanner**: Converts physical documents/photos into digital images.
    *   *Usage*: Digitizing old photos, scanning contracts.
*   **Digital Camera / Webcam**: Captures images and video.
    *   *Usage*: Photography, video conferencing.

**Direct Data Entry (DDE) Devices:**
*   **Barcode Reader**: Scans black and white lines using a red laser.
    *   *Usage*: Supermarket checkouts, library systems.
*   **QR Code Reader**: Scans 2D matrix codes (Quick Response codes).
    *   *Usage*: Mobile payments, accessing websites quickly.
*   **OMR (Optical Mark Recognition)**: Detects marks on a page.
    *   *Usage*: Marking multiple-choice exam papers automatically.
*   **OCR (Optical Character Recognition)**: Scans text and converts it to editable digital text.
    *   *Usage*: Digitizing printed books, passport reading.
*   **Sensors**: Automatically capture physical data (temp, light, pressure).
    *   *Usage*: Automated greenhouses, burglar alarms, smart thermostats.`,
                diagrams: [],
            },
            {
                title: "3. Output Devices",
                content: `**Output devices** report the results of processing to the user.

**Visual Output:**
*   **LCD/LED Monitor**: Displays text, images, and video.
    *   *How it works*: Uses liquid crystals or LEDs to create pixels.
    *   *Key specs*: Resolution (e.g., 1920x1080), Refresh rate (e.g., 60Hz).
*   **Projector**: Projects computer display onto a large screen/wall.
    *   *Usage*: Classrooms, home cinemas, business presentations.

**Hard Copy Output:**
*   **Inkjet Printer**: Sprays tiny droplets of liquid ink.
    *   *Pros*: Cheap hardware, good photo quality. *Cons*: Expensive ink, slower.
*   **Laser Printer**: Uses powdered toner and heat (fuser).
    *   *Pros*: Fast, sharp text, cheap cost-per-page. *Cons*: Expensive hardware.
*   **3D Printer**: Creates physical objects by layering material (plastic/resin).
    *   *Usage*: Prototyping parts, medical models, toys.
*   **Plotter**: Uses pens to draw continuous lines.
    *   *Usage*: Architectural blueprints, large maps.

**Audio/Mechanical Output:**
*   **Speakers / Headphones**: Convert digital audio into sound waves.
*   **Actuators**: Motors that produce physical movement.
    *   *Usage*: Robotic arms, opening automatic doors.`,
                diagrams: [],
            },
            {
                title: "4. Storage Devices",
                content: `Storage is where data, files, and software are kept when the computer is turned off (**Non-volatile**).

**Primary vs Secondary Storage:**
*   **Primary Storage (RAM/ROM)**: Directly accessible by CPU, usually volatile (except ROM).
*   **Secondary Storage**: Long-term storage (HDD, SSD), slower but holds more data.

**Types of Secondary Storage:**

1.  **Magnetic Storage** (e.g., Hard Disk Drive - HDD)
    *   *Mechanism*: Uses magnetic platters and a moving read/write head.
    *   *Pros*: High capacity, low cost per GB.
    *   *Cons*: Slower, fragile (moving parts), noisy.
    *   *Use*: Storing backups, large media libraries.

2.  **Solid State Storage** (e.g., SSD, USB Flash Drive, SD Card)
    *   *Mechanism*: Uses flash memory (transistors) with no moving parts.
    *   *Pros*: Very fast, durable, silent, energy-efficient.
    *   *Cons*: More expensive per GB than HDD.
    *   *Use*: Boot drives (OS), portable storage, smartphones.

3.  **Optical Storage** (e.g., CD, DVD, Blu-ray)
    *   *Mechanism*: Uses lasers to burn 'pits' and 'lands' on a disc.
    *   *Pros*: Very cheap, portable.
    *   *Cons*: Slow, low capacity, can be scratched.
    *   *Use*: Distributing movies/games, archiving data.

**Storage Capacity Units:**
*   **Bit (b)**: 0 or 1
*   **Byte (B)**: 8 bits
*   **Kilobyte (KB)**: 1024 Bytes
*   **Megabyte (MB)**: 1024 KB
*   **Gigabyte (GB)**: 1024 MB
*   **Terabyte (TB)**: 1024 GB`,
                diagrams: [],
            },
            {
                title: "5. Internal Components & The CPU",
                content: `Inside the computer case (system unit) are the critical components that make it work.

**The Motherboard:**
The main circuit board that connects all components (CPU, RAM, storage, power) together. It allows them to communicate.

**The CPU (Central Processing Unit):**
The "brain" of the computer. It executes instructions.
*   **Clock Speed**: Measured in GHz (billions of cycles per second).
*   **Cores**: Independent processing units (Dual-core, Quad-core).

**Key CPU Components:**
1.  **Control Unit (CU)**: Decodes instructions and controls data flow.
2.  **Arithmetic Logic Unit (ALU)**: Performs math (+, -) and logic (AND, OR, >) operations.
3.  **Registers**: Tiny, super-fast memory locations inside the CPU (e.g., Accumulator, Program Counter).
4.  **Cache**: Fast memory near the CPU to store frequently used data.

**The Fetch-Decode-Execute Cycle:**
1.  **Fetch**: CPU retrieves the next instruction from RAM.
2.  **Decode**: CPU works out what the instruction means.
3.  **Execute**: CPU carries out the instruction (e.g., adds two numbers).`,
                diagrams: [CS_DIAGRAMS.cpuCycle],
            },
            {
                title: "6. Computer Software",
                content: `**Software** refers to the programs and code that run on the computer hardware. Without software, hardware is useless.

**Two Main Types of Software:**

1.  **System Software:**
    Programs designed to run and maintain the computer's hardware and application programs.
    *   **Operating System (OS)**: The interface between user and hardware (Windows, macOS, Linux, Android).
        *   *Functions*: Memory management, File management, Multitasking, User Interface, Security.
    *   **Utility Programs**: Maintenance tools.
        *   *Examples*: Antivirus, Disk Defragmenter, File Compression (WinZip), Backup software.
    *   **Device Drivers**: Small programs that tell the OS how to communicate with specific hardware (e.g., a Printer Driver).
    *   **Translators**: Convert code into machine language (Compilers, Interpreters, Assemblers).

2.  **Application Software:**
    Programs that allow the user to perform specific tasks.
    *   **General Purpose**: Can be used for many tasks (Word Processor, Spreadsheet, Presentation software).
    *   **Special Purpose**: Designed for a specific task (Payroll system, Hotel booking system, Flight simulator).
    *   **Bespoke (Custom)**: Written specifically for one client's unique needs.

**System vs Application:**
*   *System Software* runs the computer.
*   *Application Software* runs *on* the system software to help the *user*.`,
                diagrams: [CS_DIAGRAMS.softwareTypes],
            }
        ],
        key_points: [
            "Hardware is physical; Software is digital layouts/instructions.",
            "IPO Model: Input -> Process -> Output (with Storage).",
            "Input: Keyboard, Mouse, Sensors. Output: Monitor, Printer, Actuators.",
            "Storage: Magnetic (HDD), Solid State (SSD), Optical (CD/DVD).",
            "CPU Components: ALU (Math), Control Unit (Management), Registers (Fast storage).",
            "Software Types: System (OS, Utilities) vs Application (Word, Excel)."
        ],
        exam_tips: [
            "Be ready to compare HDD vs SSD (Cost, Speed, Durability).",
            "Remember: RAM is volatile (lost when power off), ROM is non-volatile.",
            "Don't just list devices for 6-mark questions; explain *why* a specific device is suitable (e.g., 'Barcode reader is faster and more accurate than typing').",
            "Understand the role of the OS: it manages resources and provides a UI."
        ]
    },
    "Application of Computer Science": {
        topic: "Application of Computer Science",
        subject: "Computer Science",
        summary: "Exploring how computers are used in various sectors to solve problems and improve efficiency.",
        sections: [
            {
                title: "1. Overview of Computer Applications",
                content: `Computer science is applied across almost every sector of modern life. Computers are used to **collect, store, process, and communicate** information.

**Why use computers?**
*   **Speed**: They perform calculations and tasks much faster than humans.
*   **Accuracy**: They do not make mistakes if programmed correctly.
*   **Storage**: They can store vast amounts of data in small spaces.
*   **Repetition**: They can perform the same task over and over without getting tired.
*   **Communication**: They allow global connectivity.`,
                diagrams: [CS_DIAGRAMS.applications],
            },
            {
                title: "2. Applications in Education",
                content: `Computers have transformed how we teach and learn.

**Key Applications:**
*   **CAL (Computer Aided Learning)** & **CAI (Computer Aided Instruction)**: Using software to teach subjects (e.g., NerdX App!).
    *   *Benefits*: Self-paced learning, interactive content, immediate feedback.
*   **E-Learning / Online Learning**: Learning remotely via the internet.
    *   *Benefits*: Access to global resources, flexible timing.
*   **School Administration Systems**:
    *   Managing student records, attendance, and grades.
    *   Timetabling and scheduling.
*   **Digital Libraries**: Access to millions of books and journals online.`,
                diagrams: [],
            },
            {
                title: "3. Applications in Healthcare",
                content: `In medicine, computers are used to save lives and improve care.

**Key Applications:**
*   **Patient Record Systems (EHR)**: Storing patient history, allergies, and prescriptions centrally.
*   **Medical Imaging**:
    *   **MRI / CT Scans**: Creating detailed 3D images of the body.
    *   **Ultrasound**: Monitoring pregnancy.
*   **Patient Monitoring**: Automatically tracking vital signs (heart rate, blood pressure) in ICUs.
*   **Telemedicine**: Remote consultations with doctors via video calls.
*   **Robotic Surgery**: Performing precise operations using robotic arms controlled by surgeons.`,
                diagrams: [],
            },
            {
                title: "4. Applications in Banking & Finance",
                content: `The financial sector relies heavily on computers for accuracy and security.

**Key Applications:**
*   **ATMs (Automated Teller Machines)**: Allow 24/7 cash withdrawals and deposits.
*   **EFT (Electronic Funds Transfer)**: Moving money digitally between accounts (e.g., salary payments).
*   **Mobile Banking**: Managing accounts via smartphone apps.
*   **Fintech**: Automated trading algorithms and cryptocurrency.
*   **Credit/Debit Cards**: Using chip and PIN technology for secure payments.`,
                diagrams: [],
            },
            {
                title: "5. Applications in Retail & Business",
                content: `Computers streamline buying, selling, and managing businesses.

**Key Applications:**
*   **POS (Point of Sale) Systems**: Electronic checkouts that scan barcodes.
    *   *Function*: Calculates total, updates inventory, prints receipt.
*   **Inventory Management**: Automatically tracking stock levels and reordering when low.
*   **E-Commerce**: Buying and selling goods online (e.g., Amazon).
    *   *Benefits*: 24/7 shopping, global reach, lower overheads.
*   **Payroll Systems**: Calculating wages, tax, and printing payslips automatically.`,
                diagrams: [CS_DIAGRAMS.infoSystem],
            },
            {
                title: "6. Industrial & Manufacturing",
                content: `Computers control machinery to improve production.

**Key Applications:**
*   **CAD (Computer Aided Design)**: Creating technical drawings and 3D models (e.g., cars, buildings).
*   **CAM (Computer Aided Manufacturing)**: Using software to control machine tools (drills, lathes).
*   **Robotics**: Using robots for assembly, painting, and welding.
    *   *Pros*: Consistent quality, can work in dangerous environments.
    *   *Cons*: High setup cost, job losses for manual workers.
*   **Process Control**: Monitoring temperature, pressure, and flow in chemical plants.`,
                diagrams: [CS_DIAGRAMS.controlLoop],
            },
            {
                title: "7. Expert Systems",
                content: `An **Expert System** is a computer program that simulates the decision-making ability of a human expert.

**Components:**
1.  **Knowledge Base**: A database of facts and rules.
2.  **Inference Engine**: The logic that applies rules to the data to deduce new information.
3.  **User Interface**: Allows the user to ask questions and receive advice.

**Examples:**
*   **Medical Diagnosis**: Diagnosing illnesses based on symptoms.
*   **Mineral Prospecting**: Identifying likely locations for oil/minerals.
*   **Car Diagnostics**: Identifying faults in vehicle engines.`,
                diagrams: [],
            },
            {
                title: "8. Impact of Technology",
                content: `The widespread use of computers has both positive and negative effects on society.

**Positive Impacts:**
*   **Efficiency**: Tasks are completed faster and more cheaply.
*   **Connectivity**: Easy communication worldwide.
*   **Access to Information**: Knowledge is available to everyone.
*   **New Jobs**: Creation of IT careers (developers, technicians).

**Negative Impacts:**
*   **Unemployment**: Automation replacing manual jobs.
*   **Digital Divide**: The gap between those who have access to technology and those who don't.
*   **Privacy Issues**: Increased surveillance and data collection.
*   **Health Issues**: RSI (Repetitive Strain Injury), eye strain, sedentary lifestyle.
*   **Security Risks**: Hacking, identity theft, malware.`,
                diagrams: [CS_DIAGRAMS.techImpact],
            }
        ],
        key_points: [
            "Computers offer speed, accuracy, and vast storage capabilities.",
            "Education uses CAL, E-learning, and admin systems.",
            "Healthcare relies on EHRs, imaging (MRI), and monitoring.",
            "Finance uses ATMs, EFT, and online banking.",
            "Industry uses CAD (Design) and CAM (Manufacturing).",
            "Expert Systems consist of a Knowledge Base and Inference Engine.",
            "Technology creates new jobs but can also cause unemployment (automation)."
        ],
        exam_tips: [
            "When asked for benefits, mention specific sectors (e.g., 'In healthcare, it improves diagnostic accuracy').",
            "Know the difference between CAD (drawing/designing) and CAM (making/manufacturing).",
            "For expert systems, remember the three components: Knowledge Base, Inference Engine, User Interface.",
            "Discuss both positive AND negative impacts for full marks in essay questions."
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
