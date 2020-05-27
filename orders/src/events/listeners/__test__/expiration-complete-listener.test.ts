import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { ExpirationCompleteEvent, OrderStatus } from "@averagecoders/common"
import { Order } from "../../../models/orders"


const setup = async () => {

    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    // create and save ticket
    const ticket = Ticket.build({
        title: "Sherlocked",
        price: 120,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    // save the ticket
    await ticket.save()
    // create a order 
    const order = Order.build({
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket,
        userId: new mongoose.Types.ObjectId().toHexString()
    })
    // save the order
    await order.save()
    // create fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    // call on message fn with data ad message obj
    return { data, listener, message, order }
}

it('updates the status to order cancelled', async () => {
    const { data, listener, message, order } = await setup()

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an ordercancelled event', async () => {
    const { data, listener, message, order } = await setup()

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)

})

it('sends ack msg', async () => {
    const { data, listener, message } = await setup()

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled()
})