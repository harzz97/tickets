import { Publisher, Subjects, OrderCancelledEvent } from "@averagecoders/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}