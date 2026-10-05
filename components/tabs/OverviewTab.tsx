"use client";

import { useState } from "react";
import { Property } from "@/lib/mockData";
import Tooltip from "@/components/Tooltip";

interface OverviewTabProps {
  property: Property;
}

type SubTabType = "key-facts" | "details" | "rooms";

export default function OverviewTab({ property }: OverviewTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("key-facts");

  const subTabs: { id: SubTabType; label: string }[] = [
    { id: "key-facts", label: "Key Facts" },
    { id: "details", label: "Details" },
    { id: "rooms", label: "Rooms" },
  ];

  return (
    <div>
      {/* Sub-tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Sub Tabs">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-tab Content */}
      <div>
        {activeSubTab === "key-facts" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key facts for {property.address}, {property.area || property.city}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Key Facts */}
              <div className="w-full">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {property.tax ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.TaxAnnualAmount / property_data.TaxYear">
                            <span>Tax:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.TaxAnnualAmount / property_data.TaxYear">
                            {property.tax}{property.taxYear ? ` / ${property.taxYear}` : ""}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.PropertySubType">
                          <span>Property Type:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.PropertySubType">
                          {property.propertySubType || ""}
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.YearBuilt or property_data.ApproximateAge">
                          <span>Building Age:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.YearBuilt or property_data.ApproximateAge">
                          {property.yearBuilt ? `${new Date().getFullYear() - property.yearBuilt} years` : "-"}
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.LivingAreaRange">
                          <span>Size:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.LivingAreaRange">
                          {property.livingArea || ""}
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.LotSizeArea">
                          <span>Lot Size:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.LotSizeArea">
                          {property.lotSizeArea || ""}
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.GarageType, property_data.ParkingSpaces, property_data.CoveredSpaces, property_data.ParkingTotal">
                          <span>Parking:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.GarageType, property_data.ParkingSpaces, property_data.CoveredSpaces, property_data.ParkingTotal">
                          {[
                            property.garageType,
                            property.parkingSpaces !== undefined ? `${property.parkingSpaces} Parking Spaces` : null,
                            property.coveredSpaces !== undefined ? `${property.coveredSpaces} Covered Spaces` : null,
                            property.totalParkingSpaces !== undefined ? `Total ${property.totalParkingSpaces} Parking` : null
                          ].filter(Boolean).join(", ")}
                        </Tooltip>
                      </td>
                    </tr>
                    {property.parkingFeatures ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ParkingFeatures">
                            <span>Parking Features:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ParkingFeatures">
                            {property.parkingFeatures}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    {property.basement ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.Basement">
                            <span>Basement:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.Basement">
                            {property.basement}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Right Column: Details */}
              <div className="w-full">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {property.listingNumber ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ListingKey or property_data.ListingId">
                            <span>Listing#:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ListingKey or property_data.ListingId">
                            {property.listingNumber}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    {property.dataSource ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.OriginatingSystemName or property_data.SourceSystemName">
                            <span>Data Source:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.OriginatingSystemName or property_data.SourceSystemName">
                            {property.dataSource}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    {property.predictedDaysOnMarket !== undefined ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <span>Predicted Days on Market:</span>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Fast</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{
                                    width: `${((60 - property.predictedDaysOnMarket) / 40) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">Very Slow</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{property.predictedDaysOnMarket} days</p>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                    {property.listingBrokerage ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ListOfficeName or property_data.ListOfficeFullName">
                            <span>Listing Brokerage:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ListOfficeName or property_data.ListOfficeFullName">
                            {property.listingBrokerage}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.propertyDaysOnMarket">
                          <span>Days on Market:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.propertyDaysOnMarket">
                          {property.propertyDaysOnMarket} days
                        </Tooltip>
                      </td>
                    </tr>
                    {property.propertyDaysOnMarket !== undefined ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ListingContractDate">
                            <span>Property Days on Market:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ListingContractDate">
                            {property.propertyDaysOnMarket} days
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    {property.statusChange ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.StatusChange">
                            <span>Status Change:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.StatusChange">
                            {property.statusChange}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                        <Tooltip text="property_data.ListingContractDate">
                          <span>Listed on:</span>
                        </Tooltip>
                      </td>
                      <td className="py-2 text-sm text-gray-900">
                        <Tooltip text="property_data.ListingContractDate">
                          {property.listingDate}
                        </Tooltip>
                      </td>
                    </tr>
                    {property.updatedDate ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ModificationTimestamp">
                            <span>Updated on:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ModificationTimestamp">
                            {property.updatedDate}
                          </Tooltip>
                        </td>
                      </tr>
                    ) : null}
                    {property.marketDemand ? (
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <span>Market Demand:</span>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Buyer's Market</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{
                                    width: property.marketDemand === "Balanced" ? "50%" : property.marketDemand === "Seller's Market" ? "75%" : "25%",
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">Seller's Market</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{property.marketDemand}</p>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "details" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Property listed for ${property.price.toLocaleString()} on {property.listingDate}
            </h3>
            <div className="space-y-6" style={{ overflow: 'visible' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Property, Inside, Utilities */}
                <div className="w-full">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">

                      {/* Property Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Property</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.PropertySubType">
                            <span>Type:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.PropertySubType">
                            {property.propertySubType || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ArchitecturalStyle">
                            <span>Style:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ArchitecturalStyle">
                            {property.style || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.FrontingOn">
                            <span>Fronting on:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.DirectionFaces">
                            {property.directionFaces || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.CityRegion or property_data.CommunityName">
                            <span>Community:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.CityRegion or property_data.CommunityName">
                            {property.area || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.Municipality or property_data.City">
                            <span>Municipality:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.Municipality or property_data.City">
                            {property.municipality || ""}
                          </Tooltip>
                        </td>
                      </tr>

                      {/* Inside Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Inside</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.BedroomsTotal">
                            <span>Bedrooms:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.BedroomsTotal">
                            {property.bedrooms !== undefined ? property.bedrooms : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.BathroomsTotalInteger">
                            <span>Bathrooms:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.BathroomsTotalInteger">
                            {property.bathrooms !== undefined ? property.bathrooms : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.BathroomsTotalInteger">
                            <span>Bathroom Details:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.BathroomsTotalInteger">
                            {property.bathroomDetails || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.Basement">
                            <span>Basement Type:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.Basement">
                            {property.basement || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.KitchensTotal">
                            <span>Kitchens:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.KitchensTotal">
                            {property.kitchens !== undefined ? property.kitchens : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.RoomsAboveGrade">
                            <span>Rooms:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.RoomsAboveGrade">
                            {property.totalRooms !== undefined ? property.totalRooms : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.DenFamilyroomYN">
                            <span>Family Room:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.DenFamilyroomYN">
                            {property.familyRoom !== undefined ? (property.familyRoom ? "Yes" : "No") : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.FireplaceYN">
                            <span>Fireplace:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.FireplaceYN">
                            {property.fireplace !== undefined ? (property.fireplace ? "Yes" : "No") : ""}
                          </Tooltip>
                        </td>
                      </tr>

                      {/* Utilities Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Utilities</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.Water">
                            <span>Water:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.Water">
                            {property.water || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.Cooling">
                            <span>Cooling:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.Cooling">
                            {property.cooling || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.HeatType">
                            <span>Heating Type:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.HeatType">
                            {property.heatingType || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.HeatSource">
                            <span>Heating Fuel:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.HeatSource">
                            {property.heatingFuel || ""}
                          </Tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Column: Building, Parking, Land */}
                <div className="w-full">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">

                      {/* Building Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Building</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.LivingAreaRange">
                            <span>Size:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.LivingAreaRange">
                            {property.livingArea || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ConstructionMaterials">
                            <span>Construction:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ConstructionMaterials">
                            {property.construction || ""}
                          </Tooltip>
                        </td>
                      </tr>

                      {/* Parking Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Parking</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.GarageType">
                            <span>Garage Type:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.GarageType">
                            {property.garageType || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.GarageParkingSpaces or property_data.CoveredSpaces">
                            <span>Garage:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.GarageParkingSpaces or property_data.CoveredSpaces">
                            {property.garage || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ParkingSpaces">
                            <span>Parking Spaces:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ParkingSpaces">
                            {property.parkingSpaces !== undefined ? property.parkingSpaces : ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.ParkingTotal">
                            <span>Total Parking Spaces:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.ParkingTotal">
                            {property.totalParkingSpaces !== undefined ? property.totalParkingSpaces : ""}
                          </Tooltip>
                        </td>
                      </tr>

                      {/* Land Section */}
                      <tr>
                        <td colSpan={2} className="py-2 font-bold text-gray-900">Land</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.SewerType or property_data.Sewer">
                            <span>Sewer:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.SewerType or property_data.Sewer">
                            {property.sewer || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.LotDepth">
                            <span>Depth:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.LotDepth">
                            {property.depth || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.LotSizeFrontage">
                            <span>Frontage:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.LotSizeFrontage">
                            {property.frontage || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.LotSizeArea">
                            <span>Lot Size:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.LotSizeArea">
                            {property.lotSizeArea || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.LotSizeUnits or property_data.LotSizeAreaUnits">
                            <span>Lot Size Unit:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.LotSizeUnits or property_data.LotSizeAreaUnits">
                            {property.lotSizeCode || ""}
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-8 text-sm text-gray-600 align-top">
                          <Tooltip text="property_data.CrossStreet">
                            <span>Cross Street:</span>
                          </Tooltip>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          <Tooltip text="property_data.CrossStreet">
                            {property.crossStreet || ""}
                          </Tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "rooms" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Room details for {property.address}, {property.city} Listed for ${property.price.toLocaleString()} on {property.listingDate}
            </h3>
            {property.rooms && property.rooms.length > 0 ? (
              <div className="overflow-x-auto" style={{ overflow: 'visible' }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Tooltip text="property_rooms.RoomDescription">
                          Key Room Name
                        </Tooltip>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Tooltip text="property_rooms.RoomLevel">
                          Level
                        </Tooltip>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Tooltip text="property_rooms.RoomFeature1, RoomFeature2, RoomFeature3">
                          Features
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {property.rooms.map((room, index) => (
                      <tr key={index} className="bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <Tooltip text="property_rooms.RoomDescription">
                            <p className="font-semibold text-base">{room.name}</p>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <Tooltip text="property_rooms.RoomLevel">
                            {room.level}
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <Tooltip text="property_rooms.RoomFeature1, RoomFeature2, RoomFeature3">
                            {room.features || '-'}
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No room details available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}