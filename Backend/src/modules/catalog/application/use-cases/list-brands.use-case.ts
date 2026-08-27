import { ICatalogRepository } from '../../domain/repositories/catalog-repository.interface.js';
import { BrandResponseDto } from '../dtos/catalog.dtos.js';

export class ListBrandsUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(): Promise<BrandResponseDto[]> {
    return this.catalogRepository.findAllBrands();
  }
}
