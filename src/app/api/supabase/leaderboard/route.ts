import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CRVObject {
  storage_key: string;
  result: number;
}

interface PlayerScores {
  [key: string]: number;
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { data, error } = await supabase
      .from('crv_object')
      .select('storage_key, result')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // Calculate total scores per player
    const playerScores = (data as CRVObject[]).reduce((acc: PlayerScores, obj) => {
      if (!acc[obj.storage_key]) {
        acc[obj.storage_key] = 0;
      }
      acc[obj.storage_key] += obj.result;
      return acc;
    }, {});

    // Create leaderboard entries
    const leaderboard = Object.entries(playerScores)
      .map(([storage_key, total_score]) => ({
        storage_key,
        total_score,
        rank: 0 // Will be set after sorting
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    return NextResponse.json({ 
      success: true, 
      data: leaderboard
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error retrieving leaderboard from Supabase:', error);
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