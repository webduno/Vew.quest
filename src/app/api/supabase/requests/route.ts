import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { data, error } = await supabase
      .from('crv_request')
      .select()
      .order('created_at', { ascending: false })
      .limit(9); // Limit to 9 items to match the display in ESPLobby

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data
    });
  } catch (error: any) {
    console.error('Error retrieving CRV requests from Supabase:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { description, creator_id } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Missing description' },
        { status: 400 }
      );
    }

    const result = await supabase
      .from('crv_request')
      .insert([{ 
        description,
        creator_id,
        created_at: new Date().toISOString(),
        solved: 0,
        attempts: 0
      }]);

    if (result.error) {
      console.error('Supabase database error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating CRV request:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 