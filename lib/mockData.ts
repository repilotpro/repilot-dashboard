export interface Property {
  id: string;
  address: string;
  city: string;
  area?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  image: string;
  images?: string[];
  thumbnails?: string[];
  imageCount?: number;
  daysOnMarket: number;
  listingDate: string;
  listingContractDate?: string;
  mlsNumber?: string;
  propertyType: string;
  lotSize: string;
  garage: number;
  parkingTotal?: number;
  mlsStatus?: string;
  transactionType?: string;
  yearBuilt?: number;
  livingArea?: string;
  basement?: string;
  buildingType?: string;
  propertySubType?: string;
  style?: string;
  storeys?: number;
  listingAgent?: string;
  updatedDate?: string;
  superMarket?: string;
  sellerMarket?: string;
  rooms?: Room[];
  listingHistory?: ListingHistory[];
  schools?: School[];
  community?: Community;
  places?: Place[];
  // Additional fields for Key Facts and Details
  tax?: string;
  taxYear?: string;
  listingNumber?: string;
  dataSource?: string;
  predictedDaysOnMarket?: number;
  listingBrokerage?: string;
  propertyDaysOnMarket?: number;
  statusChange?: string;
  marketDemand?: string;
  frontingOn?: string;
  municipality?: string;
  construction?: string;
  garageType?: string;
  parkingSpaces?: number;
  coveredSpaces?: number;
  totalParkingSpaces?: number;
  parkingFeatures?: string;
  bathroomDetails?: string;
  kitchens?: number;
  totalRooms?: number;
  familyRoom?: boolean;
  fireplace?: boolean;
  depth?: number;
  frontage?: number;
  lotSizeCode?: string;
  lotSizeArea?: string;
  crossStreet?: string;
  water?: string;
  cooling?: string;
  heatingType?: string;
  heatingFuel?: string;
  sewer?: string;
  directionFaces?: string;
}

export interface Room {
  name: string;
  level: string;
  description?: string;
  features?: string;
}

export interface ListingHistory {
  dateStart: string;
  dateEnd?: string;
  price: number;
  event: string;
  listingId: string;
}

export interface School {
  name: string;
  distance: string;
  rating?: number;
  ratingDisplay?: string; // e.g., "10" or "9.8" with "of 10"
  schoolId?: string;
  schoolLevel?: string;
  gradeRange?: string;
  schoolLanguage?: string;
  schoolType?: string; // board type (Public / Catholic / etc.)
  schoolWebsite?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  address?: string; // Full address
  // Academic performance
  rank2023?: number;
  score2023?: number;
  rank2022?: number;
  score2022?: number;
}

export interface Community {
  statisticsComplex?: string;
  dauid?: string;
  region?: string;
  averageAge?: number;
  averageIncome?: number;
  population?: number;
  averageHouseholdSize?: number;
  averageCommuteTime?: number;
  renters?: number;
  averageHomeValue?: number;
  householdsWithChildren?: number;
  collegeUniversityEducation?: number;
  occupation?: { name: string; value: number }[];
  housing?: { name: string; value: number }[];
  chartData?: {
    householdIncome?: { name: string; value: number }[];
    age?: { name: string; value: number }[];
    education?: { name: string; value: number }[];
    ethnicity?: { name: string; value: number }[];
    language?: { name: string; value: number }[];
    religion?: { name: string; value: number }[];
    occupation?: { name: string; value: number }[];
    housing?: { name: string; value: number }[];
    commuteMethod?: { name: string; value: number }[];
  };
}

export interface Place {
  name: string;
  distance: string;
  type: string;
  dbType?: string;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    address: "3 Claridge Drive",
    city: "Richmond Hill",
    area: "South Richvale",
    price: 5599000,
    bedrooms: 6,
    bathrooms: 7,
    squareFeet: 4500,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600",
    ],
    daysOnMarket: 6,
    listingDate: "2024-01-15",
    propertyType: "House",
    lotSize: "6230+ SqFt",
    garage: 3,
    yearBuilt: 2015,
    livingArea: "5000+ feet",
    basement: "Finished with Walk-Out, Separate Entrance",
    buildingType: "Detached",
    style: "2 Storey",
    storeys: 2,
    listingAgent: "Very Strong",
    updatedDate: "9 days",
    superMarket: "Available",
    sellerMarket: "Balanced",
    rooms: [
      { name: "Living Room", level: "Ground", description: "Hardwood Floor, Pot Lights, Panelled" },
      { name: "Dining Room", level: "Ground", description: "Hardwood Floor, Pot Lights, Large Window" },
      { name: "Office", level: "Ground", description: "Hardwood Floor, Double Doors, B/I Shelves" },
      { name: "Breakfast", level: "Ground", description: "Porcelain Floor, Pot Lights, W/O To Terrace" },
      { name: "Kitchen", level: "Ground", description: "Porcelain Floor, Centre Island, B/I Appliances" },
      { name: "Family Room", level: "Ground", description: "Hardwood Floor, Fireplace, Crown Moulding" },
      { name: "Primary Bedroom", level: "Second", description: "Hardwood Floor, 6 Pc Ensuite, Walk-In Closet(s)" },
      { name: "Bedroom 2", level: "Second", description: "Hardwood Floor, 4 Pc Bath, Walk-In Closet(s)" },
    ],
    tax: "$19,247/ 2024",
    listingNumber: "N12563286",
    dataSource: "PROPTX",
    predictedDaysOnMarket: 20,
    listingBrokerage: "BAY STREET GROUP INC.",
    propertyDaysOnMarket: 6,
    statusChange: "5 days ago",
    marketDemand: "Balanced",
    frontingOn: "West",
    municipality: "Richmond Hill",
    construction: "Brick, Stone",
    garageType: "Attached",
    parkingSpaces: 5,
    totalParkingSpaces: 8,
    bathroomDetails: "1.2pc Main floor, 1.4pc Basement floor, 1.2pc Basement floor",
    kitchens: 1,
    totalRooms: 10,
    familyRoom: true,
    fireplace: true,
    depth: 126,
    frontage: 80,
    lotSizeCode: "Feet",
    crossStreet: "Claridge Dr and Westview Dr",
    water: "Municipal",
    cooling: "Central Air",
    heatingType: "Forced Air",
    heatingFuel: "Gas",
    listingHistory: [
      {
        dateStart: "2022-09-20",
        price: 3500000,
        event: "For Sale",
        listingId: "N5242295",
      },
      {
        dateStart: "2020-08-13",
        dateEnd: "2020-10-08",
        price: 2500000,
        event: "Terminated",
        listingId: "N1234567",
      },
    ],
    schools: [
      { name: "St. Augustine Catholic High School", distance: "1.5km", rating: 8, ratingDisplay: "8" },
      { name: "Erning Memorial High School", distance: "2.3km", rating: 9, ratingDisplay: "9", schoolType: "Public", address: "123 School St", gradeRange: "9-12", schoolLanguage: "English, French" },
      { name: "Elementary School A", distance: "0.8km", rating: 7, ratingDisplay: "7" },
    ],
    community: {
      statisticsComplex: "1546423",
      averageAge: 42,
      averageIncome: 85000,
      population: 12500,
      averageHouseholdSize: 2.8,
      averageCommuteTime: 25,
      occupation: [
        { name: "Management", value: 25 },
        { name: "Sales and Service", value: 20 },
        { name: "Trades", value: 15 },
        { name: "Education", value: 18 },
        { name: "Health", value: 22 },
      ],
      housing: [
        { name: "Owned", value: 65 },
        { name: "Rented", value: 35 },
      ],
    },
    places: [
      { name: "Grocery", distance: "0.5km", type: "grocery" },
      { name: "Pharmacy", distance: "1.2km", type: "pharmacy" },
      { name: "Hospital", distance: "3.8km", type: "hospital" },
      { name: "Park", distance: "0.3km", type: "park" },
      { name: "Library", distance: "1.5km", type: "library" },
      { name: "Bank", distance: "0.9km", type: "bank" },
      { name: "Restaurant", distance: "0.7km", type: "restaurant" },
      { name: "Gym", distance: "1.1km", type: "gym" },
    ],
  },
  {
    id: "2",
    address: "123 Main Street",
    city: "Toronto",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    daysOnMarket: 15,
    listingDate: "2024-01-10",
    propertyType: "Condo",
    lotSize: "N/A",
    garage: 1,
  },
  {
    id: "3",
    address: "456 Oak Avenue",
    city: "Vancouver",
    price: 2800000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3200,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    daysOnMarket: 7,
    listingDate: "2024-01-18",
    propertyType: "House",
    lotSize: "5000 SqFt",
    garage: 2,
  },
  {
    id: "4",
    address: "789 Pine Road",
    city: "Calgary",
    price: 950000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2100,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    daysOnMarket: 22,
    listingDate: "2024-01-05",
    propertyType: "Townhouse",
    lotSize: "2500 SqFt",
    garage: 2,
  },
];

