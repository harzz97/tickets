import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if ticket not found', async () => {

    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send({})
        .expect(404)

})

it('returns ticket if found', async () => {

    const createTicket = await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'Hello Sherlock', price: 10 })
        .expect(201)

    const ticketID = createTicket.body.id

    const ticketResponse = await request(app)
        .get(`/api/tickets/${ticketID}`)
        .send()
        .expect(200)

    expect(ticketResponse.body.title).toEqual('Hello Sherlock')
    expect(ticketResponse.body.price).toEqual(10)

})