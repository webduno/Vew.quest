import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import targetsData from '@/../public/data/targets_1.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getRandomTargetCode(): string {
  const targetCodes = Object.keys(targetsData);
  const randomIndex = Math.floor(Math.random() * targetCodes.length);
  return targetCodes[randomIndex];
}

function getReverseRoomKey(roomKey: string): string {
  const [friend1, friend2] = roomKey.split('>>>');
  return `${friend2}>>>${friend1}`;
}

export async function GET(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { searchParams } = new URL(request.url);
    const roomKey = searchParams.get('room_key')?.toLowerCase();

    if (!roomKey) {
      return NextResponse.json(
        { error: 'Room key is required' },
        { status: 400 }
      );
    }

    const reverseRoomKey = getReverseRoomKey(roomKey)?.toLowerCase();

    // Try to find an existing party with either room key orientation
    const { data: existingParty, error: findError } = await supabase
      .from('vew_party')
      .select('id, target_code')
      .or(`room_key.eq.${roomKey},room_key.eq.${reverseRoomKey}`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (findError) {
      console.error('Supabase database error:', findError);
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    // If party exists, check if it needs a target code
    if (existingParty && existingParty.length > 0) {
      const party = existingParty[0];
      if (!party.target_code) {
        // Update the party with a random target code
        const randomTargetCode = getRandomTargetCode();
        const { error: updateError } = await supabase
          .from('vew_party')
          .update({ target_code: randomTargetCode })
          .eq('id', party.id);

        if (updateError) {
          console.error('Error updating party:', updateError);
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { id: party.id },
        { status: 200 }
      );
    }

    // If no party exists, create a new one with a random target code
    const randomTargetCode = getRandomTargetCode();
    const { data: newParty, error: createError } = await supabase
      .from('vew_party')
      .insert([
        { 
          room_key: roomKey,
          target_code: randomTargetCode
        }
      ])
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating party:', createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: newParty.id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error finding or creating party:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 