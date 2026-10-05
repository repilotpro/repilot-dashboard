"use client";

import { Property } from "@/lib/mockData";

interface ListingHistoryTabProps {
  property: Property;
}

export default function ListingHistoryTab({ property }: ListingHistoryTabProps) {
  const listingHistory = property.listingHistory || [];

  if (listingHistory.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[#5d6f87]">There is no history for this property.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[rgba(21,45,78,0.1)]">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7e95]">
              Listing Date
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7e95]">
              Expiration Date
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7e95]">
              List Price
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7e95]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7e95]">
              Listing ID
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(21,45,78,0.1)]">
          {listingHistory.map((listing, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#10233f]">
                {listing.dateStart}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#10233f]">
                {listing.dateEnd || "-"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#10233f]">
                ${listing.price.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#10233f]">
                {listing.event}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#10233f]">
                {listing.listingId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

