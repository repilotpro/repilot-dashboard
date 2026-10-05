import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mlsNumber: string }> }
) {
  try {
    const supabase = createServerClient();
    const { mlsNumber } = await params;

    if (!mlsNumber) {
      return NextResponse.json(
        { error: 'MLS number is required' },
        { status: 400 }
      );
    }

    // First, find the property to get the ListingKey
    let listingKey = mlsNumber;
    
    // Try to find by ListingKey
    let result = await supabase
      .from('property_data')
      .select('ListingKey')
      .eq('ListingKey', mlsNumber)
      .limit(1)
      .maybeSingle();
    
    if (!result.data) {
      // Try ListingId
      result = await supabase
        .from('property_data')
        .select('ListingKey')
        .eq('ListingId', mlsNumber)
        .limit(1)
        .maybeSingle();
    }
    
    if (result.data && result.data.ListingKey) {
      listingKey = result.data.ListingKey;
    }

    // Fetch ALL media records for this property to understand the structure
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .eq('ResourceRecordKey', listingKey)
      .order('Order', { ascending: true });

    if (mediaError) {
      return NextResponse.json(
        { error: 'Error fetching media', details: mediaError.message },
        { status: 500 }
      );
    }

    // Analyze the structure
    const analysis = {
      totalRecords: mediaData?.length || 0,
      listingKey: listingKey,
      sampleRecord: mediaData && mediaData.length > 0 ? mediaData[0] : null,
      allColumns: mediaData && mediaData.length > 0 ? Object.keys(mediaData[0]) : [],
      uniqueOrders: mediaData ? [...new Set(mediaData.map((m: any) => m.Order))].sort((a, b) => (a || 999) - (b || 999)) : [],
      recordsByOrder: {} as any,
      mediaTypeValues: mediaData ? [...new Set(mediaData.map((m: any) => m.MediaType).filter(Boolean))] : [],
      shortDescriptionValues: mediaData ? [...new Set(mediaData.map((m: any) => m.ShortDescription).filter(Boolean))] : [],
      urlPatterns: [] as string[],
    };

    // Group by Order to see duplicates
    if (mediaData) {
      mediaData.forEach((m: any) => {
        const order = m.Order || 'null';
        if (!analysis.recordsByOrder[order]) {
          analysis.recordsByOrder[order] = [];
        }
        analysis.recordsByOrder[order].push({
          MediaURL: m.MediaURL,
          MediaType: m.MediaType,
          ShortDescription: m.ShortDescription,
          Order: m.Order,
          MediaStatus: m.MediaStatus,
          // Include first 100 chars of URL to see pattern
          urlPreview: m.MediaURL ? m.MediaURL.substring(0, 100) : null,
        });
      });
    }

    // Analyze URL patterns
    if (mediaData) {
      const urlPatterns = new Set<string>();
      mediaData.forEach((m: any) => {
        if (m.MediaURL) {
          const url = m.MediaURL.toLowerCase();
          if (url.includes('thumb')) urlPatterns.add('contains "thumb"');
          if (url.includes('small')) urlPatterns.add('contains "small"');
          if (url.includes('/tn/')) urlPatterns.add('contains "/tn/"');
          if (url.includes('thumbnail')) urlPatterns.add('contains "thumbnail"');
        }
      });
      analysis.urlPatterns = Array.from(urlPatterns);
    }

    // Show first 10 records in detail
    const sampleRecords = mediaData?.slice(0, 10).map((m: any) => ({
      Order: m.Order,
      MediaType: m.MediaType,
      ShortDescription: m.ShortDescription,
      MediaURL: m.MediaURL ? m.MediaURL.substring(0, 150) + (m.MediaURL.length > 150 ? '...' : '') : null,
      MediaStatus: m.MediaStatus,
    }));

    return NextResponse.json({
      analysis,
      sampleRecords,
      totalRecords: mediaData?.length || 0,
      recommendation: {
        hasMediaType: analysis.allColumns.includes('MediaType'),
        hasShortDescription: analysis.allColumns.includes('ShortDescription'),
        duplicateOrders: Object.keys(analysis.recordsByOrder).filter(
          (order) => analysis.recordsByOrder[order].length > 1
        ),
      },
    });
  } catch (error: any) {
    console.error('Debug media error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

