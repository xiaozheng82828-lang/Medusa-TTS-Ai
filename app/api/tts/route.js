// app/api/tts/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, model, voice_id } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Default values agar user ne kuch select nahi kiya
    const selectedModel = model || 'kokoro'; // DeAPI ka popular open-source model
    const selectedVoice = voice_id || 'af_bella'; // Default voice

    const response = await fetch(process.env.DEAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEAPI_KEY}`,
      },
      body: JSON.stringify({
        text: text,
        model: selectedModel,
        voice: selectedVoice, 
        response_format: "mp3" // Output format
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return NextResponse.json({ error: 'Failed to generate audio from DeAPI' }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
