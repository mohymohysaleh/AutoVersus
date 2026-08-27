import { IPricingRepository } from '../../domain/repositories/pricing-repository.interface.js';
import { RecordPriceDto } from '../dtos/pricing.dtos.js';
import { VariantPriceEntity } from '../../domain/entities/variant-price.entity.js';

export class RecordPriceUseCase {
  constructor(private pricingRepository: IPricingRepository) {}

  async execute(dto: RecordPriceDto): Promise<void> {
    if (!dto.variantId || dto.price <= 0) {
      const error: any = new Error('Valid variantId and positive price amount are required.');
      error.statusCode = 400;
      throw error;
    }

    const priceEntity = VariantPriceEntity.create({
      variantId: dto.variantId,
      price: dto.price,
      currency: dto.currency || 'EGP',
      priceType: dto.priceType,
      sourceName: dto.sourceName || null,
    });

    await this.pricingRepository.savePriceRecord(priceEntity);
  }
}
