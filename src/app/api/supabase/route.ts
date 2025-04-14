import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { calculateAccuracy } from "../../../../scripts/utils/calculateAccuracy";

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
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('crv_object')
      .select()
      .eq('storage_key', storageKey)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data.map(item => ({
        ...item,
        content: JSON.parse(item.content)
      }))
    });
  } catch (error: any) {
    console.error('Error retrieving objects from Supabase:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  try {
    const { objList, storageKey } = await request.json();

    if (!objList || !storageKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const naturalityAccuracy = calculateAccuracy(objList.target.natural, objList.sent.natural, true, false)
    const temperatureAccuracy = calculateAccuracy(objList.target.temp, objList.sent.temp, true, false)
    const lightAccuracy = calculateAccuracy(objList.target.light, objList.sent.light, false, false)
    const colorAccuracy = calculateAccuracy(objList.target.color, objList.sent.color, false, false)
    const solidAccuracy = calculateAccuracy(objList.target.solid, objList.sent.solid, false, false)
    const overallAccuracy = (
      naturalityAccuracy +
      temperatureAccuracy +
      lightAccuracy +
      colorAccuracy +
      solidAccuracy
    ) / 5
    
    const result = await supabase
      .from('crv_object')
      .insert([{ 
        content: JSON.stringify(objList),
        result: overallAccuracy,
        storage_key: storageKey,
        created_at: new Date().toISOString()
      }]);

    if (result.error) {
      console.error('Supabase database error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving objects to Supabase:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 