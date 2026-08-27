export interface CarSearchFilterDto {
  bodyType?: string;
  brandSlug?: string;
  minPriceEGP?: number;
  maxPriceEGP?: number;
  fuelType?: string;
  transmission?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface BrandResponseDto {
  id: string;
  name: string;
  slug: string;
  country: string;
  foundedYear?: number | null;
}

export interface VariantDetailDto {
  id: string;
  brandName: string;
  modelName: string;
  generationName: string;
  year: number;
  trimName: string;
  slug: string;
  startingPriceEGP: number | null;
  completenessScore: number;
  isPublished: boolean;
  engine?: {
    fuelType: string;
    displacementCc: number | null;
    cylinders: number | null;
    powerKw: number;
    powerHp: number;
    torqueNm: number;
    transmission: string;
    drivetrain: string;
  } | null;
  dimensions?: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    wheelbaseMm: number;
    cargoCapacityL: number;
    seatingCapacity: number;
  } | null;
  performance?: {
    zeroToHundredKmh: number | null;
    topSpeedKmh: number | null;
  } | null;
  fuelEconomy?: {
    combinedL100km: number;
    sourceType: string;
  } | null;
  safety?: {
    airbagsCount: number;
    hasAbs: boolean;
    hasEsc: boolean;
    hasAeb: boolean;
  } | null;
}
