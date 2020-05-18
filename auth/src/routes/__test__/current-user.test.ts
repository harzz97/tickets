import request from 'supertest'
import { app } from '../../app'

it("Check response for current user",
    async () => {
       
        const cookie = await global.signin()
        const currentUser = await request(app)
            .get("/api/users/currentuser")
            .set('Cookie', cookie)
            .send()
            .expect(200)
        console.log(currentUser.body)

        expect(currentUser.body.currentUser.email).toEqual('test@test.com')
    })

it("responds with null when unauth",
    async () => {
       
        const currentUser = await request(app)
            .get("/api/users/currentuser")
            .send()
            .expect(200)
        
            console.log(currentUser.body)

        expect(currentUser.body.currentUser).toEqual(null)
    })