import { IPricingRepository } from '../../domain/repositories/pricing-repository.interface.js';
import { PriceHistoryDto } from '../dtos/pricing.dtos.js';

export class GetPriceHistoryUseCase {
  constructor(private pricingRepository: IPricingRepository) {}

  async execute(variantId: string): Promise<PriceHistoryDto> {
    return this.pricingRepository.findPriceHistoryByVariant(variantId);
  }
}
