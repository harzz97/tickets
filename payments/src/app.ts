import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session'
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentuser } from '@averagecoders/common';
import { createChargeRouter } from './routes/new';

const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: false //change it to true later
}))

app.use(currentuser)

app.use(createChargeRouter)

app.all("*",async (req) => {
    console.log(req.url)
    throw new NotFoundError()
})
//Error Handler
app.use(errorHandler)

export { app } 