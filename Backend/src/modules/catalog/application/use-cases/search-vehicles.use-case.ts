import { ICatalogRepository } from '../../domain/repositories/catalog-repository.interface.js';
import { CarSearchFilterDto, VariantDetailDto } from '../dtos/catalog.dtos.js';

export class SearchVehiclesUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(filters: CarSearchFilterDto): Promise<{ items: VariantDetailDto[]; total: number }> {
    return this.catalogRepository.searchVehicles(filters);
  }
}
