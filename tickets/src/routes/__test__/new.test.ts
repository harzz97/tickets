import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/tickets'
import { natsWrapper } from '../../nats-wrapper'


it('Has route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post("/api/tickets").send({})

    expect(response.status).not.toEqual(404)
})

it('Access only when signed in', async () => {
    await request(app).post("/api/tickets").send({}).expect(401)
})

it('returns status other than 401 when user is signed in', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post("/api/tickets")
        .set('Cookie', cookie)
        .send({})

    expect(response.status).not.toEqual(401)
})

it('return error when invalid title is provided', async () => {
    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: '', price: 100 })
        .expect(400)
})

it('return error when invalid price is provided', async () => {

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'hahahha', price: -100 })
        .expect(400)

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'hhhhh' })
        .expect(400)
})

it('create ticket when valid inputs are given', async () => {

    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'Holmes meetup', price: 100 })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
})

it('publishes an event',async () => {

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'Holmes meetup', price: 100 })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

})