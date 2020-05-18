import request from 'supertest'
import { app } from '../../app'

process.env.NODE_ENV = "test"
it("clears cookie after signout",
    async () => {
        await request(app)
            .post("/api/users/signup")
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201)

        var response = await request(app)
            .post("/api/users/signin")
            .send({
                email: 'test@test.com',
                password: 'password'
            }).expect(200)

        expect(response.get('Set-Cookie')).toBeDefined()


        response = await request(app)
            .post("/api/users/signout")
            .send({
            }).expect(200)

        expect(response.get('Set-Cookie')).toBeDefined()
    })
