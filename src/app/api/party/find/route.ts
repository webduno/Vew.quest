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
    const roomKey = searchParams.get('room_key');

    if (!roomKey) {
      return NextResponse.json(
        { error: 'Room key is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vew_party')
      .select('id')
      .eq('room_key', roomKey)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { id: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { id: data[0].id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error finding party:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 