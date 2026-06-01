import React, { useState, useEffect } from 'react';

export default function VoiceChat({ onMessageSent }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // బ్రౌజర్ లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ ఉందో లేదో చూడటానికి
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("ఈ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌ని సపోర్ట్ చేయదు.");
      return;
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN'; // ఇంగ్లీష్ లాంగ్వేజ్ (అవసరమైతే మార్చుకోవచ్చు)
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onMessageSent(text); // ఇక్కడ నుంచి టెక్స్ట్ నేరుగా చాట్‌బాట్ కి వెళ్తుంది
    };

    recognition.start();
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={startListening}
        className={`p-2 rounded-full transition ${isListening ? "bg-red-500 animate-pulse" : "bg-zinc-800 hover:bg-zinc-700"}`}
      >
        🎤 {isListening ? "Listening..." : "Speak"}
      </button>
    </div>
  );
}