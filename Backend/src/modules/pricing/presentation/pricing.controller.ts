import { Request, Response, NextFunction } from 'express';
import { PrismaPricingRepository } from '../infrastructure/prisma-pricing.repository.js';
import { GetPriceHistoryUseCase } from '../application/use-cases/get-price-history.use-case.js';
import { RecordPriceUseCase } from '../application/use-cases/record-price.use-case.js';
import { CreatePriceAlertUseCase } from '../application/use-cases/create-price-alert.use-case.js';
import { GetUserPriceAlertsUseCase } from '../application/use-cases/get-user-price-alerts.use-case.js';
import { DeletePriceAlertUseCase } from '../application/use-cases/delete-price-alert.use-case.js';
import { AuthenticatedRequest } from '../../../shared/presentation/middlewares/auth.middleware.js';

export class PricingController {
  private pricingRepo = new PrismaPricingRepository();

  private getPriceHistoryUseCase = new GetPriceHistoryUseCase(this.pricingRepo);
  private recordPriceUseCase = new RecordPriceUseCase(this.pricingRepo);
  private createPriceAlertUseCase = new CreatePriceAlertUseCase(this.pricingRepo);
  private getUserPriceAlertsUseCase = new GetUserPriceAlertsUseCase(this.pricingRepo);
  private deletePriceAlertUseCase = new DeletePriceAlertUseCase(this.pricingRepo);

  public getPriceHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { variantId } = req.params;
      const history = await this.getPriceHistoryUseCase.execute(variantId as string);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

  public recordPrice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { variantId, price, currency, priceType, sourceName } = req.body;

      if (!variantId || !price || !priceType) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'variantId, price, and priceType are required fields.',
            statusCode: 400,
          },
        });
      }

      await this.recordPriceUseCase.execute({
        variantId,
        price: Number(price),
        currency,
        priceType,
        sourceName,
      });

      res.status(201).json({
        success: true,
        message: 'Price record created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  public createAlert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { variantId, targetPrice } = req.body;

      if (!variantId || !targetPrice) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'variantId and targetPrice are required fields.',
            statusCode: 400,
          },
        });
      }

      const alert = await this.createPriceAlertUseCase.execute(userId, {
        variantId,
        targetPrice: Number(targetPrice),
      });

      res.status(201).json({
        success: true,
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserAlerts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const alerts = await this.getUserPriceAlertsUseCase.execute(userId);

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteAlert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      await this.deletePriceAlertUseCase.execute(userId, id as string);

      res.json({
        success: true,
        message: 'Price alert successfully deleted.',
      });
    } catch (error) {
      next(error);
    }
  };
}
