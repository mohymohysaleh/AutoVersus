import { IPricingRepository } from '../../domain/repositories/pricing-repository.interface.js';
import { CreatePriceAlertDto, PriceAlertDto } from '../dtos/pricing.dtos.js';
import { PriceAlertEntity } from '../../domain/entities/price-alert.entity.js';

export class CreatePriceAlertUseCase {
  constructor(private pricingRepository: IPricingRepository) {}

  async execute(userId: string, dto: CreatePriceAlertDto): Promise<PriceAlertDto> {
    if (!dto.variantId || dto.targetPrice <= 0) {
      const error: any = new Error('Valid variantId and positive targetPrice are required.');
      error.statusCode = 400;
      throw error;
    }

    const alertEntity = PriceAlertEntity.create({
      userId,
      variantId: dto.variantId,
      targetPrice: dto.targetPrice,
      isTriggered: false,
    });

    return this.pricingRepository.savePriceAlert(alertEntity);
  }
}
