import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

interface payload {
    orderId: string
}

const expirationQueue = new Queue<payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log("ExpirationQueue expiration:complete for orderId", job.data.orderId)
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export { expirationQueue }