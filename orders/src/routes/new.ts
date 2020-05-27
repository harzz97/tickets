import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@averagecoders/common'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/orders'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post("/api/orders", requireAuth,
    [
        body('ticketId')
            .not().isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    ],
    validateRequest
    , async (req: Request, res: Response) => {
        const { ticketId } = req.body
        // Find the ticket the user if trying to order 
        const ticket = await Ticket.findById(ticketId)

        if (!ticket) {
            throw new NotFoundError()
        }

        // Make sure the ticket is available
        const isReserved = await ticket.isReserved()
        if (isReserved) {
            throw new BadRequestError('Ticket reserved already')
        }

        // Calculate the expiryAt time for 15 seconds
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + 60)

        // Build the order and save it to database
        const order = Order.build({
            userId: req.currentUser.id,
            status: OrderStatus.Created,
            expiresAt: expiresAt,
            ticket
        })

        await order.save()
        // Emit event for order created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price
            }

        })


        res.status(201).send(order)

    })

export { router as newOrderRouter }