import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { Listener, Subjects, TicketCreatedEvent } from '@averagecoders/common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'orders-service'

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price, id } = data
        const ticket = Ticket.build({
            title, price, id
        })
        await ticket.save()

        msg.ack()
    }
}