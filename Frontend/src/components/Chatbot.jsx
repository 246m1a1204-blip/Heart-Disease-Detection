import React, { useState } from 'react';

export default function Chatbot({ userEmail }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your Medical AI Assistant. How can I assist you with your cardiac metrics today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- VOICE ASSISTANT ---
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input not supported in this browser."); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  // --- API HANDLER ---
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail || "client@gmail.com", query: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Clinical AI Engine unreachable." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-zinc-900/80 backdrop-blur-xl border border-emerald-900/50 rounded-3xl p-6 shadow-2xl flex flex-col h-[500px]">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 text-center">
        BioGPT Clinical AI
      </h3>
      
      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl text-sm transition-all animate-in slide-in-from-bottom-2 duration-300 ${
            m.sender === "user" 
            ? "bg-emerald-600 text-white ml-auto rounded-br-none shadow-lg" 
            : "bg-zinc-800/80 text-zinc-200 mr-auto rounded-bl-none"
          }`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-emerald-400 text-xs italic animate-pulse">AI is analyzing...</div>}
      </div>

      {/* INPUT AREA */}
      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-2 rounded-2xl">
        <button onClick={startVoiceInput} className="p-3 text-zinc-400 hover:text-emerald-400 transition-colors">
          🎤
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 outline-none px-2"
          placeholder="Ask about heart health..."
        />
        <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold transition-all">
          Send
        </button>
      </div>
    </div>
  );
}