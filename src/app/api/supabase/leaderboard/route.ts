import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { calculateStreak, calculatePotentialStreak } from '@/script/utils/streak';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CRVObject {
  id: string;
  storage_key: string;
  result: number;
  created_at: string;
  request_id: string | null;
  content: any;
}

interface PlayerScores {
  [key: string]: number;
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    console.log('Fetching leaderboard data...');
    const { data, error } = await supabase
      .from('crv_object')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Group data by player and ensure dates are in UTC
    const playerData = (data as CRVObject[]).reduce((acc: { [key: string]: CRVObject[] }, obj) => {
      const storageKey = obj.storage_key.toLowerCase();
      if (!acc[storageKey]) {
        acc[storageKey] = [];
      }
      // Only add viewing attempts (request_id is null)
      if (obj.request_id === null) {
        // Ensure created_at is in UTC
        const utcDate = new Date(obj.created_at);
        acc[storageKey].push({
          ...obj,
          created_at: utcDate.toISOString() // Store as UTC ISO string
        });
      }
      return acc;
    }, {});

    // Calculate stats for each player
    const playerStats = Object.entries(playerData).reduce((acc: any, [key, objects]) => {
      const total_score = objects.reduce((sum, obj) => sum + obj.result, 0);
      const highest_accuracy = Math.max(...objects.map(obj => obj.result));
      const streak = calculateStreak(objects);
      const potential_streak = calculatePotentialStreak(objects);

      acc[key] = {
        total_score,
        total_accuracy: total_score,
        count: objects.length,
        highest_accuracy,
        streak,
        potential_streak
      };
      return acc;
    }, {});

    // Create leaderboard entries
    const leaderboard = Object.entries(playerStats)
      .map(([storage_key, stats]: [string, any]) => ({
        storage_key,
        total_score: stats.total_score,
        average_accuracy: stats.total_accuracy / stats.count,
        highest_accuracy: stats.highest_accuracy,
        streak: stats.streak,
        potential_streak: stats.potential_streak,
        rank: 0 // Will be set after sorting
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 77)
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