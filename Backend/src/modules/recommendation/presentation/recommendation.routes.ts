import { Router } from 'express';
import { z } from 'zod';
import { RecommendationController } from './recommendation.controller.js';
import { validateRequest } from '../../../shared/presentation/middlewares/validation.middleware.js';
import { aiRateLimiter } from '../../../shared/presentation/middlewares/rate-limiter.middleware.js';

const router = Router();
const controller = new RecommendationController();

const carSpecSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Car name is required.'),
  horsepower: z.number().optional(),
  fuelL100km: z.number().optional(),
  cargoL: z.number().optional(),
  priceEGP: z.number().optional(),
});

const compareVehiclesBodySchema = z.object({
  carA: carSpecSchema,
  carB: carSpecSchema,
  userPrompt: z.string().optional(),
});

const chatWithAdvisorBodySchema = z.object({
  userPrompt: z.string().min(1, 'Prompt is required.'),
  carContext: z.array(carSpecSchema).optional(),
});

/**
 * @openapi
 * /api/v1/recommendation/compare:
 *   post:
 *     summary: Process vehicle comparison using Grok AI engine
 *     tags:
 *       - Recommendation & AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carA
 *               - carB
 *             properties:
 *               carA:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *                   horsepower: { type: number }
 *                   fuelL100km: { type: number }
 *                   cargoL: { type: number }
 *                   priceEGP: { type: number }
 *               carB:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *                   horsepower: { type: number }
 *                   fuelL100km: { type: number }
 *                   cargoL: { type: number }
 *                   priceEGP: { type: number }
 *               userPrompt:
 *                 type: string
 *                 example: I need the best car for daily Cairo traffic with low fuel usage
 *     responses:
 *       200:
 *         description: AI comparison verdict with winning car and reason text
 */
router.post('/compare', aiRateLimiter, validateRequest({ body: compareVehiclesBodySchema }), (req, res) => controller.compareVehicles(req, res));
router.post('/chat', aiRateLimiter, validateRequest({ body: chatWithAdvisorBodySchema }), (req, res) => controller.chatWithAdvisor(req, res));

export default router;
