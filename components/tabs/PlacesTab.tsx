"use client";

import { Property } from "@/lib/mockData";
import Tooltip from "@/components/Tooltip";

interface PlacesTabProps {
  property: Property;
}

// Type mapping for display labels
const TYPE_LABELS: { [key: string]: string } = {
  'grocery': 'Grocery',
  'hospital': 'Hospitals',
  'park': 'Park',
  'library': 'Library',
  'bus_station': 'Bus Station',
  'gym': 'Gym',
};

// Type order for consistent display
const TYPE_ORDER = ['grocery', 'hospital', 'park', 'library', 'bus_station', 'gym'];

export default function PlacesTab({ property }: PlacesTabProps) {
  const places = property.places || [];

  // Group places by type
  const placesByType = places.reduce((acc: { [key: string]: typeof places }, place) => {
    if (!acc[place.type]) {
      acc[place.type] = [];
    }
    acc[place.type].push(place);
    return acc;
  }, {});

  return (
    <div>
      {/* Disclaimer */}
      <p className="text-xs text-[#6b7e95] mb-4">
        * Source: Calculation formula is compiled by HouseSigma. This is for educational use only.
      </p>

      {/* Grouped places by type */}
      <div className="space-y-6">
        {TYPE_ORDER.map((type) => {
          const typePlaces = placesByType[type] || [];
          if (typePlaces.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="font-semibold text-gray-900 mb-2">{TYPE_LABELS[type] || type}</h4>
              <div className="divide-y divide-gray-200">
                {typePlaces.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3"
                  >
                    <Tooltip text={`google_master.Name WHERE property_google_master.ListingKey = '${property.mlsNumber}' AND google_master.Type = '${place.dbType || place.type}'`}>
                      <span className="text-sm text-gray-900">{place.name}</span>
                    </Tooltip>
                    <div className="flex items-center gap-3">
                      <Tooltip text={`property_google_master.distance_1km / 1000.0 WHERE ListingKey = '${property.mlsNumber}'`}>
                        <span className="text-sm text-gray-600">{place.distance}</span>
                      </Tooltip>
                      <button
                        className="text-blue-600 hover:text-blue-700 font-semibold text-lg leading-none"
                        aria-label={`Add ${place.name} to favorites`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

