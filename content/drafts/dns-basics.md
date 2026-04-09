---
title: "DNS: The Phonebook of the Internet"
topicId: "networking-basics"
lessonId: "dns-basics"
xp: 60
estimatedMinutes: 7
thumbnail: "/assets/images/lessons/dns.png"
quiz:
  quizId: "quiz-dns-1"
  passingScore: 80
  questions:
    - id: 1
      question: "What does DNS stand for?"
      choices: ["Domain Name System", "Digital Network Server", "Data Name Service", "Direct Node Serial"]
      correct: "Domain Name System"
    - id: 2
      question: "Which record type maps a domain name to an IPv4 address?"
      choices: ["A Record", "AAAA Record", "MX Record", "CNAME"]
      correct: "A Record"
---

# Introduction
When you type `google.com` into your browser, your computer doesn't actually know where that is. Computers communicate using IP addresses (numbers). The **Domain Name System (DNS)** is what translates human-friendly names into computer-friendly numbers.

# Key Concepts
- **Nameservers:** Hierarchical servers that hold the records for domains.
- **Caching:** Saving DNS results locally to speed up future requests.
- **Record Types:**
    - **A Record:** Points to an IPv4 address.
    - **AAAA Record:** Points to an IPv6 address.
    - **CNAME:** An alias that points one domain to another.

# Example
Think of DNS like the Contacts app on your phone. You look up "Alice" (the domain name), and your phone finds her phone number (the IP address) to make the call.
