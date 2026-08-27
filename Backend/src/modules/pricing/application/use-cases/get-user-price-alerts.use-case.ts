import { IPricingRepository } from '../../domain/repositories/pricing-repository.interface.js';
import { PriceAlertDto } from '../dtos/pricing.dtos.js';

export class GetUserPriceAlertsUseCase {
  constructor(private pricingRepository: IPricingRepository) {}

  async execute(userId: string): Promise<PriceAlertDto[]> {
    return this.pricingRepository.findAlertsByUser(userId);
  }
}
