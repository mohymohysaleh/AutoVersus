import { Router } from 'express';
import { PricingController } from './pricing.controller.js';
import { authenticateJwt } from '../../../shared/presentation/middlewares/auth.middleware.js';
import { requireRoles } from '../../../shared/presentation/middlewares/rbac.middleware.js';
import { Role } from '@prisma/client';

const router = Router();
const controller = new PricingController();

/**
 * @openapi
 * /api/v1/pricing/history/{variantId}:
 *   get:
 *     summary: Get chronological price history & overprice timeline for a vehicle variant
 *     tags:
 *       - Pricing & Market Intelligence
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle MarketVariant UUID
 *     responses:
 *       200:
 *         description: Chronological price history with MSRP vs Dealer Overprice
 *       404:
 *         description: Vehicle variant not found
 */
router.get('/history/:variantId', controller.getPriceHistory);

/**
 * @openapi
 * /api/v1/pricing/record:
 *   post:
 *     summary: Record a new MSRP, Dealer Overprice, or Market Average price point (Data Editors/Admins)
 *     tags:
 *       - Pricing & Market Intelligence
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - price
 *               - priceType
 *             properties:
 *               variantId:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 1450000
 *               currency:
 *                 type: string
 *                 default: EGP
 *               priceType:
 *                 type: string
 *                 enum: [OFFICIAL_MSRP, DEALER_OVERPRICE, MARKET_AVERAGE, PROMOTIONAL]
 *                 example: OFFICIAL_MSRP
 *               sourceName:
 *                 type: string
 *                 example: Cairo Dealership Price List Aug 2026
 *     responses:
 *       201:
 *         description: Price point recorded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires CONTENT_DATA_EDITOR or ADMIN role)
 */
router.post(
  '/record',
  authenticateJwt,
  requireRoles(Role.CONTENT_DATA_EDITOR, Role.ADMIN, Role.SUPER_ADMIN),
  controller.recordPrice
);

/**
 * @openapi
 * /api/v1/pricing/alerts:
 *   post:
 *     summary: Create a target price alert for a vehicle trim (Authenticated User)
 *     tags:
 *       - Pricing & Market Intelligence
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - targetPrice
 *             properties:
 *               variantId:
 *                 type: string
 *               targetPrice:
 *                 type: number
 *                 example: 1400000
 *     responses:
 *       201:
 *         description: Price alert created
 *       401:
 *         description: Unauthorized
 */
router.post('/alerts', authenticateJwt, controller.createAlert);

/**
 * @openapi
 * /api/v1/pricing/alerts:
 *   get:
 *     summary: Retrieve active price alerts for currently authenticated user
 *     tags:
 *       - Pricing & Market Intelligence
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user price alerts
 *       401:
 *         description: Unauthorized
 */
router.get('/alerts', authenticateJwt, controller.getUserAlerts);

/**
 * @openapi
 * /api/v1/pricing/alerts/{id}:
 *   delete:
 *     summary: Delete a price alert
 *     tags:
 *       - Pricing & Market Intelligence
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price alert deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Alert not found
 */
router.delete('/alerts/:id', authenticateJwt, controller.deleteAlert);

export default router;
