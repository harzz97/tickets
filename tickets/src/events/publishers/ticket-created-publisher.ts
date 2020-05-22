import { Publisher, TicketCreatedEvent, Subjects } from "@averagecoders/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated

}