import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  console.log("viewclick")
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { player_id, win, attempts } = await request.json();

    if (!player_id) {
      return NextResponse.json(
        { error: 'Missing player_id parameter' },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    const result = await supabase
      .from('vew_click')
      .insert([{ 
        player_id,
        win: win ? 1 : 0,
        attempts,
        created_at: new Date().toISOString()
      }]);

    if (result.error) {
      console.error('Supabase database error:', result.error);
      return NextResponse.json(
        { error: result.error.message }, 
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  } catch (error: any) {
    console.error('Error saving view click:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
} 