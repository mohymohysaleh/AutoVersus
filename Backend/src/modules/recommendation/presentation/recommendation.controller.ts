import { Request, Response } from 'express';
import { generateComparisonInsight, ComparisonPayload, chatWithAiAdvisor, ChatAdvisorPayload } from '../infrastructure/grok.service.js';

export class RecommendationController {
  public async compareVehicles(req: Request, res: Response): Promise<void> {
    try {
      const { carA, carB, userCity, lang, userPrompt } = req.body;

      if (!carA || !carB) {
        res.status(400).json({
          error: {
            message: 'Both carA and carB object data are required for AI comparison.',
          },
        });
        return;
      }

      const payload: ComparisonPayload = {
        carA: {
          id: carA.id,
          name: carA.name || `${carA.brandName || ''} ${carA.modelName || ''} ${carA.trimName || ''}`.trim() || 'Car A',
          brandName: carA.brandName,
          modelName: carA.modelName,
          trimName: carA.trimName,
          year: Number(carA.year) || 2026,
          horsepower: Number(carA.horsepower) || 0,
          torqueNm: Number(carA.torqueNm) || 0,
          zeroToHundredSec: Number(carA.zeroToHundredSec) || 0,
          topSpeedKmh: Number(carA.topSpeedKmh) || 0,
          fuelL100km: Number(carA.fuelL100km || carA.fuelEconomyL100km) || 0,
          cargoL: Number(carA.cargoL || carA.trunkVolumeL) || 450,
          priceEGP: Number(carA.priceEGP || carA.startingPriceEGP) || 0,
          transmission: carA.transmission,
          drivetrain: carA.drivetrain,
          airbagsCount: Number(carA.airbagsCount) || 6,
          categoryTag: carA.categoryTag,
          bodyType: carA.bodyType,
        },
        carB: {
          id: carB.id,
          name: carB.name || `${carB.brandName || ''} ${carB.modelName || ''} ${carB.trimName || ''}`.trim() || 'Car B',
          brandName: carB.brandName,
          modelName: carB.modelName,
          trimName: carB.trimName,
          year: Number(carB.year) || 2026,
          horsepower: Number(carB.horsepower) || 0,
          torqueNm: Number(carB.torqueNm) || 0,
          zeroToHundredSec: Number(carB.zeroToHundredSec) || 0,
          topSpeedKmh: Number(carB.topSpeedKmh) || 0,
          fuelL100km: Number(carB.fuelL100km || carB.fuelEconomyL100km) || 0,
          cargoL: Number(carB.cargoL || carB.trunkVolumeL) || 450,
          priceEGP: Number(carB.priceEGP || carB.startingPriceEGP) || 0,
          transmission: carB.transmission,
          drivetrain: carB.drivetrain,
          airbagsCount: Number(carB.airbagsCount) || 6,
          categoryTag: carB.categoryTag,
          bodyType: carB.bodyType,
        },
        userCity,
        lang,
        userPrompt,
      };

      const result = await generateComparisonInsight(payload);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error in compareVehicles controller:', error);
      res.status(500).json({
        error: {
          message: error.message || 'Failed to process AI comparison with Grok.',
        },
      });
    }
  }

  public async chatWithAdvisor(req: Request, res: Response): Promise<void> {
    try {
      const { messages, carsInComparison } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          error: {
            message: 'Messages array with user question is required.',
          },
        });
        return;
      }

      const payload: ChatAdvisorPayload = {
        messages,
        carsInComparison: Array.isArray(carsInComparison) ? carsInComparison : [],
      };

      const reply = await chatWithAiAdvisor(payload);

      res.json({
        success: true,
        data: {
          reply,
        },
      });
    } catch (error: any) {
      console.error('Error in chatWithAdvisor controller:', error);
      res.status(500).json({
        error: {
          message: error.message || 'Failed to generate AI Chatbot reply.',
        },
      });
    }
  }
}
