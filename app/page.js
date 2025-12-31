// app/page.js
"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  
  // Advanced Settings
  const [model, setModel] = useState("kokoro");
  const [voice, setVoice] = useState("af_bella");

  // History State
  const [history, setHistory] = useState([]);

  // Load history from local storage on first load
  useEffect(() => {
    const saved = localStorage.getItem("tts_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = async () => {
    if (!text) return alert("Please write some text!");
    
    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text, 
          model, 
          voice_id: voice 
        }),
      });

      if (!res.ok) throw new Error("Generation Failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Add to History
      const newItem = { text: text.substring(0, 30) + "...", url, date: new Date().toLocaleTimeString() };
      const newHistory = [newItem, ...history].slice(0, 5); // Keep last 5
      setHistory(newHistory);
      localStorage.setItem("tts_history", JSON.stringify(newHistory));

    } catch (error) {
      console.error(error);
      alert("Error generating audio. Check API Key or Text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 flex flex-col items-center">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          AI Voice Studio
        </h1>
        <p className="text-gray-400">Convert text to lifelike speech instantly</p>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
        
        {/* Settings Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Model</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="kokoro">Kokoro (Fast & Natural)</option>
              <option value="tts-1">OpenAI TTS-1 (Standard)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Voice</label>
            <select 
              value={voice} 
              onChange={(e) => setVoice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="af_bella">Bella (Female - American)</option>
              <option value="af_sarah">Sarah (Female - Soft)</option>
              <option value="am_adam">Adam (Male - Deep)</option>
              <option value="am_michael">Michael (Male - Narrator)</option>
            </select>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[150px]"
          placeholder="Enter your script here to generate voice..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
            loading 
              ? "bg-gray-700 cursor-wait text-gray-400" 
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Processing...
            </span>
          ) : "Generate Audio 🎵"}
        </button>

        {/* Audio Player & Download */}
        {audioUrl && (
          <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-400">Audio Ready!</h3>
              <a 
                href={audioUrl} 
                download="voice-output.mp3"
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-white transition"
              >
                ⬇ Download MP3
              </a>
            </div>
            <audio controls src={audioUrl} className="w-full rounded-lg" autoPlay />
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-10">
          <h2 className="text-xl font-bold text-gray-400 mb-4 px-2">Recent Generations</h2>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div>
                  <p className="text-gray-300 font-medium truncate w-64">{item.text}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <audio controls src={item.url} className="h-8 w-40" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
                }
