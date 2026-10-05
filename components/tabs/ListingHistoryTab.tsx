"use client";

import { Property } from "@/lib/mockData";

interface ListingHistoryTabProps {
  property: Property;
}

export default function ListingHistoryTab({ property }: ListingHistoryTabProps) {
  const listingHistory = property.listingHistory || [];

  if (listingHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">There is no history for this property.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listing Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiration Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              List Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listing ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listingHistory.map((listing, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {listing.dateStart}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {listing.dateEnd || "-"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                ${listing.price.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {listing.event}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {listing.listingId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

