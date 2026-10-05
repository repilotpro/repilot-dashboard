import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/mockData";

interface PropertyCardProps {
  property: Property;
}

// Tooltip component with multi-line support and ability to extend beyond card
const Tooltip = ({ children, text, className = "" }: { children: React.ReactNode; text: string; className?: string }) => {
  return (
    <div className={`group relative ${className}`}>
      {children}
      <div className="invisible group-hover:visible absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px', width: 'max-content' }}>
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link 
      href={`/property/${property.mlsNumber || property.id}`} 
      className="block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200" style={{ overflow: 'visible' }}>
        <div className="relative h-56 w-full bg-gray-200 rounded-t-lg">
          <div className="absolute inset-0 overflow-hidden rounded-t-lg">
            <Tooltip text="media.MediaURL" className="block h-full w-full">
              {property.image ? (
                <Image
                  src={property.image}
                  alt={property.address}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </Tooltip>
          </div>
          {/* Status badges - positioned at bottom left of image */}
          <div className="absolute bottom-2 left-2 flex flex-row gap-1 z-20">
            {/* Status change badge - shows New, Price Change, etc. */}
            {property.statusChange && (
              <div className="group/status relative">
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {property.statusChange}
                </div>
                <div className="invisible group-hover/status:visible absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px', width: 'max-content' }}>
                  property_data.StatusChange
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
            {/* MlsStatus badge */}
            {property.mlsStatus && (
              <div className="group/mls relative">
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {property.mlsStatus}
                </div>
                <div className="invisible group-hover/mls:visible absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px', width: 'max-content' }}>
                  property_data.MlsStatus
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
            {/* TransactionType badge */}
            {property.transactionType && (
              <div className="group/trans relative">
                <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {property.transactionType}
                </div>
                <div className="invisible group-hover/trans:visible absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px', width: 'max-content' }}>
                  property_data.TransactionType
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>
          {/* Image count badge - positioned at bottom right of image */}
          {property.imageCount && property.imageCount > 0 && (
            <div className="absolute bottom-2 right-2 z-20">
              <div className="group/count relative">
                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {property.imageCount}
                </div>
                <div className="invisible group-hover/count:visible absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px', width: 'max-content' }}>
                  media.MediaURL (count - main images only, excluding thumbnails)
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-5">
          {(property.mlsNumber || property.listingContractDate) && (
            <div className="flex justify-between items-center mb-1">
              {property.mlsNumber && (
                <Tooltip text="property_data.ListingKey" className="inline-block">
                  <p className="text-xs text-gray-500 cursor-help">
                    {property.mlsNumber}
                  </p>
                </Tooltip>
              )}
              {property.listingContractDate && (
                <Tooltip text="property_data.ListingContractDate" className="inline-block">
                  <p className="text-xs text-gray-500 cursor-help">
                    {(() => {
                      try {
                        const date = new Date(property.listingContractDate);
                        return isNaN(date.getTime()) ? property.listingContractDate : date.toLocaleDateString();
                      } catch {
                        return property.listingContractDate;
                      }
                    })()}
                  </p>
                </Tooltip>
              )}
            </div>
          )}
          <Tooltip text="property_data.UnparsedAddress (or StreetNumber + StreetDirPrefix + StreetName + StreetSuffix + StreetDirSuffix)" className="block">
            <h3 className="text-base font-semibold text-gray-900 mb-1 cursor-help">
              {property.address}
            </h3>
          </Tooltip>
          <Tooltip text="property_data.City" className="block">
            <p className="text-sm text-gray-600 mb-3 cursor-help">{property.city}</p>
          </Tooltip>
          <Tooltip text="property_data.ListPrice" className="block">
            <p className="text-2xl font-bold text-blue-600 mb-3 cursor-help">
              ${property.price.toLocaleString()}
            </p>
          </Tooltip>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <Tooltip text="property_data.BedroomsTotal" className="inline-block">
              <span className="cursor-help">{property.bedrooms} Beds</span>
            </Tooltip>
            <Tooltip text="property_data.BathroomsTotalInteger" className="inline-block">
              <span className="cursor-help">{property.bathrooms} Baths</span>
            </Tooltip>
            <Tooltip text="property_data.ParkingTotal" className="inline-block">
              <span className="cursor-help">{property.parkingTotal || 0} Parking</span>
            </Tooltip>
          </div>
        </div>
      </div>
    </Link>
  );
}

