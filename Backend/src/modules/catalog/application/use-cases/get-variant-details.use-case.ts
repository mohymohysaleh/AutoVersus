import { ICatalogRepository } from '../../domain/repositories/catalog-repository.interface.js';
import { VariantDetailDto } from '../dtos/catalog.dtos.js';

export class GetVariantDetailsUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(slug: string): Promise<VariantDetailDto | null> {
    return this.catalogRepository.findVariantBySlug(slug);
  }
}
