import mongoose from 'mongoose'
import { Order, OrderStatus } from './orders'; 

interface TicketAttrs {
    title: string,
    price: number
}

export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    isReserved() : Promise<Boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(ticketAttrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function(){
    // this === the document that waas used to call this function
    const isExistingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    return !!isExistingOrder
}
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket } 