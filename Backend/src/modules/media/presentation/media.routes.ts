import { Router } from 'express';
import { z } from 'zod';
import { MediaController } from './media.controller.js';
import { authenticateJwt } from '../../../shared/presentation/middlewares/auth.middleware.js';
import { validateRequest } from '../../../shared/presentation/middlewares/validation.middleware.js';
import { publicApiRateLimiter } from '../../../shared/presentation/middlewares/rate-limiter.middleware.js';

const router = Router();
const controller = new MediaController();

const uploadBodySchema = z.object({
  fileName: z.string().min(1, 'fileName is required.'),
  mimeType: z.string().min(1, 'mimeType is required.'),
  base64Data: z.string().min(1, 'base64Data payload is required.'),
  folder: z.string().optional(),
});

/**
 * @openapi
 * /api/v1/media/presigned-url:
 *   get:
 *     summary: Generate an S3 presigned PUT URL for direct stateless client uploads
 *     tags:
 *       - Media & Object Storage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *           example: car-photo.jpg
 *       - in: query
 *         name: mimeType
 *         required: true
 *         schema:
 *           type: string
 *           example: image/jpeg
 *       - in: query
 *         name: folder
 *         required: false
 *         schema:
 *           type: string
 *           example: vehicles
 *     responses:
 *       200:
 *         description: Presigned S3 upload URL generated successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/presigned-url', authenticateJwt, controller.getPresignedUrl);

/**
 * @openapi
 * /api/v1/media/upload:
 *   post:
 *     summary: Stateless direct media upload to cloud object storage (S3/Cloud Storage)
 *     tags:
 *       - Media & Object Storage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - mimeType
 *               - base64Data
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: avatar.png
 *               mimeType:
 *                 type: string
 *                 example: image/png
 *               base64Data:
 *                 type: string
 *                 example: data:image/png;base64,iVBORw0KGgo...
 *               folder:
 *                 type: string
 *                 example: avatars
 *     responses:
 *       201:
 *         description: File uploaded to object storage successfully
 *       400:
 *         description: Invalid payload
 */
router.post('/upload', authenticateJwt, publicApiRateLimiter, validateRequest({ body: uploadBodySchema }), controller.uploadFile);

export default router;
