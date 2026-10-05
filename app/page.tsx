"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/lib/mockData";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [queryInfo, setQueryInfo] = useState<any>(null);
  const [showQueryInfo, setShowQueryInfo] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [basementDropdownOpen, setBasementDropdownOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    stateOrProvince: [] as string[],
    cities: [] as string[],
    transactionTypes: [] as string[],
    propertySubTypes: [] as string[],
  });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [filters, setFilters] = useState({
    stateOrProvince: "",
    city: "",
    transactionType: "",
    propertySubType: "",
    // Expanded fields
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    priceMin: "",
    priceMax: "",
    parkingTotal: "",
    basement: [] as string[],
    statusChange: "Active",
  });

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filter-options');
        const data = await response.json();
        if (response.ok) {
          setFilterOptions({
            stateOrProvince: data.stateOrProvince || [],
            cities: data.cities || [],
            transactionTypes: data.transactionTypes || [],
            propertySubTypes: data.propertySubTypes || [],
          });
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchFilterOptions();
  }, []);

  const clearFilters = () => {
    setFilters({
      stateOrProvince: "",
      city: "",
      transactionType: "",
      propertySubType: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      parkingTotal: "",
      basement: [],
      statusChange: "Active",
    });
    setProperties([]);
    setHasSearched(false);
    setOffset(0);
    setHasMore(false);
  };

  // Fetch properties from API
  const fetchProperties = async (loadMore = false) => {
    const currentOffset = loadMore ? offset : 0;
    
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setOffset(0);
    }
    
    try {
      const params = new URLSearchParams();
      
      // Default fields
      if (filters.stateOrProvince) params.append('stateOrProvince', filters.stateOrProvince);
      if (filters.city) params.append('city', filters.city);
      if (filters.transactionType) params.append('transactionType', filters.transactionType);
      if (filters.propertySubType) params.append('propertySubType', filters.propertySubType);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      
      // Expanded fields
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.parkingTotal) params.append('parkingTotal', filters.parkingTotal);
      if (filters.basement.length > 0) params.append('basement', filters.basement.join(','));
      if (filters.statusChange) params.append('statusChange', filters.statusChange);
      
      // Add pagination
      params.append('limit', '20');
      params.append('offset', currentOffset.toString());

      const url = `/api/properties?${params.toString()}`;
      console.log('Fetching properties from:', url);
      console.log('Active filters:', filters);

      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', {
        ok: response.ok,
        status: response.status,
        propertiesCount: data.properties?.length || 0,
        hasError: !!data.error,
        error: data.error
      });

      if (response.ok) {
        const propertiesList = data.properties || [];
        console.log('Setting properties:', propertiesList.length);
        
        if (loadMore) {
          setProperties(prev => [...prev, ...propertiesList]);
        } else {
          setProperties(propertiesList);
        }
        
        // Store query info for developer visibility
        if (data.queryInfo) {
          setQueryInfo(data.queryInfo);
        }
        
        setHasMore(propertiesList.length === 20);
        setOffset(currentOffset + propertiesList.length);
        setHasSearched(true);
      } else {
        console.error('Failed to fetch properties:', data.error, data.details);
        if (!loadMore) {
          setProperties([]);
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      if (!loadMore) {
        setProperties([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchProperties(false);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    fetchProperties(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Default (Collapsed) Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <select
                value={filters.stateOrProvince}
                onChange={(e) => handleFilterChange("stateOrProvince", e.target.value)}
                disabled={loadingOptions}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">All</option>
                {filterOptions.stateOrProvince.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Search city..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                value={filters.transactionType}
                onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                disabled={loadingOptions}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">All</option>
                {filterOptions.transactionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Sub Type
              </label>
              <select
                value={filters.propertySubType}
                onChange={(e) => handleFilterChange("propertySubType", e.target.value)}
                disabled={loadingOptions}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">All</option>
                {filterOptions.propertySubTypes.map((subType) => (
                  <option key={subType} value={subType}>{subType}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Residential Freehold">Residential Freehold</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential Condo & Other">Residential Condo & Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.statusChange}
                onChange={(e) => handleFilterChange("statusChange", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="">All</option>
                <option value="Suspended">Suspended</option>
                <option value="New">New</option>
                <option value="Deal Fell Through">Deal Fell Through</option>
                <option value="Sold">Sold</option>
                <option value="Expired">Expired</option>
                <option value="Sold Conditional">Sold Conditional</option>
                <option value="Price Change">Price Change</option>
                <option value="Leased">Leased</option>
                <option value="Extension">Extension</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Action buttons at the bottom when collapsed */}
          {!isExpanded && (
            <div className="flex gap-4 mt-6 items-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show More Filters
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Clear All
              </button>
              {queryInfo && (
                <button
                  onClick={() => setShowQueryInfo(!showQueryInfo)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium ml-auto"
                >
                  {showQueryInfo ? 'Hide' : 'Show'} Query Info
                </button>
              )}
            </div>
          )}

          {/* Expanded Fields - continue in the same grid */}
          {isExpanded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garage/Covered Parking
                  </label>
                  <select
                    value={filters.parkingTotal}
                    onChange={(e) => handleFilterChange("parkingTotal", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Basement
                  </label>
                  <button
                    type="button"
                    onClick={() => setBasementDropdownOpen(!basementDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                  >
                    <span className={filters.basement.length === 0 ? "text-gray-500" : "text-gray-900"}>
                      {filters.basement.length === 0
                        ? "Any"
                        : filters.basement.length === 1
                        ? filters.basement[0]
                        : `${filters.basement.length} selected`}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${basementDropdownOpen ? "transform rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {basementDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setBasementDropdownOpen(false)}
                      ></div>
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="py-1">
                          {['Finished', 'Separate Entrance', 'Walk-Out'].map((option) => (
                            <label
                              key={option}
                              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={filters.basement.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleFilterChange("basement", [...filters.basement, option]);
                                  } else {
                                    handleFilterChange("basement", filters.basement.filter((b) => b !== option));
                                  }
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

              </div>

              {/* Action buttons at the bottom when expanded */}
              <div className="flex gap-4 mt-6 items-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Show Less
                </button>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear All
                </button>
                {queryInfo && (
                  <button
                    onClick={() => setShowQueryInfo(!showQueryInfo)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium ml-auto"
                  >
                    {showQueryInfo ? 'Hide' : 'Show'} Query Info
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Query Info Panel for Developers */}
        {showQueryInfo && queryInfo && (
          <div className="bg-gray-900 text-green-400 rounded-lg shadow-lg p-6 mb-8 font-mono text-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-400">Database Query Information</h3>
              <button
                onClick={() => setShowQueryInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-yellow-400 mb-2">Main Query:</div>
                <pre className="bg-black p-4 rounded overflow-x-auto text-xs">
                  {queryInfo.sql}
                </pre>
              </div>
              
              <div>
                <div className="text-yellow-400 mb-2">Media Query:</div>
                <pre className="bg-black p-4 rounded overflow-x-auto text-xs">
                  {queryInfo.mediaQuery}
                </pre>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 mb-1">Filters Applied:</div>
                  <div className="text-gray-300">
                    {queryInfo.filters.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {queryInfo.filters.map((filter: string, idx: number) => (
                          <li key={idx}>{filter}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-yellow-400 mb-1">Pagination:</div>
                  <div className="text-gray-300">
                    Limit: {queryInfo.pagination.limit}<br />
                    Offset: {queryInfo.pagination.offset}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Listings Grid */}
        {!hasSearched ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Use the filters above to search for properties.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">No properties found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ overflow: 'visible' }}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
