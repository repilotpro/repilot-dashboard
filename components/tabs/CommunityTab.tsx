"use client";

import { useState } from "react";
import { Property } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import Tooltip from "@/components/Tooltip";

interface CommunityTabProps {
  property: Property;
}

// Colorful palette for all charts - vibrant colors visible on white background
const CHART_COLORS = [
  '#3b82f6',  // Blue
  '#60a5fa',  // Light Blue
  '#10b981',  // Green
  '#06b6d4',  // Cyan
  '#8b5cf6',  // Purple
  '#f472b6',  // Pink
  '#fb923c',  // Orange
  '#ef4444',  // Red
  '#6366f1',  // Indigo
  '#14b8a6',  // Teal
];

// Household Income specific colors matching the image (but avoiding yellow)
const INCOME_COLORS: { [key: string]: string } = {
  '$0-$29,999': '#3b82f6',      // Blue
  '$30,000-$59,999': '#60a5fa', // Light Blue
  '$60,000-$79,999': '#10b981', // Green (replaced light green)
  '$80,000-$99,999': '#06b6d4', // Cyan (replaced yellow)
  '$100,000-$149,999': '#fb923c', // Orange
  '$150,000-$199,999': '#f472b6', // Pink
  '$200,000+': '#8b5cf6',        // Purple
};

type ChartCategory = 'householdIncome' | 'age' | 'education' | 'ethnicity' | 'language' | 'religion' | 'occupation' | 'housing' | 'commuteMethod';

export default function CommunityTab({ property }: CommunityTabProps) {
  const community = property.community;
  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>('householdIncome');

  if (!community) {
    return <p className="text-gray-600">Community data not available</p>;
  }

  return (
    <div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistics Canada for Area #{community.dauid || ''}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {community.population !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID = 1">
                  <div>
                    <p className="text-sm text-gray-600">Population 2021</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.population.toLocaleString()}
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.averageAge !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID = 39">
                  <div>
                    <p className="text-sm text-gray-600">Average Age</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.averageAge}
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.averageHouseholdSize !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID = 57">
                  <div>
                    <p className="text-sm text-gray-600">Household Average Size</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.averageHouseholdSize}
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.averageIncome !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID = 252">
                  <div>
                    <p className="text-sm text-gray-600">Average Household Income</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${community.averageIncome.toLocaleString()}
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.renters !== undefined && (
                <Tooltip text="census.C10_RATE_TOTAL WHERE CHARACTERISTIC_ID = 1416">
                  <div>
                    <p className="text-sm text-gray-600">Renters</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.renters.toFixed(1)}%
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.averageHomeValue !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID = 1489">
                  <div>
                    <p className="text-sm text-gray-600">Average Home Value</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${community.averageHomeValue.toLocaleString()}
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.collegeUniversityEducation !== undefined && (
                <Tooltip text="census.C10_RATE_TOTAL WHERE CHARACTERISTIC_ID = 2001">
                  <div>
                    <p className="text-sm text-gray-600">College/University Education</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.collegeUniversityEducation.toFixed(1)}%
                    </p>
                  </div>
                </Tooltip>
              )}
              {community.householdsWithChildren !== undefined && (
                <Tooltip text="census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID IN (78, 81, 84) - Calculated: (81 + 84) / 78 * 100">
                  <div>
                    <p className="text-sm text-gray-600">Households with Children</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {community.householdsWithChildren.toFixed(1)}%
                    </p>
                  </div>
                </Tooltip>
              )}
            </div>
          </div>

          {community.chartData && (
            <>
              {/* Category Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { key: 'householdIncome' as ChartCategory, label: 'Household Income', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 261 AND 280 (excluding 276)' },
                  { key: 'age' as ChartCategory, label: 'Age', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 10 AND 33 (excluding 13, 24, 29)' },
                  { key: 'education' as ChartCategory, label: 'Education', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 1999 AND 2013 (excluding 1998, 2001)' },
                  { key: 'ethnicity' as ChartCategory, label: 'Ethnicity (Top 10)', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 1699 AND 1948 (Top 10 by count)' },
                  { key: 'language' as ChartCategory, label: 'Language (Top 10)', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 396 AND 717 (Top 10 by count, excluding entries with "languages" in name)' },
                  { key: 'religion' as ChartCategory, label: 'Religion', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID IN (1950, 1951, 1967-1973)' },
                  { key: 'occupation' as ChartCategory, label: 'Occupation', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 2249 AND 2258' },
                  { key: 'housing' as ChartCategory, label: 'Housing', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 42 AND 49' },
                  { key: 'commuteMethod' as ChartCategory, label: 'Commute Method', tooltip: 'census.C1_COUNT_TOTAL WHERE CHARACTERISTIC_ID BETWEEN 2605 AND 2610' },
                ].map(({ key, label, tooltip }) => {
                  const hasData = community.chartData?.[key] && community.chartData[key]!.length > 0;
                  if (!hasData) return null;
                  return (
                    <Tooltip key={key} text={tooltip}>
                      <button
                        onClick={() => setSelectedCategory(key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedCategory === key
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Pie Chart */}
              {community.chartData[selectedCategory] && community.chartData[selectedCategory]!.length > 0 && (
                <div>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={community.chartData[selectedCategory]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {community.chartData[selectedCategory]!.map((entry, index) => {
                          // Use specific colors for household income, otherwise use CHART_COLORS array
                          const color = selectedCategory === 'householdIncome' && INCOME_COLORS[entry.name]
                            ? INCOME_COLORS[entry.name]
                            : CHART_COLORS[index % CHART_COLORS.length];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={color}
                            />
                          );
                        })}
                      </Pie>
                      <RechartsTooltip />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => {
                          const data = community.chartData?.[selectedCategory]?.find(d => d.name === value);
                          return `${value}: ${data?.value.toFixed(1)}%`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}

