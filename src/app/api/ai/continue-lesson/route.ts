import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating structured learning modules. 
Continue the existing lesson by adding more submodules that build upon the previous content.

Requirements:
- Generate 1-2 additional submodules
- Each submodule should have 3-6 questions
- Each question should have 2-5 options with one correct answer
- Questions should progress from basic to advanced concepts
- Format must match the example structure exactly
- Only generate content in English
- Make sure the new content builds upon and references the previous content

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
        ]
      }
    ]
  }
]`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { lesson_id, creator_id } = await request.json();

    if (!lesson_id || !creator_id) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID and creator ID are required' },
        { status: 400 }
      );
    }

    // Get the existing lesson content
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: existingLesson, error: findError } = await supabase
      .from('vew_lesson')
      .select('content')
      .eq('creator_id', creator_id.toLowerCase())
      .eq('lesson_id', lesson_id)
      .single();

    if (findError) {
      console.error('Error finding lesson:', findError);
      return NextResponse.json(
        { success: false, error: 'Failed to find lesson' },
        { status: 404 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { success: false, error: 'Missing OPENAI_API_KEY environment variable' },
        { status: 500 }
      );
    }

    // Parse existing content to provide context to AI
    const existingContent = JSON.parse(existingLesson.content);
    const lastModule = existingContent[existingContent.length - 1];
    const lastQuestion = lastModule.en[lastModule.en.length - 1].question;

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
          { role: "user", content: `Continue this lesson by building upon the last question: "${lastQuestion}". The new content should be more advanced and build upon the previous concepts.` }
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
        { success: false, error: data.error?.message || ' OpenAI API errorFailed to generate lesson content OpenAI API' , openai: data },
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

    // Validate the generated content is valid JSON
    try {
      const parsedContent = JSON.parse(generatedContent);
      if (!Array.isArray(parsedContent)) {
        return NextResponse.json(
          { success: false, error: 'Generated content must contain submodules' },
          { status: 400 }
        );
      }

      // Combine existing content with new content
      const updatedContent = [...existingContent, ...parsedContent];

      // Update the lesson in the database
      const { error: updateError } = await supabase
        .from('vew_lesson')
        .update({ content: JSON.stringify(updatedContent) })
        .eq('creator_id', creator_id.toLowerCase())
        .eq('lesson_id', lesson_id);

      if (updateError) {
        console.error('Error updating lesson:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update lesson' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: updatedContent });
    } catch (error) {
      console.error('JSON parse error:', error, 'Content:', generatedContent);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format generated', content: generatedContent },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Lesson continuation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 