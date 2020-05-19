import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@averagecoders/common'
import { body } from 'express-validator'
import { Ticket } from '../models/tickets'
const router = express.Router()

router.post('/api/tickets', requireAuth, [
    body('title')
        .not().isEmpty()
        .withMessage("Pls enter valid title"),
    body('price')
        .not().isEmpty()
        .isFloat({ gt: 0 })
        .withMessage("Pls enter valid price")
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    })
    await ticket.save()

    res.status(201).send(ticket)
})

export { router as createTicketRouter }