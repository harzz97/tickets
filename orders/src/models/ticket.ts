import mongoose from 'mongoose'
import { Order, OrderStatus } from './orders';
import 'mongoose-update-if-current'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface TicketAttrs {
    title: string,
    price: number,
    id: string
}

export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    version: number;
    isReserved(): Promise<Boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(ticketAttrs: TicketAttrs): TicketDoc;
    findTicket(event: { id: string, version: number }): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.statics.findTicket = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

ticketSchema.methods.isReserved = async function () {
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