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

    console.log('Fetching property with MLS number:', mlsNumber);

    // Fetch property by ListingKey or ListingId (MlsNumber column doesn't exist)
    // Try each field separately since OR might not work as expected
    let data = null;
    let error = null;
    
    // First try ListingKey
    console.log('Trying ListingKey...');
    let result = await supabase
      .from('property_data')
      .select('*')
      .eq('ListingKey', mlsNumber)
      .limit(1)
      .maybeSingle();
    
    console.log('ListingKey result:', { hasData: !!result.data, error: result.error?.message });
    
    if (result.data) {
      data = result.data;
      console.log('Found property by ListingKey');
    } else {
      // Try ListingId
      console.log('Trying ListingId...');
      result = await supabase
        .from('property_data')
        .select('*')
        .eq('ListingId', mlsNumber)
        .limit(1)
        .maybeSingle();
      
      console.log('ListingId result:', { hasData: !!result.data, error: result.error?.message });
      
      if (result.data) {
        data = result.data;
        console.log('Found property by ListingId');
      } else {
        error = result.error;
        console.log('Property not found in any field');
      }
    }

    if (error || !data) {
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { error: 'Property not found', details: error?.message },
        { status: 404 }
      );
    }

    // Fetch media for this property
    const listingKey = data.ListingKey || mlsNumber;
    // Fetch all media columns to understand the structure
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .eq('ResourceRecordKey', listingKey)
      .eq('MediaStatus', 'Active')
      .order('Order', { ascending: true });

    console.log('Media data sample for property:', mediaData?.slice(0, 3));
    console.log('Total media records:', mediaData?.length);

    // Separate main images and thumbnails based on ImageSizeDescription
    // ImageSizeDescription has "Large" for main images and "Thumbnail" for thumbnails
    let mainImages: string[] = [];
    let thumbnails: string[] = [];
    
    if (!mediaError && mediaData && mediaData.length > 0) {
      // Process media in Order sequence, maintaining the order from the query
      // mediaData is already ordered by Order (ascending) from the query
      const mainImagesWithOrder: { url: string; order: number }[] = [];
      const thumbnailsWithOrder: { url: string; order: number }[] = [];
      
      mediaData.forEach((m: any) => {
        if (!m.MediaURL) return;
        
        const url = m.MediaURL;
        const imageSize = m.ImageSizeDescription;
        const order = m.Order ?? 999;
        
        // Primary method: Use ImageSizeDescription
        if (imageSize) {
          const sizeLower = imageSize.toLowerCase();
          if (sizeLower === 'large' || sizeLower.includes('large')) {
            mainImagesWithOrder.push({ url, order });
          } else if (sizeLower === 'thumbnail' || sizeLower.includes('thumbnail') || sizeLower.includes('thumb')) {
            thumbnailsWithOrder.push({ url, order });
          } else {
            // If ImageSizeDescription exists but doesn't match, fallback to URL pattern
            if (url.includes('rs:fit:1920:1920')) {
              mainImagesWithOrder.push({ url, order });
            } else if (url.includes('rs:fit:240:240')) {
              thumbnailsWithOrder.push({ url, order });
            } else {
              // Default to main image if unclear
              mainImagesWithOrder.push({ url, order });
            }
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
      
      console.log('Main images count:', mainImages.length);
      console.log('Thumbnails count:', thumbnails.length);
      console.log('Total media records:', mediaData.length);
      console.log('Unique image count (main images):', mainImages.length);
      if (mainImagesWithOrder.length > 0) {
        console.log('Main images Order sequence (first 10):', mainImagesWithOrder.slice(0, 10).map(item => `Order:${item.order}`));
      }
      if (thumbnailsWithOrder.length > 0) {
        console.log('Thumbnails Order sequence (first 10):', thumbnailsWithOrder.slice(0, 10).map(item => `Order:${item.order}`));
      }
    }

    // Fetch rooms from property_rooms table
    const { data: roomsData, error: roomsError } = await supabase
      .from('property_rooms')
      .select('*')
      .eq('ListingKey', listingKey)
      .order('Order', { ascending: true });

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
    }

    let rooms: any[] = [];
    if (!roomsError && roomsData && roomsData.length > 0) {
      console.log('Raw rooms data sample:', roomsData.slice(0, 2));
      rooms = roomsData.map((room: any) => {
        // Combine RoomFeature1, RoomFeature2, RoomFeature3 into a comma-separated string
        const features = [
          room.RoomFeature1,
          room.RoomFeature2,
          room.RoomFeature3
        ].filter(Boolean).join(', ');

        return {
          name: room.RoomDescription || room.RoomName || room.RoomType || room.Room || '',
          level: room.RoomLevel || room.Level || '',
          features: features || undefined,
        };
      }).filter((room: any) => room.name); // Filter out rooms without names
    }

    console.log('Rooms fetched for ListingKey', listingKey, ':', rooms.length);
    if (rooms.length === 0 && roomsData && roomsData.length > 0) {
      console.log('Warning: Rooms data exists but no valid rooms after mapping. Sample:', roomsData[0]);
    }

    // Build address from components
    const addressParts = [
      data.StreetNumber,
      data.StreetDirPrefix,
      data.StreetName,
      data.StreetSuffix,
      data.StreetDirSuffix
    ].filter(Boolean);
    const address = addressParts.join(' ') || data.UnparsedAddress || '';

      // Get main image (first main image or null if no images)
      const mainImage = mainImages[0] || null;
      
      // Get thumbnails for the grid (use thumbnails if available, otherwise use main images)
      const gridImages = thumbnails.length > 0 
        ? thumbnails.slice(0, 4) 
        : mainImages.slice(1, 5); // Skip first image (used as main) and take next 4

    // Parse basement array if it's a string
    let basement = '';
    if (data.Basement) {
      try {
        const basementArray = typeof data.Basement === 'string' 
          ? JSON.parse(data.Basement.replace(/'/g, '"'))
          : data.Basement;
        basement = Array.isArray(basementArray) ? basementArray.join(', ') : basement;
      } catch {
        basement = data.Basement;
      }
    }

    // Parse architectural style
    let style = '';
    if (data.ArchitecturalStyle) {
      try {
        const styleArray = typeof data.ArchitecturalStyle === 'string'
          ? JSON.parse(data.ArchitecturalStyle.replace(/'/g, '"'))
          : data.ArchitecturalStyle;
        style = Array.isArray(styleArray) ? styleArray.join(', ') : style;
      } catch {
        style = data.ArchitecturalStyle;
      }
    }

    // Parse cooling array if it's a string or array
    let cooling = '';
    if (data.Cooling) {
      try {
        const coolingArray = typeof data.Cooling === 'string'
          ? JSON.parse(data.Cooling.replace(/'/g, '"'))
          : data.Cooling;
        if (Array.isArray(coolingArray)) {
          // Filter out empty strings and join with comma
          cooling = coolingArray.filter((item: any) => item && item.trim() !== '').join(', ');
        } else {
          cooling = data.Cooling;
        }
      } catch {
        cooling = data.Cooling;
      }
    }

    // Format listing date
    const listingContractDate = data.ListingContractDate || '';
    
    // Format dates to YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return dateStr;
      }
    };
    
    const listingDate = formatDate(listingContractDate);
    const formattedListingContractDate = formatDate(listingContractDate);
    
    // Calculate Days on Market from ListingContractDate
    let daysOnMarket: number = 0;
    let calculatedPropertyDaysOnMarket: number | undefined = undefined;
    if (listingContractDate) {
      try {
        const contractDate = new Date(listingContractDate);
        const today = new Date();
        if (!isNaN(contractDate.getTime())) {
          const diffTime = Math.abs(today.getTime() - contractDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          daysOnMarket = diffDays;
          calculatedPropertyDaysOnMarket = diffDays;
        }
      } catch {
        // Keep 0 if calculation fails
        daysOnMarket = data.DaysOnMarket || 0;
      }
    } else {
      // Fallback to database value if ListingContractDate is not available
      daysOnMarket = data.DaysOnMarket || 0;
    }

    // Fetch listing history using ParcelNumber
    let listingHistory: any[] = [];
    if (data.ParcelNumber) {
      const { data: historyData, error: historyError } = await supabase
        .from('property_data')
        .select('ListingContractDate, ExpirationDate, ListPrice, MlsStatus, ListingKey')
        .eq('ParcelNumber', data.ParcelNumber)
        .order('ListingContractDate', { ascending: false });

      if (!historyError && historyData && historyData.length > 0) {
        listingHistory = historyData.map((item: any) => ({
          dateStart: formatDate(item.ListingContractDate || ''),
          dateEnd: item.ExpirationDate ? formatDate(item.ExpirationDate) : undefined,
          price: item.ListPrice || 0,
          event: item.MlsStatus || '',
          listingId: item.ListingKey || '',
        }));
      }
    }

    // Fetch community census data using a single query
    let community: any = undefined;
    if (data.census_dguid) {
      // Fetch all census characteristics in one query
      // CHARACTERISTIC_ID values: 1, 39, 57, 252, 1416, 1489, 78, 81, 84, 2001
      const { data: censusData, error: censusError } = await supabase
        .from('census')
        .select('CHARACTERISTIC_ID, C1_COUNT_TOTAL, C10_RATE_TOTAL, DAUID, Region')
        .eq('DGUID', data.census_dguid)
        .in('CHARACTERISTIC_ID', [1, 39, 57, 252, 1416, 1489, 78, 81, 84, 2001]);

      // Fetch DAUID and Region from any census record (they should be the same for all records with same DGUID)
      let dauid: string | undefined = undefined;
      let region: string | undefined = undefined;
      if (censusData && censusData.length > 0) {
        dauid = censusData[0].DAUID;
        region = censusData[0].Region;
      }

      if (!censusError && censusData && censusData.length > 0) {
        // Create a map for easy lookup (convert CHARACTERISTIC_ID to string for consistency)
        const censusMap = new Map();
        censusData.forEach((item: any) => {
          censusMap.set(String(item.CHARACTERISTIC_ID), item);
        });

        // Calculate households with children
        const householdsTotal = censusMap.get('78')?.C1_COUNT_TOTAL || 0;
        const householdsWithChildren1 = censusMap.get('81')?.C1_COUNT_TOTAL || 0;
        const householdsWithChildren2 = censusMap.get('84')?.C1_COUNT_TOTAL || 0;
        const householdsWithChildren = householdsTotal > 0 
          ? ((householdsWithChildren1 + householdsWithChildren2) / householdsTotal) * 100 
          : undefined;

        community = {
          dauid: dauid,
          region: region,
          population: censusMap.get('1')?.C1_COUNT_TOTAL || undefined,
          averageAge: censusMap.get('39')?.C1_COUNT_TOTAL || undefined,
          averageHouseholdSize: censusMap.get('57')?.C1_COUNT_TOTAL || undefined,
          averageIncome: censusMap.get('252')?.C1_COUNT_TOTAL || undefined,
          renters: censusMap.get('1416')?.C10_RATE_TOTAL || undefined,
          averageHomeValue: censusMap.get('1489')?.C1_COUNT_TOTAL || undefined,
          householdsWithChildren: householdsWithChildren,
          collegeUniversityEducation: censusMap.get('2001')?.C10_RATE_TOTAL || undefined,
        };

        // Fetch chart data in a single query
        // Collect all CHARACTERISTIC_IDs needed for charts
        const chartCharacteristicIds: number[] = [
          // Household Income: 261-280 (excluding 276)
          ...Array.from({ length: 20 }, (_, i) => i + 261).filter(id => id !== 276),
          // Age: 10-33 (excluding 13, 24, 29)
          ...Array.from({ length: 24 }, (_, i) => i + 10).filter(id => ![13, 24, 29].includes(id)),
          // Education: 1999-2013 (excluding 1998, 2001)
          ...Array.from({ length: 15 }, (_, i) => i + 1999).filter(id => ![1998, 2001].includes(id)),
          // Ethnicity: 1699-1948
          ...Array.from({ length: 250 }, (_, i) => i + 1699),
          // Language: 396-717
          ...Array.from({ length: 322 }, (_, i) => i + 396),
          // Religion: 1950, 1951, 1967-1973
          1950, 1951, ...Array.from({ length: 7 }, (_, i) => i + 1967),
          // Occupation: 2249-2258
          ...Array.from({ length: 10 }, (_, i) => i + 2249),
          // Housing: 42-49
          ...Array.from({ length: 8 }, (_, i) => i + 42),
          // Commute Method: 2605-2610
          ...Array.from({ length: 6 }, (_, i) => i + 2605),
        ];

        const { data: chartCensusData, error: chartCensusError } = await supabase
          .from('census')
          .select('CHARACTERISTIC_ID, C1_COUNT_TOTAL, CHARACTERISTIC_NAME')
          .eq('DGUID', data.census_dguid)
          .in('CHARACTERISTIC_ID', chartCharacteristicIds)
          .gt('C1_COUNT_TOTAL', 0);

        if (!chartCensusError && chartCensusData && chartCensusData.length > 0) {
          // Process Household Income
          const incomeGroups = new Map<string, number>();
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 261 && item.CHARACTERISTIC_ID <= 280 && item.CHARACTERISTIC_ID !== 276)
            .forEach((item: any) => {
              let group = '';
              if (item.CHARACTERISTIC_ID >= 261 && item.CHARACTERISTIC_ID <= 264) group = '$0-$29,999';
              else if (item.CHARACTERISTIC_ID >= 265 && item.CHARACTERISTIC_ID <= 268) group = '$30,000-$59,999';
              else if (item.CHARACTERISTIC_ID >= 269 && item.CHARACTERISTIC_ID <= 271) group = '$60,000-$79,999';
              else if (item.CHARACTERISTIC_ID >= 272 && item.CHARACTERISTIC_ID <= 275) group = '$80,000-$99,999';
              else if ([277, 278].includes(item.CHARACTERISTIC_ID)) group = '$100,000-$149,999';
              else if ([279, 280].includes(item.CHARACTERISTIC_ID)) group = '$150,000-$199,999';
              // Note: $200,000+ would need additional CHARACTERISTIC_IDs if available
              if (group) {
                incomeGroups.set(group, (incomeGroups.get(group) || 0) + (item.C1_COUNT_TOTAL || 0));
              }
            });
          const incomeTotal = Array.from(incomeGroups.values()).reduce((a, b) => a + b, 0);
          const householdIncome = Array.from(incomeGroups.entries())
            .map(([name, count]) => ({ name, value: incomeTotal > 0 ? (count / incomeTotal) * 100 : 0 }))
            .sort((a, b) => {
              const order = ['$0-$29,999', '$30,000-$59,999', '$60,000-$79,999', '$80,000-$99,999', '$100,000-$149,999', '$150,000-$199,999', '$200,000+'];
              return (order.indexOf(a.name) === -1 ? 999 : order.indexOf(a.name)) - (order.indexOf(b.name) === -1 ? 999 : order.indexOf(b.name));
            });

          // Process Age
          const ageGroups = new Map<string, number>();
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 10 && item.CHARACTERISTIC_ID <= 33 && ![13, 24, 29].includes(item.CHARACTERISTIC_ID))
            .forEach((item: any) => {
              let group = '';
              if ([10, 11, 12].includes(item.CHARACTERISTIC_ID)) group = 'Children (0-14)';
              else if ([14, 15].includes(item.CHARACTERISTIC_ID)) group = 'Youth (15-24)';
              else if ([16, 17, 18, 19].includes(item.CHARACTERISTIC_ID)) group = 'Young Adults (25-44)';
              else if ([20, 21, 22, 23].includes(item.CHARACTERISTIC_ID)) group = 'Middle Age (45-64)';
              else if ([25, 26, 27, 28, 30, 31, 32, 33].includes(item.CHARACTERISTIC_ID)) group = 'Seniors (65+)';
              if (group) {
                ageGroups.set(group, (ageGroups.get(group) || 0) + (item.C1_COUNT_TOTAL || 0));
              }
            });
          const ageTotal = Array.from(ageGroups.values()).reduce((a, b) => a + b, 0);
          const age = Array.from(ageGroups.entries())
            .map(([name, count]) => ({ name, value: ageTotal > 0 ? (count / ageTotal) * 100 : 0 }))
            .sort((a, b) => {
              const order = ['Children (0-14)', 'Youth (15-24)', 'Young Adults (25-44)', 'Middle Age (45-64)', 'Seniors (65+)'];
              return (order.indexOf(a.name) === -1 ? 999 : order.indexOf(a.name)) - (order.indexOf(b.name) === -1 ? 999 : order.indexOf(b.name));
            });

          // Process Education
          const eduGroups = new Map<string, number>();
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 1999 && item.CHARACTERISTIC_ID <= 2013 && ![1998, 2001].includes(item.CHARACTERISTIC_ID))
            .forEach((item: any) => {
              let group = '';
              if (item.CHARACTERISTIC_ID === 1999) group = 'No Certificate';
              else if (item.CHARACTERISTIC_ID === 2000) group = 'High School Diploma';
              else if (item.CHARACTERISTIC_ID === 2002) group = 'Trades/College/University';
              else if (item.CHARACTERISTIC_ID === 2008) group = 'University Degree';
              if (group) {
                eduGroups.set(group, (eduGroups.get(group) || 0) + (item.C1_COUNT_TOTAL || 0));
              }
            });
          const eduTotal = Array.from(eduGroups.values()).reduce((a, b) => a + b, 0);
          const education = Array.from(eduGroups.entries())
            .map(([name, count]) => ({ name, value: eduTotal > 0 ? (count / eduTotal) * 100 : 0 }))
            .sort((a, b) => {
              const order = ['No Certificate', 'High School Diploma', 'Trades/College/University', 'University Degree'];
              return (order.indexOf(a.name) === -1 ? 999 : order.indexOf(a.name)) - (order.indexOf(b.name) === -1 ? 999 : order.indexOf(b.name));
            });

          // Process Ethnicity (Top 10)
          const ethnicityData = chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID > 1698 && item.CHARACTERISTIC_ID < 1949)
            .sort((a: any, b: any) => (b.C1_COUNT_TOTAL || 0) - (a.C1_COUNT_TOTAL || 0))
            .slice(0, 10);
          const ethnicityTotal = ethnicityData.reduce((sum: number, item: any) => sum + (item.C1_COUNT_TOTAL || 0), 0);
          const ethnicity = ethnicityData.map((item: any) => ({
            name: item.CHARACTERISTIC_NAME || '',
            value: ethnicityTotal > 0 ? ((item.C1_COUNT_TOTAL || 0) / ethnicityTotal) * 100 : 0
          }));

          // Process Language (Top 10)
          const languageData = chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID > 395 && item.CHARACTERISTIC_ID < 718 && 
              item.CHARACTERISTIC_NAME && !item.CHARACTERISTIC_NAME.toLowerCase().includes('languages'))
            .sort((a: any, b: any) => (b.C1_COUNT_TOTAL || 0) - (a.C1_COUNT_TOTAL || 0))
            .slice(0, 10);
          const languageTotal = languageData.reduce((sum: number, item: any) => sum + (item.C1_COUNT_TOTAL || 0), 0);
          const language = languageData.map((item: any) => ({
            name: item.CHARACTERISTIC_NAME || '',
            value: languageTotal > 0 ? ((item.C1_COUNT_TOTAL || 0) / languageTotal) * 100 : 0
          }));

          // Process Religion
          const religionData = chartCensusData
            .filter((item: any) => 
              [1950, 1951].includes(item.CHARACTERISTIC_ID) || 
              (item.CHARACTERISTIC_ID >= 1967 && item.CHARACTERISTIC_ID <= 1973)
            );
          const religionTotal = religionData.reduce((sum: number, item: any) => sum + (item.C1_COUNT_TOTAL || 0), 0);
          const religion = religionData
            .map((item: any) => ({
              name: item.CHARACTERISTIC_NAME || '',
              value: religionTotal > 0 ? ((item.C1_COUNT_TOTAL || 0) / religionTotal) * 100 : 0
            }))
            .sort((a, b) => b.value - a.value);

          // Process Occupation
          const occupationMap = new Map<string, number>();
          const occupationLabels: { [key: number]: string } = {
            2249: 'Legislative & Senior Management',
            2250: 'Business, Finance & Administration',
            2251: 'Natural & Applied Sciences',
            2252: 'Health',
            2253: 'Education, Law & Social Services',
            2254: 'Arts, Culture, Recreation & Sport',
            2255: 'Sales & Service',
            2256: 'Trades, Transport & Equipment',
            2257: 'Natural Resources & Agriculture',
            2258: 'Manufacturing & Utilities',
          };
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 2249 && item.CHARACTERISTIC_ID <= 2258)
            .forEach((item: any) => {
              const label = occupationLabels[item.CHARACTERISTIC_ID];
              if (label) {
                occupationMap.set(label, (item.C1_COUNT_TOTAL || 0));
              }
            });
          const occupationTotal = Array.from(occupationMap.values()).reduce((a, b) => a + b, 0);
          const occupation = Array.from(occupationMap.entries())
            .map(([name, count]) => ({ name, value: occupationTotal > 0 ? (count / occupationTotal) * 100 : 0 }))
            .sort((a, b) => b.value - a.value);

          // Process Housing
          const housingMap = new Map<string, number>();
          const housingLabels: { [key: number]: string } = {
            42: 'Single-Detached House',
            43: 'Semi-Detached House',
            44: 'Row House',
            45: 'Apartment in Duplex',
            46: 'Apartment <5 Storeys',
            47: 'Apartment 5+ Storeys',
            48: 'Other Single-Attached House',
            49: 'Movable Dwelling',
          };
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 42 && item.CHARACTERISTIC_ID <= 49)
            .forEach((item: any) => {
              const label = housingLabels[item.CHARACTERISTIC_ID];
              if (label) {
                housingMap.set(label, (item.C1_COUNT_TOTAL || 0));
              }
            });
          const housingTotal = Array.from(housingMap.values()).reduce((a, b) => a + b, 0);
          const housing = Array.from(housingMap.entries())
            .map(([name, count]) => ({ name, value: housingTotal > 0 ? (count / housingTotal) * 100 : 0 }))
            .sort((a, b) => b.value - a.value);

          // Process Commute Method
          const commuteMap = new Map<string, number>();
          const commuteLabels: { [key: number]: string } = {
            2605: 'Driver',
            2606: 'Passenger',
            2607: 'Public Transit',
            2608: 'Walked',
            2609: 'Bicycle',
            2610: 'Other Method',
          };
          chartCensusData
            .filter((item: any) => item.CHARACTERISTIC_ID >= 2605 && item.CHARACTERISTIC_ID <= 2610)
            .forEach((item: any) => {
              const label = commuteLabels[item.CHARACTERISTIC_ID];
              if (label) {
                commuteMap.set(label, (item.C1_COUNT_TOTAL || 0));
              }
            });
          const commuteTotal = Array.from(commuteMap.values()).reduce((a, b) => a + b, 0);
          const commuteMethod = Array.from(commuteMap.entries())
            .map(([name, count]) => ({ name, value: commuteTotal > 0 ? (count / commuteTotal) * 100 : 0 }))
            .sort((a, b) => b.value - a.value);

          // Add chart data to community
          community.chartData = {
            householdIncome: householdIncome.length > 0 ? householdIncome : undefined,
            age: age.length > 0 ? age : undefined,
            education: education.length > 0 ? education : undefined,
            ethnicity: ethnicity.length > 0 ? ethnicity : undefined,
            language: language.length > 0 ? language : undefined,
            religion: religion.length > 0 ? religion : undefined,
            occupation: occupation.length > 0 ? occupation : undefined,
            housing: housing.length > 0 ? housing : undefined,
            commuteMethod: commuteMethod.length > 0 ? commuteMethod : undefined,
          };
        }
      }
    }

    // Fetch places data using a single efficient query
    let places: any[] = [];
    if (data.ListingKey) {
      // Fetch all places for this property in one query
      // Join property_google_master with google_master using Place_ID foreign key
      const { data: placesData, error: placesError } = await supabase
        .from('property_google_master')
        .select(`
          distance_1km,
          Place_ID,
          google_master (
            Name,
            Type
          )
        `)
        .eq('ListingKey', data.ListingKey)
        .gt('distance_1km', 0);

      if (!placesError && placesData && placesData.length > 0) {
        // Map the types to display categories
        const typeMapping: { [key: string]: string } = {
          'grocery_or_supermarket': 'grocery',
          'hospital': 'hospital',
          'park': 'park',
          'library': 'library',
          'bus_station': 'bus_station',
          'gym': 'gym',
        };

        places = placesData
          .filter((item: any) => {
            const type = item.google_master?.Type;
            return type && typeMapping[type];
          })
          .map((item: any) => {
            const distanceKm = item.distance_1km ? (item.distance_1km / 1000.0).toFixed(2) : '0.00';
            return {
              name: item.google_master?.Name || '',
              distance: `${distanceKm} km`,
              type: typeMapping[item.google_master?.Type] || item.google_master?.Type || '',
              dbType: item.google_master?.Type || '',
            };
          });
      }
    }

    // Fetch schools data
    let schools: any[] = [];
    if (data.ListingKey) {
      // Fetch schools - first get property_school_boundaries with school_boundaries
      const { data: psbData, error: psbError } = await supabase
        .from('property_school_boundaries')
        .select(`
          distance_m,
          boundary_id,
          school_boundaries (
            school_name,
            school_id
          )
        `)
        .eq('property_id', data.ListingKey)
        .order('distance_m', { ascending: true });

      if (!psbError && psbData && psbData.length > 0) {
        // Get all school_ids to fetch school details
        const schoolIds = psbData
          .map((item: any) => item.school_boundaries?.school_id)
          .filter(Boolean);
        
        // Fetch school details
        let schoolDetailsMap: { [key: string]: any } = {};
        if (schoolIds.length > 0) {
          const { data: schoolData, error: schoolError } = await supabase
            .from('school')
            .select('id, school_name, fraser_rating, school_level, grade_range, school_language, school_type, school_website, street, city, postal_code')
            .in('id', schoolIds);
          
          if (!schoolError && schoolData) {
            schoolData.forEach((school: any) => {
              schoolDetailsMap[school.id] = school;
            });
          }
        }
        
        // Combine data
        schools = psbData.map((item: any) => {
          const boundary = item.school_boundaries;
          const schoolId = boundary?.school_id;
          const school = schoolId ? schoolDetailsMap[schoolId] : null;
          const distanceKm = item.distance_m ? (item.distance_m / 1000.0).toFixed(2) : '0.00';
          
          // Build full address
          const addressParts = [
            school?.street,
            school?.city,
            school?.postal_code
          ].filter(Boolean);
          const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : undefined;
          
          // Format rating display (e.g., "10" or "9.8" with "of 10")
          let ratingDisplay = undefined;
          if (school?.fraser_rating !== null && school?.fraser_rating !== undefined) {
            const rating = Number(school.fraser_rating);
            ratingDisplay = rating.toFixed(1);
          }
          
          return {
            name: boundary?.school_name || school?.school_name || '',
            distance: `${distanceKm} km`,
            rating: school?.fraser_rating ? Number(school.fraser_rating) : undefined,
            ratingDisplay: ratingDisplay,
            schoolId: schoolId || school?.id || undefined,
            schoolLevel: school?.school_level || undefined,
            gradeRange: school?.grade_range || undefined,
            schoolLanguage: school?.school_language || undefined,
            schoolType: school?.school_type || undefined,
            schoolWebsite: school?.school_website || undefined,
            street: school?.street || undefined,
            city: school?.city || undefined,
            postalCode: school?.postal_code || undefined,
            address: fullAddress,
          };
        });
      }
    }

    // Transform data to match the Property interface
    const property = {
      id: data.id?.toString() || '',
      address: address,
      city: data.City || '',
      area: data.CityRegion || data.CommunityName || '',
      price: data.ListPrice || 0,
      bedrooms: data.BedroomsTotal || 0,
      bathrooms: data.BathroomsTotalInteger || 0,
      squareFeet: data.BuildingAreaTotal || data.LivingArea || data.TotalArea || 0,
        image: mainImage,
        images: mainImages, // All main images
        thumbnails: thumbnails, // Thumbnails for grid
        imageCount: mainImages.length, // Count of unique main images (not including thumbnails)
      daysOnMarket: daysOnMarket,
      listingDate: listingDate,
      listingContractDate: formattedListingContractDate,
      mlsNumber: data.ListingKey || data.ListingId || '',
      propertyType: data.PropertyType || '',
      lotSize: data.LotSizeDimensions || data.LotSizeArea ? 
        `${data.LotSizeArea} ${data.LotSizeAreaUnits || data.LotSizeUnits || ''}`.trim() : '',
      garage: data.GarageParkingSpaces || data.CoveredSpaces || 0,
      parkingTotal: data.ParkingTotal || 0,
      mlsStatus: data.MlsStatus || data.StandardStatus || '',
      statusChange: data.StatusChange || '',
      standardStatus: data.StandardStatus || '',
      transactionType: data.TransactionType || '',
      yearBuilt: data.YearBuilt || (data.ApproximateAge ? (new Date().getFullYear() - data.ApproximateAge) : undefined),
      livingArea: data.LivingAreaRange || undefined,
      basement: basement,
      buildingType: data.PropertySubType || '',
      propertySubType: data.PropertySubType || undefined,
      style: style,
      storeys: data.StoriesTotal || data.Levels || undefined,
      listingAgent: data.ListAgentFullName || data.ListAgentName || '',
      updatedDate: formatDate(data.ModificationTimestamp || ''),
      superMarket: data.MarketConditions || '',
      sellerMarket: data.MarketConditions || '',
      // Additional fields for Overview tab
      tax: data.TaxAnnualAmount ? `$${Number(data.TaxAnnualAmount).toLocaleString()}` : undefined,
      taxYear: data.TaxYear ? Math.floor(Number(data.TaxYear)).toString() : undefined,
      listingNumber: data.ListingKey || data.ListingId || undefined,
      dataSource: data.OriginatingSystemName || data.SourceSystemName || undefined,
      listingBrokerage: data.ListOfficeName || data.ListOfficeFullName || undefined,
      propertyDaysOnMarket: calculatedPropertyDaysOnMarket !== undefined ? calculatedPropertyDaysOnMarket : (data.PropertyDaysOnMarket || undefined),
      frontage: data.LotSizeFrontage || undefined,
      depth: data.LotDepth || undefined,
      lotSizeCode: data.LotSizeUnits || data.LotSizeAreaUnits || undefined,
      lotSizeArea: data.LotSizeArea || undefined,
      crossStreet: data.CrossStreet || undefined,
      frontingOn: data.FrontingOn || undefined,
      municipality: data.Municipality || data.City || undefined,
      construction: (() => {
        if (!data.ConstructionMaterials) return undefined;
        try {
          const constructionArray = typeof data.ConstructionMaterials === 'string'
            ? JSON.parse(data.ConstructionMaterials.replace(/'/g, '"'))
            : data.ConstructionMaterials;
          if (Array.isArray(constructionArray)) {
            return constructionArray.filter((item: any) => item && item.trim() !== '').join(', ');
          }
          return data.ConstructionMaterials;
        } catch {
          return data.ConstructionMaterials;
        }
      })(),
      garageType: data.GarageType || undefined,
      parkingSpaces: data.ParkingSpaces || undefined,
      coveredSpaces: data.CoveredSpaces || undefined,
      totalParkingSpaces: data.ParkingTotal || undefined,
      parkingFeatures: (() => {
        if (!data.ParkingFeatures) return undefined;
        try {
          const featuresArray = typeof data.ParkingFeatures === 'string'
            ? JSON.parse(data.ParkingFeatures.replace(/'/g, '"'))
            : data.ParkingFeatures;
          if (Array.isArray(featuresArray)) {
            return featuresArray.filter((item: any) => item && item.trim() !== '').join(', ');
          }
          return data.ParkingFeatures;
        } catch {
          return data.ParkingFeatures;
        }
      })(),
      bathroomDetails: data.BathroomsTotalInteger ? `${data.BathroomsTotalInteger} Bathrooms` : undefined,
      kitchens: data.KitchensTotal || undefined,
      totalRooms: data.RoomsAboveGrade || undefined,
      familyRoom: data.DenFamilyroomYN === 'Y' || data.DenFamilyroomYN === true ? true : data.DenFamilyroomYN === 'N' || data.DenFamilyroomYN === false ? false : undefined,
      fireplace: data.FireplaceYN === 'Y' || data.FireplaceYN === true ? true : data.FireplaceYN === 'N' || data.FireplaceYN === false ? false : undefined,
      water: data.Water || undefined,
      cooling: cooling || undefined,
      heatingType: data.HeatType || undefined,
      heatingFuel: data.HeatSource || undefined,
      directionFaces: data.DirectionFaces || undefined,
      rooms: rooms.length > 0 ? rooms : undefined,
      listingHistory: listingHistory.length > 0 ? listingHistory : undefined,
      community: community,
      places: places.length > 0 ? places : undefined,
      schools: schools.length > 0 ? schools : undefined,
    };

    return NextResponse.json({ property });
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

