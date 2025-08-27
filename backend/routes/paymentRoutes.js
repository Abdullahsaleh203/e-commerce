import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCheckoutSession, checkoutSuccess } from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment processing with Stripe
 */

/**
 * @swagger
 * /api/v1/payment/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutSession'
 *           example:
 *             products:
 *               - product: "60f7b3b3b3b3b3b3b3b3b3b3"
 *                 quantity: 2
 *               - product: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                 quantity: 1
 *             couponCode: "SAVE10"
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       description: Stripe session ID
 *                     url:
 *                       type: string
 *                       description: Stripe checkout URL
 *       400:
 *         description: Invalid input data or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Stripe error or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/create-checkout-session", protect, createCheckoutSession);

/**
 * @swagger
 * /api/v1/payment/checkout-success:
 *   post:
 *     summary: Handle successful payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutSuccess'
 *           example:
 *             sessionId: "cs_test_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Payment successful, order created
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid session ID or payment failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/checkout-success", protect, checkoutSuccess);


export default router;
