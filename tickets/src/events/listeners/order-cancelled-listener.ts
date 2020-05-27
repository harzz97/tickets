import { Listener, Subjects, OrderCancelledEvent } from "@averagecoders/common";
import { Message } from "node-nats-streaming";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {

    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = "tickets-service"

    onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    }
}