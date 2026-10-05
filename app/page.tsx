"use client";

import { useState, useEffect, useRef } from "react";
import PropertyCard from "@/components/PropertyCard";
import { fetchJson } from "@/lib/fetchJson";
import { Property } from "@/lib/mockData";

function FilterActions({
  expanded,
  loading,
  onToggle,
  onSearch,
  onClear,
}: {
  expanded: boolean;
  loading: boolean;
  onToggle: () => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <button type="button" onClick={onToggle} className="text-sm font-extrabold text-[#245f92]">
        {expanded ? "Fewer filters" : "More filters"}
      </button>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onClear} className="text-sm font-bold text-[#68788d]">
          Clear
        </button>
        <button type="button" onClick={onSearch} disabled={loading} className="btn-primary">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreInFlight = useRef(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
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
    let active = true;

    const fetchFilterOptions = async () => {
      try {
        const { ok, data } = await fetchJson<{
          stateOrProvince?: string[];
          cities?: string[];
          transactionTypes?: string[];
          propertySubTypes?: string[];
        }>("/api/filter-options");
        if (!active || !ok) return;
        setFilterOptions({
          stateOrProvince: data.stateOrProvince || [],
          cities: data.cities || [],
          transactionTypes: data.transactionTypes || [],
          propertySubTypes: data.propertySubTypes || [],
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        if (active) setLoadingOptions(false);
      }
    };

    void fetchFilterOptions();
    return () => {
      active = false;
    };
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
    if (loadMore && loadMoreInFlight.current) return;

    const currentOffset = loadMore ? offset : 0;
    
    if (loadMore) {
      loadMoreInFlight.current = true;
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

      const { ok, status, data } = await fetchJson<{
        properties?: Property[];
        error?: string;
        details?: string;
      }>(url);

      console.log('API Response:', {
        ok,
        status,
        propertiesCount: data.properties?.length || 0,
        hasError: !!data.error,
        error: data.error
      });

      if (ok) {
        const propertiesList = data.properties || [];
        console.log('Setting properties:', propertiesList.length);
        
        if (loadMore) {
          setProperties(prev => {
            const seen = new Set(prev.map((property) => property.id));
            const next = propertiesList.filter((property: Property) => !seen.has(property.id));
            return next.length > 0 ? [...prev, ...next] : prev;
          });
        } else {
          setProperties(propertiesList);
        }
        
        // Store query info for developer visibility
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
      if (loadMore) loadMoreInFlight.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void fetchProperties(false);
    // Default Active search runs once on entry. Later searches go through Search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    void fetchProperties(false);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    fetchProperties(true);
  };

  const fieldClass = "field";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#2b95b8]">
          Listings
        </p>
        <h1 className="mb-6 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#10233f]">
          Search homes that fit the move.
        </h1>
        <div className="glass-card mb-8 p-6">
          {/* Default (Collapsed) Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="field-label">
              State/Province
              <select
                value={filters.stateOrProvince}
                onChange={(e) => handleFilterChange("stateOrProvince", e.target.value)}
                disabled={loadingOptions}
                className={fieldClass}
              >
                <option value="">All</option>
                {filterOptions.stateOrProvince.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>

            <label className="field-label">
              City
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Search city..."
                className={`${fieldClass} normal-case tracking-normal font-medium`}
              />
            </label>

            <label className="field-label">
              Transaction Type
              <select
                value={filters.transactionType}
                onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                disabled={loadingOptions}
                className={fieldClass}
              >
                <option value="">All</option>
                {filterOptions.transactionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Property Sub Type
              <select
                value={filters.propertySubType}
                onChange={(e) => handleFilterChange("propertySubType", e.target.value)}
                disabled={loadingOptions}
                className={fieldClass}
              >
                <option value="">All</option>
                {filterOptions.propertySubTypes.map((subType) => (
                  <option key={subType} value={subType}>{subType}</option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Property Type
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                className={fieldClass}
              >
                <option value="">All</option>
                <option value="Residential Freehold">Residential Freehold</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential Condo & Other">Residential Condo & Other</option>
              </select>
            </label>

            <label className="field-label">
              Bedrooms
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className={fieldClass}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </label>

            <label className="field-label">
              Bathrooms
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                className={fieldClass}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </label>

            <label className="field-label">
              Status
              <select
                value={filters.statusChange}
                onChange={(e) => handleFilterChange("statusChange", e.target.value)}
                className={fieldClass}
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
            </label>
          </div>

          {!isExpanded && (
            <FilterActions
              expanded={false}
              loading={loading}
              onToggle={() => setIsExpanded(true)}
              onSearch={handleSearch}
              onClear={clearFilters}
            />
          )}

          {/* Expanded Fields - continue in the same grid */}
          {isExpanded && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className="field-label">
                  Garage/Covered Parking
                  <select
                    value={filters.parkingTotal}
                    onChange={(e) => handleFilterChange("parkingTotal", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </label>

                <div className="relative">
                  <span className="field-label">Basement</span>
                  <button
                    type="button"
                    onClick={() => setBasementDropdownOpen(!basementDropdownOpen)}
                    className="field mt-2 flex items-center justify-between text-left font-medium normal-case tracking-normal"
                  >
                    <span className={filters.basement.length === 0 ? "text-[#6b7e95]" : "text-[#10233f]"}>
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
                      <div className="absolute z-20 mt-1 w-full rounded-xl border border-[rgba(21,45,78,0.14)] bg-white shadow-lg">
                        <div className="py-1">
                          {['Finished', 'Separate Entrance', 'Walk-Out'].map((option) => (
                            <label
                              key={option}
                              className="flex cursor-pointer items-center px-3 py-2 hover:bg-[#f4f8fb]"
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
                              <span className="text-sm text-[#10233f]">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <label className="field-label">
                  Price range
                  <span className="flex gap-2 normal-case tracking-normal">
                    <input
                      type="text"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      placeholder="Min"
                      className={`${fieldClass} font-medium`}
                    />
                    <input
                      type="text"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      placeholder="Max"
                      className={`${fieldClass} font-medium`}
                    />
                  </span>
                </label>
              </div>

              <FilterActions
                expanded
                loading={loading}
                onToggle={() => setIsExpanded(false)}
                onSearch={handleSearch}
                onClear={clearFilters}
              />
            </>
          )}
        </div>

        {loading && !loadingMore ? (
          <div className="py-14 text-center">
            <p className="text-sm font-semibold text-[#5d6f87]">Looking through listings…</p>
          </div>
        ) : !hasSearched ? (
          <div className="rounded-[20px] border border-dashed border-[rgba(21,45,78,0.18)] px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[#10233f]">Set a few filters and search.</p>
            <p className="mt-2 text-sm text-[#5d6f87]">City, price, and bedrooms are enough to start.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[rgba(21,45,78,0.18)] px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[#10233f]">Nothing matched those filters.</p>
            <p className="mt-2 text-sm text-[#5d6f87]">Widen the price or city and search again.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="btn-primary">
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
