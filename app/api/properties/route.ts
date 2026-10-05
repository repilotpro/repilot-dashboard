import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const PROPERTY_COLUMNS = [
  'id',
  'ListingKey',
  'StateOrProvince',
  'City',
  'CityRegion',
  'StreetNumber',
  'StreetDirPrefix',
  'StreetName',
  'StreetSuffix',
  'StreetDirSuffix',
  'UnparsedAddress',
  'ListPrice',
  'BedroomsTotal',
  'BathroomsTotalInteger',
  'BuildingAreaTotal',
  'BuildingAreaUnits',
  'DaysOnMarket',
  'OriginalEntryTimestamp',
  'ListingContractDate',
  'PropertyType',
  'PropertySubType',
  'LotSizeDimensions',
  'LotSizeArea',
  'LotSizeAreaUnits',
  'LotSizeUnits',
  'GarageParkingSpaces',
  'CoveredSpaces',
  'ParkingTotal',
  'MlsStatus',
  'StandardStatus',
  'TransactionType',
  'ApproximateAge',
  'Basement',
  'ArchitecturalStyle',
  'ModificationTimestamp',
  'AddChangeTimestamp',
].join(',');

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    // Default fields
    const stateOrProvince = searchParams.get('stateOrProvince');
    const city = searchParams.get('city');
    const transactionType = searchParams.get('transactionType');
    const propertySubType = searchParams.get('propertySubType');
    
    // Expanded fields
    const propertyType = searchParams.get('propertyType');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const parkingTotal = searchParams.get('parkingTotal');
    const basement = searchParams.get('basement');
    const statusChange = searchParams.get('statusChange');
    
    // Get pagination parameters
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Debug: Log all filters
    console.log('=== API DEBUG: Filters ===');
    console.log('stateOrProvince:', stateOrProvince);
    console.log('city:', city);
    console.log('transactionType:', transactionType);
    console.log('propertySubType:', propertySubType);
    console.log('priceMin:', priceMin);
    console.log('priceMax:', priceMax);
    console.log('propertyType:', propertyType);
    console.log('bedrooms:', bedrooms);
    console.log('bathrooms:', bathrooms);
    console.log('parkingTotal:', parkingTotal);
    console.log('basement:', basement);
    console.log('statusChange:', statusChange);

    // Build query info for developer visibility
    const queryInfo: any = {
      table: 'property_data',
      select: PROPERTY_COLUMNS,
      filters: [] as string[],
      orderBy: 'ListingContractDate DESC, id DESC',
      pagination: { limit, offset }
    };

    // Start building the query - join with media table
    // Media table likely links via ListingKey or ResourceRecordKey
    // Try without explicit join first to see if it works
    let query = supabase
      .from('property_data')
      .select(PROPERTY_COLUMNS);

    // Apply filters using actual column names (PascalCase)
    // Default fields
    if (stateOrProvince) {
      console.log('Applying StateOrProvince filter:', stateOrProvince);
      query = query.eq('StateOrProvince', stateOrProvince);
      queryInfo.filters.push(`StateOrProvince = '${stateOrProvince}'`);
    }

    if (city) {
      console.log('Applying City filter:', city);
      query = query.ilike('City', `%${city}%`);
      queryInfo.filters.push(`City ILIKE '%${city}%'`);
    }

    if (transactionType) {
      console.log('Applying TransactionType filter:', transactionType);
      query = query.eq('TransactionType', transactionType);
      queryInfo.filters.push(`TransactionType = '${transactionType}'`);
    }

    if (propertySubType) {
      console.log('Applying PropertySubType filter:', propertySubType);
      query = query.eq('PropertySubType', propertySubType);
      queryInfo.filters.push(`PropertySubType = '${propertySubType}'`);
    }

    if (priceMin) {
      const priceMinNum = parseInt(priceMin);
      console.log('Applying ListPrice filter >=', priceMinNum);
      query = query.gte('ListPrice', priceMinNum);
      queryInfo.filters.push(`ListPrice >= ${priceMinNum}`);
    }

    if (priceMax) {
      const priceMaxNum = parseInt(priceMax);
      console.log('Applying ListPrice filter <=', priceMaxNum);
      query = query.lte('ListPrice', priceMaxNum);
      queryInfo.filters.push(`ListPrice <= ${priceMaxNum}`);
    }

    // Expanded fields
    if (propertyType) {
      console.log('Applying PropertyType filter:', propertyType);
      // Use exact match (dropdown now shows actual database values)
      query = query.eq('PropertyType', propertyType);
      queryInfo.filters.push(`PropertyType = '${propertyType}'`);
    }

    if (bedrooms) {
      const bedroomsNum = parseInt(bedrooms);
      console.log('Applying BedroomsTotal filter >=', bedroomsNum);
      query = query.gte('BedroomsTotal', bedroomsNum);
      queryInfo.filters.push(`BedroomsTotal >= ${bedroomsNum}`);
    }

    if (bathrooms) {
      const bathroomsNum = parseFloat(bathrooms);
      console.log('Applying BathroomsTotalInteger filter >=', bathroomsNum);
      query = query.gte('BathroomsTotalInteger', bathroomsNum);
      queryInfo.filters.push(`BathroomsTotalInteger >= ${bathroomsNum}`);
    }

    if (parkingTotal) {
      const parkingNum = parseInt(parkingTotal);
      console.log('Applying ParkingTotal filter >=', parkingNum);
      query = query.gte('ParkingTotal', parkingNum);
      queryInfo.filters.push(`ParkingTotal >= ${parkingNum}`);
    }

    if (basement) {
      const basementOptions = basement.split(',').filter(Boolean);
      console.log('Applying Basement filter:', basementOptions);
      // Basement field might contain multiple values, so we need to check if it contains any of the selected options
      if (basementOptions.length > 0) {
        // Use OR logic - property must have at least one of the selected basement types
        // Build OR conditions for Supabase PostgREST format: "column.operator.value,column.operator.value"
        const orConditions = basementOptions.map((opt: string) => `Basement.ilike.%${opt.trim()}%`).join(',');
        if (orConditions) {
          query = query.or(orConditions);
          // Build proper SQL OR syntax for display
          const sqlOrConditions = basementOptions.map((opt: string) => `Basement ILIKE '%${opt.trim()}%'`).join(' OR ');
          queryInfo.filters.push(`(${sqlOrConditions})`);
        }
      }
    }

    if (statusChange) {
      console.log('Applying MlsStatus filter:', statusChange);
      if (statusChange === 'Active') {
        // Active means MlsStatus IN ('New', 'Price Change', 'Sold Conditional', 'Extension')
        query = query.in('MlsStatus', ['New', 'Price Change', 'Sold Conditional', 'Extension']);
        queryInfo.filters.push(`MlsStatus IN ('New', 'Price Change', 'Sold Conditional', 'Extension')`);
      } else {
        // Filter by specific MlsStatus value
        query = query.eq('MlsStatus', statusChange);
        queryInfo.filters.push(`MlsStatus = '${statusChange}'`);
      }
    }

    // Execute query with pagination
    // Sort by ListingContractDate descending (most recent first)
    console.log('Executing query with limit:', limit, 'offset:', offset);
    const { data: rawData, error } = await query
      .order('ListingContractDate', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    const data = rawData as Array<Record<string, any>> | null;
    
    console.log('Query executed. Results:', {
      dataCount: data?.length || 0,
      error: error?.message || null,
      errorCode: error?.code || null
    });

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: 'Failed to fetch properties',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    const sample = data?.[0];

    console.log('Raw data sample (first property):', sample ? {
      id: sample.id,
      address: sample.UnparsedAddress,
      city: sample.City,
      price: sample.ListPrice,
      bedrooms: sample.BedroomsTotal,
      bathrooms: sample.BathroomsTotalInteger,
      propertyType: sample.PropertyType,
      mediaCount: Array.isArray(sample.media) ? sample.media.length : 0
    } : 'No data');

    // Fetch media separately for each property
    // Get all listing keys from the results
    const listingKeys = (data || []).map((p: any) => p.ListingKey).filter(Boolean);
    console.log('Fetching media for', listingKeys.length, 'properties');
    console.log('Sample listing keys:', listingKeys.slice(0, 5));
    
    let mediaMap: { [key: string]: any[] } = {};
    let mediaBatchFailed = false;
    if (listingKeys.length > 0) {
      // Fetch media in batches to avoid query size limits
      const batchSize = 100;
      for (let i = 0; i < listingKeys.length; i += batchSize) {
        const batch = listingKeys.slice(i, i + batchSize);
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('ResourceRecordKey, MediaURL, Order, MediaStatus, ImageSizeDescription')
          .in('ResourceRecordKey', batch);
        
        if (!mediaError && mediaData) {
          // Group media by ResourceRecordKey
          mediaData.forEach((media: any) => {
            if (!mediaMap[media.ResourceRecordKey]) {
              mediaMap[media.ResourceRecordKey] = [];
            }
            mediaMap[media.ResourceRecordKey].push(media);
          });
        } else if (mediaError) {
          mediaBatchFailed = true;
          console.error('Media fetch error for batch:', mediaError);
        }
      }
      
      console.log('Fetched media for', Object.keys(mediaMap).length, 'properties');
      console.log('Sample ResourceRecordKeys in mediaMap:', Object.keys(mediaMap).slice(0, 5));
      
      // Find properties missing from mediaMap and fetch them individually
      const missingListingKeys = listingKeys.filter((key: string) => !mediaMap[key]);
      if (!mediaBatchFailed && missingListingKeys.length > 0) {
        console.log('Fetching media for', missingListingKeys.length, 'missing properties:', missingListingKeys.slice(0, 5));
        
        // Fetch missing media in parallel
        const missingMediaPromises = missingListingKeys.map(async (key: string) => {
          const { data: missingMedia, error: missingError } = await supabase
            .from('media')
            .select('ResourceRecordKey, MediaURL, Order, MediaStatus, ImageSizeDescription')
            .eq('ResourceRecordKey', key)
            .eq('MediaStatus', 'Active')
            .order('Order', { ascending: true });
          
          if (!missingError && missingMedia && missingMedia.length > 0) {
            mediaMap[key] = missingMedia;
            return { key, count: missingMedia.length };
          }
          return { key, count: 0 };
        });
        
        const missingResults = await Promise.all(missingMediaPromises);
        const found = missingResults.filter(r => r.count > 0);
        console.log('Found media for', found.length, 'missing properties');
      }
      
      // Debug specific property if it's in the results
      const debugProperty = data?.find((p: any) => p.ListingKey === 'N12446069');
      if (debugProperty) {
        console.log('=== DEBUG Property N12446069 ===');
        console.log('ListingKey:', debugProperty.ListingKey);
        console.log('Media in map for this ListingKey:', mediaMap[debugProperty.ListingKey]);
        // Check if there are any media records with different ResourceRecordKey
        const allResourceRecordKeys = Object.keys(mediaMap);
        console.log('All ResourceRecordKeys in mediaMap:', allResourceRecordKeys);
        console.log('Is N12446069 in mediaMap?', debugProperty.ListingKey in mediaMap);
      }
    }

    // Transform data to match the Property interface
    const properties = (data || []).map((property: any) => {
      // Get images from media map, separating main images from thumbnails
      let mainImages: string[] = [];
      let thumbnails: string[] = [];
      
      // Debug for specific property
      const isDebugProperty = property.ListingKey === 'N12446069';
      if (isDebugProperty) {
        console.log('=== Processing images for N12446069 ===');
        console.log('Property ListingKey:', property.ListingKey);
        console.log('MediaMap keys:', Object.keys(mediaMap));
        console.log('Media for this ListingKey:', mediaMap[property.ListingKey]);
      }
      
      // Try to get media - first by ResourceRecordKey (which should match ListingKey)
      const propertyMedia = property.ListingKey ? mediaMap[property.ListingKey] : null;
      
      if (property.ListingKey && propertyMedia) {
        if (isDebugProperty) {
          console.log('Property media found:', propertyMedia.length, 'records');
        }
        
        // Sort by Order and filter active media
        const activeMedia = propertyMedia
          .filter((m: any) => m.MediaStatus === 'Active' && m.MediaURL)
          .sort((a: any, b: any) => (a.Order || 999) - (b.Order || 999));
        
        if (isDebugProperty) {
          console.log('Active media after filtering:', activeMedia.length);
          console.log('Active media sample (first 5):', activeMedia.slice(0, 5).map((m: any) => ({ Order: m.Order, ImageSizeDescription: m.ImageSizeDescription })));
        }
        
        // Process media in Order sequence, maintaining the order from the query
        const mainImagesWithOrder: { url: string; order: number }[] = [];
        const thumbnailsWithOrder: { url: string; order: number }[] = [];
        
        activeMedia.forEach((m: any) => {
          const url = m.MediaURL;
          if (!url) return;
          
          const imageSize = m.ImageSizeDescription;
          const order = m.Order ?? 999;
          
          // Check ImageSizeDescription first
          if (imageSize) {
            const sizeDesc = imageSize.toLowerCase();
            if (sizeDesc.includes('thumbnail')) {
              thumbnailsWithOrder.push({ url, order });
            } else {
              mainImagesWithOrder.push({ url, order });
            }
          } else {
            // Fallback: Use URL pattern if ImageSizeDescription is not available
            if (url.includes('rs:fit:1920:1920')) {
              mainImagesWithOrder.push({ url, order });
            } else if (url.includes('rs:fit:240:240')) {
              thumbnailsWithOrder.push({ url, order });
            } else {
              // Default to main image if unclear
              mainImagesWithOrder.push({ url, order });
            }
          }
        });
        
        // Sort by Order to maintain sequence (should already be sorted, but ensure it)
        mainImagesWithOrder.sort((a, b) => a.order - b.order);
        thumbnailsWithOrder.sort((a, b) => a.order - b.order);
        
        // Extract URLs in order (maintaining Order sequence)
        mainImages = mainImagesWithOrder.map(item => item.url);
        thumbnails = thumbnailsWithOrder.map(item => item.url);
        
        if (isDebugProperty) {
          console.log('Main images:', mainImages.length);
          console.log('Thumbnails:', thumbnails.length);
          console.log('Thumbnails Order sequence (first 5):', thumbnailsWithOrder.slice(0, 5).map(item => `Order:${item.order}`));
          console.log('First thumbnail URL:', thumbnails[0]);
        }
      } else if (isDebugProperty) {
        console.log('No media found for ListingKey:', property.ListingKey);
        console.log('Available keys in mediaMap:', Object.keys(mediaMap));
      }

      // Build address from components
      const addressParts = [
        property.StreetNumber,
        property.StreetDirPrefix,
        property.StreetName,
        property.StreetSuffix,
        property.StreetDirSuffix
      ].filter(Boolean);
      const address = addressParts.join(' ') || property.UnparsedAddress || '';

      // Get main image: first thumbnail (ordered by Order field), or first main image if no thumbnails
      const mainImage = thumbnails[0] || mainImages[0] || null;

      // Parse basement array if it's a string
      let basement = '';
      if (property.Basement) {
        try {
          const basementArray = typeof property.Basement === 'string' 
            ? JSON.parse(property.Basement.replace(/'/g, '"'))
            : property.Basement;
          basement = Array.isArray(basementArray) ? basementArray.join(', ') : basement;
        } catch {
          basement = property.Basement;
        }
      }

      // Parse architectural style
      let style = '';
      if (property.ArchitecturalStyle) {
        try {
          const styleArray = typeof property.ArchitecturalStyle === 'string'
            ? JSON.parse(property.ArchitecturalStyle.replace(/'/g, '"'))
            : property.ArchitecturalStyle;
          style = Array.isArray(styleArray) ? styleArray.join(', ') : style;
        } catch {
          style = property.ArchitecturalStyle;
        }
      }

      return {
        id: property.id?.toString() || '',
        address: address,
        city: property.City || '',
        area: property.CityRegion || property.CommunityName || '',
        price: property.ListPrice || 0,
        bedrooms: property.BedroomsTotal || 0,
        bathrooms: property.BathroomsTotalInteger || 0,
        squareFeet: property.BuildingAreaTotal || property.LivingArea || property.TotalArea || 0,
        image: mainImage,
        images: mainImages, // Only main images, not thumbnails
        thumbnails: thumbnails, // Thumbnails for grid
        imageCount: mainImages.length, // Count of unique main images (not including thumbnails)
        daysOnMarket: property.DaysOnMarket || 0,
        listingDate: property.ListDate || property.OriginalEntryTimestamp || '',
        listingContractDate: property.ListingContractDate || '',
        mlsNumber: property.ListingKey || '',
        propertyType: property.PropertyType || '',
        lotSize: property.LotSizeDimensions || property.LotSizeArea ? 
          `${property.LotSizeArea} ${property.LotSizeAreaUnits || property.LotSizeUnits || ''}`.trim() : '',
        garage: property.GarageParkingSpaces || property.CoveredSpaces || 0,
        parkingTotal: property.ParkingTotal || 0,
        mlsStatus: property.MlsStatus || property.StandardStatus || '',
        statusChange: property.StatusChange || '',
        standardStatus: property.StandardStatus || '',
        transactionType: property.TransactionType || '',
        yearBuilt: property.YearBuilt || property.ApproximateAge ? 
          (new Date().getFullYear() - (property.ApproximateAge || 0)) : undefined,
        livingArea: property.BuildingAreaTotal ? `${property.BuildingAreaTotal} ${property.BuildingAreaUnits || 'SqFt'}` : undefined,
        basement: basement,
        buildingType: property.PropertyType || '',
        style: style,
        storeys: property.StoriesTotal || property.Levels || undefined,
        listingAgent: property.ListAgentFullName || property.ListAgentName || '',
        updatedDate: property.ModificationTimestamp || property.AddChangeTimestamp || '',
        superMarket: property.MarketConditions || '',
        sellerMarket: property.MarketConditions || '',
      };
    });

    // Build SQL-like query string for display
    let sqlQuery = `SELECT ${PROPERTY_COLUMNS} FROM property_data`;
    if (queryInfo.filters.length > 0) {
      sqlQuery += `\nWHERE ${queryInfo.filters.join(' AND ')}`;
    }
    sqlQuery += `\nORDER BY ${queryInfo.orderBy}`;
    sqlQuery += `\nLIMIT ${queryInfo.pagination.limit} OFFSET ${queryInfo.pagination.offset}`;
    
    queryInfo.sql = sqlQuery;
    queryInfo.mediaQuery = `SELECT ResourceRecordKey, MediaURL, "Order", MediaStatus 
FROM media 
WHERE ResourceRecordKey IN (${listingKeys.length} listing keys from results)
AND MediaStatus = 'Active'
ORDER BY "Order"`;
    queryInfo.resultCount = data?.length || 0;
    queryInfo.totalProperties = data?.length || 0;

    return NextResponse.json({
      properties,
      count: properties.length,
      queryInfo: queryInfo
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
