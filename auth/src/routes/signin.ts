import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import { validateRequest, BadRequestError } from '@averagecoders/common';
import { User } from '../models/users';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post("/api/users/signin", [
    body('email')
        .isEmail()
        .withMessage("Enter valid Email"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Enter valid password ")
], validateRequest,
    async (req: Request, res: Response) => {
        const { email, password} = req.body

        const existingUser = await User.findOne({ email })

        if(!existingUser) {
             throw new BadRequestError("Invalid email or password")
        }

        const passMatch = await Password.compareHash(existingUser.password,password)

        if(!passMatch) {
            throw new BadRequestError("Invalid email or password")
        }

        // Generate JWT and store it on session

        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, 'customkey')
        // replace this customkey with env variable on the kube machine
        // kubectl create secret generic jwt-secret --from-literal=jwtToken=customKeyToken
        req.session = { jwt: userJWT }

        res.status(200).send(existingUser)

    })

export { router as signinRouter };