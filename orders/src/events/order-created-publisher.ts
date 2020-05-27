import { Publisher, OrderCreatedEvent, Subjects } from "@averagecoders/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    
}