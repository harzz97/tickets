import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Order } from "../../../models/orders"
import mongoose from 'mongoose'
import { OrderStatus, OrderCancelledEvent } from "@averagecoders/common"
import { Message } from "node-nats-streaming"
const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 10,
        version: 0,
        status: OrderStatus.Created
    })

    await order.save()

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, listener, order }
}

it('updates the status of order', async () => {
    const { data, msg, listener, order } = await setup()

    await listener.onMessage(data,msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('sends an ack msg', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})