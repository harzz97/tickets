import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/users';
import { BadRequestError, validateRequest } from '@averagecoders/common';
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post("/api/users/signup", [
    body('email')
        .isEmail()
        .withMessage("Pls enter valid email"),
    body('password')
        .trim()
        .isLength({ min: 5, max: 10 })
        .withMessage("Password should be between 5 and 10 characters")
], validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            console.log("User Already exists")
            throw new BadRequestError('User Already exists')
        }

        const user = User.createUser({ email, password })
        await user.save()

        // Generate JWT and store it on session

        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, 'customkey')
        // replace this customkey with env variable on the kube machine
        // kubectl create secret generic jwt-secret --from-literal=jwtToken=customKeyToken
        req.session = { jwt: userJWT }
        res.status(201).send(user)
    })

export { router as signupRouter };