import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
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
        console.log(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
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
        // add the listeners
        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Payments connected to mongoose")
    } catch (err) {
        console.log("Mongo error", err)
    }

}

app.listen(PORT, () => { console.log(`Payments Service listening on ${PORT} `) })

start()