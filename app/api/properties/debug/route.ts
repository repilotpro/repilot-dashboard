import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get one property with all columns to see the structure
    const { data, error } = await supabase
      .from('property_data')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Also try to get media
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .limit(1);

    return NextResponse.json({
      property_data_sample: data?.[0] || null,
      media_sample: mediaData?.[0] || null,
      property_keys: data?.[0] ? Object.keys(data[0]) : [],
      media_keys: mediaData?.[0] ? Object.keys(mediaData[0]) : [],
      media_error: mediaError?.message || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

