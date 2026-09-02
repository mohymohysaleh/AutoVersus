import { Router } from 'express';
import { RecommendationController } from './recommendation.controller.js';

const router = Router();
const controller = new RecommendationController();

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
router.post('/compare', (req, res) => controller.compareVehicles(req, res));
router.post('/chat', (req, res) => controller.chatWithAdvisor(req, res));

export default router;
