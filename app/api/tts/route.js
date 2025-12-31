// app/api/tts/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // यहाँ DeAPI को कॉल किया जा रहा है
    const response = await fetch(process.env.DEAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEAPI_KEY}`, // अगर API Header मांगता है
      },
      // DeAPI के documentation के अनुसार body बदलें (e.g., model, voice_id)
      body: JSON.stringify({
        text: text,
        model: 'generic-tts', // उदाहरण के लिए
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    // API से ऑडियो डेटा (blob/buffer) प्राप्त करना
    const audioBuffer = await response.arrayBuffer();

    // ऑडियो वापस भेजें
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    console.error('Error generating TTS:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
