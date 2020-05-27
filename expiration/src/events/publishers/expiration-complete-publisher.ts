import { Publisher, ExpirationCompleteEvent, Subjects } from "@averagecoders/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}