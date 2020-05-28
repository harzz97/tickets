import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from "@averagecoders/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = "payments-service"

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const order = await Order.findOne({
            _id: data.id
            // version: data.version
        })

        if(!order){
            throw new Error('No order')
        }

        order.set({ status: OrderStatus.Cancelled})

        await order.save()

        msg.ack()
    }
}