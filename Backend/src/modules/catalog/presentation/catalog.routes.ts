import { Router } from 'express';
import { CatalogController } from './catalog.controller.js';

const router = Router();
const controller = new CatalogController();

/**
 * @openapi
 * /api/v1/catalog/brands:
 *   get:
 *     summary: Retrieve all active automotive brands
 *     tags:
 *       - Catalog
 *     responses:
 *       200:
 *         description: List of car manufacturers/brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: Toyota
 *                       slug:
 *                         type: string
 *                         example: toyota
 *                       country:
 *                         type: string
 *                         example: Japan
 */
router.get('/brands', controller.getBrands);

/**
 * @openapi
 * /api/v1/catalog/search:
 *   get:
 *     summary: Search and filter vehicle market variants
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: query
 *         name: brandSlug
 *         schema:
 *           type: string
 *         description: Filter by brand slug (e.g. toyota)
 *       - in: query
 *         name: bodyType
 *         schema:
 *           type: string
 *           enum: [SEDAN, SUV, CROSSOVER, HATCHBACK, COUPE, CONVERTIBLE, WAGON, PICKUP, VAN, MPV, EV]
 *         description: Filter by body style
 *       - in: query
 *         name: minPriceEGP
 *         schema:
 *           type: number
 *         description: Minimum starting price in EGP
 *       - in: query
 *         name: maxPriceEGP
 *         schema:
 *           type: number
 *         description: Maximum starting price in EGP
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated search results of vehicle variants
 */
router.get('/search', controller.searchVehicles);

/**
 * @openapi
 * /api/v1/catalog/variants/{slug}:
 *   get:
 *     summary: Get complete vehicle trim specification sheet by slug
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant slug (e.g. comfort, smart)
 *     responses:
 *       200:
 *         description: Detailed specification sheet containing engine, dimensions, performance, fuel economy, and safety specs
 *       404:
 *         description: Vehicle variant not found
 */
router.get('/variants/:slug', controller.getVariantBySlug);

export default router;
