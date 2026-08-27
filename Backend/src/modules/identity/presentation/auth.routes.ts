import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../../shared/presentation/middlewares/auth.middleware.js';

const router = Router();
const controller = new AuthController();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Identity & Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: buyer@autoversus.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *               name:
 *                 type: string
 *                 example: Ahmed Hassan
 *               country:
 *                 type: string
 *                 example: EG
 *               preferredCurrency:
 *                 type: string
 *                 example: EGP
 *               preferredLang:
 *                 type: string
 *                 enum: [EN, AR]
 *                 example: EN
 *               measurementSystem:
 *                 type: string
 *                 enum: [METRIC, IMPERIAL]
 *                 example: METRIC
 *     responses:
 *       201:
 *         description: Account successfully registered with JWT tokens
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
router.post('/register', controller.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user credentials & issue JWT tokens
 *     tags:
 *       - Identity & Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: buyer@autoversus.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', controller.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags:
 *       - Identity & Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens successfully refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', controller.refresh);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get profile of currently authenticated user
 *     tags:
 *       - Identity & Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile data
 *       401:
 *         description: Unauthorized / Token missing or invalid
 */
router.get('/me', authenticateJwt, controller.getMe);

/**
 * @openapi
 * /api/v1/auth/preferences:
 *   patch:
 *     summary: Update language, currency, and measurement preferences
 *     tags:
 *       - Identity & Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredCurrency:
 *                 type: string
 *                 example: EGP
 *               preferredLang:
 *                 type: string
 *                 enum: [EN, AR]
 *                 example: AR
 *               measurementSystem:
 *                 type: string
 *                 enum: [METRIC, IMPERIAL]
 *                 example: METRIC
 *     responses:
 *       200:
 *         description: Updated user profile
 *       401:
 *         description: Unauthorized
 */
router.patch('/preferences', authenticateJwt, controller.updatePreferences);

export default router;
