import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { calculateStreak, calculatePotentialStreak } from '@/script/utils/streak';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { searchParams } = new URL(request.url);
    const storageKey = searchParams.get('storageKey');
    
    if (!storageKey) {
      return NextResponse.json(
        { error: 'Missing storageKey parameter' },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // Get all data for the storage key
    const { data, error } = await supabase
      .from('crv_object')
      .select('*')
      .ilike('storage_key', storageKey)
      .is('request_id', null)
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

    // Calculate metrics
    const count = data?.length || 0;
    const streak = calculateStreak(data || []);
    const potential_streak = calculatePotentialStreak(data || []);
    const avg_result = data?.length 
      ? data.reduce((sum, obj) => sum + (obj.result || 0), 0) / data.length 
      : 0;

    return NextResponse.json({ 
      success: true, 
      count,
      streak,
      potential_streak,
      avg_result
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error counting CRV objects:', error);
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