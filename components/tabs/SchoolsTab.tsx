"use client";

import { useState } from "react";
import { Property, School } from "@/lib/mockData";
import Tooltip from "@/components/Tooltip";

interface SchoolsTabProps {
  property: Property;
}

export default function SchoolsTab({ property }: SchoolsTabProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const schools = property.schools || [];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="overflow-visible">
      <div>
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#10233f] mb-2">
          Schools In-Boundary
        </h3>
        <p className="text-sm text-[#5d6f87] mb-4">
          Schools for {property.address}, {property.area || property.city}
        </p>
        <div className="space-y-3 overflow-visible">
          {schools.length > 0 ? (
            schools.map((school, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[rgba(21,45,78,0.12)] overflow-visible relative"
              >
                {/* School Header Row */}
                <div
                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rating Circle - Smaller */}
                    {school.ratingDisplay !== undefined ? (
                      <Tooltip text={`school.fraser_rating WHERE school.id = '${school.schoolId}'`}>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex flex-col items-center justify-center cursor-help">
                          <span className="text-sm font-bold text-blue-900">{school.ratingDisplay}</span>
                          <span className="text-[10px] text-blue-700">of 10</span>
                        </div>
                      </Tooltip>
                    ) : school.rating !== undefined ? (
                      <Tooltip text={`school.fraser_rating WHERE school.id = '${school.schoolId}'`}>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex flex-col items-center justify-center cursor-help">
                          <span className="text-sm font-bold text-blue-900">{school.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-blue-700">of 10</span>
                        </div>
                      </Tooltip>
                    ) : null}
                    {/* School Name */}
                    <Tooltip text={`school_boundaries.school_name WHERE property_school_boundaries.property_id = '${property.mlsNumber}'`}>
                      <span className="font-medium text-gray-900">{school.name}</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tooltip text={`property_school_boundaries.distance_m / 1000.0 WHERE property_id = '${property.mlsNumber}'`}>
                      <span className="text-sm text-[#5d6f87]">{school.distance}</span>
                    </Tooltip>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(index);
                      }}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      aria-label={expandedIndex === index ? `Hide details for ${school.name}` : `Show details for ${school.name}`}
                    >
                      {expandedIndex === index ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Accordion Content */}
                {expandedIndex === index && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50 overflow-visible">
                    <div className="space-y-2.5">
                      {school.distance && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`property_school_boundaries.distance_m / 1000.0 WHERE property_id = '${property.mlsNumber}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Distance</span>
                          </Tooltip>
                          <Tooltip text={`property_school_boundaries.distance_m / 1000.0 WHERE property_id = '${property.mlsNumber}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.distance}</span>
                          </Tooltip>
                        </div>
                      )}
                      {school.address && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.street, school.city, school.postal_code WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Address</span>
                          </Tooltip>
                          <Tooltip text={`school.street, school.city, school.postal_code WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.address}</span>
                          </Tooltip>
                        </div>
                      )}
                      {school.schoolWebsite && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.school_website WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Web Site</span>
                          </Tooltip>
                          <Tooltip text={`school.school_website WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 flex-1">
                              <a 
                                href={school.schoolWebsite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 cursor-help"
                              >
                                {school.schoolWebsite}
                              </a>
                            </span>
                          </Tooltip>
                        </div>
                      )}
                      {school.schoolLevel && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.school_level WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">School level</span>
                          </Tooltip>
                          <Tooltip text={`school.school_level WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.schoolLevel}</span>
                          </Tooltip>
                        </div>
                      )}
                      {school.schoolType && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.school_type WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Board Type</span>
                          </Tooltip>
                          <Tooltip text={`school.school_type WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.schoolType}</span>
                          </Tooltip>
                        </div>
                      )}
                      {school.gradeRange && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.grade_range WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Grade Range</span>
                          </Tooltip>
                          <Tooltip text={`school.grade_range WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.gradeRange}</span>
                          </Tooltip>
                        </div>
                      )}
                      {school.schoolLanguage && (
                        <div className="flex items-start gap-4">
                          <Tooltip text={`school.school_language WHERE school.id = '${school.schoolId}'`}>
                            <span className="text-sm text-[#5d6f87] cursor-help min-w-[100px]">Language</span>
                          </Tooltip>
                          <Tooltip text={`school.school_language WHERE school.id = '${school.schoolId}'`}>
                            <span className="font-medium text-gray-900 cursor-help flex-1">{school.schoolLanguage}</span>
                          </Tooltip>
                        </div>
                      )}
                      {(school.rank2023 !== undefined || school.rank2022 !== undefined) && (
                        <div>
                          <Tooltip text={`Academic performance data from school table WHERE school.id = '${school.schoolId}'`}>
                            <p className="text-sm text-[#5d6f87] mb-2 cursor-help">Academic Performance</p>
                          </Tooltip>
                          {school.rank2023 !== undefined && school.score2023 !== undefined && (
                            <Tooltip text={`school.rank_2023, school.score_2023 WHERE school.id = '${school.schoolId}'`}>
                              <p className="font-medium text-gray-900 cursor-help">
                                2023 Rank: {school.rank2023} Score: {school.score2023}
                              </p>
                            </Tooltip>
                          )}
                          {school.rank2022 !== undefined && school.score2022 !== undefined && (
                            <Tooltip text={`school.rank_2022, school.score_2022 WHERE school.id = '${school.schoolId}'`}>
                              <p className="font-medium text-gray-900 cursor-help">
                                2022 Rank: {school.rank2022} Score: {school.score2022}
                              </p>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 p-4 text-center">No schools found for this property.</p>
          )}
        </div>
      </div>
    </div>
  );
}

