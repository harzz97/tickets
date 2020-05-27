import { Listener, Subjects, OrderCreatedEvent, NotFoundError } from "@averagecoders/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = "tickets-service"

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        // Find the ticket the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)

        // If no ticket then throw error
        if(!ticket){
            throw new Error('Ticket not found')
        }

        // Mark ticket as reserved
        ticket.set({orderId: data.id})

        // Save the ticket
        await ticket.save()

        // Publish the event 
        
        // Send ack message
        msg.ack()
    }
}