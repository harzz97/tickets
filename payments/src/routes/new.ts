import express, { Router, Request, Response } from "express"
import { requireAuth, validateRequest, NotAuthorized, OrderStatus, BadRequestError, NotFoundError } from "@averagecoders/common"
import { body } from "express-validator"
import { Order } from "../models/orders"
import { stripe } from "../stripe"
import { Payment } from "../models/payments"
import { PaymentCreatedPublisher } from "../events/listeners/publishers/payment-created-publisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post("/api/payments",
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not().isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { orderId, token } = req.body

        const order = await Order.findById(orderId)

        console.log(order?.status)

        if (!order) {
            throw new NotFoundError()
        }

        if (order.userId !== req.currentUser.id) {
            throw new NotAuthorized()
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Trying to pay for cancelled order')
        }

        const stripeResponse = await stripe.charges.create({
            currency: 'inr',
            amount: order.price * 100,
            source: token,
            description: 'Simple test transaction'
        })

        const payment = Payment.build({
            orderId,
            stripeId: stripeResponse.id
        })

        await payment.save()

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            orderId: payment.orderId,
            stripeId: payment.stripeId,
            id: payment.id
        })
        res.status(201).send({ success: true, id: payment.id })
    })

export { router as createChargeRouter }