import { VariantPriceEntity } from '../entities/variant-price.entity.js';
import { PriceAlertEntity } from '../entities/price-alert.entity.js';
import { PriceHistoryDto, PriceAlertDto } from '../../application/dtos/pricing.dtos.js';

export interface IPricingRepository {
  findPriceHistoryByVariant(variantId: string): Promise<PriceHistoryDto>;
  savePriceRecord(priceEntity: VariantPriceEntity): Promise<void>;
  savePriceAlert(alertEntity: PriceAlertEntity): Promise<PriceAlertDto>;
  findAlertsByUser(userId: string): Promise<PriceAlertDto[]>;
  findAlertById(id: string): Promise<PriceAlertEntity | null>;
  deleteAlert(id: string): Promise<boolean>;
}
