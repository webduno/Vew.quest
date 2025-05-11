import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import targetsData from '@/../public/data/targets_1.json';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface TargetsData {
  [key: string]: string;
}

function getRandomTargetCode(): string {
  const targetCodes = Object.keys(targetsData as TargetsData);
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

    // First get the party data to access room key and live data
    const { data: partyData, error: fetchError } = await supabase
      .from('vew_party')
      .select('*')
      .eq('id', partyId)
      .single();

    if (fetchError) {
      console.error('Error fetching party data:', fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!partyData) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    const randomTargetCode = getRandomTargetCode();
    
    // Get target values from the random target code
    const targetValues = (targetsData as TargetsData)[randomTargetCode];
    const [description, valuesStr] = targetValues.split('\n');
    const [type, natural, temp, light, color, solid, confidence] = valuesStr.split(',').map(Number);
    const typeString = ['object', 'entity', 'place', 'event'][type - 1];

    // Store the old target code before updating
    const oldTargetCode = partyData.target_code || '000000000000';

    // get unix
    const partyEndTimestamp = new Date().getTime()
    const uniquePartyId = partyData.room_key+"@@@"+partyEndTimestamp
    // Parse friend list from room key
    const friendList = partyData.room_key.split('>>>');
    
    // For each friend in the party, create a record in crv_object
    for (const friendId of friendList) {
      const storageKey = partyData.room_key;  // Use the original room_key directly
      
      // Parse live data if it exists
      let liveData = partyData.live_data;
      if (typeof liveData === 'string') {
        try {
          liveData = JSON.parse(liveData);
        } catch (e) {
          console.error('Error parsing live_data:', e);
          liveData = null;
        }
      }

      // Calculate accuracy if live data exists
      let overallAccuracy = 0;
      if (liveData?.options) {
        const naturalityAccuracy = calculateAccuracy(natural, liveData.options.natural, true, false);
        const temperatureAccuracy = calculateAccuracy(temp, liveData.options.temp, true, false);
        const lightAccuracy = calculateAccuracy(light, liveData.options.light, false, false);
        const colorAccuracy = calculateAccuracy(color, liveData.options.color, false, false);
        const solidAccuracy = calculateAccuracy(solid, liveData.options.solid, false, false);
        
        overallAccuracy = (
          naturalityAccuracy +
          temperatureAccuracy +
          lightAccuracy +
          colorAccuracy +
          solidAccuracy
        ) / 5;
      } else {
        // Calculate accuracy with all values being 0 when live_data is null
        const naturalityAccuracy = calculateAccuracy(natural, 0, true, false);
        const temperatureAccuracy = calculateAccuracy(temp, 0, true, false);
        const lightAccuracy = calculateAccuracy(light, 0, false, false);
        const colorAccuracy = calculateAccuracy(color, 0, false, false);
        const solidAccuracy = calculateAccuracy(solid, 0, false, false);
        
        overallAccuracy = (
          naturalityAccuracy +
          temperatureAccuracy +
          lightAccuracy +
          colorAccuracy +
          solidAccuracy
        ) / 5;
      }

      const objList = {
        result: overallAccuracy,
        target_id: oldTargetCode.padStart(12, '0'),
        target: {
          type: typeString,
          natural,
          temp,
          light,
          color,
          solid,
          confidence
        },
        sent: liveData?.options || {
          type: 'object',
          natural: 0,
          temp: 0,
          light: 0,
          color: 0,
          solid: 0
        },
        sketch: liveData?.sketch || '',
        notes: liveData?.notes || ''
      };

      const { error: insertError } = await supabase
        .from('crv_object')
        .insert([{ 
          content: JSON.stringify(objList),
          result: overallAccuracy,
          storage_key: friendId,
          party_id: uniquePartyId,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error inserting crv_object:', insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // Update the party's target code and clear live data
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