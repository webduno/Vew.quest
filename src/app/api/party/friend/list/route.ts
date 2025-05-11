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
    const friendId = searchParams.get('friend_id');

    if (!friendId) {
      return NextResponse.json(
        { error: 'Friend ID is required' },
        { status: 400 }
      );
    }

    // Get all parties where the friend is involved
    const { data: parties, error: findError } = await supabase
      .from('vew_party')
      .select('id, room_key, target_code, created_at')
      .or(`room_key.ilike.%${friendId}%`)
      .order('created_at', { ascending: false });

    if (findError) {
      console.error('Supabase database error:', findError);
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    // Process the parties to extract friend information
    const processedParties = parties.map(party => {
      const [friend1, friend2] = party.room_key.split('>>>');
      const otherFriend = friend1 === friendId ? friend2 : friend1;

      return {
        id: party.id,
        target_code: party.target_code,
        created_at: party.created_at,
        other_friend: otherFriend
      };
    });

    return NextResponse.json(
      { parties: processedParties },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error listing friend parties:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 