import { Router } from 'express';
import { z } from 'zod';
import { NewsController } from './news.controller.js';
import { authenticateJwt } from '../../../shared/presentation/middlewares/auth.middleware.js';
import { requireRoles } from '../../../shared/presentation/middlewares/rbac.middleware.js';
import { validateRequest } from '../../../shared/presentation/middlewares/validation.middleware.js';
import { Role } from '@prisma/client';

const router = Router();
const controller = new NewsController();

const getArticlesQuerySchema = z.object({
  category: z.string().optional(),
  page: z.string().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? Number(val) : 10)),
});

const getArticleSlugParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
});

const createArticleBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  summary: z.string().min(5, 'Summary is required.'),
  contentHtml: z.string().min(10, 'Content HTML is required.'),
  coverImage: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required.'),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
});

const updateArticleBodySchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  contentHtml: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
});

const articleIdParamsSchema = z.object({
  id: z.string().min(1, 'Article ID is required.'),
});

/**
 * @openapi
 * /api/v1/news:
 *   get:
 *     summary: Retrieve published automotive news articles
 *     tags:
 *       - News & Editorial
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. Local, Prices, New Cars, EVs)
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
 *         description: List of published news articles
 */
router.get('/', validateRequest({ query: getArticlesQuerySchema }), controller.getArticles);

/**
 * @openapi
 * /api/v1/news/{slug}:
 *   get:
 *     summary: Retrieve a single news article by slug
 *     tags:
 *       - News & Editorial
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique article URL slug
 *     responses:
 *       200:
 *         description: Full news article details
 *       404:
 *         description: Article not found
 */
router.get('/:slug', validateRequest({ params: getArticleSlugParamsSchema }), controller.getArticleBySlug);

/**
 * @openapi
 * /api/v1/news:
 *   post:
 *     summary: Create a new news article (Editorial/Admin)
 *     tags:
 *       - News & Editorial
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - contentHtml
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Egyptian Automotive Market 2026 Price Update
 *               summary:
 *                 type: string
 *                 example: Overview of MSRP changes and dealer overprice trends in Cairo.
 *               contentHtml:
 *                 type: string
 *                 example: <p>Full article body content...</p>
 *               coverImage:
 *                 type: string
 *                 example: https://images.autoversus.com/news/cover.jpg
 *               category:
 *                 type: string
 *                 example: Local
 *               status:
 *                 type: string
 *                 enum: [DRAFT, REVIEW, PUBLISHED, ARCHIVED]
 *                 default: DRAFT
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires NEWS_EDITOR or ADMIN role)
 */
router.post(
  '/',
  authenticateJwt,
  requireRoles(Role.NEWS_EDITOR, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest({ body: createArticleBodySchema }),
  controller.createArticle
);

/**
 * @openapi
 * /api/v1/news/{id}:
 *   put:
 *     summary: Update an existing article's content or status
 *     tags:
 *       - News & Editorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               contentHtml:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, REVIEW, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put(
  '/:id',
  authenticateJwt,
  requireRoles(Role.NEWS_EDITOR, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest({ params: articleIdParamsSchema, body: updateArticleBodySchema }),
  controller.updateArticle
);

/**
 * @openapi
 * /api/v1/news/{id}:
 *   delete:
 *     summary: Delete a news article (Admin only)
 *     tags:
 *       - News & Editorial
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
 *         description: Article deleted successfully
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Article not found
 */
router.delete(
  '/:id',
  authenticateJwt,
  requireRoles(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest({ params: articleIdParamsSchema }),
  controller.deleteArticle
);

export default router;
