// app/page.js
"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleGenerate = async () => {
    if (!text) return alert("Please enter some text!");
    
    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to generate audio");

      // ऑडियो को URL में बदलना
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Text to Speech</h1>
      
      <textarea
        className="w-full max-w-lg p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-lg"
        rows="5"
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`mt-6 px-6 py-3 rounded-full font-semibold text-lg transition ${
          loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {loading ? "Generating..." : "Convert to Speech"}
      </button>

      {audioUrl && (
        <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="mb-2 text-sm text-gray-400 text-center">Audio Ready:</p>
          <audio controls src={audioUrl} className="w-full max-w-md" autoPlay />
        </div>
      )}
    </div>
  );
        }
