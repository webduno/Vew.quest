import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating structured learning modules. 
Create a comprehensive lesson array with multiple submodules, each containing questions and answers about the given topic.

Requirements:
- Generate a MINIMUM of 2 submodules
- Each submodule should have 3-6 questions
- Each question should have 2-5 options with one correct answer
- Questions should progress from basic to advanced concepts
- Format must match the example structure exactly
- Only generate content in English

Example structure:
[
  {
    "en": [
      {
        "question": "What is the basic concept?",
        "options": [
          {
            "text": "Correct answer",
            "correct": true
          },
          {
            "text": "Incorrect answer",
            "correct": false
          }
        ],
      {
        "question": "What is another concept?",
        "options": [
          {
            "text": "Correct answer",
            "correct": true
          },
          {
            "text": "Incorrect answer",
            "correct": false
          }
        ],
      }
    ]
  },
  {
    "en": [
      {
        "question": "What is the advanced concept?",
        "options": [
          {
            "text": "Correct answer",
            "correct": true
          },
          {
            "text": "Incorrect answer",
            "correct": false
          }
        ]
      }
    ]
  }
]`;

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty } = await request.json();

    // Log incoming request
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { success: false, error: 'Missing OPENAI_API_KEY environment variable' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create a lesson about: ${topic} with difficulty level: ${difficulty}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error('Failed to parse OpenAI response as JSON:', jsonErr);
      return NextResponse.json(
        { success: false, error: 'Failed to parse OpenAI response as JSON', details: String(jsonErr) },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to generate lesson content', openai: data },
        { status: 500 }
      );
    }

    const generatedContent = data.choices?.[0]?.message?.content;
    if (!generatedContent) {
      console.error('No content returned from OpenAI', data);
      return NextResponse.json(
        { success: false, error: 'No content returned from OpenAI', openai: data },
        { status: 500 }
      );
    }

    // Validate the generated content is valid JSON and has 3 submodules
    try {
      const parsedContent = JSON.parse(generatedContent);
      // console.log('***********************************', );
      // console.log('Parsed content:', parsedContent);
      // console.log('***********************************', );
      if (!Array.isArray(parsedContent)) {
        return NextResponse.json(
          { success: false, error: 'Generated content must contain submodules' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, data: parsedContent });
    } catch (error) {
      console.error('JSON parse error:', error, 'Content:', generatedContent);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format generated', content: generatedContent },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 