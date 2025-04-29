import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { player_id, chip, bought } = await request.json();
    if (!player_id || chip === undefined ) {
      return NextResponse.json(
        { error: 'player_id, chip, and pin are required' },
        { status: 400 }
      );
    }

    // Check if user exists and fetch spent and attempts fields
    const { data: existingClick, error: findError } = await supabase
      .from('vew_click')
      .select('id, spent, attempts, win')
      .eq('player_id', player_id.toLowerCase())
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Supabase database error:', findError);
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    if (!existingClick) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    // Merge with existing spent
    let prevSpent: any = {};
    if (existingClick.spent) {
      try {
        prevSpent = JSON.parse(existingClick.spent);
      } catch {}
    }
    // Ensure structure
    prevSpent.bought = Array.isArray(prevSpent.bought) ? prevSpent.bought : [];
    prevSpent.spent = typeof prevSpent.spent === 'object' && prevSpent.spent !== null ? prevSpent.spent : {};
    prevSpent.spent.chip = typeof prevSpent.spent.chip === 'number' ? prevSpent.spent.chip : 0;
    prevSpent.spent.pin = typeof prevSpent.spent.pin === 'number' ? prevSpent.spent.pin : 0;

    // Check if spending chips would exceed attempts
    const attempts = typeof existingClick.attempts === 'number' ? existingClick.attempts : 0;
    if (prevSpent.spent.chip + chip > attempts) {
      return NextResponse.json(
        { error: 'Not enough chips/attempts left to complete this purchase' },
        { status: 400 }
      );
    }

    // Add chips spent
    prevSpent.spent.chip += chip;
    // // Optionally update pin if provided
    // if (typeof pin === 'number') prevSpent.spent.pin = pin;
    // Add bought item(s)
    if (Array.isArray(bought)) {
      prevSpent.bought.push(...bought);
    } else if (bought) {
      prevSpent.bought.push(bought);
    }
    // Ensure used stays as is or is an object
    prevSpent.used = typeof prevSpent.used === 'object' && prevSpent.used !== null ? prevSpent.used : {};
    const spentValue = JSON.stringify(prevSpent);
    const { error: updateError } = await supabase
      .from('vew_click')
      .update({ 
        
        attempts: existingClick.attempts,
        win: existingClick.win,
        updated_at: 'now()',
        // spent: existingClick.spent
        spent: spentValue
      })
      // .update({ spent: spentValue, updated_at: 'now()' })
      
      .eq('player_id', player_id.toLowerCase());

    if (updateError) {
      console.error('Error updating spent field:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in saveSpent:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 