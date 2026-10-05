import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get sample values to see what's actually in the database
    const { data: propertyTypes, error: ptError } = await supabase
      .from('property_data')
      .select('PropertyType')
      .limit(100);

    const { data: contractStatuses, error: csError } = await supabase
      .from('property_data')
      .select('ContractStatus')
      .limit(100);

    // Get unique values
    const uniquePropertyTypes = [...new Set(propertyTypes?.map((p: any) => p.PropertyType).filter(Boolean))];
    const uniqueContractStatuses = [...new Set(contractStatuses?.map((p: any) => p.ContractStatus).filter(Boolean))];

    // Test a simple query without filters
    const { data: allData, error: allError } = await supabase
      .from('property_data')
      .select('id, UnparsedAddress, City, ListPrice, BedroomsTotal, BathroomsTotalInteger, PropertyType, ContractStatus')
      .limit(5);

    // Test query with media join
    const { data: withMedia, error: mediaError } = await supabase
      .from('property_data')
      .select(`
        id,
        UnparsedAddress,
        media:media!left(MediaURL, Order, MediaStatus)
      `)
      .limit(2);

    return NextResponse.json({
      uniquePropertyTypes: uniquePropertyTypes.slice(0, 20),
      uniqueContractStatuses: uniqueContractStatuses.slice(0, 20),
      sampleProperties: allData,
      sampleWithMedia: withMedia?.map((p: any) => ({
        id: p.id,
        address: p.UnparsedAddress,
        mediaCount: Array.isArray(p.media) ? p.media.length : (p.media ? 1 : 0)
      })),
      errors: {
        propertyTypes: ptError?.message,
        contractStatuses: csError?.message,
        allData: allError?.message,
        media: mediaError?.message
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

