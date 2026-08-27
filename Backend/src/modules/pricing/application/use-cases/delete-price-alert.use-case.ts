import { IPricingRepository } from '../../domain/repositories/pricing-repository.interface.js';

export class DeletePriceAlertUseCase {
  constructor(private pricingRepository: IPricingRepository) {}

  async execute(userId: string, alertId: string): Promise<boolean> {
    const alert = await this.pricingRepository.findAlertById(alertId);
    if (!alert) {
      const error: any = new Error(`Price alert with id '${alertId}' was not found.`);
      error.statusCode = 404;
      throw error;
    }

    if (alert.userId !== userId) {
      const error: any = new Error('Forbidden: You can only delete your own price alerts.');
      error.statusCode = 403;
      throw error;
    }

    return this.pricingRepository.deleteAlert(alertId);
  }
}
