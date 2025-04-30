// pages/api/getCompletion.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Configure longer timeout
export const runtime = 'edge';
export const maxDuration = 60; // Set timeout to 60 seconds

// Types
type Data = {
  choices?: { text: string }[];
  error?: string;
};

// Constants
const API_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 200,
  url: 'https://api.openai.com/v1/chat/completions'
}

const SYSTEM_PROMPT = `You are a creative remote viewing assistant that generates realistic unique comparisons of targets based on provided data. 
Your response must be real life related, under 20 words and should NEVER use the words: solid, natural, temperature, light, color, or any variations of these words.

Input data includes metrics that you should interpret creatively but NEVER mention directly:
- type: Entity/Object/Place/Event
- natural: 0-255 (higher = more natural/organic)
- temp: 0-255 (higher = hotter)
- light: 0-100 (higher = brighter)
- color: 0-100 (higher = more saturated/vibrant)
- solid: 0-100 (higher = more solid/dense)
- confidence: 0-100 (higher = more confident)

For high confidence (>70):
- Compare to completely different objects or scenes
- Use unexpected but fitting comparisons
- Focus on the overall impression
- NEVER restate the input metrics

For low confidence (<70):
- Provide 2-3 wildly different comparisons
- Each comparison should be realistic but fitting
- Keep each comparison under 20 words

Example responses:
High confidence: "A modern glass skyscraper reflecting the morning sun, its surface smooth and precise."

Low confidence: "Either a freshly polished marble countertop, or a stainless steel sculpture in a city park."

Additional examples:
High confidence: "A sleek sports car's hood under showroom lights, its curves catching every angle."

Low confidence: "Either a crystal-clear swimming pool at dawn, or a freshly waxed dance floor under disco lights."

Focus on creating completely original comparisons that capture the essence while avoiding any mention of the input metrics.`

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, natural, temp, light, color, solid, confidence } = data;

    const response = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this remote viewing data:
Type: ${type}
Natural: ${natural}
Temperature: ${temp}
Light: ${light}
Color: ${color}
Solid: ${solid}
Confidence: ${confidence}` }
        ],
        temperature: API_CONFIG.temperature,
        max_tokens: API_CONFIG.maxTokens,
      }),
    });

    const aiResponse = await response.json() as Data;
    return new NextResponse(JSON.stringify(aiResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Error analyzing remote viewing data' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
