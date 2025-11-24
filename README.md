# SportBot: Agentic Sports Voice Assistant (Next.js + Gemini 2.5)

A real-time conversational AI application that uses Google Gemini 2.5 with Google Search Grounding to simulate an agentic workflow. This application demonstrates real-time speech-to-text transcription, speaker diarization, and an intelligent multi-step reasoning pipeline, all secured by a Next.js backend.

---

## 🌟 Key Features

### 🎙️ Real-Time Transcription: Uses the Web Speech API to capture and transcribe user audio instantly.

### 🧠 Agentic Workflow: Simulates a 3-step internal pipeline Simulates three internal agents:

1. **The Scout (Researcher)** – Performs Google Search grounding to find live scores, official stats, and validated news.
2. **The Stat-Man (Analyst)** – Analyzes data to calculate winning margins, key performance indicators, and comparisons.
3. **The Commentator (Speaker)** – Synthesizes the final response into an energetic, concise, and natural spoken summary.

### 🌍 Google Search Grounding: The AI actively searches the live internet for up-to-date match results and player statistics, ensuring answers are current rather than hallucinated.

### 🗣️ Natural Text-to-Speech: Synthesizes the AI's response using the browser's native SpeechSynthesis API.

### 📊 Audio Visualizer: A real-time frequency analyzer utilizing the Web Audio API and HTML5 Canvas.

### 💬 Diarization UI  
The transcript interface visually distinguishes between the Fan (User - Blue) and the SportBot (AI - Green), complete with verifying source links.

### ⚡ Manual Control: "Push-to-Talk" style interaction to ensure complete user queries are captured before processing.

## 🛠️ Tech Stack

1. Framework: Next.js 14+ (App Router)
2. Styling: Tailwind CSS + Lucide React (Icons)
3. AI Model: Google Gemini 2.5 Flash Preview
4. Audio: Web Speech API (STT) & SpeechSynthesis API (TTS) & Web Audio API (Visualizer)

--- 
## 🚀 Getting Started

### **Prerequisites**

- Node.js (v18 or higher)
- Google Gemini API Key (Get one at Google AI Studio)
---

### **Installation**

### 1. Clone the repository

```bash
git clone [https://github.com/pathu11/sportbot.git](https://github.com/pathu11/sportbot.git)
cd sportbot
```

### 2. Install dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env file in the root directory:
```bash
touch .env.local
```

### 4. Add your API key:
```bash
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 5. Run the Development Server
```bash
npm run dev
```
### 6. Open http://localhost:3000 in your browser.

## 📖 Usage Guide

- Start Recording: Click the blue "Start Recording" button.
- Speak: Ask a sports-related question.
  - Example: "Who won the Lakers game last night?"
  -  "What is the current score of the Chelsea match?"

- Stop & Get Score: Click the button again (now red "Stop & Get Score") when you are finished speaking.
- Watch the Agents:
    - The Scout will browse Google.
    - The Stat-Man will synthesize the data.
    - The Commentator will deliver the verbal response.

- Listen: The app will speak the answer back to you and display verified source cards in the chat.
