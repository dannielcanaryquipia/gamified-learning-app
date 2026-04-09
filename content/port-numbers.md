---
title: "Ports: The Doors to Your Device"
topicId: "networking-basics"
lessonId: "port-numbers"
xp: 40
estimatedMinutes: 4
thumbnail: "/assets/images/lessons/ports.png"
quiz:
  quizId: "quiz-ports-1"
  passingScore: 75
  questions:
    - id: 1
      question: "Which port is commonly used for secure web traffic (HTTPS)?"
      choices: ["80", "443", "21", "22"]
      correct: "443"
    - id: 2
      question: "What is the purpose of a Port Number?"
      choices: ["To identify a specific hardware device", "To identify a specific application or service", "To speed up the internet", "To hide your IP address"]
      correct: "To identify a specific application or service"
---

# Introduction
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
Your computer might be running a web browser, a chat app, and a music player all at once. The **Port Number** ensures that the web page data goes to the browser and not the music player.
