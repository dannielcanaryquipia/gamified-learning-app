import { Lesson, Topic, UserProfile, UserProgress } from '../types';

// Computer Basics Lessons
const computerBasicsLessons: Lesson[] = [
  {
    id: 'cb-1',
    title: 'What is a Computer?',
    description: 'Understanding the basic definition and purpose of computers',
    duration: 15,
    isCompleted: false,
    xp: 30,
    order: 1,
    quiz: {
      id: 'quiz-cb-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'cb1-q1',
          question: 'What is a computer?',
          options: [
            'A device for making phone calls only',
            'An electronic device that processes, stores, and retrieves information',
            'A type of television',
            'A mechanical calculator'
          ],
          correctIndex: 1
        },
        {
          id: 'cb1-q2',
          question: 'Which of the following is NOT a key characteristic of a computer?',
          options: [
            'Electronic',
            'Programmable',
            'Emotional',
            'Fast'
          ],
          correctIndex: 2
        },
        {
          id: 'cb1-q3',
          question: 'Which type of computer is designed for regular use at a single location?',
          options: [
            'Laptop',
            'Smartphone',
            'Desktop Computer',
            'Tablet'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# What is a Computer?

## Definition
A computer is an electronic device that processes, stores, and retrieves information according to instructions given by a software program.

## Key Characteristics
1. **Electronic** - Operates using electronic circuits
2. **Programmable** - Follows instructions from software
3. **Automatic** - Performs tasks without human intervention
4. **Fast** - Processes information at high speed
5. **Accurate** - Produces precise results
6. **Versatile** - Can perform many different tasks

## Types of Computers
- **Desktop Computers** - Designed for regular use at a single location
- **Laptop Computers** - Portable computers with integrated screen and keyboard
- **Tablets** - Touchscreen mobile computers
- **Smartphones** - Mobile phones with computer capabilities
- **Servers** - Computers that provide services to other computers

## What Computers Can Do
- Process information (calculations, data analysis)
- Store and retrieve data
- Communicate with other computers
- Create and edit documents
- Play games and multimedia
- Control other devices`
  },
  {
    id: 'cb-2',
    title: 'How Computers Work',
    description: 'Understanding the basic working principles of computers',
    duration: 20,
    isCompleted: false,
    xp: 40,
    order: 2,
    quiz: {
      id: 'quiz-cb-2',
      passingScore: 0.7,
      questions: [
        {
          id: 'cb2-q1',
          question: 'What is the four-step process that computers use called?',
          options: [
            'Binary Processing Cycle',
            'Information Processing Cycle',
            'Digital Computation Loop',
            'Software Execution Pipeline'
          ],
          correctIndex: 1
        },
        {
          id: 'cb2-q2',
          question: 'What does the CPU do?',
          options: [
            'Stores files permanently',
            'Displays images on screen',
            'Processes data and performs calculations',
            'Provides power to the computer'
          ],
          correctIndex: 2
        },
        {
          id: 'cb2-q3',
          question: 'Computers use binary code made of which digits?',
          options: [
            '1 and 2',
            '0 and 1',
            'A and B',
            '0 through 9'
          ],
          correctIndex: 1
        }
      ]
    },
    content: `# How Computers Work

## The Basic Process
Computers work through a four-step process called the **Information Processing Cycle**:

### 1. Input
- Data enters the computer through input devices
- Examples: keyboard, mouse, microphone, camera
- The computer receives this data in a format it can understand

### 2. Processing
- The CPU (Central Processing Unit) processes the input data
- Performs calculations and makes decisions
- Follows instructions from software programs

### 3. Storage
- Processed data is stored temporarily or permanently
- **RAM (Random Access Memory)** - Temporary storage
- **Hard Drive/SSD** - Permanent storage

### 4. Output
- Results are displayed or transmitted through output devices
- Examples: monitor, printer, speakers

## The Role of Software
- **Operating System** - Manages computer hardware and software
- **Application Software** - Programs that perform specific tasks
- **Programming Languages** - Languages used to create software

## Binary System
Computers use binary code (0s and 1s) to represent all data:
- All text, images, and sounds are converted to binary
- The CPU processes these binary signals
- Results are converted back to human-readable format`
  },
  {
    id: 'cb-3',
    title: 'Parts of a Computer',
    description: 'Learning about the main hardware components',
    duration: 25,
    isCompleted: false,
    xp: 50,
    order: 3,
    quiz: {
      id: 'quiz-cb-3',
      passingScore: 0.7,
      questions: [
        {
          id: 'cb3-q1',
          question: 'What is the "brain" of the computer?',
          options: [
            'RAM',
            'Hard Drive',
            'CPU',
            'Power Supply'
          ],
          correctIndex: 2
        },
        {
          id: 'cb3-q2',
          question: 'What is the purpose of RAM?',
          options: [
            'Permanent file storage',
            'Temporary storage for running programs',
            'Processing visual information',
            'Connecting to the internet'
          ],
          correctIndex: 1
        }
      ]
    },
    content: `# Parts of a Computer

## Core Hardware Components

### 1. CPU (Central Processing Unit)
- **Function**: The "brain" of the computer
- **Purpose**: Processes instructions and performs calculations
- **Examples**: Intel Core i7, AMD Ryzen 5

### 2. Memory (RAM)
- **Function**: Temporary storage for running programs
- **Purpose**: Allows fast access to data the CPU is actively using
- **Examples**: 8GB DDR4, 16GB DDR5

### 3. Storage Devices
- **Hard Drive (HDD)**: Magnetic storage, larger capacity, slower
- **Solid State Drive (SSD)**: Flash storage, faster, more durable
- **Purpose**: Permanent storage of files and programs

### 4. Motherboard
- **Function**: Connects all components together
- **Purpose**: Allows communication between parts
- **Contains**: CPU socket, RAM slots, storage connectors

### 5. Graphics Card (GPU)
- **Function**: Processes and displays visual information
- **Purpose**: Renders images, videos, and animations
- **Examples**: NVIDIA GeForce, AMD Radeon

### 6. Power Supply
- **Function**: Converts AC power to DC power
- **Purpose**: Provides electricity to all components

### 7. Input Devices
- **Keyboard**: For typing text and commands
- **Mouse**: For pointing and clicking
- **Microphone**: For audio input

### 8. Output Devices
- **Monitor**: Displays visual information
- **Speakers**: Produce sound
- **Printer**: Creates physical copies

## How They Work Together
1. Power supply provides electricity
2. Motherboard connects all components
3. CPU processes instructions
4. RAM stores temporary data
5. Storage holds files permanently
6. Input/output devices allow interaction`
  }
];

// Internet Basics Lessons
const internetBasicsLessons: Lesson[] = [
  {
    id: 'ib-1',
    title: 'What is the Internet?',
    description: 'Understanding the global network of computers',
    duration: 15,
    isCompleted: false,
    xp: 30,
    order: 1,
    quiz: {
      id: 'quiz-ib-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'ib1-q1',
          question: 'What is the Internet?',
          options: [
            'A single computer',
            'A software program',
            'A global network of billions of connected computers',
            'A type of web browser'
          ],
          correctIndex: 2
        },
        {
          id: 'ib1-q2',
          question: 'Which connection type provides the highest speed?',
          options: [
            'Dial-up',
            'Satellite',
            'Fiber optic broadband',
            'Bluetooth'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# What is the Internet?

## Definition
The Internet is a global network of billions of computers and other electronic devices connected together, allowing them to communicate and share information.

## How It Works
- **Network**: Computers connected to each other
- **Protocols**: Rules for how computers communicate
- **Servers**: Computers that store and serve information
- **Clients**: Computers that request and display information

## Key Services
1. **World Wide Web (WWW)**: Websites and web pages
2. **Email**: Electronic mail communication
3. **File Sharing**: Transferring files between computers
4. **Streaming**: Watching videos and listening to music online
5. **Social Media**: Online platforms for social interaction

## Internet Connection Types
- **Broadband**: High-speed internet (cable, DSL, fiber)
- **Wireless**: Wi-Fi and mobile data
- **Satellite**: Internet via satellite connection

## How We Access the Internet
- **Web Browsers**: Chrome, Firefox, Safari, Edge
- **Search Engines**: Google, Bing, DuckDuckGo
- **URLs**: Web addresses like www.example.com`
  },
  {
    id: 'ib-2',
    title: 'How the Web Works',
    description: 'Understanding websites, browsers, and web addresses',
    duration: 20,
    isCompleted: false,
    xp: 40,
    order: 2,
    quiz: {
      id: 'quiz-ib-2',
      passingScore: 0.7,
      questions: [
        {
          id: 'ib2-q1',
          question: 'What does HTTPS stand for?',
          options: [
            'Hyper Text Transfer Protocol Secure',
            'High Tech Transfer Protocol System',
            'Hyper Text Transport Protocol Server',
            'Home Transfer Text Protocol Secure'
          ],
          correctIndex: 0
        },
        {
          id: 'ib2-q2',
          question: 'What is the correct order when you visit a website?',
          options: [
            'Server → Browser → URL → Display',
            'URL → Server → Browser → Display',
            'Browser sends request → Server processes → Server responds → Browser displays',
            'Display → Browser → Server → URL'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# How the Web Works

## Key Components

### 1. Websites
- Collections of web pages
- Created using HTML, CSS, and JavaScript
- Hosted on web servers

### 2. Web Browsers
- Software to access the web
- Examples: Chrome, Firefox, Safari
- Interpret and display web pages

### 3. URLs (Uniform Resource Locators)
- Web addresses for specific pages
- Example: https://www.example.com/page
- Structure: Protocol + Domain + Path

### 4. HTTP/HTTPS
- **Protocol**: Rules for web communication
- **HTTP**: Hypertext Transfer Protocol
- **HTTPS**: Secure version with encryption

## The Process
1. User types URL in browser
2. Browser sends request to server
3. Server processes the request
4. Server sends back the web page
5. Browser displays the page

## Search Engines
- Index web pages
- Allow users to find information
- Rank results by relevance
- Examples: Google, Bing, DuckDuckGo`
  }
];

// Programming Basics Lessons
const programmingBasicsLessons: Lesson[] = [
  {
    id: 'pb-1',
    title: 'What is Programming?',
    description: 'Introduction to computer programming concepts',
    duration: 20,
    isCompleted: false,
    xp: 30,
    order: 1,
    quiz: {
      id: 'quiz-pb-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'pb1-q1',
          question: 'What is programming?',
          options: [
            'Watching TV shows',
            'Creating instructions that tell a computer what to do',
            'Using a word processor',
            'Browsing the internet'
          ],
          correctIndex: 1
        },
        {
          id: 'pb1-q2',
          question: 'What is an algorithm?',
          options: [
            'A type of programming language',
            'A computer virus',
            'Step-by-step instructions to solve a problem',
            'A hardware component'
          ],
          correctIndex: 2
        },
        {
          id: 'pb1-q3',
          question: 'Which language is commonly recommended for beginners?',
          options: [
            'C++',
            'Assembly',
            'Python',
            'Rust'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# What is Programming?

## Definition
Programming is the process of creating instructions that tell a computer what to do. These instructions are written in programming languages.

## Key Concepts

### 1. Algorithms
- Step-by-step instructions to solve a problem
- Like a recipe for a computer
- Must be clear and precise

### 2. Programming Languages
- **Python**: Easy to learn, great for beginners
- **JavaScript**: Used for web development
- **Java**: Popular for enterprise applications
- **C++**: Used for system programming

### 3. Code
- Written text that computers can understand
- Follows specific syntax rules
- Can be compiled or interpreted

### 4. Debugging
- Finding and fixing errors in code
- Essential skill for programmers
- Uses debugging tools and techniques

## What Programmers Do
- Analyze problems
- Design solutions
- Write code
- Test programs
- Fix bugs
- Maintain existing software

## Why Learn Programming?
- **Problem solving**: Teaches logical thinking
- **Career opportunities**: High demand for programmers
- **Creativity**: Create new things
- **Automation**: Make tasks easier`
  }
];

// Networking Basics Lessons
const networkingBasicsLessons: Lesson[] = [
  {
    id: 'intro-to-ip',
    title: 'Understanding IP Addresses',
    description: 'Learn how every device on the internet is identified.',
    duration: 5,
    isCompleted: false,
    xp: 50,
    order: 1,
    quiz: {
      id: 'quiz-ip-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of an IP address?',
          options: [
            'To store website images',
            'To uniquely identify a device on a network',
            'To increase internet connection speed',
            'To encrypt user emails'
          ],
          correctIndex: 1
        },
        {
          id: 'q2',
          question: 'Which IP version was created to handle the shortage of unique addresses?',
          options: [
            'IPv2',
            'IPv4',
            'IPv6',
            'IPvX'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# Introduction
Every device connected to a network needs a unique identifier, much like your home has a physical mailing address. This is where the **Internet Protocol (IP)** address comes in.

# Key Concepts
- **Uniqueness:** No two devices on the same network can share an IP address.
- **Versions:** 
    - **IPv4:** The older, 32-bit standard (e.g., \`192.168.1.1\`).
    - **IPv6:** The modern, 128-bit standard created to handle the billions of devices today (e.g., \`2001:0db8:85a3:0000:0000:8a2e:0370:7334\`).
- **Static vs Dynamic:** Some IPs stay the same (Static), while others change every time you connect (Dynamic).

# Example
Imagine you are sending a letter. The **IP address** is the address on the envelope that tells the post office exactly where the data (the letter) should be delivered.`
  },
  {
    id: 'dns-basics',
    title: 'DNS: The Phonebook of the Internet',
    description: 'How names like google.com become IP addresses.',
    duration: 7,
    isCompleted: false,
    xp: 60,
    order: 2,
    quiz: {
      id: 'quiz-dns-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'dns-q1',
          question: 'What does DNS stand for?',
          options: [
            'Digital Network Service',
            'Domain Name System',
            'Data Network Server',
            'Direct Name Service'
          ],
          correctIndex: 1
        },
        {
          id: 'dns-q2',
          question: 'What does an A Record point to?',
          options: [
            'An IPv6 address',
            'Another domain name',
            'An IPv4 address',
            'A mail server'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# Introduction
When you type \`google.com\` into your browser, your computer doesn't actually know where that is. Computers communicate using IP addresses (numbers). The **Domain Name System (DNS)** is what translates human-friendly names into computer-friendly numbers.

# Key Concepts
- **Nameservers:** Hierarchical servers that hold the records for domains.
- **Caching:** Saving DNS results locally to speed up future requests.
- **Record Types:**
    - **A Record:** Points to an IPv4 address.
    - **AAAA Record:** Points to an IPv6 address.
    - **CNAME:** An alias that points one domain to another.

# Example
Think of DNS like the Contacts app on your phone. You look up "Alice" (the domain name), and your phone finds her phone number (the IP address) to make the call.`
  },
  {
    id: 'port-numbers',
    title: 'Ports: The Doors to Your Device',
    description: 'Understanding how data finds the right application.',
    duration: 4,
    isCompleted: false,
    xp: 40,
    order: 3,
    quiz: {
      id: 'quiz-ports-1',
      passingScore: 0.7,
      questions: [
        {
          id: 'ports-q1',
          question: 'What port number does HTTPS use?',
          options: [
            'Port 21',
            'Port 80',
            'Port 443',
            'Port 22'
          ],
          correctIndex: 2
        },
        {
          id: 'ports-q2',
          question: 'What is the maximum port number available?',
          options: [
            '1024',
            '32768',
            '65535',
            '99999'
          ],
          correctIndex: 2
        }
      ]
    },
    content: `# Introduction
If an IP address is like the address of an apartment building, a **Port Number** is like the specific apartment number. It tells the incoming data which program or "door" it should enter.

# Key Concepts
- **Standard Ports:**
    - **HTTP:** Port 80
    - **HTTPS:** Port 443
    - **SSH:** Port 22
    - **FTP:** Port 21
- **Range:** Port numbers range from 0 to 65535.
- **Security:** Firewalls often block unused ports to prevent unauthorized access.

# Example
Your computer might be running a web browser, a chat app, and a music player all at once. The **Port Number** ensures that the web page data goes to the browser and not the music player.`
  }
];

// Topics
export const mockTopics: Topic[] = [
  {
    id: 'computer-basics',
    title: 'Computer Basics',
    description: 'Learn the fundamentals of computers and how they work',
    icon: 'computer',
    totalLessons: computerBasicsLessons.length,
    completedLessons: 0,
    xp: 0,
    category: 'Computer Science',
    difficulty: 'Beginner',
    isLocked: false,
    lastAccessed: new Date(),
    lessons: computerBasicsLessons,
    totalXp: computerBasicsLessons.reduce((sum, lesson) => sum + lesson.xp, 0),
    currentXp: 0
  },
  {
    id: 'internet-basics',
    title: 'Internet Basics',
    description: 'Understanding the internet and how to use it safely',
    icon: 'language',
    totalLessons: internetBasicsLessons.length,
    completedLessons: 0,
    xp: 0,
    category: 'Computer Science',
    difficulty: 'Beginner',
    isLocked: false,
    lastAccessed: new Date(),
    lessons: internetBasicsLessons,
    totalXp: internetBasicsLessons.reduce((sum, lesson) => sum + lesson.xp, 0),
    currentXp: 0
  },
  {
    id: 'programming-basics',
    title: 'Programming Basics',
    description: 'Introduction to computer programming and coding',
    icon: 'code',
    totalLessons: programmingBasicsLessons.length,
    completedLessons: 0,
    xp: 0,
    category: 'Computer Science',
    difficulty: 'Intermediate',
    isLocked: false,
    lastAccessed: new Date(),
    lessons: programmingBasicsLessons,
    totalXp: programmingBasicsLessons.reduce((sum, lesson) => sum + lesson.xp, 0),
    currentXp: 0
  },
  {
    id: 'networking-basics',
    title: 'Networking Basics',
    description: 'Dive into URLs, IP addresses, DNS, and more.',
    icon: 'router',
    totalLessons: networkingBasicsLessons.length,
    completedLessons: 0,
    xp: 0,
    category: 'Networking',
    difficulty: 'Intermediate',
    isLocked: false,
    lastAccessed: new Date(),
    lessons: networkingBasicsLessons,
    totalXp: networkingBasicsLessons.reduce((sum, lesson) => sum + lesson.xp, 0),
    currentXp: 0
  }
];

// Mock User Data
const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Computer Learner',
  email: 'learner@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Passionate about learning computer science and technology',
  joinDate: new Date('2023-01-01'),
  preferences: {
    theme: 'system',
    notifications: true
  }
};

const mockUserProgress: UserProgress = {
  totalXP: 0,
  streak: 0,
  topicsCompleted: 0,
  totalTopics: mockTopics.length,
  lessonsCompleted: 0,
  quizzesPassed: 0,
  perfectQuizzes: 0,
  totalLessons: mockTopics.reduce((sum, t) => sum + t.totalLessons, 0),
};

// API Service Functions
export const fetchTopics = async (): Promise<Topic[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTopics), 500);
  });
};

export const completeLesson = async (
  topicId: string,
  lessonId: string
): Promise<{ topic: Topic; userProgress: UserProgress }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const topic = mockTopics.find(t => t.id === topicId);
      const lesson = topic?.lessons.find(l => l.id === lessonId);
      
      if (lesson && topic) {
        // Update lesson completion
        if (!lesson.isCompleted) {
          lesson.isCompleted = true;
          mockUserProgress.lessonsCompleted++;
        }
        
        // Update topic progress
        const completedLessons = topic.lessons.filter(l => l.isCompleted).length;
        topic.completedLessons = completedLessons;
        topic.currentXp = topic.lessons
          .filter(l => l.isCompleted)
          .reduce((sum, l) => sum + l.xp, 0);
        
        // Update user progress
        mockUserProgress.totalXP += lesson.xp;
        mockUserProgress.streak++;
        
        // Check if topic is completed
        if (completedLessons === topic.totalLessons) {
          mockUserProgress.topicsCompleted++;
        }
      }

      resolve({
        topic: topic || mockTopics[0],
        userProgress: { ...mockUserProgress }
      });
    }, 500);
  });
};

export const completeTest = async (
  topicId: string,
  lessonId: string,
  score: number,
  totalQuestions: number
): Promise<{ passed: boolean; xpEarned: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const topic = mockTopics.find(t => t.id === topicId);
      const lesson = topic?.lessons.find(l => l.id === lessonId);
      const passingScore = lesson?.quiz?.passingScore || 0.7;
      const percentage = score / totalQuestions;
      const passed = percentage >= passingScore;
      
      let xpEarned = 0;
      if (passed && lesson) {
        xpEarned = lesson.xp;
        // Perfect quiz bonus
        if (percentage === 1) {
          xpEarned = Math.round(xpEarned * 1.5);
          mockUserProgress.perfectQuizzes++;
        }
        mockUserProgress.quizzesPassed++;
      }

      resolve({
        passed,
        xpEarned
      });
    }, 500);
  });
};

/** Returns all quizzes grouped by topic, with lock status */
export const fetchQuizzes = async (): Promise<{
  topicId: string;
  topicTitle: string;
  topicIcon: string;
  lessons: {
    lessonId: string;
    lessonTitle: string;
    lessonOrder: number;
    isLessonCompleted: boolean;
    quiz: Lesson['quiz'];
    questionCount: number;
  }[];
}[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockTopics.map(topic => ({
        topicId: topic.id,
        topicTitle: topic.title,
        topicIcon: topic.icon,
        lessons: topic.lessons
          .filter(l => l.quiz)
          .map(l => ({
            lessonId: l.id,
            lessonTitle: l.title,
            lessonOrder: l.order,
            isLessonCompleted: l.isCompleted,
            quiz: l.quiz,
            questionCount: l.quiz?.questions.length || 0,
          })),
      }));
      resolve(result);
    }, 300);
  });
};

export const fetchUserProgress = async (): Promise<UserProgress> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...mockUserProgress }), 300);
  });
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...mockUserProfile }), 300);
  });
};