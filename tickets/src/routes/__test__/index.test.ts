import request from 'supertest'
import { app } from '../../app'

it('retrieve list of tickets', async () => {

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'Sherlock Holmes', price: 10 })
        

    await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({ title: 'Blacksheep Soap opera', price: 10 })
       

    
    const response = await request(app).get("/api/tickets").send().expect(200)

    expect(response.body.length).toEqual(2)


})