import { Publisher, Subjects, TicketUpdatedEvent } from "@averagecoders/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}