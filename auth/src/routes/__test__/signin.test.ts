import request from 'supertest'
import { app } from '../../app'

it("status 400 when trying to login an account that doesn't exists",
    async () => {
        return await request(app)
            .post("/api/users/signin")
            .send({
                email: 'test@test.com',
                password: 'password'
            }).expect(400)
    })

it("status 400 when trying to login using invalid password",
    async () => {
        await request(app)
            .post("/api/users/signup")
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201)

        await request(app)
            .post("/api/users/signin")
            .send({
                email: 'test@test.com',
                password: 'passworddddd'
            }).expect(400)
    })

it("status 200 when using vlaid email and password",
    async () => {
        await request(app)
            .post("/api/users/signup")
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201)

        const response = await request(app)
            .post("/api/users/signin")
            .send({
                email: 'test@test.com',
                password: 'password'
            }).expect(200)
        
        expect(response.get('Set-Cookie')).toBeDefined()
    })