import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedEvent } from "@averagecoders/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"


const setup = async () => {

    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    // create fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
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
    return { data, listener, message }
}

it('Creates and saves a ticket', async () => {

    // setup
    const { data, listener, message } = await setup()

    await listener.onMessage(data,message)
    // check for ticket created
    const ticket = await Ticket.findById(data.id)
    expect(ticket?.title).toEqual(data.title)
    expect(ticket?.price).toEqual(data.price)

})

it('Send Ack for message', async () => {

    // setup
    const { data, listener, message } = await setup()

    await listener.onMessage(data,message)
    // check for ack fn called
    expect(message.ack).toHaveBeenCalled()
})