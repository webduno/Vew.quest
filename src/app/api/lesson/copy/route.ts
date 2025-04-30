import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { lesson_id, creator_id, proxy_id } = await request.json();

    if (!lesson_id || !creator_id || !proxy_id) {
      return NextResponse.json(
        { error: 'Lesson ID, creator ID, and proxy ID are required' },
        { status: 400 }
      );
    }

    // First, get the original lesson
    const { data: originalLesson, error: findError } = await supabase
      .from('vew_lesson')
      .select('*')
      .eq('lesson_id', lesson_id)
      .eq('creator_id', proxy_id)
      .single();

    if (findError) {
      console.error('Error finding original lesson:', findError);
      return NextResponse.json(
        { error: 'Failed to find original lesson' },
        { status: 404 }
      );
    }

    // Create a new lesson with the same content but new creator_id
    const { error: createError } = await supabase
      .from('vew_lesson')
      .insert([
        {
          title: originalLesson.title,
          content: originalLesson.content,
          creator_id: creator_id.toLowerCase(),
          lesson_id: Date.now().toString(), // Generate new lesson_id
          progress: null,
          proxy_id: proxy_id, // Store reference to original lesson
          created_at: 'now()',
          updated_at: 'now()'
        }
      ]);

    if (createError) {
      console.error('Error creating copied lesson:', createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      );
    }

    // Fetch the newly created record
    const { data: newRecords, error: fetchError } = await supabase
      .from('vew_lesson')
      .select('*')
      .eq('creator_id', creator_id.toLowerCase())
      .eq('proxy_id', proxy_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching new record:', fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: newRecords },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in lesson copying:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 