import { Publisher, PaymentCreatedEvent, Subjects } from "@averagecoders/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}