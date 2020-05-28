import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/orders'
import { OrderStatus } from '@averagecoders/common'
import { stripe } from '../../stripe'
jest.mock('../../stripe')

it('returns 404 when purchasing an order that does not exists', async () => {

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: mongoose.Types.ObjectId().toHexString(),
            token: "asdasd"
        })
        .expect(404)
})

it('returns 401 when purchasing an order that doesnot belong to current user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString()
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: order.id,
            token: "asdasd"
        })
        .expect(401)
})

it('returns 400 when purchasing an cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: userId
    })

    await order.save()

    order.set({ status: OrderStatus.Cancelled })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: "asdasd"
        })
        .expect(400)
})

it('returns a 204 with valid inputs', async () => {

    const userId = mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: userId
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: "tok_visa"
        })
        .expect(201)
    
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    console.log(chargeOptions)
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(2000)
    expect(chargeOptions.currency).toEqual('inr')

})