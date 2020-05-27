import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from "@averagecoders/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"


const setup = async () => {

    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Sherlocked',
        price: 100
    })
    // Save ticket
    await ticket.save()

    // create fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'Sherlock Holmes',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    // call on message fn with data ad message obj
    return { data, listener, message, ticket }
}

it('Finds and updates the ticket', async () => {

    // setup
    const { data, listener, message, ticket } = await setup()

    await listener.onMessage(data, message)
    // check for ticket created
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.id).toEqual(ticket.id)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)

})

it('Send Ack for message', async () => {

    // setup
    const { data, listener, message } = await setup()

    await listener.onMessage(data, message)
    // check for ack fn called
    expect(message.ack).toHaveBeenCalled()
})

it('ack shld not be called when version number is missing', async () => {
   // setup
   const { data, listener, message, ticket } = await setup()
    
   data.version = 10

   try {
       await listener.onMessage(data,message)
   } catch (error) {
       return 
   }

   expect(message.ack).not.toHaveBeenCalled()
})