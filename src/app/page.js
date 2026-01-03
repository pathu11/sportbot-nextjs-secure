'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import { SYSTEM_PROMPT } from './prompts/systemPrompt';
// Components
// import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageItem from './components/MessageItem';
import StatusIndicator from './components/StatusIndicator';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

export default function Home() {
  // --- State ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [currentText, setCurrentText] = useState(''); 
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [agentStatus, setAgentStatus] = useState(null); 
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  // --- Refs ---
  const recognitionRef = useRef(null);
  const synthRef = useRef(null); // Init in useEffect to avoid SSR issues
  const currentTextRef = useRef('');      
  const lastUserTextRef = useRef('');     
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- Logic ---





  // --- Effects ---
  useEffect(() => {
    // Client-side initialization
    synthRef.current = window.speechSynthesis;
    const saved = localStorage.getItem('sports_sessions');
    if (saved) {
      try { setSessions(JSON.parse(saved)); } catch (e) { console.error("History Error", e); }
    }
  }, []);

  useEffect(() => {
    initSpeechRecognition();
    return () => {
      recognitionRef.current?.stop();
      stopVisualizer();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);
  const saveCurrentSession = () => {
    if (transcript.length === 0) return;
    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      preview: transcript[0].text.substring(0, 30) + (transcript[0].text.length > 30 ? "..." : ""),
      data: transcript
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('sports_sessions', JSON.stringify(updatedSessions));
    alert("Match history saved!");
  };

  const deleteSession = (e, id) => {
    e.stopPropagation(); 
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('sports_sessions', JSON.stringify(updated));
  };

  const loadSession = (sessionData) => {
    if (isRecording) return;
    setTranscript(sessionData);
  };

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      drawVisualizer();
    } catch (err) { console.error("Visualizer Error:", err); }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = '#111827'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(34, 197, 94)`; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing context:", e));
    }
  };

  const initSpeechRecognition = useCallback(() => {
    // Check if window is defined (Next.js SSR safety)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Browser not supported. Please use Chrome or Edge.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setCurrentText(interim);
        currentTextRef.current = interim; 
        if (final) {
          addTranscriptEntry('user', final);
          setCurrentText('');
          currentTextRef.current = '';
          lastUserTextRef.current = final; 
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const fetchGeminiResponse = async (userText) => {
    if (!userText) return { text: "I didn't hear you. Who's the match between?", sources: [] };

    setAgentStatus('researching'); 
    setTimeout(() => { if (agentStatus !== 'speaking') setAgentStatus('analyzing'); }, 1500);

    const history = transcript.map(msg => ({
      role: msg.speaker === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    const contents = [...history, { role: "user", parts: [{ text: userText }] }];

    try {
        // SECURE API CALL TO NEXT.JS BACKEND
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                tools: [{ google_search: {} }] 
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find the match result yet.";
        let sources = [];

        const metadata = data.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingAttributions) {
            sources = metadata.groundingAttributions
                .map(attr => attr.web ? { title: attr.web.title, uri: attr.web.uri } : null)
                .filter(s => s !== null);
        }

        // Hybrid Source Extraction
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(aiText)) !== null) {
            if (!sources.find(s => s.uri === match[2])) {
                sources.push({ title: match[1], uri: match[2] });
            }
        }
        aiText = aiText.replace(/Source:?\s*\[.*?\]\(.*?\).*/gi, '').replace(/Sources:?\s*\[.*?\]\(.*?\).*/gi, ''); 
        return { text: aiText.trim(), sources: sources };

    } catch (err) {
        console.error("❌ AI Request Failed:", err);
        return { text: "Sorry, I'm having trouble connecting to the sports data network.", sources: [] };
    } finally { /* status reset in speak func */ }
  };

  const processAndSpeakResponse = async (textToRespondTo) => {
    const { text, sources } = await fetchGeminiResponse(textToRespondTo);
    addTranscriptEntry('ai', text, sources);
    setAgentStatus('speaking');
    setAiSpeaking(true);
    const spokenText = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.1; 
    utterance.onend = () => { setAiSpeaking(false); setAgentStatus(null); };
    if (synthRef.current) synthRef.current.speak(utterance);
  };

  const addTranscriptEntry = (speaker, text, sources = []) => {
    if (!text || text.trim() === '') return;
    setTranscript(prev => [...prev, {
      id: Date.now(),
      speaker,
      text,
      sources, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      stopVisualizer();
      recognitionRef.current?.stop();
      setAgentStatus('listening'); 
      setTimeout(() => {
        let finalPrompt = lastUserTextRef.current;
        if (currentTextRef.current && currentTextRef.current.trim() !== '') {
            addTranscriptEntry('user', currentTextRef.current);
            finalPrompt = currentTextRef.current;
            setCurrentText('');
            currentTextRef.current = '';
        }
        processAndSpeakResponse(finalPrompt);
      }, 800);
    } else {
      setIsRecording(true);
      setAgentStatus(null);
      recognitionRef.current?.start();
      startVisualizer();
      lastUserTextRef.current = '';
      currentTextRef.current = '';
    }
  };

  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-green-400">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  const getAgentStatusUI = () => {
    // Status logic embedded in UI rendering for component prop simplicity
    return null; // Handled by StatusIndicator component via props
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex font-sans overflow-hidden">
      
      <Sidebar 
        isRecording={isRecording}
        agentStatus={agentStatus}
        handleToggle={handleToggle}
        canvasRef={canvasRef}
        transcriptLength={transcript.length}
        sessions={sessions}
        saveCurrentSession={saveCurrentSession}
        deleteSession={deleteSession}
        loadSession={loadSession}
      />

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        <ChatHeader isRecording={isRecording} transcriptLength={transcript.length} />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
          {transcript.length === 0 && !currentText && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 animate-in fade-in duration-500">
              <div className="bg-gray-800/50 p-6 rounded-full mb-4 border border-gray-700">
                 <Trophy size={48} className="text-green-500/50" />
              </div>
              <p className="text-lg font-medium text-gray-400">Ready for kick-off</p>
              <p className="text-sm text-gray-500 mt-2">Ask: &quot;Who won the match yesterday?&quot;</p>
            </div>
          )}

          {transcript.map((msg) => (
            <MessageItem key={msg.id} msg={msg} formatText={formatText} />
          ))}

          {currentText && (
            <div className="flex w-full justify-end opacity-70">
               <div className="max-w-[70%] bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/30 text-blue-200 px-6 py-4 rounded-2xl rounded-tr-none text-sm italic backdrop-blur-sm">
                 {currentText}...
               </div>
            </div>
          )}
          
          <StatusIndicator agentStatus={agentStatus} />
        </div>

        <Footer />
        
      </div>
    </div>
  );
}