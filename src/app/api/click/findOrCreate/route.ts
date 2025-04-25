import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { player_id, isWin, attempts } = await request.json();
    // console.log("player_id", player_id)
    if (!player_id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Try to find existing click record
    const { data: existingClick, error: findError } = await supabase
      .from('vew_click')
      .select('id, attempts, win, player_id')
      .eq('player_id', player_id.toLowerCase())
      .single();

    // console.log("existingClick", existingClick)

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase database error:', findError);
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    if (existingClick) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('vew_click')
        .update({
          attempts: existingClick.attempts + attempts,
          win: existingClick.win + (isWin ? 1 : 0)
        })
        .eq('player_id', player_id);

      if (updateError) {
        console.error('Error updating click record:', updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Create new record
    const { error: createError } = await supabase
      .from('vew_click')
      .insert([
        {
          player_id,
          attempts,
          win: isWin ? 1 : 0
        }
      ]);

    if (createError) {
      console.error('Error creating click record:', createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in click tracking:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 