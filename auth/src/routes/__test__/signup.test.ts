import request from 'supertest'
import { app } from '../../app'

it('returns 201 on successful signup', async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('returns 400 when sent invalid email', async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.c``om',
            password: 'password'
        })
        .expect(400)
})

it('returns 400 when sent password less than 4 chars', async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'pas'
        })
        .expect(400)
})

it('returns 400 when sent empty body', async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
        })
        .expect(400)
})

it('Sets a cookie after successful signup', async () => {

   const response =  await request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
})

it('returns 400 when creating duplicate account', async () => {

    await request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

