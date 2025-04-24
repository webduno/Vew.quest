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

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { partyId } = await request.json();

    if (!partyId) {
      return NextResponse.json(
        { error: 'Party ID is required' },
        { status: 400 }
      );
    }

    const randomTargetCode = getRandomTargetCode();
    
    const { error: updateError } = await supabase
      .from('vew_party')
      .update({ target_code: randomTargetCode, live_data: null })
      .eq('id', partyId);

    if (updateError) {
      console.error('Error updating party target:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, target_code: randomTargetCode },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error setting new target:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 