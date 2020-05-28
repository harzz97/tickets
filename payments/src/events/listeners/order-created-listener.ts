import { Listener, OrderCreatedEvent, Subjects } from "@averagecoders/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'payments-service'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const order = Order.build({
            id: data.id,
            userId: data.userId,
            version: data.version,
            status: data.status,
            price: data.ticket.price
        })

        await order.save()

        msg.ack()
    }
}