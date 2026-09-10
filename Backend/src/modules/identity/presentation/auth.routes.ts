import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../../shared/presentation/middlewares/auth.middleware.js';
import { validateRequest } from '../../../shared/presentation/middlewares/validation.middleware.js';
import { authRateLimiter } from '../../../shared/presentation/middlewares/rate-limiter.middleware.js';

const router = Router();
const controller = new AuthController();

// Validation Schemas
const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address format.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  name: z.string().optional(),
  country: z.string().optional(),
  preferredCurrency: z.string().optional(),
  preferredLang: z.enum(['EN', 'AR']).optional(),
  measurementSystem: z.enum(['METRIC', 'IMPERIAL']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address format.'),
  password: z.string().min(1, 'Password is required.'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required.'),
});

const googleAuthSchema = z.object({
  email: z.string().email('Valid email address is required.'),
  name: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
  idToken: z.string().optional(),
});

const updatePreferencesSchema = z.object({
  preferredCurrency: z.string().optional(),
  preferredLang: z.enum(['EN', 'AR']).optional(),
  measurementSystem: z.enum(['METRIC', 'IMPERIAL']).optional(),
});

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
router.post('/register', authRateLimiter, validateRequest({ body: registerSchema }), controller.register);

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
router.post('/login', authRateLimiter, validateRequest({ body: loginSchema }), controller.login);

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
router.post('/refresh', authRateLimiter, validateRequest({ body: refreshSchema }), controller.refresh);

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
router.patch('/preferences', authenticateJwt, validateRequest({ body: updatePreferencesSchema }), controller.updatePreferences);

/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     summary: Authenticate or register using Google OAuth
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
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google login successful
 *       400:
 *         description: Invalid Google credentials
 */
router.post('/google', authRateLimiter, validateRequest({ body: googleAuthSchema }), controller.googleLogin);

export default router;
