import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Party ID is required' },
        { status: 400 }
      );
    }

    const existingData = await supabase
      .from('vew_party')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingData) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    const newPlayerTurnKey = (() => {
      const players = existingData.data.room_key.split('>>>');
      const currentTurn = existingData.data.turn;
      
      if (!currentTurn) {
        return players[0];
      }
      
      const currentIndex = players.indexOf(currentTurn);
      if (currentIndex === -1) {
        return players[0];
      }
      
      const nextIndex = (currentIndex + 1) % players.length;
      return players[nextIndex];
    })();

    const { data, error } = await supabase
      .from('vew_party')
      .update({ turn: newPlayerTurnKey })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      data,
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating party:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 