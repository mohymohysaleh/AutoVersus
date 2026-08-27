import { BrandResponseDto, VariantDetailDto, CarSearchFilterDto } from '../../application/dtos/catalog.dtos.js';

export interface ICatalogRepository {
  findAllBrands(): Promise<BrandResponseDto[]>;
  findVariantBySlug(slug: string): Promise<VariantDetailDto | null>;
  searchVehicles(filters: CarSearchFilterDto): Promise<{ items: VariantDetailDto[]; total: number }>;
}
