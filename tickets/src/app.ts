import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session'
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@averagecoders/common';

const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))


app.all("*",async (req) => {
    console.log(req.url)
    throw new NotFoundError()
})
//Error Handler
app.use(errorHandler)

export { app } 