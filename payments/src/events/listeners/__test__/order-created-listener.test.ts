import mongoose from 'mongoose'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/orders'
import { OrderCancelledEvent, OrderStatus, OrderCreatedEvent } from '@averagecoders/common'

const setup = async () => {
    // create listener instance
    const listener = new OrderCreatedListener(natsWrapper.client)

    // Create fake data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: new Date().toISOString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
            price: 100
        }
    }
    // Create fake message obj
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order?.price).toEqual(data.ticket.price)

})

it('sends ack messsage', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})