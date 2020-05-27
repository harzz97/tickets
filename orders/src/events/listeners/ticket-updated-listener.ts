import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { Listener, Subjects, TicketUpdatedEvent, NotFoundError } from '@averagecoders/common'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = 'orders-service'

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findTicket(data)

        if (!ticket) {
            throw new NotFoundError()
        }

        const { title, price } = data
        ticket.set({ title: title, price: price })
        await ticket.save()

        msg.ack()
    }
}