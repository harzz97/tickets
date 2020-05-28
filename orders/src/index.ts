import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'
const PORT = 3000
const start = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI should be defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID should be defined")
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL should be defined")
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID should be defined")
    }

    try {
        console.log(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL,
            )
        natsWrapper.client.on('close', () => {
            console.log("NATS Connection closed")
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        // Listeners for TicketCreated and TicketUpdated
        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Orders connected to mongoose")
    } catch (err) {
        console.log("Mongo error", err)
    }

}

app.listen(PORT, () => { console.log(`Orders Service listening on ${PORT} `) })
  
start()