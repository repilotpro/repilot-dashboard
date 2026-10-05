import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get distinct values for each filter field
    const [stateOrProvinceResult, cityResult, transactionTypeResult, propertySubTypeResult] = await Promise.all([
      // StateOrProvince
      supabase
        .from('property_data')
        .select('StateOrProvince')
        .not('StateOrProvince', 'is', null),
      
      // City
      supabase
        .from('property_data')
        .select('City')
        .not('City', 'is', null),
      
      // TransactionType
      supabase
        .from('property_data')
        .select('TransactionType')
        .not('TransactionType', 'is', null),
      
      // PropertySubType
      supabase
        .from('property_data')
        .select('PropertySubType')
        .not('PropertySubType', 'is', null),
    ]);

    // Extract unique values
    const stateOrProvince = [...new Set(
      stateOrProvinceResult.data?.map((p: any) => p.StateOrProvince).filter(Boolean) || []
    )].sort();

    const cities = [...new Set(
      cityResult.data?.map((p: any) => p.City).filter(Boolean) || []
    )].sort();

    const transactionTypes = [...new Set(
      transactionTypeResult.data?.map((p: any) => p.TransactionType).filter(Boolean) || []
    )].sort();

    const propertySubTypes = [...new Set(
      propertySubTypeResult.data?.map((p: any) => p.PropertySubType).filter(Boolean) || []
    )].sort();

    return NextResponse.json({
      stateOrProvince,
      cities,
      transactionTypes,
      propertySubTypes,
      errors: {
        stateOrProvince: stateOrProvinceResult.error?.message,
        city: cityResult.error?.message,
        transactionType: transactionTypeResult.error?.message,
        propertySubType: propertySubTypeResult.error?.message,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch filter options', details: error.message },
      { status: 500 }
    );
  }
}

