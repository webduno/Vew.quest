import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { title, content, creator_id, lesson_id, progress } = await request.json();

    if (!creator_id) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Try to find existing lesson record
    const { data: existingLesson, error: findError } = await supabase
      .from('vew_lesson')
      .select('*')
      .eq('creator_id', creator_id.toLowerCase())
      .eq('lesson_id', lesson_id)
      .limit(1)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase database error:', findError);
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    if (existingLesson) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('vew_lesson')
        .update({
          title,
          content,
          progress,
          updated_at: 'now()'
        })
        .eq('creator_id', creator_id.toLowerCase())
        .eq('lesson_id', lesson_id);

      if (updateError) {
        console.error('Error updating lesson record:', updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      // Fetch the updated record
      const { data: updatedRecords, error: fetchError } = await supabase
        .from('vew_lesson')
        .select('*')
        .eq('creator_id', creator_id.toLowerCase())
        .eq('lesson_id', lesson_id);

      if (fetchError) {
        console.error('Error fetching updated record:', fetchError);
        return NextResponse.json(
          { error: fetchError.message },
          { status: 500 }
        );
      }

      if (!updatedRecords || updatedRecords.length === 0) {
        return NextResponse.json(
          { error: 'No records found after update' },
          { status: 404 }
        );
      }

      const updatedRecord = updatedRecords[0];
      return NextResponse.json(
        { success: true, data: updatedRecord },
        { status: 200 }
      );
    }

    // Create new record
    const { error: createError } = await supabase
      .from('vew_lesson')
      .insert([
        {
          title,
          content,
          creator_id: creator_id.toLowerCase(),
          lesson_id,
          progress,
          created_at: 'now()',
          updated_at: 'now()'
        }
      ]);

    if (createError) {
      console.error('Error creating lesson record:', createError);
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
      .eq('lesson_id', lesson_id);

    if (fetchError) {
      console.error('Error fetching new record:', fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!newRecords || newRecords.length === 0) {
      return NextResponse.json(
        { error: 'No records found after creation' },
        { status: 404 }
      );
    }

    const newRecord = newRecords[0];
    return NextResponse.json(
      { success: true, data: newRecord },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in lesson tracking:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 