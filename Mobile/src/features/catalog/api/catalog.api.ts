import { apiClient } from '../../../shared/services/api-client';

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  country: string;
  foundedYear?: number;
  logoUrl?: string;
}

export interface EngineSpecDto {
  fuelType: string;
  displacementCc?: number;
  cylinders?: number;
  powerKw: number;
  powerHp: number;
  torqueNm: number;
  transmission: string;
  drivetrain: string;
}

export interface DimensionSpecDto {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  cargoCapacityL: number;
  seatingCapacity: number;
}

export interface PerformanceSpecDto {
  zeroToHundredKmh?: number;
  topSpeedKmh?: number;
}

export interface FuelEconomySpecDto {
  combinedL100km: number;
  sourceType: string;
}

export interface SafetySpecDto {
  airbagsCount: number;
  hasAbs: boolean;
  hasEsc: boolean;
  hasAeb: boolean;
}

export interface VariantDetailDto {
  id: string;
  brandName: string;
  modelName: string;
  generationName: string;
  year: number;
  trimName: string;
  slug: string;
  startingPriceEGP?: number;
  completenessScore: number;
  isPublished: boolean;
  engine?: EngineSpecDto | null;
  dimensions?: DimensionSpecDto | null;
  performance?: PerformanceSpecDto | null;
  fuelEconomy?: FuelEconomySpecDto | null;
  safety?: SafetySpecDto | null;
}

export interface SearchVehiclesParams {
  brandSlug?: string;
  bodyType?: string;
  minPriceEGP?: number;
  maxPriceEGP?: number;
  page?: number;
  limit?: number;
}

export const catalogApi = {
  /**
   * Fetch all active automotive brands
   */
  fetchBrands: async (): Promise<BrandDto[]> => {
    try {
      const res: any = await apiClient.get('/v1/catalog/brands');
      return Array.isArray(res) ? res : res.data || [];
    } catch (err) {
      console.warn('⚠️ Failed to fetch brands from backend API:', err);
      return [];
    }
  },

  /**
   * Search and filter vehicle market variants
   */
  searchVehicles: async (params?: SearchVehiclesParams): Promise<{ items: VariantDetailDto[]; total: number }> => {
    try {
      const res: any = await apiClient.get('/v1/catalog/search', { params });
      const items = Array.isArray(res) ? res : res.data || [];
      const total = res.meta?.total || items.length;
      return { items, total };
    } catch (err) {
      console.warn('⚠️ Failed to search vehicles from backend API:', err);
      return { items: [], total: 0 };
    }
  },

  /**
   * Get complete vehicle trim specification sheet by slug
   */
  fetchVariantDetails: async (slug: string): Promise<VariantDetailDto | null> => {
    try {
      const res: any = await apiClient.get(`/v1/catalog/variants/${encodeURIComponent(slug)}`);
      return res.data || res || null;
    } catch (err) {
      console.warn(`⚠️ Failed to fetch variant details for slug "${slug}":`, err);
      return null;
    }
  },
};
