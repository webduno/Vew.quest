import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { 
        status: 400,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    }

    const { data, error } = await supabase
      .from('crv_request')
      .select('*')
      .eq('creator_id', playerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CRV mailbox:', error);
      return NextResponse.json({ error: 'Failed to fetch CRV mailbox' }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    }

    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error in CRV mailbox endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  }
} 