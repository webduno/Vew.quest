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
    const creator_id = searchParams.get('creator_id');

    if (!creator_id) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const { data: lessons, error } = await supabase
      .from('vew_lesson')
      .select('lesson_id, title')
      .eq('creator_id', creator_id.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lessons:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: lessons },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in lesson listing:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 