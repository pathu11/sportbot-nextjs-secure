import { NextResponse } from 'next/server';

// The API Key lives safely on the server
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { contents, systemInstruction, tools } = body;

    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key missing on server' }, { status: 500 });
    }

    // Call Google Gemini from the SERVER
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction,
          tools
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Gemini API Error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}