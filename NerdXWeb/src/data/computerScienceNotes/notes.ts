// O-Level Computer Science Notes – full content migrated from mobile app
import type { TopicNotes } from './types';

export const computerScienceTopicNames: string[] = [
  'Hardware and Software',
  'Application of Computer Science',
  'Data Representation',
  'Communication Networks and Internet Technologies',
  'Security and Ethics',
  'Systems Analysis and Design',
  'Algorithm Design and Problem-Solving',
  'Programming',
  'Databases',
  'Web Design and Internet Uses',
  'Automated and Emerging Technologies',
];

/** Slug (id) to display name for URL param lookup */
export function topicSlugToName(slug: string): string | null {
  const normalized = slug.replace(/-/g, '_').toLowerCase();
  const found = computerScienceTopicNames.find(
    (name) => name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') === normalized
  );
  return found ?? null;
}

export const computerScienceNotes: Record<string, TopicNotes> = {
  'Hardware and Software': {
    topic: 'Hardware and Software',
    subject: 'Computer Science',
    summary: 'A comprehensive guide to the physical components of computers and the programs that control them.',
    sections: [
      {
        title: '1. Computer Hardware Overview',
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
      },
      {
        title: '2. Input Devices',
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
      },
      {
        title: '3. Output Devices',
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
      },
      {
        title: '4. Storage Devices',
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
      },
      {
        title: '5. Internal Components & The CPU',
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
      },
      {
        title: '6. Computer Software',
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
      },
    ],
    key_points: [
      'Hardware is physical; Software is digital layouts/instructions.',
      'IPO Model: Input -> Process -> Output (with Storage).',
      'Input: Keyboard, Mouse, Sensors. Output: Monitor, Printer, Actuators.',
      'Storage: Magnetic (HDD), Solid State (SSD), Optical (CD/DVD).',
      'CPU Components: ALU (Math), Control Unit (Management), Registers (Fast storage).',
      'Software Types: System (OS, Utilities) vs Application (Word, Excel).',
    ],
    exam_tips: [
      'Be ready to compare HDD vs SSD (Cost, Speed, Durability).',
      'Remember: RAM is volatile (lost when power off), ROM is non-volatile.',
      "Don't just list devices for 6-mark questions; explain *why* a specific device is suitable (e.g., 'Barcode reader is faster and more accurate than typing').",
      'Understand the role of the OS: it manages resources and provides a UI.',
    ],
  },
  'Application of Computer Science': {
    topic: 'Application of Computer Science',
    subject: 'Computer Science',
    summary: 'Exploring how computers are used in various sectors to solve problems and improve efficiency.',
    sections: [
      {
        title: '1. Overview of Computer Applications',
        content: `Computer science is applied across almost every sector of modern life. Computers are used to **collect, store, process, and communicate** information.

**Why use computers?**
*   **Speed**: They perform calculations and tasks much faster than humans.
*   **Accuracy**: They do not make mistakes if programmed correctly.
*   **Storage**: They can store vast amounts of data in small spaces.
*   **Repetition**: They can perform the same task over and over without getting tired.
*   **Communication**: They allow global connectivity.`,
      },
      {
        title: '2. Applications in Education',
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
      },
      {
        title: '3. Applications in Healthcare',
        content: `In medicine, computers are used to save lives and improve care.

**Key Applications:**
*   **Patient Record Systems (EHR)**: Storing patient history, allergies, and prescriptions centrally.
*   **Medical Imaging**:
    *   **MRI / CT Scans**: Creating detailed 3D images of the body.
    *   **Ultrasound**: Monitoring pregnancy.
*   **Patient Monitoring**: Automatically tracking vital signs (heart rate, blood pressure) in ICUs.
*   **Telemedicine**: Remote consultations with doctors via video calls.
*   **Robotic Surgery**: Performing precise operations using robotic arms controlled by surgeons.`,
      },
      {
        title: '4. Applications in Banking & Finance',
        content: `The financial sector relies heavily on computers for accuracy and security.

**Key Applications:**
*   **ATMs (Automated Teller Machines)**: Allow 24/7 cash withdrawals and deposits.
*   **EFT (Electronic Funds Transfer)**: Moving money digitally between accounts (e.g., salary payments).
*   **Mobile Banking**: Managing accounts via smartphone apps.
*   **Fintech**: Automated trading algorithms and cryptocurrency.
*   **Credit/Debit Cards**: Using chip and PIN technology for secure payments.`,
      },
      {
        title: '5. Applications in Retail & Business',
        content: `Computers streamline buying, selling, and managing businesses.

**Key Applications:**
*   **POS (Point of Sale) Systems**: Electronic checkouts that scan barcodes.
    *   *Function*: Calculates total, updates inventory, prints receipt.
*   **Inventory Management**: Automatically tracking stock levels and reordering when low.
*   **E-Commerce**: Buying and selling goods online (e.g., Amazon).
    *   *Benefits*: 24/7 shopping, global reach, lower overheads.
*   **Payroll Systems**: Calculating wages, tax, and printing payslips automatically.`,
      },
      {
        title: '6. Industrial & Manufacturing',
        content: `Computers control machinery to improve production.

**Key Applications:**
*   **CAD (Computer Aided Design)**: Creating technical drawings and 3D models (e.g., cars, buildings).
*   **CAM (Computer Aided Manufacturing)**: Using software to control machine tools (drills, lathes).
*   **Robotics**: Using robots for assembly, painting, and welding.
    *   *Pros*: Consistent quality, can work in dangerous environments.
    *   *Cons*: High setup cost, job losses for manual workers.
*   **Process Control**: Monitoring temperature, pressure, and flow in chemical plants.`,
      },
      {
        title: '7. Expert Systems',
        content: `An **Expert System** is a computer program that simulates the decision-making ability of a human expert.

**Components:**
1.  **Knowledge Base**: A database of facts and rules.
2.  **Inference Engine**: The logic that applies rules to the data to deduce new information.
3.  **User Interface**: Allows the user to ask questions and receive advice.

**Examples:**
*   **Medical Diagnosis**: Diagnosing illnesses based on symptoms.
*   **Mineral Prospecting**: Identifying likely locations for oil/minerals.
*   **Car Diagnostics**: Identifying faults in vehicle engines.`,
      },
      {
        title: '8. Impact of Technology',
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
      },
    ],
    key_points: [
      'Computers offer speed, accuracy, and vast storage capabilities.',
      'Education uses CAL, E-learning, and admin systems.',
      'Healthcare relies on EHRs, imaging (MRI), and monitoring.',
      'Finance uses ATMs, EFT, and online banking.',
      'Industry uses CAD (Design) and CAM (Manufacturing).',
      'Expert Systems consist of a Knowledge Base and Inference Engine.',
      'Technology creates new jobs but can also cause unemployment (automation).',
    ],
    exam_tips: [
      "When asked for benefits, mention specific sectors (e.g., 'In healthcare, it improves diagnostic accuracy').",
      'Know the difference between CAD (drawing/designing) and CAM (making/manufacturing).',
      'For expert systems, remember the three components: Knowledge Base, Inference Engine, User Interface.',
      'Discuss both positive AND negative impacts for full marks in essay questions.',
    ],
  },
  'Data Representation': {
    topic: 'Data Representation',
    subject: 'Computer Science',
    summary: 'How computers store and represent different types of data using binary, denary, and hexadecimal systems.',
    sections: [
      {
        title: '1. Number Systems',
        content: `Computers use different number systems to represent data.

**Binary (Base 2)**: Uses only 0 and 1
- Example: 1101 (binary) = 13 (denary)

**Denary/Decimal (Base 10)**: Our everyday number system using 0-9
- Example: 255

**Hexadecimal (Base 16)**: Uses 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15)
- Example: FF (hex) = 255 (denary)

**Why Hexadecimal?**
*   It's a shorter way to represent binary (1 hex digit = 4 bits).
*   Used in: HTML colour codes (#FF0000), MAC addresses, error codes, memory addresses.`,
      },
      {
        title: '2. Number Conversions',
        content: `**Binary to Denary:**
Each position represents a power of 2: 128, 64, 32, 16, 8, 4, 2, 1
Example: 1101 = 8 + 4 + 0 + 1 = 13

**Denary to Binary:**
Divide by 2 repeatedly and record remainders
Example: 13 / 2 = 6 r1, 6 / 2 = 3 r0, 3 / 2 = 1 r1, 1 / 2 = 0 r1 -> 1101

**Hexadecimal to Binary:**
Each hex digit = 4 binary bits
Example: A3 = 1010 0011

**Binary to Hexadecimal:**
Split binary into groups of 4 from right, convert each group.
Example: 1010 0011 = A3

**Binary Addition:**
- 0 + 0 = 0
- 0 + 1 = 1
- 1 + 1 = 10 (write 0, carry 1)
- 1 + 1 + 1 = 11 (write 1, carry 1)

**Overflow**: When the result of binary addition needs more bits than available.`,
      },
      {
        title: '3. Data Representation: Text, Images, Sound',
        content: `All data in a computer is stored as binary (0s and 1s). Different types of data are encoded differently.

**Text Representation:**
*   **ASCII**: Uses 7 bits per character (128 characters). Includes English letters, numbers, symbols.
*   **Extended ASCII**: Uses 8 bits (256 characters). Adds accented characters.
*   **Unicode**: Uses up to 32 bits. Supports all world languages (Chinese, Arabic, Emoji, etc.).

**Image Representation:**
*   Images are made of tiny dots called **pixels**.
*   **Colour depth**: Number of bits per pixel (e.g., 1-bit = 2 colours, 8-bit = 256 colours, 24-bit = 16 million colours).
*   **Resolution**: Number of pixels (e.g., 1920 x 1080).
*   **File size** = Width x Height x Colour Depth.

**Sound Representation:**
*   Sound waves are **analogue** (continuous). Computers need **digital** (discrete) data.
*   **Sampling**: Measuring the sound wave at regular intervals.
*   **Sample rate**: Number of samples per second (Hz). Higher = better quality.
*   **Bit depth**: Number of bits per sample. Higher = more accurate.
*   **File size** = Sample rate x Bit depth x Duration.`,
      },
      {
        title: '4. Logic Gates',
        content: `Logic gates process binary inputs to produce outputs. They are the building blocks of digital circuits.

**AND Gate**: Output is 1 only if BOTH inputs are 1
**OR Gate**: Output is 1 if EITHER input is 1
**NOT Gate**: Inverts the input (1 becomes 0, 0 becomes 1)
**NAND Gate**: NOT AND - opposite of AND
**NOR Gate**: NOT OR - opposite of OR
**XOR Gate**: Output is 1 if inputs are DIFFERENT

**Truth Tables** show all possible input/output combinations for a gate.

Logic gates can be combined to create complex circuits used in processors, memory, and other hardware.`,
      },
    ],
    key_points: [
      'Binary uses only 0 and 1 (base 2).',
      'Hexadecimal uses 0-9 and A-F (base 16).',
      '1 byte = 8 bits, can store values 0-255.',
      'ASCII uses 7 bits per character; Unicode supports all languages.',
      'Image file size = Width x Height x Colour Depth.',
      'Sound file size = Sample Rate x Bit Depth x Duration.',
      'Logic gates: AND, OR, NOT, NAND, NOR, XOR.',
      'Truth tables show all possible input/output combinations.',
    ],
    exam_tips: [
      'Practice conversions between binary, denary, and hexadecimal.',
      'Know the truth tables for all basic logic gates.',
      'Binary addition: 1+1=10 (carry the 1).',
      'Remember: 1 nibble = 4 bits = 1 hex digit.',
      'Be able to calculate file sizes for images and sound.',
      'Know the difference between ASCII and Unicode.',
    ],
  },
  'Communication Networks and Internet Technologies': {
    topic: 'Communication Networks and Internet Technologies',
    subject: 'Computer Science',
    summary: 'How computers connect, share data, and use Internet services through network devices and protocols.',
    sections: [
      {
        title: '1. Network Types and Topologies',
        content: `A network is a group of computers/devices connected to share resources and data.

**Network types:**
*   **LAN** (Local Area Network): Small area like a lab, school, or office. Owned by one organisation.
*   **WAN** (Wide Area Network): Large area, connects LANs across cities or countries. Uses leased telecom lines.
*   **MAN** (Metropolitan Area Network): City-wide network.
*   **PAN** (Personal Area Network): Short range (e.g., Bluetooth between phone and headphones).

**Topologies (Physical Layout):**
*   **Star**: All devices connect to a central switch/hub.
    *   *Pros*: If one cable fails, only that device is affected. Easy to add devices.
    *   *Cons*: If central switch fails, entire network goes down.
*   **Bus**: All devices share one main cable (backbone).
    *   *Pros*: Cheap and simple to set up.
    *   *Cons*: If the backbone fails, the whole network fails. Slow with many devices.
*   **Ring**: Devices connected in a circle; data flows in one direction.
    *   *Pros*: No collisions, predictable performance.
    *   *Cons*: If one device fails, the ring breaks.
*   **Mesh**: Multiple paths between devices for reliability.
    *   *Pros*: Very reliable; if one link fails, data takes another path.
    *   *Cons*: Expensive due to many connections.

**Factors affecting choice:** cost, reliability, scalability, and ease of maintenance.`,
      },
      {
        title: '2. Network Devices and Transmission Media',
        content: `**Devices:**
*   **Switch**: Connects devices in a LAN. Sends data only to the correct destination using MAC addresses. Efficient.
*   **Router**: Connects different networks (e.g., LAN to Internet). Routes data using IP addresses.
*   **Hub**: Simple device that sends data to ALL ports (less secure, less efficient than a switch).
*   **Modem**: Converts digital signals to analog and back for Internet access over phone lines.
*   **Access Point (WAP)**: Provides wireless connectivity to a wired network.
*   **NIC (Network Interface Card)**: Hardware that allows a device to connect to a network.

**Transmission media:**
*   **Twisted pair (UTP/STP)**: Common for LANs, low cost. Susceptible to interference.
*   **Coaxial cable**: Better shielding, used in cable TV and older networks.
*   **Fiber optic**: Very fast, long distance, immune to electromagnetic interference. Expensive.
*   **Wireless**: Wi-Fi, Bluetooth, cellular. Convenient but more interference and security risks.`,
      },
      {
        title: '3. Internet Technologies and Protocols',
        content: `The Internet uses a set of protocols (TCP/IP) to move data between devices.

**Key protocols and services:**
*   **IP (Internet Protocol)**: Addressing and routing packets across networks.
*   **TCP (Transmission Control Protocol)**: Reliable data delivery; checks packets arrive correctly.
*   **HTTP/HTTPS**: Web pages and secure web communication (HTTPS is encrypted).
*   **FTP**: File transfer between computers.
*   **SMTP**: Sending emails.
*   **POP3/IMAP**: Receiving emails (POP3 downloads; IMAP syncs with server).
*   **DNS**: Converts domain names (e.g., google.com) to IP addresses.

**How Data Travels - Packet Switching:**
1.  Data is broken into small **packets**.
2.  Each packet has a **header** (source, destination, sequence number).
3.  Packets may take different routes across the network.
4.  At the destination, packets are **reassembled** in the correct order.

**Web concepts:**
*   **URL**: Address of a resource on the web.
*   **Web browser**: Software to access web pages (Chrome, Firefox).
*   **Search engine**: Service that indexes and finds information on the web (Google, Bing).`,
      },
      {
        title: '4. Network Security',
        content: `Networks face many security threats. Protection is essential.

**Common Network Threats:**
*   **Malware**: Viruses, worms, trojans spread across networks.
*   **Phishing**: Fake emails/websites tricking users into giving up data.
*   **Man-in-the-middle attacks**: Intercepting communication between two parties.
*   **DDoS (Distributed Denial of Service)**: Flooding a server with requests to crash it.

**Protection Measures:**
*   **Firewalls**: Monitor and control incoming/outgoing traffic based on rules.
*   **Encryption**: Scrambles data so only authorized recipients can read it (e.g., HTTPS, WPA2 for Wi-Fi).
*   **Authentication**: Usernames, passwords, 2FA to verify identity.
*   **Access Control**: Restricting who can access what resources.
*   **VPN (Virtual Private Network)**: Creates a secure tunnel over a public network.`,
      },
      {
        title: '5. Network Performance and Reliability',
        content: `**Performance factors:**
*   **Bandwidth**: Maximum amount of data that can be transmitted per second (e.g., 100 Mbps).
*   **Latency**: Delay between sending and receiving data.
*   **Throughput**: Actual rate of successful data transfer.
*   **Packet loss**: Packets not reaching their destination.

**What affects performance?**
*   Number of users on the network.
*   Quality of hardware (switches, cables).
*   Distance between devices.
*   Interference (especially wireless).

**Reliability measures:**
*   Redundant links and backup hardware.
*   Error detection and correction (parity checks, checksums).
*   Proper configuration and regular maintenance.`,
      },
    ],
    key_points: [
      'LAN, WAN, MAN, and PAN serve different geographic ranges.',
      'Star topology is common due to reliability and ease of expansion.',
      'Switches use MAC addresses; routers use IP addresses.',
      'TCP/IP is the core protocol suite of the Internet.',
      'Data is sent in packets that may take different routes.',
      'Firewalls, encryption, and VPNs protect network security.',
      'Bandwidth and latency determine network performance.',
    ],
    exam_tips: [
      'Be able to compare topologies using advantages and disadvantages.',
      'Explain the role of common devices like switch, router, and modem.',
      'Use real-life examples when describing Internet services.',
      'Know the purpose of DNS, HTTP/HTTPS, and email protocols.',
      'Use correct terms: bandwidth, latency, throughput.',
      'Explain packet switching step by step.',
    ],
  },
  'Security and Ethics': {
    topic: 'Security and Ethics',
    subject: 'Computer Science',
    summary: 'Protecting computer systems and data while using technology responsibly and ethically.',
    sections: [
      {
        title: '1. Security Goals and Threats',
        content: `The main security goals are **Confidentiality, Integrity, and Availability (CIA)**.

*   **Confidentiality**: Only authorised users can access data.
*   **Integrity**: Data is accurate and has not been tampered with.
*   **Availability**: Systems and data are accessible when needed.

**Common threats:**
*   **Malware**: Malicious software designed to damage or exploit systems.
    *   **Virus**: Attaches to files and spreads when the file is opened.
    *   **Worm**: Self-replicating; spreads across networks without user action.
    *   **Trojan**: Disguises itself as legitimate software.
    *   **Spyware**: Secretly monitors user activity and steals data.
    *   **Ransomware**: Encrypts files and demands payment to unlock them.
*   **Phishing**: Tricking users to reveal passwords or personal data via fake emails/websites.
*   **Hacking/Unauthorized access**: Breaking into systems to steal or damage data.
*   **Social engineering**: Manipulating people psychologically to gain access or information.
*   **Physical threats**: Theft, fire, power failure, water damage, natural disasters.`,
      },
      {
        title: '2. Protection Measures',
        content: `**Technical measures:**
*   **Authentication**: Verifying identity (passwords, biometrics, two-factor authentication / 2FA).
*   **Authorization**: Controlling what authenticated users can do (access rights, permissions).
*   **Encryption**: Converts data into unreadable form; only those with the key can decrypt it.
*   **Firewalls**: Monitor and control incoming/outgoing network traffic.
*   **Anti-malware software**: Detect, quarantine, and remove malicious software.
*   **Regular software updates**: Patch security vulnerabilities.
*   **VPN (Virtual Private Network)**: Encrypts internet traffic for secure remote access.

**Physical measures:**
*   Locked server rooms, CCTV surveillance, access cards, security guards.
*   Backup power supplies (UPS - Uninterruptible Power Supply).

**Data protection measures:**
*   **Backups**: Regular copies of data stored separately.
    *   **Full backup**: Copies all data.
    *   **Incremental backup**: Copies only data changed since last backup.
    *   **Differential backup**: Copies data changed since last full backup.
*   **Disaster recovery plans**: Documented procedures for restoring systems after failure.`,
      },
      {
        title: '3. Ethics and Responsible Use',
        content: `Ethics covers how technology should be used to respect people and society.

**Key ethical issues:**
*   **Privacy**: Personal data should be collected and used responsibly, with consent.
*   **Intellectual property**: Respect copyright, patents, and licensing agreements.
*   **Software piracy**: Illegal copying or distribution of software.
*   **Plagiarism**: Presenting someone else's work as your own.
*   **Cyberbullying**: Using digital tools to harass, threaten, or humiliate others.
*   **Digital footprint**: Everything you do online leaves a trace that can be tracked.

**Responsible behavior:**
*   Use strong, unique passwords and keep them private.
*   Verify sources before sharing information online.
*   Follow school, workplace, and national ICT policies.
*   Report suspicious activity or cyberbullying.
*   Respect others' intellectual property and give credit.`,
      },
      {
        title: '4. Data Protection and Legal Considerations',
        content: `Many countries have data protection laws that require organisations to handle personal data responsibly.

**Key principles of data protection:**
*   Collect only necessary data (data minimisation).
*   Store data securely with appropriate safeguards.
*   Use data only for stated, lawful purposes.
*   Keep data accurate and up-to-date.
*   Do not keep data longer than necessary.
*   Allow individuals to access and correct their data.

**Computer Misuse Act (typical provisions):**
*   Unauthorised access to computer material is illegal.
*   Unauthorised modification of computer material is illegal.
*   Creating and distributing malware is illegal.

Failing to follow these rules can lead to legal penalties, fines, and loss of trust.`,
      },
    ],
    key_points: [
      'Security is based on the CIA triad: Confidentiality, Integrity, and Availability.',
      'Threats include malware (virus, worm, trojan, ransomware), phishing, hacking, and physical damage.',
      'Protection includes technical, physical, and administrative measures.',
      'Encryption converts data to unreadable form for security.',
      'Backups can be full, incremental, or differential.',
      'Ethical use requires respect for privacy, intellectual property, and others.',
      'Data protection laws regulate how organisations handle personal data.',
    ],
    exam_tips: [
      'Explain the difference between authentication and authorization.',
      'Give examples of different malware types and their effects.',
      'State both security measures and why they are needed.',
      'Link ethical issues to real-world consequences.',
      'Remember the CIA triad and use it in explanations.',
      'Know the difference between full, incremental, and differential backups.',
    ],
  },
  'Systems Analysis and Design': {
    topic: 'Systems Analysis and Design',
    subject: 'Computer Science',
    summary: 'How to investigate, design, implement, and maintain computer-based systems that solve real problems.',
    sections: [
      {
        title: '1. The Systems Development Life Cycle (SDLC)',
        content: `The SDLC is a structured approach to building information systems. It has several phases:

1.  **Feasibility Study**: Is the project worth doing?
2.  **Analysis**: What does the system need to do?
3.  **Design**: How will the system work?
4.  **Implementation/Development**: Building the system.
5.  **Testing**: Does it work correctly?
6.  **Installation/Deployment**: Putting the system into use.
7.  **Maintenance**: Keeping the system running and improving it.

**Development Approaches:**
*   **Waterfall**: Linear, each phase completed before the next begins. Good for well-defined projects.
*   **Iterative/Agile**: Build in cycles (sprints), refining the system based on feedback.
*   **Prototyping**: Build a working model first, get user feedback, then develop the full system.`,
      },
      {
        title: '2. Systems Analysis: Understanding the Problem',
        content: `Systems analysis is the process of studying an existing system to understand how it works and what must be improved.

**Key tasks in analysis:**
*   **Define the problem** clearly (what is wrong, where, and why).
*   **Identify stakeholders** (users, managers, customers, technicians).
*   **Collect requirements** (what the new system must do).

**Fact-finding methods:**
*   **Interviews**: Deep, detailed information from key users. Time-consuming but thorough.
*   **Questionnaires**: Reach many users quickly with standard questions. Less detailed.
*   **Observation**: See how tasks are actually done in practice.
*   **Document analysis**: Study forms, reports, policies, and logs.
*   **Sampling**: Analyse a subset of records to understand patterns.`,
      },
      {
        title: '3. Feasibility and Requirements',
        content: `Before building a system, check if it is **feasible**.

**Feasibility (TELOS):**
*   **Technical**: Do we have the hardware, software, and skills?
*   **Economic**: Are the costs justified by the benefits?
*   **Legal**: Does it comply with laws (data protection, copyright)?
*   **Operational**: Will users accept and use it?
*   **Schedule**: Can it be completed on time?

**Requirements types:**
*   **Functional requirements**: What the system must do (e.g., calculate totals, print receipts, validate input).
*   **Non-functional requirements**: How the system should perform (performance, security, usability, reliability, backup, response time).`,
      },
      {
        title: '4. System Modelling Tools',
        content: `Models help explain how data flows and how processes work. They are used to communicate with stakeholders.

**Common tools:**
*   **Data Flow Diagrams (DFD)**: Show inputs, processes, data stores, and outputs.
    *   **Level 0 (Context Diagram)**: Overall system as one process.
    *   **Level 1**: Detailed breakdown of processes.
    *   Symbols: Process (rectangle/rounded), Data Store (open rectangle), Data Flow (arrow), External Entity (square).
*   **Flowcharts**: Show step-by-step logic of a process using standard symbols.
*   **IPO charts (Input-Process-Output)**: Simple overview of tasks.
*   **Entity-Relationship Diagrams (ERD)**: Show data entities and their relationships.
    *   Relationships: One-to-One, One-to-Many, Many-to-Many.

**Why models matter:**
*   They help analysts communicate clearly with users.
*   They reduce misunderstandings before coding starts.`,
      },
      {
        title: '5. Systems Design',
        content: `Systems design turns requirements into a plan for building the system.

**Design areas:**
*   **Input design**: Forms, screens, validation rules (range check, type check, presence check, length check, format check).
*   **Output design**: Reports, dashboards, print layouts, screen displays.
*   **File/database design**: Tables, fields, data types, keys, relationships, normalisation.
*   **Processing design**: Algorithms and workflows that transform input into output.
*   **User interface design**: Layout, navigation, consistency, error messages, accessibility.

**Good design principles:**
*   Accuracy and simplicity.
*   Clear feedback to users.
*   Security and access control.
*   Validation to prevent bad data entry.`,
      },
      {
        title: '6. Testing, Implementation, and Maintenance',
        content: `**Testing types:**
*   **Unit testing**: Each individual component works correctly.
*   **Integration testing**: Components work together properly.
*   **System testing**: Full system works as expected.
*   **User acceptance testing (UAT)**: Users confirm it meets their needs.

**Test data types:**
*   **Normal data**: Valid, expected input.
*   **Boundary data**: Edge cases (e.g., min/max values).
*   **Erroneous data**: Invalid input that should be rejected.

**Implementation methods:**
*   **Direct changeover**: Old system replaced immediately. Fast but risky.
*   **Parallel running**: Old and new run together for a period. Safe but expensive.
*   **Phased implementation**: System introduced in stages. Gradual transition.
*   **Pilot**: New system tested in one branch/department first.

**Documentation:**
*   **Technical documentation**: For programmers and system maintenance.
*   **User documentation**: For training and daily use.

**Maintenance types:**
*   **Corrective**: Fix errors and bugs found after deployment.
*   **Adaptive**: Adjust to new requirements or environment changes.
*   **Perfective**: Improve performance or add features.
*   **Preventive**: Reduce future failures through proactive changes.`,
      },
    ],
    key_points: [
      'The SDLC provides a structured approach: Analysis, Design, Implementation, Testing, Maintenance.',
      'Feasibility checks technical, economic, legal, operational, and schedule factors (TELOS).',
      'Fact-finding methods include interviews, questionnaires, observation, and document analysis.',
      'Models like DFDs and ERDs describe data and process flow.',
      'Design covers inputs, outputs, databases, processing, and user interface.',
      'Testing uses normal, boundary, and erroneous data.',
      'Implementation methods: direct, parallel, phased, pilot.',
      'Maintenance types: corrective, adaptive, perfective, preventive.',
    ],
    exam_tips: [
      'Use TELOS when explaining feasibility.',
      'Distinguish functional vs non-functional requirements clearly.',
      'Label DFD symbols correctly: process, data store, data flow, external entity.',
      'Compare implementation methods using advantages and disadvantages.',
      'Mention at least two testing types and test data types in system questions.',
      'Know the four maintenance types with examples.',
    ],
  },
  'Algorithm Design and Problem-Solving': {
    topic: 'Algorithm Design and Problem-Solving',
    subject: 'Computer Science',
    summary: 'Developing step-by-step solutions using flowcharts, pseudocode, and programming structures.',
    sections: [
      {
        title: '1. What is an Algorithm?',
        content: `An algorithm is a step-by-step procedure for solving a problem. It is a set of instructions that takes inputs and produces outputs.

**Characteristics of good algorithms:**
*   **Clear and precise steps**: No ambiguity.
*   **Finite**: Must terminate after a number of steps.
*   **Effective**: Each step is doable.
*   **Input**: Takes zero or more inputs.
*   **Output**: Produces at least one output.

**Ways to represent algorithms:**
*   **Written descriptions** (structured English).
*   **Pseudocode** (language-independent code-like notation).
*   **Flowcharts** (visual diagrams).`,
      },
      {
        title: '2. Pseudocode',
        content: `Pseudocode is a way to write algorithms using a simplified, language-independent notation.

**Common pseudocode constructs:**

**Variables and Assignment:**
\`\`\`
SET name = "Alice"
SET total = 0
\`\`\`

**Input/Output:**
\`\`\`
INPUT age
OUTPUT "You are " + age + " years old"
\`\`\`

**Selection (IF-THEN-ELSE):**
\`\`\`
IF age >= 18 THEN
    OUTPUT "Adult"
ELSE
    OUTPUT "Minor"
ENDIF
\`\`\`

**Iteration (Loops):**
\`\`\`
FOR i = 1 TO 10
    OUTPUT i
NEXT i

WHILE count < 100
    SET count = count + 1
ENDWHILE

REPEAT
    INPUT password
UNTIL password = "correct"
\`\`\``,
      },
      {
        title: '3. Flowcharts',
        content: `Flowcharts use standard symbols to represent algorithms visually.

**Flowchart Symbols:**
*   **Oval/Terminator**: Start / End of the algorithm.
*   **Rectangle**: Process / Action (e.g., calculate, assign).
*   **Diamond**: Decision (Yes/No question).
*   **Parallelogram**: Input / Output (e.g., read, display).
*   **Arrow**: Flow direction between steps.

**Rules for good flowcharts:**
*   Every flowchart must have a Start and an End.
*   Arrows must flow in one direction (top to bottom, left to right).
*   Decision diamonds must have two exit paths (Yes/No or True/False).
*   Use consistent symbol sizes and spacing for readability.`,
      },
      {
        title: '4. Programming Structures',
        content: `All algorithms use three fundamental control structures:

**1. Sequence**: Steps executed one after another in order.
*   Example: Read name -> Read age -> Display greeting.

**2. Selection (Branching)**: Different actions based on a condition.
*   **IF-THEN-ELSE**: Two paths.
*   **CASE/SWITCH**: Multiple paths based on a value.

**3. Iteration (Looping)**: Repeating steps.
*   **FOR loop**: Repeats a fixed, known number of times.
*   **WHILE loop**: Repeats while a condition is true (may not execute at all).
*   **REPEAT-UNTIL**: Repeats until a condition becomes true (always executes at least once).

**Choosing the right loop:**
*   Know the count? Use FOR.
*   Must check before executing? Use WHILE.
*   Must execute at least once? Use REPEAT-UNTIL.`,
      },
      {
        title: '5. Trace Tables and Dry Runs',
        content: `A **trace table** is used to manually track how variable values change as an algorithm runs. This is called a **dry run**.

**How to create a trace table:**
1.  List all variables as column headers.
2.  Step through the algorithm one instruction at a time.
3.  Write new variable values in the next row whenever they change.
4.  Record any output produced.

**Why use trace tables?**
*   To verify that an algorithm produces the correct output.
*   To find and fix logical errors (debugging).
*   To understand how loops and conditions affect values.

Trace tables are commonly tested in exams.`,
      },
    ],
    key_points: [
      'Algorithms are step-by-step problem solutions.',
      'Pseudocode is language-independent and uses structured English.',
      'Flowcharts use standard symbols: oval, rectangle, diamond, parallelogram.',
      'Three main structures: Sequence, Selection, Iteration.',
      'FOR loops have a known number of iterations.',
      'WHILE loops may not execute at all if condition is false initially.',
      'REPEAT-UNTIL always executes at least once.',
      'Trace tables track variable changes step by step.',
    ],
    exam_tips: [
      'Always use correct flowchart symbols.',
      'Trace tables help verify algorithm correctness - practise these!',
      'Pseudocode should be language-independent.',
      'Check boundary conditions when testing algorithms.',
      'Know when to use FOR, WHILE, and REPEAT-UNTIL loops.',
    ],
  },
  'Programming': {
    topic: 'Programming',
    subject: 'Computer Science',
    summary: 'Writing code using variables, data types, control structures, functions, and translators.',
    sections: [
      {
        title: '1. Variables, Constants, and Data Types',
        content: `**Variables** store data that can change during program execution. They are named memory locations.
**Constants** store values that do not change (e.g., PI = 3.14159).

**Common Data Types:**
*   **Integer**: Whole numbers (e.g., 42, -7, 0).
*   **Real/Float**: Decimal numbers (e.g., 3.14, -0.5, 99.99).
*   **String**: Text enclosed in quotes (e.g., "Hello World").
*   **Boolean**: True or False only.
*   **Character (Char)**: A single letter, digit, or symbol (e.g., 'A', '9', '!').

**Naming conventions:**
*   Use meaningful names (e.g., \`studentAge\` not \`x\`).
*   No spaces or special characters.
*   Start with a letter, not a number.
*   Case-sensitive in most languages.`,
      },
      {
        title: '2. Operators',
        content: `**Arithmetic Operators:**
*   \`+\` (addition), \`-\` (subtraction), \`*\` (multiplication), \`/\` (division)
*   \`MOD\` (modulus - gives the remainder, e.g., 7 MOD 3 = 1)
*   \`DIV\` (integer division - gives the whole number, e.g., 7 DIV 3 = 2)

**Comparison (Relational) Operators:**
*   \`=\` (equal), \`<>\` or \`!=\` (not equal)
*   \`<\` (less than), \`>\` (greater than)
*   \`<=\` (less than or equal), \`>=\` (greater than or equal)

**Logical (Boolean) Operators:**
*   \`AND\`: True if both conditions are true.
*   \`OR\`: True if at least one condition is true.
*   \`NOT\`: Reverses the boolean value.

**String Operations:**
*   **Concatenation**: Joining strings together (e.g., "Hello" + " " + "World" = "Hello World").
*   **Length**: Finding the number of characters.
*   **Substring**: Extracting part of a string.
*   **Upper/Lower**: Converting case.`,
      },
      {
        title: '3. Input, Output, and Control Structures',
        content: `**Input and Output:**
*   \`INPUT\` reads data from the user.
*   \`OUTPUT\` / \`PRINT\` displays data to the user.

**Selection:**
*   \`IF...THEN...ELSE...ENDIF\` for two-way decisions.
*   \`CASE...OF...ENDCASE\` for multi-way decisions.

**Iteration:**
*   \`FOR...NEXT\`: Counted loop.
*   \`WHILE...ENDWHILE\`: Condition-controlled (pre-check).
*   \`REPEAT...UNTIL\`: Condition-controlled (post-check).

**Arrays:**
An array is a data structure that stores multiple values of the same data type under one name.
*   Accessed by index (usually starting at 0 or 1).
*   Example: \`marks[0] = 75\`, \`marks[1] = 82\`, \`marks[2] = 91\`.
*   Useful for storing lists of items (names, scores, temperatures).`,
      },
      {
        title: '4. Procedures and Functions',
        content: `**Procedures** and **Functions** are reusable blocks of code.

**Procedure**: Performs a task but does NOT return a value.
\`\`\`
PROCEDURE greet(name)
    OUTPUT "Hello, " + name
ENDPROCEDURE
\`\`\`

**Function**: Performs a task and RETURNS a value.
\`\`\`
FUNCTION add(a, b)
    RETURN a + b
ENDFUNCTION
\`\`\`

**Parameters**: Values passed into a procedure or function.
**Arguments**: Actual values given when calling the procedure/function.

**Benefits of using procedures/functions:**
*   **Code reuse**: Write once, use many times.
*   **Readability**: Breaks code into logical sections.
*   **Easier debugging**: Test each part independently.
*   **Modularity**: Different programmers can work on different parts.`,
      },
      {
        title: '5. Translators',
        content: `Source code written by humans must be translated into machine code for the CPU to execute.

**Compiler**: Translates the entire program at once before execution.
*   Creates an executable file (.exe).
*   Faster execution after compilation.
*   All errors reported after full compilation.
*   Source code not needed to run the program.

**Interpreter**: Translates and executes code one line at a time.
*   No executable file created.
*   Slower execution (translates every time).
*   Errors shown immediately at the line they occur - easier debugging.
*   Source code needed every time you run.

**Assembler**: Translates assembly language (low-level) to machine code.

**Compiler vs Interpreter (Key Exam Comparison):**
*   Compiler is faster at runtime; Interpreter is better for debugging.
*   Compiler produces a standalone executable; Interpreter needs the source code.`,
      },
      {
        title: '6. Testing and Debugging',
        content: `**Types of errors:**
*   **Syntax errors**: Breaking the rules of the language (e.g., missing bracket). Caught by the translator.
*   **Logic errors**: Code runs but produces wrong results (e.g., wrong formula). Hardest to find.
*   **Runtime errors**: Code crashes during execution (e.g., division by zero, file not found).

**Testing strategies:**
*   Use **normal data** (valid input that should work).
*   Use **boundary data** (edge cases, min/max values).
*   Use **erroneous data** (invalid input that should be rejected).

**Debugging techniques:**
*   **Trace tables**: Manually track variable values.
*   **Print statements**: Output variable values at key points.
*   **Breakpoints**: Pause execution and inspect the program state.
*   **Step-through**: Execute one line at a time.`,
      },
    ],
    key_points: [
      "Variables store changeable data; constants don't change.",
      'Choose appropriate data types for efficiency and correctness.',
      'MOD gives remainder, DIV gives integer division.',
      'Arrays store multiple values of the same type under one name.',
      'Procedures perform tasks; Functions return values.',
      'Compilers translate all at once; Interpreters translate line by line.',
      'Three error types: syntax, logic, and runtime.',
      'Test with normal, boundary, and erroneous data.',
    ],
    exam_tips: [
      'Always declare variable data types appropriately.',
      'Know the difference between compiler and interpreter (common exam question).',
      'Use meaningful variable names in pseudocode answers.',
      'Test programs with normal, boundary, and erroneous data.',
      'Know how to write and call procedures and functions.',
      'Understand the difference between syntax, logic, and runtime errors.',
    ],
  },
  'Databases': {
    topic: 'Databases',
    subject: 'Computer Science',
    summary: 'Creating, querying, and managing structured collections of data using relational databases and SQL.',
    sections: [
      {
        title: '1. Database Concepts',
        content: `A **database** is an organised collection of structured data, stored electronically.

**Key Terms:**
*   **Table (Relation)**: A collection of related records (like a spreadsheet).
*   **Record (Row/Tuple)**: A single row containing data about one entity.
*   **Field (Column/Attribute)**: A single item of data within a record.
*   **Primary Key**: A unique identifier for each record (e.g., StudentID). No two records can have the same primary key.
*   **Foreign Key**: A field in one table that links to the primary key of another table. Creates relationships.
*   **Candidate Key**: Any field that could be a primary key (unique for every record).
*   **Composite Key**: A primary key made up of two or more fields together.

**Flat-File vs Relational Database:**
*   **Flat-file**: Single table. Simple but leads to data redundancy (repeated data).
*   **Relational**: Multiple linked tables. Reduces redundancy and improves data integrity.`,
      },
      {
        title: '2. Database Design and Normalisation',
        content: `Good database design reduces data redundancy and ensures data integrity.

**Entity-Relationship Diagrams (ERDs):**
Show the relationships between entities (tables).
*   **One-to-One (1:1)**: Each record in table A relates to one record in table B.
*   **One-to-Many (1:M)**: One record in table A relates to many records in table B.
*   **Many-to-Many (M:M)**: Records in both tables can relate to many in the other. Resolved using a junction/link table.

**Normalisation:**
The process of organising a database to reduce redundancy.
*   **1NF (First Normal Form)**: No repeating groups; each field holds one value.
*   **2NF (Second Normal Form)**: In 1NF + all non-key fields depend on the entire primary key.
*   **3NF (Third Normal Form)**: In 2NF + no non-key field depends on another non-key field.

**Data Types for Fields:**
*   Text/String, Integer, Real/Float, Boolean, Date/Time`,
      },
      {
        title: '3. SQL - Structured Query Language',
        content: `**SQL** is the standard language for interacting with relational databases.

**SELECT - Retrieve data:**
\`\`\`sql
SELECT FirstName, Surname FROM Students WHERE Age > 16
SELECT * FROM Students ORDER BY Surname ASC
SELECT COUNT(*) FROM Students WHERE Gender = 'F'
\`\`\`

**INSERT - Add new records:**
\`\`\`sql
INSERT INTO Students (FirstName, Surname, Age) VALUES ('John', 'Doe', 17)
\`\`\`

**UPDATE - Modify existing records:**
\`\`\`sql
UPDATE Students SET Age = 18 WHERE StudentID = 1
\`\`\`

**DELETE - Remove records:**
\`\`\`sql
DELETE FROM Students WHERE StudentID = 5
\`\`\`

**Key SQL clauses:**
*   \`WHERE\`: Filter records based on conditions.
*   \`ORDER BY\`: Sort results (ASC = ascending, DESC = descending).
*   \`AND\`, \`OR\`: Combine multiple conditions.
*   \`LIKE\`: Pattern matching (e.g., \`WHERE Name LIKE 'J%'\` finds names starting with J).
*   \`COUNT\`, \`SUM\`, \`AVG\`, \`MAX\`, \`MIN\`: Aggregate functions.`,
      },
      {
        title: '4. Data Validation and Verification',
        content: `**Validation** checks that data is reasonable and follows rules before it is accepted.

**Validation checks:**
*   **Range check**: Is the value within acceptable limits? (e.g., age between 0 and 150)
*   **Type check**: Is it the correct data type? (e.g., age should be a number)
*   **Presence check**: Has the field been filled in? (not left blank)
*   **Length check**: Is the data the correct length? (e.g., password at least 8 characters)
*   **Format check**: Does it match a required pattern? (e.g., date as DD/MM/YYYY)
*   **Check digit**: A calculated digit used to detect errors (e.g., ISBN barcode).

**Verification** checks that data has been entered correctly by the user.
*   **Double entry**: Typing the data twice and comparing.
*   **Screen/visual check**: User reviews data on screen before confirming.`,
      },
    ],
    key_points: [
      'Primary keys uniquely identify each record.',
      'Foreign keys create relationships between tables.',
      'Relational databases reduce redundancy compared to flat-files.',
      'Normalisation organises data into 1NF, 2NF, and 3NF.',
      'SQL SELECT retrieves data; INSERT adds; UPDATE modifies; DELETE removes.',
      'WHERE clause filters records based on conditions.',
      'Validation checks data is reasonable; Verification checks it was entered correctly.',
    ],
    exam_tips: [
      'Always include WHERE in UPDATE/DELETE to avoid affecting all records.',
      'Use ORDER BY to sort results.',
      'Know the difference between flat-file and relational databases.',
      'Practice writing SQL queries with multiple conditions.',
      'Know the difference between validation and verification.',
      'Be able to identify primary and foreign keys in a table structure.',
      'Understand 1NF, 2NF, and 3NF with examples.',
    ],
  },
  'Web Design and Internet Uses': {
    topic: 'Web Design and Internet Uses',
    subject: 'Computer Science',
    summary: 'Designing effective web pages and understanding common Internet services and uses.',
    sections: [
      {
        title: '1. Internet vs World Wide Web',
        content: `**Internet** is the global network of connected computers and devices.
**World Wide Web (WWW)** is a service on the Internet that uses web pages and hyperlinks.

**Key concepts:**
*   **Client-server model**: Browser (client) sends requests to a web server, which responds with web pages.
*   **URL (Uniform Resource Locator)**: Unique address for a web resource (e.g., https://www.example.com/page).
*   **Web hosting**: Storing website files on a server connected to the Internet.
*   **Web browser**: Software used to access web pages (Chrome, Firefox, Safari).
*   **ISP (Internet Service Provider)**: Company that provides Internet access.

**The Internet is NOT the same as the World Wide Web:**
*   The Internet is the physical infrastructure (cables, routers, servers).
*   The WWW is one of many services that runs on the Internet (others include email, FTP, VoIP).`,
      },
      {
        title: '2. HTML - Page Structure',
        content: `**HTML (HyperText Markup Language)** defines the structure and content of web pages using tags.

**Common HTML elements:**
*   Headings: \`<h1>\` to \`<h6>\` (h1 is largest).
*   Paragraphs: \`<p>\`.
*   Links: \`<a href="url">Link text</a>\`.
*   Images: \`<img src="image.jpg" alt="description">\`.
*   Lists: \`<ul>\` (unordered/bullets), \`<ol>\` (ordered/numbers), \`<li>\` (list item).
*   Tables: \`<table>\`, \`<tr>\` (row), \`<th>\` (header cell), \`<td>\` (data cell).
*   Forms: \`<form>\`, \`<input>\`, \`<button>\`, \`<select>\`.
*   Div: \`<div>\` - a container for grouping content.

**HTML Document Structure:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\``,
      },
      {
        title: '3. CSS - Styling and Layout',
        content: `**CSS (Cascading Style Sheets)** controls the visual presentation of HTML elements.

**What CSS controls:**
*   Fonts and text (size, colour, family, weight).
*   Colours and backgrounds.
*   Spacing (margin, padding).
*   Layout (flexbox, grid, positioning).
*   Borders and shadows.
*   Responsive design (adapting to different screen sizes).

**Three ways to apply CSS:**
1.  **Inline**: \`<p style="color: red;">Red text</p>\` (not recommended for large sites).
2.  **Internal**: \`<style>\` block in the HTML \`<head>\`.
3.  **External**: Separate .css file linked to the HTML (best practice).

**CSS is important because:**
*   Separates content (HTML) from presentation (CSS).
*   Makes it easy to change the look of an entire site from one file.
*   Enables responsive design for mobile devices.`,
      },
      {
        title: '4. JavaScript - Interactivity',
        content: `**JavaScript** adds interactivity and dynamic behaviour to web pages.

**What JavaScript can do:**
*   **Form validation**: Check user input before submitting.
*   **Dynamic content**: Update parts of a page without reloading.
*   **Animations**: Move, fade, or transform elements.
*   **Event handling**: Respond to user actions (clicks, hovers, keypresses).
*   **Pop-ups and alerts**: Display messages to users.

**Client-side vs Server-side scripting:**
*   **Client-side** (JavaScript): Runs in the user's browser. Fast, no server load.
*   **Server-side** (PHP, Python, Node.js): Runs on the server. Needed for database access and security.`,
      },
      {
        title: '5. Good Web Design Principles',
        content: `A good website is **clear, usable, and accessible**.

**Design principles:**
*   **Consistency**: Same style, colours, and navigation across all pages.
*   **Navigation**: Simple menus, clear links, breadcrumbs. Users should find information within 3 clicks.
*   **Readability**: Readable fonts, good contrast between text and background.
*   **Responsive design**: Works well on phones, tablets, and desktops.
*   **Accessibility**: Alt text for images, keyboard navigation, screen reader support, sufficient colour contrast.
*   **Performance**: Optimised images, minimal loading time, efficient code.
*   **White space**: Don't clutter pages; give elements room to breathe.

**Testing a website:**
*   Test on different browsers (Chrome, Firefox, Safari, Edge).
*   Test on different devices (mobile, tablet, desktop).
*   Test with different screen sizes.
*   Check all links work.
*   Validate HTML and CSS using W3C validators.`,
      },
      {
        title: '6. Internet Services and Uses',
        content: `**Common Internet services:**
*   **Email**: Sending and receiving messages (uses SMTP, POP3, IMAP).
*   **FTP (File Transfer Protocol)**: Transferring files between computers.
*   **VoIP (Voice over IP)**: Voice calls over the Internet (e.g., Skype, Zoom).
*   **Cloud services**: Online storage and applications (Google Drive, Dropbox).
*   **E-commerce**: Buying and selling goods online.
*   **Social media**: Communication, networking, and content sharing.
*   **Search engines**: Locating information online (Google, Bing).
*   **Streaming**: Watching video/listening to music in real-time (YouTube, Spotify).

**Risks and safety online:**
*   Phishing and scams.
*   Malware downloads.
*   Privacy issues when sharing personal data.
*   Copyright violations.
*   Cyberbullying and online harassment.

**Staying safe:**
*   Use strong passwords and 2FA.
*   Check URLs before clicking links.
*   Keep software updated.
*   Use antivirus and firewalls.
*   Be careful what personal information you share online.`,
      },
    ],
    key_points: [
      'The Internet is the network; the Web is one of its services.',
      'HTML structures content, CSS styles it, JavaScript adds interactivity.',
      'The client-server model: browser requests, server responds.',
      'Good web design focuses on usability, readability, accessibility, and responsiveness.',
      'CSS should be in external files for best practice.',
      'Internet services include email, FTP, cloud, VoIP, and e-commerce.',
      'Online safety is essential due to scams, malware, and privacy risks.',
    ],
    exam_tips: [
      'Differentiate Internet and WWW with clear definitions.',
      'Explain client-server model using a simple example.',
      'State at least three web design principles in questions.',
      'Know basic HTML tags and what they do.',
      'Give examples of Internet services and their uses.',
      'Include safety measures when asked about Internet use.',
      'Know the difference between client-side and server-side scripting.',
    ],
  },
  'Automated and Emerging Technologies': {
    topic: 'Automated and Emerging Technologies',
    subject: 'Computer Science',
    summary: 'Modern technologies that automate tasks, process large data, and transform industries.',
    sections: [
      {
        title: '1. Automation and Control',
        content: `**Automation** means using computers and machines to perform tasks with minimal human intervention.

**Key components of a control system:**
*   **Sensors** to capture data (temperature, motion, light, pressure, humidity).
*   **Controllers/Processors** to process input and make decisions based on programmed rules.
*   **Actuators** to perform actions (motors, valves, heaters, alarms).

**The Control Loop:**
1.  Sensor reads a value (e.g., temperature = 28°C).
2.  Controller compares it to the desired value (e.g., target = 25°C).
3.  If different, controller activates an actuator (e.g., turns on air conditioning).
4.  Sensor reads again - continuous feedback loop.

**Examples of automated systems:**
*   Automated teller machines (ATMs).
*   Smart irrigation systems (soil moisture sensors control water flow).
*   Industrial robots on assembly lines.
*   Traffic light control systems (sensors detect traffic flow).
*   Central heating systems (thermostat controls boiler).`,
      },
      {
        title: '2. Artificial Intelligence and Machine Learning',
        content: `**Artificial Intelligence (AI)** is the simulation of human intelligence by computers. AI systems can learn, reason, and make decisions.

**Types of AI:**
*   **Narrow AI (Weak AI)**: Designed for one specific task (e.g., chess, voice assistants). This is what exists today.
*   **General AI (Strong AI)**: Can perform any intellectual task a human can. Does not yet exist.

**Common AI applications:**
*   **Speech recognition**: Voice assistants (Siri, Alexa, Google Assistant).
*   **Image recognition**: Face unlock on phones, medical image analysis.
*   **Recommendation systems**: Netflix suggests shows, Amazon suggests products.
*   **Chatbots**: Automated customer support.
*   **Self-driving vehicles**: Cars that navigate without human input.
*   **Natural Language Processing (NLP)**: Understanding and generating human language.

**Machine Learning (ML):**
A subset of AI where systems learn patterns from data and improve over time without being explicitly programmed.
*   **Training data**: Large datasets used to train the model.
*   **The model improves** as it sees more data.
*   Example: Spam email filter learns to identify spam from examples.`,
      },
      {
        title: '3. Internet of Things (IoT)',
        content: `**IoT** connects everyday physical devices to the Internet so they can send and receive data.

**Examples:**
*   **Smart home devices**: Lights, locks, cameras, thermostats controlled via phone.
*   **Wearable devices**: Fitness trackers, smartwatches monitoring health data.
*   **Smart farming**: Soil sensors, weather monitoring, automated irrigation.
*   **Smart cities**: Traffic monitoring, waste management, energy-efficient lighting.
*   **Industrial IoT**: Monitoring equipment in factories for maintenance.

**Benefits of IoT:**
*   Real-time monitoring and control.
*   Improved efficiency and automation.
*   Data-driven decision making.

**Risks of IoT:**
*   Privacy concerns (devices collecting personal data).
*   Security vulnerabilities (hacked devices, botnets).
*   Dependence on Internet connectivity.
*   Interoperability issues (devices from different manufacturers).`,
      },
      {
        title: '4. Cloud Computing',
        content: `**Cloud computing** provides computing services (storage, processing, software) over the Internet, on demand.

**Service Models:**
*   **IaaS (Infrastructure as a Service)**: Rent virtual servers and storage (e.g., AWS, Azure).
*   **PaaS (Platform as a Service)**: Platform for developing and deploying apps (e.g., Google App Engine).
*   **SaaS (Software as a Service)**: Use software via browser (e.g., Google Docs, Office 365).

**Benefits:**
*   Access from anywhere with Internet.
*   No need to buy/maintain expensive hardware.
*   Scalable - pay for what you use.
*   Automatic backups and updates.
*   Collaboration made easy.

**Risks:**
*   Requires Internet connection.
*   Data stored on third-party servers - privacy concerns.
*   Potential downtime if provider has issues.
*   Ongoing subscription costs.`,
      },
      {
        title: '5. Other Emerging Technologies',
        content: `**Robotics**: Machines that perform physical tasks autonomously or semi-autonomously.
*   Used in manufacturing, surgery, exploration, and home assistance.

**3D Printing (Additive Manufacturing)**: Creating physical objects layer by layer from digital designs.
*   Used in prototyping, medical implants, construction, education.

**Biometrics**: Identification using unique biological characteristics.
*   Fingerprints, facial recognition, iris scanning, voice recognition.
*   Used in security, border control, phone unlock.

**Virtual Reality (VR)**: Fully immersive digital environments using headsets.
*   Used in gaming, training simulations, virtual tours.

**Augmented Reality (AR)**: Overlaying digital information on the real world.
*   Used in navigation, education, retail (virtual try-on).

**Blockchain**: A secure, decentralised digital ledger for recording transactions.
*   Used in cryptocurrency, supply chain tracking, voting systems.

**Quantum Computing**: Uses quantum mechanics for processing. Potentially millions of times faster than classical computers for specific problems. Still in early stages.`,
      },
      {
        title: '6. Impacts, Benefits, and Challenges',
        content: `**Benefits of emerging technologies:**
*   Higher efficiency, accuracy, and productivity.
*   Improved safety in dangerous tasks (robots in mining, disaster zones).
*   Better data-driven decisions in business and healthcare.
*   New industries, products, and job opportunities.
*   Improved quality of life (smart homes, telemedicine).

**Challenges and concerns:**
*   **Job displacement**: Automation replacing human workers, creating skills gaps.
*   **Privacy and surveillance**: AI and IoT collecting vast amounts of personal data.
*   **Security risks**: Hacked IoT devices, AI-generated deepfakes.
*   **Digital divide**: Not everyone has equal access to new technologies.
*   **Ethical concerns**: Bias in AI algorithms, autonomous weapons, data misuse.
*   **Environmental impact**: E-waste, energy consumption of data centres.
*   **Dependence on technology**: Over-reliance on systems that can fail.

**The key message**: Technology should be developed and used responsibly, with consideration for its impact on individuals, society, and the environment.`,
      },
    ],
    key_points: [
      'Automation uses sensors, controllers, and actuators in a feedback loop.',
      'AI simulates human intelligence; ML learns from data.',
      'IoT connects everyday devices to the Internet for data exchange.',
      'Cloud computing provides on-demand services (IaaS, PaaS, SaaS).',
      'Emerging tech includes robotics, 3D printing, VR/AR, blockchain, and biometrics.',
      'Technology brings both opportunities and ethical challenges.',
      'Responsible development considers impact on people, society, and environment.',
    ],
    exam_tips: [
      'Use real-life examples to explain emerging technologies.',
      'State both benefits and risks in evaluation questions.',
      'Differentiate automation from manual processing clearly.',
      'Explain why IoT devices need security measures.',
      'Link AI or robotics to specific industry applications.',
      'Know the three cloud service models: IaaS, PaaS, SaaS.',
      'Discuss ethical implications when asked about impacts of technology.',
    ],
  },
};

export function getTopicNotes(topicName: string): TopicNotes | null {
  return computerScienceNotes[topicName] ?? null;
}

export function getTopicNotesBySlug(slug: string): TopicNotes | null {
  const name = topicSlugToName(slug);
  return name ? getTopicNotes(name) : null;
}
