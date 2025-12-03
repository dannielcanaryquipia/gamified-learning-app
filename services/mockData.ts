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
    isLocked: false,
    lastAccessed: new Date(),
    lessons: programmingBasicsLessons,
    totalXp: programmingBasicsLessons.reduce((sum, lesson) => sum + lesson.xp, 0),
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
  totalTopics: mockTopics.length
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
        lesson.isCompleted = true;
        
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
  score: number
): Promise<{ passed: boolean; xpEarned: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is a placeholder for future test functionality
      // Will be reimplemented when tests are re-added
      resolve({
        passed: false,
        xpEarned: 0
      });
    }, 500);
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