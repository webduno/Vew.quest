import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { searchParams } = new URL(request.url);
    const storageKey = searchParams.get('storageKey');

    if (!storageKey) {
      return NextResponse.json(
        { error: 'Storage key is required' },
        { status: 400 }
      );
    }

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { data: lessons, error } = await supabase
      .from('vew_lesson')
      .select('progress, created_at')
      .eq('creator_id', storageKey.toLowerCase());

    if (error) {
      console.error('Error fetching lessons:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Calculate total progress length (total minds) - keep as character count
    const totalProgressLength = lessons.reduce((sum, lesson) => {
      return sum + (lesson.progress ? lesson.progress.length : 0);
    }, 0);

    // Calculate today's progress (number of questions answered today)
    const todayProgress = lessons.reduce((sum, lesson) => {
      const lessonDate = new Date(lesson.created_at);
      lessonDate.setUTCHours(0, 0, 0, 0);
      let arr = [];
      try {
        arr = Array.isArray(lesson.progress) ? lesson.progress : JSON.parse(lesson.progress || '[]');
      } catch (e) {
        arr = [];
      }
      if (lessonDate.getTime() === today.getTime()) {
        return sum + arr.length;
      }
      return sum;
    }, 0);

    return NextResponse.json(
      { 
        success: true, 
        data: totalProgressLength,
        todayProgress: todayProgress
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in mind calculation:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 