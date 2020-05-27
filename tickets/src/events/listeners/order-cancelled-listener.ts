import { Listener, Subjects, OrderCancelledEvent } from "@averagecoders/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/tickets-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {

    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = "tickets-service"

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        // find the ticket
        const ticket = await Ticket.findById(data.ticket.id)

        // if ticket doesn't exists 
        if (!ticket) {
            throw new Error('Ticket does not exists')
        }

        // update the ticket
        ticket.set({ orderId: undefined })

        //save the ticket
        await ticket.save()

        // publish the ticket updated event
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            userId: ticket.userId
        })
        
        // send msg ack
        msg.ack()

    }
}