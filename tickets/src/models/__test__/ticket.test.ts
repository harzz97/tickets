import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async (done) => {
    // Create an instance of ticket
    const ticket = Ticket.build({
        title: 'Sherlock Holmes',
        price: 100,
        userId: '123abc'
    })
    // Save the ticke to database
    await ticket.save()
    // Fetch the ticket twice 
    const ticketOne = await Ticket.findById(ticket.id)
    const ticketTwo = await Ticket.findById(ticket.id)
    // make changes to the tickets
    ticketOne!.set({ title: 'Sherlock Holmes and Mr.Watson', price: 10 })
    ticketOne!.set({ title: 'Sherlock Holmes & Mr.Watson', price: 123 })
    // save the first ticket
    await ticketOne?.save()
    // save the second ticket and it should fail 
    try {
        await ticketTwo?.save()
    } catch (error) {
        console.log(error)
        return done();
    }

    throw new Error("Should not reach this point")

})

it("version number increments on multiple saves", async () => {
    // Create an instance of ticket
    const ticket = Ticket.build({
        title: 'Sherlock Holmes',
        price: 100,
        userId: '123abc'
    })

    // Save the ticket
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)

})