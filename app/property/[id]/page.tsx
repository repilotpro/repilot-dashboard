"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Property } from "@/lib/mockData";
import OverviewTab from "@/components/tabs/OverviewTab";
import ListingHistoryTab from "@/components/tabs/ListingHistoryTab";
import SchoolsTab from "@/components/tabs/SchoolsTab";
import CommunityTab from "@/components/tabs/CommunityTab";
import PlacesTab from "@/components/tabs/PlacesTab";
import ImageCarouselModal from "@/components/ImageCarouselModal";
import Tooltip from "@/components/Tooltip";

type TabType = "overview" | "listing-history" | "comparables" | "schools" | "community" | "places";

export default function PropertyDetailPage() {
  const params = useParams();
  const mlsNumber = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${mlsNumber}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data.property);
      } catch (err: any) {
        setError(err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (mlsNumber) {
      fetchProperty();
    }
  }, [mlsNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">{error || 'Property not found'}</p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "listing-history", label: "Listing History" },
    { id: "comparables", label: "Comparables" },
    { id: "schools", label: "Schools" },
    { id: "community", label: "Community" },
    { id: "places", label: "Places" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Main Content */}
          <div>
            {/* Property Images and Header */}
            <div className="mb-6">
              {/* Images Section - First on mobile, side by side on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Main Image */}
                <div className="order-1 lg:order-1">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div 
                      className="relative w-full aspect-[4/3] bg-gray-200 cursor-pointer"
                      onClick={() => {
                        if (property.images && property.images.length > 0) {
                          setInitialImageIndex(0);
                          setIsImageModalOpen(true);
                        }
                      }}
                    >
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
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </Tooltip>
                      {(property.mlsStatus || property.transactionType) && (
                        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                          {property.mlsStatus && (
                            <Tooltip text="property_data.MlsStatus">
                              <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                                {property.mlsStatus}
                              </div>
                            </Tooltip>
                          )}
                          {property.transactionType && (
                            <Tooltip text="property_data.TransactionType">
                              <div className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium">
                                {property.transactionType}
                              </div>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Grid */}
                <div className="order-2 lg:order-2">
                  <div className="grid grid-cols-2 gap-3 aspect-[4/3]">
                    {(() => {
                      // Use thumbnails if available, otherwise use main images
                      // Skip the first one (index 0) since it's already shown as the main image
                      const totalImageCount = property.imageCount || property.images?.length || 0;
                      let gridImages: string[] = [];
                      
                      if (property.thumbnails && property.thumbnails.length > 0) {
                        // Skip first thumbnail (corresponds to main image) and take next 4
                        // Filter out any empty/null/undefined values
                        gridImages = property.thumbnails.slice(1, 5).filter(img => img && img.trim() !== '');
                        // If we don't have enough thumbnails, fill with main images
                        if (gridImages.length < 4 && property.images && property.images.length > gridImages.length + 1) {
                          const needed = 4 - gridImages.length;
                          const mainImagesToAdd = property.images.slice(gridImages.length + 1, gridImages.length + 1 + needed)
                            .filter(img => img && img.trim() !== '');
                          gridImages = [...gridImages, ...mainImagesToAdd];
                        }
                      } else if (property.images && property.images.length > 1) {
                        // Skip first main image and take next 4
                        // Filter out any empty/null/undefined values
                        gridImages = property.images.slice(1, 5).filter(img => img && img.trim() !== '');
                      }
                      
                      // Ensure we have exactly 4 images for the grid
                      // If we have fewer, fill with placeholders, but never show button on placeholder
                      const displayImages = gridImages.slice(0, 4);
                      // Only show button if we have a real 4th image (index 3) and more than 5 total images
                      const needsButton = totalImageCount > 5 && displayImages.length >= 4 && displayImages[3] && displayImages[3].trim() !== '';
                      
                      // Create array of 4 items (images or placeholders)
                      return Array.from({ length: 4 }).map((_, index) => {
                        const img = displayImages[index];
                        const isLastWithButton = index === 3 && needsButton;
                        
                        // Calculate the actual image index in the full images array
                        // Grid shows images 2-5 (indices 1-4 in the images array)
                        const actualImageIndex = index + 1;
                        
                        return (
                          <div 
                            key={index} 
                            className="relative w-full h-full overflow-hidden rounded-lg bg-gray-200 cursor-pointer"
                            onClick={() => {
                              if (property.images && property.images.length > 0) {
                                setInitialImageIndex(actualImageIndex);
                                setIsImageModalOpen(true);
                              }
                            }}
                          >
                            {img ? (
                              <>
                                <Tooltip text="media.MediaURL" className="block h-full w-full">
                                  <Image
                                    src={img}
                                    alt={`${property.address} - Image ${index + 2}`}
                                    fill
                                    className="object-cover"
                                  />
                                </Tooltip>
                                {isLastWithButton && (
                                  <div 
                                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (property.images && property.images.length > 0) {
                                        setIsImageModalOpen(true);
                                      }
                                    }}
                                  >
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (property.images && property.images.length > 0) {
                                          setInitialImageIndex(actualImageIndex);
                                          setIsImageModalOpen(true);
                                        }
                                      }}
                                      className="bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-600 transition-colors"
                                    >
                                      See all {totalImageCount} photos
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Text Content Section - Below images on mobile, aligned on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ overflow: 'visible' }}>
                {/* Property Header Info - Left side on desktop */}
                <div className="order-3 lg:order-1" style={{ overflow: 'visible' }}>
                  <Tooltip text="property_data.UnparsedAddress (or StreetNumber, StreetName, City)">
                    <h1 className="text-xl font-semibold text-gray-900 mb-1">
                      {property.address} {property.city}
                      {property.area && `- ${property.area}`}
                    </h1>
                  </Tooltip>
                  {property.buildingType && (
                    <Tooltip text="property_data.PropertySubType">
                      <p className="text-base text-gray-700 mb-3">{property.buildingType}</p>
                    </Tooltip>
                  )}
                  <div className="flex items-center gap-6">
                    <Tooltip text="property_data.BedroomsTotal">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm">
                          {property.bedrooms > 4 ? `${property.bedrooms}+` : property.bedrooms} Bedrooms
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip text="property_data.BathroomsTotalInteger">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span className="text-sm">{property.bathrooms} Bathrooms</span>
                      </div>
                    </Tooltip>
                    <Tooltip text={property.parkingTotal ? "property_data.ParkingTotal" : "property_data.GarageParkingSpaces"}>
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                        <span className="text-sm">
                          {property.parkingTotal ? `${property.parkingTotal} Parking` : property.garage ? `${property.garage} Garage` : 'No Parking'}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                {/* Price and Days on Market - Right side on desktop */}
                <div className="order-4 lg:order-2 text-left lg:text-right" style={{ overflow: 'visible' }}>
                  <Tooltip text="property_data.ListPrice">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      Listed for:$ {property.price.toLocaleString()}
                    </p>
                  </Tooltip>
                  <Tooltip text="property_data.ListingContractDate (calculated)">
                    <p className="text-sm text-gray-600">
                      Listed {property.daysOnMarket} days ago
                    </p>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && <OverviewTab property={property} />}
                {activeTab === "listing-history" && (
                  <ListingHistoryTab property={property} />
                )}
                {activeTab === "schools" && <SchoolsTab property={property} />}
                {activeTab === "community" && <CommunityTab property={property} />}
                {activeTab === "places" && <PlacesTab property={property} />}
                {activeTab === "comparables" && (
                  <div className="text-gray-600">Comparables content coming soon...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {property && property.images && property.images.length > 0 && (
        <ImageCarouselModal
          images={property.images}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          initialIndex={initialImageIndex}
        />
      )}
    </div>
  );
}

