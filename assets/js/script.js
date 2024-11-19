"use strict";

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
};

addEventOnElem(navToggler, "click", toggleNavbar);

const navLinks = document.querySelectorAll("[data-nav-link]");

// const cl
// addEventOnElem(navLinks, "click", closeNavbar);

/**
 * header active when scroll down
 */
const header = document.querySelector("[data-header]");


/**
 * accordion toggle
 */
const accordionAction = document.querySelectorAll("[data-accordion-action]");

const toggleAccordion = function () {
  this.classList.toggle("active");
};

addEventOnElem(accordionAction, "click", toggleAccordion);

// Chatbot
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// API Setup
const API_KEY = config.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Add website information
// Add website information
const companyInfo = {
  name: "LYGM Group",
  website: "https://lygmgroup.co.za",
  location: "South Africa",
  services: [
    "Software Development",
    "Digital Marketing",
    "Web Development & Design",
    "Mobile App Development",
    "IT Consulting Services",
    "Business Process Automation"
  ],
  description: "We are a leading technology solutions provider in South Africa",
  // New information
  contact: {
    email: "info@lygmgroup.co.za",
    phone: "+27 60 121 4106",
    address: "cnr brand & swart road , President park , Midrand , South africa"
  },
  businessHours: {
    weekdays: "Monday - Friday: 8:00 AM - 5:00 PM",
    weekend: "Saturday - Sunday: Closed"
  },
  socialMedia: {
    facebook: "LYGM Group",
    linkedin: "LYGM Group",
    twitter: "@LYGMGroup"
  },
  expertise: [
    {
      service: "Software Development",
      details: [
        "Custom Software Solutions",
        "Enterprise Applications",
        "Cloud-based Solutions",
        "API Development & Integration"
      ]
    },
    {
      service: "Digital Marketing",
      details: [
        "SEO Optimization",
        "Social Media Marketing",
        "Content Marketing",
        "Email Marketing Campaigns",
        "Graphic Design"
      ]
    },
    {
      service: "Web Development",
      details: [
        "Responsive Website Design",
        "E-commerce Solutions",
        "CMS Development",
        "Web Application Development"
      ]
    }
  ],
  values: [
    "Innovation",
    "Quality",
    "Customer Satisfaction",
    "Professional Excellence"
  ]
};


const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  }
};

// Initialize chat history with proper Gemini API format
const chatHistory = [{
  role: "model",
  parts: [{
    text: `I am an AI assistant for ${companyInfo.name}. I have been trained on information from our website ${companyInfo.website}. ${companyInfo.description}. We specialize in:
    ${companyInfo.services.map(service => `- ${service}`).join('\n')}
    
    I'm here to help answer questions about our services and provide assistance. For more detailed information, you can also visit our website at ${companyInfo.website}. How can I help you today?`
  }]
}];

const initialInputHeight = messageInput.scrollHeight;

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Generate Bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  try {
    // Include company context with every request
    const contextPrompt = `You are an AI assistant for ${companyInfo.name}. 
    Use this company information for context:
    - Company: ${companyInfo.name}
    - Website: ${companyInfo.website}
    - Location: ${companyInfo.location}
    - Services: ${companyInfo.services.join(', ')}
    - Description: ${companyInfo.description}

    Contact Information:
    - Email: ${companyInfo.contact.email}
    - Phone: ${companyInfo.contact.phone}
    - Address: ${companyInfo.contact.address}

    Business Hours:
    ${companyInfo.businessHours.weekdays}
    ${companyInfo.businessHours.weekend}

    Our Expertise:
    ${companyInfo.expertise.map(exp => `
      ${exp.service}:
      ${exp.details.map(detail => `- ${detail}`).join('\n')}
    `).join('\n')}

    Our Values:
    ${companyInfo.values.map(value => `- ${value}`).join('\n')}

    Social Media:
    - Facebook: ${companyInfo.socialMedia.facebook}
    - LinkedIn: ${companyInfo.socialMedia.linkedin}
    - Twitter: ${companyInfo.socialMedia.twitter}
    
    Please provide information based on this context. 
    
    User question: ${userData.message}`;

    // Format the request body according to Gemini API requirements
    const requestBody = {
      contents: [{
        parts: [{
          text: contextPrompt
        }]
      }]
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    messageElement.innerText = apiResponseText;

    // Update chat history
    chatHistory.push({
      role: "user",
      parts: [{ text: userData.message }]
    });

    chatHistory.push({
      role: "model",
      parts: [{ text: apiResponseText }]
    });

  } catch (error) {
    console.log(error);
    messageElement.innerText = "I apologize, but I'm having trouble processing your request. Please try again.";
    messageElement.style.color = "#ff0000";
  } finally {
    incomingMessageDiv.classList.remove('thinking');
    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth"
    });
  }
};

// Handle outgoing user messages 
// Handle outgoing user messages 
// Handle outgoing user messages 
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return; // Don't send empty messages

  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));

  // Create and display user message with green background
  const messageContent = `<div class="message-text" style="background-color: #00C853; color: white; border-radius: 12px; padding: 10px;">
          ${userData.message} 
      </div>`;

  // Create the outgoing message div
  const outgoingMessageDiv = createMessageElement(messageContent, "outgoing-message");
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Create bot response with context
  setTimeout(() => {
    const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
          <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"></path>
        </svg>
        <div class="message-text">
          <div class="thinking-indicator">   
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    generateBotResponse(incomingMessageDiv);
  }, 600);
};



// Event Listeners
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = 
    messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Chatbot toggle functionality
chatbotToggler.addEventListener('click', () => {
  document.body.classList.toggle('show-chatbot');
});

closeChatbot.addEventListener("click", () => {
  document.body.classList.remove('show-chatbot');
});

// Send button event listener
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
