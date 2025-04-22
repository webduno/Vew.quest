import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CRVObject {
  storage_key: string;
  result: number;
  created_at: string;
  request_id: string | null;
}

interface PlayerScores {
  [key: string]: number;
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { data, error } = await supabase
      .from('crv_object')
      .select('storage_key, result, created_at, request_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Calculate total scores and average accuracy per player
    const playerScores = (data as CRVObject[]).reduce((acc: any, obj) => {
      if (!acc[obj.storage_key]) {
        acc[obj.storage_key] = {
          total_score: 0,
          total_accuracy: 0,
          count: 0,
          highest_accuracy: 0,
          dates: new Set()
        };
      }
      acc[obj.storage_key].total_score += obj.result;
      acc[obj.storage_key].total_accuracy += obj.result;
      acc[obj.storage_key].count += 1;
      // Only add date if it's a viewing attempt (request_id is null)
      if (obj.request_id === null) {
        const date = new Date(obj.created_at);
        acc[obj.storage_key].dates.add(date.toISOString().split('T')[0]);
      }
      if (obj.result > acc[obj.storage_key].highest_accuracy) {
        acc[obj.storage_key].highest_accuracy = obj.result;
      }
      return acc;
    }, {});

    // Calculate streak for each player
    Object.entries(playerScores).forEach(([key, stats]: [string, any]) => {
      console.log('Processing player:', key);
      console.log('Dates in set:', stats.dates);
      
      const sortedDates = Array.from(stats.dates as Set<string>).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      console.log('Sorted dates:', sortedDates);
      
      let streak = 0;
      const now = new Date();
      const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      console.log('Current date:', currentDate.toISOString());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() - i);
        const targetStr = targetDate.toISOString().split('T')[0];
        const dateStr = sortedDates[i]; // Already in YYYY-MM-DD format
        
        console.log(`Comparing date ${dateStr} with target ${targetStr}`);
        
        if (dateStr === targetStr) {
          streak++;
          console.log('Streak increased to:', streak);
        } else {
          console.log('Streak broken, dates did not match');
          break;
        }
      }
      
      console.log('Final streak for player:', streak);
      stats.streak = streak;
    });

    // Create leaderboard entries
    const leaderboard = Object.entries(playerScores)
      .map(([storage_key, stats]: [string, any]) => ({
        storage_key,
        total_score: stats.total_score,
        average_accuracy: stats.total_accuracy / stats.count,
        highest_accuracy: stats.highest_accuracy,
        streak: stats.streak,
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