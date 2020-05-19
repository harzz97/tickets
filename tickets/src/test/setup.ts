import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[]
        }
    }
}

let mongo: any
beforeAll(async () => {
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = () => {

    // Custom payload 
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create JWT
    const token = jwt.sign(payload, "customkey")

    // Build session object
    const session = { jwt: token }

    // Convert session into JSON string
    const sessionJSON = JSON.stringify(session)

    // Base64 Encode the data
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // Return as cookie
    return [`express:sess=${base64}`]
}