import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/tickets"
import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from "@averagecoders/common"
import { Message } from "node-nats-streaming"

const setup = async () => {
    // create listener instance
    const listener = new OrderCreatedListener(natsWrapper.client)
    // Create the ticket
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'Sherlocked Holmes',
        price: 200
    })
    // Save the ticket
    await ticket.save()
    // Create fake data object
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: 100
        }
    }
    // Create fake message obj
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }
}

it('sets the orderId of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup()
    await listener.onMessage(data,msg)

    const updateTicket = await Ticket.findById(ticket.id)

    expect(updateTicket?.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const { listener, data, msg, ticket } = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})
