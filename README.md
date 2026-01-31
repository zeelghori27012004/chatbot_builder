# ChatForge

**ChatForge** is a full-stack **WhatsApp chatbot builder** that empowers users to visually create, customize, and deploy dynamic conversational workflows using a drag-and-drop interface. Built with the **MERN stack**, it integrates **Meta’s WhatsApp Business Cloud API**, **Redis caching**,**React Flow** and modular node components for building real-time, production-ready WhatsApp chatbots.

---

## Live Demo
 
https://chatforge.antimtechnologies.com/

---

##  How to Use ChatForge

1. **Sign In**  
   Visit the ChatForge frontend and log in using your Google account or create a new account to access the chatbot builder dashboard.

2. **Design Your Chatbot Flow**  
   Use the drag-and-drop interface to visually create chatbot workflows using reusable nodes like: Start Node, Message Node, Button Node, Question Node, API Call Node, Conditional/Keyword Branch Node, End Node.

3. **Connect the Nodes**  
   Build conversation paths by connecting the nodes to define the chatbot’s logic and responses.

4. **Deploy & Activate**  
   Save and deploy your flow. The backend automatically handles incoming messages from users through Meta’s WhatsApp Business Cloud API.

5. **Real-time Automation**  
   When a user sends a message on WhatsApp, the system processes it via webhook, matches it to your flow, and responds dynamically.

6. **Manage & Monitor**  
   Easily update flows, manage sessions, and track interactions from your dashboard. Redis caching ensures fast, low-latency performance during conversations.

---

##  Features

### Visual Chatbot Builder
- Built with **React Flow** for drag-and-drop visual editor
- Reusable nodes:
  - Start Node
  - Message Node
  - Button Node
  - Question Node
  - API Call Node
  - Conditional / Branching Node
  - End Node
- Retry logic, conditional branching, and dynamic state flow 

### WhatsApp Integration
- Meta WhatsApp Business Cloud API integration
- Real-time webhook handling
- Phone number registration & verification
- Automated replies and interactive messaging

### Performance & Dev Tools
- Redis caching for reduced latency and session storage
- JWT-based authentication
- Google OAuth for sign-in
- Nodemailer email integration
- External API support via API Call Node

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| **Frontend** | React.js, Vite, TailwindCSS, React Flow         |
| **Backend**  | Node.js, Express.js                             |
| **Database** | MongoDB (Mongoose ORM)                          |
| **Caching**  | Redis                                           |
| **Auth**     | JWT, Google OAuth2                              |
| **Email**    | Nodemailer                                      |
| **Integration** | Meta WhatsApp Business Cloud API           |

---

## Environment Variables

### Frontend `.env`

VITE_SERVER_DOMAIN=your_backend_url

VITE_OAUTH_CLIENT_ID=your_google_oauth_client_id

### Backend `.env`

#### Database
MONGO_URI=your_mongodb_connection_uri

#### Server
PORT=port_number

#### JWT Authentication
JWT_SECRET=your_jwt_secret

#### Redis Configuration
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

#### WhatsApp Webhook
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

#### Email Configuration (for notifications or password recovery)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

#### Google OAuth (for login or integrations)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret


