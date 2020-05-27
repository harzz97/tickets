import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/tickets"
import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus, OrderCancelledEvent } from "@averagecoders/common"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
    // create listener instance
    const listener = new OrderCancelledListener(natsWrapper.client)
    // create orderID
    const orderId = new mongoose.Types.ObjectId().toHexString()

    // Create the ticket
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'Sherlocked Holmes',
        price: 200
    })
    ticket.set({ orderId })
    // Save the ticket
    await ticket.save()
    // Create fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }
    // Create fake message obj
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket, orderId }
}

it('updates, publish the ticket', async () => {

    const { listener, data, msg, ticket, orderId } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket?.orderId).not.toBeDefined()

    expect(natsWrapper.client.publish).toHaveBeenCalled()

})

it('acks the message', async () => {
    const { listener, data, msg, ticket, orderId } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})