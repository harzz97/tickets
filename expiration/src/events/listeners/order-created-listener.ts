import { Listener, OrderCreatedEvent, Subjects } from '@averagecoders/common'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'expiration-srv'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delayTime = new Date(data.expiresAt).getTime() - new Date().getTime()
        // add to expirationQueue
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delayTime
        }).catch(err => console.log("Error at addQueue ",err))

        // send ack msg
        msg.ack()
    }
}